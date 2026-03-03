import React from 'react';
import { motion } from 'framer-motion';

const steps = [
    { icon: '🏭', title: 'Origem: Ciudad del Este', desc: 'O produto é selecionado e verificado pelo lojista parceiro nas lojas físicas ou depósitos em Ciudad del Este, Paraguai.' },
    { icon: '📋', title: 'Documentação Aduaneira', desc: 'Geração da nota fiscal de importação e declaração de bagagem dentro dos limites legais (US$ 500 por mês por CPF via exportação simplificada).' },
    { icon: '🛃', title: 'Passagem pela aduana', desc: 'O produto atravessa a fronteira Brasil-Paraguai com toda a documentação em ordem pelas empresas de transporte parceiras da XTUDO.' },
    { icon: '📦', title: 'Centro de distribuição', desc: 'Após a liberação aduaneira, o produto é encaminhado para o centro de distribuição parceiro mais próximo do destino final.' },
    { icon: '🚚', title: 'Última milha', desc: 'Entrega ao consumidor via PAC, SEDEX ou transportadoras parceiras com rastreamento em tempo real na plataforma.' },
];

const modalities = [
    { name: 'PAC', time: '8 a 15 dias úteis', price: 'A partir de R$ 18,90', icon: '📮', color: 'bg-slate-50 border-slate-200' },
    { name: 'SEDEX', time: '3 a 7 dias úteis', price: 'A partir de R$ 35,50', icon: '⚡', color: 'bg-amber-50 border-amber-200' },
    { name: 'Retirada (Foz do Iguaçu)', time: '1 a 3 dias úteis', price: 'Grátis', icon: '🏪', color: 'bg-emerald-50 border-emerald-200' },
];

const Logistica: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero */}
            <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 text-white py-20 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="text-5xl mb-6 block">🚚</span>
                        <h1 className="text-4xl md:text-5xl font-black mb-4">Logística XTUDO</h1>
                        <p className="text-slate-300 text-lg font-medium">De Ciudad del Este ao seu endereço, com rastreamento em cada etapa.</p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-16">
                {/* Pipeline */}
                <h2 className="text-2xl font-black text-slate-900 mb-8 text-center">Como os produtos chegam até você</h2>
                <div className="space-y-4">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex gap-5 bg-white rounded-3xl p-7 border border-slate-100 shadow-sm"
                        >
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">{step.icon}</div>
                                {i < steps.length - 1 && <div className="w-0.5 flex-1 bg-slate-200 mt-3" />}
                            </div>
                            <div className="flex-1 pb-4">
                                <h3 className="font-black text-slate-900 mb-1">{step.title}</h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed">{step.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Modalities */}
                <div className="mt-16">
                    <h2 className="text-2xl font-black text-slate-900 mb-8 text-center">Modalidades de Entrega</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {modalities.map((m, i) => (
                            <div key={i} className={`rounded-3xl p-7 border-2 ${m.color}`}>
                                <div className="text-3xl mb-4">{m.icon}</div>
                                <h3 className="font-black text-slate-900 text-lg mb-2">{m.name}</h3>
                                <p className="text-slate-500 text-sm font-medium mb-3">⏱ {m.time}</p>
                                <p className="font-black text-indigo-700">{m.price}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info box */}
                <div className="mt-10 bg-indigo-50 border border-indigo-100 rounded-3xl p-8">
                    <h3 className="font-black text-indigo-900 mb-3 flex items-center gap-2">ℹ️ Sobre limites de importação</h3>
                    <p className="text-indigo-700 text-sm font-medium leading-relaxed">
                        Compras de até <strong>US$ 500</strong> por mês por CPF estão isentas de imposto de importação
                        via exportação simplificada. Acima deste valor, pode haver cobrança de impostos aduaneiros,
                        que serão informados no ato da compra. Nossa equipe garante total transparência no processo.
                    </p>
                </div>

                {/* Track CTA */}
                <div className="mt-8 text-center">
                    <button
                        onClick={() => { window.location.hash = '#track-order'; }}
                        className="bg-slate-900 text-white font-black py-4 px-10 rounded-2xl shadow-xl hover:bg-slate-700 transition-colors"
                    >
                        🔍 Rastrear meu pedido
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Logistica;
