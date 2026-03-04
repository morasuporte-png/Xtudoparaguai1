import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// ── Supabase service role (admin access) ─────────────────────────────────────
const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY ?? process.env.VITE_SUPABASE_ANON_KEY!
);

// ── Delays progressivos de retry (em segundos) ───────────────────────────────
// 0s → 1m → 5m → 15m → 1h
const RETRY_DELAYS = [0, 60, 300, 900, 3600];

// ── Registrar evento de pedido ────────────────────────────────────────────────
async function logOrderEvent(params: {
    order_id: string;
    event_type: string;
    payload?: Record<string, unknown>;
    success?: boolean;
    error_message?: string;
}): Promise<void> {
    await supabase.from('order_events').insert({
        order_id: params.order_id,
        event_type: params.event_type,
        payload: params.payload ?? {},
        success: params.success ?? true,
        error_message: params.error_message ?? null,
    });
}

// ── Processar um job por tipo ─────────────────────────────────────────────────
async function processJob(job: {
    id: string;
    job_type: string;
    payload: Record<string, unknown>;
    attempts: number;
}): Promise<void> {
    const { job_type, payload } = job;

    switch (job_type) {

        case 'SEND_TO_SUPPLIER': {
            const order_id = payload.order_id as string;
            if (!order_id) throw new Error('SEND_TO_SUPPLIER: order_id ausente no payload');

            // Buscar dados completos do pedido + itens
            const { data: order, error: orderErr } = await supabase
                .from('orders')
                .select(`
                    id, total_brl, order_status,
                    order_items (product_id, title, quantity, unit_price,
                        products (supplier_id, supplier_product_id,
                            suppliers (id, name, api_url, api_key, active)
                        )
                    )
                `)
                .eq('id', order_id)
                .single();

            if (orderErr || !order) {
                throw new Error(`Pedido ${order_id} não encontrado: ${orderErr?.message}`);
            }

            // Buscar fornecedor do primeiro item
            const firstItem = (order as any).order_items?.[0];
            const supplier = firstItem?.products?.suppliers;

            if (!supplier || !supplier.active) {
                // Sem fornecedor configurado — marcar pedido como pronto para envio manual
                await supabase.from('orders').update({
                    order_status: 'awaiting_tracking',
                    updated_at: new Date().toISOString(),
                }).eq('id', order_id);

                await logOrderEvent({
                    order_id,
                    event_type: 'SENT_TO_SUPPLIER',
                    payload: { note: 'Sem fornecedor API configurado — aguardando envio manual' },
                });
                return;
            }

            // Chamar API do fornecedor
            const response = await fetch(`${supplier.api_url}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${supplier.api_key}`,
                },
                body: JSON.stringify({
                    external_order_id: order_id,
                    items: (order as any).order_items.map((i: any) => ({
                        supplier_product_id: i.products?.supplier_product_id,
                        quantity: i.quantity,
                        unit_price: i.unit_price,
                    })),
                    total: (order as any).total_brl,
                }),
                signal: AbortSignal.timeout(15000), // 15s timeout
            });

            if (!response.ok) {
                const body = await response.text().catch(() => '');
                throw new Error(`Supplier API error ${response.status}: ${body}`);
            }

            const supplierResponse = await response.json();

            // Atualizar status do pedido
            await supabase.from('orders').update({
                order_status: 'supplier_processing',
                updated_at: new Date().toISOString(),
            }).eq('id', order_id);

            await logOrderEvent({
                order_id,
                event_type: 'SENT_TO_SUPPLIER',
                payload: {
                    supplier_name: supplier.name,
                    supplier_order_id: supplierResponse?.id ?? supplierResponse?.order_id,
                    response_status: response.status,
                },
            });

            console.log(`[worker] SEND_TO_SUPPLIER sucesso para pedido ${order_id}`);
            break;
        }

        default:
            throw new Error(`Tipo de job desconhecido: ${job_type}`);
    }
}

