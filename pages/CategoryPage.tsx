import React, { useState, useMemo, useEffect } from 'react';
import { CATEGORY_MAP } from '../constants';
import { Product } from '../types';
import Breadcrumbs from '../components/Breadcrumbs';
import { ProductGridSkeleton } from '../components/ProductGridSkeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../services/utils';
import { useCart } from '../context/CartContext';
import { supabase } from '../services/supabaseClient';

// ─── Types ───────────────────────────────────────────────────────────────────

interface CategoryPageProps {
    slug: string;
}

type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'newest';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'relevance', label: 'Mais Relevantes' },
    { value: 'price-asc', label: 'Menor Preço' },
    { value: 'price-desc', label: 'Maior Preço' },
    { value: 'rating', label: 'Melhor Avaliação' },
    { value: 'newest', label: 'Novidades' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(s => (
            <svg key={s} xmlns="http://www.w3.org/2000/svg"
                className={`h-3 w-3 ${s <= Math.round(rating) ? 'text-amber-400' : 'text-slate-200'}`}
                viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
        ))}
    </div>
);

const CategoryCircle: React.FC<{ cat: any; active: boolean; onClick: () => void; isDark?: boolean }> = ({ cat, active, onClick, isDark }) => (
    <div
        onClick={onClick}
        className="flex flex-col items-center gap-3 cursor-pointer group flex-shrink-0 min-w-[80px]"
    >
        <div className={cn(
            "w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 transition-all duration-300 transform group-hover:scale-110",
            active
                ? "border-indigo-600 ring-4 ring-indigo-50 shadow-lg scale-110 " + (isDark ? "ring-offset-black ring-indigo-500/30" : "ring-indigo-50")
                : (isDark ? "border-white/10 shadow-sm group-hover:border-white/20" : "border-white shadow-sm group-hover:border-indigo-200")
        )}>
            <img
                src={cat.img || `https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=200&h=200&fit=crop&q=80`}
                alt={cat.label}
                className="w-full h-full object-cover"
            />
        </div>
        <span className={cn(
            "text-[11px] font-black uppercase tracking-wider text-center max-w-[80px] leading-tight transition-colors",
            active
                ? "text-indigo-500"
                : (isDark ? "text-slate-400 group-hover:text-white" : "text-slate-500 group-hover:text-slate-800")
        )}>
            {cat.label}
        </span>
    </div>
);

