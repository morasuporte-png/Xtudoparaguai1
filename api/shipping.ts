import type { VercelRequest, VercelResponse } from '@vercel/node';

// ── Melhor Envio Shipping Calculator ─────────────────────────────────────────
// Docs: https://docs.melhorenvio.com.br/docs/calcular-fretes
//
// Token necessário: MELHORENVIO_TOKEN (Vercel Env Var)
// CEP de origem: CEP_ORIGEM (Vercel Env Var — CEP do lojista)
// ─────────────────────────────────────────────────────────────────────────────

interface ShippingRequest {
    cep_destino: string;
    // Dimensões padrão: podem vir do produto no futuro
    weight?: number;   // kg
    height?: number;   // cm
    width?: number;    // cm
    length?: number;   // cm
}

export interface ShippingOption {
    id: number;
    name: string;
    company: string;
    price: number;
    delivery_time: number; // dias úteis
    currency: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { cep_destino, weight = 1, height = 15, width = 20, length = 25 } = req.body as ShippingRequest;

    const cepRaw = (cep_destino ?? '').replace(/\D/g, '');
    if (cepRaw.length !== 8) {
        return res.status(400).json({ error: 'CEP inválido' });
    }

    const token = process.env.MELHORENVIO_TOKEN;
    const cepOrigem = (process.env.CEP_ORIGEM ?? '01310100').replace(/\D/g, '');

    // Se o token não estiver configurado, retornar estimativa fixa de frete
    if (!token) {
        console.warn('[shipping] MELHORENVIO_TOKEN não configurado. Retornando estimativa.');
        return res.status(200).json({
            options: [
                { id: 1, name: 'PAC', company: 'Correios', price: 18.90, delivery_time: 8, currency: 'BRL' },
                { id: 2, name: 'SEDEX', company: 'Correios', price: 35.50, delivery_time: 3, currency: 'BRL' },
            ],
            fallback: true,
        });
    }

    try {
        // Usar ambiente sandbox se não for produção
        const baseUrl = process.env.NODE_ENV === 'production'
            ? 'https://melhorenvio.com.br/api/v2'
            : 'https://sandbox.melhorenvio.com.br/api/v2';

        const response = await fetch(`${baseUrl}/me/shipment/calculate`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'User-Agent': 'XTudo Paraguai App (suporte@xtudoparaguai.com)',
            },
            body: JSON.stringify({
                from: { postal_code: cepOrigem },
                to: { postal_code: cepRaw },
                package: {
                    height,
                    width,
                    length,
                    weight,
                },
                options: {
                    receipt: false,
                    own_hand: false,
                },
                services: '1,2,17', // PAC, SEDEX, SEDEX 10
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('[shipping] Melhor Envio error:', data);
            throw new Error('Erro ao calcular frete');
        }

        // Filtrar e mapear apenas serviços com preço válido
        const options: ShippingOption[] = (Array.isArray(data) ? data : [])
            .filter((s: any) => s.price && !s.error)
            .map((s: any) => ({
                id: s.id,
                name: s.name,
                company: s.company?.name ?? s.name,
                price: parseFloat(s.price),
                delivery_time: parseInt(s.delivery_time ?? '7'),
                currency: 'BRL',
            }))
            .sort((a: ShippingOption, b: ShippingOption) => a.price - b.price);

        return res.status(200).json({ options });
    } catch (err: any) {
        console.error('[shipping] error:', err);
        // Fallback gracioso
        return res.status(200).json({
            options: [
                { id: 1, name: 'PAC', company: 'Correios', price: 18.90, delivery_time: 8, currency: 'BRL' },
                { id: 2, name: 'SEDEX', company: 'Correios', price: 35.50, delivery_time: 3, currency: 'BRL' },
            ],
            fallback: true,
            error: err?.message,
        });
    }
}
