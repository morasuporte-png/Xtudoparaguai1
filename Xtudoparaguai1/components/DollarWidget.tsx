
import React, { useState } from 'react';

const CURRENCY_OPTIONS = [
    { code: 'BRL', label: 'Real', flag: '🇧🇷', symbol: 'R$', rate: 5.87, format: (v: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) },
    { code: 'PYG', label: 'Guarani', flag: '🇵🇾', symbol: 'G$', rate: 7500, format: (v: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) },
    { code: 'ARS', label: 'Peso AR', flag: '🇦🇷', symbol: '$', rate: 900, format: (v: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) },
] as const;

const DollarWidget: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [usdValue, setUsdValue] = useState('');
    const [currencyOpen, setCurrencyOpen] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState(CURRENCY_OPTIONS[0]);

    const brl = CURRENCY_OPTIONS[0];
    const usdNum = parseFloat(usdValue.replace(',', '.')) || 0;

    const updatedAt = new Date().toLocaleString('pt-BR', {
        day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });

    const close = () => { setOpen(false); setCurrencyOpen(false); };

    return (
        <div className="relative flex-shrink-0">
            {/* ── Trigger ──────────────────────── */}
            <button
                onClick={() => setOpen(v => !v)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border transition-all text-left ${open
                        ? 'bg-blue-700 border-blue-600 text-white'
                        : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-800'
                    }`}
            >
                <div className="leading-none">
                    <p className={`text-[9px] font-black uppercase tracking-widest ${open ? 'text-blue-200' : 'text-slate-400'}`}>
                        Cotação do Dólar
                    </p>
                    <p className={`text-xs font-black ${open ? 'text-white' : 'text-blue-700'}`}>
                        {brl.symbol} {brl.rate.toFixed(2).replace('.', ',')}
                    </p>
                </div>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-3 w-3 transition-transform flex-shrink-0 ${open ? 'rotate-180 text-white' : 'text-slate-400'}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* ── Dropdown ─────────────────────── */}
            {open && (
                <>
                    <div className="fixed inset-0 z-30" onClick={close} />
                    <div className="absolute right-0 top-full mt-2 z-40 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between bg-blue-700 px-4 py-3">
                            <p className="text-white font-black text-sm">Cotação do Dólar</p>
                            <button onClick={close} className="text-white/70 hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-4 space-y-4">
                            {/* USD input */}
                            <div>
                                <label className="text-xs font-black text-slate-600 uppercase tracking-wider mb-2 block">
                                    Insira o valor em dólares
                                </label>
                                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                                    <input
                                        type="number" min="0" placeholder="0,00" value={usdValue}
                                        onChange={e => setUsdValue(e.target.value)}
                                        className="flex-1 px-3 py-2.5 text-sm font-bold text-slate-800 focus:outline-none bg-white"
                                        autoFocus
                                    />
                                    <div className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-50 border-l border-slate-200">
                                        <span className="text-base leading-none">🇺🇸</span>
                                        <span className="text-xs font-bold text-slate-600">Dólar</span>
                                    </div>
                                </div>
                            </div>

                            {/* Currency selector */}
                            <div>
                                <label className="text-xs font-black text-slate-600 uppercase tracking-wider mb-2 block">
                                    Moeda escolhida
                                </label>
                                <div className="relative">
                                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden focus-within:border-blue-400 transition-all">
                                        <input
                                            type="text" readOnly placeholder="Ex: Real"
                                            value={selectedCurrency.label}
                                            className="flex-1 px-3 py-2.5 text-sm font-bold text-slate-800 bg-white cursor-pointer"
                                            onClick={() => setCurrencyOpen(v => !v)}
                                        />
                                        <button
                                            onClick={() => setCurrencyOpen(v => !v)}
                                            className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-50 border-l border-slate-200 hover:bg-blue-50 transition-colors"
                                        >
                                            <span className="text-base leading-none">{selectedCurrency.flag}</span>
                                            <span className="text-xs font-bold text-slate-600">{selectedCurrency.label}</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 text-slate-400 transition-transform ${currencyOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    </div>
                                    {currencyOpen && (
                                        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                                            {CURRENCY_OPTIONS.map(c => (
                                                <button
                                                    key={c.code}
                                                    onClick={() => { setSelectedCurrency(c); setCurrencyOpen(false); }}
                                                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left ${selectedCurrency.code === c.code
                                                            ? 'bg-blue-50 text-blue-700 font-black'
                                                            : 'text-slate-700 hover:bg-slate-50 font-semibold'
                                                        }`}
                                                >
                                                    <span className="text-xl">{c.flag}</span>
                                                    <span>{c.label}</span>
                                                    {selectedCurrency.code === c.code && (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-auto text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Rates */}
                            <div className="bg-slate-50 rounded-xl px-4 py-3">
                                <p className="text-xs font-bold text-slate-500 mb-2">
                                    Taxa de câmbio: <span className="font-black text-slate-800">US$ {usdNum > 0 ? usdNum.toFixed(2) : '1,00'}</span>
                                </p>
                                <div className="flex items-center gap-3 flex-wrap">
                                    {CURRENCY_OPTIONS.map(c => {
                                        const amount = usdNum > 0 ? usdNum * c.rate : c.rate;
                                        return (
                                            <div key={c.code} className="flex items-center gap-1">
                                                <span className="text-sm leading-none">{c.flag}</span>
                                                <span className={`text-xs font-black ${c.code === selectedCurrency.code ? 'text-blue-700' : 'text-slate-700'}`}>
                                                    {c.symbol} {c.format(amount)}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Timestamp */}
                            <p className="text-[10px] text-slate-400 font-medium text-center">
                                Atualizado em: {updatedAt}
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default DollarWidget;