const ProductCard: React.FC<{ product: Product; featured?: boolean; isDark?: boolean }> = ({ product, featured, isDark }) => {
    const discount = Math.round((1 - product.priceBRL / product.comparePriceBRL) * 100);
    const [imgError, setImgError] = useState(false);
    const fallbackImg = `https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&q=80`;

    return (
        <div
            className={cn(
                "group rounded-2xl overflow-hidden cursor-pointer transition-all duration-300",
                featured
                    ? "border-2 shadow-md hover:shadow-2xl " + (isDark ? "border-white/10 hover:border-white/20 hover:shadow-white/5" : "border-indigo-100 hover:shadow-indigo-50")
                    : "border shadow-sm hover:shadow-xl " + (isDark ? "bg-[#141414] border-white/5 hover:border-white/20" : "bg-white border-slate-100 hover:shadow-slate-50")
            )}
            onClick={() => { window.location.hash = `#product/${product.id}`; window.scrollTo(0, 0); }}
        >
            {/* Image */}
            <div className={`relative overflow-hidden bg-slate-50 ${featured ? 'aspect-[4/5]' : 'aspect-square'}`}>
                <img
                    src={imgError ? fallbackImg : product.images[0]}
                    alt={product.title}
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Badges */}
                {discount > 0 && (
                    <span className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                        -{discount}%
                    </span>
                )}
                {product.isVerified && (
                    <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-indigo-600 text-[10px] font-black px-2 py-1 rounded-full flex items-center gap-1 shadow-md border border-indigo-50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        AUTÊNTICO
                    </span>
                )}
            </div>

            {/* Info */}
            <div className="p-4">
                <p className={cn("text-[10px] font-bold uppercase tracking-widest mb-1 leading-none", isDark ? "text-slate-500" : "text-slate-400")}>{product.sellerName}</p>
                <p className={cn("text-[14px] font-bold line-clamp-2 leading-tight mb-2 h-10 transition-colors", isDark ? "text-white group-hover:text-indigo-400" : "text-slate-900 group-hover:text-indigo-600")}>{product.title}</p>
                <div className="flex items-center gap-1 mb-3">
                    <StarRating rating={product.rating} />
                    <span className={cn("text-[11px] font-medium", isDark ? "text-slate-500" : "text-slate-400")}>({product.rating})</span>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className={cn("text-lg font-black", isDark ? "text-white" : "text-slate-950")}>
                        R$ {product.priceBRL.toLocaleString('pt-BR')}
                    </span>
                    {product.comparePriceBRL > product.priceBRL && (
                        <span className={cn("text-[12px] line-through", isDark ? "text-slate-600" : "text-slate-400")}>
                            R$ {product.comparePriceBRL.toLocaleString('pt-BR')}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Main Component ────────────────────────────────────────────────────────────

const CategoryPage: React.FC<CategoryPageProps> = ({ slug }) => {
    const config = CATEGORY_MAP[slug] || CATEGORY_MAP['celulares']; // fallback
    const { addToCart } = useCart();

    // Dark Mode detection for Tech Categories
    const isDark = slug === 'apple' || slug === 'games';

    // Filters state
    const [priceMin, setPriceMin] = useState(0);
    const [priceMax, setPriceMax] = useState(100000);
    const [minRating, setMinRating] = useState(0);
    const [verifiedOnly, setVerifiedOnly] = useState(false);
    const [sortBy, setSortBy] = useState<SortOption>('relevance');
    const [activeDiscount, setActiveDiscount] = useState<number>(0);
    const [activeSubCat, setActiveSubCat] = useState<string | null>(null);
    const [activeBrand, setActiveBrand] = useState<string | null>(null);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        async function fetchCategoryProducts() {
            setIsLoading(true);
            try {
                let query = supabase.from('products').select('*');

                if (config && config.productFilter) {
                    query = query.ilike('category_name', `%${config.productFilter}%`);
                }

                const { data, error } = await query;

                if (!error && data) {
                    const transformed: Product[] = data.map((p: any) => ({
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
                    }));
                    setProducts(transformed);
                }
            } catch (err) {
                console.error('Error fetching category products:', err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchCategoryProducts();
    }, [slug, config]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [slug]);

    // Filter products locally for speed and responsiveness
    const filteredProducts = useMemo(() => {
        let list = [...products];

        // Subcategory filter (local selection)
        if (activeSubCat) {
            list = list.filter(p =>
                p.title.toLowerCase().includes(activeSubCat.toLowerCase()) ||
                p.category.toLowerCase().includes(activeSubCat.toLowerCase())
            );
        }

        // Brand filter
        if (activeBrand) {
            list = list.filter(p =>
                p.title.toLowerCase().includes(activeBrand.toLowerCase()) ||
                p.sellerName.toLowerCase().includes(activeBrand.toLowerCase())
            );
        }

        // Price filter
        list = list.filter(p => p.priceBRL >= priceMin && p.priceBRL <= priceMax);

        // Rating filter
        if (minRating > 0) {
            list = list.filter(p => p.rating >= minRating);
        }

        // Verified filter
        if (verifiedOnly) {
            list = list.filter(p => p.isVerified);
        }

        // Discount filter
        if (activeDiscount > 0) {
            list = list.filter(p => {
                const disc = Math.round((1 - p.priceBRL / p.comparePriceBRL) * 100);
                return disc >= activeDiscount;
            });
        }

        // Sort
        switch (sortBy) {
            case 'price-asc': list.sort((a, b) => a.priceBRL - b.priceBRL); break;
            case 'price-desc': list.sort((a, b) => b.priceBRL - a.priceBRL); break;
            case 'rating': list.sort((a, b) => b.rating - a.rating); break;
            case 'newest': list.sort((a, b) => b.stock - a.stock); break; // mock newest
            default: break;
        }

        return list;
    }, [slug, products, priceMin, priceMax, minRating, verifiedOnly, activeDiscount, sortBy, activeSubCat, activeBrand]);

    const topSellers = useMemo(() =>
        [...filteredProducts].sort((a, b) => b.rating - a.rating).slice(0, 4),
        [filteredProducts]
    );

    const activeFiltersCount = [
        verifiedOnly, activeDiscount > 0, priceMin > 0, priceMax < 100000,
        minRating > 0, activeSubCat !== null, activeBrand !== null
    ].filter(Boolean).length;

    const clearFilters = () => {
        setPriceMin(0); setPriceMax(100000); setMinRating(0);
        setVerifiedOnly(false); setActiveDiscount(0);
        setActiveSubCat(null); setActiveBrand(null);
    };

    const FilterPanel = () => (
        <div className="space-y-6 text-sm">
            {/* Price */}
            <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Faixa de Preço</h4>
                <div className="flex gap-2">
                    <input
                        type="number" placeholder="Mín" value={priceMin || ''}
                        onChange={e => setPriceMin(Number(e.target.value) || 0)}
                        className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                    <input
                        type="number" placeholder="Máx" value={priceMax === 100000 ? '' : priceMax}
                        onChange={e => setPriceMax(Number(e.target.value) || 100000)}
                        className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                </div>
            </div>

            {/* Rating */}
            <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Avaliação</h4>
                <div className="space-y-2">
                    {[4, 3, 2].map(r => (
                        <button
                            key={r}
                            onClick={() => setMinRating(minRating === r ? 0 : r)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border transition-all ${minRating === r ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'}`}
                        >
                            <div className="flex items-center gap-1.5">
                                <StarRating rating={r} />
                                <span className="text-xs font-semibold">{r}+ estrelas</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Discount */}
            <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Desconto</h4>
                <div className="flex flex-wrap gap-2">
                    {[10, 20, 30, 50].map(d => (
                        <button
                            key={d}
                            onClick={() => setActiveDiscount(activeDiscount === d ? 0 : d)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${activeDiscount === d ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                            {d}%+
                        </button>
                    ))}
                </div>
            </div>

            {/* Verified Only */}
            <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Vendedor</h4>
                <label className="flex items-center gap-3 cursor-pointer">
                    <div
                        onClick={() => setVerifiedOnly(!verifiedOnly)}
                        className={`relative w-10 h-5 rounded-full transition-colors ${verifiedOnly ? 'bg-indigo-600' : 'bg-slate-200'}`}
                    >
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${verifiedOnly ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </div>
                    <span className="text-xs font-semibold text-slate-700">Apenas Verificados</span>
                </label>
            </div>

            {activeFiltersCount > 0 && (
                <button
                    onClick={clearFilters}
                    className="w-full py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:border-indigo-300 hover:text-indigo-600 transition-all"
                >
                    Limpar filtros ({activeFiltersCount})
                </button>
            )}
        </div>
    );

    return (
        <div className={cn(
            "min-h-screen transition-colors duration-500",
            isDark ? "bg-[#0a0a0a] text-slate-100" : "bg-[#fafafa] text-slate-900"
        )}>
            {/* ── HIGH FIDELITY HERO SECTION ───────────────────────────────────── */}
            <div className={cn(
                "border-b transition-colors duration-500",
                isDark ? "bg-black border-white/5" : "bg-white border-slate-100"
            )}>
                <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
                    <Breadcrumbs items={[{ label: config.label }]} />

                    {config.premiumHero ? (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-6">
                            {/* Promo Left (3 cards) */}
                            <div className="lg:col-span-3 flex flex-col gap-4">
                                {config.premiumHero.left.map((promo, idx) => (
                                    <div key={idx} className="relative h-32 rounded-3xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-all">
                                        <img src={promo.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={promo.title} />
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                                        <div className="absolute inset-0 flex items-center justify-center p-4">
                                            <span className={`text-white text-xl text-center leading-tight drop-shadow-md ${promo.font || 'font-black'}`}>
                                                {promo.title}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Main Banner */}
                            <div className="lg:col-span-6 relative h-64 lg:h-auto rounded-[40px] overflow-hidden group shadow-xl">
                                <img src={config.premiumHero.main} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Main Promo" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8 md:p-12">
                                    <div className="max-w-md">
                                        <span className="inline-block bg-white/20 backdrop-blur-md text-white border border-white/30 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-4">
                                            Exclusivo Mercado CDE
                                        </span>
                                        <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-[1.1] drop-shadow-sm">
                                            {config.label} <span className="text-white/70">Premium</span>
                                        </h2>
                                        <button className="bg-white text-slate-900 font-black px-8 py-3.5 rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-2 shadow-lg active:scale-95 group/btn">
                                            Explorar Ofertas
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                                                <path d="M5 12h14m-7-7l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Promo Right (3 cards) */}
                            <div className="lg:col-span-3 flex flex-col gap-4">
                                {config.premiumHero.right.map((promo, idx) => (
                                    <div key={idx} className="relative h-32 rounded-3xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-all">
                                        <img src={promo.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={promo.title} />
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                                        <div className="absolute inset-0 flex items-center justify-center p-4">
                                            <span className={`text-white text-xl text-center leading-tight drop-shadow-md ${promo.font || 'font-black'}`}>
                                                {promo.title}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* Standard Hero if no premium data */
                        <div className={`relative bg-gradient-to-br ${config.gradient} rounded-[40px] px-8 py-12 mt-6 overflow-hidden shadow-lg`}>
                            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                <div className="max-w-2xl text-white">
                                    <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight flex items-center gap-4">
                                        <div className="h-10 w-10 md:h-12 md:w-12 flex-shrink-0 [&>svg]:w-full [&>svg]:h-full">
                                            {config.iconPath}
                                        </div>
                                        {config.label}
                                    </h1>
                                    <p className="text-white/80 text-lg font-medium max-w-md">
                                        As melhores marcas e modelos de {config.label} com garantia e o melhor preço de Ciudad del Este.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── PREMIUM CIRCULAR CATEGORY GRID ───────────────────────────────────── */}
            <div className={cn(
                "py-10 border-b transition-colors duration-500",
                isDark ? "bg-black border-white/5" : "bg-white border-slate-50"
            )}>
                <div className="max-w-7xl mx-auto px-4 lg:px-6">
                    <div className="flex items-center gap-4 lg:gap-8 overflow-x-auto scrollbar-hide pb-2 justify-start lg:justify-between">
                        <CategoryCircle
                            cat={{ label: 'Ver Tudo', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop&q=80' }}
                            active={!activeSubCat}
                            onClick={() => setActiveSubCat(null)}
                            isDark={isDark}
                        />
                        {config.subCategories.map(sub => (
                            <CategoryCircle
                                key={sub.id}
                                cat={{ ...sub, img: sub.img }}
                                active={activeSubCat === sub.label}
                                onClick={() => setActiveSubCat(activeSubCat === sub.label ? null : sub.label)}
                                isDark={isDark}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* ── BRANDS STRIP ─────────────────────────────────────────────────────── */}
            {config.brands.length > 0 && (
                <div className="bg-white border-b border-slate-100 py-4">
                    <div className="max-w-7xl mx-auto px-4 lg:px-6 text-center">
                        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Principais Marcas</h2>
                        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
                            {config.brands.map(brand => (
                                <button
                                    key={brand.name}
                                    onClick={() => setActiveBrand(activeBrand === brand.name ? null : brand.name)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${activeBrand === brand.name ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-transparent text-slate-400 hover:text-slate-600 grayscale hover:grayscale-0'}`}
                                >
                                    <span className="text-xl w-6 h-6 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full">{brand.logo}</span>
                                    <span className="text-sm font-black whitespace-nowrap">{brand.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── TOP SELLERS (4 cards) ────────────────────────────────────────── */}
            <div className="bg-slate-50 py-12 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 lg:px-6">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Mais Vendidos</h2>
                            <p className="text-slate-500 text-sm font-medium">Os queridinhos da categoria {config.label}</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest rounded-full">🔥 Em Alta</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {topSellers.map(product => (
                            <ProductCard key={`top-${product.id}`} product={product} featured />
                        ))}
                    </div>
                </div>
            </div>

            {/* ── CONTENT: SIDEBAR + GRID ───────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
                <div className="flex gap-8">
                    {/* SIDEBAR FILTERS (desktop) */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <div className="sticky top-[80px]">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                                    </svg>
                                    Filtrar Resultados
                                </h3>
                                {activeFiltersCount > 0 && (
                                    <span className="bg-indigo-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                                        {activeFiltersCount}
                                    </span>
                                )}
                            </div>
                            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                                <FilterPanel />
                            </div>
                        </div>
                    </aside>

                    {/* MAIN CONTENT */}
                    <div className="flex-1 min-w-0">
                        {/* Sort bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 bg-white rounded-3xl border border-slate-100 shadow-sm px-6 py-4">
                            <p className="text-sm text-slate-500 font-medium">
                                <span className="font-black text-slate-900">{filteredProducts.length}</span> produtos encontrados
                            </p>
                            <div className="flex items-center gap-3">
                                {/* Mobile filter btn */}
                                <button
                                    onClick={() => setFiltersOpen(true)}
                                    className="lg:hidden flex items-center gap-1.5 px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-200"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                                    </svg>
                                    Filtros
                                    {activeFiltersCount > 0 && (
                                        <span className="ml-1 bg-indigo-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                                            {activeFiltersCount}
                                        </span>
                                    )}
                                </button>
                                {/* Sort */}
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:block">Ordenar:</span>
                                    <select
                                        value={sortBy}
                                        onChange={e => setSortBy(e.target.value as SortOption)}
                                        className="text-xs border-none bg-slate-50 rounded-xl px-4 py-2 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer"
                                    >
                                        {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Active filter chips */}
                        {activeFiltersCount > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {activeSubCat && (
                                    <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1.5 rounded-full border border-indigo-100">
                                        Sub: {activeSubCat}
                                        <button onClick={() => setActiveSubCat(null)} className="ml-1 hover:text-indigo-800 focus:outline-none">✕</button>
                                    </span>
                                )}
                                {activeBrand && (
                                    <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1.5 rounded-full border border-indigo-100">
                                        Marca: {activeBrand}
                                        <button onClick={() => setActiveBrand(null)} className="ml-1 hover:text-indigo-800 focus:outline-none">✕</button>
                                    </span>
                                )}
                                {verifiedOnly && (
                                    <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1.5 rounded-full border border-indigo-100">
                                        Apenas Verificados
                                        <button onClick={() => setVerifiedOnly(false)} className="ml-1 hover:text-indigo-800 focus:outline-none">✕</button>
                                    </span>
                                )}
                                {activeDiscount > 0 && (
                                    <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1.5 rounded-full border border-indigo-100">
                                        Desconto {activeDiscount}%+
                                        <button onClick={() => setActiveDiscount(0)} className="ml-1 hover:text-indigo-800 focus:outline-none">✕</button>
                                    </span>
                                )}
                                <button onClick={clearFilters} className="text-xs font-bold text-slate-400 hover:text-indigo-600 underline underline-offset-4 ml-2">
                                    Limpar tudo
                                </button>
                            </div>
                        )}

                        {/* Product grid */}
                        {isLoading ? (
                            <ProductGridSkeleton />
                        ) : filteredProducts.length > 0 ? (
                            <motion.div
                                layout
                                className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
                            >
                                <AnimatePresence mode='popLayout'>
                                    {filteredProducts.map(product => (
                                        <motion.div
                                            key={product.id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.4 }}
                                        >
                                            <ProductCard product={product} isDark={isDark} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        ) : (
                            <div className="text-center py-32 bg-white rounded-3xl border border-slate-100 shadow-sm">
                                <div className="text-6xl mb-6">🔍</div>
                                <p className="text-xl font-black text-slate-900 mb-2">Ops! Nenhum produto encontrado</p>
                                <p className="text-slate-500 text-sm mb-8 max-w-xs mx-auto">Tente ajustar seus filtros ou explore outra categoria para encontrar o que procura.</p>
                                <button
                                    onClick={clearFilters}
                                    className="px-8 py-3.5 bg-indigo-600 text-white font-black rounded-2xl hover:shadow-xl hover:shadow-indigo-200 transition-all transform hover:-translate-y-1"
                                >
                                    Limpar todos os filtros
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── CTA / NEWSLETTER ────────────────────────────────────────────────── */}
            <div className="bg-indigo-900 py-16 overflow-hidden relative">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
                <div className="max-w-7xl mx-auto px-4 lg:px-6 text-center relative z-10">
                    <h2 className="text-3xl font-black text-white mb-4">Receba ofertas de {config.label}</h2>
                    <p className="text-indigo-200 text-lg mb-8 max-w-xl mx-auto">Cadastre seu e-mail e seja o primeiro a saber sobre novos estoques e promoções exclusivas.</p>
                    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Seu melhor e-mail"
                            className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
                        />
                        <button className="bg-white text-indigo-900 font-black px-8 py-4 rounded-2xl hover:bg-indigo-50 transition-colors shadow-lg">
                            Cadastrar
                        </button>
                    </div>
                </div>
            </div>

            {/* ── MOBILE FILTER SHEET ───────────────────────────────────────────────── */}
            {filtersOpen && (
                <>
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setFiltersOpen(false)} />
                    <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] z-50 lg:hidden p-8 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
                        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8" />
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-black text-2xl text-slate-900 flex items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                                </svg>
                                Filtros
                            </h3>
                            <button onClick={() => setFiltersOpen(false)} className="p-3 bg-slate-100 rounded-2xl text-slate-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <FilterPanel />
                        <button
                            onClick={() => setFiltersOpen(false)}
                            className="w-full mt-10 py-4.5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 active:scale-95 transition-all text-center"
                        >
                            Ver {filteredProducts.length} Resultados
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CategoryPage;
