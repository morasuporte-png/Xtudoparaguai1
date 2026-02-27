
import React, { useState } from 'react';
import { ProductDraft } from '../types';
import { CATEGORY_MAP } from '../constants';

interface ProductRegistrationProps {
    onBack: () => void;
    initialProduct?: any;
}

const EMPTY_DRAFT: ProductDraft = {
    title: '', category: '', subCategory: '', description: '',
    brand: '', condition: 'new', origin: 'Paraguai',
    specs: [{ key: '', value: '' }],
    images: [], priceBRL: '', comparePriceBRL: '',
    stock: '', sku: '', warranty: '12',
    shipping: 'included', deliveryDays: 7,
    variations: [],
};

const STEPS = [
    { id: 1, label: 'Informações', icon: '📋' },
    { id: 2, label: 'Fotos', icon: '🖼️' },
    { id: 3, label: 'Preço', icon: '💰' },
    { id: 4, label: 'Publicar', icon: '🚀' },
];

const ORIGINS = ['Paraguai', 'China', 'Estados Unidos', 'Japão', 'Coreia do Sul', 'Outro'];
const WARRANTIES = [
    { value: '0', label: 'Sem garantia' },
    { value: '3', label: '3 meses' },
    { value: '6', label: '6 meses' },
    { value: '12', label: '12 meses' },
    { value: '24', label: '24 meses' },
];
const SAMPLE_IMAGES = [
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
    'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=80',
];

