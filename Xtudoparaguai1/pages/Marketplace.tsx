
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MOCK_PRODUCTS, CATEGORIES } from '../constants';
import { getCategoryTree } from '../services/categoryService';
import { Product } from '../types';
import { analyzeDeal, getSmartSearchSuggestions } from '../services/geminiService';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import ProductModal from '../components/ProductModal';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductGridSkeleton } from '../components/ProductGridSkeleton';
import { cn } from '../services/utils';
import { supabase } from '../services/supabaseClient';

// ─── Hero carousel slides ─────────────────────────────────────────────────────
const HERO_SLIDES = [
  {
    id: 0, tag: '', title: '', subtitle: '', highlight: '', cta: '', badge: '', badgeLabel: '',
    ctaAction: () => { },
    bg: 'from-[#f59e0b] to-[#d97706]', accent: '#fff',
    img: '', bgImage: '/banner-xtudo.png', bgVideo: '/comercial.mp4',
  },
  {
    id: 1, tag: '🔥 Mega Deal', title: 'iPhone 15 Pro Max', subtitle: 'Direto de Ciudad del Este',
    highlight: 'Até 30% abaixo do varejo BR', cta: 'Ver Oferta',
    ctaAction: () => { window.location.hash = '#seller/s1'; },
    bg: 'from-[#1e1b4b] via-[#312e81] to-[#4338ca]', accent: '#a5b4fc',
    img: 'https://picsum.photos/seed/iphone15/500/500', badge: 'R$ 6.890', badgeLabel: 'A partir de',
  },
  {
    id: 2, tag: '⚡ Flash Sale', title: 'PS5 Slim', subtitle: '2 Controles DualSense inclusos',
    highlight: 'Estoque limitado — 42 unids.', cta: 'Aproveitar Agora',
    ctaAction: () => { window.location.hash = '#seller/s2'; },
    bg: 'from-[#0f172a] via-[#1e3a5f] to-[#1d4ed8]', accent: '#93c5fd',
    img: 'https://picsum.photos/seed/ps5/500/500', badge: 'R$ 3.250', badgeLabel: 'Por apenas',
  },
  {
    id: 3, tag: '🤖 IA Exclusivo', title: 'AI Deal Analyzer', subtitle: 'Analise qualquer produto em segundos',
    highlight: 'Tecnologia Gemini — 100% grátis', cta: 'Explorar Produtos',
    ctaAction: () => { },
    bg: 'from-[#1a0533] via-[#4a1276] to-[#6d28d9]', accent: '#c4b5fd',
    img: 'https://picsum.photos/seed/ai-tech/500/500', badge: 'GRÁTIS', badgeLabel: 'Disponível',
  },
];


