import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// ── Supplier Catalog Integration API ─────────────────────────────────────────
// POST /api/catalog
//
// Accepts an array of product records from a supplier and upserts them into
// the Supabase `products` table.
//
// Auth: Bearer token in Authorization header (CATALOG_API_KEY env var)
// ─────────────────────────────────────────────────────────────────────────────

interface CatalogProduct {
    sku: string;             // Supplier's own SKU — used as idempotency key
    title: string;
    description?: string;
    price_usd: number;       // Price in USD (will be converted to BRL)
    price_brl?: number;      // Optional: override BRL price
    category: string;
    brand?: string;
    images: string[];        // Array of image URLs
    stock: number;
    weight_kg?: number;
    height_cm?: number;
    width_cm?: number;
    length_cm?: number;
    seller_id: string;       // Supabase user ID of the seller account
}

const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY ?? process.env.VITE_SUPABASE_ANON_KEY!
);

// Simple USD→BRL conversion (use a real FX API in production)
const USD_TO_BRL = parseFloat(process.env.USD_TO_BRL ?? '5.85');

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // ── Auth check ────────────────────────────────────────────────────────────
    const authHeader = req.headers['authorization'] ?? '';
    const token = authHeader.replace('Bearer ', '').trim();
    const expectedKey = process.env.CATALOG_API_KEY;

    if (expectedKey && token !== expectedKey) {
        return res.status(401).json({ error: 'Unauthorized — invalid CATALOG_API_KEY' });
    }

    // ── Method check ──────────────────────────────────────────────────────────
    if (req.method === 'GET') {
        // Health check / documentation endpoint
        return res.status(200).json({
            endpoint: '/api/catalog',
            method: 'POST',
            description: 'Upsert supplier products into XTUDO Marketplace',
            auth: 'Authorization: Bearer <CATALOG_API_KEY>',
            body_schema: {
                products: [{
                    sku: 'string (required)',
                    title: 'string (required)',
                    description: 'string (optional)',
                    price_usd: 'number (required)',
                    price_brl: 'number (optional, auto-calculated if omitted)',
                    category: 'string (required)',
                    brand: 'string (optional)',
                    images: 'string[] (required, min 1)',
                    stock: 'number (required)',
                    weight_kg: 'number (optional)',
                    height_cm: 'number (optional)',
                    width_cm: 'number (optional)',
                    length_cm: 'number (optional)',
                    seller_id: 'string (required — Supabase user UUID)',
                }],
            },
        });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { products } = req.body as { products: CatalogProduct[] };

    if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ error: 'Body must contain a non-empty "products" array' });
    }

    if (products.length > 500) {
        return res.status(400).json({ error: 'Max 500 products per request. Use pagination.' });
    }

    // ── Validate and map ──────────────────────────────────────────────────────
    const errors: { sku: string; error: string }[] = [];
    const rows = products
        .map((p) => {
            if (!p.sku) { errors.push({ sku: '?', error: 'Missing sku' }); return null; }
            if (!p.title) { errors.push({ sku: p.sku, error: 'Missing title' }); return null; }
            if (!p.price_usd || p.price_usd <= 0) { errors.push({ sku: p.sku, error: 'Invalid price_usd' }); return null; }
            if (!p.seller_id) { errors.push({ sku: p.sku, error: 'Missing seller_id' }); return null; }
            if (!p.images || p.images.length === 0) { errors.push({ sku: p.sku, error: 'Missing images' }); return null; }

            const priceBRL = p.price_brl ?? Math.round(p.price_usd * USD_TO_BRL * 100) / 100;

            return {
                // Use seller_id + sku as composite external_id for upsert
                external_id: `${p.seller_id}::${p.sku}`,
                seller_id: p.seller_id,
                title: p.title.trim(),
                description: p.description?.trim() ?? '',
                price_brl: priceBRL,
                compare_price_brl: Math.round(priceBRL * 1.25 * 100) / 100, // 25% compare price
                category: p.category,
                brand: p.brand ?? '',
                images: p.images,
                stock: p.stock ?? 0,
                weight_kg: p.weight_kg ?? 1,
                height_cm: p.height_cm ?? 15,
                width_cm: p.width_cm ?? 20,
                length_cm: p.length_cm ?? 25,
                status: 'active',
                source: 'catalog_api',
                updated_at: new Date().toISOString(),
            };
        })
        .filter(Boolean);

    if (rows.length === 0) {
        return res.status(400).json({ error: 'No valid products to insert', validation_errors: errors });
    }

    // ── Upsert into Supabase ──────────────────────────────────────────────────
    const { data, error } = await supabase
        .from('products')
        .upsert(rows, { onConflict: 'external_id' })
        .select('id, external_id');

    if (error) {
        console.error('[catalog] Supabase upsert error:', error);
        return res.status(500).json({ error: 'Database error', detail: error.message });
    }

    return res.status(200).json({
        success: true,
        inserted: data?.length ?? 0,
        validation_errors: errors.length > 0 ? errors : undefined,
    });
}
