import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';

// Google "G" SVG logo (official colors)
const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-1 7.28-2.69l-3.57-2.77c-.99.67-2.26 1.07-3.71 1.07-2.87 0-5.3-1.94-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.67-.35-1.38-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.46 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.86-2.59 3.29-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

const Auth: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
    const { addToast } = useToast();

    // ── Google OAuth ──────────────────────────────────────────────────────────
    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    // Usa a origin atual (localhost em dev, xtudoparaguai.com em produção)
                    // O Supabase precisa ter ambas as URLs em "Redirect URLs" no dashboard
                    redirectTo: `${window.location.origin}`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            });
            if (error) throw error;
            // Supabase redirects the browser — no further action needed
        } catch (error: any) {
            addToast('Erro ao conectar com Google: ' + error.message, 'error');
            setGoogleLoading(false);
        }
    };

    // ── Email/Password Auth ───────────────────────────────────────────────────
    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                addToast('Bem-vindo de volta! 👋', 'success');
                const redirect = sessionStorage.getItem('redirectAfterLogin') || '#marketplace';
                sessionStorage.removeItem('redirectAfterLogin');
                window.location.hash = redirect;
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { full_name: fullName, role },
                    },
                });
                if (error) throw error;
                addToast('Conta criada! Verifique seu e-mail para confirmar. ✉️', 'success');
                setIsLogin(true);
            }
        } catch (error: any) {
            addToast(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white rounded-[32px] shadow-xl border border-slate-100 p-8 md:p-10"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-slate-900 mb-2">
                        {isLogin ? 'Bem-vindo ao XTUDO' : 'Crie sua conta'}
                    </h1>
                    <p className="text-slate-500 font-medium text-sm">
                        {isLogin
                            ? 'Entre para gerenciar seus pedidos e favoritos.'
                            : 'Junte-se ao marketplace mais dinâmico do Paraguai.'}
                    </p>
                </div>

                {/* Google Button */}
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={googleLoading}
                    className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 hover:border-slate-300 hover:shadow-md text-slate-700 font-bold py-4 rounded-2xl transition-all active:scale-95 disabled:opacity-50 mb-6"
                >
                    {googleLoading ? (
                        <span className="inline-block w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                    ) : (
                        <GoogleIcon />
                    )}
                    {googleLoading ? 'Conectando...' : `${isLogin ? 'Entrar' : 'Cadastrar'} com Google`}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 h-px bg-slate-100" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">ou use seu e-mail</span>
                    <div className="flex-1 h-px bg-slate-100" />
                </div>

                {/* Email/Password Form */}
                <form onSubmit={handleAuth} className="space-y-5">
                    {!isLogin && (
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Nome Completo</label>
                            <input
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:bg-white transition-all font-medium"
                                placeholder="Seu nome"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">E-mail</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:bg-white transition-all font-medium"
                            placeholder="exemplo@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Senha</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:bg-white transition-all font-medium"
                            placeholder="••••••••"
                        />
                    </div>

                    {!isLogin && (
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Tipo de Conta</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setRole('buyer')}
                                    className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${role === 'buyer' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
                                >
                                    🛒 Comprador
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('seller')}
                                    className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${role === 'seller' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
                                >
                                    🏪 Lojista
                                </button>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all text-lg disabled:opacity-50"
                    >
                        {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Cadastrar')}
                    </button>
                </form>

                {/* Toggle login/register */}
                <div className="mt-8 text-center pt-6 border-t border-slate-50">
                    <p className="text-slate-500 text-sm font-medium">
                        {isLogin ? 'Ainda não tem conta?' : 'Já possui uma conta?'}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="ml-2 text-indigo-600 font-black hover:text-indigo-800 transition-colors"
                        >
                            {isLogin ? 'Crie uma agora' : 'Faça login'}
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Auth;
