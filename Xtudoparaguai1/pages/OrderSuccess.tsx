import React from 'react';
import { useRewards, TIER_COLORS } from '../context/RewardsContext';

const OrderSuccess: React.FC = () => {
    const { points, tier, history } = useRewards();
    const rewardColors = TIER_COLORS[tier];
    const lastTx = history[0];

    return (
        <div className="min-h-screen bg-white py-12 md:py-24 overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-50" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-50 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 opacity-50" />

            <div className="max-w-2xl mx-auto px-4 text-center relative z-10">
                {/* Success Icon */}
                <div className="w-24 h-24 bg-emerald-500 rounded-[32px] mx-auto flex items-center justify-center text-white shadow-2xl shadow-emerald-200 mb-10 animate-in zoom-in spin-in-12 duration-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4 animate-in slide-in-from-bottom-4 duration-500 delay-100">
                    Pedido realizado com <span className="text-emerald-500">sucesso!</span>
                </h1>
                <p className="text-lg text-slate-500 font-medium mb-12 animate-in slide-in-from-bottom-4 duration-500 delay-200">
                    Obrigado pela sua compra. Enviamos um e-mail de confirmação com todos os detalhes.
                </p>

                {/* Order Summary Card */}
                <div className="bg-slate-50 border border-slate-100 rounded-[40px] p-8 md:p-10 mb-8 text-left animate-in slide-in-from-bottom-4 duration-500 delay-300">
                    <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-200/50">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Número do Pedido</p>
                            <p className="text-xl font-black text-slate-900">#XT-10825</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Data</p>
                            <p className="text-sm font-bold text-slate-700">
                                {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between text-sm font-medium text-slate-500">
                            <span>Subtotal</span>
                            <span className="text-slate-900">—</span>
                        </div>
                        <div className="flex justify-between text-sm font-medium text-slate-500">
                            <span>Frete</span>
                            <span className="text-emerald-600 font-black">GRÁTIS</span>
                        </div>
                        <div className="flex justify-between text-xl font-black text-slate-900 pt-4 border-t border-slate-200/50">
                            <span>Total Pago</span>
                            <span className="text-indigo-600">—</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 border border-slate-100">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest leading-none mb-1">Prazo de Entrega</h4>
                                <p className="text-sm text-slate-500 font-medium">Estimado entre 5 a 10 dias úteis.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rewards Celebration */}
                {lastTx && lastTx.points > 0 && (
                    <div
                        className={`rounded-[32px] bg-gradient-to-br ${rewardColors.gradient} text-white p-7 mb-8 animate-in slide-in-from-bottom-4 duration-500 delay-350 relative overflow-hidden text-left`}
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
                        <div className="relative z-10 flex items-center gap-5">
                            <div className="text-5xl">🎉</div>
                            <div className="flex-1">
                                <p className="text-[11px] font-black uppercase tracking-widest text-white/60 leading-none mb-1">XTUDO Rewards</p>
                                <p className="text-2xl font-black leading-tight">+{lastTx.points} pontos ganhos!</p>
                                <p className="text-white/80 text-sm font-medium mt-1">
                                    Saldo total: <span className="font-black text-white">{points} pts</span> · Tier {tier}
                                </p>
                            </div>
                            <button
                                onClick={() => { window.location.hash = '#rewards'; }}
                                className="flex-shrink-0 bg-white/20 hover:bg-white/30 border border-white/25 text-white font-black text-xs px-4 py-2.5 rounded-xl transition-all"
                            >
                                Ver pontos →
                            </button>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 animate-in slide-in-from-bottom-4 duration-500 delay-400">
                    <button
                        onClick={() => { window.location.hash = '#customer'; }}
                        className="flex-1 bg-slate-900 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-black transition-all active:scale-95"
                    >
                        Acompanhar Pedido
                    </button>
                    <button
                        onClick={() => { window.location.hash = '#marketplace'; }}
                        className="flex-1 bg-white border-2 border-slate-100 text-slate-600 font-black py-4 rounded-2xl hover:bg-slate-50 transition-all active:scale-95"
                    >
                        Voltar para a Loja
                    </button>
                </div>

                <p className="mt-12 text-xs text-slate-400 font-bold uppercase tracking-widest">
                    Dúvidas? <span className="text-indigo-600 hover:underline cursor-pointer">Fale com nosso suporte 24h</span>
                </p>
            </div>
        </div>
    );
};

export default OrderSuccess;
