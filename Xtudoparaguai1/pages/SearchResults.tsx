import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { ProductGridSkeleton } from '../components/ProductGridSkeleton';

interface Product {
    id: string;
    title: string;
    price_brl: number;
    compare_price_brl: number;
    images: string[];
    category_name: string;
    seller_name: string;
    rating: number;
    is_verified: boolean;
    stock: number;
}

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

const SearchResults: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const { addToCart } = useCart();

    // Read query from hash URL: #search?q=term
    useEffect(() => {
        const readQuery = () => {
            const hash = window.location.hash; // e.g. "#search?q=iphone"
            const qIndex = hash.indexOf('?q=');
            if (qIndex !== -1) {
                const q = decodeURIComponent(hash.slice(qIndex + 3));
                setQuery(q);
                doSearch(q);
            }
        };
        readQuery();
        window.addEventListener('hashchange', readQuery);
        return () => window.removeEventListener('hashchange', readQuery);
    }, []);

    const doSearch = async (term: string) => {
        if (!term.trim()) return;
        setLoading(true);
        setSearched(true);
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .or(`title.ilike.%${term}%,description.ilike.%${term}%,category_name.ilike.%${term}%`)
                .order('rating', { ascending: false })
                .limit(48);
            if (!error && data) setResults(data);
        } catch (err) {
            console.error('Search error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        window.location.hash = `#search?q=${encodeURIComponent(query.trim())}`;
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Search Bar */}
            <div className="bg-white border-b border-slate-100 py-6">
                <div className="max-w-7xl mx-auto px-4 lg:px-6">
                    <form onSubmit={handleSubmit} className="flex gap-3 max-w-2xl">
                        <div className="flex flex-1 bg-slate-100 rounded-2xl border border-slate-200 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                            <input
                                type="text"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                placeholder="Buscar produtos, marcas, categorias..."
                                className="flex-1 bg-transparent px-5 py-3.5 text-sm text-slate-700 placeholder-slate-400 font-medium focus:outline-none"
                                autoFocus
                            />
                        </div>
                        <button
                            type="submit"
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95 shadow-md shadow-indigo-100"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Buscar
                        </button>
                    </form>
                    {searched && !loading && (
                        <p className="mt-3 text-sm text-slate-500 font-medium">
                            {results.length > 0
                                ? <><span className="font-black text-slate-900">{results.length}</span> resultados para "<span className="text-indigo-600 font-bold">{query}</span>"</>
                                : <>Nenhum resultado para "<span className="text-indigo-600 font-bold">{query}</span>"</>
                            }
                        </p>
                    )}
                </div>
            </div>

            {/* Results */}
            <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10">
                {loading ? (
                    <ProductGridSkeleton />
                ) : results.length > 0 ? (
                    <motion.div layout className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AnimatePresence>
                            {results.map(product => {
                                const discount = product.compare_price_brl > product.price_brl
                                    ? Math.round((1 - product.price_brl / product.compare_price_brl) * 100)
                                    : 0;
                                return (
                                    <motion.div
                                        key={product.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all cursor-pointer group"
                                        onClick={() => { window.location.hash = `#product/${product.id}`; window.scrollTo(0, 0); }}
                                    >
                                        {/* Image */}
                                        <div className="relative aspect-square overflow-hidden rounded-t-2xl bg-slate-50">
                                            <img
                                                src={product.images?.[0] || 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400&q=80'}
                                                alt={product.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            {discount > 0 && (
                                                <span className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                                                    -{discount}%
                                                </span>
                                            )}
                                            {product.is_verified && (
                                                <span className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm text-indigo-600 text-[10px] font-black px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                    </svg>
                                                    AUTÊNTICO
                                                </span>
                                            )}
                                        </div>
                                        {/* Info */}
                                        <div className="p-4">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{product.seller_name}</p>
                                            <p className="text-sm font-bold text-slate-900 line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">{product.title}</p>
                                            <div className="flex items-center gap-1 mb-3">
                                                <StarRating rating={product.rating || 4.5} />
                                                <span className="text-[11px] text-slate-400">({product.rating || '4.5'})</span>
                                            </div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-lg font-black text-slate-900">
                                                    R$ {Number(product.price_brl).toLocaleString('pt-BR')}
                                                </span>
                                                {discount > 0 && (
                                                    <span className="text-xs line-through text-slate-400">
                                                        R$ {Number(product.compare_price_brl).toLocaleString('pt-BR')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                ) : searched && !loading ? (
                    /* Empty state */
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="text-7xl mb-6">🔍</div>
                        <h2 className="text-2xl font-black text-slate-900 mb-3">Nenhum produto encontrado</h2>
                        <p className="text-slate-500 max-w-md mb-8">
                            Tente outros termos como a marca, categoria ou modelo do produto.
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {['iPhone', 'Samsung', 'PlayStation', 'Perfume', 'Drone'].map(s => (
                                <button
                                    key={s}
                                    onClick={() => { setQuery(s); window.location.hash = `#search?q=${encodeURIComponent(s)}`; }}
                                    className="px-4 py-2 bg-indigo-50 text-indigo-700 font-bold text-sm rounded-xl hover:bg-indigo-100 transition-colors"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* Initial state */
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="text-6xl mb-4">🛍️</div>
                        <h2 className="text-xl font-black text-slate-900 mb-2">O que você está procurando?</h2>
                        <p className="text-slate-400 text-sm">Digite acima para encontrar produtos, marcas e categorias.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResults;
