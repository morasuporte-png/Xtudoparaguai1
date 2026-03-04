import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { createClient } from '@supabase/supabase-js';
import { sendOrderConfirmation } from './email';

// Cliente do MP (servidor)
const mpClient = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!,
});

// Cliente Supabase (service role para acesso admin)
const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY ?? process.env.VITE_SUPABASE_ANON_KEY!
);

// ── Utilitário: log de eventos de pedido ──────────────────────────────────────
async function logOrderEvent(params: {
    order_id: string;
    event_type: string;
    payload?: Record<string, unknown>;
    success?: boolean;
    error_message?: string;
}): Promise<void> {
    const { error } = await supabase.from('order_events').insert({
        order_id: params.order_id,
        event_type: params.event_type,
        payload: params.payload ?? {},
        success: params.success ?? true,
        error_message: params.error_message ?? null,
    });
    if (error) console.error('[webhook] logOrderEvent error:', error);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Receber notificação do MP — os query params podem ser string | string[]
    const rawType = req.query['type'];
    const rawDataId = (req.query['data'] as any)?.id ?? req.query['data.id'];

    const type = Array.isArray(rawType) ? rawType[0] : rawType;
    const paymentId = Array.isArray(rawDataId) ? rawDataId[0] : String(rawDataId ?? '');

    // MP envia notificações do tipo "payment"
    if (type !== 'payment' || !paymentId) {
        return res.status(200).json({ received: true });
    }

    try {
        const paymentApi = new Payment(mpClient);
        const payment = await paymentApi.get({ id: paymentId });

        const { status, external_reference } = payment;

        console.log(`[webhook] payment ${paymentId} status=${status}`);

        // ── Pagamento APROVADO ─────────────────────────────────────────────────
        if (status === 'approved' && external_reference) {
            // external_reference tem o formato "order_id::buyer_id"
            const [orderId] = external_reference.split('::');

            if (orderId) {
                // 1. Marcar pedido como pago — usando payment_status + order_status
                const { data: orderData, error } = await supabase
                    .from('orders')
                    .update({
                        status: 'paid',                     // legacy (backcompat)
                        payment_status: 'payment_approved', // novo campo
                        order_status: 'confirmed',          // novo campo
                        updated_at: new Date().toISOString(),
                    })
                    .eq('id', orderId)
                    .select(`
                        id, total_brl, payment_method,
                        profiles(full_name),
                        order_items(title, quantity, unit_price, image_url)
                    `)
                    .single();

                if (error) {
                    console.error('[webhook] supabase update error:', error);
                    // Log do erro de atualização
                    await logOrderEvent({
                        order_id: orderId,
                        event_type: 'PAYMENT_APPROVED',
                        success: false,
                        error_message: error.message,
                        payload: { payment_id: paymentId },
                    });
                } else {
                    console.log(`[webhook] order ${orderId} marcado como PAGO.`);

                    // 2. Log: PAYMENT_APPROVED
                    await logOrderEvent({
                        order_id: orderId,
                        event_type: 'PAYMENT_APPROVED',
                        payload: {
                            payment_id: paymentId,
                            amount: payment.transaction_amount,
                            payment_method: (payment as any).payment_type_id ?? 'pix',
                            mp_status: status,
                        },
                    });

                    // 3. Buscar dados do comprador para enviar o email
                    const buyerEmail = (payment.payer as any)?.email;
                    const buyerName = (orderData as any)?.profiles?.full_name ?? 'Cliente';

                    if (buyerEmail) {
                        const items = (orderData as any)?.order_items ?? [];
                        const itemsSummary = items.map((i: any) => `• ${i.quantity}x ${i.title}`).join('\n');
                        const total = (orderData as any)?.total_brl ?? 0;
                        const waText = encodeURIComponent(
                            `✅ Pedido *#${orderId.slice(0, 8)}* confirmado na XTUDO Paraguai!\n\n` +
                            `*Itens:*\n${itemsSummary}\n\n` +
                            `*Total:* R$ ${Number(total).toFixed(2)}\n\n` +
                            `Acompanhe seu pedido: https://xtudoparaguai.com/#customer`
                        );
                        const whatsappLink = `https://wa.me/?text=${waText}`;

                        try {
                            await sendOrderConfirmation({
                                to: buyerEmail,
                                order_id: orderId,
                                buyer_name: buyerName,
                                items,
                                total,
                                payment_method: (orderData as any)?.payment_method ?? 'pix',
                                address: 'Consulte seus dados de entrega no portal do cliente.',
                                whatsapp_link: whatsappLink,
                            });

                            // 4. Log: EMAIL_SENT
                            await logOrderEvent({
                                order_id: orderId,
                                event_type: 'EMAIL_SENT',
                                payload: { to: buyerEmail, buyer_name: buyerName },
                            });

                        } catch (emailErr: any) {
                            console.error('[webhook] email send error:', emailErr);
                            await logOrderEvent({
                                order_id: orderId,
                                event_type: 'EMAIL_SENT',
                                success: false,
                                error_message: emailErr?.message ?? 'Unknown error',
                                payload: { to: buyerEmail },
                            });
                        }
                    }
                }
            }
        }

        // ── Pagamento FALHOU ───────────────────────────────────────────────────
        if (['rejected', 'cancelled', 'refunded'].includes(status ?? '') && external_reference) {
            const [orderId] = external_reference.split('::');
            if (orderId) {
                await supabase.from('orders').update({
                    payment_status: status === 'refunded' ? 'refunded' : 'payment_failed',
                    order_status: 'cancelled',
                    status: 'cancelled',
                    updated_at: new Date().toISOString(),
                }).eq('id', orderId);

                await logOrderEvent({
                    order_id: orderId,
                    event_type: 'PAYMENT_FAILED',
                    success: false,
                    payload: { payment_id: paymentId, mp_status: status },
                });

                console.log(`[webhook] order ${orderId} pagamento FALHOU (${status}).`);
            }
        }

        return res.status(200).json({ received: true });
    } catch (err: any) {
        console.error('[webhook] error:', err);
        return res.status(500).json({ error: err?.message });
    }
}
