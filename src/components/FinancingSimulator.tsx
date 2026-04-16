"use client";

import React, { useState, useMemo } from "react";
import { GlassCard } from "./GlassCard";
import { FinancingInputs, calculatePriceAmortization, summarizeFinancing } from "@/lib/finance";
import { formatCurrency } from "@/lib/utils";
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
  BarChart, Bar, Legend,
} from "recharts";
import {
  TrendingDown, Calendar, DollarSign, ArrowUpRight, Plus, Trash2, HelpCircle,
  Clock, Banknote, ArrowDownRight, Scale,
} from "lucide-react";

type ActiveTab = "prazo" | "parcela" | "comparativo";

export default function FinancingSimulator() {
  const [inputs, setInputs] = useState<FinancingInputs>({
    assetValue: 136800,
    downPayment: 43610,
    monthlyInterestRate: 1.4,
    months: 60,
    fees: 4554.58,
    extraAmortizations: {},
  });

  const [extraMonth, setExtraMonth] = useState("");
  const [extraAmount, setExtraAmount] = useState("");
  const [activeTab, setActiveTab] = useState<ActiveTab>("comparativo");

  // Cenário A: Redução de Prazo (amortiza e mantém parcela, quita antes)
  const prazoData = useMemo(() => {
    const rows = calculatePriceAmortization({ ...inputs, amortizationStrategy: "prazo" });
    return { rows, stats: summarizeFinancing(rows) };
  }, [inputs]);

  // Cenário B: Redução de Parcela (amortiza e recalcula parcela, mantém prazo)
  const parcelaData = useMemo(() => {
    const rows = calculatePriceAmortization({ ...inputs, amortizationStrategy: "parcela" });
    return { rows, stats: summarizeFinancing(rows) };
  }, [inputs]);

  // Cenário Base: Sem amortizações extras
  const baseData = useMemo(() => {
    const baseInputs: FinancingInputs = {
      assetValue: inputs.assetValue,
      downPayment: inputs.downPayment,
      monthlyInterestRate: inputs.monthlyInterestRate,
      months: inputs.months,
      fees: inputs.fees,
      extraAmortizations: {},
    };
    const rows = calculatePriceAmortization(baseInputs);
    return { rows, stats: summarizeFinancing(rows) };
  }, [inputs.assetValue, inputs.downPayment, inputs.monthlyInterestRate, inputs.months, inputs.fees]);

  const handleInputChange = (field: keyof FinancingInputs, value: string) => {
    setInputs(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0,
    }));
  };

  const addExtraAmortization = () => {
    const m = parseInt(extraMonth);
    const a = parseFloat(extraAmount);
    if (isNaN(m) || isNaN(a) || m < 1 || a <= 0) return;
    setInputs(prev => ({
      ...prev,
      extraAmortizations: { ...prev.extraAmortizations, [m]: a },
    }));
    setExtraMonth("");
    setExtraAmount("");
  };

  const removeExtraAmortization = (month: number) => {
    setInputs(prev => {
      const newExtras = { ...prev.extraAmortizations };
      delete newExtras[month];
      return { ...prev, extraAmortizations: newExtras };
    });
  };

  const hasExtras = Object.keys(inputs.extraAmortizations || {}).length > 0;

  // Chart data for comparison
  const maxLen = Math.max(prazoData.rows.length, parcelaData.rows.length, baseData.rows.length);
  const comparisonChartData = Array.from({ length: maxLen }, (_, idx) => ({
    name: `${idx + 1}`,
    original: Math.round(baseData.rows[idx]?.balance ?? 0),
    prazo: Math.round(prazoData.rows[idx]?.balance ?? 0),
    parcela: Math.round(parcelaData.rows[idx]?.balance ?? 0),
  }));

  // Bar chart data for KPI comparison
  const kpiBarData = [
    {
      name: "Total Juros",
      Original: Math.round(baseData.stats.totalInterest),
      "Red. Prazo": Math.round(prazoData.stats.totalInterest),
      "Red. Parcela": Math.round(parcelaData.stats.totalInterest),
    },
    {
      name: "Total Pago",
      Original: Math.round(baseData.stats.totalPaid),
      "Red. Prazo": Math.round(prazoData.stats.totalPaid),
      "Red. Parcela": Math.round(parcelaData.stats.totalPaid),
    },
  ];

  const activeData = activeTab === "prazo" ? prazoData : parcelaData;
  const activeStats = activeData.stats;

  return (
    <div className="space-y-4 md:space-y-8 pb-12 md:pb-20">
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
        <StatCard
          title="Total de Juros"
          value={formatCurrency(activeStats.totalInterest)}
          icon={<DollarSign className="w-5 h-5 text-accent" />}
          trend={hasExtras && activeStats.totalInterest < baseData.stats.totalInterest
            ? `Economia de ${formatCurrency(baseData.stats.totalInterest - activeStats.totalInterest)}`
            : null}
        />
        <StatCard
          title="Total Pago"
          value={formatCurrency(activeStats.totalPaid)}
          icon={<TrendingDown className="w-5 h-5 text-accent-secondary" />}
        />
        <StatCard
          title="Duração"
          value={`${activeStats.durationInMonths} meses`}
          icon={<Calendar className="w-5 h-5 text-accent" />}
          trend={hasExtras && activeStats.durationInMonths < inputs.months
            ? `Reduzido em ${inputs.months - activeStats.durationInMonths} meses`
            : null}
        />
        <StatCard
          title="Valor Financiado"
          value={formatCurrency((inputs.assetValue - inputs.downPayment) + (inputs.fees || 0))}
          icon={<ArrowUpRight className="w-5 h-5 text-white/50" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8">
        {/* Left Column */}
        <div className="lg:col-span-4 space-y-4 md:space-y-6">
          <GlassCard>
            <h2 className="text-xl font-semibold mb-6 glow-text">Dados do Financiamento</h2>
            <div className="space-y-4">
              <InputField label="Valor do Bem" value={inputs.assetValue} onChange={(v) => handleInputChange("assetValue", v)} />
              <InputField label="Entrada" value={inputs.downPayment} onChange={(v) => handleInputChange("downPayment", v)} />
              <InputField label="Juros Mensais (%)" value={inputs.monthlyInterestRate} onChange={(v) => handleInputChange("monthlyInterestRate", v)} step="0.01" />
              <InputField label="Prazo (Meses)" value={inputs.months} onChange={(v) => handleInputChange("months", v)} />
              <InputField label="Taxas Extras / Seguros" value={inputs.fees || 0} onChange={(v) => handleInputChange("fees", v)} accent />
            </div>
          </GlassCard>

          <GlassCard className="border-accent/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold glow-text">Amortizações Extras</h2>
              <HelpCircle className="w-4 h-4 text-white/20" />
            </div>
            <div className="flex gap-2 mb-6">
              <input type="number" placeholder="Mês" className="glass-input w-24 min-w-0 text-sm" value={extraMonth} onChange={(e) => setExtraMonth(e.target.value)} />
              <input type="number" placeholder="Valor (R$)" className="glass-input flex-1 min-w-0 text-sm" value={extraAmount} onChange={(e) => setExtraAmount(e.target.value)} />
              <button onClick={addExtraAmortization} className="bg-accent hover:bg-accent/80 text-black p-3 rounded-xl transition-all shrink-0">
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {Object.entries(inputs.extraAmortizations || {}).map(([month, amount]) => (
                <div key={month} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-lg group">
                  <span className="text-sm">Mês {month}: <span className="font-bold">{formatCurrency(amount)}</span></span>
                  <button onClick={() => removeExtraAmortization(parseInt(month))} className="text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {Object.keys(inputs.extraAmortizations || {}).length === 0 && (
                <p className="text-center text-white/20 text-xs py-4">Nenhuma amortização extra adicionada.</p>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-8 space-y-4 md:space-y-8">
          {/* Tab Navigation */}
          <div className="flex gap-1 md:gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
            <TabButton active={activeTab === "comparativo"} onClick={() => setActiveTab("comparativo")} icon={<Scale className="w-4 h-4" />} label="Comparar" />
            <TabButton active={activeTab === "prazo"} onClick={() => setActiveTab("prazo")} icon={<Clock className="w-4 h-4" />} label="Prazo" />
            <TabButton active={activeTab === "parcela"} onClick={() => setActiveTab("parcela")} icon={<Banknote className="w-4 h-4" />} label="Parcela" />
          </div>

          {/* Comparison View */}
          {activeTab === "comparativo" && (
            <>
              {/* Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <ComparisonCard
                  title="Redução de Prazo"
                  subtitle="Mantém parcela, quita antes"
                  icon={<Clock className="w-5 h-5" />}
                  color="accent"
                  stats={[
                    { label: "Duração", value: `${prazoData.stats.durationInMonths} meses`, highlight: prazoData.stats.durationInMonths < inputs.months },
                    { label: "Total Juros", value: formatCurrency(prazoData.stats.totalInterest) },
                    { label: "Total Pago", value: formatCurrency(prazoData.stats.totalPaid) },
                    { label: "Economia", value: formatCurrency(baseData.stats.totalInterest - prazoData.stats.totalInterest), highlight: true },
                  ]}
                />
                <ComparisonCard
                  title="Redução de Parcela"
                  subtitle="Mantém prazo, parcela diminui"
                  icon={<Banknote className="w-5 h-5" />}
                  color="secondary"
                  stats={[
                    { label: "Duração", value: `${parcelaData.stats.durationInMonths} meses` },
                    { label: "Total Juros", value: formatCurrency(parcelaData.stats.totalInterest) },
                    { label: "Total Pago", value: formatCurrency(parcelaData.stats.totalPaid) },
                    { label: "Economia", value: formatCurrency(baseData.stats.totalInterest - parcelaData.stats.totalInterest), highlight: true },
                  ]}
                />
              </div>

              {/* Side-by-side Chart */}
              <GlassCard className="h-[320px] md:h-[450px] flex flex-col">
                <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4 glow-text text-center">Saldo Devedor — Comparação</h2>
                <div className="flex-1 min-h-0 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={comparisonChartData}>
                      <defs>
                        <linearGradient id="gradOriginal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ffffff" stopOpacity={0.08} />
                          <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gradPrazo" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#00f2ff" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gradParcela" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} interval="preserveStartEnd" label={{ value: "Meses", position: "insideBottom", offset: -5, fill: "rgba(255,255,255,0.2)", fontSize: 11 }} />
                      <YAxis hide />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                        formatter={(v: number) => formatCurrency(v)}
                      />
                      <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                      <Area type="monotone" dataKey="original" stroke="#fff" strokeOpacity={0.2} fillOpacity={1} fill="url(#gradOriginal)" name="Original" />
                      <Area type="monotone" dataKey="prazo" stroke="#00f2ff" fillOpacity={1} fill="url(#gradPrazo)" name="Red. Prazo" strokeWidth={2} />
                      <Area type="monotone" dataKey="parcela" stroke="#f59e0b" fillOpacity={1} fill="url(#gradParcela)" name="Red. Parcela" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              {/* KPI Bar Comparison */}
              <GlassCard className="h-[280px] md:h-[350px] flex flex-col">
                <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4 glow-text text-center">Valores Totais — Comparação</h2>
                <div className="flex-1 min-h-0 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={kpiBarData} barGap={4}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }} />
                      <YAxis hide />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                        formatter={(v: number) => formatCurrency(v)}
                      />
                      <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                      <Bar dataKey="Original" fill="rgba(255,255,255,0.15)" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="Red. Prazo" fill="#00f2ff" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="Red. Parcela" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            </>
          )}

          {/* Individual Tab Views (Prazo or Parcela) */}
          {(activeTab === "prazo" || activeTab === "parcela") && (
            <>
              <GlassCard className="h-[320px] md:h-[450px] flex flex-col">
                <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4 glow-text text-center">
                  Saldo Devedor — {activeTab === "prazo" ? "Redução de Prazo" : "Redução de Parcela"}
                </h2>
                <div className="flex-1 min-h-0 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activeData.rows.map((r, idx) => ({
                      name: `${r.month}`,
                      saldo: Math.round(r.balance),
                      original: Math.round(baseData.rows[idx]?.balance ?? 0),
                    }))}>
                      <defs>
                        <linearGradient id="gradActive" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={activeTab === "prazo" ? "#00f2ff" : "#f59e0b"} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={activeTab === "prazo" ? "#00f2ff" : "#f59e0b"} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gradOrig" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ffffff" stopOpacity={0.08} />
                          <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} interval="preserveStartEnd" label={{ value: "Meses", position: "insideBottom", offset: -5, fill: "rgba(255,255,255,0.2)", fontSize: 11 }} />
                      <YAxis hide />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                        formatter={(v: number) => formatCurrency(v)}
                      />
                      <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                      <Area type="monotone" dataKey="original" stroke="#fff" strokeOpacity={0.2} fillOpacity={1} fill="url(#gradOrig)" name="Original" />
                      <Area type="monotone" dataKey="saldo" stroke={activeTab === "prazo" ? "#00f2ff" : "#f59e0b"} fillOpacity={1} fill="url(#gradActive)" name={activeTab === "prazo" ? "Red. Prazo" : "Red. Parcela"} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              {/* Amortization Table */}
              <GlassCard>
                <h2 className="text-lg font-semibold mb-6 glow-text">
                  Tabela — {activeTab === "prazo" ? "Redução de Prazo" : "Redução de Parcela"}
                </h2>
                <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
                  <table className="w-full text-left text-xs md:text-sm min-w-[500px]">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="pb-4 font-bold text-white/40 text-xs uppercase tracking-widest">Mês</th>
                        <th className="pb-4 font-bold text-white/40 text-xs uppercase tracking-widest">Parcela</th>
                        <th className="pb-4 font-bold text-white/40 text-xs uppercase tracking-widest">Juros</th>
                        <th className="pb-4 font-bold text-white/40 text-xs uppercase tracking-widest">Amortização</th>
                        <th className="pb-4 font-bold text-white/40 text-xs uppercase tracking-widest">Extra</th>
                        <th className="pb-4 font-bold text-white/40 text-xs uppercase tracking-widest text-right">Saldo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {activeData.rows.map((row) => (
                        <tr key={row.month} className="group hover:bg-white/5 transition-colors">
                          <td className="py-3 font-medium text-white/60">{row.month}</td>
                          <td className="py-3">{formatCurrency(row.installment)}</td>
                          <td className="py-3 text-white/40">{formatCurrency(row.interest)}</td>
                          <td className="py-3 text-accent">{formatCurrency(row.amortization)}</td>
                          <td className="py-3">
                            {row.extraAmortization > 0 ? (
                              <span className="text-amber-400 font-bold">+{formatCurrency(row.extraAmortization)}</span>
                            ) : <span className="text-white/15">—</span>}
                          </td>
                          <td className="py-3 text-right font-medium">{formatCurrency(row.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-Components ─── */

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-1.5 md:gap-2 py-2.5 md:py-3 px-2 md:px-4 rounded-lg text-xs md:text-sm font-semibold transition-all ${
        active
          ? "bg-white/10 text-white shadow-lg border border-white/10"
          : "text-white/40 hover:text-white/60 hover:bg-white/5"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function StatCard({ title, value, icon, trend }: { title: string; value: string; icon: React.ReactNode; trend?: string | null }) {
  return (
    <GlassCard className="p-3 md:p-4 border-white/5 hover:border-white/10 transition-all">
      <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
        <div className="p-1.5 md:p-2 bg-white/5 rounded-lg">{icon}</div>
        <span className="text-[10px] md:text-xs text-white/40 font-bold uppercase tracking-tighter">{title}</span>
      </div>
      <div className="text-lg md:text-2xl font-bold glow-text tracking-tight">{value}</div>
      {trend && (
        <div className="text-[9px] md:text-[10px] text-accent mt-1 md:mt-2 font-bold uppercase flex items-center gap-1">
          <ArrowDownRight className="w-3 h-3 shrink-0" />
          <span className="truncate">{trend}</span>
        </div>
      )}
    </GlassCard>
  );
}

function ComparisonCard({ title, subtitle, icon, color, stats }: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: "accent" | "secondary";
  stats: { label: string; value: string; highlight?: boolean }[];
}) {
  const borderColor = color === "accent" ? "border-accent/30 hover:border-accent/50" : "border-amber-400/30 hover:border-amber-400/50";
  const iconBg = color === "accent" ? "bg-accent/10 text-accent" : "bg-amber-400/10 text-amber-400";

  return (
    <GlassCard className={`${borderColor} transition-all`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${iconBg}`}>{icon}</div>
        <div>
          <h3 className="font-bold text-sm">{title}</h3>
          <p className="text-[10px] text-white/30">{subtitle}</p>
        </div>
      </div>
      <div className="space-y-3">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center justify-between">
            <span className="text-xs text-white/40">{s.label}</span>
            <span className={`text-sm font-bold ${s.highlight ? (color === "accent" ? "text-accent" : "text-amber-400") : "text-white/80"}`}>
              {s.value}
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

function InputField({ label, value, onChange, step, accent }: {
  label: string;
  value: number;
  onChange: (v: string) => void;
  step?: string;
  accent?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs text-white/40 uppercase tracking-widest font-bold">{label}</label>
      <input
        type="number"
        step={step}
        className={`glass-input w-full ${accent ? "border-accent/10" : ""}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
