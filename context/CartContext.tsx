
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Product } from '../types';
import { COUPONS } from '../constants';

export interface CartItem {
    product: Product;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addItem: (product: Product) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
    isCartOpen: boolean;
    setIsCartOpen: (open: boolean) => void;
    coupon: string | null;
    applyCoupon: (code: string | null) => void;
    couponDiscount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [coupon, setCoupon] = useState<string | null>(null);

    const applyCoupon = useCallback((code: string | null) => {
        setCoupon(code);
    }, []);

    const addItem = useCallback((product: Product) => {
        setItems(prev => {
            const existing = prev.find(i => i.product.id === product.id);
            if (existing) {
                return prev.map(i =>
                    i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { product, quantity: 1 }];
        });
        setIsCartOpen(true);
    }, []);

    const removeItem = useCallback((productId: string) => {
        setItems(prev => prev.filter(i => i.product.id !== productId));
    }, []);

    const updateQuantity = useCallback((productId: string, quantity: number) => {
        if (quantity <= 0) {
            setItems(prev => prev.filter(i => i.product.id !== productId));
        } else {
            setItems(prev =>
                prev.map(i => i.product.id === productId ? { ...i, quantity } : i)
            );
        }
    }, []);

    const clearCart = useCallback(() => setItems([]), []);

    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = items.reduce((sum, i) => sum + i.product.priceBRL * i.quantity, 0);

    const couponDiscount = (() => {
        if (!coupon || !COUPONS[coupon]) return 0;
        const c = COUPONS[coupon];
        return totalPrice * c.discount;
    })();

    return (
        <CartContext.Provider value={{
            items, addItem, removeItem, updateQuantity, clearCart,
            totalItems, totalPrice, isCartOpen, setIsCartOpen,
            coupon, applyCoupon, couponDiscount
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
};
