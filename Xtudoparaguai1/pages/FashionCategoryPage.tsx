import React, { useState, useMemo } from 'react';
import { MOCK_PRODUCTS } from '../constants';
import { Product } from '../types';

// ─── Types ───────────────────────────────────────────────────────────────────

type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
type GenderFilter = 'all' | 'feminino' | 'masculino' | 'unissex';

// ─── Data ─────────────────────────────────────────────────────────────────────

const FASHION_SUBCATEGORIES = [
    { id: 'all', label: 'Tudo em Moda', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>, color: 'from-rose-500 to-pink-600', bg: 'bg-rose-50', text: 'text-rose-600', categories: [] },
    { id: 'feminino', label: 'Moda Feminina', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 12V21M12 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm-3 6h6" /></svg>, color: 'from-pink-500 to-rose-500', bg: 'bg-pink-50', text: 'text-pink-600', categories: ['Moda Feminina'] },
    { id: 'masculino', label: 'Moda Masculina', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12l3 3m0 0l-3 3m3-3H13m0 0a5 5 0 1 1-10 0 5 5 0 0 1 10 0z" /></svg>, color: 'from-slate-600 to-slate-800', bg: 'bg-slate-50', text: 'text-slate-700', categories: ['Moda Masculina'] },
    { id: 'infantil', label: 'Infantil & Bebês', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="3" /><rect x="6" y="2" width="12" height="20" rx="4" /></svg>, color: 'from-sky-400 to-cyan-500', bg: 'bg-sky-50', text: 'text-sky-600', categories: ['Moda Infantil', 'Moda Bebê'] },
    { id: 'tenis', label: 'Tênis Importados', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>, color: 'from-orange-500 to-amber-500', bg: 'bg-orange-50', text: 'text-orange-600', categories: ['Tênis Importados'] },
    { id: 'perfumes', label: 'Perfumes Premium', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6l1 5.95C17.4 11.35 17 14 17 14a5 5 0 0 1-10 0s-.4-2.65 1-5.05L9 3z" /></svg>, color: 'from-violet-500 to-purple-600', bg: 'bg-violet-50', text: 'text-violet-600', categories: ['Perfumes Premium'] },
    { id: 'plus-size', label: 'Plus Size', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>, color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50', text: 'text-emerald-600', categories: ['Moda Feminina', 'Moda Masculina'] },
];

const CAT_FEMS = [
    { id: 'feminino', label: 'Vestidos', img: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=200&h=200&fit=crop&q=80' },
    { id: 'feminino', label: 'Blusas & Tops', img: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=200&h=200&fit=crop&q=80' },
    { id: 'feminino', label: 'Calças', img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200&h=200&fit=crop&q=80' },
    { id: 'feminino', label: 'Lingerie', img: 'https://images.unsplash.com/photo-1441123285228-140c608d9894?w=200&h=200&fit=crop&q=80' },
    { id: 'feminino', label: 'Praia', img: 'https://images.unsplash.com/photo-1502030059145-9e5b2f1107ec?w=200&h=200&fit=crop&q=80' },
    { id: 'feminino', label: 'Plus Size', img: 'https://images.unsplash.com/photo-1594911773962-b15c3243c7b7?w=200&h=200&fit=crop&q=80' },
    { id: 'feminino', label: 'Sapatos', img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&h=200&fit=crop&q=80' },
    { id: 'feminino', label: 'Bolsas', img: 'https://images.unsplash.com/photo-1584917469897-5a94e5e3a44a?w=200&h=200&fit=crop&q=80' },
    { id: 'feminino', label: 'Acessórios', img: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a1b?w=200&h=200&fit=crop&q=80' },
    { id: 'feminino', label: 'Beleza', img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200&h=200&fit=crop&q=80' },
];

const CAT_MASC = [
    { id: 'masculino', label: 'Camisetas', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop&q=80' },
    { id: 'masculino', label: 'Polos', img: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=200&h=200&fit=crop&q=80' },
    { id: 'masculino', label: 'Calças', img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop&q=80' },
    { id: 'masculino', label: 'Berlinas', img: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=200&h=200&fit=crop&q=80' },
    { id: 'masculino', label: 'Social', img: 'https://images.unsplash.com/photo-1594932224456-80fd7b9525c3?w=200&h=200&fit=crop&q=80' },
    { id: 'masculino', label: 'Esporte', img: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=200&h=200&fit=crop&q=80' },
    { id: 'masculino', label: 'Tênis', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop&q=80' },
    { id: 'masculino', label: 'Underwear', img: 'https://images.unsplash.com/photo-1570158268183-d296b2892211?w=200&h=200&fit=crop&q=80' },
    { id: 'masculino', label: 'Relógios', img: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=200&h=200&fit=crop&q=80' },
    { id: 'masculino', label: 'Perfumes', img: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=200&h=200&fit=crop&q=80' },
];

const ALL_CATS_ROW1 = [
    { id: 'feminino', label: 'Feminino', img: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=200&h=200&fit=crop&q=80' },
    { id: 'all', label: 'Plus Size', img: 'https://images.unsplash.com/photo-1594911773962-b15c3243c7b7?w=200&h=200&fit=crop&q=80' },
    { id: 'infantil', label: 'Infantil', img: 'https://images.unsplash.com/photo-1519702777435-c19736201b1a?w=200&h=200&fit=crop&q=80' },
    { id: 'masculino', label: 'Masculino', img: 'https://images.unsplash.com/photo-1505022610485-0249ba5b3675?w=200&h=200&fit=crop&q=80' },
    { id: 'tenis', label: 'Esportiva', img: 'https://images.unsplash.com/photo-1518310321283-4a088bb91dd0?w=200&h=200&fit=crop&q=80' },
    { id: 'all', label: 'Tops', img: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=200&h=200&fit=crop&q=80' },
    { id: 'all', label: 'Lingerie', img: 'https://images.unsplash.com/photo-1441123285228-140c608d9894?w=200&h=200&fit=crop&q=80' },
    { id: 'all', label: 'Acessórios', img: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a1b?w=200&h=200&fit=crop&q=80' },
    { id: 'perfumes', label: 'Beleza', img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200&h=200&fit=crop&q=80' },
    { id: 'bolsas', label: 'Bolsas', img: 'https://images.unsplash.com/photo-1584917469897-5a94e5e3a44a?w=200&h=200&fit=crop&q=80' },
];

const ALL_CATS_ROW2 = [
    { id: 'all', label: 'Jóias', img: 'https://images.unsplash.com/photo-1515562141207-7a183dc3c051?w=200&h=200&fit=crop&q=80' },
    { id: 'all', label: 'Casa', img: 'https://images.unsplash.com/photo-1583847268964-b28cd2909a62?w=200&h=200&fit=crop&q=80' },
    { id: 'infantil', label: 'Bebê', img: 'https://images.unsplash.com/photo-1522771935876-0497556f8972?w=200&h=200&fit=crop&q=80' },
    { id: 'all', label: 'Saúde', img: 'https://images.unsplash.com/photo-1511174511562-5f7f18b854c8?w=200&h=200&fit=crop&q=80' },
    { id: 'tenis', label: 'Calçados', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop&q=80' },
    { id: 'all', label: 'Praia', img: 'https://images.unsplash.com/photo-1502030059145-9e5b2f1107ec?w=200&h=200&fit=crop&q=80' },
    { id: 'all', label: 'Vestidos', img: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=200&h=200&fit=crop&q=80' },
    { id: 'all', label: 'Escritório', img: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=200&h=200&fit=crop&q=80' },
    { id: 'oculos', label: 'Óculos', img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop&q=80' },
    { id: 'all', label: 'Eletrônicos', img: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=200&h=200&fit=crop&q=80' },
];

const FASHION_CATEGORIES_ALL = [
    'Moda Feminina', 'Moda Masculina', 'Tênis Importados',
    'Bolsas & Acessórios', 'Relógios de Luxo', 'Perfumes Premium',
    'Óculos & Ótica', 'Malas & Viagem', 'Moda Infantil', 'Moda Bebê',
];

const BRANDS = [
    { name: 'Nike', logo: 'N', color: 'bg-black text-white' },
    { name: 'Adidas', logo: 'A', color: 'bg-black text-white' },
    { name: 'Lacoste', logo: 'L', color: 'bg-green-700 text-white' },
    { name: 'Hugo Boss', logo: 'B', color: 'bg-slate-900 text-white' },
    { name: 'Ray-Ban', logo: 'R', color: 'bg-red-700 text-white' },
    { name: 'Tom Ford', logo: 'T', color: 'bg-amber-900 text-white' },
    { name: 'New Balance', logo: 'NB', color: 'bg-blue-800 text-white' },
    { name: 'Samsonite', logo: 'S', color: 'bg-indigo-900 text-white' },
    { name: 'Chanel', logo: 'C', color: 'bg-black text-white' },
    { name: 'Rolex', logo: 'R', color: 'bg-yellow-600 text-black' },
];

const SIZES_CLOTHES = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG'];
const SIZES_SHOES = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];
const COLORS = [
    { name: 'Preto', bg: 'bg-black' },
    { name: 'Branco', bg: 'bg-white border border-slate-200' },
    { name: 'Bege', bg: 'bg-amber-100' },
    { name: 'Azul', bg: 'bg-blue-600' },
    { name: 'Vermelho', bg: 'bg-red-500' },
    { name: 'Verde', bg: 'bg-green-600' },
    { name: 'Rosa', bg: 'bg-pink-400' },
    { name: 'Marrom', bg: 'bg-amber-800' },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'relevance', label: 'Mais Relevantes' },
    { value: 'price-asc', label: 'Menor Preço' },
    { value: 'price-desc', label: 'Maior Preço' },
    { value: 'rating', label: 'Melhor Avaliação' },
    { value: 'newest', label: 'Novidades' },
];

const CategoryCircle: React.FC<{ cat: any; active: boolean; onClick: () => void }> = ({ cat, active, onClick }) => (
    <button
        onClick={onClick}
        className="flex-shrink-0 group flex flex-col items-center gap-2 lg:gap-3"
    >
        <div className={`relative w-16 h-16 lg:w-24 lg:h-24 rounded-full overflow-hidden border-2 transition-all duration-300
            ${active ? 'border-pink-500 scale-110 shadow-lg' : 'border-slate-100 group-hover:border-pink-200'}`}>
            <img src={cat.img} alt={cat.label} className="w-full h-full object-cover" />
        </div>
        <span className={`text-[10px] lg:text-xs font-black transition-colors ${active ? 'text-pink-600' : 'text-slate-600 group-hover:text-pink-500'}`}>
            {cat.label}
        </span>
    </button>
);

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

const FashionProductCard: React.FC<{ product: Product; featured?: boolean }> = ({ product, featured }) => {
    const discount = Math.round((1 - product.priceBRL / product.comparePriceBRL) * 100);
    const [imgError, setImgError] = useState(false);

    const fallbackImg = `https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&q=80`;

    return (
        <div
            className={`group bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300
        ${featured
                    ? 'border-2 border-rose-200 shadow-md hover:shadow-2xl hover:shadow-rose-100 hover:-translate-y-1'
                    : 'border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-100 hover:-translate-y-0.5'
                }`}
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
                {featured && (
                    <span className="absolute top-2 left-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                        🔥 Mais Vendido
                    </span>
                )}
                {product.isVerified && (
                    <span className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm text-indigo-600 text-[9px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Verificado
                    </span>
                )}
                {/* Hover CTA */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
                    <span className="bg-white text-slate-900 text-xs font-bold px-4 py-2 rounded-xl shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        Ver Produto →
                    </span>
                </div>
            </div>

            {/* Info */}
            <div className="p-3">
                <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">{product.sellerName}</p>
                <p className="text-[13px] font-semibold text-slate-800 line-clamp-2 leading-snug mb-1.5">{product.title}</p>
                <div className="flex items-center gap-1 mb-2">
                    <StarRating rating={product.rating} />
                    <span className="text-[10px] text-slate-400">({product.rating})</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg font-black text-slate-900">
                        R$ {product.priceBRL.toLocaleString('pt-BR')}
                    </span>
                    {product.comparePriceBRL > product.priceBRL && (
                        <span className="text-[11px] text-slate-300 line-through">
                            R$ {product.comparePriceBRL.toLocaleString('pt-BR')}
                        </span>
                    )}
                </div>
                <p className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Frete grátis para todo o Brasil
                </p>
            </div>
        </div>
    );
};

// ─── Main Component ────────────────────────────────────────────────────────────

const FashionCategoryPage: React.FC<{ subcategory?: string }> = ({ subcategory = 'all' }) => {
    const [activeSubCat, setActiveSubCat] = useState(subcategory);
    const [sortBy, setSortBy] = useState<SortOption>('relevance');
    const [gender, setGender] = useState<GenderFilter>('all');
    const [priceMin, setPriceMin] = useState(0);
    const [priceMax, setPriceMax] = useState(10000);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [verifiedOnly, setVerifiedOnly] = useState(false);
    const [activeDiscount, setActiveDiscount] = useState(0);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [brandFilter, setBrandFilter] = useState('');
    const [sizeTab, setSizeTab] = useState<'clothes' | 'shoes'>('clothes');

    // Layouts dinâmicos por subcategoria
    const subCatLayouts: Record<string, any> = {
        'all': {
            hero: {
                main: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80',
                left: [
                    { title: 'Lançamentos', img: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=500&q=80', font: 'font-serif italic' },
                    { title: 'Coleção Outono', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80', font: 'font-black' },
                    { title: 'Casual Wear', img: 'https://images.unsplash.com/photo-1445205170230-053b830c6039?w=500&q=80', font: 'font-extrabold uppercase' },
                ],
                right: [
                    { title: 'Acessórios Premium', img: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a1b?w=400&h=400&fit=crop&q=80', font: 'font-serif italic' },
                    { title: 'Street Style', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop&q=80', font: 'font-black' },
                    { title: 'Bolsas Luxury', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop&q=80', font: 'font-extrabold uppercase' },
                ]
            }
        },
        'feminino': {
            hero: {
                main: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=80',
                left: [
                    { title: 'Vestidos de Gala', img: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&q=80', font: 'font-serif italic' },
                    { title: 'Trend Verão', img: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&q=80', font: 'font-black' },
                    { title: 'Trabalho Chic', img: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=500&q=80', font: 'font-extrabold uppercase' },
                ],
                right: [
                    { title: 'Lingerie Noite', img: 'https://images.unsplash.com/photo-1441113941324-913364f9b238?w=500&q=80', font: 'font-serif italic' },
                    { title: 'Jeans Fit', img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80', font: 'font-black' },
                    { title: 'Bijoux Gold', img: 'https://images.unsplash.com/photo-1515562141207-7a183dc3c051?w=500&q=80', font: 'font-extrabold uppercase' },
                ]
            }
        },
        'masculino': {
            hero: {
                main: 'https://images.unsplash.com/photo-1488161628813-244a20adbc99?w=1200&q=80',
                left: [
                    { title: 'Alfaiataria Premium', img: 'https://images.unsplash.com/photo-1594932224456-80fd7b9525c3?w=500&q=80', font: 'font-serif italic' },
                    { title: 'Casual Friday', img: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=500&q=80', font: 'font-black' },
                    { title: 'Sport Deluxe', img: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=500&q=80', font: 'font-extrabold uppercase' },
                ],
                right: [
                    { title: 'Sneakers Drop', img: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500&q=80', font: 'font-serif italic' },
                    { title: 'Tech Wear', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&q=80', font: 'font-black' },
                    { title: 'Acessórios Couro', img: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500&q=80', font: 'font-extrabold uppercase' },
                ]
            }
        },
        'infantil': {
            hero: {
                main: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=1200&q=80',
                left: [
                    { title: 'Recém Nascidos', img: 'https://images.unsplash.com/photo-1522771935876-0497556f8972?w=500&q=80', font: 'font-serif italic' },
                    { title: 'Diversão & Cor', img: 'https://images.unsplash.com/photo-1519702777435-c19736201b1a?w=500&q=80', font: 'font-black' },
                    { title: 'Batizado', img: 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?w=500&q=80', font: 'font-extrabold uppercase' },
                ],
                right: [
                    { title: 'Escolar', img: 'https://images.unsplash.com/photo-1518310321283-4a088bb91dd0?w=500&q=80', font: 'font-serif italic' },
                    { title: 'Sleepwear', img: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=500&q=80', font: 'font-black' },
                    { title: 'Brinquedos', img: 'https://images.unsplash.com/photo-1532330393533-443990a51d10?w=500&q=80', font: 'font-extrabold uppercase' },
                ]
            }
        },
        'plus-size': {
            hero: {
                main: 'https://images.unsplash.com/photo-1594911773962-b15c3243c7b7?w=1200&q=80',
                left: [
                    { title: 'Curvas Elegantes', img: 'https://images.unsplash.com/photo-1572804013307-f97119affded?w=500&q=80', font: 'font-serif italic' },
                    { title: 'Confort Plus', img: 'https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=500&q=80', font: 'font-black' },
                    { title: 'Trend All Size', img: 'https://images.unsplash.com/photo-1550630968-67443253593f?w=500&q=80', font: 'font-extrabold uppercase' },
                ],
                right: [
                    { title: 'Jeans Perfeito', img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80', font: 'font-serif italic' },
                    { title: 'Office Plus', img: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=500&q=80', font: 'font-black' },
                    { title: 'Banhode Sol', img: 'https://images.unsplash.com/photo-1502030059145-9e5b2f1107ec?w=500&q=80', font: 'font-extrabold uppercase' },
                ]
            }
        }
    };

    const currentLayout = subCatLayouts[activeSubCat] || subCatLayouts['all'];
    const subCatMeta = FASHION_SUBCATEGORIES.find(s => s.id === (activeSubCat === 'all' ? 'all' : activeSubCat)) || FASHION_SUBCATEGORIES[0];

    // ── Filtered & sorted products ─────────────────────────────────────────────
    const allFashionProducts = useMemo(() => {
        return MOCK_PRODUCTS.filter(p => FASHION_CATEGORIES_ALL.includes(p.category));
    }, []);

    const filteredProducts = useMemo(() => {
        let products = [...allFashionProducts];

        // Subcategory
        if (activeSubCat !== 'all') {
            const cats = subCatMeta.categories;
            if (cats.length > 0) {
                products = products.filter(p => cats.includes(p.category));
            }
        }

        // Price
        products = products.filter(p => p.priceBRL >= priceMin && p.priceBRL <= priceMax);

        // Verified
        if (verifiedOnly) products = products.filter(p => p.isVerified);

        // Discount
        if (activeDiscount > 0) {
            products = products.filter(p => {
                const d = Math.round((1 - p.priceBRL / p.comparePriceBRL) * 100);
                return d >= activeDiscount;
            });
        }

        // Sort
        switch (sortBy) {
            case 'price-asc': products.sort((a, b) => a.priceBRL - b.priceBRL); break;
            case 'price-desc': products.sort((a, b) => b.priceBRL - a.priceBRL); break;
            case 'rating': products.sort((a, b) => b.rating - a.rating); break;
            default: break;
        }

        return products;
    }, [allFashionProducts, activeSubCat, subCatMeta, priceMin, priceMax, verifiedOnly, activeDiscount, sortBy]);

    const topSellers = useMemo(() =>
        [...allFashionProducts].sort((a, b) => b.rating - a.rating).slice(0, 4),
        [allFashionProducts]
    );

    const toggleSize = (s: string) =>
        setSelectedSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

    const toggleColor = (c: string) =>
        setSelectedColors(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

    const activeFiltersCount = [
        verifiedOnly, activeDiscount > 0, priceMin > 0, priceMax < 10000,
        selectedSizes.length > 0, selectedColors.length > 0, gender !== 'all',
    ].filter(Boolean).length;

    const clearFilters = () => {
        setPriceMin(0); setPriceMax(10000); setVerifiedOnly(false);
        setActiveDiscount(0); setSelectedSizes([]); setSelectedColors([]);
        setGender('all'); setBrandFilter('');
    };

    // ── Filter panel ───────────────────────────────────────────────────────────
    const FilterPanel = () => (
        <div className="space-y-8 text-sm">

            {/* Gender */}
            <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Gênero</h4>
                <div className="flex flex-wrap gap-2">
                    {(['all', 'feminino', 'masculino', 'unissex'] as GenderFilter[]).map(g => (
                        <button
                            key={g}
                            onClick={() => setGender(g)}
                            className={`flex-1 min-w-[80px] px-4 py-2.5 rounded-xl text-xs font-bold border transition-all duration-200 ${gender === g
                                ? 'bg-pink-500 text-white border-pink-500 shadow-md shadow-pink-100 scale-105'
                                : 'bg-white border-slate-100 text-slate-600 hover:border-pink-200 hover:bg-pink-50/30'
                                }`}
                        >
                            {g === 'all' ? 'Todos' : g.charAt(0).toUpperCase() + g.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price */}
            <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Faixa de Preço</h4>
                <div className="flex gap-2 items-center">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">R$</span>
                        <input
                            type="number" placeholder="Mín" value={priceMin || ''}
                            onChange={e => setPriceMin(Number(e.target.value) || 0)}
                            className="w-full text-xs border border-slate-100 bg-slate-50/50 rounded-xl pl-8 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:bg-white transition-all"
                        />
                    </div>
                    <div className="text-slate-300">—</div>
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">R$</span>
                        <input
                            type="number" placeholder="Máx" value={priceMax === 10000 ? '' : priceMax}
                            onChange={e => setPriceMax(Number(e.target.value) || 10000)}
                            className="w-full text-xs border border-slate-100 bg-slate-50/50 rounded-xl pl-8 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:bg-white transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Size */}
            <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tamanho</h4>
                <div className="flex gap-1 mb-2">
                    {(['clothes', 'shoes'] as const).map(t => (
                        <button key={t} onClick={() => setSizeTab(t)}
                            className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all ${sizeTab === t ? 'bg-rose-100 text-rose-600' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                                }`}>
                            {t === 'clothes' ? 'Roupas' : 'Calçados'}
                        </button>
                    ))}
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {(sizeTab === 'clothes' ? SIZES_CLOTHES : SIZES_SHOES).map(s => (
                        <button key={s} onClick={() => toggleSize(s)}
                            className={`w-10 h-8 rounded-lg text-xs font-bold border transition-all ${selectedSizes.includes(s)
                                ? 'bg-rose-500 text-white border-rose-500'
                                : 'border-slate-200 text-slate-600 hover:border-rose-300'
                                }`}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Color */}
            <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Cor</h4>
                <div className="flex flex-wrap gap-2">
                    {COLORS.map(c => (
                        <button key={c.name} onClick={() => toggleColor(c.name)}
                            title={c.name}
                            className={`w-7 h-7 rounded-full transition-all ${c.bg} ${selectedColors.includes(c.name) ? 'ring-2 ring-offset-1 ring-rose-500 scale-110' : 'hover:scale-105'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Discount */}
            <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Desconto</h4>
                <div className="flex flex-wrap gap-1.5">
                    {[10, 20, 30, 50].map(d => (
                        <button key={d} onClick={() => setActiveDiscount(activeDiscount === d ? 0 : d)}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${activeDiscount === d
                                ? 'bg-rose-500 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}>
                            {d}%+
                        </button>
                    ))}
                </div>
            </div>

            {/* Verified only */}
            <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Vendedor</h4>
                <label className="flex items-center gap-3 cursor-pointer">
                    <div
                        onClick={() => setVerifiedOnly(v => !v)}
                        className={`relative w-10 h-5 rounded-full transition-colors ${verifiedOnly ? 'bg-rose-500' : 'bg-slate-200'}`}
                    >
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${verifiedOnly ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </div>
                    <span className="text-xs font-semibold text-slate-700">Apenas Verificados</span>
                </label>
            </div>

            {/* Clear */}
            {activeFiltersCount > 0 && (
                <button onClick={clearFilters}
                    className="w-full py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:border-rose-300 hover:text-rose-600 transition-all">
                    Limpar filtros ({activeFiltersCount})
                </button>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fafafa]">

            {/* ── SHEIN-STYLE HERO ─────────────────────────────────────────────────── */}
            <div className="bg-white py-6">
                <div className="max-w-7xl mx-auto px-4 lg:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                        {/* 1. Left Visual Promos (Simetrizado com a direita) */}
                        <div className="hidden lg:flex lg:col-span-3 flex-col gap-4">
                            {currentLayout.hero.left.map((promo: any, idx: number) => (
                                <div key={idx} className="relative flex-1 rounded-xl overflow-hidden group cursor-pointer border border-slate-100 shadow-sm">
                                    <img src={promo.img} alt={promo.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center p-4 text-center">
                                        <h4 className={`${promo.font} text-white text-xl drop-shadow-md leading-tight`}>{promo.title}</h4>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 2. Main Large Banner */}
                        <div className="lg:col-span-6">
                            <div className="relative aspect-[16/9] lg:aspect-auto lg:h-full min-h-[400px] rounded-2xl overflow-hidden shadow-lg group">
                                <img
                                    src={currentLayout.hero.main}
                                    alt="Festival de Moda"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8">
                                    <div className="max-w-md">
                                        <div className="inline-flex items-center gap-2 bg-pink-500 text-white text-[10px] font-black px-3 py-1 rounded-full mb-4 animate-bounce">
                                            TEMPORADA DE PREÇOS BAIXOS
                                        </div>
                                        <h2 className="text-white text-3xl md:text-6xl font-black leading-none mb-3 italic tracking-tighter">FESTIVAL DE<br />{activeSubCat === 'all' ? 'MODA' : activeSubCat.toUpperCase()}</h2>
                                        <p className="text-white/90 text-sm font-bold mb-6 flex items-center gap-2">
                                            A partir de <span className="bg-white text-pink-600 px-2 py-0.5 rounded text-4xl font-black">R$ 19,90</span>
                                        </p>
                                        <button className="bg-white text-slate-900 font-black px-10 py-4 rounded-full hover:bg-pink-50 transition-all shadow-2xl hover:scale-105 active:scale-95">
                                            EU QUERO →
                                        </button>
                                    </div>
                                </div>
                                {/* Dots pagination (decorative) */}
                                <div className="absolute bottom-6 right-8 flex gap-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === 1 ? 'w-8 bg-white' : 'w-2 bg-white/40'}`} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 3. Right Visual Promos (visible on lg) */}
                        <div className="hidden lg:flex lg:col-span-3 flex-col gap-4">
                            {currentLayout.hero.right.map((promo: any, idx: number) => (
                                <div key={idx} className="relative flex-1 rounded-xl overflow-hidden group cursor-pointer border border-slate-100 shadow-sm">
                                    <img src={promo.img} alt={promo.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center p-4 text-center">
                                        <h4 className={`${promo.font} text-white text-xl drop-shadow-md leading-tight`}>{promo.title}</h4>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── SHEIN-STYLE CATEGORY GRID (DYNAMIC) ─────────────────────────────── */}
            <div className="bg-white border-b border-slate-50 py-10">
                <div className="max-w-7xl mx-auto px-4 lg:px-6">
                    <div className="flex flex-col gap-6">
                        {activeSubCat === 'feminino' ? (
                            <div className="flex justify-start lg:justify-between items-center gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-2">
                                {CAT_FEMS.map(cat => (
                                    <CategoryCircle key={cat.label} cat={cat} active={false} onClick={() => { /* Opção de sub-filtro futuro */ }} />
                                ))}
                            </div>
                        ) : activeSubCat === 'masculino' ? (
                            <div className="flex justify-start lg:justify-between items-center gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-2">
                                {CAT_MASC.map(cat => (
                                    <CategoryCircle key={cat.label} cat={cat} active={false} onClick={() => { /* Opção de sub-filtro futuro */ }} />
                                ))}
                            </div>
                        ) : (
                            <>
                                {/* Row 1 */}
                                <div className="flex justify-start lg:justify-between items-center gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-2">
                                    {ALL_CATS_ROW1.map(cat => (
                                        <CategoryCircle key={cat.label} cat={cat} active={activeSubCat === cat.id} onClick={() => { window.location.hash = `#moda/${cat.id}`; setActiveSubCat(cat.id); }} />
                                    ))}
                                </div>
                                {/* Row 2 */}
                                <div className="flex justify-start lg:justify-between items-center gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-2">
                                    {ALL_CATS_ROW2.map(cat => (
                                        <CategoryCircle key={cat.label} cat={cat} active={activeSubCat === cat.id} onClick={() => { window.location.hash = `#moda/${cat.id}`; setActiveSubCat(cat.id); }} />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* ── BRANDS STRIP ─────────────────────────────────────────────────────── */}
            <div className="bg-white border-b border-slate-100 py-4">
                <div className="max-w-7xl mx-auto px-4 lg:px-6">
                    <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Marcas Parceiras</h2>
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
                        {BRANDS.map(brand => (
                            <button
                                key={brand.name}
                                onClick={() => setBrandFilter(brandFilter === brand.name ? '' : brand.name)}
                                className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${brandFilter === brand.name
                                    ? brand.color + ' shadow-md scale-105'
                                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                    }`}
                            >
                                <span>{brand.logo}</span>
                                <span>{brand.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── MAIS VENDIDOS ─────────────────────────────────────────────────────── */}
            {activeSubCat === 'all' && (
                <div className="bg-gradient-to-b from-white to-slate-50 py-8">
                    <div className="max-w-7xl mx-auto px-4 lg:px-6">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className="text-xl font-black text-slate-900">🔥 Mais Vendidos</h2>
                                <p className="text-xs text-slate-500 mt-0.5">Os favoritos dos compradores esta semana</p>
                            </div>
                            <button
                                onClick={() => setActiveSubCat('all')}
                                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                            >
                                Ver todos →
                            </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {topSellers.map(p => (
                                <FashionProductCard key={p.id} product={p} featured />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── BANNER GUIA DE TAMANHOS ───────────────────────────────────────────── */}
            {activeSubCat === 'all' && (
                <div className="max-w-7xl mx-auto px-4 lg:px-6 mb-6">
                    <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            <h3 className="text-white font-black text-lg mb-1">📏 Guia de Tamanhos Completo</h3>
                            <p className="text-indigo-200 text-sm">Compre sem dúvidas! Confira as tabelas de medidas para roupas e calçados de todas as marcas.</p>
                        </div>
                        <button className="flex-shrink-0 bg-white text-indigo-700 font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors whitespace-nowrap">
                            Ver Guia →
                        </button>
                    </div>
                </div>
            )}

            {/* ── CONTENT: SIDEBAR + GRID ───────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
                <div className="flex gap-6">

                    {/* SIDEBAR FILTERS (desktop) */}
                    <aside className="hidden lg:block w-56 flex-shrink-0">
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sticky top-[72px]">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                                    </svg>
                                    Filtros
                                </h3>
                                {activeFiltersCount > 0 && (
                                    <span className="bg-rose-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                                        {activeFiltersCount}
                                    </span>
                                )}
                            </div>
                            <FilterPanel />
                        </div>
                    </aside>

                    {/* MAIN CONTENT */}
                    <div className="flex-1 min-w-0">
                        {/* Sort bar */}
                        <div className="flex items-center justify-between mb-5 gap-3 bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-3">
                            <p className="text-sm text-slate-500 font-medium">
                                <span className="font-extrabold text-slate-900">{filteredProducts.length}</span> produtos encontrados
                                {activeSubCat !== 'all' && (
                                    <span className="ml-2 text-rose-500 font-bold">— {subCatMeta.label}</span>
                                )}
                            </p>
                            <div className="flex items-center gap-2">
                                {/* Mobile filter btn */}
                                <button
                                    onClick={() => setFiltersOpen(true)}
                                    className="lg:hidden flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 relative"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                                    </svg>
                                    Filtros
                                    {activeFiltersCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                                            {activeFiltersCount}
                                        </span>
                                    )}
                                </button>
                                {/* Sort */}
                                <select
                                    value={sortBy}
                                    onChange={e => setSortBy(e.target.value as SortOption)}
                                    className="text-xs border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white cursor-pointer"
                                >
                                    {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Active filter chips */}
                        {(selectedSizes.length > 0 || selectedColors.length > 0 || gender !== 'all') && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {gender !== 'all' && (
                                    <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-600 text-xs font-bold px-3 py-1 rounded-full">
                                        {gender}
                                        <button onClick={() => setGender('all')} className="ml-0.5 hover:text-rose-800">✕</button>
                                    </span>
                                )}
                                {selectedSizes.map(s => (
                                    <span key={s} className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-600 text-xs font-bold px-3 py-1 rounded-full">
                                        Tam. {s}
                                        <button onClick={() => toggleSize(s)} className="ml-0.5 hover:text-rose-800">✕</button>
                                    </span>
                                ))}
                                {selectedColors.map(c => (
                                    <span key={c} className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-600 text-xs font-bold px-3 py-1 rounded-full">
                                        {c}
                                        <button onClick={() => toggleColor(c)} className="ml-0.5 hover:text-rose-800">✕</button>
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Product grid */}
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                {filteredProducts.map(product => (
                                    <FashionProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24">
                                <div className="text-6xl mb-4">👗</div>
                                <p className="text-lg font-bold text-slate-700 mb-2">Nenhum produto encontrado</p>
                                <p className="text-slate-400 text-sm mb-6">Tente ajustar os filtros ou explore outra subcategoria</p>
                                <button
                                    onClick={clearFilters}
                                    className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                                >
                                    Limpar filtros
                                </button>
                            </div>
                        )}

                        {/* Load more (decorative) */}
                        {filteredProducts.length > 0 && (
                            <div className="flex justify-center mt-8">
                                <button className="flex items-center gap-2 px-8 py-3 border-2 border-rose-200 text-rose-600 font-bold rounded-2xl hover:bg-rose-50 transition-all">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                    Carregar mais produtos
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── PROMO BANNER BOTTOM ───────────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 lg:px-6 pb-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { icon: '🔒', title: 'Compra Protegida', desc: 'Garantia de reembolso em até 30 dias se não chegar.', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' },
                        { icon: '✈️', title: 'Importado Oficial', desc: 'Nota fiscal paraguaia e documentação de importação inclusa.', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' },
                        { icon: '🏷️', title: 'Melhor Preço', desc: 'Encontrou mais barato? Nós igualamos o preço para você.', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100' },
                    ].map(item => (
                        <div key={item.title} className={`${item.bg} border ${item.border} rounded-2xl p-5 flex items-start gap-4`}>
                            <span className="text-3xl flex-shrink-0">{item.icon}</span>
                            <div>
                                <h4 className={`font-black text-sm ${item.text} mb-1`}>{item.title}</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── MOBILE FILTER SHEET ───────────────────────────────────────────────── */}
            {filtersOpen && (
                <>
                    <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setFiltersOpen(false)} />
                    <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 lg:hidden p-6 max-h-[85vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="font-extrabold text-slate-900 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                                </svg>
                                Filtros
                            </h3>
                            <button onClick={() => setFiltersOpen(false)} className="p-2 rounded-xl hover:bg-slate-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <FilterPanel />
                        <button
                            onClick={() => setFiltersOpen(false)}
                            className="w-full mt-5 py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-2xl hover:shadow-lg transition-all"
                        >
                            Ver {filteredProducts.length} produtos
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default FashionCategoryPage;