// ── Handler principal do Cron ─────────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Segurança: verificar CRON_SECRET em produção
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && req.headers['authorization'] !== `Bearer ${cronSecret}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        // Buscar até 5 jobs pendentes prontos para rodar (run_at <= now)
        const { data: jobs, error: fetchErr } = await supabase
            .from('job_queue')
            .select('id, job_type, payload, attempts, max_attempts')
            .eq('status', 'pending')
            .lte('run_at', new Date().toISOString())
            .order('created_at', { ascending: true })
            .limit(5);

        if (fetchErr) {
            console.error('[worker] fetch jobs error:', fetchErr);
            return res.status(500).json({ error: fetchErr.message });
        }

        if (!jobs || jobs.length === 0) {
            return res.status(200).json({ processed: 0, message: 'Nenhum job pendente' });
        }

        const results: { id: string; status: string; error?: string }[] = [];

        for (const job of jobs) {
            // Marcar como 'processing' (evita processamento duplo)
            const { error: lockErr } = await supabase
                .from('job_queue')
                .update({ status: 'processing', updated_at: new Date().toISOString() })
                .eq('id', job.id)
                .eq('status', 'pending'); // double-check: só atualiza se ainda pending

            if (lockErr) {
                console.warn(`[worker] job ${job.id} não pôde ser bloqueado, pulando.`);
                continue;
            }

            try {
                await processJob(job as any);

                // ✅ Sucesso
                await supabase.from('job_queue').update({
                    status: 'completed',
                    updated_at: new Date().toISOString(),
                }).eq('id', job.id);

                results.push({ id: job.id, status: 'completed' });
                console.log(`[worker] job ${job.id} (${job.job_type}) → completed`);

            } catch (err: any) {
                const errorMessage = err?.message ?? 'Erro desconhecido';
                const newAttempts = job.attempts + 1;
                const hasMoreRetries = newAttempts < job.max_attempts;

                if (hasMoreRetries) {
                    // 🔁 Retry — agendar próxima tentativa com delay progressivo
                    const delaySeconds = RETRY_DELAYS[newAttempts] ?? 3600;
                    const nextRunAt = new Date(Date.now() + delaySeconds * 1000).toISOString();

                    await supabase.from('job_queue').update({
                        status: 'pending',
                        attempts: newAttempts,
                        last_error: errorMessage,
                        run_at: nextRunAt,
                        updated_at: new Date().toISOString(),
                    }).eq('id', job.id);

                    console.warn(
                        `[worker] job ${job.id} falhou (tentativa ${newAttempts}/${job.max_attempts}). ` +
                        `Retry em ${delaySeconds}s. Erro: ${errorMessage}`
                    );
                    results.push({ id: job.id, status: `retry_${newAttempts}`, error: errorMessage });

                } else {
                    // ❌ Esgotou tentativas → marcar como failed
                    await supabase.from('job_queue').update({
                        status: 'failed',
                        attempts: newAttempts,
                        last_error: errorMessage,
                        updated_at: new Date().toISOString(),
                    }).eq('id', job.id);

                    // Registrar falha no log de auditoria do pedido
                    const orderId = (job.payload as any)?.order_id;
                    if (orderId) {
                        await logOrderEvent({
                            order_id: orderId,
                            event_type: 'ERROR',
                            success: false,
                            error_message: errorMessage,
                            payload: { job_id: job.id, job_type: job.job_type, attempts: newAttempts },
                        });

                        // Marcar pedido como failed
                        await supabase.from('orders').update({
                            order_status: 'failed',
                            updated_at: new Date().toISOString(),
                        }).eq('id', orderId);
                    }

                    console.error(
                        `[worker] job ${job.id} FALHOU DEFINITIVAMENTE após ${newAttempts} tentativas. ` +
                        `Erro: ${errorMessage}`
                    );
                    results.push({ id: job.id, status: 'failed', error: errorMessage });
                }
            }
        }

        return res.status(200).json({ processed: results.length, results });

    } catch (err: any) {
        console.error('[worker] erro inesperado:', err);
        return res.status(500).json({ error: err?.message });
    }
}
