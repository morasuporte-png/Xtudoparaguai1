import React, { useState, useMemo } from 'react';
import { MOCK_PRODUCTS } from '../constants';
import { Product } from '../types';
import Breadcrumbs from '../components/Breadcrumbs';

interface SearchPageProps {
    query: string;
}

type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'newest';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'relevance', label: 'Mais Relevantes' },
    { value: 'price-asc', label: 'Menor Preço' },
    { value: 'price-desc', label: 'Maior Preço' },
    { value: 'rating', label: 'Melhor Avaliação' },
    { value: 'newest', label: 'Novidades' },
];

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const [imgError, setImgError] = useState(false);
    const fallbackImg = `https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&q=80`;

    return (
        <div
            className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer overflow-hidden group"
            onClick={() => window.location.hash = `#product/${product.id}`}
        >
            <div className="aspect-square bg-slate-50 relative overflow-hidden">
                <img
                    src={imgError ? fallbackImg : product.images[0]}
                    alt={product.title}
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.isVerified && (
                    <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-indigo-600 text-[10px] font-black px-2 py-1 rounded-full shadow-sm">
                        ✓ Verificado
                    </span>
                )}
            </div>
            <div className="p-4">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">{product.sellerName}</p>
                <h3 className="text-sm font-bold text-slate-800 line-clamp-2 mb-2 h-10">{product.title}</h3>
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-slate-200'}`} viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                    </div>
                    <span className="text-[11px] text-slate-400 font-bold">{product.rating}</span>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-lg font-black text-slate-900">R$ {product.priceBRL.toLocaleString()}</span>
                    {product.comparePriceBRL > product.priceBRL && (
                        <span className="text-xs text-slate-400 line-through">R$ {product.comparePriceBRL.toLocaleString()}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

const SearchPage: React.FC<SearchPageProps> = ({ query }) => {
    const [priceMin, setPriceMin] = useState(0);
    const [priceMax, setPriceMax] = useState(100000);
    const [minRating, setMinRating] = useState(0);
    const [verifiedOnly, setVerifiedOnly] = useState(false);
    const [sortBy, setSortBy] = useState<SortOption>('relevance');

    const filteredProducts = useMemo(() => {
        let results = MOCK_PRODUCTS.filter(p =>
            p.title.toLowerCase().includes(query.toLowerCase()) ||
            p.description.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase()) ||
            p.sellerName.toLowerCase().includes(query.toLowerCase())
        );

        // Apply filters
        results = results.filter(p => p.priceBRL >= priceMin && p.priceBRL <= priceMax);
        if (minRating > 0) results = results.filter(p => p.rating >= minRating);
        if (verifiedOnly) results = results.filter(p => p.isVerified);

        // Sort
        switch (sortBy) {
            case 'price-asc': results.sort((a, b) => a.priceBRL - b.priceBRL); break;
            case 'price-desc': results.sort((a, b) => b.priceBRL - a.priceBRL); break;
            case 'rating': results.sort((a, b) => b.rating - a.rating); break;
            case 'newest': results.sort((a, b) => b.stock - a.stock); break;
            default: break;
        }

        return results;
    }, [query, priceMin, priceMax, minRating, verifiedOnly, sortBy]);

    return (
        <div className="min-h-screen bg-[#fafafa]">
            <div className="bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
                    <Breadcrumbs items={[{ label: 'Busca', hash: '#search' }, { label: query }]} />
                    <h1 className="text-2xl font-black text-slate-900 mt-2">
                        Resultados para "{query}"
                        <span className="ml-3 text-sm font-medium text-slate-400">{filteredProducts.length} itens encontrados</span>
                    </h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
                        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                            <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest mb-6">Filtrar</h3>

                            <div className="space-y-6">
                                {/* Price */}
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Preço</h4>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number" placeholder="Mín" value={priceMin || ''}
                                            onChange={e => setPriceMin(Number(e.target.value))}
                                            className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-100 outline-none"
                                        />
                                        <input
                                            type="number" placeholder="Máx" value={priceMax === 100000 ? '' : priceMax}
                                            onChange={e => setPriceMax(Number(e.target.value) || 100000)}
                                            className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-100 outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Rating */}
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Avaliação</h4>
                                    <div className="space-y-2">
                                        {[4, 3, 2].map(r => (
                                            <label key={r} className="flex items-center gap-3 cursor-pointer group">
                                                <input
                                                    type="checkbox" checked={minRating === r}
                                                    onChange={() => setMinRating(minRating === r ? 0 : r)}
                                                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-900">{r}+ estrelas</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Verified */}
                                <div>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox" checked={verifiedOnly}
                                            onChange={() => setVerifiedOnly(!verifiedOnly)}
                                            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-900">Apenas Vendedores Verificados</span>
                                    </label>
                                </div>

                                <button
                                    onClick={() => { setPriceMin(0); setPriceMax(100000); setMinRating(0); setVerifiedOnly(false); }}
                                    className="w-full py-2 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors"
                                >
                                    Limpar Filtros
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <div className="text-sm font-medium text-slate-500">
                                Ordenado por:
                                <select
                                    value={sortBy}
                                    onChange={e => setSortBy(e.target.value as SortOption)}
                                    className="ml-2 bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
                                >
                                    {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                            </div>
                        </div>

                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-20 text-center">
                                <div className="text-4xl mb-4">🔍</div>
                                <h2 className="text-xl font-black text-slate-900 mb-2">Nenhum resultado encontrado</h2>
                                <p className="text-slate-500 max-w-xs mx-auto text-sm">Tente buscar por termos mais genéricos ou confira nossas categorias recomendadas.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
