import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MercadoPagoConfig, Payment, PreApproval } from 'mercadopago';

// Inicializa o cliente do Mercado Pago com o Access Token
const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!,
});

interface CheckoutBody {
    items: { title: string; unit_price: number; quantity: number; picture_url?: string }[];
    payer: { name: string; email: string; identification: { type: string; number: string } };
    payment_method: 'pix' | 'credit_card' | 'boleto';
    total: number;
    description?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Apenas POST é aceito
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const body = req.body as CheckoutBody;
        const { items, payer, payment_method, total } = body;

        // ── PIX ──────────────────────────────────────────────────────────
        if (payment_method === 'pix') {
            const payment = new Payment(client);
            const response = await payment.create({
                body: {
                    transaction_amount: total,
                    description: items.map(i => i.title).join(', ').slice(0, 200),
                    payment_method_id: 'pix',
                    payer: {
                        email: payer.email,
                        first_name: payer.name.split(' ')[0],
                        last_name: payer.name.split(' ').slice(1).join(' '),
                        identification: payer.identification,
                    },
                    notification_url: `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.APP_URL}/api/webhook`,
                },
            });

            return res.status(200).json({
                payment_id: response.id,
                status: response.status,
                qr_code: response.point_of_interaction?.transaction_data?.qr_code,
                qr_code_base64: response.point_of_interaction?.transaction_data?.qr_code_base64,
                ticket_url: response.point_of_interaction?.transaction_data?.ticket_url,
            });
        }

        // ── BOLETO ───────────────────────────────────────────────────────
        if (payment_method === 'boleto') {
            const payment = new Payment(client);
            const response = await payment.create({
                body: {
                    transaction_amount: total,
                    description: items.map(i => i.title).join(', ').slice(0, 200),
                    payment_method_id: 'bolbradesco',
                    payer: {
                        email: payer.email,
                        first_name: payer.name.split(' ')[0],
                        last_name: payer.name.split(' ').slice(1).join(' '),
                        identification: payer.identification,
                    },
                },
            });

            return res.status(200).json({
                payment_id: response.id,
                status: response.status,
                barcode: response.barcode?.content,
                ticket_url: response.transaction_details?.external_resource_url,
            });
        }

        // ── CARTÃO (Checkout Pro / redirect) ─────────────────────────────
        // Para cartão usamos Checkout Pro com redirect. O frontend recebe o init_point URL.
        const { Preference } = await import('mercadopago');
        const preference = new Preference(client);
        const response = await preference.create({
            body: {
                items: items.map(i => ({
                    title: i.title,
                    unit_price: i.unit_price,
                    quantity: i.quantity,
                    picture_url: i.picture_url,
                    currency_id: 'BRL',
                })),
                payer: {
                    email: payer.email,
                    name: payer.name,
                    identification: payer.identification,
                },
                payment_methods: { excluded_payment_types: [{ id: 'ticket' }, { id: 'bank_transfer' }] },
                back_urls: {
                    success: `${process.env.APP_URL ?? 'https://xtudoparaguai.vercel.app'}/#order-success`,
                    failure: `${process.env.APP_URL ?? 'https://xtudoparaguai.vercel.app'}/#checkout`,
                    pending: `${process.env.APP_URL ?? 'https://xtudoparaguai.vercel.app'}/#order-success`,
                },
                auto_return: 'approved',
                notification_url: `${process.env.APP_URL ?? 'https://xtudoparaguai.vercel.app'}/api/webhook`,
            },
        });

        return res.status(200).json({
            preference_id: response.id,
            init_point: response.init_point,
            sandbox_init_point: response.sandbox_init_point,
        });

    } catch (err: any) {
        console.error('[/api/checkout] error:', err);
        return res.status(500).json({ error: 'Erro ao criar pagamento', detail: err?.message });
    }
}
