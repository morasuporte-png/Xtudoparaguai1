import React, { useState } from 'react';
import { motion } from 'framer-motion';

const channels = [
    { icon: '📧', title: 'E-mail Geral', value: 'contato@xtudoparaguai.com', href: 'mailto:contato@xtudoparaguai.com', desc: 'Respondemos em até 24h úteis' },
    { icon: '🛒', title: 'Suporte ao Comprador', value: 'suporte@xtudoparaguai.com', href: 'mailto:suporte@xtudoparaguai.com', desc: 'Dúvidas sobre pedidos e entregas' },
    { icon: '🏪', title: 'Seja um Seller', value: 'sellers@xtudoparaguai.com', href: 'mailto:sellers@xtudoparaguai.com', desc: 'Quero vender na plataforma' },
    { icon: '💼', title: 'Parcerias e B2B', value: 'parcerias@xtudoparaguai.com', href: 'mailto:parcerias@xtudoparaguai.com', desc: 'Integrações e negócios' },
];

interface FormData { name: string; email: string; subject: string; message: string; }

const Contato: React.FC = () => {
    const [form, setForm] = useState<FormData>({ name: '', email: '', subject: '', message: '' });
    const [sent, setSent] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Abrir mailto com os dados preenchidos
        const subject = encodeURIComponent(`[XTUDO] ${form.subject}`);
        const body = encodeURIComponent(`Nome: ${form.name}\nEmail: ${form.email}\n\nMensagem:\n${form.message}`);
        window.location.href = `mailto:contato@xtudoparaguai.com?subject=${subject}&body=${body}`;
        setSent(true);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero */}
            <div className="bg-gradient-to-br from-teal-700 via-cyan-600 to-sky-700 text-white py-20 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="text-5xl mb-6 block">💬</span>
                        <h1 className="text-4xl md:text-5xl font-black mb-4">Entre em Contato</h1>
                        <p className="text-teal-100 text-lg font-medium">Estamos aqui para ajudar. Escolha o canal ideal para sua necessidade.</p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Left — channels + form */}
                    <div>
                        <h2 className="text-xl font-black text-slate-900 mb-6">Canais de atendimento</h2>
                        <div className="space-y-4 mb-10">
                            {channels.map((c, i) => (
                                <a key={i} href={c.href} className="flex items-center gap-5 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:border-teal-300 hover:shadow-md transition-all group">
                                    <div className="w-12 h-12 bg-teal-50 group-hover:bg-teal-100 rounded-xl flex items-center justify-center text-2xl transition-colors">{c.icon}</div>
                                    <div>
                                        <p className="font-black text-slate-900 text-sm">{c.title}</p>
                                        <p className="text-teal-700 text-sm font-semibold">{c.value}</p>
                                        <p className="text-slate-400 text-xs font-medium">{c.desc}</p>
                                    </div>
                                </a>
                            ))}
                        </div>

                        {/* WhatsApp */}
                        <a
                            href="https://wa.me/5545999999999?text=Olá, vim pelo site XTUDO Paraguai"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl p-5 transition-colors shadow-lg shadow-emerald-100"
                        >
                            <span className="text-2xl">📱</span>
                            <div>
                                <p className="font-black">WhatsApp</p>
                                <p className="text-emerald-100 text-sm font-medium">Atendimento rápido de seg a sáb, 8h–20h</p>
                            </div>
                            <span className="ml-auto font-bold">Chamar →</span>
                        </a>
                    </div>

                    {/* Right — contact form */}
                    <div>
                        <h2 className="text-xl font-black text-slate-900 mb-6">Enviar mensagem</h2>
                        {sent ? (
                            <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-10 text-center">
                                <span className="text-5xl block mb-4">✅</span>
                                <h3 className="font-black text-emerald-900 text-xl mb-2">Mensagem enviada!</h3>
                                <p className="text-emerald-700 font-medium">Seu cliente de email foi aberto com os dados preenchidos. Responderemos em até 24h úteis.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-5">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Nome</label>
                                    <input required name="name" value={form.name} onChange={handleChange} placeholder="Seu nome completo"
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-100 focus:bg-white transition-all font-medium text-slate-900 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">E-mail</label>
                                    <input required type="email" name="email" value={form.email} onChange={handleChange} placeholder="seu@email.com"
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-100 focus:bg-white transition-all font-medium text-slate-900 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Assunto</label>
                                    <select required name="subject" value={form.subject} onChange={handleChange}
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-100 focus:bg-white transition-all font-medium text-slate-900 text-sm">
                                        <option value="">Selecione...</option>
                                        <option>Dúvida sobre pedido</option>
                                        <option>Problema com produto</option>
                                        <option>Integração de catálogo</option>
                                        <option>Quero ser um Seller</option>
                                        <option>Parceria comercial</option>
                                        <option>Outro assunto</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Mensagem</label>
                                    <textarea required name="message" value={form.message} onChange={handleChange} placeholder="Descreva sua dúvida ou sugestão..." rows={5}
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-100 focus:bg-white transition-all font-medium text-slate-900 text-sm resize-none" />
                                </div>
                                <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-teal-100 transition-all active:scale-95">
                                    Enviar mensagem →
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contato;