const ProductRegistration: React.FC<ProductRegistrationProps> = ({ onBack, initialProduct }) => {
    const isEdit = !!initialProduct;
    const [step, setStep] = useState(1);
    const [draft, setDraft] = useState<ProductDraft>(initialProduct ? {
        ...initialProduct,
        priceBRL: initialProduct.priceBRL?.toString() || '',
        comparePriceBRL: initialProduct.comparePriceBRL?.toString() || '',
        stock: initialProduct.stock?.toString() || '',
        specs: initialProduct.specs?.length ? initialProduct.specs : [{ key: '', value: '' }]
    } : EMPTY_DRAFT);
    const [published, setPublished] = useState(false);
    const [imageUrlInput, setImageUrlInput] = useState('');

    const set = (key: keyof ProductDraft, value: any) =>
        setDraft(d => ({ ...d, [key]: value }));

    const discount = draft.priceBRL && draft.comparePriceBRL && Number(draft.comparePriceBRL) > Number(draft.priceBRL)
        ? Math.round((1 - Number(draft.priceBRL) / Number(draft.comparePriceBRL)) * 100)
        : 0;

    // Checklist
    const checks = [
        { ok: draft.title.length >= 40, label: `Título ${draft.title.length}/40+ chars` },
        { ok: draft.images.length >= 3, label: `Mínimo 3 fotos (${draft.images.length})` },
        { ok: Number(draft.priceBRL) > 0, label: 'Preço definido' },
        { ok: Number(draft.stock) > 0, label: 'Estoque > 0' },
        { ok: draft.specs.some(s => s.key && s.value), label: 'Especificações adicionadas' },
    ];

    const addImageUrl = () => {
        if (imageUrlInput && draft.images.length < 8) {
            set('images', [...draft.images, imageUrlInput]);
            setImageUrlInput('');
        }
    };

    const addSampleImages = () => {
        const toAdd = SAMPLE_IMAGES.filter(u => !draft.images.includes(u)).slice(0, 8 - draft.images.length);
        set('images', [...draft.images, ...toAdd]);
    };

    if (published) {
        return (
            <div className="min-h-screen bg-[#f7f9fc] flex items-center justify-center p-4">
                <div className="text-center max-w-md bg-white rounded-3xl p-10 shadow-xl border border-slate-100">
                    <div className="text-6xl mb-4 animate-bounce">🎉</div>
                    <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
                        {isEdit ? 'Produto atualizado!' : 'Produto publicado!'}
                    </h2>
                    <p className="text-slate-500 mb-8">
                        {isEdit ? 'Suas alterações foram salvas com sucesso.' : 'Seu produto está no ar e já pode ser encontrado por compradores.'}
                    </p>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => { setDraft(EMPTY_DRAFT); setStep(1); setPublished(false); }}
                            className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all"
                        >
                            + Cadastrar outro produto
                        </button>
                        <button onClick={onBack} className="w-full py-3 text-slate-500 font-semibold rounded-2xl hover:bg-slate-50 transition-all">
                            Voltar ao Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f9fc]">
            {/* Header */}
            <div className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
                    <button onClick={onBack} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 font-semibold text-sm transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Voltar
                    </button>
                    <div className="flex-1">
                        <h1 className="text-lg font-extrabold text-slate-900">
                            {isEdit ? 'Editar Produto' : 'Cadastrar Produto'}
                        </h1>
                    </div>
                    <span className="text-xs text-slate-400 font-semibold">Etapa {step} de 4</span>
                </div>

                {/* Progress bar */}
                <div className="max-w-4xl mx-auto px-4 pb-4">
                    <div className="flex items-center gap-2">
                        {STEPS.map((s, i) => (
                            <React.Fragment key={s.id}>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${step > s.id ? 'bg-emerald-500 text-white' :
                                        step === s.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' :
                                            'bg-slate-100 text-slate-400'
                                        }`}>
                                        {step > s.id ? '✓' : s.id}
                                    </div>
                                    <span className={`hidden sm:block text-xs font-bold ${step === s.id ? 'text-indigo-600' : 'text-slate-400'}`}>{s.label}</span>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div className={`flex-1 h-0.5 rounded-full transition-all ${step > s.id ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">

                {/* ── STEP 1: Informações Básicas ─────────────────────────── */}
                {step === 1 && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                            <h2 className="text-base font-extrabold text-slate-900 mb-5">Informações Básicas</h2>
                            <div className="space-y-4">
                                {/* Título */}
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Título do produto</label>
                                    <input
                                        value={draft.title} onChange={e => set('title', e.target.value)}
                                        maxLength={120} placeholder="Ex: Smartphone Samsung Galaxy S24 Ultra 256GB Preto..."
                                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
                                    />
                                    <div className="flex justify-between mt-1">
                                        <span className={`text-[10px] font-semibold ${draft.title.length < 40 ? 'text-amber-500' : 'text-emerald-600'}`}>
                                            {draft.title.length < 40 ? '⚠️ Recomendado 40+ chars para melhor visibilidade' : '✅ Tamanho ideal'}
                                        </span>
                                        <span className="text-[10px] text-slate-400">{draft.title.length}/120</span>
                                    </div>
                                </div>

                                {/* Categoria + Sub */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Categoria</label>
                                        <select
                                            value={draft.category} onChange={e => { set('category', e.target.value); set('subCategory', ''); }}
                                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                                        >
                                            <option value="">Selecionar categoria</option>
                                            {Object.entries(CATEGORY_MAP).map(([slug, meta]) => (
                                                <option key={slug} value={slug}>{meta.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Sub-categoria</label>
                                        <select
                                            value={draft.subCategory} onChange={e => set('subCategory', e.target.value)}
                                            disabled={!draft.category}
                                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white disabled:opacity-50"
                                        >
                                            <option value="">Selecionar sub-categoria</option>
                                            {draft.category && CATEGORY_MAP[draft.category]?.subCategories.map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Descrição */}
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Descrição</label>
                                    <textarea
                                        value={draft.description} onChange={e => set('description', e.target.value)}
                                        rows={4} placeholder="Descreva o produto em detalhes: características, diferenciais, conteúdo da embalagem..."
                                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition resize-none"
                                    />
                                </div>

                                {/* Marca + Condição */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Marca / Fabricante</label>
                                        <input
                                            value={draft.brand} onChange={e => set('brand', e.target.value)}
                                            placeholder="Ex: Samsung, Apple, Nike..."
                                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">País de Origem</label>
                                        <select
                                            value={draft.origin} onChange={e => set('origin', e.target.value)}
                                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                                        >
                                            {ORIGINS.map(o => <option key={o}>{o}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {/* Condição */}
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Condição do Produto</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {([['new', '✨', 'Novo'], ['original', '📦', 'Original Lacrado'], ['refurbished', '🔄', 'Recondicionado']] as const).map(([val, icon, label]) => (
                                            <button key={val} onClick={() => set('condition', val)}
                                                className={`py-3 rounded-xl border-2 text-xs font-bold transition-all ${draft.condition === val ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                                            >
                                                <div className="text-lg mb-1">{icon}</div>
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Specs */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Especificações Técnicas</label>
                                        <button onClick={() => set('specs', [...draft.specs, { key: '', value: '' }])}
                                            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                            Adicionar
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {draft.specs.map((spec, i) => (
                                            <div key={i} className="flex gap-2">
                                                <input value={spec.key} onChange={e => { const s = [...draft.specs]; s[i].key = e.target.value; set('specs', s); }}
                                                    placeholder="Característica (ex: RAM)" className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                                                <input value={spec.value} onChange={e => { const s = [...draft.specs]; s[i].value = e.target.value; set('specs', s); }}
                                                    placeholder="Valor (ex: 8GB)" className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                                                {draft.specs.length > 1 && (
                                                    <button onClick={() => set('specs', draft.specs.filter((_, idx) => idx !== i))}
                                                        className="text-slate-300 hover:text-rose-500 transition-colors px-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setStep(2)} className="w-full py-4 bg-indigo-600 text-white font-extrabold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 text-sm">
                            Próximo: Fotos & Mídia →
                        </button>
                    </div>
                )}

                {/* ── STEP 2: Fotos ─────────────────────────────────────────── */}
                {step === 2 && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-base font-extrabold text-slate-900">Fotos do Produto</h2>
                                <span className="text-xs font-semibold text-slate-400">{draft.images.length}/8 fotos</span>
                            </div>

                            {/* Drop zone simulation */}
                            <div
                                onClick={addSampleImages}
                                className="border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-2xl p-10 text-center cursor-pointer transition-all hover:bg-indigo-50/30 group mb-5"
                            >
                                <div className="text-4xl mb-3">📸</div>
                                <p className="font-bold text-slate-700 group-hover:text-indigo-700 transition-colors">Clique para adicionar fotos de exemplo</p>
                                <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP · Máx. 5MB por foto · Até 8 fotos</p>
                                <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 px-3 py-1 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                                    Fotos com fundo branco vendem 3x mais
                                </div>
                            </div>

                            {/* URL input */}
                            <div className="flex gap-2 mb-5">
                                <input
                                    value={imageUrlInput} onChange={e => setImageUrlInput(e.target.value)}
                                    placeholder="Ou cole a URL de uma imagem (https://...)"
                                    className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                    onKeyDown={e => e.key === 'Enter' && addImageUrl()}
                                />
                                <button onClick={addImageUrl} disabled={!imageUrlInput || draft.images.length >= 8}
                                    className="px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50">
                                    Adicionar
                                </button>
                            </div>

                            {/* Image grid preview */}
                            {draft.images.length > 0 && (
                                <div className="grid grid-cols-4 gap-3">
                                    {draft.images.map((url, i) => (
                                        <div key={i} className="relative group aspect-square bg-slate-100 rounded-xl overflow-hidden">
                                            <img src={url} alt="" className="w-full h-full object-cover" />
                                            {i === 0 && (
                                                <span className="absolute top-1 left-1 bg-indigo-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">PRINCIPAL</span>
                                            )}
                                            <button
                                                onClick={() => set('images', draft.images.filter((_, idx) => idx !== i))}
                                                className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                                            >×</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setStep(1)} className="flex-none px-6 py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-colors text-sm">
                                ← Voltar
                            </button>
                            <button onClick={() => setStep(3)} className="flex-1 py-4 bg-indigo-600 text-white font-extrabold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 text-sm">
                                Próximo: Preço & Estoque →
                            </button>
                        </div>
                    </div>
                )}

                {/* ── STEP 3: Preço & Estoque ───────────────────────────────── */}
                {step === 3 && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                            <h2 className="text-base font-extrabold text-slate-900 mb-5">Preço & Estoque</h2>
                            <div className="space-y-4">
                                {/* Preços */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Preço de Venda (R$)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">R$</span>
                                            <input
                                                type="number" value={draft.priceBRL} onChange={e => set('priceBRL', e.target.value)}
                                                placeholder="0,00" className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Preço de Comparação (R$)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">R$</span>
                                            <input
                                                type="number" value={draft.comparePriceBRL} onChange={e => set('comparePriceBRL', e.target.value)}
                                                placeholder="Preço original/cheio" className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Desconto badge */}
                                {discount > 0 && (
                                    <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                                        <span className="text-2xl font-extrabold text-emerald-600">-{discount}%</span>
                                        <div>
                                            <p className="text-sm font-bold text-emerald-700">Desconto calculado automaticamente</p>
                                            <p className="text-xs text-emerald-600">Seu produto vai aparecer com o badge de desconto no marketplace</p>
                                        </div>
                                    </div>
                                )}

                                {/* Estoque + SKU */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Quantidade em Estoque</label>
                                        <input
                                            type="number" value={draft.stock} onChange={e => set('stock', e.target.value)}
                                            placeholder="Ex: 50" min={0}
                                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">SKU / Código do Produto</label>
                                        <input
                                            value={draft.sku} onChange={e => set('sku', e.target.value)}
                                            placeholder="Ex: SGS24U-256-BLK"
                                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                        />
                                    </div>
                                </div>

                                {/* Garantia + Frete */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Garantia</label>
                                        <select value={draft.warranty} onChange={e => set('warranty', e.target.value)}
                                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
                                            {WARRANTIES.map(w => <option key={w.value} value={w.value}>{w.label}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Frete</label>
                                        <select value={draft.shipping} onChange={e => set('shipping', e.target.value as any)}
                                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
                                            <option value="included">Incluso no preço</option>
                                            <option value="free">Grátis (custo seu)</option>
                                            <option value="buyer">Comprador paga</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Prazo */}
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">
                                        Prazo Médio de Entrega: <span className="text-indigo-600">{draft.deliveryDays} dias</span>
                                    </label>
                                    <input type="range" min={1} max={30} value={draft.deliveryDays}
                                        onChange={e => set('deliveryDays', Number(e.target.value))}
                                        className="w-full accent-indigo-600"
                                    />
                                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                                        <span>1 dia</span><span>15 dias</span><span>30 dias</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setStep(2)} className="flex-none px-6 py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-colors text-sm">
                                ← Voltar
                            </button>
                            <button onClick={() => setStep(4)} className="flex-1 py-4 bg-indigo-600 text-white font-extrabold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 text-sm">
                                Revisar & Publicar →
                            </button>
                        </div>
                    </div>
                )}

                {/* ── STEP 4: Revisão & Publicar ───────────────────────────── */}
                {step === 4 && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Preview card */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                                <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Preview no Marketplace</h2>
                                <div className="border border-slate-200 rounded-2xl overflow-hidden max-w-[220px] mx-auto shadow-sm">
                                    <div className="aspect-square bg-slate-100 relative">
                                        {draft.images[0] ? (
                                            <img src={draft.images[0]} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                        {discount > 0 && (
                                            <span className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">-{discount}%</span>
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <p className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug mb-1">
                                            {draft.title || 'Título do produto'}
                                        </p>
                                        <p className="text-lg font-extrabold text-slate-900">
                                            {draft.priceBRL ? `R$ ${Number(draft.priceBRL).toLocaleString('pt-BR')}` : 'R$ 0,00'}
                                        </p>
                                        {draft.comparePriceBRL && Number(draft.comparePriceBRL) > Number(draft.priceBRL) && (
                                            <p className="text-xs text-slate-400 line-through">
                                                R$ {Number(draft.comparePriceBRL).toLocaleString('pt-BR')}
                                            </p>
                                        )}
                                        <p className="text-[10px] text-emerald-600 font-semibold mt-1">Frete para todo o Brasil</p>
                                    </div>
                                </div>
                            </div>

                            {/* Checklist */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                                <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Checklist de Qualidade</h2>
                                <div className="space-y-3">
                                    {checks.map((c, i) => (
                                        <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${c.ok ? 'bg-emerald-50' : 'bg-amber-50'}`}>
                                            <span className={`text-base ${c.ok ? '✅' : '⚠️'}`}>{c.ok ? '✅' : '⚠️'}</span>
                                            <span className={`text-xs font-semibold ${c.ok ? 'text-emerald-700' : 'text-amber-700'}`}>{c.label}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 p-3 bg-slate-50 rounded-xl">
                                    <p className="text-xs text-slate-500 font-medium">
                                        {checks.filter(c => c.ok).length}/{checks.length} critérios atendidos
                                    </p>
                                    <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1.5">
                                        <div
                                            className={`h-1.5 rounded-full transition-all ${checks.filter(c => c.ok).length === checks.length ? 'bg-emerald-500' : 'bg-amber-400'}`}
                                            style={{ width: `${(checks.filter(c => c.ok).length / checks.length) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setStep(3)} className="flex-none px-6 py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-colors text-sm">
                                ← Voltar
                            </button>
                            <button className="flex-1 py-4 bg-white border-2 border-dashed border-slate-200 text-slate-500 font-bold rounded-2xl hover:border-slate-300 hover:text-slate-700 transition-all text-sm">
                                Salvar Rascunho
                            </button>
                            <button
                                onClick={() => setPublished(true)}
                                className="flex-1 py-4 bg-indigo-600 text-white font-extrabold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 text-sm"
                            >
                                {isEdit ? '💾 Salvar Alterações' : '🚀 Publicar Agora'}
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ProductRegistration;
