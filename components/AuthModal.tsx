
import React, { useState, useEffect } from 'react';

type Tab = 'login' | 'register';

interface AuthModalProps {
    defaultTab?: Tab;
    onClose: () => void;
    onSuccess?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ defaultTab = 'login', onClose, onSuccess }) => {
    const [tab, setTab] = useState<Tab>(defaultTab);
    const [showPass, setShowPass] = useState(false);
    const [showPass2, setShowPass2] = useState(false);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    // form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [pass2, setPass2] = useState('');
    const [error, setError] = useState('');

    // Close on ESC
    useEffect(() => {
        const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', fn);
        return () => window.removeEventListener('keydown', fn);
    }, [onClose]);

    const validate = () => {
        if (!email.includes('@')) { setError('E-mail inválido.'); return false; }
        if (pass.length < 6) { setError('Senha deve ter no mínimo 6 caracteres.'); return false; }
        if (tab === 'register') {
            if (!name.trim()) { setError('Informe seu nome.'); return false; }
            if (pass !== pass2) { setError('As senhas não coincidem.'); return false; }
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!validate()) return;
        setLoading(true);
        await new Promise(r => setTimeout(r, 1400)); // mock API
        setLoading(false);
        setDone(true);
        if (onSuccess) onSuccess();
        setTimeout(onClose, 1800);
    };

    const resetForm = (t: Tab) => {
        setTab(t); setError(''); setName(''); setEmail(''); setPass(''); setPass2(''); setDone(false);
    };

    const inputBase = 'w-full px-4 py-3 rounded-xl border text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all bg-white';
    const inputIdle = 'border-slate-200 focus:border-indigo-400 focus:ring-indigo-100';

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(6px)' }}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-[28px] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">

                {/* ── Header ── */}
                <div className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 px-8 pt-8 pb-10 text-white overflow-hidden">
                    {/* Decorative circles */}
                    <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/[0.06] rounded-full" />
                    <div className="absolute -bottom-10 -left-6 w-32 h-32 bg-white/[0.06] rounded-full" />
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div className="relative z-10">
                        <div className="text-2xl mb-2">🇵🇾</div>
                        <h2 className="text-2xl font-black tracking-tight leading-tight">
                            {tab === 'login' ? 'Bem-vindo de volta!' : 'Crie sua conta grátis'}
                        </h2>
                        <p className="text-white/65 text-sm font-medium mt-1">
                            {tab === 'login'
                                ? 'Acesse os melhores preços de Ciudad del Este'
                                : 'Compre direto do Paraguai com segurança'}
                        </p>
                    </div>
                    {/* Tab switcher — inside header */}
                    <div className="relative z-10 flex items-center bg-white/10 rounded-2xl p-1 mt-6 gap-1">
                        {([['login', 'Entrar'], ['register', 'Cadastrar']] as const).map(([t, label]) => (
                            <button
                                key={t}
                                onClick={() => resetForm(t)}
                                className={`flex-1 py-2 rounded-xl text-sm font-black transition-all ${tab === t ? 'bg-white text-indigo-700 shadow-md' : 'text-white/70 hover:text-white'
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Body ── */}
                <div className="px-8 py-6">
                    {done ? (
                        <div className="flex flex-col items-center py-6 gap-4 text-center">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-3xl animate-bounce">
                                ✅
                            </div>
                            <div>
                                <p className="font-black text-slate-900 text-lg">
                                    {tab === 'login' ? 'Login realizado!' : 'Conta criada!'}
                                </p>
                                <p className="text-slate-400 text-sm mt-1">Redirecionando...</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* OAuth buttons */}
                            <div className="flex gap-3 mb-5">
                                <button className="flex-1 flex items-center justify-center gap-2.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all text-sm font-bold text-slate-700 shadow-sm active:scale-95">
                                    {/* Google icon */}
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-4 w-4">
                                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                                    </svg>
                                    Google
                                </button>
                                <button className="flex-1 flex items-center justify-center gap-2.5 py-2.5 rounded-xl border border-slate-200 hover:bg-blue-50 hover:border-blue-200 transition-all text-sm font-bold text-[#1877F2] shadow-sm active:scale-95">
                                    {/* Facebook icon */}
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="#1877F2">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    Facebook
                                </button>
                            </div>

                            {/* Divider */}
                            <div className="flex items-center gap-3 mb-5">
                                <div className="flex-1 h-px bg-slate-200" />
                                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">ou com e-mail</span>
                                <div className="flex-1 h-px bg-slate-200" />
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-3.5">
                                {tab === 'register' && (
                                    <div>
                                        <label className="text-xs font-black text-slate-600 mb-1.5 block uppercase tracking-wider">Nome completo</label>
                                        <input
                                            type="text"
                                            placeholder="Seu nome"
                                            value={name}
                                            onChange={e => { setName(e.target.value); setError(''); }}
                                            className={`${inputBase} ${inputIdle}`}
                                            autoComplete="name"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="text-xs font-black text-slate-600 mb-1.5 block uppercase tracking-wider">E-mail</label>
                                    <input
                                        type="email"
                                        placeholder="seuemail@exemplo.com"
                                        value={email}
                                        onChange={e => { setEmail(e.target.value); setError(''); }}
                                        className={`${inputBase} ${inputIdle}`}
                                        autoComplete="email"
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="text-xs font-black text-slate-600 uppercase tracking-wider">Senha</label>
                                        {tab === 'login' && (
                                            <button type="button" className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                                                Esqueci a senha
                                            </button>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <input
                                            type={showPass ? 'text' : 'password'}
                                            placeholder="Mínimo 6 caracteres"
                                            value={pass}
                                            onChange={e => { setPass(e.target.value); setError(''); }}
                                            className={`${inputBase} ${inputIdle} pr-12`}
                                            autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPass(v => !v)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {showPass
                                                ? <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                                : <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                            }
                                        </button>
                                    </div>
                                </div>

                                {tab === 'register' && (
                                    <div>
                                        <label className="text-xs font-black text-slate-600 mb-1.5 block uppercase tracking-wider">Confirmar senha</label>
                                        <div className="relative">
                                            <input
                                                type={showPass2 ? 'text' : 'password'}
                                                placeholder="Repita a senha"
                                                value={pass2}
                                                onChange={e => { setPass2(e.target.value); setError(''); }}
                                                className={`${inputBase} ${inputIdle} pr-12`}
                                                autoComplete="new-password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPass2(v => !v)}
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                            >
                                                {showPass2
                                                    ? <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                                    : <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                }
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Password strength indicator (register only) */}
                                {tab === 'register' && pass.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        {[1, 2, 3, 4].map(i => (
                                            <div
                                                key={i}
                                                className={`flex-1 h-1 rounded-full transition-all duration-300 ${pass.length >= i * 3
                                                    ? i <= 1 ? 'bg-rose-400'
                                                        : i <= 2 ? 'bg-amber-400'
                                                            : i <= 3 ? 'bg-emerald-400'
                                                                : 'bg-emerald-500'
                                                    : 'bg-slate-200'
                                                    }`}
                                            />
                                        ))}
                                        <span className="text-[10px] font-bold text-slate-400 w-12 text-right">
                                            {pass.length < 4 ? 'Fraca' : pass.length < 7 ? 'Média' : pass.length < 10 ? 'Boa' : 'Forte'}
                                        </span>
                                    </div>
                                )}

                                {/* Error */}
                                {error && (
                                    <div className="flex items-center gap-2 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold px-4 py-2.5 rounded-xl">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {error}
                                    </div>
                                )}

                                {/* Submit button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-black py-3.5 rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm mt-1"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            {tab === 'login' ? 'Entrando...' : 'Criando conta...'}
                                        </>
                                    ) : (
                                        tab === 'login' ? '→ Entrar na XTUDO PY' : '→ Criar conta grátis'
                                    )}
                                </button>

                                {/* Swap tab link */}
                                <p className="text-center text-[12px] text-slate-500 mt-2">
                                    {tab === 'login' ? (
                                        <>Não tem conta?{' '}
                                            <button type="button" onClick={() => resetForm('register')} className="font-black text-indigo-600 hover:text-indigo-800 transition-colors">
                                                Cadastre-se grátis
                                            </button>
                                        </>
                                    ) : (
                                        <>Já tem conta?{' '}
                                            <button type="button" onClick={() => resetForm('login')} className="font-black text-indigo-600 hover:text-indigo-800 transition-colors">
                                                Fazer login
                                            </button>
                                        </>
                                    )}
                                </p>

                                {tab === 'register' && (
                                    <p className="text-center text-[10px] text-slate-400 leading-relaxed">
                                        Ao cadastrar, você concorda com nossos{' '}
                                        <span className="text-indigo-500 cursor-pointer hover:underline">Termos de Uso</span> e{' '}
                                        <span className="text-indigo-500 cursor-pointer hover:underline">Política de Privacidade</span>.
                                    </p>
                                )}
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
