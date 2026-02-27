
import React, { useState } from 'react';
import { WHOLESALE_VOLUME_TIERS, WHOLESALE_TOP_CATEGORIES, WHOLESALE_STATS } from '../constants';

const WholesaleDashboard: React.FC = () => {
    const [simQty, setSimQty] = useState(10);
    const [simPrice, setSimPrice] = useState(6890);
    const [simMargin, setSimMargin] = useState(20);

    const getDiscount = (qty: number) => {
        if (qty >= 50) return 32;
        if (qty >= 20) return 25;
        if (qty >= 10) return 18;
        if (qty >= 5) return 10;
        return 0;
    };

    const discount = getDiscount(simQty);
    const unitCost = simPrice * (1 - discount / 100);
    const salePrice = unitCost * (1 + simMargin / 100);
    const grossProfit = (salePrice - unitCost) * simQty;
    const totalInvestment = unitCost * simQty;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">

            {/* ── HERO ──────────────────────────────────────────────────── */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 p-10 text-white">
                <div className="absolute inset-0 opacity-10">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full bg-white"
                            style={{
                                width: `${80 + i * 60}px`,
                                height: `${80 + i * 60}px`,
                                top: `${-20 + i * 15}%`,
                                right: `${-5 + i * 8}%`,
                                opacity: 0.15,
                            }}
                        />
                    ))}
                </div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-[10px] font-black px-3 py-1 rounded-full tracking-wider uppercase mb-4">
                            📦 Atacado XTUDO
                        </span>
                        <h1 className="text-3xl md:text-4xl font-extrabold mb-3 leading-tight">
                            Compre em volume,<br />lucre mais.
                        </h1>
                        <p className="text-teal-100 text-sm leading-relaxed max-w-md">
                            Acesso direto aos sellers de Ciudad del Este com descontos progressivos por volume. Sem intermediários, sem burocracia.
                        </p>
                    </div>
                    <div className="flex-shrink-0 flex flex-col gap-3">
                        <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl px-8 py-5 text-center">
                            <div className="text-4xl font-black">32%</div>
                            <div className="text-teal-200 text-xs font-bold mt-1">Desconto máximo</div>
                        </div>
                        <button className="bg-white text-teal-700 font-black text-sm px-6 py-3 rounded-2xl hover:bg-teal-50 transition-all shadow-xl active:scale-95">
                            Solicitar Cadastro →
                        </button>
                    </div>
                </div>
            </div>

            {/* ── STATS ─────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {WHOLESALE_STATS.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <div className="text-2xl mb-2">{stat.icon}</div>
                        <div className="text-2xl font-extrabold text-slate-900">{stat.value}</div>
                        <div className="text-xs text-slate-500 font-medium mt-0.5">{stat.label}</div>
                        <div className="inline-flex items-center gap-1 mt-2 text-[11px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                            ↑ {stat.change}
                        </div>
                    </div>
                ))}
            </div>

            {/* ── TABELA DE FAIXAS ──────────────────────────────────────── */}
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

                {/* ── TOP CATEGORIAS ────────────────────────────────────────── */}
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

                {/* ── SIMULADOR DE ROI ──────────────────────────────────────── */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100">
                        <h3 className="font-extrabold text-slate-900">🧮 Simulador de Lucro</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Calcule seu ganho antes de fechar o pedido</p>
                    </div>
                    <div className="p-6 space-y-5">
                        <div>
                            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
                                Quantidade de unidades
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="range"
                                    min={1}
                                    max={100}
                                    value={simQty}
                                    onChange={e => setSimQty(Number(e.target.value))}
                                    className="flex-1 accent-teal-600"
                                />
                                <span className="text-2xl font-extrabold text-teal-700 w-12 text-right">{simQty}</span>
                            </div>
                            {discount > 0 && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-black text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full mt-2">
                                    ✓ Faixa de desconto ativa: -{discount}%
                                </span>
                            )}
                        </div>

                        <div>
                            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
                                Preço de tabela (R$)
                            </label>
                            <input
                                type="number"
                                value={simPrice}
                                onChange={e => setSimPrice(Number(e.target.value))}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
                                Sua margem de revenda (%)
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="range"
                                    min={5}
                                    max={80}
                                    value={simMargin}
                                    onChange={e => setSimMargin(Number(e.target.value))}
                                    className="flex-1 accent-indigo-600"
                                />
                                <span className="text-2xl font-extrabold text-indigo-700 w-12 text-right">{simMargin}%</span>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-5 border border-teal-100 space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 font-medium">Custo unitário</span>
                                <span className="font-black text-slate-800">R$ {unitCost.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 font-medium">Preço de venda sugerido</span>
                                <span className="font-black text-slate-800">R$ {salePrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 font-medium">Investimento total</span>
                                <span className="font-black text-slate-800">R$ {totalInvestment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="border-t border-teal-200 pt-3 flex justify-between items-center">
                                <span className="text-sm font-black text-teal-800">💸 Lucro bruto estimado</span>
                                <span className="text-xl font-black text-teal-700">R$ {grossProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 pb-6">
                        <button className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-black text-sm rounded-2xl transition-all shadow-lg shadow-teal-100 active:scale-95">
                            Explorar Produtos para Revender →
                        </button>
                    </div>
                </div>
            </div>

            {/* ── CTA BOTTOM ────────────────────────────────────────────── */}
            <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-center">
                <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
                    Pronto para comprar no atacado?
                </h3>
                <p className="text-slate-400 text-sm mb-8 max-w-md mx-auto">
                    Cadastre-se como Revendedor Oficial XTUDO e desbloqueie preços exclusivos, suporte dedicado e condições especiais de frete.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-white font-black rounded-2xl transition-all shadow-xl shadow-teal-900/30 active:scale-95">
                        Quero ser Revendedor →
                    </button>
                    <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl transition-all border border-white/20">
                        Falar com Consultor
                    </button>
                </div>
            </div>

        </div>
    );
};

export default WholesaleDashboard;
