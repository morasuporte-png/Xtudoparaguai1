
import React, { useState } from 'react';
import { MOCK_PRODUCTS } from '../constants';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import ProductModal from '../components/ProductModal';
import { Product } from '../types';

// ─── Mock seller profiles ──────────────────────────────────────────────
const SELLER_PROFILES: Record<string, {
    id: string; name: string; avatar: string; banner: string;
    city: string; since: string; rating: number; totalSales: number;
    verified: boolean; description: string; badges: string[];
    whatsapp: string;
}> = {
    s1: {
        id: 's1', name: 'Mega Tech CDE',
        avatar: 'https://i.pravatar.cc/150?img=60',
        banner: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
        city: 'Ciudad del Este – PY', since: '2019',
        rating: 4.9, totalSales: 3812, verified: true,
        description: 'Líder em produtos Apple e eletrônicos de alta tecnologia direto de Ciudad del Este. Garantia, nota fiscal e entrega rastreada para todo o Brasil.',
        badges: ['🏆 Top Seller', '⚡ Resposta Rápida', '🍎 Apple Specialist'],
        whatsapp: '+595985000001',
    },
    s2: {
        id: 's2', name: 'Sony Center Paraguay',
        avatar: 'https://i.pravatar.cc/150?img=55',
        banner: 'https://images.unsplash.com/photo-1606318621788-14e21abe2649?w=1200&q=80',
        city: 'Ciudad del Este – PY', since: '2020',
        rating: 4.8, totalSales: 2145, verified: true,
        description: 'Especialistas em games e eletrônicos Sony. PlayStation, TVs, headphones e celulares Samsung com os melhores preços do Paraguai.',
        badges: ['🎮 Gaming Official', '✅ Seller Verificado'],
        whatsapp: '+595985000002',
    },
    s3: {
        id: 's3', name: 'Casa Nissei',
        avatar: 'https://i.pravatar.cc/150?img=52',
        banner: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=80',
        city: 'Ciudad del Este – PY', since: '2017',
        rating: 4.7, totalSales: 5901, verified: true,
        description: 'Uma das maiores redes de eletrônicos do Paraguai. Notebooks, tablets e gadgets com 5 anos de experiência em importação.',
        badges: ['🏪 Loja Física CDE', '💻 Notebook Expert'],
        whatsapp: '+595985000003',
    },
    s4: {
        id: 's4', name: 'Cellshop',
        avatar: 'https://i.pravatar.cc/150?img=45',
        banner: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=1200&q=80',
        city: 'Ciudad del Este – PY', since: '2021',
        rating: 5.0, totalSales: 987, verified: true,
        description: 'Perfumes originais importados com certificado de autenticidade. Marcas Premium como Chanel, Dior, YSL e muito mais.',
        badges: ['🧴 Perfumes Premium', '🌟 Nota 5 Estrelas'],
        whatsapp: '+595985000004',
    },
};

