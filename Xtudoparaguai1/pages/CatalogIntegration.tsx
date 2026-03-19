import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const CSV_TEMPLATE = `sku,title,description,price_usd,category,brand,images,stock,weight_kg
PROD001,iPhone 15 Pro 256GB Natural Titanium,Apple iPhone 15 Pro novo lacrado,1100,Celulares,Apple,https://example.com/img1.jpg,10,0.2
PROD002,Samsung Galaxy S24 Ultra 512GB,Samsung Galaxy S24 Ultra preto,950,Celulares,Samsung,https://example.com/img2.jpg,5,0.23`;

const EXAMPLE_JSON = `{
  "products": [
    {
      "sku": "PROD001",
      "title": "iPhone 15 Pro 256GB",
      "price_usd": 1100,
      "category": "Celulares",
      "brand": "Apple",
      "images": ["https://..."],
      "stock": 10,
      "seller_id": "uuid-do-seller"
    }
  ]
}`;

function parseCsv(csv: string): Record<string, string>[] {
    const lines = csv.trim().split('\n').filter(l => l.trim());
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map(h => h.trim());
    return lines.slice(1).map(line => {
        const vals = line.split(',').map(v => v.trim());
        const obj: Record<string, string> = {};
        headers.forEach((h, i) => { obj[h] = vals[i] ?? ''; });
        return obj;
    });
}

type TabId = 'csv' | 'api' | 'test';

