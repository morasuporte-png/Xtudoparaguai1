import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_PRODUCTS } from '../constants';
import { useCart } from '../context/CartContext';
import { useChat } from '../context/ChatContext';
import { Product } from '../types';
import Breadcrumbs from '../components/Breadcrumbs';
import { supabase } from '../services/supabaseClient';

interface ProductDetailProps {
    productId: string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productId }) => {
    const { addItem } = useCart();
    const { openChat } = useChat();
    const [product, setProduct] = useState<Product>(MOCK_PRODUCTS[0]);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchProductData() {
            setIsLoading(true);
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('id', productId)
                    .single();

                if (!error && data) {
                    const transformed: Product = {
                        id: data.id,
                        sellerId: data.seller_id,
                        sellerName: data.seller_name,
                        category: data.category_name,
                        title: data.title,
                        description: data.description,
                        priceBRL: Number(data.price_brl),
                        comparePriceBRL: Number(data.compare_price_brl),
                        stock: data.stock,
                        rating: Number(data.rating),
                        images: data.images,
                        specs: data.specs,
                        isVerified: data.is_verified
                    };
                    setProduct(transformed);

                    // Fetch related products
                    const { data: relatedData } = await supabase
                        .from('products')
                        .select('*')
                        .eq('category_name', transformed.category)
                        .neq('id', transformed.id)
                        .limit(4);

                    if (relatedData) {
                        setRelatedProducts(relatedData.map((p: any) => ({
                            id: p.id,
                            sellerId: p.seller_id,
                            sellerName: p.seller_name,
                            category: p.category_name,
                            title: p.title,
                            description: p.description,
                            priceBRL: Number(p.price_brl),
                            comparePriceBRL: Number(p.compare_price_brl),
                            stock: p.stock,
                            rating: Number(p.rating),
                            images: p.images,
                            specs: p.specs,
                            isVerified: p.is_verified
                        })));
                    }
                }
            } catch (err) {
                console.error('Error fetching product detail:', err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchProductData();
    }, [productId]);

    const [activeImg, setActiveImg] = useState(0);
    // ... existing state
    const [quantity, setQuantity] = useState(1);
    const [zipCode, setZipCode] = useState('');
    const [shippingCost, setShippingCost] = useState<number | null>(null);
    const [simulating, setSimulating] = useState(false);

    // Sync active image when product changes
    useEffect(() => setActiveImg(0), [productId]);

    const handleSimulateShipping = () => {
        if (zipCode.length < 8) return;
        setSimulating(true);
        setTimeout(() => {
            setShippingCost(Math.random() > 0.5 ? 0 : 45.90);
            setSimulating(false);
        }, 800);
    };

    // Unified relatedProducts logic inside the fetch effect for better data consistency

    const discount = Math.round((1 - product.priceBRL / product.comparePriceBRL) * 100);

    return (
        <div className="min-h-screen bg-[#fafafa] py-8 md:py-12">
            <div className="max-w-7xl mx-auto px-4 lg:px-6">

                {/* Breadcrumbs */}
                <div className="mb-8">
                    <Breadcrumbs
                        items={[
                            { label: product.category, hash: `#category/${product.category.toLowerCase()}` },
                            { label: product.title }
                        ]}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* GALLERY (5 cols) */}
                    <div className="lg:col-span-12 xl:col-span-7">
                        <div className="flex flex-col-reverse md:flex-row gap-4">
                            {/* Thumbnails */}
                            <div className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
                                {product.images.concat(product.images).slice(0, 4).map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImg(i)}
                                        className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0
                                            ${activeImg === i ? 'border-indigo-600 shadow-lg scale-105' : 'border-slate-100 opacity-60 hover:opacity-100'}
                                        `}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                            {/* Main Image */}
                            <div className="flex-1 bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden aspect-square relative group">
                                <img
                                    src={product.images[activeImg % product.images.length]}
                                    alt={product.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                {discount > 0 && (
                                    <div className="absolute top-6 left-6 bg-rose-500 text-white font-black px-4 py-1.5 rounded-full shadow-lg text-sm">
                                        -{discount}% OFF
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* INFO (7 cols) */}
                    <div className="lg:col-span-12 xl:col-span-5 space-y-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest">{product.category}</span>
                                {product.isVerified && (
                                    <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                        Seller Verificado
                                    </span>
                                )}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-4">{product.title}</h1>
                            <div className="flex items-center gap-2 mb-6">
                                <div className="flex items-center gap-0.5">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <svg key={s} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${s <= Math.round(product.rating) ? 'text-amber-400' : 'text-slate-200'}`} viewBox="0 0 24 24" fill="currentColor">
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-sm font-bold text-slate-400">({product.rating} de 5)</span>
                                <span className="text-slate-200 font-light mx-2">|</span>
                                <span className="text-sm font-bold text-indigo-600">{product.stock} em estoque</span>
                            </div>

                            <p className="text-slate-500 leading-relaxed font-medium mb-8">
                                {product.description}
                            </p>

                            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
                                <div className="flex items-end gap-3">
                                    <div className="space-y-1">
                                        <span className="text-xs text-slate-400 font-bold line-through">R$ {product.comparePriceBRL.toLocaleString('pt-BR')}</span>
                                        <div className="text-4xl font-black text-slate-900 tracking-tighter">R$ {product.priceBRL.toLocaleString('pt-BR')}</div>
                                    </div>
                                    <div className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-1 rounded-lg uppercase mb-1.5">No PIX</div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex items-center bg-slate-50 border border-slate-100 rounded-2xl p-1">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M20 12H4" /></svg>
                                        </button>
                                        <span className="w-10 text-center font-black text-slate-900">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                            className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M12 4v16m8-8H4" /></svg>
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => { addItem(product, quantity); window.location.hash = '#checkout'; }}
                                        className="flex-1 bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-3"
                                    >
                                        Comprar Agora
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Simulator */}
                        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Calcular Frete e Prazo</h4>
                            <div className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    placeholder="00000-000"
                                    maxLength={9}
                                    value={zipCode}
                                    onChange={(e) => setZipCode(e.target.value)}
                                    className="flex-1 bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                                />
                                <button
                                    onClick={handleSimulateShipping}
                                    className="px-6 py-3 bg-slate-900 text-white text-xs font-black rounded-2xl hover:bg-black transition-all"
                                >
                                    {simulating ? '...' : 'Calcular'}
                                </button>
                            </div>
                            {shippingCost !== null && (
                                <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-indigo-100 animate-in fade-in zoom-in duration-300">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-900">Entrega Expressa</p>
                                            <p className="text-[10px] text-slate-400">Chega em 3-5 dias úteis</p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-black text-emerald-600">
                                        {shippingCost === 0 ? 'GRÁTIS' : `R$ ${shippingCost.toLocaleString('pt-BR')}`}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Seller Info */}
                        <div className="bg-white rounded-3xl p-6 border border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xl">
                                    {product.sellerName[0]}
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Vendido por</p>
                                    <p className="text-base font-black text-slate-900">{product.sellerName}</p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <button className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:underline px-4 py-2 bg-slate-50 rounded-xl">Ver Loja</button>
                                <button
                                    onClick={() => openChat(product.sellerId, product.sellerName)}
                                    className="text-[10px] font-black text-indigo-600 uppercase tracking-widest px-4 py-2 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    Falar com Vendedor
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Technical Specs */}
                <div className="mt-20">
                    <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3 font-primary">
                        <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
                        Especificações Técnicas
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(product.specs).map(([key, value], i) => (
                            <div key={i} className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-3xl hover:border-indigo-100 transition-all">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{key}</span>
                                <span className="text-sm font-black text-slate-900">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Related Products */}
                <div className="mt-32">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-black text-slate-900 font-primary">Quem viu este produto, também viu</h3>
                        <button className="text-sm font-bold text-indigo-600 hover:underline">Ver tudo</button>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map(p => (
                            <div
                                key={p.id}
                                onClick={() => { window.location.hash = `#product/${p.id}`; window.scrollTo(0, 0); }}
                                className="group bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-indigo-50 transition-all cursor-pointer"
                            >
                                <div className="aspect-square bg-slate-50 overflow-hidden relative">
                                    <img src={p.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    {p.isVerified && (
                                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-xl shadow-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                        </div>
                                    )}
                                </div>
                                <div className="p-5">
                                    <h4 className="font-bold text-slate-800 line-clamp-1 mb-2 group-hover:text-indigo-600 transition-colors uppercase text-[11px] tracking-tight">{p.title}</h4>
                                    <div className="flex items-center justify-between">
                                        <span className="text-base font-black text-slate-900">R$ {p.priceBRL.toLocaleString('pt-BR')}</span>
                                        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M12 4v16m8-8H4" /></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FAQ / Q&A SECTION */}
                <div className="mt-32">
                    <div className="flex flex-col md:flex-row gap-12">
                        <div className="md:w-1/3">
                            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Perguntas Frequentes</h3>
                            <p className="text-slate-500 font-medium mb-6">Tire suas dúvidas sobre o produto, entrega e garantia direto com o vendedor.</p>
                            <button
                                onClick={() => openChat(product.sellerId, product.sellerName)}
                                className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition-all shadow-lg"
                            >
                                Fazer uma Pergunta
                            </button>
                        </div>
                        <div className="md:w-2/3 space-y-4">
                            {[
                                { q: "O produto é novo e original?", a: "Sim, todos os produtos vendidos pela Mega Tech CDE são 100% originais, lacrados de fábrica e com garantia do fabricante." },
                                { q: "Como funciona a garantia?", a: "Este produto possui 12 meses de garantia contra defeitos de fabricação, que pode ser acionada diretamente com a marca ou através do nosso suporte." },
                                { q: "Qual o prazo de postagem?", a: "Após a confirmação do pagamento, seu pedido é processado e postado em até 24 horas úteis." }
                            ].map((faq, i) => (
                                <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 group hover:border-indigo-200 transition-colors">
                                    <h4 className="text-sm font-black text-slate-800 mb-2 flex items-center gap-2">
                                        <span className="text-indigo-600 text-lg">?</span>
                                        {faq.q}
                                    </h4>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed pl-6">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
