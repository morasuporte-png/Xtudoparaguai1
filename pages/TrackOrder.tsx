import React, { useState } from 'react';
import { Package, Truck, CheckCircle, PackageSearch, MapPin, ArrowRight, Loader2, Search, ExternalLink } from 'lucide-react';

interface TrackingEvent {
    status: string;
    data: string;
    hora: string;
    local: string;
    mensagem?: string;
}

const TrackOrder: React.FC = () => {
    const [events, setEvents] = useState<TrackingEvent[]>([]);
    const [trackingCode, setTrackingCode] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [error, setError] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!trackingCode.trim()) return;

        setIsSearching(true);
        setError(false);
        setHasSearched(false);
        setEvents([]);

        try {
            const code = trackingCode.trim().toUpperCase();
            // Using linketrack free API with test tokens
            const response = await fetch(`https://api.linketrack.com/track/json?user=teste&token=1abcd00b2731640e886fb41a8a9671ad1434c599dbaa0a0de9a5aa619f29a83f&codigo=${code}`);

            if (!response.ok) {
                throw new Error('API Error');
            }

            const data = await response.json();

            if (!data || !data.eventos || data.eventos.length === 0) {
                throw new Error('No events found');
            }

            setEvents(data.eventos);
            setHasSearched(true);
        } catch (err) {
            console.error("Erro ao buscar rastreamento:", err);
            // Fallback pra erro: Código incorreto, ou a API caiu (mock fallback manual?)
            setError(true);
        } finally {
            setIsSearching(false);
        }
    };

    const getStatusIcon = (status: string) => {
        if (status.includes('entregue')) return <CheckCircle className="w-5 h-5 text-emerald-500" />;
        if (status.includes('saiu para entrega')) return <Truck className="w-5 h-5 text-indigo-500" />;
        if (status.includes('tr\u00e2nsito')) return <ArrowRight className="w-5 h-5 text-amber-500" />;
        if (status.includes('postado')) return <Package className="w-5 h-5 text-slate-500" />;
        return <PackageSearch className="w-5 h-5 text-slate-500" />;
    };

    const isDelivered = events[0]?.status.includes('entregue');

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-2">
                        <PackageSearch className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Rastreie seu Pedido</h1>
                    <p className="text-slate-600 max-w-lg mx-auto text-sm md:text-base">
                        Insira o código de rastreamento dos Correios abaixo para acompanhar a entrega do seu pacote da nossa central at\u00e9 o seu endere\u00e7o.
                    </p>
                </div>

                {/* Search Box */}
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Ex: AA123456789BR"
                                value={trackingCode}
                                onChange={(e) => setTrackingCode(e.target.value)}
                                className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all uppercase"
                                maxLength={20}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSearching || !trackingCode.trim()}
                            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-2xl font-bold transition-colors flex items-center justify-center gap-2"
                        >
                            {isSearching ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Buscando...
                                </>
                            ) : (
                                'Rastrear'
                            )}
                        </button>
                    </form>

                    {error && (
                        <div className="mt-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3">
                            <div className="p-1 bg-white rounded-full">
                                <PackageSearch className="w-5 h-5 text-rose-500" />
                            </div>
                            <div>
                                <h4 className="text-rose-800 font-bold text-sm">C\u00f3digo n\u00e3o encontrado</h4>
                                <p className="text-rose-600 text-sm mt-1">
                                    Verifique se o c\u00f3digo digitado est\u00e1 correto e tente novamente. Lembre-se que pode levar algumas horas ap\u00f3s a postagem para o rastreio constar no sistema.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Tracking Results */}
                {hasSearched && !error && (
                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Results Header */}
                        <div className="p-6 md:p-8 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <p className="text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">C\u00f3digo Rastreamento</p>
                                <div className="flex items-center gap-3">
                                    <h2 className="text-2xl font-black tracking-widest">{trackingCode.toUpperCase()}</h2>
                                    <a
                                        href={`https://rastreamento.correios.com.br/app/index.php`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1.5 bg-slate-800 hover:bg-slate-700text-slate-300 hover:text-white rounded-lg transition-colors"
                                        title="Ver no site original"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 px-4 py-2 bg-slate-800/80 rounded-2xl border border-slate-700/50">
                                <div className={`w-3 h-3 rounded-full ${isDelivered ? 'bg-emerald-500' : 'bg-indigo-500 animate-pulse'}`} />
                                <span className="font-bold text-sm">
                                    {isDelivered ? 'Entregue' : 'A caminho'}
                                </span>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="p-6 md:p-8">
                            <div className="relative border-l border-slate-200 ml-5 space-y-8">
                                {events.map((event, index) => {
                                    const isLatest = index === 0;
                                    return (
                                        <div key={index} className="relative pl-8 md:pl-10">
                                            {/* Timeline Dot/Icon */}
                                            <div className={`absolute -left-[18px] top-1 w-9 h-9 rounded-full flex items-center justify-center border-4 border-white ${isLatest ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'bg-slate-50 text-slate-500'}`}>
                                                {getStatusIcon(event.status)}
                                            </div>

                                            {/* Event Content */}
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                                <div>
                                                    <h3 className={`font-bold text-base ${isLatest ? 'text-indigo-900' : 'text-slate-800'}`}>
                                                        {event.status}
                                                    </h3>
                                                    <div className="flex items-center gap-1.5 mt-1 text-sm text-slate-500">
                                                        <MapPin className="w-3.5 h-3.5" />
                                                        {event.local}
                                                    </div>
                                                    {event.mensagem && (
                                                        <p className="text-sm text-slate-600 font-medium mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                                            {event.mensagem}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm font-medium text-slate-400 bg-slate-50/50 px-3 py-1.5 rounded-lg border border-slate-100 w-fit">
                                                    <span>{event.data}</span>
                                                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                                    <span>{event.hora}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        {/* External Link Ad/Banner */}
                        <div className="p-4 bg-indigo-50 border-t border-indigo-100 flex items-center justify-center gap-2 text-indigo-700 text-sm font-bold hover:bg-indigo-100 transition-colors cursor-pointer">
                            <ExternalLink className="w-4 h-4" />
                            Rastrear diretamente no site dos Correios
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default TrackOrder;
