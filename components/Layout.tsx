
import React, { useState, useEffect, useMemo } from 'react';
import { UserRole } from '../types';
import { CATEGORY_MAP } from '../constants';
import Logo from './Logo';
import { useCart } from '../context/CartContext';
import { useChat } from '../context/ChatContext';
import { useRewards, TIER_COLORS } from '../context/RewardsContext';
import AuthModal from './AuthModal';
import DollarWidget from './DollarWidget';
import { useAuth } from '../context/AuthContext';
import { getCategoryTree, Department, Category as CategoryType } from '../services/categoryService';

interface LayoutProps {
  children: React.ReactNode;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const NAV_ROLES = [UserRole.BUYER, UserRole.SELLER, UserRole.WHOLESALE];

const ROLE_META: Record<UserRole, { label: string; icon: React.ReactElement; color: string }> = {
  [UserRole.BUYER]: {
    label: 'Comprador',
    color: 'text-indigo-600',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
  },
  [UserRole.SELLER]: {
    label: 'Lojista',
    color: 'text-emerald-600',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  [UserRole.WHOLESALE]: {
    label: 'Atacado',
    color: 'text-teal-600',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  [UserRole.INVESTOR]: {
    label: 'Investidor',
    color: 'text-amber-600',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
      </svg>
    ),
  },
  [UserRole.ADMIN]: {
    label: 'Admin',
    color: 'text-slate-600',
    icon: <></>,
  },
};

const COUNTRIES = [
  { code: 'BR', label: 'Brasil', flag: '🇧🇷', currency: 'BRL' },
  { code: 'PY', label: 'Paraguay', flag: '🇵🇾', currency: 'PYG' },
  { code: 'AR', label: 'Argentina', flag: '🇦🇷', currency: 'ARS' },
] as const;
type CountryCode = typeof COUNTRIES[number]['code'];

// SVG icon factory — h-4 w-4, stroke-based, inherits currentColor
const Si = (c: React.ReactNode): React.ReactElement => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    {c}
  </svg>
);

const DEPT_MENU = [
  { label: 'Mais Vendidos', hash: '#category/mais-vendidos', icon: Si(<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />) },
  { label: 'Ofertas do Dia', hash: '#category/ofertas', icon: Si(<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />) },
  { label: 'Celulares', hash: '#category/celulares', icon: Si(<><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" strokeWidth={3} /></>) },
  { label: 'Produtos Apple', hash: '#category/apple', icon: Si(<><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></>) },
  { label: 'Games & Consoles', hash: '#category/games', icon: Si(<><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M6 12h4m-2-2v4" /><circle cx="15.5" cy="11.5" r=".5" fill="currentColor" /><circle cx="18.5" cy="11.5" r=".5" fill="currentColor" /></>) },
  { label: 'Notebook', hash: '#category/notebook', icon: Si(<><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9" /><path d="M1 16h22v2a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2z" /></>) },
  { label: 'Perfumes Premium', hash: '#category/perfumes', icon: Si(<path d="M9 3h6l1 5.95C17.4 11.35 17 14 17 14a5 5 0 0 1-10 0s-.4-2.65 1-5.05L9 3z" />) },
  { label: 'Relógios de Luxo', hash: '#category/relogios', icon: Si(<><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>) },
  { label: 'Drones', hash: '#category/drones', icon: Si(<><circle cx="12" cy="12" r="2" /><path d="M5.5 5.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0z" /><path d="M15.5 5.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0z" /><path d="M5.5 17.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0z" /><path d="M15.5 17.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0z" /><path d="M7 5.5L10 11m7-5.5L14 11M7 17.5L10 13m7 4.5L14 13" /></>) },
  { label: 'Áudio & Fones', hash: '#category/audio', icon: Si(<><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" /><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" /></>) },
  { label: 'Smartwatch', hash: '#category/smartwatch', icon: Si(<><circle cx="12" cy="12" r="7" /><polyline points="12 9 12 12 13.5 13.5" /><path d="M16.5 17.5l-.35 3.82A2 2 0 0 1 14.17 23H9.83a2 2 0 0 1-2-1.82L7.5 17.5M7.5 6.5l.34-3.82A2 2 0 0 1 9.83 1h4.34a2 2 0 0 1 2 1.68l.33 3.82" /></>) },
  { label: 'Câmeras & Foto', hash: '#category/cameras', icon: Si(<><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></>) },
  { label: 'Casa & Eletrodomésticos', hash: '#category/casa', icon: Si(<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>) },
  { label: 'Moda & Estilo', hash: '#moda', icon: Si(<path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" />) },
  { label: 'Pet Shop', hash: '#category/pet', icon: Si(<><circle cx="11" cy="4" r="2" /><circle cx="18" cy="9" r="2" /><circle cx="4" cy="9" r="2" /><path d="M12 22c0-4-5-7.5-5-7.5S4 10 6 8.5c1.5-1 4.5 0 6 1.5 1.5-1.5 4.5-2.5 6-1.5 2 1.5-3 6-3 6s-3 3.5-3 7z" /></>) },
  { label: 'Infantil & Kids', hash: '#category/infantil', icon: Si(<><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></>) },
];


const QUICK_DEPTS = [
  { label: 'Mais Vendidos', hash: '#category/mais-vendidos', icon: Si(<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />) },
  { label: 'Ofertas do Dia', hash: '#category/ofertas', icon: Si(<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />) },
  { label: 'Celulares', hash: '#category/celulares', icon: Si(<><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" strokeWidth={3} /></>) },
  { label: 'Apple', hash: '#category/apple', icon: Si(<><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></>) },
  { label: 'Games', hash: '#category/games', icon: Si(<><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M6 12h4m-2-2v4" /><circle cx="15.5" cy="11.5" r=".5" fill="currentColor" /><circle cx="18.5" cy="11.5" r=".5" fill="currentColor" /></>) },
  { label: 'Perfumes', hash: '#category/perfumes', icon: Si(<path d="M9 3h6l1 5.95C17.4 11.35 17 14 17 14a5 5 0 0 1-10 0s-.4-2.65 1-5.05L9 3z" />) },
  { label: 'Relógios', hash: '#category/relogios', icon: Si(<><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>) },
  { label: 'Moda', hash: '#moda', icon: Si(<path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" />) },
];

const Layout: React.FC<LayoutProps> = ({ children, activeRole, onRoleChange }) => {
  const { totalItems, setIsCartOpen } = useCart();
  const { totalUnread } = useChat();
  const { points, tier } = useRewards();
  const rewardColors = TIER_COLORS[tier];
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [country, setCountry] = useState<CountryCode>('BR');
  const [countryOpen, setCountryOpen] = useState(false);
  const [deptHover, setDeptHover] = useState<string | null>(null);
  const [subHover, setSubHover] = useState<string | null>(null);
  const [deptOpen, setDeptOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, signOut } = useAuth();
  const activeCountry = COUNTRIES.find(c => c.code === country)!;
  const [authModal, setAuthModal] = useState<null | 'login' | 'register'>(null);
  const categoryTree = useMemo(() => getCategoryTree(), []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeRoleMeta = ROLE_META[activeRole];

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      window.location.hash = `#search?q=${encodeURIComponent(searchQuery.trim())}`;
      setMobileMenuOpen(false);
    }
  };

  const handleLoginSuccess = () => {
    setAuthModal(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9fc] overflow-x-hidden">

      {/* ── TOP NANO BAR ─────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 text-white text-[11px] font-semibold py-2 px-4 text-center tracking-wide select-none">
        🇵🇾&nbsp; <span className="opacity-90">Preços de Ciudad del Este · Entrega para todo o Brasil · Sellers verificados pela XTUDO</span>
        &nbsp;<span className="opacity-60">|</span>&nbsp;
        <span className="font-black">Frete Grátis acima de R$&nbsp;500</span> 🚚
      </div>

      {/* ── MAIN HEADER ──────────────────────────────────────────────── */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-md' : 'bg-white/90 backdrop-blur-sm'} border-b border-slate-200/50`}>

        {/* Primary row */}
        <div className="max-w-7xl mx-auto px-4 lg:px-6 h-20 flex items-center gap-3 overflow-visible">

          {/* Logo */}
          <Logo
            onClick={() => (window.location.hash = '#marketplace')}
            className="hover:opacity-90 transition-opacity"
          />

          {/* Search bar — desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl mx-4 relative"
          >
            <div className="flex w-full bg-slate-100 rounded-2xl border border-slate-200 hover:border-indigo-300 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              <input
                type="text"
                placeholder="Buscar produtos, marcas, sellers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent px-5 py-3 text-sm text-slate-700 placeholder-slate-400 font-medium focus:outline-none"
              />
              <button
                type="submit"
                className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white px-5 rounded-2xl transition-colors flex items-center gap-2 text-sm font-bold"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="hidden lg:block">Buscar</span>
              </button>
            </div>
          </form>

          {/* Right controls */}
          <div className="flex items-center gap-2 ml-auto">

            {/* Role switcher — pill chip style */}
            <div className="hidden sm:flex items-center bg-slate-100 rounded-2xl border border-slate-200/80 p-1 gap-0.5">
              {NAV_ROLES.map(role => {
                const meta = ROLE_META[role];
                const isActive = activeRole === role;
                return (
                  <button
                    key={role}
                    onClick={() => onRoleChange(role)}
                    className={`
                      flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200
                      ${isActive
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/80'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                      }
                    `}
                  >
                    <span className={isActive ? meta.color : ''}>{meta.icon}</span>
                    {meta.label}
                  </button>
                );
              })}
            </div>

            {/* Auth buttons & User Account */}
            <div className="hidden sm:flex items-center gap-2">
              {user ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { window.location.hash = activeRole === UserRole.SELLER ? '#sellers' : '#customer'; }}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-black hover:bg-slate-200 transition-all border border-slate-200"
                  >
                    <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-[10px] text-white">
                      {user.email?.[0].toUpperCase() || 'U'}
                    </div>
                    {activeRole === UserRole.SELLER ? 'Painel Lojista' : 'Minha Conta'}
                  </button>
                  <button
                    onClick={() => signOut()}
                    className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Sair"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => { window.location.hash = '#auth'; }}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-black text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all"
                  >
                    Entrar
                  </button>
                  <button
                    onClick={() => { window.location.hash = '#auth'; }}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md shadow-indigo-100 transition-all active:scale-95"
                  >
                    Cadastrar
                  </button>
                </>
              )}
            </div>

            {/* Rewards Badge */}
            <button
              onClick={() => { window.location.hash = '#rewards'; }}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-black transition-all hover:scale-105 ${rewardColors.bg} ${rewardColors.color} border-current/20`}
              title="XTUDO Rewards"
            >
              <span className="text-sm">🏆</span>
              <span>{points.toLocaleString()} pts</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full bg-white/60 font-black`}>{tier}</span>
            </button>

            {/* Notification bell */}
            <button className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {totalUnread > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 rounded-full ring-2 ring-white flex items-center justify-center text-[8px] font-black text-white animate-bounce">
                  {totalUnread > 9 ? '9+' : totalUnread}
                </span>
              )}
            </button>

            {/* Cart button */}
            {activeRole === UserRole.BUYER && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white px-3 py-2.5 rounded-2xl transition-all font-bold shadow-lg shadow-indigo-200"
                title="Meu Carrinho"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {totalItems > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-black px-1">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              className="sm:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* ── DEPARTMENT MENU BAR (Amazon-style) */}
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-1.5 hidden md:flex items-center gap-1 border-t border-slate-100 relative">
          {/* "Todos" dropdown button */}
          <div 
            className="relative flex-shrink-0"
            onMouseEnter={() => setDeptOpen(true)}
            onMouseLeave={() => { setDeptOpen(false); setDeptHover(null); setSubHover(null); }}
          >
            <button
              onClick={() => setDeptOpen(v => !v)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black transition-all ${deptOpen ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Todos
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 transition-transform ${deptOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown */}
            {deptOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setDeptOpen(false)} />
                <div
                  className="absolute left-0 top-full mt-1 z-50 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex shadow-indigo-100/50 min-h-[500px]"
                >
                  {/* Coluna 1: Departamentos */}
                  <div className="w-72 bg-slate-50 border-r border-slate-100 py-2 flex-shrink-0 overflow-y-auto max-h-[70vh]">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-5 pt-3 pb-2">Departamentos</p>
                    {categoryTree.map((dept) => (
                      <div
                        key={dept.id}
                        onMouseEnter={() => { setDeptHover(dept.id); setSubHover(null); }}
                        className={`group w-full flex items-center justify-between px-5 py-3 text-sm font-bold transition-colors cursor-pointer ${deptHover === dept.id ? 'bg-white text-indigo-700 shadow-sm border-l-4 border-indigo-600' : 'text-slate-700 hover:bg-slate-100 border-l-4 border-transparent'
                          }`}
                        onClick={() => { window.location.hash = `#category/${dept.id}`; setDeptOpen(false); }}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`${deptHover === dept.id ? 'text-indigo-600' : 'text-slate-400'}`}>
                            {dept.iconPath || (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                              </svg>
                            )}
                          </span>
                          {dept.label}
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${deptHover === dept.id ? 'opacity-100 text-indigo-400' : 'opacity-0'} transition-opacity`} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ))}
                  </div>

                  {/* Coluna 2: Categorias */}
                  {deptHover && categoryTree.find(d => d.id === deptHover) && (
                    <div className="w-72 bg-white border-r border-slate-100 py-2 flex-shrink-0">
                      <div className="px-5 pt-3 pb-3 border-b border-slate-50 flex items-center gap-2 mb-2">
                        <span className="text-indigo-600 w-5 h-5">
                          {categoryTree.find(d => d.id === deptHover)?.iconPath || (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                          )}
                        </span>
                        <h3 className="font-extrabold text-sm text-slate-800">{categoryTree.find(d => d.id === deptHover)?.label}</h3>
                      </div>
                      <div className="overflow-y-auto max-h-[70vh]">
                        {categoryTree.find(d => d.id === deptHover)?.categories.map(cat => (
                          <div
                            key={cat.id}
                            onMouseEnter={() => setSubHover(cat.id)}
                            className={`group w-full flex items-center justify-between px-5 py-3 text-sm font-semibold transition-colors cursor-pointer ${subHover === cat.id ? 'bg-indigo-50/50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                              }`}
                            onClick={() => { window.location.hash = `#category/${deptHover}/${cat.id}`; setDeptOpen(false); }}
                          >
                            <div className="flex items-center gap-3">
                              {cat.label}
                            </div>
                            {cat.subCategories.length > 0 && (
                              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${subHover === cat.id ? 'opacity-100 text-indigo-400' : 'opacity-0'} transition-opacity`} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Coluna 3: Subcategorias */}
                  {deptHover && subHover && categoryTree.find(d => d.id === deptHover)?.categories.find(c => c.id === subHover)?.subCategories && (
                    <div className="w-72 bg-white py-2 flex-shrink-0">
                      <div className="px-5 pt-3 pb-3 border-b border-slate-50 flex items-center gap-2 mb-2">
                        <h3 className="font-extrabold text-sm text-slate-800">{categoryTree.find(d => d.id === deptHover)?.categories.find(c => c.id === subHover)?.label}</h3>
                      </div>
                      <div className="overflow-y-auto max-h-[70vh] px-3 space-y-1">
                        {categoryTree.find(d => d.id === deptHover)?.categories.find(c => c.id === subHover)?.subCategories.map(sub => (
                          <div
                            key={sub.id}
                            className="w-full flex items-center px-3 py-2 text-sm font-medium text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                            onClick={() => { window.location.hash = `#category/${deptHover}/${subHover}/${sub.id}`; setDeptOpen(false); }}
                          >
                            {sub.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-slate-200 mx-1 flex-shrink-0" />

          {/* Quick dept links */}
          <div className="flex items-center gap-0.5 flex-1 overflow-hidden">
            {QUICK_DEPTS.map(d => (
              <button
                key={d.label}
                onClick={() => { window.location.hash = d.hash; }}
                className="group flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 transition-all whitespace-nowrap"
              >
                <span className="text-slate-400 group-hover:text-indigo-600 transition-colors">{d.icon}</span>
                {d.label}
              </button>
            ))}
          </div>

          {/* País / Idioma + Cotação — lado direito */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Country selector */}
            <div className="relative">
              <button
                onClick={() => setCountryOpen(v => !v)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all text-xs font-bold text-slate-700 shadow-sm"
              >
                <span className="text-base leading-none">{activeCountry.flag}</span>
                <span>{activeCountry.label}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 text-slate-400 transition-transform ${countryOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {countryOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setCountryOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 z-50 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden min-w-[160px] py-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-4 pt-2 pb-1.5">Selecione o país</p>
                    {COUNTRIES.map(c => (
                      <button
                        key={c.code}
                        onClick={() => { setCountry(c.code); setCountryOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-left transition-colors ${country === c.code ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'
                          }`}
                      >
                        <span className="text-xl leading-none">{c.flag}</span>
                        <span>{c.label}</span>
                        {country === c.code && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-auto text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            {/* Cotação do Dólar */}
            <DollarWidget />
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-3 shadow-xl">
            <form onSubmit={handleSearch} className="relative mb-2">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
            {NAV_ROLES.map(role => (
              <button key={role} onClick={() => { onRoleChange(role); setMobileMenuOpen(false); }}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeRole === role ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <span className={activeRole === role ? ROLE_META[role].color : 'text-slate-400'}>{ROLE_META[role].icon}</span>
                {ROLE_META[role].label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
      <main className="flex-1">
        {children}
      </main>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer className="bg-slate-950 text-slate-400">
        {/* Main footer */}
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="bg-white rounded-xl p-1 flex-shrink-0">
                <Logo size="sm" />
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-5">
              O marketplace que está digitalizando o comércio Brasil-Paraguai. Preços de CDE com a segurança que você merece.
            </p>
            <div className="flex gap-3">
              {['instagram', 'whatsapp', 'tiktok'].map(s => (
                <button key={s} className="w-8 h-8 bg-slate-800 hover:bg-indigo-600 rounded-xl flex items-center justify-center transition-colors text-xs font-black text-white">
                  {s[0].toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            {
              title: 'Plataforma',
              links: [
                { label: 'Como funciona', href: '#como-funciona' },
                { label: 'Segurança & Trust', href: '#seguranca' },
                { label: 'Logística', href: '#logistica' },
                { label: 'Rastrear Pedido', href: '#track-order' },
                { label: 'Sellers Verificados', href: '#sellers-verificados' }
              ]
            },
            {
              title: 'Empresa',
              links: [
                { label: 'Sobre nós', href: '#sobre-nos' },
                { label: 'Carreiras', href: '#carreiras' },
                { label: 'Contato', href: '#contato' }
              ]
            },
          ].map(section => (
            <div key={section.title}>
              <h4 className="text-white font-black text-sm mb-4 uppercase tracking-widest">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map(l => (
                  <li key={l.label}>
                    <a href={l.href} className="text-sm hover:text-white hover:translate-x-0.5 transition-all inline-block">
                      {l.label}
                    </a>
                  </li>
                ))}
                {section.title === 'Empresa' && (
                  <li>
                    <a
                      href="#investors"
                      className="text-sm hover:text-amber-400 hover:translate-x-0.5 transition-all inline-flex items-center gap-1.5 text-amber-500/80"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
                      Portal do Investidor
                    </a>
                  </li>
                )}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-black text-sm mb-4 uppercase tracking-widest">Ofertas no Email</h4>
            <p className="text-sm mb-4 leading-relaxed">Receba as melhores deals de CDE antes de todo mundo.</p>
            <div className="flex flex-col gap-2">
              <input type="email" placeholder="seu@email.com" className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full placeholder-slate-600" />
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold py-3 rounded-xl transition-colors w-full">
                Quero receber →
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-900">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <span>© 2026 XTUDO PARAGUAI. Todos os direitos reservados.</span>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-slate-400 transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-slate-400 transition-colors">Privacidade</a>
              <a href="#" className="hover:text-slate-400 transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ── AUTH MODAL ── */}
      {authModal && (
        <AuthModal
          defaultTab={authModal}
          onClose={() => setAuthModal(null)}
          onSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
};

export default Layout;