const QUICK_ACCESS = [
  { icon: '🚚', label: 'Frete Grátis', desc: 'Para todo o BR', bg: 'bg-emerald-50 hover:bg-emerald-100', icon_bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-100' },
  { icon: '⚡', label: 'Flash Sale', desc: 'Até 80% OFF', bg: 'bg-amber-50 hover:bg-amber-100', icon_bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-100' },
  { icon: '🛡️', label: 'Compra Segura', desc: 'Garantia XTUDO', bg: 'bg-violet-50 hover:bg-violet-100', icon_bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-100' },
  { icon: '✅', label: 'Verificados', desc: '+12k sellers', bg: 'bg-indigo-50 hover:bg-indigo-100', icon_bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-100' },
  { icon: '🏷️', label: 'Cupons CDE', desc: 'Economize mais', bg: 'bg-rose-50 hover:bg-rose-100', icon_bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-100' },
  { icon: '✨', label: 'Novidades', desc: 'Recém chegados', bg: 'bg-sky-50 hover:bg-sky-100', icon_bg: 'bg-sky-100', text: 'text-sky-700', border: 'border-sky-100' },
];

// ─── Trust badges ─────────────────────────────────────────────────────────────
const TRUST_BADGES = [
  { icon: '🇵🇾', title: 'Direto de CDE', desc: 'Compra verificada em Ciudad del Este' },
  { icon: '🚚', title: 'Frete Grátis', desc: 'Para todo o território nacional' },
  { icon: '🔒', title: 'Compra Segura', desc: '100% protegido pela XTUDO' },
  { icon: '↩️', title: 'Devolução 30 dias', desc: 'Sem burocracia' },
];

// ─── Category images ─────────────────────────────────────────────────────────
const CATEGORY_IMAGES: Record<string, string> = {
  'Celulares': 'https://picsum.photos/seed/phones-cde/200/200',
  'Produtos Apple': 'https://picsum.photos/seed/apple-cde/200/200',
  'Notebook': 'https://picsum.photos/seed/laptop-cde/200/200',
  'Games & Consoles': 'https://picsum.photos/seed/games-cde/200/200',
  'Eletrônicos': 'https://picsum.photos/seed/tv-cde/200/200',
  'Informática': 'https://picsum.photos/seed/pc-cde/200/200',
  'Perfumes Premium': 'https://picsum.photos/seed/perfume-cde/200/200',
  'Relógios de Luxo': 'https://picsum.photos/seed/watch-cde/200/200',
  'Óculos & Ótica': 'https://picsum.photos/seed/glasses-cde/200/200',
  'Tênis Importados': 'https://picsum.photos/seed/sneakers-cde/200/200',
  'Malas & Viagem': 'https://picsum.photos/seed/luggage-cde/200/200',
  'Câmeras & Foto': 'https://picsum.photos/seed/camera-cde/200/200',
  'Drones': 'https://picsum.photos/seed/drone-cde/200/200',
  'Áudio & Fones': 'https://picsum.photos/seed/audio-cde/200/200',
  'Smartwatch & Wearables': 'https://picsum.photos/seed/wearable-cde/200/200',
  'Som Automotivo': 'https://picsum.photos/seed/car-audio-cde/200/200',
  'Acessórios Automotivos': 'https://picsum.photos/seed/car-acc-cde/200/200',
  'Casa & Eletrodomésticos': 'https://picsum.photos/seed/home-cde/200/200',
  'Lazer & Hobby': 'https://picsum.photos/seed/hobby-cde/200/200',
  'Saúde & Beleza': 'https://picsum.photos/seed/beauty-cde/200/200',
  'Brinquedos & Kids': 'https://picsum.photos/seed/toys-cde/200/200',
  'Ferramentas': 'https://picsum.photos/seed/tools-cde/200/200',
  'Pet Shop': 'https://picsum.photos/seed/pet-cde/200/200',
  'Ofertas & Promoções': 'https://picsum.photos/seed/deals-cde/200/200',
};


// ─── Countdown hook ───────────────────────────────────────────────────────────

function useCountdown() {
  const getEndOfDay = () => {
    const e = new Date(); e.setHours(23, 59, 59, 999); return e.getTime();
  };
  const [endTs] = useState(getEndOfDay);
  const [remaining, setRemaining] = useState(endTs - Date.now());
  useEffect(() => {
    const t = setInterval(() => setRemaining(p => Math.max(0, p - 1000)), 1000);
    return () => clearInterval(t);
  }, []);
  return {
    h: Math.floor(remaining / 3_600_000),
    m: Math.floor((remaining % 3_600_000) / 60_000),
    s: Math.floor((remaining % 60_000) / 1_000),
  };
}

const TimeBlock: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <div className="bg-slate-900 text-white w-11 h-11 rounded-xl flex items-center justify-center font-black text-base tabular-nums shadow-md ring-1 ring-white/5">
      {String(value).padStart(2, '0')}
    </div>
    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{label}</span>
  </div>
);

// ─── Hero Carousel ────────────────────────────────────────────────────────────
const HeroCarousel: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const go = useCallback((idx: number) => setCurrent((idx + HERO_SLIDES.length) % HERO_SLIDES.length), []);

  useEffect(() => {
    timerRef.current = setInterval(() => go(current + 1), 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [current, go]);

  const slide = HERO_SLIDES[current];

  return (
    <div className="relative rounded-[28px] overflow-hidden h-[300px] md:h-[380px] shadow-xl mb-5 select-none">
      {/* Background priority: video > image > gradient */}
      {slide.bgVideo ? (
        <>
          <video
            key={slide.bgVideo}
            src={slide.bgVideo}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Overlay to ensure legibility if content is added later */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </>
      ) : slide.bgImage ? (
        <img
          src={slide.bgImage}
          alt="Banner XTUDO Paraguai"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        />
      ) : (
        <>
          <div className={`absolute inset-0 bg-gradient-to-br ${slide.bg} transition-all duration-700`} />
          {/* Decorative */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/[0.04] rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
          <div className="absolute bottom-0 left-12 w-48 h-48 bg-white/[0.04] rounded-full blur-2xl translate-y-1/3" />
          {/* Content */}
          <div className="relative z-10 h-full flex items-center px-8 md:px-12 gap-6">
            <div className="flex-1 min-w-0">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.15em] px-3.5 py-1.5 rounded-full bg-white/[0.12] text-white backdrop-blur-sm mb-5 border border-white/10">
                {slide.tag}
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-[1.05] tracking-tight mb-2 max-w-xs">{slide.title}</h2>
              <p className="text-white/65 font-semibold text-base mb-1">{slide.subtitle}</p>
              <p style={{ color: slide.accent }} className="text-xs font-black mb-7 uppercase tracking-widest">{slide.highlight}</p>
              <div className="flex items-center gap-4 flex-wrap">
                <button
                  onClick={slide.ctaAction}
                  className="px-6 py-3 rounded-2xl font-black text-sm shadow-2xl transition-all active:scale-95 hover:scale-[1.04] hover:shadow-3xl"
                  style={{ background: slide.accent, color: '#1e1b4b' }}
                >
                  {slide.cta} →
                </button>
                <div className="text-white/50 text-xs font-bold">{slide.badgeLabel}&nbsp;<span className="text-white text-2xl font-black">{slide.badge}</span></div>
              </div>
            </div>
            {/* Product image */}
            <div className="hidden md:block flex-shrink-0">
              <div className="relative w-[200px] h-[200px]">
                <div className="absolute inset-0 bg-white/[0.08] rounded-3xl blur-2xl scale-90" />
                <img src={slide.img} alt={slide.title} className="relative w-full h-full object-cover rounded-3xl border border-white/10 shadow-2xl" />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        {HERO_SLIDES.map((_, i) => (
          <button key={i} onClick={() => go(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/50'}`}
          />
        ))}
      </div>
      {/* Arrows */}
      {[{ dir: -1, side: 'left-4', path: 'M15 19l-7-7 7-7' }, { dir: 1, side: 'right-4', path: 'M9 5l7 7-7 7' }].map(({ dir, side, path }) => (
        <button key={dir} onClick={() => go(current + dir)}
          className={`absolute ${side} top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white p-2.5 rounded-full transition-all border border-white/10`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={path} /></svg>
        </button>
      ))}
    </div>
  );
};

// ─── Star rating ──────────────────────────────────────────────────────────────
const Stars: React.FC<{ rating: number; count?: number }> = ({ rating, count }) => (
  <div className="flex items-center gap-1">
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 ${i <= Math.round(rating) ? 'text-amber-400' : 'text-slate-200'}`} viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
    <span className="text-[10px] text-slate-500 font-bold">{rating.toFixed(1)}</span>
    {count !== undefined && <span className="text-[10px] text-slate-400">({count}+)</span>}
  </div>
);

// ─── MOCK sales data ──────────────────────────────────────────────────────────
const MOCK_SALES: Record<string, string> = {
  p1: '18k', p2: '42k', p3: '120k', p4: '9k', p5: '25k', p6: '60k',
  p7: '2k', p8: '3k', p9: '7k', p10: '15k', p11: '11k', p12: '5k',
};

// ─── Product Card ─────────────────────────────────────────────────────────────
const ProductCard: React.FC<{
  product: Product; onOpenModal: (p: Product) => void;
  onAddCart: (p: Product) => void; onAnalyze: (p: Product) => void;
}> = ({ product, onOpenModal, onAddCart, onAnalyze }) => {
  const pct = Math.round(((product.comparePriceBRL - product.priceBRL) / product.comparePriceBRL) * 100);
  const sales = MOCK_SALES[product.id] || '1k';
  return (
    <div className="group bg-white rounded-[20px] overflow-hidden border border-slate-200/80 hover:border-indigo-200 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-slate-50 cursor-pointer" onClick={() => { window.location.hash = `#product/${product.id}`; window.scrollTo(0, 0); }}>
        <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-[1.08] transition-transform duration-600" />
        <div className="absolute top-0 left-0 right-0 p-2.5 flex justify-between items-start pointer-events-none">
          <span className="bg-rose-500 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-md">-{pct}%</span>
          {product.isVerified && (
            <span className="bg-emerald-500 text-white p-1 rounded-lg shadow-md" title="Seller verificado">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            </span>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/50 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-white text-[10px] font-black text-center uppercase tracking-widest">Ver Detalhes</p>
        </div>
      </div>

      {/* Info */}
      <div className="p-3.5 flex-1 flex flex-col">
        <div className="flex items-center gap-1 mb-1">
          <span className="text-[9px] text-slate-400 font-bold uppercase">{product.category}</span>
          <span className="text-slate-200 text-[10px]">·</span>
          <button
            onClick={() => { window.location.hash = `#seller/${product.sellerId}`; }}
            className="text-[9px] text-indigo-500 font-black uppercase hover:underline transition-colors truncate max-w-[80px]"
          >
            {product.sellerName}
          </button>
        </div>

        <h3
          className="font-semibold text-slate-800 text-xs line-clamp-2 mb-2 leading-snug cursor-pointer hover:text-indigo-600 transition-colors flex-1"
          onClick={() => { window.location.hash = `#product/${product.id}`; window.scrollTo(0, 0); }}
        >
          {product.title}
        </h3>

        <Stars rating={product.rating} />

        <div className="text-[10px] text-slate-400 font-medium mt-1 mb-2">
          🔥 <span className="font-bold text-slate-600">{sales}</span> vendidos/mês
        </div>

        <div className="flex items-baseline gap-1.5 mb-1">
          <span className="text-lg font-black text-slate-900">R$&nbsp;{product.priceBRL.toLocaleString()}</span>
          <span className="text-[10px] text-slate-400 line-through font-medium">R$&nbsp;{product.comparePriceBRL.toLocaleString()}</span>
        </div>
        <div className="text-[11px] text-slate-500 font-semibold mb-1">
          ou <span className="font-black text-slate-700">12x de R$&nbsp;{Math.ceil(product.priceBRL / 12).toLocaleString()}</span> <span className="text-emerald-600">sem juros</span>
        </div>
        <div className="text-[11px] text-emerald-600 font-black mb-3">
          🚚 Frete Grátis para todo o BR
        </div>

        <div className="flex gap-1.5">
          <button
            onClick={() => onAddCart(product)}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white py-2.5 rounded-xl text-xs font-black shadow-md shadow-indigo-100 transition-all"
          >
            + Carrinho
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onAnalyze(product); }}
            title="Analisar com IA"
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-100 transition-all text-sm active:scale-95"
          >
            ⚡
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Trending Section ─────────────────────────────────────────────────────────
const TRENDING_TABS = ['Geral', 'Celulares', 'Games', 'Perfumes', 'Relógios'];

const TRENDING_PRODUCTS: Record<string, Array<{ id: string; trend: string; trendColor: string }>> = {
  'Geral': [{ id: 'p3', trend: '+187%', trendColor: 'text-rose-600 bg-rose-50' }, { id: 'p1', trend: '+94%', trendColor: 'text-orange-600 bg-orange-50' }, { id: 'p5', trend: '+78%', trendColor: 'text-orange-600 bg-orange-50' }, { id: 'p2', trend: '+61%', trendColor: 'text-amber-600 bg-amber-50' }, { id: 'p8', trend: '+45%', trendColor: 'text-amber-600 bg-amber-50' }, { id: 'p9', trend: '+38%', trendColor: 'text-amber-600 bg-amber-50' }],
  'Celulares': [{ id: 'p1', trend: '+112%', trendColor: 'text-rose-600 bg-rose-50' }, { id: 'p2', trend: '+88%', trendColor: 'text-orange-600 bg-orange-50' }, { id: 'p7', trend: '+71%', trendColor: 'text-orange-600 bg-orange-50' }, { id: 'p10', trend: '+55%', trendColor: 'text-amber-600 bg-amber-50' }, { id: 'p11', trend: '+39%', trendColor: 'text-amber-600 bg-amber-50' }, { id: 'p12', trend: '+27%', trendColor: 'text-amber-600 bg-amber-50' }],
  'Games': [{ id: 'p3', trend: '+204%', trendColor: 'text-rose-600 bg-rose-50' }, { id: 'p4', trend: '+91%', trendColor: 'text-orange-600 bg-orange-50' }, { id: 'p6', trend: '+67%', trendColor: 'text-orange-600 bg-orange-50' }, { id: 'p8', trend: '+48%', trendColor: 'text-amber-600 bg-amber-50' }, { id: 'p9', trend: '+33%', trendColor: 'text-amber-600 bg-amber-50' }, { id: 'p5', trend: '+22%', trendColor: 'text-amber-600 bg-amber-50' }],
  'Perfumes': [{ id: 'p5', trend: '+145%', trendColor: 'text-rose-600 bg-rose-50' }, { id: 'p7', trend: '+82%', trendColor: 'text-orange-600 bg-orange-50' }, { id: 'p9', trend: '+60%', trendColor: 'text-orange-600 bg-orange-50' }, { id: 'p10', trend: '+43%', trendColor: 'text-amber-600 bg-amber-50' }, { id: 'p11', trend: '+29%', trendColor: 'text-amber-600 bg-amber-50' }, { id: 'p12', trend: '+18%', trendColor: 'text-amber-600 bg-amber-50' }],
  'Relógios': [{ id: 'p6', trend: '+133%', trendColor: 'text-rose-600 bg-rose-50' }, { id: 'p8', trend: '+77%', trendColor: 'text-orange-600 bg-orange-50' }, { id: 'p10', trend: '+59%', trendColor: 'text-orange-600 bg-orange-50' }, { id: 'p2', trend: '+41%', trendColor: 'text-amber-600 bg-amber-50' }, { id: 'p4', trend: '+28%', trendColor: 'text-amber-600 bg-amber-50' }, { id: 'p1', trend: '+16%', trendColor: 'text-amber-600 bg-amber-50' }],
};

const TrendingSection: React.FC<{
  onAddCart: (p: Product) => void;
  onOpenModal: (p: Product) => void;
}> = ({ onAddCart, onOpenModal }) => {
  const [activeTab, setActiveTab] = useState('Geral');
  const trendData = TRENDING_PRODUCTS[activeTab] || [];
  const products = trendData.map(t => ({ ...MOCK_PRODUCTS.find(p => p.id === t.id)!, trend: t.trend, trendColor: t.trendColor })).filter(p => p.id);

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-slate-100 px-4 pt-3 overflow-x-auto scrollbar-hide">
        {TRENDING_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-xs font-black whitespace-nowrap transition-all border-b-2 -mb-px ${activeTab === tab
              ? 'border-rose-500 text-rose-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Product cards — horizontal scroll */}
      <div className="flex gap-3 overflow-x-auto px-4 py-4 scrollbar-hide">
        {products.map((product, idx) => {
          const pct = Math.round(((product.comparePriceBRL - product.priceBRL) / product.comparePriceBRL) * 100);
          return (
            <div
              key={`${activeTab}-${product.id}`}
              className="flex-shrink-0 w-36 sm:w-44 group cursor-pointer"
              onClick={() => onOpenModal(product)}
            >
              {/* Rank + image */}
              <div
                className="relative mb-2.5"
                onClick={() => { window.location.hash = `#product/${product.id}`; window.scrollTo(0, 0); }}
              >
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full aspect-square object-cover rounded-2xl border border-slate-100 group-hover:scale-[1.04] transition-transform duration-300 shadow-sm"
                />
                {/* Rank badge */}
                <div
                  className="absolute top-2 left-2 w-6 h-6 flex items-center justify-center text-white font-black text-[10px] rounded-lg shadow-md"
                  style={{ background: idx === 0 ? '#ef4444' : idx === 1 ? '#f97316' : idx === 2 ? '#f59e0b' : '#6366f1' }}
                >
                  #{idx + 1}
                </div>
                {/* Trend badge */}
                <div className={`absolute top-2 right-2 text-[9px] font-black px-1.5 py-0.5 rounded-lg ${product.trendColor}`}>
                  {product.trend}
                </div>
                {/* Discount */}
                <div className="absolute bottom-2 left-2 bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow">
                  -{pct}%
                </div>
              </div>
              {/* Info */}
              <p className="text-[11px] font-semibold text-slate-700 line-clamp-2 leading-tight mb-1.5">
                {product.title}
              </p>
              <p className="text-sm font-black text-slate-900 mb-1">R$ {product.priceBRL.toLocaleString()}</p>
              <p className="text-[10px] text-slate-400 line-through mb-2">R$ {product.comparePriceBRL.toLocaleString()}</p>
              <button
                onClick={e => { e.stopPropagation(); onAddCart(product); }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white py-2 rounded-xl text-[11px] font-black transition-all shadow-sm shadow-indigo-100"
              >
                + Carrinho
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Marketplace ─────────────────────────────────────────────────────────────
const Marketplace: React.FC = () => {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [dealAnalysis, setDealAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { h, m, s } = useCountdown();

  const [allProducts, setAllProducts] = useState<Product[]>(MOCK_PRODUCTS);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (!error && data && data.length > 0) {
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
        setAllProducts(transformed);
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [searchQuery, activeCategory]);

  useEffect(() => {
    let f = allProducts;
    if (activeCategory !== 'All') f = f.filter(p => p.category === activeCategory);
    if (searchQuery) f = f.filter(p =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setProducts(f);

    const fetchSugg = async () => {
      if (searchQuery.length > 2) setSuggestions(await getSmartSearchSuggestions(searchQuery));
      else setSuggestions([]);
    };
    const t = setTimeout(fetchSugg, 500);
    return () => clearTimeout(t);
  }, [searchQuery, activeCategory, allProducts]);

  const handleAnalyze = async (product: Product) => {
    setAnalyzing(true); setDealAnalysis(null); setSelectedProduct(product);
    const r = await analyzeDeal(product.title, product.priceBRL, product.comparePriceBRL);
    setDealAnalysis(r); setAnalyzing(false);
  };

  const handleAddToCart = (product: Product) => {
    addItem(product);
    showToast(`${product.title.slice(0, 28)}... adicionado!`, 'success', '🛒');
  };

  const isFiltering = searchQuery !== '' || activeCategory !== 'All';
  const flashProducts = MOCK_PRODUCTS.slice(0, 4);
  const topProducts = [...MOCK_PRODUCTS].sort((a, b) => b.rating - a.rating).slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 pb-20">

      {/* ── Product Modal ─────────────────────────────────────── */}
      {modalProduct && <ProductModal product={modalProduct} onClose={() => setModalProduct(null)} />}

      {/* ── AI Deal Modal ─────────────────────────────────────── */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-white rounded-[28px] sm:rounded-[32px] max-w-lg w-full p-8 shadow-2xl space-y-5 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 text-xs font-black px-3 py-1.5 rounded-full border border-amber-100 mb-2">⚡ AI Deal Expert</div>
                <h3 className="font-black text-slate-900 text-lg leading-tight">{selectedProduct.title}</h3>
              </div>
              <button onClick={() => { setSelectedProduct(null); setDealAnalysis(null); }}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors ml-2 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            {analyzing && (
              <div className="flex flex-col items-center py-10 gap-4">
                <div className="w-12 h-12 rounded-full border-[3px] border-indigo-100 border-t-indigo-600 animate-spin" />
                <p className="text-slate-400 font-medium text-sm">Analisando com Gemini AI...</p>
              </div>
            )}
            {dealAnalysis && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-900 text-white p-5 rounded-2xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-1">Economia Real</p>
                    <div className="text-4xl font-black">{dealAnalysis.economyPercentage}%</div>
                    <p className="text-[10px] mt-1 text-slate-500">vs. Varejo BR</p>
                  </div>
                  <div className={`p-5 rounded-2xl border-2 flex flex-col justify-center ${dealAnalysis.status === 'EXCELENTE' ? 'border-emerald-100 bg-emerald-50' : 'border-indigo-100 bg-indigo-50'}`}>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Veredicto</p>
                    <div className={`text-xl font-black ${dealAnalysis.status === 'EXCELENTE' ? 'text-emerald-600' : 'text-indigo-600'}`}>{dealAnalysis.status}</div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-6 rounded-2xl text-white">
                  <p className="text-[10px] font-bold opacity-60 mb-2 uppercase tracking-widest">Expert Advice</p>
                  <p className="text-sm font-medium leading-relaxed">"{dealAnalysis.expertAdvice}"</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => { handleAddToCart(selectedProduct); setSelectedProduct(null); setDealAnalysis(null); }}
                    className="flex-1 bg-slate-900 text-white py-3.5 rounded-2xl font-bold text-sm shadow-xl hover:bg-slate-800 transition-all active:scale-95">
                    Adicionar ao Carrinho
                  </button>
                  <button onClick={() => { setSelectedProduct(null); setDealAnalysis(null); }}
                    className="px-6 bg-slate-100 text-slate-600 py-3.5 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all">
                    Fechar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── HERO CAROUSEL ─────────────────────────────────────── */}
      <div className="pt-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <HeroCarousel />
          </div>
          {/* Side banners */}
          <div className="hidden lg:flex flex-col gap-4">
            <div className="flex-1 rounded-[24px] overflow-hidden relative bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col justify-end p-6 shadow-lg">
              <div className="absolute inset-0 opacity-20">
                <img src="https://picsum.photos/seed/banner-a/400/300" alt="" className="w-full h-full object-cover" />
              </div>
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-1">Aproveite</p>
                <h3 className="text-white font-black text-lg leading-tight mb-3">Cupons de Frete Grátis</h3>
                <button className="bg-white text-slate-900 text-xs font-bold px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors">Resgatar →</button>
              </div>
            </div>
            <div className="flex-1 rounded-[24px] overflow-hidden relative bg-gradient-to-br from-emerald-700 to-emerald-900 flex flex-col justify-end p-6 shadow-lg">
              <div className="absolute inset-0 opacity-20">
                <img src="https://picsum.photos/seed/banner-b/400/300" alt="" className="w-full h-full object-cover" />
              </div>
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-300 mb-1">Lojas Oficiais</p>
                <h3 className="text-white font-black text-lg leading-tight mb-3">Sellers Verificados CDE</h3>
                <button className="bg-white text-slate-900 text-xs font-bold px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors">Ver Lojas →</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── QUICK ACCESS ──────────────────────────────────────── */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 mt-5 mb-5">
        {QUICK_ACCESS.map(item => (
          <button key={item.label} className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl border ${item.border} ${item.bg} transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md group`}>
            <div className={`w-11 h-11 ${item.icon_bg} rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
              {item.icon}
            </div>
            <div>
              <p className={`text-xs font-black text-center ${item.text}`}>{item.label}</p>
              <p className="text-[10px] text-slate-400 font-semibold text-center mt-0.5">{item.desc}</p>
            </div>
          </button>
        ))}
      </div>


      {/* ── TRUST BADGES ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7">
        {TRUST_BADGES.map(b => (
          <div key={b.title} className="flex items-center gap-3 bg-white border border-slate-100 rounded-2xl px-4 py-3.5 shadow-sm hover:shadow-md hover:border-slate-200 transition-all">
            <span className="text-2xl flex-shrink-0">{b.icon}</span>
            <div>
              <p className="text-xs font-black text-slate-800 leading-tight">{b.title}</p>
              <p className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── EM ALTA — TRENDING ────────────────────────────────── */}
      {!isFiltering && (
        <div className="mb-7">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                🔥 Em Alta
                <span className="text-xs font-bold bg-rose-100 text-rose-600 px-2.5 py-1 rounded-full">Tendências CDE</span>
              </h2>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Os produtos mais procurados agora em Ciudad del Este</p>
            </div>
            <button className="text-xs font-black text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1">
              Ver Todos <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

          {/* Category tabs */}
          <TrendingSection onAddCart={handleAddToCart} onOpenModal={setModalProduct} />
        </div>
      )}

      {/* ── FLASH SALE ────────────────────────────────────────── */}
      {!isFiltering && (
        <div className="bg-white border border-slate-100 rounded-[24px] shadow-sm mb-7 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-rose-50 bg-gradient-to-r from-rose-50 to-orange-50">
            <div className="flex items-center gap-4">
              <span className="text-xl">⚡</span>
              <div>
                <div className="text-sm font-black text-rose-600 uppercase tracking-widest">Flash Sale</div>
                <div className="text-[10px] text-slate-400 font-medium">Oferta exclusiva do dia</div>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 ml-2">
                <TimeBlock value={h} label="Hrs" />
                <span className="text-slate-300 font-black text-lg mb-4">:</span>
                <TimeBlock value={m} label="Min" />
                <span className="text-slate-300 font-black text-lg mb-4">:</span>
                <TimeBlock value={s} label="Seg" />
              </div>
            </div>
            <button className="text-xs font-black text-rose-500 hover:text-rose-700 transition-colors flex items-center gap-1">
              Ver Todos <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-100">
            {flashProducts.map(p => {
              const pct = Math.round(((p.comparePriceBRL - p.priceBRL) / p.comparePriceBRL) * 100);
              return (
                <button key={p.id} onClick={() => { window.location.hash = `#product/${p.id}`; window.scrollTo(0, 0); }} className="group p-5 text-left hover:bg-slate-50/80 transition-colors">
                  <div className="relative mb-3">
                    <img src={p.images[0]} alt={p.title} className="w-full aspect-square object-cover rounded-2xl group-hover:scale-[1.04] transition-transform duration-300 shadow-sm" />
                    <span className="absolute top-1.5 left-1.5 bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow">-{pct}%</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-700 line-clamp-2 mb-1.5 leading-tight">{p.title}</p>
                  <p className="text-base font-black text-slate-900">R$ {p.priceBRL.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-400 line-through">R$ {p.comparePriceBRL.toLocaleString()}</p>
                  <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-rose-400 h-full rounded-full" style={{ width: `${Math.min(80, 20 + pct)}%` }} />
                  </div>
                  <p className="text-[9px] text-rose-500 font-bold mt-1">🔥 Esgotando rápido</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── DEPARTMENTS visual grid ────────────────────────── */}
      {!isFiltering && (
        <div className="mb-7">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Departamentos</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Produtos diretos de Ciudad del Este</p>
            </div>
            <button
              onClick={() => { window.location.hash = '#all-categories'; window.scrollTo(0, 0); }}
              className="flex items-center gap-1.5 text-xs font-black text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-full transition-all"
            >
              Ver todas
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {getCategoryTree().map((dept, i) => {
              const subCount = dept.categories.reduce((acc, c) => acc + c.subCategories.length, 0);
              return (
                <motion.button
                  key={dept.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  onClick={() => { window.location.hash = `#category/${dept.id}`; window.scrollTo(0, 0); }}
                  className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${dept.gradient || 'from-indigo-500 to-purple-700'} p-5 text-left shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 min-h-[120px] flex flex-col justify-between`}
                >
                  {/* Shimmer overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                  {/* Top: emoji + dots */}
                  <div className="flex items-start justify-between">
                    <span className="text-3xl drop-shadow-sm">{dept.emoji || '📦'}</span>
                    <span className="text-white/50 group-hover:text-white/80 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                  {/* Bottom: name + count */}
                  <div>
                    <h3 className="font-black text-sm text-white leading-tight uppercase tracking-wide mb-1">
                      {dept.label}
                    </h3>
                    <p className="text-[10px] text-white/60 font-bold">
                      {dept.categories.length} cats · {subCount} subcats
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── CATEGORIES ───────────────────────────────────────── */}
      {!isFiltering && (
        <div className="mb-7">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-slate-900">Categorias</h2>
            <button
              onClick={() => { window.location.hash = '#all-categories'; window.scrollTo(0, 0); }}
              className="text-sm font-black text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
            >
              Ver todas <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

          <div className="bg-white border border-slate-100 rounded-[24px] shadow-sm p-6">
            {/* Linha 1: 12 categorias principais */}
            <div className="grid grid-cols-6 lg:grid-cols-12 gap-y-4 gap-x-1">
              {CATEGORIES.slice(0, 12).map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.name)}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div className="relative">
                    <div className={`w-14 h-14 rounded-full overflow-hidden border-2 border-slate-100 group-hover:border-indigo-300 transition-all group-hover:scale-110 duration-200 shadow-sm mx-auto ${activeCategory === cat.name ? 'border-indigo-500 ring-2 ring-indigo-200' : ''}`}>
                      <img
                        src={CATEGORY_IMAGES[cat.name] || `https://picsum.photos/seed/${cat.id}/200/200`}
                        alt={cat.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className={`absolute -bottom-1 -right-0 text-xs leading-none ${activeCategory === cat.name ? 'scale-125' : ''}`}>{cat.icon}</div>
                  </div>
                  <span className={`text-[10px] font-bold text-center leading-tight w-full px-1 ${activeCategory === cat.name ? 'text-indigo-600' : 'text-slate-600 group-hover:text-indigo-500'} transition-colors`}>
                    {cat.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>

            {/* Linha 2: 12 outras categorias em grid */}
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-5 mb-4">🔍 Mais categorias</p>
            <div className="grid grid-cols-6 lg:grid-cols-12 gap-y-4 gap-x-1">
              {CATEGORIES.slice(12).map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.name)}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div className="relative">
                    <div className={`w-14 h-14 rounded-full overflow-hidden border-2 border-slate-100 group-hover:border-indigo-300 transition-all group-hover:scale-110 duration-200 shadow-sm mx-auto ${activeCategory === cat.name ? 'border-indigo-500 ring-2 ring-indigo-200' : ''}`}>
                      <img
                        src={CATEGORY_IMAGES[cat.name] || `https://picsum.photos/seed/${cat.id}z/200/200`}
                        alt={cat.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className={`absolute -bottom-1 -right-0 text-xs leading-none ${activeCategory === cat.name ? 'scale-125' : ''}`}>{cat.icon}</div>
                  </div>
                  <span className={`text-[10px] font-bold text-center leading-tight w-full px-1 ${activeCategory === cat.name ? 'text-indigo-600' : 'text-slate-600 group-hover:text-indigo-500'} transition-colors`}>
                    {cat.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}


      {/* ── DESTAQUES PARA VOCÊ ──────────────────────────────── */}
      {!isFiltering && (
        <div className="mb-7">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">🏆 Destaques para Você</h2>
              <p className="text-[11px] text-slate-400 font-medium">Os mais vendidos desta semana</p>
            </div>
            <button className="text-xs font-black text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1">
              Ver Tudo <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide -mx-1 px-1">
            {topProducts.map((p, idx) => {
              const sales = MOCK_SALES[p.id] || '1k';
              return (
                <button
                  key={p.id}
                  onClick={() => { window.location.hash = `#product/${p.id}`; window.scrollTo(0, 0); }}
                  className="group flex-shrink-0 w-36 sm:w-44 bg-white rounded-[20px] border border-slate-200 hover:border-indigo-200 hover:shadow-xl transition-all overflow-hidden text-left"
                >
                  <div className="relative">
                    <img src={p.images[0]} alt={p.title} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300" />
                    {/* TOP badge */}
                    <div className="absolute top-0 left-0">
                      <div
                        className={`w-10 h-10 flex items-center justify-center text-white font-black text-xs shadow-lg`}
                        style={{
                          background: idx === 0 ? '#f59e0b' : idx === 1 ? '#9ca3af' : idx === 2 ? '#b45309' : '#6366f1',
                          clipPath: 'polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%)',
                        }}
                      >
                        TOP
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/60 to-transparent p-2">
                      <p className="text-white text-[9px] font-black">{sales} vendidos/mês</p>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-semibold text-slate-700 line-clamp-2 leading-tight mb-1.5">{p.title}</p>
                    <p className="text-sm font-black text-slate-900">R$ {p.priceBRL.toLocaleString()}</p>
                    <Stars rating={p.rating} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── SEARCH BAR ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <div className="flex bg-white border border-slate-200 rounded-2xl hover:border-indigo-300 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all shadow-sm overflow-hidden">
            <input
              type="text"
              placeholder="Buscar produtos, categorias, sellers..."
              className="flex-1 px-5 py-3.5 text-sm text-slate-700 placeholder-slate-400 font-medium focus:outline-none bg-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 transition-colors flex items-center gap-2 text-sm font-bold flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <span className="hidden sm:block">Buscar</span>
            </button>
          </div>
        </div>
        {activeCategory !== 'All' && (
          <button onClick={() => setActiveCategory('All')} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-5 py-3.5 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
            ← {activeCategory}
          </button>
        )}
      </div>

      {/* AI suggestions */}
      {suggestions.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-2 items-center">
          <span className="text-[10px] font-black text-violet-600 uppercase tracking-widest">🤖 IA Sugere:</span>
          {suggestions.map((s, i) => (
            <button key={i} onClick={() => setSearchQuery(s)}
              className="text-xs bg-violet-50 hover:bg-violet-100 text-violet-700 px-4 py-1.5 rounded-full font-bold border border-violet-100 transition-all">
              {s}
            </button>
          ))}
        </div>
      )}

      {/* ── DESCOBERTAS DO DIA / Product Grid ───────────────── */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              {activeCategory === 'All' && !searchQuery ? '📦 Descobertas do Dia' : activeCategory !== 'All' ? activeCategory : 'Resultados'}
            </h2>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              <span className="text-slate-700 font-bold">{products.length}</span> produtos encontrados
            </p>
          </div>
          {isFiltering && (
            <button onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
              className="text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-1 bg-slate-100 hover:bg-rose-50 px-3 py-1.5 rounded-xl">
              ✕ Limpar filtros
            </button>
          )}
        </div>

        {isLoading ? (
          <ProductGridSkeleton />
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-[24px] border border-slate-100">
            <div className="bg-slate-100 p-7 rounded-full mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <h3 className="text-xl font-black text-slate-700 mb-2">Nenhum produto encontrado</h3>
            <p className="text-slate-400 text-sm mb-6 max-w-xs">Tente outro termo ou explore todas as categorias disponíveis</p>
            <button onClick={() => { setSearchQuery(''); setActiveCategory('All'); }} className="bg-indigo-600 text-white px-7 py-3 rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100">
              Ver todos os produtos
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4"
          >
            <AnimatePresence mode='popLayout'>
              {products.map(product => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                >
                  <ProductCard
                    product={product}
                    onOpenModal={setModalProduct}
                    onAddCart={handleAddToCart}
                    onAnalyze={handleAnalyze}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
