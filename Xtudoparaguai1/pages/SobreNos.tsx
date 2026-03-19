import React from 'react';
import { motion } from 'framer-motion';

const timeline = [
    { year: '2022', title: 'A ideia nasce em Foz do Iguaçu', desc: 'Nosso fundador, comprador frequente em Ciudad del Este, percebe a dificuldade de brasileiros encontrarem produtos paraguaios confiáveis online.' },
    { year: '2023', title: 'Primeiros sellers parceiros', desc: 'Os primeiros 10 lojistas são verificados e integrados à plataforma. Foco total em eletrônicos e perfumes importados.' },
    { year: '2024', title: 'Expansão para todo o Brasil', desc: 'Integração com Mercado Pago e Melhor Envio. Entregas chegam a todos os estados. Mais de 5.000 pedidos processados.' },
    { year: '2026', title: 'XTUDO Paraguai Marketplace', desc: 'Lançamento oficial da plataforma com catálogo de mais de 10.000 produtos, sistema de recompensas e portal do lojista completo.' },
];

const values = [
    { icon: '🔍', title: 'Transparência', desc: 'Preços claros, impostos visíveis, sellers identificados. Sem surpresas.' },
    { icon: '🤝', title: 'Confiança', desc: 'Só colocamos na plataforma o que verificamos. Sua satisfação é nossa prioridade.' },
    { icon: '🚀', title: 'Inovação', desc: 'Tecnologia de ponta para facilitar o comércio entre Brasil e Paraguai.' },
    { icon: '🇧🇷', title: 'Legalidade', desc: '100% dentro das leis brasileiras e paraguaias de comércio exterior.' },
];

const SobreNos: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero */}
            <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 text-white py-24 px-4 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 text-9xl">🇵🇾</div>
                    <div className="absolute bottom-10 right-10 text-9xl">🇧🇷</div>
                </div>
                <div className="max-w-3xl mx-auto text-center relative">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-4xl md:text-5xl font-black mb-4">Sobre a XTUDO Paraguai</h1>
                        <p className="text-indigo-200 text-lg font-medium leading-relaxed">
                            Somos o marketplace que está digitalizando o comércio Brasil-Paraguai,
                            conectando compradores brasileiros a lojistas verificados de Ciudad del Este.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-16">
                {/* Mission */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-10 mb-12 text-center">
                    <span className="text-4xl block mb-4">🎯</span>
                    <h2 className="text-2xl font-black text-slate-900 mb-4">Nossa Missão</h2>
                    <p className="text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto text-lg">
                        Tornar o acesso a produtos importados do Paraguai tão simples, seguro e transparente
                        quanto comprar num e-commerce nacional — com os preços que só Ciudad del Este tem.
                    </p>
                </div>

                {/* Values */}
                <h2 className="text-2xl font-black text-slate-900 mb-8 text-center">Nossos Valores</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-16">
                    {values.map((v, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-center"
                        >
                            <div className="text-3xl mb-3">{v.icon}</div>
                            <h3 className="font-black text-slate-900 text-sm mb-2">{v.title}</h3>
                            <p className="text-slate-400 text-xs font-medium leading-relaxed">{v.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Timeline */}
                <h2 className="text-2xl font-black text-slate-900 mb-8 text-center">Nossa História</h2>
                <div className="space-y-6">
                    {timeline.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex gap-6 bg-white rounded-3xl p-7 border border-slate-100 shadow-sm"
                        >
                            <div className="flex-shrink-0">
                                <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-sm">{t.year}</div>
                            </div>
                            <div>
                                <h3 className="font-black text-slate-900 mb-1">{t.title}</h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed">{t.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Stats */}
                <div className="mt-16 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl p-10 text-white">
                    <h2 className="text-2xl font-black mb-8 text-center">XTUDO em números</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        {[
                            { value: '+10.000', label: 'Produtos' },
                            { value: '+200', label: 'Sellers' },
                            { value: '+5.000', label: 'Pedidos' },
                            { value: '27', label: 'Estados' },
                        ].map((s, i) => (
                            <div key={i}>
                                <p className="text-3xl font-black mb-1">{s.value}</p>
                                <p className="text-indigo-200 text-sm font-medium">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SobreNos;
