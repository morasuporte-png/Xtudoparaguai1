import React from 'react';
import { motion } from 'framer-motion';

const requirements = [
    { icon: '📄', title: 'CNPJ ou RUC ativo', desc: 'Exigimos CNPJ brasileiro ativo há no mínimo 6 meses OU RUC paraguaio com histórico comercial verificável.' },
    { icon: '🏪', title: 'Loja física ou depósito', desc: 'O seller deve ter endereço físico em Ciudad del Este ou região, verificado por nossa equipe de compliance.' },
    { icon: '📸', title: 'Catálogo com fotos reais', desc: 'Todas as fotos dos produtos devem ser tiradas pelos próprios lojistas. Imagens de fábrica não são permitidas sem validação.' },
    { icon: '⭐', title: 'Histórico de vendas', desc: 'Para sellers novos, exigimos garantia financeira ou referências comerciais. Sellers com histórico têm aprovação acelerada.' },
    { icon: '📦', title: 'Capacidade de despacho', desc: 'O seller deve conseguir despachar pedidos em até 3 dias úteis após a confirmação do pagamento.' },
    { icon: '🤝', title: 'Acordo de termos', desc: 'Aceite dos Termos do Seller XTUDO, incluindo política de devoluções, SLA de atendimento e comissões.' },
];

const benefits = [
    '✅ Dashboard completo de vendas e analytics',
    '✅ Acesso a milhares de compradores brasileiros',
    '✅ Repasse semanal via PIX ou TED',
    '✅ Suporte dedicado para sellers verificados',
    '✅ Badge "Seller Verificado" que aumenta a conversão em até 40%',
    '✅ Integração de catálogo via CSV ou API',
];

const SellersVerificados: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero */}
            <div className="bg-gradient-to-br from-violet-700 via-purple-600 to-indigo-700 text-white py-20 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-2 text-sm font-bold mb-6">
                            ✓ Programa de Verificação
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black mb-4">Sellers Verificados</h1>
                        <p className="text-purple-100 text-lg font-medium">
                            Só vendemos de lojistas aprovados pelo nosso processo rigoroso de verificação.
                            Compre com 100% de confiança.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-16">
                {/* What is */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-10 mb-10 text-center">
                    <h2 className="text-2xl font-black text-slate-900 mb-4">O que é o Programa de Sellers Verificados?</h2>
                    <p className="text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
                        Antes de qualquer lojista publicar produtos na XTUDO Paraguai, ele passa por um processo completo
                        de verificação de documentos, capacidade de entrega e reputação comercial. Apenas lojistas aprovados
                        recebem o <strong className="text-violet-700">badge de verificado</strong> e podem vender na plataforma.
                    </p>
                </div>

                {/* Requirements */}
                <h2 className="text-2xl font-black text-slate-900 mb-8 text-center">Critérios de Verificação</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
                    {requirements.map((r, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="flex gap-5 bg-white rounded-3xl p-7 border border-slate-100 shadow-sm"
                        >
                            <div className="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">{r.icon}</div>
                            <div>
                                <h3 className="font-black text-slate-900 mb-1 text-sm">{r.title}</h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed">{r.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Benefits + CTA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-violet-50 border border-violet-100 rounded-3xl p-8">
                        <h3 className="font-black text-violet-900 text-lg mb-5">Benefícios para Sellers Verificados</h3>
                        <ul className="space-y-3">
                            {benefits.map((b, i) => (
                                <li key={i} className="text-violet-700 text-sm font-medium">{b}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl p-8 text-white flex flex-col justify-between">
                        <div>
                            <h3 className="font-black text-2xl mb-3">Quer ser um Seller Verificado?</h3>
                            <p className="text-violet-100 font-medium text-sm leading-relaxed mb-8">
                                Cadastre-se na plataforma como lojista e nossa equipe entrará em contato em até 48h
                                para iniciar o processo de verificação.
                            </p>
                        </div>
                        <div className="space-y-3">
                            <button
                                onClick={() => { window.location.hash = '#sellers'; }}
                                className="w-full bg-white text-violet-700 font-black py-4 rounded-2xl shadow-xl hover:scale-105 transition-transform"
                            >
                                Cadastrar como Lojista →
                            </button>
                            <button
                                onClick={() => { window.location.hash = '#contact'; }}
                                className="w-full bg-white/20 text-white font-bold py-4 rounded-2xl hover:bg-white/30 transition-colors"
                            >
                                Falar com nossa equipe
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellersVerificados;
