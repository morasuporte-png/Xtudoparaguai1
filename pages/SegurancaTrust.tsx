import React from 'react';
import { motion } from 'framer-motion';

const pillars = [
    { icon: '🛡️', title: 'Sellers Verificados', desc: 'Todos os lojistas passam por um processo rigoroso de verificação de documentos, CNPJ/RUC e histórico comercial antes de publicar produtos.' },
    { icon: '💳', title: 'Pagamento Seguro', desc: 'Integração com Mercado Pago — o maior processador de pagamentos da América Latina. Seus dados de cartão nunca tocam nossos servidores.' },
    { icon: '🔐', title: 'Dados Criptografados', desc: 'Todo o tráfego é protegido por SSL/TLS. Suas informações pessoais são armazenadas com criptografia AES-256 no Supabase com Row Level Security.' },
    { icon: '📦', title: 'Produtos Garantidos', desc: 'Cobertura de 7 dias para devolução em caso de produto defeituoso ou diferente do anunciado, conforme o Código de Defesa do Consumidor (CDC).' },
    { icon: '⚖️', title: 'Importação Legal', desc: 'Todos os produtos passam pela aduana brasileira dentro dos limites legais de importação. Recibos e notas fiscais disponíveis no portal do cliente.' },
    { icon: '🤝', title: 'Resolução de Disputas', desc: 'Equipe de mediação disponível 24h. Abrimos disputas via plataforma e garantimos resolução em até 5 dias úteis.' },
];

const SegurancaTrust: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero */}
            <div className="bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-700 text-white py-20 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="text-5xl mb-6 block">🛡️</span>
                        <h1 className="text-4xl md:text-5xl font-black mb-4">Segurança & Trust</h1>
                        <p className="text-emerald-100 text-lg font-medium">Compre com total confiança. Sua segurança é nossa prioridade número 1.</p>
                    </motion.div>
                </div>
            </div>

            {/* Pillars */}
            <div className="max-w-5xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pillars.map((p, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl mb-5">{p.icon}</div>
                            <h3 className="text-base font-black text-slate-900 mb-2">{p.title}</h3>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed">{p.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Trust badges */}
                <div className="mt-16 bg-white rounded-3xl border border-slate-100 shadow-sm p-10">
                    <h2 className="text-2xl font-black text-slate-900 mb-8 text-center">Parceiros de Confiança</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        {[
                            { name: 'Mercado Pago', sub: 'Pagamentos', icon: '💸' },
                            { name: 'Supabase', sub: 'Banco de dados', icon: '🗄️' },
                            { name: 'Melhor Envio', sub: 'Logística', icon: '🚚' },
                            { name: 'Vercel', sub: 'Infraestrutura', icon: '☁️' },
                        ].map((p, i) => (
                            <div key={i} className="flex flex-col items-center gap-3 p-6 bg-slate-50 rounded-2xl">
                                <span className="text-3xl">{p.icon}</span>
                                <div>
                                    <p className="font-black text-slate-900 text-sm">{p.name}</p>
                                    <p className="text-slate-400 text-xs font-medium">{p.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CDC banner */}
                <div className="mt-8 bg-emerald-50 border border-emerald-100 rounded-3xl p-8 flex items-start gap-5">
                    <span className="text-4xl">⚖️</span>
                    <div>
                        <h3 className="font-black text-emerald-900 mb-2">100% dentro do Código de Defesa do Consumidor</h3>
                        <p className="text-emerald-700 text-sm font-medium leading-relaxed">
                            Garantimos seus direitos conforme a Lei 8.078/90. Direito de arrependimento em 7 dias,
                            garantia de qualidade e suporte para todas as reclamações. Somos registrados no
                            Reclame Aqui e PROCON.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SegurancaTrust;
