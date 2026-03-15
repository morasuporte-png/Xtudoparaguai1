
import React, { useMemo } from 'react';
import { getCategoryTree } from '../services/categoryService';
import { motion } from 'framer-motion';
import Breadcrumbs from '../components/Breadcrumbs';

const AllCategoriesPage: React.FC = () => {
    const categoryTree = useMemo(() => getCategoryTree(), []);

    // Scroll to top on mount
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[#fafafa] pb-20">
            {/* Header / Hero */}
            <div className="bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
                    <Breadcrumbs items={[{ label: 'Todas as Categorias' }]} />
                    
                    <div className="mt-8">
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                            Explore Todas as <span className="text-indigo-600">Categorias</span>
                        </h1>
                        <p className="text-slate-500 text-lg font-medium max-w-2xl">
                            Encontre exatamente o que você procura navegando em nosso mapa completo de departamentos e especialidades do Mercado CDE.
                        </p>
                    </div>
                </div>
            </div>

            {/* Category Grid */}
            <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categoryTree.map((dept, deptIdx) => (
                        <motion.div
                            key={dept.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: deptIdx * 0.05 }}
                            className="bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
                        >
                            {/* Dept Header */}
                            <div className={`p-6 bg-gradient-to-br ${dept.gradient || 'from-indigo-600 to-indigo-800'} text-white`}>
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl">
                                        {dept.iconPath || (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                            </svg>
                                        )}
                                    </div>
                                    <h2 className="text-xl font-black uppercase tracking-tight leading-tight">{dept.label}</h2>
                                </div>
                                <p className="text-white/70 text-xs font-bold uppercase tracking-widest">
                                    {dept.categories.length} Categorias Principais
                                </p>
                            </div>

                            {/* Categories List */}
                            <div className="p-6 flex-1 overflow-y-auto max-h-[400px] scrollbar-hide">
                                <div className="space-y-6">
                                    {dept.categories.map((cat) => (
                                        <div key={cat.id} className="space-y-2">
                                            <h3 
                                                className="text-sm font-black text-slate-950 flex items-center justify-between group cursor-pointer hover:text-indigo-600 transition-colors"
                                                onClick={() => window.location.hash = `#category/${dept.id}/${cat.id}`}
                                            >
                                                {cat.label}
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all font-bold" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </h3>
                                            <div className="flex flex-wrap gap-1.5">
                                                {cat.subCategories.slice(0, 12).map((sub) => (
                                                    <button
                                                        key={sub.id}
                                                        onClick={() => window.location.hash = `#category/${dept.id}/${cat.id}/${sub.id}`}
                                                        className="text-[11px] font-semibold text-slate-500 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 px-2.5 py-1 rounded-lg border border-slate-100 transition-all"
                                                    >
                                                        {sub.label}
                                                    </button>
                                                ))}
                                                {cat.subCategories.length > 12 && (
                                                    <span className="text-[10px] text-slate-400 font-bold px-1 py-1">
                                                        +{cat.subCategories.length - 12} mais
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer link */}
                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
                                <button 
                                    onClick={() => window.location.hash = `#category/${dept.id}`}
                                    className="w-full py-2 text-xs font-black text-slate-500 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    Ver Departamento Completo
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AllCategoriesPage;
