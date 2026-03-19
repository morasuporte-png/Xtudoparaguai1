
import React, { useState, useEffect, useRef } from 'react';
import { WHOLESALE_VOLUME_TIERS, WHOLESALE_TOP_CATEGORIES, WHOLESALE_STATS } from '../constants';
import { useAuth } from '../context/AuthContext';
import { getProfile, upsertProfile, DbProfile } from '../services/db';
import { supabase } from '../services/supabaseClient';

// ── Types ──────────────────────────────────────────────────────────────────
interface WholesaleProduct {
    id: string;
    title: string;
    image_url: string;
    price_brl: number;
    seller_name: string;
    stock: number;
    category: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────
const getDiscount = (qty: number) => {
    if (qty >= 50) return 32;
    if (qty >= 20) return 25;
    if (qty >= 10) return 18;
    if (qty >= 5) return 10;
    return 0;
};

const fmt = (v: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

// ── Wholesaler Registration Modal ──────────────────────────────────────────
interface RegModalProps {
    onClose: () => void;
    onSuccess: () => void;
    userId: string;
}
const RegistrationModal: React.FC<RegModalProps> = ({ onClose, onSuccess, userId }) => {
    const [form, setForm] = useState({
        full_name: '', document: '', phone: '', city: '', state: '',
        business_type: 'MEI' as 'MEI' | 'Empresa' | 'Informal',
        store_name: '',
    });
    const [saving, setSaving] = useState(false);
    const [done, setDone] = useState(false);

    const handleSubmit = async () => {
        if (!form.full_name || !form.document || !form.phone) return;
        setSaving(true);
        await upsertProfile({
            id: userId,
            full_name: form.full_name,
            phone: form.phone,
            document: form.document as any,
            store_name: form.store_name as any,
            is_wholesaler: true,
        } as any);
        setSaving(false);
        setDone(true);
        setTimeout(onSuccess, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden">
                {done ? (
                    <div className="p-12 text-center">
                        <p className="text-5xl mb-4">🎉</p>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">Cadastro Enviado!</h3>
                        <p className="text-slate-500 font-medium">Bem-vindo ao Atacado XTUDO. Seus preços exclusivos já estão ativos.</p>
                    </div>
                ) : (
                    <>
                        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6 text-white">
                            <h3 className="text-xl font-black mb-1">Cadastro de Revendedor</h3>
                            <p className="text-teal-100 text-sm">Preencha os dados para desbloquear preços exclusivos de atacado.</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo / Razão Social *</label>
                                    <input type="text" placeholder="João Silva / Silva LTDA" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-200" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CNPJ / CPF *</label>
                                        <input type="text" placeholder="00.000.000/0001-00" value={form.document} onChange={e => setForm(f => ({ ...f, document: e.target.value }))} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-200" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp *</label>
                                        <input type="text" placeholder="(11) 99999-9999" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-200" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome da Loja / Ponto de Venda</label>
                                    <input type="text" placeholder="Eletrônicos João" value={form.store_name} onChange={e => setForm(f => ({ ...f, store_name: e.target.value }))} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-200" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipo de Negócio</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {(['MEI', 'Empresa', 'Informal'] as const).map(t => (
                                            <button key={t} onClick={() => setForm(f => ({ ...f, business_type: t }))} className={`py-3 rounded-2xl text-xs font-black transition-all border-2 ${form.business_type === t ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-100 bg-slate-50 text-slate-500'}`}>{t}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-teal-50 rounded-2xl p-4 text-xs text-teal-700 font-medium">
                                📋 Ao se cadastrar, você concorda com as políticas de revenda XTUDO e garante que os dados fornecidos são verídicos.
                            </div>
                            <div className="flex gap-3 pt-1">
                                <button onClick={onClose} className="flex-1 bg-slate-100 text-slate-600 font-black py-4 rounded-2xl hover:bg-slate-200 transition-all">Cancelar</button>
                                <button onClick={handleSubmit} disabled={saving || !form.full_name || !form.document || !form.phone} className="flex-[2] bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-black py-4 rounded-2xl shadow-lg hover:opacity-90 transition-all active:scale-95 disabled:opacity-40">
                                    {saving ? '⏳ Cadastrando...' : '🚀 Ativar Conta de Revendedor'}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

// ── Product Card with volume pricing ──────────────────────────────────────
const WholesaleProductCard: React.FC<{ product: WholesaleProduct }> = ({ product }) => {
    const tiers = [
        { qty: 5, disc: 10 },
        { qty: 10, disc: 18 },
        { qty: 20, disc: 25 },
        { qty: 50, disc: 32 },
    ];
    return (
        <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-teal-50 transition-all group">
            <div className="h-44 bg-slate-50 flex items-center justify-center overflow-hidden">
                {product.image_url ? (
                    <img src={product.image_url} alt={product.title} className="h-full w-full object-contain p-4 group-hover:scale-105 transition-transform duration-300" />
                ) : (
                    <span className="text-5xl">📦</span>
                )}
            </div>
            <div className="p-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{product.category}</p>
                <h4 className="font-black text-slate-900 text-sm leading-tight mb-1 line-clamp-2">{product.title}</h4>
                <p className="text-[10px] text-teal-600 font-bold mb-3">por {product.seller_name}</p>

                <div className="space-y-1.5 mb-4">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Preços por Volume</p>
                    {tiers.map(t => (
                        <div key={t.qty} className="flex items-center justify-between bg-slate-50 rounded-xl px-3 py-1.5">
                            <span className="text-[10px] font-bold text-slate-500">{t.qty}+ un.</span>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-lg">-{t.disc}%</span>
                                <span className="text-xs font-black text-slate-800">R$ {fmt(product.price_brl * (1 - t.disc / 100))}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <a
                    href={`https://wa.me/595${product.seller_name ? '' : ''}?text=${encodeURIComponent(`Olá! Tenho interesse no produto "${product.title}" no atacado via XTUDO Paraguai.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full text-center bg-teal-600 hover:bg-teal-700 text-white font-black text-xs py-3 rounded-2xl transition-all active:scale-95 shadow-sm"
                >
                    💬 Pedir no WhatsApp
                </a>
            </div>
        </div>
    );
};

// ── Main Component ─────────────────────────────────────────────────────────
const WholesaleDashboard: React.FC = () => {
    const [simQty, setSimQty] = useState(10);
    const [simPrice, setSimPrice] = useState(6890);
    const [simMargin, setSimMargin] = useState(20);
    const [showRegModal, setShowRegModal] = useState(false);
    const [profile, setProfile] = useState<DbProfile | null>(null);
    const [profileLoading, setProfileLoading] = useState(true);
    const [products, setProducts] = useState<WholesaleProduct[]>([]);
    const [productsLoading, setProductsLoading] = useState(true);
    const catalogRef = useRef<HTMLDivElement>(null);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) { setProfileLoading(false); return; }
        getProfile(user.id).then(data => { setProfile(data); setProfileLoading(false); });
    }, [user]);

    useEffect(() => {
        (async () => {
            setProductsLoading(true);
            const { data } = await supabase
                .from('products')
                .select('id, title, images, price_brl, seller_name, stock, category_name')
                .eq('is_active', true)
                .gt('stock', 0)
                .order('created_at', { ascending: false })
                .limit(12);
            if (data) {
                setProducts(data.map((p: any) => ({
                    id: p.id,
                    title: p.title,
                    image_url: p.images?.[0] ?? '',
                    price_brl: Number(p.price_brl),
                    seller_name: p.seller_name ?? 'Seller',
                    stock: p.stock,
                    category: p.category_name ?? '',
                })));
            }
            setProductsLoading(false);
        })();
    }, []);

    const discount = getDiscount(simQty);
    const unitCost = simPrice * (1 - discount / 100);
    const salePrice = unitCost * (1 + simMargin / 100);
    const grossProfit = (salePrice - unitCost) * simQty;
    const totalInvestment = unitCost * simQty;

    const isWholesaler = profile?.is_wholesaler === true;

    const handleOpenModal = () => {
        if (!user) { window.location.hash = '#auth'; return; }
        setShowRegModal(true);
    };

    const CONSULTANT_WA = 'https://wa.me/5521999999999?text=' + encodeURIComponent('Olá! Quero saber mais sobre o Atacado XTUDO Paraguai.');

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">

            {showRegModal && user && (
                <RegistrationModal
                    userId={user.id}
                    onClose={() => setShowRegModal(false)}
                    onSuccess={() => { setShowRegModal(false); getProfile(user.id).then(setProfile); }}
                />
            )}

            {/* ── HERO ──────────────────────────────────────────────────── */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 p-10 text-white">
                <div className="absolute inset-0 opacity-10">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="absolute rounded-full bg-white"
                            style={{ width: `${80 + i * 60}px`, height: `${80 + i * 60}px`, top: `${-20 + i * 15}%`, right: `${-5 + i * 8}%`, opacity: 0.15 }} />
                    ))}
                </div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-[10px] font-black px-3 py-1 rounded-full tracking-wider uppercase mb-4">
                            📦 Atacado XTUDO
                        </span>
                        <h1 className="text-3xl md:text-4xl font-extrabold mb-3 leading-tight">Compre em volume,<br />lucre mais.</h1>
                        <p className="text-teal-100 text-sm leading-relaxed max-w-md">
                            Acesso direto aos sellers de Ciudad del Este com descontos progressivos por volume. Sem intermediários, sem burocracia.
                        </p>
                    </div>
                    <div className="flex-shrink-0 flex flex-col gap-3">
                        <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl px-8 py-5 text-center">
                            <div className="text-4xl font-black">32%</div>
                            <div className="text-teal-200 text-xs font-bold mt-1">Desconto máximo</div>
                        </div>
                        {!profileLoading && (
                            isWholesaler ? (
                                <div className="bg-emerald-400/20 border border-emerald-300/30 rounded-2xl px-6 py-3 text-center">
                                    <p className="text-emerald-200 text-[10px] font-black uppercase tracking-widest">Status</p>
                                    <p className="text-white font-black">✅ Revendedor Ativo</p>
                                </div>
                            ) : (
                                <button onClick={handleOpenModal} className="bg-white text-teal-700 font-black text-sm px-6 py-3 rounded-2xl hover:bg-teal-50 transition-all shadow-xl active:scale-95">
                                    Solicitar Cadastro →
                                </button>
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* ── STATS ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {WHOLESALE_STATS.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <div className="text-2xl mb-2">{stat.icon}</div>
                        <div className="text-2xl font-extrabold text-slate-900">{stat.value}</div>
                        <div className="text-xs text-slate-500 font-medium mt-0.5">{stat.label}</div>
                        <div className="inline-flex items-center gap-1 mt-2 text-[11px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">↑ {stat.change}</div>
                    </div>
                ))}
            </div>

            {/* ── FAIXAS DE DESCONTO ─────────────────────────────────── */}
            <div>
                <div className="flex items-end justify-between mb-5">
                    <div>
                        <h2 className="text-xl font-extrabold text-slate-900">Descontos por Volume</h2>
                        <p className="text-slate-500 text-sm mt-1">Aplicados automaticamente no checkout para compradores cadastrados.</p>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">*Sobre preço de tabela CDE</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {WHOLESALE_VOLUME_TIERS.map((tier) => (
                        <div key={tier.badge} className={`relative bg-white rounded-2xl border-2 ${tier.border} shadow-sm overflow-hidden`}>
                            <div className={`${tier.color} px-4 py-2 flex items-center justify-between`}>
                                <span className="text-[10px] font-black uppercase tracking-widest">{tier.badge}</span>
                                <span className="text-[10px] font-bold opacity-70">{tier.label}</span>
                            </div>
                            <div className="p-5 text-center">
                                <div className="text-5xl font-black text-slate-900 leading-none">{tier.discount}%</div>
                                <div className="text-xs text-slate-500 font-medium mt-2">de desconto</div>
                                <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
                                    A partir de {tier.label.split(' ')[0]} unidades
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* ── TOP CATEGORIAS ─────────────────────────────────── */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100">
                        <h3 className="font-extrabold text-slate-900">🔥 Top Categorias no Atacado</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Mais pedidas pelos revendedores este mês</p>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {WHOLESALE_TOP_CATEGORIES.map((cat, idx) => (
                            <div key={cat.name} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                                <span className="text-slate-400 text-xs font-black w-4">{idx + 1}</span>
                                <span className="text-xl">{cat.icon}</span>
                                <div className="flex-1">
                                    <div className="text-sm font-bold text-slate-800">{cat.name}</div>
                                    <div className="text-[11px] text-slate-400 font-medium">Pedido médio: {cat.avgOrder}</div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <div className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{cat.saving} off</div>
                                    <div className="text-[10px] text-teal-500 font-bold mt-1">{cat.trend} este mês</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── SIMULADOR DE ROI ───────────────────────────────── */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100">
                        <h3 className="font-extrabold text-slate-900">🧮 Simulador de Lucro</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Calcule seu ganho antes de fechar o pedido</p>
                    </div>
                    <div className="p-6 space-y-5">
                        <div>
                            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">Quantidade de unidades</label>
                            <div className="flex items-center gap-3">
                                <input type="range" min={1} max={100} value={simQty} onChange={e => setSimQty(Number(e.target.value))} className="flex-1 accent-teal-600" />
                                <span className="text-2xl font-extrabold text-teal-700 w-12 text-right">{simQty}</span>
                            </div>
                            {discount > 0 && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-black text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full mt-2">
                                    ✓ Faixa ativa: -{discount}%
                                </span>
                            )}
                        </div>
                        <div>
                            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">Preço de tabela (R$)</label>
                            <input type="number" value={simPrice} onChange={e => setSimPrice(Number(e.target.value))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400" />
                        </div>
                        <div>
                            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">Sua margem de revenda (%)</label>
                            <div className="flex items-center gap-3">
                                <input type="range" min={5} max={80} value={simMargin} onChange={e => setSimMargin(Number(e.target.value))} className="flex-1 accent-indigo-600" />
                                <span className="text-2xl font-extrabold text-indigo-700 w-12 text-right">{simMargin}%</span>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-5 border border-teal-100 space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 font-medium">Custo unitário</span>
                                <span className="font-black text-slate-800">R$ {fmt(unitCost)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 font-medium">Preço de venda sugerido</span>
                                <span className="font-black text-slate-800">R$ {fmt(salePrice)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 font-medium">Investimento total</span>
                                <span className="font-black text-slate-800">R$ {fmt(totalInvestment)}</span>
                            </div>
                            <div className="border-t border-teal-200 pt-3 flex justify-between items-center">
                                <span className="text-sm font-black text-teal-800">💸 Lucro bruto estimado</span>
                                <span className="text-xl font-black text-teal-700">R$ {fmt(grossProfit)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="px-6 pb-6">
                        <button
                            onClick={() => catalogRef.current?.scrollIntoView({ behavior: 'smooth' })}
                            className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-black text-sm rounded-2xl transition-all shadow-lg shadow-teal-100 active:scale-95"
                        >
                            Explorar Produtos para Revender →
                        </button>
                    </div>
                </div>
            </div>

            {/* ── CATÁLOGO DE PRODUTOS ───────────────────────────────────── */}
            <div ref={catalogRef}>
                <div className="flex items-end justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-extrabold text-slate-900">🛒 Produtos para Revender</h2>
                        <p className="text-slate-500 text-sm mt-1">Preços por faixa de volume. Quanto mais, maior o desconto.</p>
                    </div>
                    {!isWholesaler && (
                        <button onClick={handleOpenModal} className="text-[11px] font-black text-teal-600 bg-teal-50 border border-teal-100 px-4 py-2 rounded-xl hover:bg-teal-100 transition-all">
                            🔓 Cadastrar para Comprar
                        </button>
                    )}
                </div>
                {productsLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white rounded-[24px] border border-slate-100 overflow-hidden animate-pulse">
                                <div className="h-44 bg-slate-100" />
                                <div className="p-4 space-y-2">
                                    <div className="h-3 bg-slate-100 rounded-full w-1/3" />
                                    <div className="h-4 bg-slate-100 rounded-full w-4/5" />
                                    <div className="h-3 bg-slate-100 rounded-full w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="bg-white rounded-[32px] border border-slate-100 p-16 text-center">
                        <p className="text-4xl mb-3">📦</p>
                        <h3 className="font-black text-slate-900 text-lg mb-2">Catálogo em Construção</h3>
                        <p className="text-slate-400 text-sm">Os produtos serão exibidos aqui conforme os lojistas os cadastram.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {products.map(p => <WholesaleProductCard key={p.id} product={p} />)}
                    </div>
                )}
            </div>

            {/* ── CTA BOTTOM ────────────────────────────────────────────── */}
            <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-center">
                <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
                    {isWholesaler ? '🎉 Você é um Revendedor XTUDO!' : 'Pronto para comprar no atacado?'}
                </h3>
                <p className="text-slate-400 text-sm mb-8 max-w-md mx-auto">
                    {isWholesaler
                        ? 'Seu status de revendedor está ativo. Acesse o catálogo acima e aproveite os descontos exclusivos.'
                        : 'Cadastre-se como Revendedor Oficial XTUDO e desbloqueie preços exclusivos, suporte dedicado e condições especiais de frete.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {!isWholesaler && (
                        <button onClick={handleOpenModal} className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-white font-black rounded-2xl transition-all shadow-xl shadow-teal-900/30 active:scale-95">
                            Quero ser Revendedor →
                        </button>
                    )}
                    <a href={CONSULTANT_WA} target="_blank" rel="noreferrer" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl transition-all border border-white/20 inline-block">
                        💬 Falar com Consultor
                    </a>
                </div>
            </div>

        </div>
    );
};

export default WholesaleDashboard;
