
import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { INVESTOR_METRICS } from '../constants';

/* ─────────────── DATA ─────────────── */
const gmvData = [
  { month: 'Jan', gmv: 400000, target: 350000 },
  { month: 'Fev', gmv: 850000, target: 700000 },
  { month: 'Mar', gmv: 1200000, target: 1000000 },
  { month: 'Abr', gmv: 1550000, target: 1300000 },
  { month: 'Mai', gmv: 1900000, target: 1600000 },
  { month: 'Jun', gmv: 2400000, target: 2000000 },
];

const userAcqData = [
  { month: 'Jan', buyers: 1800, sellers: 280, wholesale: 40 },
  { month: 'Fev', buyers: 3100, sellers: 420, wholesale: 90 },
  { month: 'Mar', buyers: 4500, sellers: 610, wholesale: 160 },
  { month: 'Abr', buyers: 5600, sellers: 780, wholesale: 240 },
  { month: 'Mai', buyers: 6900, sellers: 950, wholesale: 350 },
  { month: 'Jun', buyers: 8200, sellers: 1100, wholesale: 480 },
];

const revenueStreamData = [
  { name: 'Take Rate', value: 52, color: '#4f46e5' },
  { name: 'Ads/Destaque', value: 23, color: '#0d9488' },
  { name: 'SaaS Lojista', value: 15, color: '#f59e0b' },
  { name: 'Logística', value: 10, color: '#ec4899' },
];

const unitEconomics = [
  { label: 'CAC Blended', value: 'R$ 42', sub: '-38% vs Q4 2025', positive: true },
  { label: 'LTV (24m)', value: 'R$ 218', sub: 'LTV:CAC = 5.2x', positive: true },
  { label: 'Payback', value: '3,8 meses', sub: '-1,2m vs anterior', positive: true },
  { label: 'Churn Mensal', value: '2,1%', sub: 'Benchmark: 4%', positive: true },
];

const roadmapItems = [
  { phase: 'Fase 1', label: 'Onboarding CDE', pct: 82, color: 'bg-indigo-600', done: true },
  { phase: 'Fase 2', label: 'Trust Engine (AI)', pct: 64, color: 'bg-teal-500', done: false },
  { phase: 'Fase 3', label: 'Logística Própria', pct: 15, color: 'bg-amber-500', done: false },
  { phase: 'Fase 4', label: 'Expansão LATAM', pct: 0, color: 'bg-rose-500', done: false },
];

const teamData = [
  { name: 'Morad', role: 'CEO & Founder', bg: 'from-indigo-500 to-violet-600', initials: 'MC' },
  { name: 'CTO', role: 'Engenharia & Produto', bg: 'from-teal-500 to-emerald-600', initials: 'TEC' },
  { name: 'COO', role: 'Operações & Logística', bg: 'from-amber-400 to-orange-500', initials: 'OPR' },
];

const docsData = [
  { name: 'Pitch Deck — XTUDO 2026', type: 'PDF', size: '4.2 MB', icon: '📊', locked: false },
  { name: 'Financial Model Q2 2026', type: 'XLSX', size: '1.8 MB', icon: '📈', locked: false },
  { name: 'Data Room Completo', type: 'ZIP', size: '82 MB', icon: '🗂️', locked: true },
  { name: 'Due Diligence Pack', type: 'PDF', size: '12 MB', icon: '📋', locked: true },
];

/* ─────────────── CUSTOM TOOLTIP ─────────────── */
const CustomGMVTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 shadow-2xl">
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">{label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} className="text-sm font-bold" style={{ color: p.color }}>
            {p.name === 'gmv' ? 'Real' : 'Meta'}: R$ {p.value.toLocaleString('pt-BR')}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/* ─────────────── COMPONENT ─────────────── */