const CatalogIntegration: React.FC = () => {
    const [tab, setTab] = useState<TabId>('csv');
    const [csvText, setCsvText] = useState('');
    const [preview, setPreview] = useState<Record<string, string>[]>([]);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [uploadMessage, setUploadMessage] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [sellerId, setSellerId] = useState('');
    const fileRef = useRef<HTMLInputElement>(null);

    const handleCsvChange = (text: string) => {
        setCsvText(text);
        if (text.trim()) {
            setPreview(parseCsv(text).slice(0, 5));
        } else {
            setPreview([]);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => handleCsvChange(ev.target?.result as string ?? '');
        reader.readAsText(file, 'UTF-8');
    };

    const handleLoadTemplate = () => {
        handleCsvChange(CSV_TEMPLATE);
    };

    const handleSendCsv = async () => {
        const rows = parseCsv(csvText);
        if (rows.length === 0) { setUploadMessage('Nenhum produto válido encontrado no CSV.'); setUploadStatus('error'); return; }

        const products = rows.map(r => ({
            sku: r.sku,
            title: r.title,
            description: r.description,
            price_usd: parseFloat(r.price_usd) || 0,
            category: r.category,
            brand: r.brand,
            images: r.images ? r.images.split('|').map(s => s.trim()).filter(Boolean) : [],
            stock: parseInt(r.stock) || 0,
            weight_kg: parseFloat(r.weight_kg) || 1,
            seller_id: sellerId,
        }));

        setUploadStatus('loading');
        try {
            const res = await fetch('/api/catalog', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({ products }),
            });
            const data = await res.json();
            if (res.ok) {
                setUploadStatus('success');
                setUploadMessage(`✅ ${data.inserted} produto(s) importado(s) com sucesso!`);
            } else {
                setUploadStatus('error');
                setUploadMessage(`❌ Erro: ${data.error}`);
            }
        } catch {
            setUploadStatus('error');
            setUploadMessage('❌ Erro de conexão. Verifique o servidor.');
        }
    };

    const tabs: { id: TabId; label: string; icon: string }[] = [
        { id: 'csv', label: 'Upload CSV', icon: '📄' },
        { id: 'api', label: 'Integração API', icon: '🔌' },
        { id: 'test', label: 'Testar API', icon: '🧪' },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero */}
            <div className="bg-gradient-to-br from-slate-900 via-indigo-900 to-violet-900 text-white py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2 text-sm font-bold mb-6">
                            🔌 Para Fornecedores & Sellers
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black mb-4">Integração de Catálogo</h1>
                        <p className="text-indigo-200 text-lg font-medium max-w-2xl">
                            Importe seus produtos em massa via CSV ou conecte seu sistema diretamente
                            com nossa API REST. Atualizações em tempo real, sem esforço manual.
                        </p>
                        <div className="flex flex-wrap gap-4 mt-8">
                            {[
                                { icon: '⚡', text: 'Importação em segundos' },
                                { icon: '🔄', text: 'Upsert automático por SKU' },
                                { icon: '📊', text: 'Até 500 produtos por lote' },
                                { icon: '🛡️', text: 'API Key segura' },
                            ].map((b, i) => (
                                <div key={i} className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2 text-sm font-semibold">
                                    <span>{b.icon}</span><span>{b.text}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-4 py-12">
                {/* Tabs */}
                <div className="flex gap-2 mb-8 bg-white rounded-2xl p-2 border border-slate-100 shadow-sm w-fit">
                    {tabs.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${tab === t.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <span>{t.icon}</span>{t.label}
                        </button>
                    ))}
                </div>

                {/* ── TAB: CSV ── */}
                {tab === 'csv' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        {/* Config */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Seu Seller ID (UUID)</label>
                                <input value={sellerId} onChange={e => setSellerId(e.target.value)} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm font-mono" />
                                <p className="text-xs text-slate-400 mt-2">Encontre no painel do lojista → Configurações</p>
                            </div>
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">API Key do Catálogo</label>
                                <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="Sua chave privada"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm font-mono" />
                                <p className="text-xs text-slate-400 mt-2">Solicite via contato@xtudoparaguai.com</p>
                            </div>
                        </div>

                        {/* Upload area */}
                        <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-sm p-8">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">📄</div>
                                <h3 className="font-black text-slate-900 mb-2">Arraste seu arquivo CSV ou cole abaixo</h3>
                                <div className="flex items-center justify-center gap-3">
                                    <button onClick={() => fileRef.current?.click()} className="bg-indigo-600 text-white font-bold text-sm py-2.5 px-5 rounded-xl hover:bg-indigo-700 transition-colors">
                                        Escolher arquivo
                                    </button>
                                    <button onClick={handleLoadTemplate} className="bg-slate-100 text-slate-700 font-bold text-sm py-2.5 px-5 rounded-xl hover:bg-slate-200 transition-colors">
                                        Carregar exemplo
                                    </button>
                                </div>
                                <input ref={fileRef} type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
                            </div>

                            <textarea
                                value={csvText}
                                onChange={e => handleCsvChange(e.target.value)}
                                placeholder={`sku,title,description,price_usd,category,brand,images,stock,weight_kg\nPROD001,iPhone 15 Pro,...`}
                                rows={8}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                            />
                            <p className="text-xs text-slate-400 mt-2">Separe múltiplas imagens por | (pipe) na coluna <code>images</code>.</p>
                        </div>

                        {/* Preview */}
                        {preview.length > 0 && (
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-50">
                                    <h4 className="font-black text-slate-900 text-sm">Pré-visualização ({preview.length} linhas)</h4>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs">
                                        <thead className="bg-slate-50">
                                            <tr>
                                                {Object.keys(preview[0]).map(h => (
                                                    <th key={h} className="px-4 py-3 text-left font-black text-slate-500 uppercase tracking-wider">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {preview.map((row, i) => (
                                                <tr key={i}>
                                                    {Object.values(row).map((val, j) => (
                                                        <td key={j} className="px-4 py-3 text-slate-700 font-medium max-w-[160px] truncate">{val}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Send button */}
                        {csvText && (
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleSendCsv}
                                    disabled={uploadStatus === 'loading' || !sellerId}
                                    className={`flex items-center gap-3 py-4 px-8 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-95 ${uploadStatus === 'loading' ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-emerald-500 text-white shadow-emerald-100 hover:bg-emerald-600'}`}
                                >
                                    {uploadStatus === 'loading' ? (
                                        <><span className="inline-block w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" /> Importando...</>
                                    ) : '🚀 Importar produtos'}
                                </button>
                                {uploadMessage && (
                                    <div className={`px-5 py-3 rounded-2xl text-sm font-bold ${uploadStatus === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                                        {uploadMessage}
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* ── TAB: API ── */}
                {tab === 'api' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {[
                                { label: 'Endpoint', value: 'POST /api/catalog', icon: '🌐' },
                                { label: 'Auth', value: 'Bearer Token', icon: '🔑' },
                                { label: 'Limite', value: '500 produtos/req', icon: '📦' },
                            ].map((info, i) => (
                                <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center">
                                    <span className="text-2xl block mb-2">{info.icon}</span>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{info.label}</p>
                                    <p className="font-black text-slate-900 text-sm font-mono">{info.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Request example */}
                        <div className="bg-slate-950 rounded-3xl overflow-hidden border border-slate-800">
                            <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-3">
                                <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-rose-500" /><div className="w-3 h-3 rounded-full bg-amber-500" /><div className="w-3 h-3 rounded-full bg-emerald-500" /></div>
                                <span className="text-slate-400 text-sm font-mono">Exemplo de requisição cURL</span>
                            </div>
                            <pre className="p-6 text-emerald-400 text-xs font-mono overflow-x-auto leading-relaxed">{`curl -X POST https://xtudoparaguai.com/api/catalog \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer SUA_CATALOG_API_KEY" \\
  -d '${EXAMPLE_JSON}'`}</pre>
                        </div>

                        {/* Fields table */}
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-50">
                                <h3 className="font-black text-slate-900">Campos do produto</h3>
                            </div>
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left font-black text-slate-500 uppercase tracking-wider text-xs">Campo</th>
                                        <th className="px-6 py-3 text-left font-black text-slate-500 uppercase tracking-wider text-xs">Tipo</th>
                                        <th className="px-6 py-3 text-left font-black text-slate-500 uppercase tracking-wider text-xs">Obrigatório</th>
                                        <th className="px-6 py-3 text-left font-black text-slate-500 uppercase tracking-wider text-xs">Descrição</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {[
                                        ['sku', 'string', '✅', 'ID único do produto no seu sistema (chave de upsert)'],
                                        ['title', 'string', '✅', 'Nome completo do produto'],
                                        ['price_usd', 'number', '✅', 'Preço em USD (convertido para BRL automaticamente)'],
                                        ['category', 'string', '✅', 'Ex: Celulares, Apple, Games, Perfumes'],
                                        ['images', 'string[]', '✅', 'Array de URLs de imagens (min. 1)'],
                                        ['stock', 'number', '✅', 'Quantidade em estoque'],
                                        ['seller_id', 'string', '✅', 'UUID do seller na plataforma XTUDO'],
                                        ['description', 'string', '—', 'Descrição detalhada do produto'],
                                        ['price_brl', 'number', '—', 'Sobrescreve a conversão automática USD→BRL'],
                                        ['brand', 'string', '—', 'Marca do produto'],
                                        ['weight_kg', 'number', '—', 'Peso em kg (padrão: 1)'],
                                        ['height_cm', 'number', '—', 'Altura em cm (padrão: 15)'],
                                        ['width_cm', 'number', '—', 'Largura em cm (padrão: 20)'],
                                        ['length_cm', 'number', '—', 'Comprimento em cm (padrão: 25)'],
                                    ].map(([field, type, req, desc]) => (
                                        <tr key={field}>
                                            <td className="px-6 py-3 font-mono text-indigo-700 font-bold text-xs">{field}</td>
                                            <td className="px-6 py-3 text-slate-500 font-medium text-xs">{type}</td>
                                            <td className="px-6 py-3 text-center">{req}</td>
                                            <td className="px-6 py-3 text-slate-500 text-xs">{desc}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Response */}
                        <div className="bg-slate-950 rounded-3xl overflow-hidden border border-slate-800">
                            <div className="px-6 py-4 border-b border-slate-800">
                                <span className="text-slate-400 text-sm font-mono">Resposta de sucesso (200)</span>
                            </div>
                            <pre className="p-6 text-emerald-400 text-xs font-mono">{`{
  "success": true,
  "inserted": 42,
  "validation_errors": []     // produtos ignorados com motivo
}`}</pre>
                        </div>
                    </motion.div>
                )}

                {/* ── TAB: TEST ── */}
                {tab === 'test' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center">
                            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5">🧪</div>
                            <h3 className="text-xl font-black text-slate-900 mb-3">Testar a integração</h3>
                            <p className="text-slate-500 font-medium mb-8 max-w-md mx-auto">
                                Para testar a API com produtos reais, accesse o endpoint diretamente pelo seu
                                sistema de integração (Postman, Insomnia, cURL, Python, etc.) usando as credenciais fornecidas.
                            </p>
                            <div className="space-y-3 max-w-sm mx-auto">
                                <div className="bg-slate-50 rounded-2xl p-4 text-left">
                                    <p className="text-xs font-black text-slate-400 uppercase mb-1">URL Base (Produção)</p>
                                    <p className="font-mono text-indigo-700 text-sm font-bold">https://xtudoparaguai.com/api/catalog</p>
                                </div>
                                <div className="bg-emerald-50 rounded-2xl p-4 text-left">
                                    <p className="text-xs font-black text-slate-400 uppercase mb-1">Verificar API (GET)</p>
                                    <p className="font-mono text-emerald-700 text-sm font-bold">GET /api/catalog</p>
                                    <p className="text-xs text-slate-400 mt-1">Retorna o schema completo da API</p>
                                </div>
                            </div>
                            <div className="mt-8 flex justify-center gap-4">
                                <button
                                    onClick={() => { window.location.hash = '#contato'; }}
                                    className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-indigo-700 transition-colors"
                                >
                                    Solicitar API Key →
                                </button>
                                <button
                                    onClick={() => setTab('csv')}
                                    className="bg-slate-100 text-slate-700 font-bold py-3 px-6 rounded-xl hover:bg-slate-200 transition-colors"
                                >
                                    Usar CSV →
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default CatalogIntegration;
