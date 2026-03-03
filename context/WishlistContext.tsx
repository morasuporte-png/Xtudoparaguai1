import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from './AuthContext';

interface WishlistItem {
    id: string;
    product_id: string;
    title: string;
    price_brl: number;
    images: string[];
    seller_name: string;
}

interface WishlistContextType {
    items: WishlistItem[];
    isWishlisted: (productId: string) => boolean;
    toggleWishlist: (product: { id: string; title: string; price_brl?: number; priceBRL?: number; images: string[]; sellerName?: string; seller_name?: string }) => Promise<void>;
    count: number;
}

const WishlistContext = createContext<WishlistContextType>({
    items: [],
    isWishlisted: () => false,
    toggleWishlist: async () => { },
    count: 0,
});

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [items, setItems] = useState<WishlistItem[]>([]);

    // Load wishlist from Supabase (if logged in) or localStorage
    const load = useCallback(async () => {
        if (user) {
            const { data } = await supabase
                .from('wishlists')
                .select('id, product_id, products(title, price_brl, images, seller_name)')
                .eq('user_id', user.id);
            if (data) {
                setItems(data.map((r: any) => ({
                    id: r.id,
                    product_id: r.product_id,
                    title: r.products?.title ?? '',
                    price_brl: r.products?.price_brl ?? 0,
                    images: r.products?.images ?? [],
                    seller_name: r.products?.seller_name ?? '',
                })));
            }
        } else {
            try {
                const local = JSON.parse(localStorage.getItem('xtudo_wishlist') || '[]');
                setItems(local);
            } catch { setItems([]); }
        }
    }, [user]);

    useEffect(() => { load(); }, [load]);

    const isWishlisted = (productId: string) => items.some(i => i.product_id === productId);

    const toggleWishlist = async (product: any) => {
        const pid = product.id;
        const alreadyIn = isWishlisted(pid);
        const price = product.price_brl ?? product.priceBRL ?? 0;
        const sellerName = product.seller_name ?? product.sellerName ?? '';

        if (user) {
            if (alreadyIn) {
                const item = items.find(i => i.product_id === pid);
                if (item) {
                    await supabase.from('wishlists').delete().eq('id', item.id);
                    setItems(prev => prev.filter(i => i.product_id !== pid));
                }
            } else {
                const { data, error } = await supabase
                    .from('wishlists')
                    .insert({ user_id: user.id, product_id: pid })
                    .select()
                    .single();
                if (!error && data) {
                    setItems(prev => [...prev, {
                        id: data.id,
                        product_id: pid,
                        title: product.title,
                        price_brl: price,
                        images: product.images ?? [],
                        seller_name: sellerName,
                    }]);
                }
            }
        } else {
            // localStorage fallback for non-logged-in users
            const local: WishlistItem[] = JSON.parse(localStorage.getItem('xtudo_wishlist') || '[]');
            if (alreadyIn) {
                const updated = local.filter(i => i.product_id !== pid);
                localStorage.setItem('xtudo_wishlist', JSON.stringify(updated));
                setItems(updated);
            } else {
                const newItem: WishlistItem = {
                    id: Date.now().toString(),
                    product_id: pid,
                    title: product.title,
                    price_brl: price,
                    images: product.images ?? [],
                    seller_name: sellerName,
                };
                const updated = [...local, newItem];
                localStorage.setItem('xtudo_wishlist', JSON.stringify(updated));
                setItems(updated);
            }
        }
    };

    return (
        <WishlistContext.Provider value={{ items, isWishlisted, toggleWishlist, count: items.length }}>
            {children}
        </WishlistContext.Provider>
    );
};
