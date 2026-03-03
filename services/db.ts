import { supabase } from './supabaseClient';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface DbOrder {
    id: string;
    buyer_id: string;
    status: string;
    total_brl: number;
    tracking_code: string | null;
    payment_method: string;
    created_at: string;
    order_items?: DbOrderItem[];
}

export interface DbOrderItem {
    id: string;
    order_id: string;
    product_id: string;
    title: string;
    image_url: string;
    quantity: number;
    unit_price: number;
}

export interface DbProfile {
    id: string;
    full_name: string | null;
    cpf: string | null;
    phone: string | null;
    role: 'buyer' | 'seller';
    avatar_url: string | null;
}

export interface DbAddress {
    id?: string;
    user_id?: string;
    cep: string;
    street: string;
    number: string;
    complement?: string | null;
    neighborhood?: string | null;
    city: string;
    state: string;
    created_at?: string;
}

export interface DbProduct {
    id?: string;
    seller_id: string;
    title: string;
    category: string;
    sub_category: string | null;
    description: string | null;
    brand: string | null;
    condition: string;
    origin: string;
    price_brl: number;
    compare_price_brl: number | null;
    stock: number;
    sku: string | null;
    warranty: string;
    shipping: string;
    delivery_days: number;
    images: string[];
    specs: { key: string; value: string }[];
    is_active: boolean;
    created_at?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// ORDERS
// ─────────────────────────────────────────────────────────────────────────────

/** Busca pedidos reais do usuário logado no Supabase */
export async function getUserOrders(userId: string): Promise<DbOrder[]> {
    const { data, error } = await supabase
        .from('orders')
        .select(`
      id, buyer_id, status, total_brl, tracking_code, payment_method, created_at,
      order_items (id, order_id, product_id, title, image_url, quantity, unit_price)
    `)
        .eq('buyer_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('getUserOrders error:', error);
        return [];
    }
    return data ?? [];
}

/** Cria um novo pedido e seus itens no Supabase */
export async function createOrder(params: {
    buyer_id: string;
    total_brl: number;
    payment_method: string;
    items: { product_id: string; title: string; image_url: string; quantity: number; unit_price: number }[];
    address: { cep: string; street: string; number: string; complement?: string; city: string; state: string };
}): Promise<string | null> {
    // 1. Insert order
    const { data: order, error: orderErr } = await supabase
        .from('orders')
        .insert({
            buyer_id: params.buyer_id,
            status: 'pending',
            total_brl: params.total_brl,
            payment_method: params.payment_method,
        })
        .select('id')
        .single();

    if (orderErr || !order) {
        console.error('createOrder error:', orderErr);
        return null;
    }

    // 2. Insert order items
    const orderItems = params.items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        title: item.title,
        image_url: item.image_url,
        quantity: item.quantity,
        unit_price: item.unit_price,
    }));

    const { error: itemsErr } = await supabase.from('order_items').insert(orderItems);
    if (itemsErr) {
        console.error('createOrder items error:', itemsErr);
    }

    // 3. Save address
    const { error: addrErr } = await supabase.from('addresses').upsert({
        user_id: params.buyer_id,
        cep: params.address.cep,
        street: params.address.street,
        number: params.address.number,
        complement: params.address.complement ?? null,
        city: params.address.city,
        state: params.address.state,
    });
    if (addrErr) {
        console.error('createOrder address error:', addrErr);
    }

    return order.id;
}

/** Atualiza o status de um pedido (ex: 'paid', 'shipped', 'delivered') */
export async function updateOrderStatus(orderId: string, status: string, tracking_code?: string) {
    const update: Record<string, string> = { status };
    if (tracking_code) update.tracking_code = tracking_code;

    const { error } = await supabase.from('orders').update(update).eq('id', orderId);
    if (error) console.error('updateOrderStatus error:', error);
}

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE
// ─────────────────────────────────────────────────────────────────────────────

/** Busca o perfil de um usuário */
export async function getProfile(userId: string): Promise<DbProfile | null> {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('getProfile error:', error);
        return null;
    }
    return data;
}

/** Cria ou atualiza o perfil de um usuário */
export async function upsertProfile(profile: Partial<DbProfile> & { id: string }) {
    const { error } = await supabase.from('profiles').upsert(profile);
    if (error) console.error('upsertProfile error:', error);
}

// ─────────────────────────────────────────────────────────────────────────────
// ADDRESSES
// ─────────────────────────────────────────────────────────────────────────────

/** Busca todos os endereços do usuário */
export async function getAddresses(userId: string): Promise<DbAddress[]> {
    const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    if (error) { console.error('getAddresses error:', error); return []; }
    return data ?? [];
}

/** Cria ou atualiza um endereço */
export async function upsertAddress(userId: string, address: DbAddress): Promise<boolean> {
    const payload = { ...address, user_id: userId };
    const { error } = await supabase.from('addresses').upsert(payload);
    if (error) { console.error('upsertAddress error:', error); return false; }
    return true;
}

/** Remove um endereço pelo id */
export async function deleteAddress(addressId: string): Promise<boolean> {
    const { error } = await supabase.from('addresses').delete().eq('id', addressId);
    if (error) { console.error('deleteAddress error:', error); return false; }
    return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────────────────────────────────────────

/** Salva (cria ou atualiza) um produto no banco */
export async function saveProduct(product: DbProduct): Promise<string | null> {
    const { id, ...rest } = product;

    if (id) {
        // Update existing
        const { error } = await supabase.from('products').update(rest).eq('id', id);
        if (error) { console.error('saveProduct update error:', error); return null; }
        return id;
    } else {
        // Insert new
        const { data, error } = await supabase
            .from('products')
            .insert(rest)
            .select('id')
            .single();
        if (error) { console.error('saveProduct insert error:', error); return null; }
        return data?.id ?? null;
    }
}

/** Busca produtos ativos de um seller específico */
export async function getSellerProducts(sellerId: string): Promise<DbProduct[]> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false });

    if (error) { console.error('getSellerProducts error:', error); return []; }
    return data ?? [];
}
