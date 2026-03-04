import React, { useState, useMemo, useRef, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import DashboardCard from '../components/DashboardCard';
import { MOCK_PRODUCTS } from '../constants';
import { getProductOptimizationSuggestion } from '../services/geminiService';
import { useChat, ChatRoom } from '../context/ChatContext';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { getProfile, DbProfile, createProduct } from '../services/db';
import { Product } from '../types';

// ─── Types ───────────────────────────────────────────────────────────────────

type SellerTab = 'resume' | 'products' | 'orders' | 'messages' | 'logistics' | 'financial' | 'analytics';

const salesData = [
  { day: 'Seg', sales: 4200 },
  { day: 'Ter', sales: 3800 },
  { day: 'Qua', sales: 5100 },
  { day: 'Qui', sales: 4900 },
  { day: 'Sex', sales: 6200 },
  { day: 'Sab', sales: 7500 },
  { day: 'Dom', sales: 8100 },
];

const categoryData = [
  { name: 'iPhone', value: 45 },
  { name: 'Samsung', value: 25 },
  { name: 'Xiaomi', value: 15 },
  { name: 'Outros', value: 15 },
];

// ─── Main Component ────────────────────────────────────────────────────────────

const SellerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SellerTab>('resume');
  const [analyzingProductId, setAnalyzingProductId] = useState<string | null>(null);
  const [optimizationData, setOptimizationData] = useState<Record<string, any>>({});
  const [productSearch, setProductSearch] = useState('');
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [sellerProfile, setSellerProfile] = useState<DbProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Fetch seller profile — mark done even if profile doesn't exist yet
  useEffect(() => {
    if (!user) { setProfileLoading(false); return; }
    getProfile(user.id).then(data => {
      setSellerProfile(data);
      setProfileLoading(false);
    });
  }, [user]);

  const sellerDisplayName = sellerProfile?.full_name || user?.email?.split('@')[0] || 'Lojista';

  // ── Gate conditions (computed before hooks that depend on them) ─────────────
  const isSellerVerified = !!(sellerProfile?.role === 'seller' && sellerProfile?.store_name);


  // ── Registration form state ─────────────────────────────────────────────────
  const [regForm, setRegForm] = useState({ full_name: '', document: '', phone: '', store_name: '', store_description: '' });
  const [regLoading, setRegLoading] = useState(false);
  const [regStep, setRegStep] = useState<1 | 2>(1);

  // ── Product creation modal state ────────────────────────────────────────────
  const [showProductModal, setShowProductModal] = useState(false);
  const [productSaving, setProductSaving] = useState(false);
  const [productImageFiles, setProductImageFiles] = useState<File[]>([]);
  const [productForm, setProductForm] = useState({
    title: '', category_name: 'Eletrônicos', description: '',
    price_brl: '', compare_price_brl: '', stock: '1',
  });

  const handleSellerRegister = async () => {
    if (!user) return;
    setRegLoading(true);
    await (await import('../services/db')).upsertProfile({
      id: user.id, role: 'seller',
      full_name: regForm.full_name, phone: regForm.phone,
      store_name: regForm.store_name as any, document: regForm.document as any,
      store_description: regForm.store_description as any,
    });
    const updated = await (await import('../services/db')).getProfile(user.id);
    setSellerProfile(updated);
    setRegLoading(false);
  };

  // ── Products fetch (all hooks MUST come before early returns) ───────────────
  useEffect(() => {
    if (!user || !isSellerVerified) return;
    (async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.from('products').select('*').eq('seller_id', user.id);
        if (!error && data) {
          setMyProducts(data.map((p: any) => ({
            id: p.id, sellerId: p.seller_id, sellerName: p.seller_name, category: p.category_name,
            title: p.title, description: p.description, priceBRL: Number(p.price_brl),
            comparePriceBRL: Number(p.compare_price_brl), stock: p.stock, rating: Number(p.rating),
            images: p.images, specs: p.specs, isVerified: p.is_verified
          })));
        }
      } catch (err) { console.error('fetchSellerProducts error:', err); }
      finally { setIsLoading(false); }
    })();
  }, [user, isSellerVerified]);

  // Remaining hooks — all must be before early returns
  const [productSubTab, setProductSubTab] = useState<'active' | 'archived'>('active');
  const { rooms, sendMessage, markAsRead } = useChat();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const selectedRoom = useMemo(() => rooms.find(r => r.id === selectedRoomId), [rooms, selectedRoomId]);

  useEffect(() => {
    if (chatScrollRef.current) chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
  }, [selectedRoom?.messages]);

  const filteredProducts = useMemo(() => {
    return myProducts.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(productSearch.toLowerCase());
      if (productSubTab === 'active') return matchesSearch && !p.isArchived;
      return matchesSearch && p.isArchived;
    });
  }, [myProducts, productSearch, productSubTab]);

  // Real stats from seller's products
  const sellerStats = useMemo(() => ({
    totalProducts: myProducts.length,
    totalStock: myProducts.reduce((s, p) => s + (p.stock || 0), 0),
    avgRating: myProducts.length > 0
      ? (myProducts.reduce((s, p) => s + (p.rating || 0), 0) / myProducts.length).toFixed(1)
      : '—',
  }), [myProducts]);

  const handleArchive = (id: string) => setMyProducts(prev => prev.map(p => p.id === id ? { ...p, isArchived: !p.isArchived } : p));
  const handleDelete = (id: string) => { if (confirm('Excluir permanentemente?')) setMyProducts(prev => prev.filter(p => p.id !== id)); };
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedRoomId) return;
    sendMessage(replyText);
    setReplyText('');
  };


  // ── GATE: Loading spinner ───────────────────────────────────────────────────
  if (profileLoading) return (

    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // ── GATE: Seller onboarding (buyer trying to access) ───────────────────────
  if (!isSellerVerified) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/40 py-16 px-4">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-5 shadow-xl shadow-indigo-200">🏪</div>
          <span className="inline-block bg-indigo-50 text-indigo-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-3">Tornando-se Lojista</span>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-3">
            Complete seu cadastro<br /><span className="text-indigo-600">e comece a vender</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-sm mx-auto">Preencha os dados abaixo para ativar seu painel de lojista e vender no XTUDO Paraguai.</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {[['🌎', 'Alcance Nacional', 'Venda para todo o Brasil'], ['📦', 'Logística Integrada', 'Rastreamento automático'], ['💸', 'Saque Rápido', 'Repasse em até 7 dias']].map(([icon, title, desc]) => (
            <div key={title} className="bg-white rounded-2xl border border-slate-100 p-4 text-center shadow-sm">
              <p className="text-2xl mb-2">{icon}</p>
              <p className="font-black text-slate-800 text-xs">{title}</p>
              <p className="text-slate-400 text-[10px] mt-0.5">{desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl p-8 space-y-5">
          <div className="flex items-center gap-3 mb-1">
            {([1, 2] as const).map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm ${regStep === s ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : regStep > s ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{regStep > s ? '✓' : s}</div>
                <span className={`text-xs font-bold ${regStep === s ? 'text-slate-800' : 'text-slate-400'}`}>{s === 1 ? 'Dados Pessoais' : 'Dados da Loja'}</span>
                {s < 2 && <div className="w-6 h-px bg-slate-200" />}
              </div>
            ))}
          </div>

          {regStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo *</label>
                <input type="text" placeholder="Seu nome completo" value={regForm.full_name} onChange={e => setRegForm(f => ({ ...f, full_name: e.target.value }))} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CNPJ / CPF *</label>
                  <input type="text" placeholder="00.000.000/0001-00" value={regForm.document} onChange={e => setRegForm(f => ({ ...f, document: e.target.value }))} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Telefone *</label>
                  <input type="text" placeholder="(11) 99999-9999" value={regForm.phone} onChange={e => setRegForm(f => ({ ...f, phone: e.target.value }))} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100" />
                </div>
              </div>
              <button onClick={() => setRegStep(2)} disabled={!regForm.full_name || !regForm.document || !regForm.phone} className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed">
                Próximo →
              </button>
            </div>
          )}

          {regStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome da Loja *</label>
                <input type="text" placeholder="Ex: TechShop Paraguai" value={regForm.store_name} onChange={e => setRegForm(f => ({ ...f, store_name: e.target.value }))} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Descrição da Loja</label>
                <textarea rows={3} placeholder="O que sua loja vende, diferenciais..." value={regForm.store_description} onChange={e => setRegForm(f => ({ ...f, store_description: e.target.value }))} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 resize-none" />
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 text-xs text-slate-500 leading-relaxed">
                📋 Ao se cadastrar como lojista, você concorda em seguir as políticas do marketplace XTUDO, manter estoque atualizado e garantir a entrega dos produtos dentro do prazo.
              </div>
              <div className="flex gap-3">
                <button onClick={() => setRegStep(1)} className="flex-1 bg-slate-100 text-slate-600 font-black py-4 rounded-2xl hover:bg-slate-200 transition-all">← Voltar</button>
                <button onClick={handleSellerRegister} disabled={regLoading || !regForm.store_name} className="flex-[2] bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black py-4 rounded-2xl shadow-lg hover:opacity-90 transition-all active:scale-95 disabled:opacity-40">
                  {regLoading ? '⏳ Ativando...' : '🚀 Ativar Painel de Lojista'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );


  // ── Full dashboard (only rendered for verified sellers) ────────────────────


  const handleOtimizar = async (product: any) => {
    setAnalyzingProductId(product.id);
    const result = await getProductOptimizationSuggestion(product.title, product.priceBRL, product.stock);
    if (result) {
      setOptimizationData(prev => ({ ...prev, [product.id]: result }));
    }
    setAnalyzingProductId(null);
  };

  // ─── Renderers ──────────────────────────────────────────────────────────────

  const RenderResume = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      {!isLoading && sellerStats.totalProducts === 0 && (
        <div className="bg-white rounded-[32px] border border-slate-100 p-12 text-center shadow-sm">
          <p className="text-5xl mb-4">🚀</p>
          <h3 className="text-xl font-black text-slate-900 mb-2">Sua loja está pronta!</h3>
          <p className="text-slate-400 font-medium max-w-sm mx-auto text-sm">Adicione seus primeiros produtos para começar a vender. As métricas aparecerão assim que você tiver pedidos.</p>
          <button onClick={() => setActiveTab('products')} className="mt-6 bg-indigo-600 text-white font-black px-8 py-3 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">+ Adicionar Produtos</button>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Produtos Ativos" value={isLoading ? '...' : String(sellerStats.totalProducts)} icon="📦" />
        <DashboardCard title="Estoque Total" value={isLoading ? '...' : String(sellerStats.totalStock)} icon="🏪" />
        <DashboardCard title="Pedidos Hoje" value="0" icon="🛒" />
        <DashboardCard title="Rating Médio" value={isLoading ? '...' : `${sellerStats.avgRating}/5.0`} icon="⭐" />
      </div>

      {/* IA Insights Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 opacity-10 scale-150 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-64 w-64" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold">Resumo da IA</h3>
          </div>
          <p className="text-sm md:text-base font-medium leading-relaxed max-w-2xl opacity-90">
            "Sua loja está com alta performance em <span className="underline decoration-indigo-400 underline-offset-4">iPhone 15 Pro</span>.
            Recomendamos aumentar o estoque em 20% para o próximo final de semana devido ao feriado no Brasil."
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            Performance de Vendas
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-widest font-black">7 Dias</span>
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dx={-10} tickFormatter={(value) => `R$ ${value}`} />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  formatter={(value: any) => [`R$ ${value.toLocaleString()}`, 'Vendas']}
                />
                <Area type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Mix de Produtos</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} width={80} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', shadow: 'none' }} />
                <Bar dataKey="value" fill="#4f46e5" radius={[0, 10, 10, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  const RenderProducts = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar nos meus produtos..."
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-medium"
          />
        </div>
        <button
          onClick={() => setShowProductModal(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-sm font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/xl" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
          </svg>
          Novo Produto
        </button>
      </div>

      <div className="flex items-center gap-4 bg-white p-1.5 border border-slate-200 rounded-2xl w-fit">
        <button
          onClick={() => setProductSubTab('active')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${productSubTab === 'active' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Ativos ({myProducts.filter(p => !p.isArchived).length})
        </button>
        <button
          onClick={() => setProductSubTab('archived')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${productSubTab === 'archived' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Arquivados ({myProducts.filter(p => p.isArchived).length})
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Produto</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Estoque</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Preço</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Avaliação</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 shadow-sm border border-slate-200">
                        <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className={`text-sm font-bold line-clamp-1 ${product.isArchived ? 'text-slate-400 italic' : 'text-slate-800'}`}>{product.title}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{product.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-sm font-black ${product.stock < 10 ? 'text-rose-500' : 'text-slate-700'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-black text-slate-900">R$ {product.priceBRL}</p>
                    <p className="text-[10px] text-slate-400 line-through">R$ {product.comparePriceBRL}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-slate-800">{product.rating}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {!product.isArchived && (
                        <button
                          onClick={() => handleOtimizar(product)}
                          className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all shadow-sm"
                          title="Otimizar com IA"
                        >
                          {analyzingProductId === product.id ? (
                            <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          )}
                        </button>
                      )}

                      <button
                        onClick={() => { window.location.hash = `#seller/products/edit/${product.id}`; }}
                        className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all shadow-sm"
                        title="Editar"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>

                      <button
                        onClick={() => handleArchive(product.id)}
                        className={`p-2 rounded-xl transition-all shadow-sm ${product.isArchived ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'}`}
                        title={product.isArchived ? 'Restaurar' : 'Arquivar'}
                      >
                        {product.isArchived ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                        )}
                      </button>

                      {product.isArchived && (
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-all shadow-sm"
                          title="Excluir Definitivamente"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const RenderOrders = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">A Enviar</p>
          <p className="text-3xl font-black text-slate-900">08</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Em Trânsito</p>
          <p className="text-3xl font-black text-blue-600">12</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Concluídos (Mês)</p>
          <p className="text-3xl font-black text-emerald-500">142</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 uppercase text-[9px] font-black text-slate-400 tracking-tighter">
              <th className="px-6 py-4">Pedido / Data</th>
              <th className="px-6 py-4">Cliente</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {[
              { id: '4291', buyer: 'Carla Silva', status: 'pago', date: 'Hoje, 14:20', total: 6890 },
              { id: '4290', buyer: 'Marcos Oliveira', status: 'processando', date: 'Hoje, 11:05', total: 1280 },
              { id: '4289', buyer: 'Ana Souza', status: 'enviado', date: 'Ontem', total: 3250 },
              { id: '4288', buyer: 'Pedro Ferreira', status: 'pago', date: 'Ontem', total: 5900 },
              { id: '4287', buyer: 'Juliana Lima', status: 'cancelado', date: '21 Fev', total: 120 },
            ].map((order) => (
              <tr key={order.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 text-xs font-bold">
                  <span className="text-slate-800">#{order.id}</span>
                  <p className="text-slate-400 font-medium">{order.date}</p>
                </td>
                <td className="px-6 py-4 font-bold text-slate-700 text-sm">{order.buyer}</td>
                <td className="px-6 py-4">
                  <span className={`text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full ${order.status === 'pago' ? 'bg-emerald-100 text-emerald-700' :
                    order.status === 'enviado' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'cancelado' ? 'bg-rose-100 text-rose-700' :
                        'bg-amber-100 text-amber-700'
                    }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-black text-slate-900 text-sm">R$ {order.total}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-indigo-600 font-black text-[10px] hover:underline">DETALHES</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const RenderFinancial = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[40px] p-10 text-white shadow-2xl shadow-emerald-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-40 w-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm font-bold opacity-80 mb-2">Disponível para saque</p>
          <h4 className="text-5xl font-black mb-10 tracking-tighter">R$ 14.820,50</h4>
          <button className="w-full bg-white text-emerald-700 font-black py-4 rounded-2xl shadow-xl hover:bg-emerald-50 transition-all active:scale-95">
            Solicitar Saque PIX
          </button>
        </div>
        <div className="bg-white rounded-[40px] border-2 border-slate-100 p-10 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-sm font-bold text-slate-400 mb-2">Lançamentos Futuros</p>
            <h4 className="text-4xl font-black text-slate-900 tracking-tighter">R$ 27.680,22</h4>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-100">
            <div className="flex justify-between items-center text-sm mb-4">
              <span className="text-slate-500 font-medium">Próximo pagamento</span>
              <span className="text-slate-900 font-black">28 de Fev</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-medium">Taxas e comissões (Mês)</span>
              <span className="text-rose-500 font-bold">- R$ 3.420</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-8">
        <h3 className="text-lg font-bold text-slate-800 mb-6 font-primary">Histórico de Movimentações</h3>
        <div className="space-y-4">
          {[
            { date: '22 Fev', desc: 'Venda Pedido #4291', value: 6890, type: 'plus' },
            { date: '21 Fev', desc: 'Saque PIX Efetuado', value: 12000, type: 'minus' },
            { date: '21 Fev', desc: 'Venda Pedido #4289', value: 3250, type: 'plus' },
            { date: '20 Fev', desc: 'Taxa Publicidade Premium', value: 450, type: 'minus' },
          ].map((move, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-slate-400 w-12">{move.date}</span>
                <p className="text-sm font-bold text-slate-700">{move.desc}</p>
              </div>
              <p className={`text-sm font-black ${move.type === 'plus' ? 'text-emerald-500' : 'text-rose-500'}`}>
                {move.type === 'plus' ? '+' : '-'} R$ {move.value.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const RenderMessages = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[650px] animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Rooms List */}
      <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-black text-slate-900 text-lg">Conversas</h3>
          <span className="bg-white text-slate-500 text-[10px] font-black px-2 py-1 rounded-full border border-slate-100 uppercase tracking-widest">{rooms.length} Ativas</span>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
          {rooms.length === 0 ? (
            <div className="p-10 text-center flex flex-col items-center justify-center h-full">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              </div>
              <p className="text-slate-400 text-sm font-bold max-w-[200px]">Aguardando novas mensagens de potenciais clientes.</p>
            </div>
          ) : (
            rooms.map(room => (
              <button
                key={room.id}
                onClick={() => { setSelectedRoomId(room.id); markAsRead(room.id); }}
                className={`w-full p-6 text-left hover:bg-slate-50 transition-all flex items-center gap-4 group ${selectedRoomId === room.id ? 'bg-indigo-50/50' : ''}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center font-black text-lg shadow-sm transition-all ${selectedRoomId === room.id ? 'bg-indigo-600 text-white scale-110 shadow-indigo-100' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600'}`}>
                  {room.sellerName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-black text-slate-800 text-sm truncate">{room.sellerName}</p>
                    {room.lastTimestamp && (
                      <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap ml-2">{new Date(room.lastTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate font-medium">{room.lastMessage || 'Nova conversa iniciada'}</p>
                </div>
                {room.unreadCount > 0 && (
                  <div className="w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center text-white text-[10px] font-black shadow-lg shadow-rose-200">
                    {room.unreadCount}
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Active Chat */}
      <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col relative">
        {selectedRoom ? (
          <>
            <div className="p-6 border-b border-slate-100 bg-white flex items-center justify-between shadow-sm z-10 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-100">
                  {selectedRoom.sellerName[0]}
                </div>
                <div>
                  <p className="font-black text-slate-900 text-base">{selectedRoom.sellerName}</p>
                  <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Cliente Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>

            <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30">
              <div className="text-center mb-8">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] bg-white px-4 py-1.5 rounded-full border border-slate-100 shadow-sm">Hoje</span>
              </div>
              {selectedRoom.messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.senderRole === 'seller' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                  <div className={`max-w-[75%] p-4 rounded-3xl shadow-sm relative ${msg.senderRole === 'seller'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none font-medium'
                    }`}>
                    <p className="leading-relaxed text-sm">{msg.text}</p>
                    <p className={`text-[9px] mt-2 font-bold uppercase tracking-tighter opacity-50 ${msg.senderRole === 'seller' ? 'text-right' : 'text-left'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendReply} className="p-6 bg-white border-t border-slate-100 flex items-center gap-4 z-10 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
              <div className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 hover:border-slate-200 focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-50 transition-all flex items-center gap-4">
                <input
                  type="text"
                  placeholder="Responda seu cliente..."
                  className="flex-1 bg-transparent text-sm font-bold outline-none text-slate-700 placeholder:text-slate-300"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <button type="button" className="text-slate-300 hover:text-indigo-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </button>
              </div>
              <button
                type="submit"
                disabled={!replyText.trim()}
                className={`h-[52px] px-8 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 shadow-lg ${!replyText.trim()
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200'
                  }`}
              >
                Enviar Resposta
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center bg-slate-50/10">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-10 rounded-full animate-pulse"></div>
              <div className="relative w-24 h-24 bg-white border border-slate-100 rounded-[32px] shadow-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              </div>
            </div>
            <h4 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Central de Atendimento XTUDO</h4>
            <p className="text-sm font-medium text-slate-400 max-w-sm leading-relaxed">Não perca o tempo de resposta! Vendedores que respondem em menos de 10 minutos vendem <span className="text-emerald-500 font-black">2x mais</span>.</p>
            <div className="mt-10 flex gap-4">
              <div className="bg-white px-6 py-4 rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Taxa de Resposta</p>
                <p className="text-xl font-black text-slate-900">99.4%</p>
              </div>
              <div className="bg-white px-6 py-4 rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tempo Médio</p>
                <p className="text-xl font-black text-slate-900">12 min</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const RenderAnalytics = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Vendas (Mês)" value="R$ 127.420" change={18} icon="📈" />
        <DashboardCard title="Total de Pedidos" value="342" change={9} icon="🛒" />
        <DashboardCard title="Ticket Médio" value="R$ 372" change={5} icon="🎯" />
        <DashboardCard title="Taxa de Conversão" value="4.8%" change={-1} icon="🔄" />
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
        <h3 className="font-black text-slate-900 text-lg mb-6 flex items-center gap-2">
          🏆 Produtos Mais Vendidos
        </h3>
        <div className="space-y-4">
          {[
            { rank: 1, name: 'iPhone 15 Pro 256GB', sold: 48, revenue: 'R$ 329.520', pct: 85 },
            { rank: 2, name: 'Samsung Galaxy S24 Ultra', sold: 31, revenue: 'R$ 186.000', pct: 62 },
            { rank: 3, name: 'AirPods Pro 2ª Geração', sold: 27, revenue: 'R$ 59.400', pct: 54 },
            { rank: 4, name: 'PlayStation 5 Slim', sold: 19, revenue: 'R$ 114.000', pct: 38 },
            { rank: 5, name: 'DJI Mini 4 Pro', sold: 14, revenue: 'R$ 97.580', pct: 28 },
          ].map(p => (
            <div key={p.rank} className="flex items-center gap-4">
              <span className={`text-xs font-black w-6 text-center ${p.rank === 1 ? 'text-amber-500' :
                p.rank === 2 ? 'text-slate-400' :
                  p.rank === 3 ? 'text-amber-700' : 'text-slate-300'
                }`}>#{p.rank}</span>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-bold text-slate-800">{p.name}</span>
                  <span className="text-xs font-black text-slate-500">{p.sold} vendas</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700"
                    style={{ width: `${p.pct}%` }}
                  />
                </div>
              </div>
              <span className="text-xs font-black text-emerald-600 w-24 text-right">{p.revenue}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sales chart from last 30 days */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
        <h3 className="font-black text-slate-900 text-lg mb-6">📅 Vendas — Últimos 30 Dias</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[
              { day: '1', sales: 2100 }, { day: '5', sales: 3800 }, { day: '10', sales: 5100 },
              { day: '15', sales: 4400 }, { day: '20', sales: 7200 }, { day: '25', sales: 6900 },
              { day: '30', sales: 9100 },
            ]}>
              <defs>
                <linearGradient id="colorA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dy={8} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,.08)' }} formatter={(v: any) => [`R$ ${v.toLocaleString()}`, 'Vendas']} />
              <Area type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorA)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  // ─── Main Render ─────────────────────────────────────────────────────────────

  const sellerNavItems = [
    { id: 'resume' as SellerTab, icon: '📊', label: 'Resumo' },
    { id: 'products' as SellerTab, icon: '📦', label: 'Produtos' },
    { id: 'orders' as SellerTab, icon: '🛒', label: 'Pedidos' },
    { id: 'messages' as SellerTab, icon: '💬', label: 'Mensagens' },
    { id: 'logistics' as SellerTab, icon: '🚚', label: 'Envios' },
    { id: 'financial' as SellerTab, icon: '💰', label: 'Financeiro' },
    { id: 'analytics' as SellerTab, icon: '📈', label: 'Analytics' },
  ];

  const handleCreateProduct = async () => {
    if (!user || !productForm.title || !productForm.price_brl) return;
    setProductSaving(true);
    const result = await createProduct({
      seller_id: user.id,
      seller_name: sellerProfile?.full_name || sellerProfile?.store_name || user.email || 'Lojista',
      title: productForm.title,
      category_name: productForm.category_name,
      description: productForm.description,
      price_brl: Number(productForm.price_brl),
      compare_price_brl: Number(productForm.compare_price_brl) || Number(productForm.price_brl),
      stock: Number(productForm.stock) || 1,
      images: await (async () => {
        if (productImageFiles.length === 0) return [];
        const urls: string[] = [];
        for (const file of productImageFiles) {
          const path = `${user.id}/${Date.now()}-${file.name.replace(/\s/g, '_')}`;
          const { error: upErr } = await supabase.storage
            .from('product-images')
            .upload(path, file, { upsert: true });
          if (!upErr) {
            const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(path);
            if (urlData?.publicUrl) urls.push(urlData.publicUrl);
          }
        }
        return urls;
      })(),
    });
    setProductSaving(false);
    if (result) {
      setShowProductModal(false);
      setProductForm({ title: '', category_name: 'Eletrônicos', description: '', price_brl: '', compare_price_brl: '', stock: '1' });
      setProductImageFiles([]);
      // Refresh product list
      const { data } = await supabase.from('products').select('*').eq('seller_id', user.id);
      if (data) setMyProducts(data.map((p: any) => ({
        id: p.id, sellerId: p.seller_id, sellerName: p.seller_name, category: p.category_name,
        title: p.title, description: p.description, priceBRL: Number(p.price_brl),
        comparePriceBRL: Number(p.compare_price_brl), stock: p.stock, rating: Number(p.rating),
        images: p.images ?? [], specs: p.specs ?? [], isVerified: p.is_verified,
      })));
    }
  };

  const CATGORIES = ['Eletrônicos', 'Celulares', 'Computadores', 'Acessórios', 'Games', 'Apple', 'Perfumes', 'Relógios', 'Moda', 'Calçados', 'Casa', 'Esportes', 'Outros'];

  return (
    <div className="min-h-screen bg-slate-50/60">
      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Product Creation Modal */}
        {showProductModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-4" onClick={e => e.target === e.currentTarget && setShowProductModal(false)}>
            <div className="bg-white rounded-t-[32px] sm:rounded-[32px] w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 rounded-t-[32px] sm:rounded-t-[32px]">
                <h3 className="text-white font-black text-lg">✨ Cadastrar Novo Produto</h3>
                <p className="text-white/60 text-sm mt-0.5">Preencha os dados do produto para publicar na XTUDO</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Título do Produto *</label>
                  <input type="text" placeholder="Ex: iPhone 15 Pro 256GB Preto" value={productForm.title} onChange={e => setProductForm(f => ({ ...f, title: e.target.value }))} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Categoria *</label>
                  <select value={productForm.category_name} onChange={e => setProductForm(f => ({ ...f, category_name: e.target.value }))} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100">
                    {CATGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Preço de Venda (R$) *</label>
                    <input type="number" min="0" step="0.01" placeholder="0,00" value={productForm.price_brl} onChange={e => setProductForm(f => ({ ...f, price_brl: e.target.value }))} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Preço Original (R$)</label>
                    <input type="number" min="0" step="0.01" placeholder="0,00" value={productForm.compare_price_brl} onChange={e => setProductForm(f => ({ ...f, compare_price_brl: e.target.value }))} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Quantidade em Estoque *</label>
                  <input type="number" min="1" placeholder="1" value={productForm.stock} onChange={e => setProductForm(f => ({ ...f, stock: e.target.value }))} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fotos do Produto (máx. 5)</label>
                  <label className="flex flex-col items-center justify-center w-full h-28 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-all">
                    <input type="file" accept="image/*" multiple className="hidden" onChange={e => {
                      const files = Array.from(e.target.files || []).slice(0, 5);
                      setProductImageFiles(files);
                    }} />
                    <span className="text-3xl mb-1">📸</span>
                    <span className="text-xs font-bold text-slate-500">Clique para selecionar</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, WEBP • Até 5 imagens</span>
                  </label>
                  {productImageFiles.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {productImageFiles.map((f, i) => (
                        <div key={i} className="relative group">
                          <img src={URL.createObjectURL(f)} alt={`preview-${i}`} className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-sm" />
                          <button type="button" onClick={() => setProductImageFiles(prev => prev.filter((_, j) => j !== i))} className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full w-4 h-4 text-[9px] font-black flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity">x</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Descrição</label>
                  <textarea rows={3} placeholder="Descreva o produto..." value={productForm.description} onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 resize-none" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowProductModal(false)} className="flex-1 bg-slate-100 text-slate-600 font-black py-4 rounded-2xl hover:bg-slate-200 transition-all">Cancelar</button>
                  <button onClick={handleCreateProduct} disabled={productSaving || !productForm.title || !productForm.price_brl} className="flex-[2] bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black py-4 rounded-2xl shadow-lg hover:opacity-90 transition-all active:scale-95 disabled:opacity-40">
                    {productSaving ? '⏳ Publicando...' : '🚀 Publicar Produto'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-[28px] p-6 mb-8 flex items-center gap-5 shadow-xl shadow-indigo-200/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5 pointer-events-none" />
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-black text-white shadow-lg flex-shrink-0 border border-white/20">
            {sellerDisplayName[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-black text-lg leading-tight truncate">{sellerDisplayName}</p>
            <p className="text-white/60 text-sm font-medium truncate">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="inline-flex items-center gap-1 bg-white/15 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest">
                🏪 {sellerProfile?.store_name || 'Lojista'}
              </span>
            </div>
          </div>
          <div className="flex-shrink-0 text-right hidden sm:block">
            <p className="text-white/50 text-[10px] uppercase tracking-widest font-black">Produtos</p>
            <p className="text-white font-black text-2xl">{myProducts.length}</p>
            <p className="text-white/50 text-[10px]">cadastrados</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* Mobile nav grid */}
          <div className="lg:hidden grid grid-cols-7 gap-1.5 bg-white rounded-2xl border border-slate-100 shadow-sm p-3">
            {sellerNavItems.map(item => (
              <button key={item.id} onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all ${activeTab === item.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}>
                <span className="text-lg">{item.icon}</span>
                <span className="text-[7px] font-black uppercase tracking-tight leading-none">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Desktop sidebar */}
          <aside className="hidden lg:flex flex-col w-56 flex-shrink-0">
            <nav className="flex flex-col gap-1 bg-white rounded-[24px] border border-slate-100 shadow-sm p-3 sticky top-6">
              {sellerNavItems.map(item => (
                <button key={item.id} onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-all ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
                  <span className="text-base">{item.icon}</span>
                  <span className="uppercase tracking-tight text-[11px] font-black">{item.label}</span>
                  {activeTab === item.id && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-auto opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  )}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {activeTab === 'resume' && <RenderResume />}
            {activeTab === 'products' && <RenderProducts />}
            {activeTab === 'orders' && <RenderOrders />}
            {activeTab === 'messages' && <RenderMessages />}
            {activeTab === 'financial' && <RenderFinancial />}
            {activeTab === 'logistics' && <RenderOrders />}
            {activeTab === 'analytics' && <RenderAnalytics />}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;

