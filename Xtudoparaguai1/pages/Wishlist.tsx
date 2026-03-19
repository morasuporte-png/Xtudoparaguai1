import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { motion, AnimatePresence } from 'framer-motion';

const Wishlist: React.FC = () => {
    const { items, toggleWishlist, count } = useWishlist();

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
                    <div className="flex items-center gap-3 mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-rose-500" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        <h1 className="text-3xl font-black text-slate-900">Meus Favoritos</h1>
                    </div>
                    <p className="text-slate-500 font-medium text-sm">
                        {count > 0 ? <><span className="font-black text-slate-900">{count}</span> produto{count !== 1 ? 's' : ''} salvo{count !== 1 ? 's' : ''}</> : 'Você ainda não salvou nenhum produto'}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-rose-200" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-3">Nenhum favorito ainda</h2>
                        <p className="text-slate-500 max-w-sm mb-8">
                            Toque no ❤️ em qualquer produto para salvar aqui e comprar depois.
                        </p>
                        <button
                            onClick={() => window.location.hash = '#marketplace'}
                            className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
                        >
                            Explorar Produtos
                        </button>
                    </div>
                ) : (
                    <motion.div layout className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AnimatePresence>
                            {items.map(item => (
                                <motion.div
                                    key={item.product_id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
                                >
                                    {/* Image */}
                                    <div
                                        className="relative aspect-square overflow-hidden rounded-t-2xl bg-slate-50 cursor-pointer"
                                        onClick={() => { window.location.hash = `#product/${item.product_id}`; window.scrollTo(0, 0); }}
                                    >
                                        <img
                                            src={item.images?.[0] || 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400&q=80'}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        {/* Remove button */}
                                        <button
                                            onClick={e => { e.stopPropagation(); toggleWishlist(item); }}
                                            className="absolute top-2 right-2 w-8 h-8 bg-white/95 rounded-full shadow-md flex items-center justify-center hover:bg-rose-50 transition-colors"
                                            title="Remover dos favoritos"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rose-500" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Info */}
                                    <div className="p-4">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{item.seller_name}</p>
                                        <p
                                            className="text-sm font-bold text-slate-900 line-clamp-2 mb-3 cursor-pointer hover:text-indigo-600 transition-colors"
                                            onClick={() => { window.location.hash = `#product/${item.product_id}`; window.scrollTo(0, 0); }}
                                        >
                                            {item.title}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-black text-slate-900">
                                                R$ {Number(item.price_brl).toLocaleString('pt-BR')}
                                            </span>
                                            <button
                                                onClick={() => { window.location.hash = `#product/${item.product_id}`; window.scrollTo(0, 0); }}
                                                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                                            >
                                                Ver produto →
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
