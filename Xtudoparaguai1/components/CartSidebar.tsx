
import React from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useRewards } from '../context/RewardsContext';
import { COUPONS } from '../constants';
import { useState } from 'react';

const CartSidebar: React.FC = () => {
    const { items, removeItem, updateQuantity, totalPrice, totalItems, isCartOpen, setIsCartOpen, clearCart, coupon, applyCoupon, couponDiscount } = useCart();
    const { showToast } = useToast();
    const { points: rewardPoints, tier } = useRewards();
    const [couponInput, setCouponInput] = useState('');
    const pointsToEarn = Math.floor((totalPrice - couponDiscount) * 0.1);

    const handleRemove = (productId: string, productName: string) => {
        removeItem(productId);
        showToast(`"${productName.slice(0, 30)}..." removido`, 'info', '🗑');
    };

    const handleCheckout = () => {
        setIsCartOpen(false);
        window.location.hash = '#checkout';
    };

    const handleApplyCoupon = () => {
        const code = couponInput.trim().toUpperCase();
        if (COUPONS[code]) {
            applyCoupon(code);
            showToast(`Cupom ${code} aplicado!`, 'success', '🏷️');
            setCouponInput('');
        } else {
            showToast('Cupom inválido', 'error', '❌');
        }
    };

    return (
        <>
            {/* Backdrop */}
            {isCartOpen && (
                <div
                    className="fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-sm"
                    onClick={() => setIsCartOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-md z-[200] bg-white shadow-2xl flex flex-col transition-transform duration-500 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-100 p-2 rounded-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="font-black text-slate-900 text-lg">Meu Carrinho</h2>
                            <p className="text-xs text-slate-400 font-medium">{totalItems} {totalItems === 1 ? 'item' : 'itens'}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-20">
                            <div className="bg-slate-100 p-6 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-bold text-slate-700 text-lg">Carrinho vazio</p>
                                <p className="text-slate-400 text-sm mt-1">Adicione produtos do marketplace para começar</p>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="mt-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all"
                            >
                                Explorar Produtos
                            </button>
                        </div>
                    ) : (
                        <>
                            {items.map((item) => {
                                const savings = item.product.comparePriceBRL - item.product.priceBRL;
                                return (
                                    <div key={item.product.id} className="flex gap-4 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                        <img
                                            src={item.product.images[0]}
                                            alt={item.product.title}
                                            className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">{item.product.category}</p>
                                            <p className="font-bold text-slate-800 text-sm line-clamp-2 leading-tight">{item.product.title}</p>
                                            <p className="text-[10px] text-emerald-600 font-bold mt-1">
                                                Economia: R$ {(savings * item.quantity).toLocaleString()}
                                            </p>
                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                        className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-indigo-600 font-bold transition-colors"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="w-6 text-center text-sm font-black text-slate-900">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                        className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-indigo-600 font-bold transition-colors"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-black text-slate-900 text-sm">R$ {(item.product.priceBRL * item.quantity).toLocaleString()}</p>
                                                    {item.quantity > 1 && (
                                                        <p className="text-[10px] text-slate-400">R$ {item.product.priceBRL.toLocaleString()} cada</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemove(item.product.id, item.product.title)}
                                            className="self-start p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                );
                            })}
                            <button
                                onClick={clearCart}
                                className="w-full text-center text-xs text-slate-400 hover:text-rose-500 font-bold py-2 transition-colors"
                            >
                                Limpar carrinho
                            </button>
                        </>
                    )}
                </div>

                {/* Footer com Total */}
                {items.length > 0 && (
                    <div className="border-t border-slate-100 p-6 space-y-4 bg-white">
                        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3">
                            <span className="text-2xl">🏷️</span>
                            <div>
                                <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Sua economia total</p>
                                <p className="font-black text-emerald-600 text-lg">
                                    R$ {items.reduce((s, i) => s + (i.product.comparePriceBRL - i.product.priceBRL) * i.quantity, 0).toLocaleString()} abaixo do varejo BR
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-600">Subtotal</span>
                            <span className="font-bold text-slate-900">R$ {totalPrice.toLocaleString()}</span>
                        </div>

                        {/* Coupon Section */}
                        <div className="space-y-2">
                            {coupon ? (
                                <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 p-3 rounded-xl">
                                    <div className="flex items-center gap-2">
                                        <span className="text-indigo-600 font-bold">🏷️ {coupon}</span>
                                        <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full uppercase font-black">Ativo</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-rose-600 font-bold text-sm">- R$ {couponDiscount.toLocaleString()}</span>
                                        <button onClick={() => applyCoupon(null)} className="text-slate-400 hover:text-rose-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Cupom de desconto"
                                        value={couponInput}
                                        onChange={(e) => setCouponInput(e.target.value)}
                                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    />
                                    <button
                                        onClick={handleApplyCoupon}
                                        className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
                                    >
                                        Aplicar
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                            <span className="font-bold text-slate-900 text-lg">Total</span>
                            <span className="font-black text-2xl text-slate-900">R$ {(totalPrice - couponDiscount).toLocaleString()}</span>
                        </div>
                        {/* Rewards points preview */}
                        <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 flex items-center gap-3">
                            <span className="text-xl">🏆</span>
                            <div>
                                <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest">XTUDO Rewards</p>
                                <p className="text-amber-800 font-black text-sm">+{pointsToEarn} pontos nesta compra</p>
                                {rewardPoints > 0 && <p className="text-[10px] text-amber-600 font-medium">Saldo atual: {rewardPoints} pts · Tier {tier}</p>}
                            </div>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                        >
                            Finalizar Compra →
                        </button>
                        <p className="text-center text-[10px] text-slate-400 font-medium">
                            🔒 Pagamento seguro via PIX, Cartão ou Boleto
                        </p>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartSidebar;