interface SellerProfileProps {
    sellerId: string;
    onBack: () => void;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
            <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i <= Math.round(rating) ? 'text-amber-400' : 'text-slate-200'}`} viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
        <span className="ml-1.5 text-sm font-black text-slate-700">{rating.toFixed(1)}</span>
    </div>
);

const SellerProfile: React.FC<SellerProfileProps> = ({ sellerId, onBack }) => {
    const seller = SELLER_PROFILES[sellerId];
    const { addItem } = useCart();
    const { showToast } = useToast();
    const [modalProduct, setModalProduct] = useState<Product | null>(null);
    const sellerProducts = MOCK_PRODUCTS.filter(p => p.sellerId === sellerId);

    const handleAddToCart = (product: Product) => {
        addItem(product);
        showToast(`${product.title.slice(0, 28)}... adicionado!`, 'success', '🛒');
    };

    if (!seller) return (
        <div className="flex flex-col items-center justify-center py-32 text-center">
            <p className="text-slate-400 font-bold text-lg">Seller não encontrado</p>
            <button onClick={onBack} className="mt-4 text-indigo-600 font-bold text-sm hover:underline">← Voltar</button>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            {/* Product Modal */}
            {modalProduct && <ProductModal product={modalProduct} onClose={() => setModalProduct(null)} />}

            {/* Back button */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-slate-400 hover:text-slate-700 transition-colors text-sm font-semibold mb-6 group"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Voltar ao Marketplace
            </button>

            {/* Banner + avatar */}
            <div className="relative rounded-[32px] overflow-hidden mb-6 shadow-2xl">
                <div className="h-52 overflow-hidden">
                    <img src={seller.banner} alt="banner" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                </div>

                {/* Avatar + basic info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end gap-5">
                    <div className="relative flex-shrink-0">
                        <img src={seller.avatar} alt={seller.name} className="w-20 h-20 rounded-2xl border-4 border-white shadow-xl object-cover" />
                        {seller.verified && (
                            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full shadow-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white tracking-tight">{seller.name}</h1>
                        <p className="text-white/70 text-sm font-medium">{seller.city} · Desde {seller.since}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Info card */}
                <div className="space-y-5">
                    {/* Stats */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                        <h2 className="font-black text-slate-900 mb-5 text-sm uppercase tracking-widest">Sobre o Seller</h2>
                        <div className="grid grid-cols-2 gap-4 mb-5">
                            <div className="bg-indigo-50 rounded-2xl p-4 text-center">
                                <p className="text-2xl font-black text-indigo-700">{seller.totalSales.toLocaleString()}</p>
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-1">Vendas</p>
                            </div>
                            <div className="bg-emerald-50 rounded-2xl p-4 text-center">
                                <p className="text-2xl font-black text-emerald-700">{sellerProducts.length}</p>
                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mt-1">Produtos</p>
                            </div>
                        </div>
                        <div className="mb-5">
                            <StarRating rating={seller.rating} />
                        </div>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">{seller.description}</p>
                    </div>

                    {/* Badges */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                        <h2 className="font-black text-slate-900 mb-4 text-sm uppercase tracking-widest">Conquistas</h2>
                        <div className="flex flex-col gap-2">
                            {seller.badges.map(badge => (
                                <span key={badge} className="bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 text-xs font-bold px-4 py-2.5 rounded-2xl border border-indigo-100">
                                    {badge}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Contact */}
                    <a
                        href={`https://wa.me/${seller.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 w-full bg-emerald-500 text-white py-4 rounded-2xl font-bold shadow-xl shadow-emerald-100 hover:bg-emerald-600 transition-all active:scale-95"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.1 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.444h.006c6.585 0 11.946-5.336 11.949-11.896.002-3.176-1.24-6.16-3.48-8.447zM12.045 21.785h-.005c-1.775 0-3.513-.476-5.031-1.37l-.361-.214-3.741.976.997-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.894-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.889 9.884z" />
                        </svg>
                        Contato via WhatsApp
                    </a>
                </div>

                {/* Right: Products */}
                <div className="lg:col-span-2">
                    <h2 className="font-black text-slate-900 text-xl mb-5">
                        Produtos de <span className="text-indigo-600">{seller.name}</span>
                        <span className="text-slate-400 font-medium text-base ml-2">({sellerProducts.length})</span>
                    </h2>

                    {sellerProducts.length === 0 ? (
                        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
                            <p className="text-slate-400 font-bold">Nenhum produto listado ainda.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {sellerProducts.map(product => {
                                const savings = Math.round(((product.comparePriceBRL - product.priceBRL) / product.comparePriceBRL) * 100);
                                return (
                                    <div key={product.id} className="group bg-white rounded-[28px] overflow-hidden border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-400 flex flex-col">
                                        <div
                                            className="relative h-48 overflow-hidden bg-slate-50 cursor-pointer"
                                            onClick={() => setModalProduct(product)}
                                        >
                                            <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            <span className="absolute top-3 right-3 bg-indigo-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full">
                                                -{savings}% OFF
                                            </span>
                                        </div>
                                        <div className="p-5 flex-1 flex flex-col">
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{product.category}</p>
                                            <h3
                                                className="font-bold text-slate-900 text-sm line-clamp-2 mb-3 leading-tight cursor-pointer hover:text-indigo-600 transition-colors"
                                                onClick={() => setModalProduct(product)}
                                            >
                                                {product.title}
                                            </h3>
                                            <div className="flex items-baseline gap-2 mb-4 mt-auto">
                                                <span className="text-xl font-black text-slate-900">R$ {product.priceBRL.toLocaleString()}</span>
                                                <span className="text-xs text-slate-400 line-through">R$ {product.comparePriceBRL.toLocaleString()}</span>
                                            </div>
                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                className="w-full bg-indigo-600 text-white py-3 rounded-2xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                                            >
                                                Adicionar ao Carrinho
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SellerProfile;
