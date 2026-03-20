
import React, { useMemo, useState } from 'react';
import { getCategoryTree } from '../services/categoryService';
import { motion } from 'framer-motion';
import Breadcrumbs from '../components/Breadcrumbs';

const AllCategoriesPage: React.FC = () => {
    const categoryTree = useMemo(() => getCategoryTree(), []);
    const [search, setSearch] = useState('');

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const totalCats = useMemo(() =>
        categoryTree.reduce((acc, d) => acc + d.categories.length, 0), [categoryTree]);
    const totalSubs = useMemo(() =>
        categoryTree.reduce((acc, d) => acc + d.categories.reduce((a, c) => a + c.subCategories.length, 0), 0), [categoryTree]);

    const filtered = useMemo(() => {
        if (!search.trim()) return categoryTree;
        const q = search.toLowerCase();
        return categoryTree.map(dept => ({
            ...dept,
            categories: dept.categories.filter(
                cat => cat.label.toLowerCase().includes(q) ||
                    cat.subCategories.some(s => s.label.toLowerCase().includes(q))
            )
        })).filter(d => d.categories.length > 0);
    }, [categoryTree, search]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">

            {/* ── Hero ───────────────────────────────────────────────────────── */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

                <div className="relative max-w-7xl mx-auto px-4 lg:px-6 py-14">
                    <Breadcrumbs items={[{ label: 'Todas as Categorias' }]} dark />

                    <div className="mt-8 max-w-3xl">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/80 text-xs font-bold px-4 py-1.5 rounded-full mb-5 border border-white/10">
                            🇵🇾 Direto de Ciudad del Este
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight leading-tight">
                            Explore Todas as <span className="text-indigo-300">Categorias</span>
                        </h1>
                        <p className="text-indigo-200 text-base font-medium mb-8 max-w-xl">
                            {categoryTree.length} departamentos · {totalCats} categorias · {totalSubs}+ especialidades
                        </p>

                        {/* Search */}
                        <div className="relative max-w-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Buscar categoria ou subcategoria..."
                                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/40 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/15 transition-all"
                            />
                            {search && (
                                <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Category Grid ─────────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
                {filtered.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-5xl mb-4">🔍</p>
                        <p className="text-slate-500 font-bold">Nenhuma categoria encontrada para "{search}"</p>
                        <button onClick={() => setSearch('')} className="mt-4 text-indigo-600 font-black text-sm hover:underline">Limpar busca</button>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((dept, deptIdx) => {
                        const subCount = dept.categories.reduce((acc, c) => acc + c.subCategories.length, 0);
                        // Top subcategories flat list for preview chips
                        const topSubs = dept.categories.flatMap(c => c.subCategories).slice(0, 6);

                        return (
                            <motion.div
                                key={dept.id}
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: deptIdx * 0.06, duration: 0.35, ease: 'easeOut' }}
                                className="group rounded-[28px] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-400 flex flex-col border border-slate-100/60"
                            >
                                {/* Dept Header with full gradient */}
                                <button
                                    onClick={() => window.location.hash = `#category/${dept.id}`}
                                    className={`relative overflow-hidden bg-gradient-to-br ${dept.gradient || 'from-indigo-600 to-indigo-800'} p-6 text-left w-full`}
                                >
                                    {/* Shimmer */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                    {/* Background circle accent */}
                                    <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10" />
                                    <div className="absolute -right-2 -bottom-6 w-16 h-16 rounded-full bg-white/5" />

                                    <div className="relative flex items-center gap-4">
                                        <span className="text-5xl drop-shadow-md">{dept.emoji || '📦'}</span>
                                        <div>
                                            <h2 className="text-xl font-black text-white uppercase tracking-tight leading-tight">{dept.label}</h2>
                                            <p className="text-white/60 text-xs font-bold mt-1">
                                                {dept.categories.length} categorias · {subCount} subcategorias
                                            </p>
                                        </div>
                                    </div>

                                    {/* Top subcats preview chips */}
                                    <div className="flex flex-wrap gap-1.5 mt-4">
                                        {topSubs.map(sub => (
                                            <span key={sub.id} className="text-[10px] font-bold text-white/70 bg-white/15 px-2.5 py-1 rounded-full border border-white/10">
                                                {sub.label}
                                            </span>
                                        ))}
                                        {subCount > 6 && (
                                            <span className="text-[10px] font-bold text-white/50 bg-white/10 px-2.5 py-1 rounded-full">
                                                +{subCount - 6} mais
                                            </span>
                                        )}
                                    </div>
                                </button>

                                {/* Categories List */}
                                <div className="bg-white p-5 flex-1">
                                    <div className="space-y-4">
                                        {dept.categories.slice(0, 4).map((cat) => (
                                            <div key={cat.id}>
                                                <button
                                                    className="text-sm font-black text-slate-800 flex items-center justify-between w-full group/cat hover:text-indigo-600 transition-colors mb-2"
                                                    onClick={() => window.location.hash = `#category/${dept.id}/${cat.id}`}
                                                >
                                                    {cat.label}
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 opacity-0 group-hover/cat:opacity-100 -translate-x-1 group-hover/cat:translate-x-0 transition-all text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {cat.subCategories.slice(0, 8).map((sub) => (
                                                        <button
                                                            key={sub.id}
                                                            onClick={() => window.location.hash = `#category/${dept.id}/${cat.id}/${sub.id}`}
                                                            className="text-[11px] font-semibold text-slate-500 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 px-2.5 py-1 rounded-lg border border-slate-100 hover:border-indigo-100 transition-all"
                                                        >
                                                            {sub.label}
                                                        </button>
                                                    ))}
                                                    {cat.subCategories.length > 8 && (
                                                        <span className="text-[10px] text-slate-400 font-bold px-1 py-1 self-center">
                                                            +{cat.subCategories.length - 8}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        {dept.categories.length > 4 && (
                                            <p className="text-xs text-slate-400 font-bold pt-1">
                                                +{dept.categories.length - 4} categorias adicionais
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Footer CTA */}
                                <button
                                    onClick={() => window.location.hash = `#category/${dept.id}`}
                                    className={`w-full py-3.5 text-xs font-black text-white bg-gradient-to-r ${dept.gradient || 'from-indigo-600 to-indigo-700'} hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}
                                >
                                    Ver {dept.label} completo
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AllCategoriesPage;