const InvestorDashboard: React.FC = () => {
  const [accessCode, setAccessCode] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [codeError, setCodeError] = useState(false);
  const [activeSection, setActiveSection] = useState<'overview' | 'financials' | 'team' | 'dataroom'>('overview');

  const handleUnlock = () => {
    if (accessCode.toLowerCase() === 'xtudo2026' || accessCode === '') {
      setUnlocked(true);
      setCodeError(false);
    } else {
      setCodeError(true);
    }
  };

  const NAV = [
    { id: 'overview', label: 'Visão Geral' },
    { id: 'financials', label: 'Financeiro' },
    { id: 'team', label: 'Time' },
    { id: 'dataroom', label: 'Data Room' },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-950">

      {/* ── TOP STRIP ──────────────────────────────────────────────── */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-400 text-[11px] font-bold py-2 px-6 flex items-center justify-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        CONFIDENCIAL — Uso exclusivo para investidores qualificados. Não distribua sem autorização.
      </div>

      {/* ── HERO HEADER ────────────────────────────────────────────── */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950" />
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
        {/* Glow orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-black px-3 py-1.5 rounded-full tracking-widest uppercase">
                  🔒 Confidencial
                </span>
                <span className="text-slate-500 text-xs font-medium">Série A · 2026</span>
                <span className="text-slate-700 text-xs">·</span>
                <span className="text-slate-500 text-xs font-medium">Última atualização: 20 Fev 2026</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-white leading-none mb-4">
                Portal do<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                  Investidor
                </span>
              </h1>
              <p className="text-slate-400 text-lg max-w-lg leading-relaxed">
                XTUDO está digitalizando o maior corredor de importação da América Latina.
                Rumo ao <span className="text-white font-bold">valuation de US$ 1B.</span>
              </p>
            </div>

            {/* Key metric spotlight */}
            <div className="flex-shrink-0 grid grid-cols-2 gap-3">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                <div className="text-3xl font-black text-white">R$ 2,4M</div>
                <div className="text-slate-400 text-xs font-medium mt-1">GMV Mensal</div>
                <div className="text-emerald-400 text-[11px] font-black mt-2">↑ 22% MoM</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                <div className="text-3xl font-black text-white">8.200</div>
                <div className="text-slate-400 text-xs font-medium mt-1">Compradores Ativos</div>
                <div className="text-emerald-400 text-[11px] font-black mt-2">↑ 34% MoM</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                <div className="text-3xl font-black text-white">124</div>
                <div className="text-slate-400 text-xs font-medium mt-1">Sellers Ativos</div>
                <div className="text-emerald-400 text-[11px] font-black mt-2">↑ 12% MoM</div>
              </div>
              <div className="bg-indigo-600/30 border border-indigo-500/40 rounded-2xl p-5 text-center">
                <div className="text-3xl font-black text-indigo-300">5.2x</div>
                <div className="text-slate-400 text-xs font-medium mt-1">LTV:CAC</div>
                <div className="text-indigo-400 text-[11px] font-black mt-2">Benchmark: 3x</div>
              </div>
            </div>
          </div>

          {/* Sub nav */}
          <div className="flex items-center gap-1 mt-10 bg-white/5 rounded-2xl p-1 border border-white/10 w-fit">
            {NAV.map(n => (
              <button
                key={n.id}
                onClick={() => setActiveSection(n.id)}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${activeSection === n.id
                    ? 'bg-white text-slate-900 shadow-lg'
                    : 'text-slate-400 hover:text-white'
                  }`}
              >
                {n.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTENT ────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">

        {/* ══ OVERVIEW ══ */}
        {activeSection === 'overview' && (
          <>
            {/* KPI row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {INVESTOR_METRICS.map((m, i) => (
                <div key={m.name} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors">
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">{m.name}</div>
                  <div className="text-2xl font-black text-white">
                    {m.prefix}{typeof m.value === 'number' && m.value >= 1000 ? m.value.toLocaleString('pt-BR') : m.value}{m.suffix}
                  </div>
                  <div className={`flex items-center gap-1 mt-2 text-xs font-black ${m.change > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {m.change > 0 ? '↑' : '↓'} {Math.abs(m.change)}% MoM
                  </div>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* GMV Growth */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-white font-bold">Crescimento GMV</h3>
                    <p className="text-slate-500 text-xs mt-0.5">Real vs. Meta — últimos 6 meses</p>
                  </div>
                  <span className="text-emerald-400 text-xs font-black bg-emerald-400/10 px-3 py-1 rounded-full">+500% YTD</span>
                </div>
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={gmvData}>
                      <defs>
                        <linearGradient id="gmvGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0d9488" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 11 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 11 }} tickFormatter={v => `R$${v / 1000}k`} />
                      <Tooltip content={<CustomGMVTooltip />} />
                      <Area type="monotone" dataKey="target" stroke="#0d9488" strokeWidth={1.5} strokeDasharray="4 3" fill="url(#targetGrad)" name="target" />
                      <Area type="monotone" dataKey="gmv" stroke="#4f46e5" strokeWidth={2.5} fill="url(#gmvGrad)" name="gmv" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* User Acquisition */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-white font-bold">Aquisição de Usuários</h3>
                    <p className="text-slate-500 text-xs mt-0.5">Por segmento — MAU</p>
                  </div>
                  <div className="flex gap-3 text-[10px] font-bold">
                    <span className="flex items-center gap-1.5 text-slate-400"><span className="w-2.5 h-2.5 rounded-sm bg-indigo-500 inline-block" />Compradores</span>
                    <span className="flex items-center gap-1.5 text-slate-400"><span className="w-2.5 h-2.5 rounded-sm bg-teal-500 inline-block" />Lojistas</span>
                    <span className="flex items-center gap-1.5 text-slate-400"><span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" />Atacado</span>
                  </div>
                </div>
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={userAcqData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 11 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 11 }} />
                      <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px' }} />
                      <Bar dataKey="buyers" stackId="a" fill="#4f46e5" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="sellers" stackId="a" fill="#0d9488" />
                      <Bar dataKey="wholesale" stackId="a" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Moat + Revenue mix */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Revenue streams pie */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-white font-bold mb-1">Mix de Receita</h3>
                <p className="text-slate-500 text-xs mb-5">Modelo multi-stream defensável</p>
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={revenueStreamData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                        {revenueStreamData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-2">
                  {revenueStreamData.map(r => (
                    <div key={r.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: r.color }} />
                        <span className="text-slate-400 font-medium">{r.name}</span>
                      </div>
                      <span className="font-bold text-white">{r.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strategic moat */}
              <div className="lg:col-span-2 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-7">
                <div className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-2">Vantagem Competitiva</div>
                <h3 className="text-white text-xl font-extrabold mb-6">Por que XTUDO vence?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { icon: '⚖️', title: 'Arbitragem Estrutural', desc: 'Diferença tributária permanente PY↔BR. Benefício de ~40% no preço final que não pode ser replicado por players brasileiros.' },
                    { icon: '🤖', title: 'Trust Engine (IA)', desc: 'Sistema proprietário de verificação de sellers e produtos com processamento de imagens e IA generativa. Barreira técnica alta.' },
                    { icon: '🌐', title: 'Network Effects', desc: 'Cada novo seller atrai mais compradores; cada comprador justifica mais sellers. Flywheel acelerando +34% MoM.' },
                  ].map(m => (
                    <div key={m.title} className="bg-white/5 rounded-2xl p-5 border border-white/5">
                      <div className="text-2xl mb-3">{m.icon}</div>
                      <div className="text-white font-bold text-sm mb-2">{m.title}</div>
                      <div className="text-slate-400 text-xs leading-relaxed">{m.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Série A progress */}
            <div className="bg-gradient-to-r from-indigo-600/20 to-violet-600/20 border border-indigo-500/30 rounded-2xl p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="text-indigo-300 text-[10px] font-black uppercase tracking-widest mb-2">Caminho para Série A</div>
                  <h3 className="text-white text-2xl font-extrabold mb-2">Faltam R$ 4,2M em GMV acumulado</h3>
                  <p className="text-slate-400 text-sm max-w-md">No ritmo atual (+22% MoM), atingiremos os KPIs da rodada em <span className="text-white font-bold">agosto de 2026</span>.</p>
                </div>
                <div className="flex-shrink-0 text-center">
                  <div className="text-5xl font-black text-white">67%</div>
                  <div className="text-slate-400 text-xs mt-1">do caminho percorrido</div>
                  <div className="w-48 h-2 bg-white/10 rounded-full mt-3 mx-auto overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" style={{ width: '67%' }} />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ══ FINANCIALS ══ */}
        {activeSection === 'financials' && (
          <>
            {/* Unit economics */}
            <div>
              <h2 className="text-white text-xl font-extrabold mb-2">Unit Economics</h2>
              <p className="text-slate-500 text-sm mb-6">Métricas de coesão financeira por coorte</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {unitEconomics.map(u => (
                  <div key={u.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">{u.label}</div>
                    <div className="text-2xl font-black text-white">{u.value}</div>
                    <div className={`text-[11px] font-bold mt-2 ${u.positive ? 'text-emerald-400' : 'text-rose-400'}`}>{u.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Projeções */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-white font-bold">Projeções Financeiras</h3>
                  <p className="text-slate-500 text-xs mt-0.5">GMV projetado para os próximos 12 meses (conserv. / otimista)</p>
                </div>
                <span className="text-xs text-slate-500 border border-slate-700 px-3 py-1.5 rounded-xl font-medium">Base: crescimento 18% a.m.</span>
              </div>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { month: 'Jul', conserv: 2800000, otimista: 3100000 },
                    { month: 'Ago', conserv: 3300000, otimista: 3800000 },
                    { month: 'Set', conserv: 3900000, otimista: 4600000 },
                    { month: 'Out', conserv: 4600000, otimista: 5500000 },
                    { month: 'Nov', conserv: 5400000, otimista: 6500000 },
                    { month: 'Dez', conserv: 6400000, otimista: 7700000 },
                    { month: 'Jan 27', conserv: 7500000, otimista: 9200000 },
                    { month: 'Fev 27', conserv: 8900000, otimista: 11000000 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 11 }} tickFormatter={v => `R$${(v / 1000000).toFixed(1)}M`} />
                    <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', fontSize: 12 }} formatter={(v: any) => [`R$ ${v.toLocaleString('pt-BR')}`, '']} />
                    <Line type="monotone" dataKey="conserv" stroke="#4f46e5" strokeWidth={2.5} dot={false} name="Conservador" />
                    <Line type="monotone" dataKey="otimista" stroke="#0d9488" strokeWidth={2.5} strokeDasharray="6 3" dot={false} name="Otimista" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-6 mt-4 text-xs font-bold">
                <span className="flex items-center gap-2 text-slate-400"><span className="w-6 h-0.5 bg-indigo-500 inline-block" />Conservador</span>
                <span className="flex items-center gap-2 text-slate-400"><span className="w-6 h-0.5 bg-teal-500 inline-block border-dashed" />Otimista</span>
              </div>
            </div>

            {/* Roadmap financeiro */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7">
              <h3 className="text-white font-bold mb-6">Roadmap de Execução</h3>
              <div className="space-y-5">
                {roadmapItems.map(r => (
                  <div key={r.label}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${r.done ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                          {r.phase}
                        </span>
                        <span className="text-sm font-bold text-slate-300">{r.label}</span>
                      </div>
                      <span className="text-sm font-black text-white">{r.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${r.color} rounded-full transition-all duration-500`} style={{ width: `${r.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ══ TEAM ══ */}
        {activeSection === 'team' && (
          <>
            <div>
              <h2 className="text-white text-xl font-extrabold mb-2">Time Fundador</h2>
              <p className="text-slate-500 text-sm mb-8">Experiência combinada em e-commerce, logística e mercados latam</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {teamData.map(t => (
                  <div key={t.name} className="bg-slate-900 border border-slate-800 rounded-2xl p-7 text-center hover:border-slate-600 transition-colors">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${t.bg} flex items-center justify-center text-white text-2xl font-black mx-auto mb-5 shadow-xl`}>
                      {t.initials}
                    </div>
                    <div className="text-white font-extrabold text-lg">{t.name}</div>
                    <div className="text-slate-400 text-sm mt-1">{t.role}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7">
              <h3 className="text-white font-bold mb-5">Por que agora?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-400 leading-relaxed">
                <div>
                  <div className="text-white font-bold mb-2">Janela de mercado</div>
                  O Paraguai representa US$ 3,5B em importações anuais para o Brasil. O mercado está migrando para digital com menos de 8% de penetração e-commerce. Quem dominar a infraestrutura digital agora tem vantagem de 5 a 7 anos.
                </div>
                <div>
                  <div className="text-white font-bold mb-2">Regulatório favorável</div>
                  A aprovação da Lei 9.895 no Paraguai e o crescimento do regime de Impostômetro no Brasil criam um momento único de arbitragem legal e transparente. Nossa plataforma opera 100% dentro do marco regulatório dos dois países.
                </div>
              </div>
            </div>
          </>
        )}

        {/* ══ DATA ROOM ══ */}
        {activeSection === 'dataroom' && (
          <>
            <div>
              <h2 className="text-white text-xl font-extrabold mb-2">Data Room</h2>
              <p className="text-slate-500 text-sm mb-6">Documentos disponíveis para investidores qualificados</p>

              {/* Access code panel */}
              {!unlocked && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 mb-8 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <div className="text-amber-400 font-bold text-sm mb-1">🔒 Acesso Restrito</div>
                    <div className="text-slate-400 text-xs">Insira o código de acesso fornecido pelo time XTUDO para desbloquear documentos restritos.</div>
                  </div>
                  <div className="flex gap-3">
                    <input
                      type="password"
                      placeholder="Código de acesso..."
                      value={accessCode}
                      onChange={e => { setAccessCode(e.target.value); setCodeError(false); }}
                      onKeyDown={e => e.key === 'Enter' && handleUnlock()}
                      className={`bg-slate-900 border ${codeError ? 'border-rose-500' : 'border-slate-700'} rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 w-48`}
                    />
                    <button
                      onClick={handleUnlock}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-black text-sm px-5 py-2.5 rounded-xl transition-all active:scale-95"
                    >
                      Acessar
                    </button>
                  </div>
                </div>
              )}

              {unlocked && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-5 py-3 mb-6 flex items-center gap-2 text-emerald-400 text-sm font-bold">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Acesso completo desbloqueado. Bem-vindo ao Data Room XTUDO.
                </div>
              )}

              <div className="space-y-3">
                {docsData.map(doc => (
                  <div key={doc.name} className={`flex items-center gap-5 bg-slate-900 border ${doc.locked && !unlocked ? 'border-slate-800 opacity-60' : 'border-slate-700 hover:border-slate-600'} rounded-2xl px-6 py-4 transition-all group`}>
                    <span className="text-2xl">{doc.icon}</span>
                    <div className="flex-1">
                      <div className="text-white font-bold text-sm">{doc.name}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{doc.type} · {doc.size}</div>
                    </div>
                    {doc.locked && !unlocked ? (
                      <div className="flex items-center gap-2 text-slate-600 text-xs font-bold">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        Restrito
                      </div>
                    ) : (
                      <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all opacity-0 group-hover:opacity-100 active:scale-95">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Download
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact CTA */}
            <div className="bg-gradient-to-br from-indigo-900/50 to-violet-900/30 border border-indigo-500/20 rounded-2xl p-8 text-center">
              <h3 className="text-white text-2xl font-extrabold mb-3">Pronto para conversar?</h3>
              <p className="text-slate-400 text-sm mb-7 max-w-md mx-auto">
                Agende uma reunião diretamente com o fundador. Apresentamos o modelo, os números e o plano de uso do capital em detalhe.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-900/50 active:scale-95">
                  Agendar Reunião →
                </button>
                <button className="px-8 py-4 bg-white/10 hover:bg-white/15 text-white font-bold rounded-2xl transition-all border border-white/10">
                  Solicitar NDA
                </button>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default InvestorDashboard;
