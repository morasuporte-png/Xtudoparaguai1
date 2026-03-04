import { supabase } from './supabaseClient';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface DbOrder {
    id: string;
    buyer_id: string;
    /** @deprecated Use payment_status + order_status instead */
    status: string;
    payment_status: 'pending_payment' | 'payment_approved' | 'payment_failed' | 'refunded';
    order_status: 'pending' | 'confirmed' | 'sending_to_supplier' | 'supplier_processing' | 'awaiting_tracking' | 'shipped' | 'delivered' | 'cancelled' | 'failed';
    total_brl: number;
    tracking_code: string | null;
    payment_method: string;
    created_at: string;
    order_items?: DbOrderItem[];
}

export interface DbOrderEvent {
    id: string;
    order_id: string;
    event_type: string;
    payload: Record<string, unknown>;
    success: boolean;
    error_message: string | null;
    created_at: string;
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
    store_name: string | null;
    document: string | null;
    store_description: string | null;
    is_wholesaler: boolean | null;
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

/** Cria um produto no Supabase para o seller logado */
export async function createProduct(params: {
    seller_id: string;
    title: string;
    category_name: string;
    description: string;
    price_brl: number;
    compare_price_brl: number;
    stock: number;
    images: string[];
}): Promise<{ id: string } | null> {
    const { data, error } = await supabase
        .from('products')
        .insert({
            seller_id: params.seller_id,
            title: params.title,
            category: params.category_name,   // tabela usa 'category'
            description: params.description,
            price_brl: params.price_brl,
            compare_price_brl: params.compare_price_brl || params.price_brl,
            stock: params.stock,
            images: params.images,
            is_active: true,
        })
        .select('id')
        .single();
    if (error) { console.error('createProduct error:', error); return null; }
    return data;
}

// ─────────────────────────────────────────────────────────────────────────────
// ORDERS
// ─────────────────────────────────────────────────────────────────────────────

/** Busca pedidos reais do usuário logado no Supabase */
export async function getUserOrders(userId: string): Promise<DbOrder[]> {
    const { data, error } = await supabase
        .from('orders')
        .select(`
      id, buyer_id, status, payment_status, order_status,
      total_brl, tracking_code, payment_method, created_at,
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

/** Registra um evento na tabela order_events */
export async function logOrderEvent(params: {
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
    if (error) console.error('[logOrderEvent] error:', error);
}

/** Cria um novo pedido e seus itens no Supabase */
export async function createOrder(params: {
    buyer_id: string;
    total_brl: number;
    payment_method: string;
    items: { product_id: string; title: string; image_url: string; quantity: number; unit_price: number }[];
    address: { cep: string; street: string; number: string; complement?: string; city: string; state: string };
}): Promise<string | null> {
    // 1. Insert order with new status fields
    const { data: order, error: orderErr } = await supabase
        .from('orders')
        .insert({
            buyer_id: params.buyer_id,
            status: 'pending',
            payment_status: 'pending_payment',
            order_status: 'pending',
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

    // 4. Log ORDER_CREATED event (trigger also handles this, this is a safety net)
    // Note: the DB trigger trg_order_created fires automatically on insert.
    // This call here is a client-side log for items count which the trigger can't see.
    await logOrderEvent({
        order_id: order.id,
        event_type: 'ORDER_CREATED',
        payload: {
            total_brl: params.total_brl,
            items_count: params.items.length,
            payment_method: params.payment_method,
        },
    });

    return order.id;
}

/** Atualiza payment_status e/ou order_status de um pedido */
export async function updateOrderStatus(params: {
    order_id: string;
    payment_status?: DbOrder['payment_status'];
    order_status?: DbOrder['order_status'];
    tracking_code?: string;
    event_type?: string;
    event_payload?: Record<string, unknown>;
}): Promise<void> {
    const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (params.payment_status) update.payment_status = params.payment_status;
    if (params.order_status) update.order_status = params.order_status;
    if (params.tracking_code) update.tracking_code = params.tracking_code;
    // Keep legacy status field in sync
    if (params.payment_status === 'payment_approved') update.status = 'paid';
    if (params.order_status === 'shipped') update.status = 'shipped';
    if (params.order_status === 'delivered') update.status = 'delivered';
    if (params.order_status === 'cancelled') update.status = 'cancelled';

    const { error } = await supabase.from('orders').update(update).eq('id', params.order_id);
    if (error) {
        console.error('updateOrderStatus error:', error);
        return;
    }

    if (params.event_type) {
        await logOrderEvent({
            order_id: params.order_id,
            event_type: params.event_type,
            payload: params.event_payload ?? {},
        });
    }
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
