import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';

const Auth: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
    const { addToast } = useToast();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                addToast('Bem-vindo de volta! 👋', 'success');
                // Redirect to intended page or marketplace
                const redirect = sessionStorage.getItem('redirectAfterLogin') || '#marketplace';
                sessionStorage.removeItem('redirectAfterLogin');
                window.location.hash = redirect;
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                            role: role,
                        },
                    },
                });
                if (error) throw error;
                addToast('Conta criada com sucesso! Verifique seu e-mail.', 'success');
                setIsLogin(true);
            }
        } catch (error: any) {
            addToast(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white rounded-[32px] shadow-xl border border-slate-100 p-8 md:p-10"
            >
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-slate-900 mb-2">
                        {isLogin ? 'Bem-vindo ao XTUDO' : 'Crie sua conta'}
                    </h1>
                    <p className="text-slate-500 font-medium text-sm">
                        {isLogin
                            ? 'Entre para gerenciar seus pedidos e favoritos.'
                            : 'Junte-se ao marketplace mais dinâmico do Paraguai.'}
                    </p>
                </div>

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
                                    Comprador
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('seller')}
                                    className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${role === 'seller' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
                                >
                                    Lojista
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
