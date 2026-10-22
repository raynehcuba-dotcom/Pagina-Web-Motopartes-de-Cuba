import React, { useMemo, useState } from 'react';
import { Repuesto } from '../types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  BarChart3,
  PieChart as PieChartIcon,
  Package,
  Boxes,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

interface CatalogStatisticsPanelProps {
  repuestos: Repuesto[];
}

const MODEL_COLORS: Record<string, string> = {
  MZ: '#dc2626',       // Red (MZ Racing)
  GN125: '#f59e0b',    // Amber
  AX100: '#3b82f6',    // Blue
  Karpaty: '#10b981',  // Emerald
  Universal: '#8b5cf6', // Violet
};

const DEFAULT_COLOR = '#94a3b8';

export const CatalogStatisticsPanel: React.FC<CatalogStatisticsPanelProps> = ({ repuestos }) => {
  const [metricView, setMetricView] = useState<'skus' | 'units'>('skus');

  // 1. Overall Inventory Valuation & Metrics
  const stats = useMemo(() => {
    const totalSkus = repuestos.length;
    const totalPhysicalUnits = repuestos.reduce((acc, r) => acc + (r.stockCount || 0), 0);
    const totalValuationCUP = repuestos.reduce(
      (acc, r) => acc + (r.priceCUP || 0) * (r.stockCount || 0),
      0
    );
    const totalValuationUSD = repuestos.reduce(
      (acc, r) => acc + (r.priceUSD || 0) * (r.stockCount || 0),
      0
    );
    const lowStockCount = repuestos.filter((r) => r.stock === 'bajo_stock').length;
    const availableCount = repuestos.filter((r) => r.stock === 'disponible').length;
    const onOrderCount = repuestos.filter((r) => r.stock === 'encargo').length;

    return {
      totalSkus,
      totalPhysicalUnits,
      totalValuationCUP,
      totalValuationUSD,
      lowStockCount,
      availableCount,
      onOrderCount,
    };
  }, [repuestos]);

  // 2. Repuestos distribution by motorcycle model
  const modelData = useMemo(() => {
    const map: Record<
      string,
      { model: string; skus: number; units: number; totalValuationCUP: number }
    > = {};

    repuestos.forEach((r) => {
      const model = r.model || 'Universal';
      if (!map[model]) {
        map[model] = {
          model,
          skus: 0,
          units: 0,
          totalValuationCUP: 0,
        };
      }
      map[model].skus += 1;
      map[model].units += r.stockCount || 0;
      map[model].totalValuationCUP += (r.priceCUP || 0) * (r.stockCount || 0);
    });

    return Object.values(map).sort((a, b) => b.skus - a.skus);
  }, [repuestos]);

  // 3. Price tiers & stock distribution
  const priceTiersData = useMemo(() => {
    const tiers = [
      {
        rango: '< $5k CUP',
        rangoUSD: '< $15 USD',
        min: 0,
        max: 5000,
        skus: 0,
        unidades: 0,
      },
      {
        rango: '$5k - $15k CUP',
        rangoUSD: '$15 - $45 USD',
        min: 5000,
        max: 15000,
        skus: 0,
        unidades: 0,
      },
      {
        rango: '$15k - $25k CUP',
        rangoUSD: '$45 - $75 USD',
        min: 15000,
        max: 25000,
        skus: 0,
        unidades: 0,
      },
      {
        rango: '$25k - $35k CUP',
        rangoUSD: '$75 - $105 USD',
        min: 25000,
        max: 35000,
        skus: 0,
        unidades: 0,
      },
      {
        rango: '> $35k CUP',
        rangoUSD: '> $105 USD',
        min: 35000,
        max: Infinity,
        skus: 0,
        unidades: 0,
      },
    ];

    repuestos.forEach((r) => {
      const price = r.priceCUP || 0;
      const tier = tiers.find((t) => price >= t.min && price < t.max);
      if (tier) {
        tier.skus += 1;
        tier.unidades += r.stockCount || 0;
      }
    });

    return tiers;
  }, [repuestos]);

  // 4. Custom Dark Tooltip for Charts
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-white/15 bg-[#0f1118] p-3 text-xs font-mono shadow-2xl backdrop-blur-md">
          <p className="font-bold text-white mb-1.5 border-b border-white/10 pb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4 py-0.5">
              <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                <span
                  className="h-2 w-2 rounded-full inline-block"
                  style={{ backgroundColor: entry.color }}
                />
                {entry.name}:
              </span>
              <span className="font-bold text-white tabular-nums">
                {entry.value.toLocaleString('es-ES')}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percent = ((data.value / (metricView === 'skus' ? stats.totalSkus : stats.totalPhysicalUnits)) * 100).toFixed(1);
      return (
        <div className="rounded-xl border border-white/15 bg-[#0f1118] p-3 text-xs font-mono shadow-2xl backdrop-blur-md">
          <p className="font-bold text-white mb-1 border-b border-white/10 pb-1">
            Modelo: {data.name}
          </p>
          <div className="flex items-center justify-between gap-4 py-0.5">
            <span className="text-slate-400">
              {metricView === 'skus' ? 'Variedad de piezas' : 'Unidades en almacén'}:
            </span>
            <span className="font-bold text-white tabular-nums">
              {data.value} ({percent}%)
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* SKUs */}
        <div className="rounded-xl border border-white/10 bg-[#161a24] p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase text-slate-400">Total Repuestos</span>
            <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
              {stats.totalSkus} <span className="text-xs font-normal text-slate-400">SKUs</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono mt-0.5 inline-block">
              {stats.availableCount} disponibles en stock
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-red-600/15 border border-red-500/30 text-red-500 flex items-center justify-center shrink-0">
            <Package className="h-5 w-5" />
          </div>
        </div>

        {/* Total Physical Stock */}
        <div className="rounded-xl border border-white/10 bg-[#161a24] p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase text-slate-400">Unidades Físicas</span>
            <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
              {stats.totalPhysicalUnits.toLocaleString('es-ES')}{' '}
              <span className="text-xs font-normal text-slate-400">un.</span>
            </div>
            <span className="text-[10px] text-amber-400 font-mono mt-0.5 inline-block">
              {stats.lowStockCount} con stock bajo
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center shrink-0">
            <Boxes className="h-5 w-5" />
          </div>
        </div>

        {/* Valuation CUP */}
        <div className="rounded-xl border border-white/10 bg-[#161a24] p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase text-slate-400">Valor Almacén (CUP)</span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
              ${(stats.totalValuationCUP / 1000).toFixed(0)}k{' '}
              <span className="text-xs font-normal text-slate-400">CUP</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono mt-0.5 inline-block truncate max-w-[120px]" title={`$${stats.totalValuationCUP.toLocaleString('es-ES')} CUP`}>
              ${stats.totalValuationCUP.toLocaleString('es-ES')}
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center shrink-0">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        {/* Valuation USD */}
        <div className="rounded-xl border border-white/10 bg-[#161a24] p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase text-slate-400">Valor Almacén (USD)</span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
              ${stats.totalValuationUSD.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}{' '}
              <span className="text-xs font-normal text-slate-400">USD</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono mt-0.5 inline-block">
              Tasa ref. 340 CUP/USD
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 flex items-center justify-center shrink-0">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Repuestos por Modelo */}
        <div className="rounded-2xl border border-white/10 bg-[#141721] p-5 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <PieChartIcon className="h-4 w-4 text-red-500" />
                <h3 className="font-condensed text-lg font-bold uppercase tracking-wide text-white">
                  Distribución por Modelo de Moto
                </h3>
              </div>

              {/* View Toggle (SKUs vs Units) */}
              <div className="flex items-center gap-1 bg-[#0d0f15] border border-white/10 rounded-lg p-0.5 text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => setMetricView('skus')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    metricView === 'skus'
                      ? 'bg-red-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Variedad (SKUs)
                </button>
                <button
                  type="button"
                  onClick={() => setMetricView('units')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    metricView === 'units'
                      ? 'bg-red-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Unidades Físicas
                </button>
              </div>
            </div>

            {/* Donut Chart with Legend */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Pie
                    data={modelData}
                    dataKey={metricView}
                    nameKey="model"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {modelData.map((entry) => (
                      <Cell
                        key={`cell-${entry.model}`}
                        fill={MODEL_COLORS[entry.model] || DEFAULT_COLOR}
                        stroke="#141721"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Model Chips Legend & Summary */}
          <div className="mt-2 pt-3 border-t border-white/10 flex flex-wrap items-center justify-center gap-2">
            {modelData.map((m) => {
              const color = MODEL_COLORS[m.model] || DEFAULT_COLOR;
              const val = metricView === 'skus' ? `${m.skus} piezas` : `${m.units} un.`;
              return (
                <div
                  key={m.model}
                  className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-[#0e1017] px-2.5 py-1 text-xs font-mono"
                >
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                  <span className="font-bold text-white">{m.model}:</span>
                  <span className="text-slate-300 tabular-nums">{val}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Rangos de Precios de las Existencias */}
        <div className="rounded-2xl border border-white/10 bg-[#141721] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-amber-500" />
                <h3 className="font-condensed text-lg font-bold uppercase tracking-wide text-white">
                  Rangos de Precios y Existencias
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Segmentación por escala de costo
              </span>
            </div>

            {/* Bar Chart */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={priceTiersData}
                  margin={{ top: 10, right: 10, left: -15, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#252a36" vertical={false} />
                  <XAxis
                    dataKey="rango"
                    tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
                    interval={0}
                    angle={-18}
                    textAnchor="end"
                  />
                  <YAxis
                    tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ paddingBottom: '10px', fontSize: '11px', fontFamily: 'monospace' }}
                  />
                  <Bar
                    dataKey="skus"
                    name="Piezas (SKUs)"
                    fill="#f59e0b"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}
                  />
                  <Bar
                    dataKey="unidades"
                    name="Unidades en Stock"
                    fill="#dc2626"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pricing Insight Footer */}
          <div className="mt-2 pt-3 border-t border-white/10 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Mayor concentración de existencias:</span>
            <span className="text-amber-400 font-bold">
              {priceTiersData.reduce((prev, curr) => (curr.unidades > prev.unidades ? curr : prev)).rango}
            </span>
          </div>
        </div>

      </div>

      {/* Breakdown Table: Modelos, Valoración y Stock Promedio */}
      <div className="rounded-2xl border border-white/10 bg-[#141721] p-5">
        <h4 className="font-condensed text-base font-bold uppercase tracking-wide text-white mb-3">
          Resumen Detallado por Modelo de Motocicleta
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-[11px] text-slate-400 uppercase">
                <th className="pb-2">Modelo</th>
                <th className="pb-2">Variedad (SKUs)</th>
                <th className="pb-2">Stock Físico</th>
                <th className="pb-2">Valoración CUP</th>
                <th className="pb-2 text-right">Porcentaje del Catálogo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {modelData.map((m) => {
                const percent = ((m.skus / stats.totalSkus) * 100).toFixed(1);
                return (
                  <tr key={m.model} className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 font-bold text-white flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: MODEL_COLORS[m.model] || DEFAULT_COLOR }}
                      />
                      {m.model}
                    </td>
                    <td className="py-2.5 text-slate-300">{m.skus} piezas</td>
                    <td className="py-2.5 text-slate-300">{m.units} unidades</td>
                    <td className="py-2.5 text-amber-400 font-semibold tabular-nums">
                      ${m.totalValuationCUP.toLocaleString('es-ES')} CUP
                    </td>
                    <td className="py-2.5 text-right font-bold text-red-400">{percent}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
