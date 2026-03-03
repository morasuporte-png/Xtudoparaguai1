import React, { useState, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { useRewards, TIER_COLORS } from '../context/RewardsContext';
import { useAuth } from '../context/AuthContext';
import { getUserOrders, getProfile, upsertProfile, getAddresses, upsertAddress, deleteAddress, DbOrder, DbProfile, DbAddress } from '../services/db';

type PortalTab = 'orders' | 'profile' | 'addresses' | 'wishlist' | 'conversations' | 'rewards';

const CustomerPortal: React.FC = () => {
    const [activeTab, setActiveTab] = useState<PortalTab>('orders');
    const { rooms, openChat } = useChat();
    const { points, tier, history, nextTierPoints, pointsToDiscount } = useRewards();
    const rewardColors = TIER_COLORS[tier];
    const tierIcons: Record<string, string> = { Bronze: '🥉', Silver: '🥈', Gold: '🥇' };
    const { user } = useAuth();

    // Real data from Supabase
    const [orders, setOrders] = useState<DbOrder[]>([]);
    const [profile, setProfile] = useState<DbProfile | null>(null);
    const [profileForm, setProfileForm] = useState({ full_name: '', phone: '' });
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);

    // Address state
    const emptyAddr: DbAddress = { cep: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '' };
    const [addresses, setAddresses] = useState<DbAddress[]>([]);
    const [addrForm, setAddrForm] = useState<DbAddress>(emptyAddr);
    const [savingAddr, setSavingAddr] = useState(false);
    const [cepLoading, setCepLoading] = useState(false);
    const [showAddrForm, setShowAddrForm] = useState(false);

    useEffect(() => {
        if (!user) return;
        setLoadingOrders(true);
        getUserOrders(user.id).then(data => { setOrders(data); setLoadingOrders(false); });
        getProfile(user.id).then(data => {
            if (data) {
                setProfile(data);
                setProfileForm({ full_name: data.full_name ?? '', phone: data.phone ?? '' });
            }
        });
        getAddresses(user.id).then(setAddresses);
    }, [user]);

    const handleSaveProfile = async () => {
        if (!user) return;
        setSavingProfile(true);
        await upsertProfile({ id: user.id, full_name: profileForm.full_name, phone: profileForm.phone });
        setSavingProfile(false);
    };

    const STATUS_COLOR: Record<string, string> = {
        pending: 'text-amber-600',
        paid: 'text-blue-600',
        shipped: 'text-indigo-600',
        delivered: 'text-emerald-600',
        cancelled: 'text-rose-600',
    };

    const STATUS_LABEL: Record<string, string> = {
        pending: 'Aguardando Pagamento',
        paid: 'Pagamento Aprovado',
        shipped: 'Em Trânsito',
        delivered: 'Entregue',
        cancelled: 'Cancelado',
    };

    const RenderOrders = () => {
        if (loadingOrders) return (
            <div className="flex items-center justify-center py-20 text-slate-400">
                <svg className="animate-spin h-6 w-6 mr-2" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" /></svg>
                Carregando seus pedidos...
            </div>
        );

        if (orders.length === 0) return (
            <div className="bg-white rounded-[40px] border border-slate-100 p-20 text-center">
                <div className="text-5xl mb-4">🛍️</div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Nenhum pedido ainda</h3>
                <p className="text-slate-400 font-medium max-w-xs mx-auto">Suas compras aparecerão aqui quando você realizar o primeiro pedido.</p>
                <button onClick={() => { window.location.hash = '#marketplace'; }} className="mt-6 bg-indigo-600 text-white font-black px-8 py-3 rounded-2xl text-sm hover:bg-indigo-700 transition-all">
                    Ir às compras
                </button>
            </div>
        );

        return (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {orders.map(order => {
                    const firstItem = order.order_items?.[0];
                    const dateFormatted = new Date(order.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
                    return (
                        <div key={order.id} className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-xl hover:shadow-slate-100 transition-all group">
                            <div className="flex items-center gap-6 w-full md:w-auto">
                                <div className="w-20 h-20 bg-slate-50 rounded-2xl overflow-hidden shadow-inner border border-slate-100 flex-shrink-0">
                                    {firstItem?.image_url
                                        ? <img src={firstItem.image_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        : <div className="w-full h-full flex items-center justify-center text-3xl">📦</div>
                                    }
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Pedido #{order.id.slice(0, 8).toUpperCase()}</p>
                                    <h4 className="text-sm font-black text-slate-800 mb-1">{dateFormatted}</h4>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                                        <span className={`text-xs font-bold ${STATUS_COLOR[order.status] ?? 'text-slate-500'}`}>
                                            {STATUS_LABEL[order.status] ?? order.status}
                                        </span>
                                    </div>
                                    {order.order_items && order.order_items.length > 1 && (
                                        <p className="text-[10px] text-slate-400 mt-0.5">{order.order_items.length} itens</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center justify-between w-full md:w-auto md:border-l md:border-slate-50 md:pl-8 gap-8">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total</p>
                                    <p className="text-lg font-black text-slate-900 leading-none">R$ {order.total_brl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                </div>
                                {order.tracking_code ? (
                                    <button
                                        onClick={() => { window.location.hash = `#track-order`; }}
                                        className="bg-slate-900 text-white font-black px-6 py-3 rounded-2xl text-xs hover:bg-black transition-all shadow-lg active:scale-95">
                                        Rastrear
                                    </button>
                                ) : (
                                    <span className="text-xs text-slate-400 font-semibold">Sem rastreio</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const RenderProfile = () => (
        <div className="bg-white rounded-[40px] border border-slate-100 p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-8 mb-12">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-indigo-100">
                    {profileForm.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                    <h3 className="text-2xl font-black text-slate-900">{profileForm.full_name || 'Meu Perfil'}</h3>
                    <p className="text-slate-400 font-medium">{user?.email ?? ''}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                    <input
                        type="text"
                        value={profileForm.full_name}
                        onChange={e => setProfileForm(p => ({ ...p, full_name: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Telefone</label>
                    <input
                        type="text"
                        value={profileForm.phone}
                        onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100" />
                </div>
                <div className="space-y-2 lg:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail</label>
                    <input type="email" value={user?.email ?? ''} disabled className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-400 focus:outline-none" />
                </div>
            </div>
            <button
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className="mt-12 bg-indigo-600 text-white font-black px-10 py-4 rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-60">
                {savingProfile ? 'Salvando...' : 'Salvar Alterações'}
            </button>
        </div>
    );

    const handleCepSearch = async (cep: string) => {
        const cleaned = cep.replace(/\D/g, '');
        setAddrForm(f => ({ ...f, cep }));
        if (cleaned.length === 8) {
            setCepLoading(true);
            try {
                const res = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
                const data = await res.json();
                if (!data.erro) {
                    setAddrForm(f => ({
                        ...f,
                        street: data.logradouro ?? '',
                        neighborhood: data.bairro ?? '',
                        city: data.localidade ?? '',
                        state: data.uf ?? '',
                    }));
                }
            } catch { }
            setCepLoading(false);
        }
    };

    const handleSaveAddress = async () => {
        if (!user) return;
        setSavingAddr(true);
        const ok = await upsertAddress(user.id, addrForm);
        if (ok) {
            const updated = await getAddresses(user.id);
            setAddresses(updated);
            setAddrForm(emptyAddr);
            setShowAddrForm(false);
        }
        setSavingAddr(false);
    };

    const handleDeleteAddress = async (id: string) => {
        if (!user) return;
        await deleteAddress(id);
        setAddresses(prev => prev.filter(a => a.id !== id));
    };

    const RenderAddresses = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Endereços</h2>
                    <p className="text-sm text-slate-400 font-medium mt-1">Gerencie seus endereços de entrega</p>
                </div>
                <button
                    onClick={() => { setShowAddrForm(v => !v); setAddrForm(emptyAddr); }}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-2xl text-sm font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                    {showAddrForm ? 'Cancelar' : 'Novo Endereço'}
                </button>
            </div>

            {/* Form */}
            {showAddrForm && (
                <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 space-y-6">
                    <h3 className="font-black text-slate-900">Novo Endereço</h3>

                    {/* CEP */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CEP *</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="00000-000"
                                    maxLength={9}
                                    value={addrForm.cep}
                                    onChange={e => handleCepSearch(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                                />
                                {cepLoading && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                                )}
                            </div>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rua / Logradouro *</label>
                            <input
                                type="text"
                                placeholder="Ex: Rua das Flores"
                                value={addrForm.street}
                                onChange={e => setAddrForm(f => ({ ...f, street: e.target.value }))}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Número *</label>
                            <input
                                type="text"
                                placeholder="123"
                                value={addrForm.number}
                                onChange={e => setAddrForm(f => ({ ...f, number: e.target.value }))}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Complemento</label>
                            <input
                                type="text"
                                placeholder="Apto 42, Bloco B"
                                value={addrForm.complement ?? ''}
                                onChange={e => setAddrForm(f => ({ ...f, complement: e.target.value }))}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bairro</label>
                            <input
                                type="text"
                                placeholder="Centro"
                                value={addrForm.neighborhood ?? ''}
                                onChange={e => setAddrForm(f => ({ ...f, neighborhood: e.target.value }))}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cidade *</label>
                            <input
                                type="text"
                                placeholder="São Paulo"
                                value={addrForm.city}
                                onChange={e => setAddrForm(f => ({ ...f, city: e.target.value }))}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Estado *</label>
                            <select
                                value={addrForm.state}
                                onChange={e => setAddrForm(f => ({ ...f, state: e.target.value }))}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                            >
                                <option value="">Selecione</option>
                                {['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'].map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={handleSaveAddress}
                        disabled={savingAddr || !addrForm.cep || !addrForm.street || !addrForm.number || !addrForm.city || !addrForm.state}
                        className="bg-indigo-600 text-white font-black px-10 py-4 rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {savingAddr ? 'Salvando...' : '💾 Salvar Endereço'}
                    </button>
                </div>
            )}

            {/* Saved addresses list */}
            {addresses.length === 0 && !showAddrForm ? (
                <div className="bg-white rounded-[40px] border border-slate-100 p-16 text-center">
                    <p className="text-4xl mb-4">📍</p>
                    <h3 className="text-xl font-black text-slate-900 mb-2">Nenhum endereço salvo</h3>
                    <p className="text-slate-400 font-medium text-sm">Adicione um endereço para facilitar suas compras.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {addresses.map(addr => (
                        <div key={addr.id} className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6 flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-xl flex-shrink-0">📍</div>
                                <div>
                                    <p className="font-black text-slate-900 text-sm">
                                        {addr.street}, {addr.number}{addr.complement ? `, ${addr.complement}` : ''}
                                    </p>
                                    {addr.neighborhood && <p className="text-xs text-slate-500 font-medium mt-0.5">{addr.neighborhood}</p>}
                                    <p className="text-xs text-slate-500 font-medium">{addr.city} — {addr.state} · CEP {addr.cep}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => addr.id && handleDeleteAddress(addr.id)}
                                className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-all flex-shrink-0"
                                title="Remover endereço"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const RenderConversations = () => (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {rooms.length === 0 ? (
                <div className="bg-white rounded-[40px] border border-slate-100 p-20 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">Sem conversas ainda</h3>
                    <p className="text-slate-400 font-medium max-w-xs mx-auto">Suas conversas com os vendedores aparecerão aqui quando você iniciar um chat.</p>
                </div>
            ) : (
                rooms.map(room => (
                    <div
                        key={room.id}
                        onClick={() => openChat(room.sellerId, room.sellerName)}
                        className="bg-white rounded-[32px] border border-slate-100 p-6 flex items-center justify-between hover:shadow-xl hover:shadow-indigo-50 transition-all cursor-pointer group"
                    >
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-2xl shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                {room.sellerName[0]}
                            </div>
                            <div>
                                <h4 className="text-base font-black text-slate-900 mb-1">{room.sellerName}</h4>
                                <p className="text-sm text-slate-500 font-medium truncate max-w-[200px] md:max-w-md">{room.lastMessage || 'Nova conversa iniciada'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Última msg</p>
                                <p className="text-xs font-bold text-slate-700">{room.lastTimestamp ? new Date(room.lastTimestamp).toLocaleDateString() : '-'}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );

    const RenderRewards = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Tier Hero */}
            <div className={`rounded-[32px] bg-gradient-to-br ${rewardColors.gradient} text-white p-8 relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
                <div className="relative z-10 flex items-center justify-between gap-6 flex-wrap">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-3xl">{tierIcons[tier]}</span>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Seu nível</p>
                                <h2 className="text-2xl font-black">{tier}</h2>
                            </div>
                        </div>
                        <p className="text-white/70 text-sm">1 ponto a cada R$ 10 gastos · 100 pts = R$ 5 de desconto</p>
                    </div>
                    <div className="bg-white/15 border border-white/20 rounded-2xl p-5 text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Saldo</p>
                        <p className="text-4xl font-black">{points}</p>
                        <p className="text-white/70 text-xs mt-1">≈ R$ {pointsToDiscount(points).toFixed(2)}</p>
                    </div>
                </div>
            </div>

            {/* Quick action */}
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => { window.location.hash = '#marketplace'; }}
                    className="bg-white border border-slate-100 rounded-[24px] p-5 text-left hover:shadow-lg hover:shadow-slate-100 transition-all group"
                >
                    <span className="text-2xl mb-3 block">🛒</span>
                    <p className="font-black text-slate-900 text-sm">Ir às compras</p>
                    <p className="text-xs text-slate-400 mt-1 font-medium">Acumule mais pontos</p>
                </button>
                <button
                    onClick={() => { window.location.hash = '#rewards'; }}
                    className="bg-white border border-slate-100 rounded-[24px] p-5 text-left hover:shadow-lg hover:shadow-slate-100 transition-all group"
                >
                    <span className="text-2xl mb-3 block">📋</span>
                    <p className="font-black text-slate-900 text-sm">Ver detalhes</p>
                    <p className="text-xs text-slate-400 mt-1 font-medium">Histórico completo</p>
                </button>
            </div>

            {/* History */}
            <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h3 className="font-black text-slate-900">Histórico de Pontos</h3>
                </div>
                {history.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-2xl mb-2">🏆</p>
                        <p className="font-bold text-slate-700 text-sm">Nenhuma transação ainda</p>
                        <p className="text-xs text-slate-400 mt-1">Faça uma compra para começar!</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {history.slice(0, 5).map(tx => (
                            <div key={tx.id} className="flex items-center justify-between px-6 py-4">
                                <div>
                                    <p className="text-sm font-bold text-slate-800">{tx.description}</p>
                                    <p className="text-xs text-slate-400">{tx.date}</p>
                                </div>
                                <span className={`font-black ${tx.points > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                                    {tx.points > 0 ? '+' : ''}{tx.points} pts
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fafafa] py-12">
            <div className="max-w-5xl mx-auto px-4 lg:px-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-3">Minha <span className="text-indigo-600">Conta</span></h1>
                        <p className="text-slate-500 font-medium">Gerencie seus pedidos, dados e favoritos em um só lugar.</p>
                    </div>

                    <div className="bg-white border-2 border-slate-100 rounded-3xl p-1 shadow-sm flex items-center overflow-x-auto max-w-full">
                        {(['orders', 'rewards', 'profile', 'addresses', 'wishlist', 'conversations'] as PortalTab[]).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2.5 rounded-2xl text-[10px] font-black transition-all uppercase tracking-tighter whitespace-nowrap ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {tab === 'orders' ? 'Pedidos' : tab === 'rewards' ? '🏆 Rewards' : tab === 'profile' ? 'Perfil' : tab === 'addresses' ? 'Endereços' : tab === 'wishlist' ? 'Favoritos' : 'Conversas'}
                            </button>
                        ))}
                    </div>
                </div>

                <main>
                    {activeTab === 'orders' && <RenderOrders />}
                    {activeTab === 'rewards' && <RenderRewards />}
                    {activeTab === 'profile' && <RenderProfile />}
                    {activeTab === 'addresses' && <RenderAddresses />}
                    {activeTab === 'wishlist' && <RenderOrders />}
                    {activeTab === 'conversations' && <RenderConversations />}
                </main>
            </div>
        </div>
    );
};

export default CustomerPortal;
