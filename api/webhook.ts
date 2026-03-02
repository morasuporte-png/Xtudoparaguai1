import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { createClient } from '@supabase/supabase-js';

// Cliente do MP (servidor)
const mpClient = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!,
});

// Cliente Supabase (service role para acesso admin)
const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY ?? process.env.VITE_SUPABASE_ANON_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Receber notificação do MP
    const { type, data } = req.query;

    // MP envia notificações do tipo "payment"
    if (type !== 'payment' || !data?.id) {
        return res.status(200).json({ received: true });
    }

    try {
        const paymentApi = new Payment(mpClient);
        const payment = await paymentApi.get({ id: String(data.id) });

        const { status, external_reference, transaction_amount } = payment;

        console.log(`[webhook] payment ${data.id} status=${status}`);

        // Pedido aprovado
        if (status === 'approved' && external_reference) {
            // external_reference tem o formato "order_id::buyer_id"
            const [orderId] = external_reference.split('::');
            if (orderId) {
                const { error } = await supabase
                    .from('orders')
                    .update({ status: 'paid', updated_at: new Date().toISOString() })
                    .eq('id', orderId);

                if (error) {
                    console.error('[webhook] supabase update error:', error);
                } else {
                    console.log(`[webhook] order ${orderId} marcado como PAGO.`);
                }
            }
        }

        return res.status(200).json({ received: true });
    } catch (err: any) {
        console.error('[webhook] error:', err);
        return res.status(500).json({ error: err?.message });
    }
}
