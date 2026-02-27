
import React from 'react';
import { useRewards, TIER_COLORS, getTier, RewardsTier } from '../context/RewardsContext';

const TIER_BENEFITS: Record<RewardsTier, string[]> = {
    Bronze: ['Acúmulo de 1 ponto por R$ 10 gastos', 'Resgate a partir de 100 pontos (= R$ 5)', 'Acesso a ofertas exclusivas para membros'],
    Silver: ['Todos os benefícios Bronze', 'Acúmulo 1,25x mais rápido de pontos', 'Frete prioritário em compras acima de R$ 300', 'Acesso antecipado às Flash Sales'],
    Gold: ['Todos os benefícios Silver', 'Acúmulo 1,5x mais rápido de pontos', 'Suporte VIP dedicado 24h', 'Desconto extra de 3% em todas as compras', 'Participação em drops exclusivos CDE'],
};

const TIER_ICONS: Record<RewardsTier, string> = {
    Bronze: '🥉',
    Silver: '🥈',
    Gold: '🥇',
};

const RewardsPage: React.FC = () => {
    const { points, tier, nextTierPoints, history, pointsToDiscount } = useRewards();
    const colors = TIER_COLORS[tier];

    const progressPct = tier === 'Gold'
        ? 100
        : tier === 'Silver'
            ? Math.min(100, ((points - 500) / (2000 - 500)) * 100)
            : Math.min(100, (points / 500) * 100);

    const nextTier: RewardsTier | null = tier === 'Gold' ? null : tier === 'Silver' ? 'Gold' : 'Silver';
    const ptsToNext = nextTier ? (nextTier === 'Silver' ? 500 - points : 2000 - points) : 0;

    return (
        <div className="min-h-screen bg-[#fafafa] py-10 px-4">
            <div className="max-w-4xl mx-auto">

                {/* Back */}
                <button
                    onClick={() => { window.location.hash = '#marketplace'; }}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-700 transition-colors text-sm font-semibold mb-8 group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Voltar ao Marketplace
                </button>

                {/* Hero Card */}
                <div className={`relative overflow-hidden rounded-[32px] bg-gradient-to-br ${colors.gradient} text-white p-8 md:p-10 mb-8 shadow-2xl`}>
                    {/* Decorative blobs */}
                    <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/3 pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-4xl">{TIER_ICONS[tier]}</span>
                                <div>
                                    <p className="text-[11px] font-black uppercase tracking-widest text-white/60 leading-none mb-1">Seu nível</p>
                                    <h1 className="text-3xl font-black leading-none">{tier}</h1>
                                </div>
                            </div>
                            <p className="text-white/80 text-sm font-medium max-w-xs">
                                Você acumula pontos a cada compra e pode resgatar descontos reais na XTUDO.
                            </p>
                        </div>

                        <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-3xl p-6 text-center min-w-[180px]">
                            <p className="text-[11px] font-black uppercase tracking-widest text-white/60 mb-1">Saldo de pontos</p>
                            <p className="text-5xl font-black tabular-nums">{points.toLocaleString()}</p>
                            <p className="text-white/70 text-xs font-semibold mt-1">≈ R$ {pointsToDiscount(points).toFixed(2)} em desconto</p>
                        </div>
                    </div>

                    {/* Progress bar */}
                    {nextTier && (
                        <div className="relative z-10 mt-6">
                            <div className="flex justify-between items-center mb-2 text-xs font-bold text-white/70">
                                <span>{tier} ({points} pts)</span>
                                <span>Próximo: {nextTier} ({nextTierPoints} pts) — faltam {Math.max(0, ptsToNext)} pts</span>
                            </div>
                            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-white rounded-full transition-all duration-1000"
                                    style={{ width: `${progressPct}%` }}
                                />
                            </div>
                        </div>
                    )}
                    {tier === 'Gold' && (
                        <div className="relative z-10 mt-6">
                            <p className="text-xs font-bold text-white/70 text-center">🎯 Você atingiu o nível máximo — Gold! Continue comprando para manter seus benefícios.</p>
                        </div>
                    )}
                </div>

                {/* Benefits & History */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">

                    {/* Benefits */}
                    <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6">
                        <h2 className="font-black text-slate-900 text-base mb-5 flex items-center gap-2">
                            ✨ Seus benefícios <span className={`text-xs px-2.5 py-1 rounded-full font-black ${colors.bg} ${colors.color}`}>{tier}</span>
                        </h2>
                        <ul className="space-y-3">
                            {TIER_BENEFITS[tier].map((b, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                                    <span className="text-emerald-500 mt-0.5 flex-shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                    {b}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* How to earn */}
                    <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6">
                        <h2 className="font-black text-slate-900 text-base mb-5">🎯 Como ganhar e resgatar</h2>
                        <div className="space-y-4">
                            {[
                                { icon: '🛒', title: 'Compre no marketplace', desc: 'Ganhe 1 ponto a cada R$ 10 gastos automaticamente.' },
                                { icon: '💰', title: 'Resgate no checkout', desc: '100 pontos = R$ 5 de desconto. Mínimo de 100 pontos.' },
                                { icon: '🏆', title: 'Suba de nível', desc: 'Bronze → Silver (500 pts) → Gold (2.000 pts) e ganhe benefícios extras.' },
                            ].map(item => (
                                <div key={item.title} className="flex items-start gap-3">
                                    <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">{item.icon}</div>
                                    <div>
                                        <p className="text-sm font-black text-slate-800 leading-none mb-0.5">{item.title}</p>
                                        <p className="text-xs text-slate-400 font-medium">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => { window.location.hash = '#marketplace'; }}
                            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-2xl text-sm transition-all active:scale-95 shadow-lg shadow-indigo-100"
                        >
                            Ir às compras →
                        </button>
                    </div>
                </div>

                {/* History */}
                <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100">
                        <h2 className="font-black text-slate-900 text-base">📋 Histórico de pontos</h2>
                    </div>
                    {history.length === 0 ? (
                        <div className="p-16 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-2xl mb-4">🏆</div>
                            <p className="font-bold text-slate-700 mb-1">Você ainda não tem pontos</p>
                            <p className="text-sm text-slate-400 font-medium">Faça sua primeira compra para começar a acumular!</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {history.map(tx => (
                                <div key={tx.id} className="flex items-center justify-between px-6 py-4">
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">{tx.description}</p>
                                        <p className="text-xs text-slate-400 font-medium mt-0.5">{tx.date}</p>
                                    </div>
                                    <span className={`text-base font-black ${tx.points > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                                        {tx.points > 0 ? '+' : ''}{tx.points} pts
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default RewardsPage;
