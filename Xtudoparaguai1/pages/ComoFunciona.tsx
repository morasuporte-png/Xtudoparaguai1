import React from 'react';
import { motion } from 'framer-motion';

const steps = [
    {
        icon: '🛒',
        title: 'Escolha seus produtos',
        desc: 'Navegue por milhares de produtos importados de Ciudad del Este. Confira avaliações, compare preços e adicione ao carrinho.',
    },
    {
        icon: '🔒',
        title: 'Checkout seguro',
        desc: 'Finalize sua compra com PIX (5% off), Boleto ou Cartão de Crédito em até 12x. Todos os pagamentos são processados pelo Mercado Pago.',
    },
    {
        icon: '📦',
        title: 'O lojista prepara o envio',
        desc: 'Após a confirmação do pagamento, o lojista parceiro verifica o produto em Ciudad del Este e inicia o processo de importação e envio.',
    },
    {
        icon: '🚚',
        title: 'Rastreamento em tempo real',
        desc: 'Você recebe o código de rastreio por e-mail. Acompanhe cada etapa da entrega diretamente pela plataforma.',
    },
    {
        icon: '⭐',
        title: 'Receba e avalie',
        desc: 'Receba seu produto em casa e deixe sua avaliação. Cada compra gera pontos XTUDO Rewards que podem ser usados em descontos futuros.',
    },
];

const faqs = [
    { q: 'Quanto tempo demora a entrega?', a: 'O prazo médio é de 10 a 20 dias úteis, dependendo da modalidade de frete e do estado de destino. Produtos com estoque no Brasil chegam em 3 a 7 dias.' },
    { q: 'Minha compra é segura?', a: 'Sim. Todos os pagamentos são processados pelo Mercado Pago, líder em pagamentos digitais na América Latina. Seus dados nunca são armazenados em nossos servidores.' },
    { q: 'E se o produto chegar com defeito?', a: 'Garantimos 7 dias para devolução conforme o Código de Defesa do Consumidor. Abra uma disputa pelo portal do cliente e nossa equipe resolve em até 48h.' },
    { q: 'Posso comprar como pessoa jurídica?', a: 'Sim! Temos condições especiais para compras por atacado. Acesse o painel "Atacado" ou entre em contato pelo nosso WhatsApp.' },
];

const ComoFunciona: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero */}
            <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 text-white py-20 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="text-5xl mb-6 block">🛍️</span>
                        <h1 className="text-4xl md:text-5xl font-black mb-4">Como funciona o XTUDO</h1>
                        <p className="text-indigo-200 text-lg font-medium">De Ciudad del Este até a sua porta. Simples, seguro e com o melhor preço.</p>
                    </motion.div>
                </div>
            </div>

            {/* Steps */}
            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="space-y-6">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex gap-6 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">{step.icon}</div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="w-6 h-6 bg-indigo-600 text-white text-xs font-black rounded-full flex items-center justify-center flex-shrink-0">{i + 1}</span>
                                    <h3 className="text-lg font-black text-slate-900">{step.title}</h3>
                                </div>
                                <p className="text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ */}
                <div className="mt-20">
                    <h2 className="text-3xl font-black text-slate-900 mb-8 text-center">Dúvidas Frequentes</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <details key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm group">
                                <summary className="p-6 font-bold text-slate-900 cursor-pointer list-none flex items-center justify-between">
                                    {faq.q}
                                    <span className="text-indigo-600 group-open:rotate-45 transition-transform text-xl font-black">+</span>
                                </summary>
                                <p className="px-6 pb-6 text-slate-500 font-medium leading-relaxed border-t border-slate-50 pt-4">{faq.a}</p>
                            </details>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-16 text-center bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl p-12 text-white">
                    <h2 className="text-2xl font-black mb-3">Pronto para começar?</h2>
                    <p className="text-indigo-200 mb-8 font-medium">Milhares de produtos com preços de importação esperando por você.</p>
                    <button
                        onClick={() => { window.location.hash = '#marketplace'; }}
                        className="bg-white text-indigo-700 font-black py-4 px-10 rounded-2xl shadow-xl hover:scale-105 transition-transform"
                    >
                        Ver produtos agora →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ComoFunciona;
