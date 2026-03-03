import React from 'react';
import { motion } from 'framer-motion';

const openings = [
    {
        dept: 'Tecnologia',
        title: 'Desenvolvedor Full-Stack',
        type: 'Remoto · CLT ou PJ',
        desc: 'Buscamos dev com experiência em React, TypeScript e Node.js para evoluir nossa plataforma de marketplace. Stack: Vite, Supabase, Vercel.',
        tags: ['React', 'TypeScript', 'Supabase', 'Node.js'],
        highlight: true,
    },
    {
        dept: 'Comercial',
        title: 'Executivo de Contas — Sellers',
        type: 'Foz do Iguaçu ou Remoto · CLT',
        desc: 'Responsável por prospectar e verificar novos lojistas parceiros em Ciudad del Este. Espanhol/Guarani é diferencial.',
        tags: ['Vendas B2B', 'Espanhol', 'CDE'],
        highlight: false,
    },
    {
        dept: 'Operações',
        title: 'Analista de Logística Internacional',
        type: 'Foz do Iguaçu · CLT',
        desc: 'Gestão de parceiros de transporte, acompanhamento de importações e resolução de problemas aduaneiros.',
        tags: ['Importação', 'Aduana', 'Operações'],
        highlight: false,
    },
    {
        dept: 'Design',
        title: 'UI/UX Designer',
        type: 'Remoto · PJ',
        desc: 'Criação e iteração de interfaces para mobile e desktop. Experiência com Figma e design systems.',
        tags: ['Figma', 'Design System', 'Mobile'],
        highlight: false,
    },
];

const perks = [
    { icon: '🌎', text: 'Trabalho 100% remoto para vagas digitais' },
    { icon: '📈', text: 'Stock options e participação nos resultados' },
    { icon: '🎓', text: 'Bolsa de estudos e acesso a cursos online' },
    { icon: '❤️', text: 'Plano de saúde e odontológico' },
    { icon: '🏖️', text: 'Férias flexíveis e day-off no aniversário' },
    { icon: '💻', text: 'Auxílio home office para equipamento' },
];

const Carreiras: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero */}
            <div className="bg-gradient-to-br from-rose-600 via-pink-600 to-orange-600 text-white py-20 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="text-5xl mb-6 block">🚀</span>
                        <h1 className="text-4xl md:text-5xl font-black mb-4">Carreiras na XTUDO</h1>
                        <p className="text-rose-100 text-lg font-medium">Construa o futuro do comércio Brasil-Paraguai conosco.</p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-16">
                {/* Perks */}
                <h2 className="text-2xl font-black text-slate-900 mb-8 text-center">Por que trabalhar na XTUDO?</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">
                    {perks.map((p, i) => (
                        <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
                            <span className="text-2xl">{p.icon}</span>
                            <span className="text-slate-700 text-sm font-semibold">{p.text}</span>
                        </div>
                    ))}
                </div>

                {/* Openings */}
                <h2 className="text-2xl font-black text-slate-900 mb-8">Vagas Abertas</h2>
                <div className="space-y-5">
                    {openings.map((job, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`bg-white rounded-3xl border-2 shadow-sm p-8 ${job.highlight ? 'border-rose-400 shadow-rose-100' : 'border-slate-100'}`}
                        >
                            {job.highlight && (
                                <span className="inline-block bg-rose-500 text-white text-xs font-black px-3 py-1 rounded-full mb-4">🔥 Urgente</span>
                            )}
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <div>
                                    <p className="text-xs font-black text-rose-500 uppercase tracking-widest mb-1">{job.dept}</p>
                                    <h3 className="text-lg font-black text-slate-900">{job.title}</h3>
                                    <p className="text-xs text-slate-400 font-medium mt-0.5">{job.type}</p>
                                </div>
                            </div>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-4">{job.desc}</p>
                            <div className="flex flex-wrap gap-2 mb-5">
                                {job.tags.map(t => (
                                    <span key={t} className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">{t}</span>
                                ))}
                            </div>
                            <a
                                href="mailto:rh@xtudoparaguai.com?subject=Candidatura - Desenvolvedor Full-Stack"
                                className="inline-flex items-center gap-2 bg-slate-900 text-white font-bold text-sm py-3 px-6 rounded-xl hover:bg-slate-700 transition-colors"
                            >
                                Candidatar-se →
                            </a>
                        </motion.div>
                    ))}
                </div>

                {/* Spontaneous */}
                <div className="mt-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-3xl p-10 text-white text-center">
                    <h3 className="text-2xl font-black mb-3">Não encontrou sua vaga?</h3>
                    <p className="text-rose-100 font-medium mb-6">Envie seu currículo e portfólio. Guardamos candidaturas espontâneas para futuras oportunidades.</p>
                    <a
                        href="mailto:rh@xtudoparaguai.com?subject=Candidatura Espontânea"
                        className="inline-block bg-white text-rose-600 font-black py-4 px-10 rounded-2xl shadow-xl hover:scale-105 transition-transform"
                    >
                        Enviar currículo
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Carreiras;
