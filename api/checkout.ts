import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MercadoPagoConfig, Payment } from 'mercadopago';

// Inicializa o cliente do Mercado Pago com o Access Token
const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!,
});

interface CheckoutBody {
    items: { title: string; unit_price: number; quantity: number; picture_url?: string }[];
    payer: { name: string; email: string; identification?: { type: string; number: string } };
    payment_method: 'pix' | 'credit_card' | 'boleto';
    total: number;
    description?: string;
    external_reference?: string; // order_id::buyer_id — vínculo com a order do Supabase
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const body = req.body as CheckoutBody;
        const { items, payer, payment_method, total, external_reference } = body;

        // Monta o objeto de identificação apenas se CPF for válido (11 dígitos)
        const cpfClean = (payer.identification?.number ?? '').replace(/\D/g, '');
        const identification = cpfClean.length === 11
            ? { type: 'CPF', number: cpfClean }
            : undefined;

        const baseUrl = process.env.APP_URL
            ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://xtudoparaguai.com');

        // ── PIX ──────────────────────────────────────────────────────────────
        if (payment_method === 'pix') {
            const paymentApi = new Payment(client);
            const response = await paymentApi.create({
                body: {
                    transaction_amount: Number(total),
                    description: items.map(i => i.title).join(', ').slice(0, 200),
                    payment_method_id: 'pix',
                    external_reference: external_reference ?? '',  // ← vínculo com o pedido
                    payer: {
                        email: payer.email || 'cliente@xtudo.com',
                        first_name: payer.name.split(' ')[0] || 'Cliente',
                        last_name: payer.name.split(' ').slice(1).join(' ') || 'XTUDO',
                        ...(identification ? { identification } : {}),
                    },
                    notification_url: `${baseUrl}/api/webhook`,
                },
            });

            const qrCode = response.point_of_interaction?.transaction_data?.qr_code;
            const qrBase64 = response.point_of_interaction?.transaction_data?.qr_code_base64;
            const ticketUrl = response.point_of_interaction?.transaction_data?.ticket_url;

            console.log(`[checkout] PIX criado: id=${response.id} status=${response.status} order=${external_reference}`);

            return res.status(200).json({
                payment_id: response.id,
                status: response.status,
                qr_code: qrCode,
                qr_code_base64: qrBase64,
                ticket_url: ticketUrl,
            });
        }

        // ── BOLETO ───────────────────────────────────────────────────────────
        if (payment_method === 'boleto') {
            const paymentApi = new Payment(client);
            const response = await paymentApi.create({
                body: {
                    transaction_amount: Number(total),
                    description: items.map(i => i.title).join(', ').slice(0, 200),
                    payment_method_id: 'bolbradesco',
                    external_reference: external_reference ?? '',
                    payer: {
                        email: payer.email || 'cliente@xtudo.com',
                        first_name: payer.name.split(' ')[0] || 'Cliente',
                        last_name: payer.name.split(' ').slice(1).join(' ') || 'XTUDO',
                        ...(identification ? { identification } : {}),
                    },
                    notification_url: `${baseUrl}/api/webhook`,
                },
            });

            return res.status(200).json({
                payment_id: response.id,
                status: response.status,
                barcode: (response as any).barcode?.content,
                ticket_url: response.transaction_details?.external_resource_url,
            });
        }

        // ── CARTÃO (Checkout Pro) ─────────────────────────────────────────────
        const { Preference } = await import('mercadopago');
        const preference = new Preference(client);
        const response = await preference.create({
            body: {
                external_reference: external_reference ?? '',
                items: items.map((i, idx) => ({
                    id: String(idx),
                    title: i.title,
                    unit_price: i.unit_price,
                    quantity: i.quantity,
                    picture_url: i.picture_url,
                    currency_id: 'BRL',
                })),
                payer: {
                    email: payer.email || 'cliente@xtudo.com',
                    name: payer.name || 'Cliente XTUDO',
                    ...(identification ? { identification } : {}),
                },
                payment_methods: {
                    excluded_payment_types: [{ id: 'ticket' }, { id: 'bank_transfer' }],
                },
                back_urls: {
                    success: `${baseUrl}/#order-success`,
                    failure: `${baseUrl}/#checkout`,
                    pending: `${baseUrl}/#order-success`,
                },
                auto_return: 'approved',
                notification_url: `${baseUrl}/api/webhook`,
            },
        });

        return res.status(200).json({
            preference_id: response.id,
            init_point: response.init_point,
            sandbox_init_point: response.sandbox_init_point,
        });

    } catch (err: any) {
        // Extrai o detalhe do erro do MP em vários formatos possíveis
        const mpDetail =
            err?.cause?.[0]?.description
            ?? err?.cause?.[0]?.message
            ?? err?.cause?.description
            ?? err?.response?.data?.message
            ?? err?.message
            ?? 'Erro desconhecido';

        const fullErr = {
            message: err?.message,
            status: err?.status,
            cause: err?.cause,
            errorResponse: err?.errorResponse ?? err?.response?.data,
        };

        console.error('[/api/checkout] FULL ERROR:', JSON.stringify(fullErr, null, 2));

        return res.status(500).json({
            error: 'Erro ao criar pagamento',
            detail: mpDetail,
            debug: fullErr,   // remover em produção quando o bug for resolvido
        });
    }
}
