
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useRewards } from '../context/RewardsContext';
import { COUPONS } from '../constants';

type Step = 1 | 2 | 3;
type PaymentMethod = 'pix' | 'credit_card' | 'boleto';

interface DeliveryForm {
    name: string; cpf: string; phone: string; cep: string;
    address: string; number: string; complement: string; city: string; state: string;
}

const EMPTY_FORM: DeliveryForm = {
    name: '', cpf: '', phone: '', cep: '',
    address: '', number: '', complement: '', city: '', state: '',
};

const formatCPF = (v: string) => v.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4').slice(0, 14);
const formatPhone = (v: string) => v.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3').slice(0, 15);
const formatCEP = (v: string) => v.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2').slice(0, 9);

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; icon: string; discount?: string; desc: string }[] = [
    { id: 'pix', label: 'PIX', icon: '⚡', discount: '5% OFF', desc: 'Aprovação instantânea' },
    { id: 'credit_card', label: 'Cartão de Crédito', icon: '💳', desc: 'Até 12x sem juros' },
    { id: 'boleto', label: 'Boleto Bancário', icon: '📄', desc: 'Vencimento em 3 dias úteis' },
];


const PixQRCode: React.FC = () => {
    const [scanned, setScanned] = useState(false);

    return (
        <div className="flex flex-col items-center gap-3 p-6 bg-white border border-emerald-100 rounded-[24px] shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/20">
                <div className="h-full bg-emerald-500 animate-pulse" style={{ width: '60%' }} />
            </div>

            <p className="text-[11px] font-black uppercase tracking-widest text-emerald-700 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                Aguardando Pagamento
            </p>

            <div className="relative">
                <div className="w-44 h-44 bg-white border-2 border-slate-100 rounded-2xl overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105 duration-500">
                    <svg width="140" height="140" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-90">
                        <rect width="120" height="120" fill="white" />
                        <rect x="5" y="5" width="35" height="35" rx="4" fill="#1e1b4b" />
                        <rect x="10" y="10" width="25" height="25" rx="2" fill="white" />
                        <rect x="14" y="14" width="17" height="17" rx="1" fill="#1e1b4b" />
                        <rect x="80" y="5" width="35" height="35" rx="4" fill="#1e1b4b" />
                        <rect x="85" y="10" width="25" height="25" rx="2" fill="white" />
                        <rect x="89" y="14" width="17" height="17" rx="1" fill="#1e1b4b" />
                        <rect x="5" y="80" width="35" height="35" rx="4" fill="#1e1b4b" />
                        <rect x="10" y="85" width="25" height="25" rx="2" fill="white" />
                        <rect x="14" y="89" width="17" height="17" rx="1" fill="#1e1b4b" />
                        {[45, 50, 55, 60, 65, 70, 75].map(x =>
                            [45, 50, 55, 60, 65, 70, 75].map(y =>
                                Math.random() > 0.4 ? <rect key={`${x}-${y}`} x={x} y={y} width="4.5" height="4.5" rx="1" fill="#1e1b4b" /> : null
                            )
                        )}
                        {[45, 55, 65, 75].map(x => [10, 20, 30].map(y => <rect key={`t-${x}-${y}`} x={x} y={y} width="4.5" height="4.5" rx="1" fill="#1e1b4b" />))}
                        {[10, 20, 30].map(x => [45, 55, 65, 75].map(y => <rect key={`l-${x}-${y}`} x={x} y={y} width="4.5" height="4.5" rx="1" fill="#1e1b4b" />))}
                    </svg>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-lg shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>

            <div className="w-full space-y-2">
                <p className="text-[10px] text-slate-400 font-bold text-center uppercase tracking-tighter">Copia e Cola</p>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 transition-all hover:border-indigo-200">
                    <code className="text-[10px] font-black text-slate-600 truncate flex-1">00020126580014br.gov.bcb.pix0136pagamentos@xtudo.com.br5204000053039865802BR5913XTUDO_MARKET6009PARAGUAI62070503***6304E2B1</code>
                    <button
                        className="p-1.5 bg-white shadow-sm border border-slate-200 rounded-lg text-indigo-600 hover:text-white hover:bg-indigo-600 transition-all flex-shrink-0"
                        onClick={() => {
                            navigator.clipboard?.writeText('00020126580014br.gov.bcb.pix0136pagamentos@xtudo.com.br5204000053039865802BR5913XTUDO_MARKET6009PARAGUAI62070503***6304E2B1').catch(() => { });
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Pagamento processado pelo Banco Central
            </div>
        </div>
    );
};

const Checkout: React.FC = () => {
    const { items, totalPrice, clearCart, updateQuantity, removeItem, coupon, applyCoupon, couponDiscount } = useCart();
    const { showToast } = useToast();
    const { points: rewardPoints, addPoints, redeemPoints, pointsToDiscount } = useRewards();

    const [step, setStep] = useState<Step>(1);
    const [form, setForm] = useState<DeliveryForm>(EMPTY_FORM);
    const [payment, setPayment] = useState<PaymentMethod>('pix');
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [isFetchingCep, setIsFetchingCep] = useState(false);

    // Coupon Input (Local for the field)
    const [couponInput, setCouponInput] = useState(coupon || '');
    const [couponError, setCouponError] = useState('');

    // Rewards redeem
    const [redeemQty, setRedeemQty] = useState(0); // multiples of 100
    const redeemDiscount = pointsToDiscount(redeemQty);

    const totalItems = items.reduce((s, i) => s + i.quantity, 0);

    const pixDiscount = payment === 'pix' ? totalPrice * 0.05 : 0;
    // couponDiscount is now from useCart()
    const displayTotal = Math.max(0, totalPrice - pixDiscount - couponDiscount - redeemDiscount);
    const savings = items.reduce((s, i) => s + (i.product.comparePriceBRL - i.product.priceBRL) * i.quantity, 0);
    const pointsToEarn = Math.floor(displayTotal * 0.1);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let formatted = value;
        if (name === 'cpf') formatted = formatCPF(value);
        if (name === 'phone') formatted = formatPhone(value);
        if (name === 'cep') formatted = formatCEP(value);
        setForm(prev => ({ ...prev, [name]: formatted }));
    };

    const handleFetchCEP = async () => {
        const rawCep = form.cep.replace(/\D/g, '');
        if (rawCep.length !== 8) { showToast('CEP inválido. Digite 8 dígitos.', 'warning', '⚠️'); return; }
        setIsFetchingCep(true);
        try {
            const res = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`);
            const data = await res.json();
            if (data.erro) { showToast('CEP não encontrado.', 'warning', '⚠️'); }
            else {
                setForm(prev => ({
                    ...prev,
                    address: data.logradouro || prev.address,
                    city: data.localidade || prev.city,
                    state: data.uf || prev.state,
                }));
                showToast('Endereço preenchido!', 'success', '📍');
            }
        } catch { showToast('Erro ao buscar CEP.', 'error', '❌'); }
        finally { setIsFetchingCep(false); }
    };

    const handleApplyCoupon = () => {
        const code = couponInput.trim().toUpperCase();
        if (COUPONS[code]) {
            applyCoupon(code);
            setCouponError('');
            showToast(`Cupom "${code}" aplicado!`, 'success', '🏷️');
        } else {
            setCouponError('Cupom inválido ou expirado.');
        }
    };

    const handleStep1Next = () => {
        if (items.length === 0) { showToast('Seu carrinho está vazio!', 'warning'); return; }
        setStep(2);
    };

    const handleStep2Next = () => {
        const required: (keyof DeliveryForm)[] = ['name', 'cpf', 'cep', 'address', 'number', 'city', 'state'];
        const missing = required.find(k => !form[k]);
        if (missing) { showToast('Preencha todos os campos obrigatórios.', 'warning', '⚠'); return; }
        setStep(3);
    };

    const handlePlaceOrder = async () => {
        setIsProcessing(true);
        await new Promise(r => setTimeout(r, 2000));
        // Apply rewards redeem
        if (redeemQty > 0) redeemPoints(redeemQty);
        // Add points earned
        addPoints(displayTotal, `Compra #XT-${Math.floor(10000 + Math.random() * 90000)}`);
        clearCart();
        setIsProcessing(false);
        setOrderPlaced(true);
    };

    if (orderPlaced) {
        window.location.hash = '#order-success';
        return null;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            {/* Header */}
            <div className="mb-10">
                <button
                    onClick={() => step === 1 ? (window.location.hash = '#marketplace') : setStep(s => (s - 1) as Step)}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-700 transition-colors text-sm font-semibold mb-6 group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    {step === 1 ? 'Voltar ao Marketplace' : 'Passo anterior'}
                </button>

                <h1 className="text-3xl font-black text-slate-900 mb-2">Finalizar Compra</h1>
                <p className="text-slate-400 text-sm">{totalItems} {totalItems === 1 ? 'item' : 'itens'} no carrinho</p>

                {/* Steps indicator */}
                <div className="flex items-center gap-3 mt-6">
                    {(['Resumo', 'Entrega', 'Pagamento'] as const).map((label, i) => {
                        const s = (i + 1) as Step;
                        const active = step === s;
                        const done = step > s;
                        return (
                            <React.Fragment key={label}>
                                <div className="flex items-center gap-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${done ? 'bg-emerald-500 text-white' : active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-100 text-slate-400'}`}>
                                        {done ? '✓' : s}
                                    </div>
                                    <span className={`text-sm font-bold hidden sm:block ${active ? 'text-slate-900' : done ? 'text-emerald-600' : 'text-slate-400'}`}>{label}</span>
                                </div>
                                {i < 2 && <div className={`flex-1 h-px max-w-[60px] ${step > s ? 'bg-emerald-400' : 'bg-slate-200'}`} />}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Main content */}
                <div className="flex-1">

                    {/* ——— STEP 1: Order Summary ——— */}
                    {step === 1 && (
                        <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
                            <div className="p-8 border-b border-slate-100">
                                <h2 className="text-xl font-black text-slate-900">Resumo do Pedido</h2>
                                <p className="text-slate-400 text-sm mt-1">Revise os itens antes de continuar</p>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {items.map(({ product, quantity }) => (
                                    <div key={product.id} className="p-6 flex items-center gap-5">
                                        <img src={product.images[0]} className="w-20 h-20 rounded-2xl object-cover shadow-sm flex-shrink-0" alt={product.title} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">{product.category}</p>
                                            <p className="font-bold text-slate-900 text-sm leading-tight mb-1 truncate">{product.title}</p>
                                            <p className="text-xs text-slate-400 font-medium">Vendedor: {product.sellerName}</p>
                                            {/* Inline quantity control */}
                                            <div className="flex items-center gap-2 mt-3">
                                                <div className="flex items-center gap-1.5 bg-slate-100 rounded-xl p-1">
                                                    <button onClick={() => updateQuantity(product.id, quantity - 1)} className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-indigo-600 font-bold text-sm transition-colors">−</button>
                                                    <span className="w-7 text-center text-sm font-black text-slate-900">{quantity}</span>
                                                    <button onClick={() => updateQuantity(product.id, quantity + 1)} className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-indigo-600 font-bold text-sm transition-colors">+</button>
                                                </div>
                                                <button onClick={() => removeItem(product.id)} className="text-[11px] font-bold text-slate-300 hover:text-rose-500 transition-colors">Remover</button>
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="font-black text-slate-900">R$ {(product.priceBRL * quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                            <p className="text-xs text-emerald-600 font-bold">
                                                Economia R$ {((product.comparePriceBRL - product.priceBRL) * quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* Points preview */}
                            <div className="mx-6 mb-4 bg-amber-50 border border-amber-100 rounded-2xl px-5 py-3 flex items-center gap-3">
                                <span className="text-xl">🏆</span>
                                <p className="text-xs font-bold text-amber-700">
                                    Você vai ganhar <span className="font-black text-amber-900">{pointsToEarn} pontos</span> XTUDO Rewards nesta compra!
                                </p>
                            </div>
                            <div className="p-8">
                                <button
                                    onClick={handleStep1Next}
                                    className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                                >
                                    Continuar para Entrega →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ——— STEP 2: Delivery ——— */}
                    {step === 2 && (
                        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm">
                            <div className="p-8 border-b border-slate-100">
                                <h2 className="text-xl font-black text-slate-900">Dados de Entrega</h2>
                                <p className="text-slate-400 text-sm mt-1">Campos marcados com * são obrigatórios</p>
                            </div>
                            <div className="p-8 space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Nome Completo *</label>
                                        <input name="name" value={form.name} onChange={handleFormChange} placeholder="João da Silva" className="w-full px-5 py-4 rounded-2xl border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-slate-300 bg-slate-50" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">CPF *</label>
                                        <input name="cpf" value={form.cpf} onChange={handleFormChange} placeholder="000.000.000-00" className="w-full px-5 py-4 rounded-2xl border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-slate-300 bg-slate-50" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Telefone</label>
                                        <input name="phone" value={form.phone} onChange={handleFormChange} placeholder="(11) 99999-9999" className="w-full px-5 py-4 rounded-2xl border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-slate-300 bg-slate-50" />
                                    </div>
                                    {/* CEP with auto-fill button */}
                                    <div>
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">CEP *</label>
                                        <div className="flex gap-2">
                                            <input name="cep" value={form.cep} onChange={handleFormChange} placeholder="00000-000" className="flex-1 px-5 py-4 rounded-2xl border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-slate-300 bg-slate-50" />
                                            <button
                                                onClick={handleFetchCEP}
                                                disabled={isFetchingCep}
                                                className="px-4 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black transition-all active:scale-95 disabled:opacity-60 flex items-center gap-1.5 whitespace-nowrap shadow-md shadow-indigo-100"
                                            >
                                                {isFetchingCep ? (
                                                    <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                                        Buscar
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Estado *</label>
                                        <select name="state" value={form.state} onChange={handleFormChange} className="w-full px-5 py-4 rounded-2xl border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-50">
                                            <option value="">Selecione...</option>
                                            {['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'].map(uf => (
                                                <option key={uf} value={uf}>{uf}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Endereço *</label>
                                        <input name="address" value={form.address} onChange={handleFormChange} placeholder="Rua, Avenida..." className="w-full px-5 py-4 rounded-2xl border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-slate-300 bg-slate-50" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Número *</label>
                                        <input name="number" value={form.number} onChange={handleFormChange} placeholder="123" className="w-full px-5 py-4 rounded-2xl border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-slate-300 bg-slate-50" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Complemento</label>
                                        <input name="complement" value={form.complement} onChange={handleFormChange} placeholder="Apto, bloco..." className="w-full px-5 py-4 rounded-2xl border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-slate-300 bg-slate-50" />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Cidade *</label>
                                        <input name="city" value={form.city} onChange={handleFormChange} placeholder="São Paulo" className="w-full px-5 py-4 rounded-2xl border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-slate-300 bg-slate-50" />
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 pt-0">
                                <button
                                    onClick={handleStep2Next}
                                    className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                                >
                                    Continuar para Pagamento →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ——— STEP 3: Payment ——— */}
                    {step === 3 && (
                        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm">
                            <div className="p-8 border-b border-slate-100">
                                <h2 className="text-xl font-black text-slate-900">Método de Pagamento</h2>
                            </div>
                            <div className="p-8 space-y-4">
                                {PAYMENT_OPTIONS.map(option => (
                                    <button
                                        key={option.id}
                                        onClick={() => setPayment(option.id)}
                                        className={`w-full flex items-center gap-5 p-5 rounded-2xl border-2 text-left transition-all ${payment === option.id
                                            ? 'border-indigo-500 bg-indigo-50 shadow-lg shadow-indigo-100'
                                            : 'border-slate-200 hover:border-slate-300 bg-white'
                                            }`}
                                    >
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${payment === option.id ? 'bg-indigo-100' : 'bg-slate-100'}`}>
                                            {option.icon}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-black text-slate-900 text-base">{option.label}</span>
                                                {option.discount && (
                                                    <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{option.discount}</span>
                                                )}
                                            </div>
                                            <span className="text-sm text-slate-400 font-medium">{option.desc}</span>
                                        </div>
                                        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${payment === option.id ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}`}>
                                            {payment === option.id && <div className="w-2 h-2 rounded-full bg-white" />}
                                        </div>
                                    </button>
                                ))}

                                {/* PIX extra — QR code */}
                                {payment === 'pix' && (
                                    <div className="space-y-3">
                                        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-4">
                                            <div className="text-3xl">⚡</div>
                                            <div>
                                                <p className="font-black text-emerald-700 text-sm">Desconto PIX aplicado!</p>
                                                <p className="text-emerald-600 text-xs font-medium">Você economiza R$ {(totalPrice * 0.05).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} a mais</p>
                                            </div>
                                        </div>
                                        <PixQRCode />
                                    </div>
                                )}

                                {/* Credit card detail hint */}
                                {payment === 'credit_card' && (
                                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center">
                                        <p className="text-slate-500 text-xs font-medium">Você será redirecionado para o gateway seguro ao confirmar o pedido.</p>
                                    </div>
                                )}
                            </div>
                            <div className="p-8 pt-0">
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={isProcessing}
                                    className={`w-full py-5 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-95 ${isProcessing
                                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                        : 'bg-emerald-500 text-white shadow-emerald-100 hover:bg-emerald-600'
                                        }`}
                                >
                                    {isProcessing ? (
                                        <span className="flex items-center justify-center gap-3">
                                            <span className="inline-block w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                                            Processando...
                                        </span>
                                    ) : (
                                        `✓ Confirmar Pedido — R$ ${displayTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Order Summary Sidebar */}
                <div className="w-full lg:w-96 flex-shrink-0">
                    <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-8 sticky top-8 space-y-5">
                        <h3 className="font-black text-slate-900 text-lg">Seu Pedido</h3>

                        {/* Items compact list */}
                        <div className="space-y-3">
                            {items.map(({ product, quantity }) => (
                                <div key={product.id} className="flex items-center gap-3">
                                    <div className="relative flex-shrink-0">
                                        <img src={product.images[0]} className="w-12 h-12 rounded-xl object-cover" alt={product.title} />
                                        <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black">{quantity}</span>
                                    </div>
                                    <p className="text-xs font-semibold text-slate-700 flex-1 line-clamp-2">{product.title}</p>
                                    <p className="text-sm font-black text-slate-900 flex-shrink-0">R$ {(product.priceBRL * quantity).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</p>
                                </div>
                            ))}
                        </div>

                        {/* Coupon field */}
                        <div className="border-t border-slate-100 pt-4">
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">🏷️ Cupom de desconto</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={couponInput}
                                    onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }}
                                    placeholder="Ex: XTUDO10"
                                    disabled={!!coupon}
                                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-slate-300 bg-slate-50 disabled:opacity-60"
                                />
                                {coupon ? (
                                    <button onClick={() => { applyCoupon(null); setCouponInput(''); }} className="px-4 py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-black transition-all border border-rose-100">✕</button>
                                ) : (
                                    <button onClick={handleApplyCoupon} className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition-all shadow-md shadow-indigo-100">Aplicar</button>
                                )}
                            </div>
                            {couponError && <p className="text-xs text-rose-500 font-bold mt-1.5">{couponError}</p>}
                            {coupon && <p className="text-xs text-emerald-600 font-bold mt-1.5">✓ {COUPONS[coupon]?.label}</p>}
                        </div>

                        {/* Rewards redeem */}
                        {rewardPoints >= 100 && (
                            <div className="border-t border-slate-100 pt-4">
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">🏆 Resgatar pontos XTUDO</label>
                                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 space-y-3">
                                    <div className="flex items-center justify-between text-xs font-bold text-amber-700">
                                        <span>Disponível: <span className="font-black">{rewardPoints} pts</span></span>
                                        <span>= R$ {pointsToDiscount(rewardPoints).toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setRedeemQty(q => Math.max(0, q - 100))}
                                            disabled={redeemQty === 0}
                                            className="w-8 h-8 flex items-center justify-center bg-white border border-amber-200 rounded-xl font-black text-amber-700 hover:bg-amber-100 transition-all disabled:opacity-40"
                                        >−</button>
                                        <div className="flex-1 text-center">
                                            <p className="font-black text-amber-800 text-base">{redeemQty} pts</p>
                                            <p className="text-[10px] text-amber-600 font-bold">= R$ {redeemDiscount.toFixed(2)} de desconto</p>
                                        </div>
                                        <button
                                            onClick={() => setRedeemQty(q => Math.min(rewardPoints - (rewardPoints % 100) || rewardPoints, q + 100))}
                                            disabled={redeemQty >= rewardPoints}
                                            className="w-8 h-8 flex items-center justify-center bg-white border border-amber-200 rounded-xl font-black text-amber-700 hover:bg-amber-100 transition-all disabled:opacity-40"
                                        >+</button>
                                    </div>
                                    {redeemQty > 0 && (
                                        <p className="text-xs text-amber-700 font-bold text-center">
                                            ✓ Desconto de R$ {redeemDiscount.toFixed(2)} aplicado!
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Totals */}
                        <div className="border-t border-slate-100 pt-4 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 font-medium">Subtotal</span>
                                <span className="font-bold text-slate-900">R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 font-medium">Frete</span>
                                <span className="font-bold text-emerald-600">Grátis 🎁</span>
                            </div>
                            {payment === 'pix' && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 font-medium">Desconto PIX (5%)</span>
                                    <span className="font-bold text-emerald-600">-R$ {(totalPrice * 0.05).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                </div>
                            )}
                            {coupon && couponDiscount > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 font-medium">Cupom ({coupon})</span>
                                    <span className="font-bold text-emerald-600">-R$ {couponDiscount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                </div>
                            )}
                            {redeemQty > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 font-medium">Pontos resgatados ({redeemQty} pts)</span>
                                    <span className="font-bold text-amber-600">-R$ {redeemDiscount.toFixed(2)}</span>
                                </div>
                            )}
                        </div>

                        <div className="border-t border-slate-100 pt-4">
                            <div className="flex justify-between items-baseline">
                                <span className="font-black text-slate-900">Total</span>
                                <span className="text-2xl font-black text-slate-900">R$ {displayTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            </div>
                            {savings > 0 && (
                                <p className="text-xs text-emerald-600 font-bold mt-2 text-right">
                                    Você economiza R$ {savings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} vs. varejo!
                                </p>
                            )}
                        </div>

                        {/* Points earning preview */}
                        <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 flex items-center gap-3">
                            <span className="text-xl">🏆</span>
                            <p className="text-xs font-bold text-amber-700">
                                +<span className="font-black text-amber-900">{pointsToEarn} pts</span> a acumular nesta compra
                            </p>
                        </div>

                        <div className="flex flex-col gap-2">
                            {[
                                { icon: '🔒', text: 'Compra 100% segura' },
                                { icon: '🚚', text: 'Frete grátis + rastreio' },
                                { icon: '✅', text: 'Garantia XTUDO' },
                            ].map(({ icon, text }) => (
                                <div key={text} className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                                    <span>{icon}</span>
                                    <span>{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
