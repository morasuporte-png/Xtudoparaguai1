
import React, { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductModalProps {
    product: Product | null;
    onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
    const { addItem } = useCart();
    const [added, setAdded] = useState(false);

    if (!product) return null;

    const savingsPercent = Math.round(
        ((product.comparePriceBRL - product.priceBRL) / product.comparePriceBRL) * 100
    );
    const savings = product.comparePriceBRL - product.priceBRL;

    const handleAddToCart = () => {
        addItem(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/70 backdrop-blur-md"
                onClick={onClose}
            />
            <div className="relative z-10 bg-white rounded-[40px] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Image Hero */}
                <div className="relative h-72 bg-slate-100 rounded-t-[40px] overflow-hidden">
                    <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-indigo-600 text-white text-[10px] font-black px-4 py-2 rounded-full shadow-lg">
                            OFERTA CDE
                        </span>
                        <span className="bg-emerald-500 text-white text-[10px] font-black px-4 py-2 rounded-full shadow-lg">
                            -{savingsPercent}% OFF
                        </span>
                    </div>
                    {product.isVerified && (
                        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-3 py-2 rounded-full flex items-center gap-1.5 border border-white/30">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Seller Verificado
                        </div>
                    )}
                    <button
                        onClick={onClose}
                        className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/30 transition-all border border-white/20"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-8">
                    {/* Seller & Category */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{product.category}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-[10px] text-indigo-600 font-black uppercase tracking-widest">{product.sellerName}</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-black text-slate-900 leading-tight mb-4">{product.title}</h2>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6">{product.description}</p>

                    {/* Price Block */}
                    <div className="bg-slate-50 rounded-3xl p-6 mb-6 border border-slate-100">
                        <div className="flex items-end gap-3 mb-3">
                            <span className="text-4xl font-black text-slate-900">R$ {product.priceBRL.toLocaleString()}</span>
                            <span className="text-slate-400 line-through text-lg mb-1">R$ {product.comparePriceBRL.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="bg-emerald-100 text-emerald-700 text-xs font-black px-3 py-1 rounded-full">
                                Você economiza R$ {savings.toLocaleString()} ({savingsPercent}%)
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">vs. varejo brasileiro</span>
                        </div>
                    </div>

                    {/* Specs */}
                    {Object.keys(product.specs).length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Especificações</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(product.specs).map(([key, val]) => (
                                    <div key={key} className="bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{key}</p>
                                        <p className="font-bold text-slate-800 text-sm">{val}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Stock & Rating */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex items-center gap-1.5">
                            <span className="text-amber-400 text-lg">★</span>
                            <span className="font-black text-slate-800">{product.rating}</span>
                            <span className="text-slate-400 text-xs">/ 5.0</span>
                        </div>
                        <div className="w-px h-4 bg-slate-200" />
                        <span className={`text-xs font-bold ${product.stock < 20 ? 'text-rose-500' : 'text-emerald-600'}`}>
                            {product.stock < 20 ? `⚡ Apenas ${product.stock} em estoque!` : `✓ ${product.stock} unidades disponíveis`}
                        </span>
                    </div>

                    {/* CTA */}
                    <button
                        onClick={handleAddToCart}
                        className={`w-full py-5 rounded-2xl font-black text-lg shadow-xl transition-all duration-300 active:scale-95 ${added
                                ? 'bg-emerald-500 text-white shadow-emerald-100'
                                : 'bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700'
                            }`}
                    >
                        {added ? '✓ Adicionado ao Carrinho!' : 'Adicionar ao Carrinho'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;
