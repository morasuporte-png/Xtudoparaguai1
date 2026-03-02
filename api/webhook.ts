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

        // Pedido aprovado
        if (status === 'approved' && external_reference) {
            // external_reference tem o formato "order_id::buyer_id"
            const [orderId] = external_reference.split('::');

            if (orderId) {
                // 1. Marcar pedido como pago no Supabase
                const { data: orderData, error } = await supabase
                    .from('orders')
                    .update({ status: 'paid', updated_at: new Date().toISOString() })
                    .eq('id', orderId)
                    .select(`
                        id, total_brl, payment_method,
                        profiles(full_name),
                        order_items(title, quantity, unit_price, image_url)
                    `)
                    .single();

                if (error) {
                    console.error('[webhook] supabase update error:', error);
                } else {
                    console.log(`[webhook] order ${orderId} marcado como PAGO.`);

                    // 2. Buscar dados do comprador para enviar o email
                    const buyerEmail = (payment.payer as any)?.email;
                    const buyerName = (orderData as any)?.profiles?.full_name ?? 'Cliente';

                    if (buyerEmail) {
                        await sendOrderConfirmation({
                            to: buyerEmail,
                            order_id: orderId,
                            buyer_name: buyerName,
                            items: (orderData as any)?.order_items ?? [],
                            total: (orderData as any)?.total_brl ?? 0,
                            payment_method: (orderData as any)?.payment_method ?? 'pix',
                            address: 'Consulte seus dados de entrega no portal do cliente.',
                        });
                    }
                }
            }
        }

        return res.status(200).json({ received: true });
    } catch (err: any) {
        console.error('[webhook] error:', err);
        return res.status(500).json({ error: err?.message });
    }
}
