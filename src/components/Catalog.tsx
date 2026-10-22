import React, { useState, useMemo } from 'react';
import { Repuesto, MotorcycleModel, Category, Currency } from '../types';
import { CATEGORIAS, MODELOS_MOTO } from '../data/repuestos';
import { ProductCard } from './ProductCard';
import { RecentlyViewed } from './RecentlyViewed';
import {
  Search,
  X,
  SlidersHorizontal,
  PackageX,
  Sparkles,
  Heart,
  Coins,
  TrendingDown,
  TrendingUp,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface CatalogProps {
  repuestos: Repuesto[];
  activeModel: MotorcycleModel;
  onSelectModel: (model: MotorcycleModel) => void;
  currency: Currency;
  onOpenDetails: (repuesto: Repuesto) => void;
  onAddToCart: (repuesto: Repuesto) => void;
  cartItemIds: Set<string>;
  recentRepuestos: Repuesto[];
  onClearRecent: () => void;
  onToggleCompare: (id: string) => void;
  comparedItemIds: Set<string>;
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
}

export const Catalog: React.FC<CatalogProps> = ({
  repuestos,
  activeModel,
  onSelectModel,
  currency,
  onOpenDetails,
  onAddToCart,
  cartItemIds,
  recentRepuestos,
  onClearRecent,
  onToggleCompare,
  comparedItemIds,
  favorites,
  onToggleFavorite,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');

  // Budget Filter States
  const [selectedPreset, setSelectedPreset] = useState<'all' | 'budget' | 'mid' | 'premium' | 'custom'>('all');
  const [minBudget, setMinBudget] = useState<number | null>(null);
  const [maxBudget, setMaxBudget] = useState<number | null>(null);
  const [isSliderOpen, setIsSliderOpen] = useState(false);

  // Calculate dynamic catalog price ceiling according to currency
  const catalogMaxPrice = useMemo(() => {
    if (repuestos.length === 0) return currency === 'CUP' ? 40000 : 120;
    const prices = repuestos.map((r) => (currency === 'CUP' ? r.priceCUP : r.priceUSD));
    const max = Math.max(...prices);
    return currency === 'CUP' ? Math.ceil(max / 2500) * 2500 : Math.ceil(max / 10) * 10;
  }, [repuestos, currency]);

  // Current slider value (fallback to catalogMaxPrice when unrestricted)
  const currentSliderValue = maxBudget ?? catalogMaxPrice;

  // Preset definitions according to active currency
  const budgetPresets = useMemo(() => {
    if (currency === 'CUP') {
      return [
        { id: 'all' as const, label: 'Todos los precios', shortLabel: 'Todos', min: null, max: null },
        { id: 'budget' as const, label: 'Económicos (< $10.000 CUP)', shortLabel: '< $10k', min: null, max: 10000 },
        { id: 'mid' as const, label: 'Gama Media ($10.000 - $25.000)', shortLabel: '$10k - $25k', min: 10000, max: 25000 },
        { id: 'premium' as const, label: 'Kits & Motor (> $25.000 CUP)', shortLabel: '> $25k', min: 25000, max: null },
      ];
    } else {
      return [
        { id: 'all' as const, label: 'Todos los precios', shortLabel: 'Todos', min: null, max: null },
        { id: 'budget' as const, label: 'Económicos (< $30 USD)', shortLabel: '< $30', min: null, max: 30 },
        { id: 'mid' as const, label: 'Gama Media ($30 - $75 USD)', shortLabel: '$30 - $75', min: 30, max: 75 },
        { id: 'premium' as const, label: 'Kits & Motor (> $75 USD)', shortLabel: '> $75', min: 75, max: null },
      ];
    }
  }, [currency]);

  // Preset click handler
  const handleSelectPreset = (presetId: 'all' | 'budget' | 'mid' | 'premium') => {
    setSelectedPreset(presetId);
    const preset = budgetPresets.find((p) => p.id === presetId);
    if (!preset || presetId === 'all') {
      setMinBudget(null);
      setMaxBudget(null);
    } else {
      setMinBudget(preset.min);
      setMaxBudget(preset.max);
    }
  };

  // Slider change handler
  const handleSliderChange = (newMax: number) => {
    setSelectedPreset('custom');
    setMinBudget(null);
    if (newMax >= catalogMaxPrice) {
      setMaxBudget(null);
    } else {
      setMaxBudget(newMax);
    }
  };

  // Clear budget constraint
  const handleClearBudget = () => {
    setSelectedPreset('all');
    setMinBudget(null);
    setMaxBudget(null);
  };

  // Filter and sort items
  const filteredRepuestos = useMemo(() => {
    return repuestos
      .filter((item) => {
        // Only favorites filter
        if (showOnlyFavorites && !favorites.has(item.id)) {
          return false;
        }

        // Model filter
        if (activeModel !== 'all' && item.model !== activeModel && item.model !== 'Universal') {
          return false;
        }

        // Category filter
        if (selectedCategory !== 'all' && item.category !== selectedCategory) {
          return false;
        }

        // Budget / Price filter
        const price = currency === 'CUP' ? item.priceCUP : item.priceUSD;
        if (minBudget !== null && price < minBudget) {
          return false;
        }
        if (maxBudget !== null && price > maxBudget) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const matchName = item.name.toLowerCase().includes(query);
          const matchCode = item.code.toLowerCase().includes(query);
          const matchDesc = item.description.toLowerCase().includes(query);
          const matchModel = item.modelLabel.toLowerCase().includes(query);
          const matchCompat = item.compatibility.some((c) => c.toLowerCase().includes(query));

          if (!matchName && !matchCode && !matchDesc && !matchModel && !matchCompat) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.priceCUP - b.priceCUP;
        if (sortBy === 'price-desc') return b.priceCUP - a.priceCUP;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        // Featured default
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [
    repuestos,
    activeModel,
    selectedCategory,
    searchQuery,
    sortBy,
    showOnlyFavorites,
    favorites,
    minBudget,
    maxBudget,
    currency,
  ]);

  const hasPriceFilter = minBudget !== null || maxBudget !== null;
  const hasActiveFilters =
    activeModel !== 'all' ||
    selectedCategory !== 'all' ||
    searchQuery.trim() !== '' ||
    showOnlyFavorites ||
    hasPriceFilter;

  const handleResetFilters = () => {
    onSelectModel('all');
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('featured');
    setShowOnlyFavorites(false);
    handleClearBudget();
  };

  // Slider background progress percentage
  const sliderPercentage = Math.min(100, Math.max(0, (currentSliderValue / catalogMaxPrice) * 100));

  return (
    <section id="catalogo" className="bg-[#0c0e12] py-14 scroll-mt-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/10 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-red-500 tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Inventario Disponible en Almacén</span>
            </div>
            <h2 className="font-condensed text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase text-white mt-1">
              Catálogo de Piezas y Repuestos
            </h2>
          </div>

          {/* Model Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#141720] border border-white/10 rounded-xl overflow-x-auto max-w-full">
            {MODELOS_MOTO.map((m) => {
              const isActive = activeModel === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => onSelectModel(m.id as MotorcycleModel)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 font-mono ${
                    isActive
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Recently Viewed Strip */}
        <RecentlyViewed
          recentRepuestos={recentRepuestos}
          currency={currency}
          onOpenDetails={onOpenDetails}
          onAddToCart={onAddToCart}
          onClearRecent={onClearRecent}
          cartItemIds={cartItemIds}
        />

        {/* Search & Main Sorting Bar */}
        <div className="mt-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por pieza, modelo (MZ, GN, AX...), código o medida..."
              className="w-full rounded-xl border border-white/10 bg-[#161921] pl-10 pr-9 py-2.5 text-sm text-white placeholder-slate-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                title="Limpiar búsqueda"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Sorting Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">Ordenar:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-xl border border-white/10 bg-[#161921] px-3 py-2.5 text-xs font-mono text-slate-200 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              <option value="featured">Destacados & Disponibles</option>
              <option value="price-asc">Menor precio</option>
              <option value="price-desc">Mayor precio</option>
              <option value="name">Nombre (A - Z)</option>
            </select>
          </div>

        </div>

        {/* Budget Filter Bar with Quick Presets, Slider Toggle & Quick Sorting */}
        <div className="mt-4 rounded-2xl border border-white/10 bg-[#141720] p-4 shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
            
            {/* Presets Row */}
            <div className="flex flex-wrap items-center gap-1.5">
              <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-400 mr-1.5 shrink-0">
                <Coins className="h-4 w-4 text-red-500" />
                <span>Presupuesto:</span>
              </div>

              {budgetPresets.map((preset) => {
                const isActive = selectedPreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset.id)}
                    className={`rounded-lg px-2.5 py-1.5 text-xs font-mono transition-all border shrink-0 ${
                      isActive
                        ? 'border-red-500 bg-red-600 text-white font-bold shadow-md shadow-red-600/30'
                        : 'border-white/5 bg-[#1a1d27] text-slate-300 hover:border-white/20 hover:text-white'
                    }`}
                    title={preset.label}
                  >
                    {preset.label}
                  </button>
                );
              })}

              {/* Slider Toggle Button */}
              <button
                onClick={() => setIsSliderOpen((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-mono transition-all border shrink-0 ${
                  isSliderOpen || selectedPreset === 'custom'
                    ? 'border-red-500/70 bg-red-950/30 text-red-300 font-bold'
                    : 'border-white/5 bg-[#1a1d27] text-slate-400 hover:border-white/20 hover:text-white'
                }`}
                title="Ajustar límite de precio con el control deslizante"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-red-400" />
                <span>Rango exacto</span>
                {isSliderOpen ? (
                  <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
              </button>
            </div>

            {/* Quick Sort Buttons (One-click toggle for budget conscious users) */}
            <div className="flex items-center gap-1.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/5">
              <span className="text-[11px] font-mono text-slate-400 mr-1">Filtro rápido:</span>
              <button
                onClick={() => setSortBy(sortBy === 'price-asc' ? 'featured' : 'price-asc')}
                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-mono transition-all border ${
                  sortBy === 'price-asc'
                    ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 font-bold shadow-sm shadow-emerald-500/20'
                    : 'border-white/5 bg-[#1a1d27] text-slate-400 hover:text-white'
                }`}
                title="Ordenar repuestos de menor a mayor precio"
              >
                <TrendingDown className="h-3.5 w-3.5 text-emerald-400" />
                <span>Más baratos</span>
              </button>

              <button
                onClick={() => setSortBy(sortBy === 'price-desc' ? 'featured' : 'price-desc')}
                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-mono transition-all border ${
                  sortBy === 'price-desc'
                    ? 'border-red-500 bg-red-950/40 text-red-300 font-bold shadow-sm shadow-red-500/20'
                    : 'border-white/5 bg-[#1a1d27] text-slate-400 hover:text-white'
                }`}
                title="Ordenar repuestos de mayor a menor precio"
              >
                <TrendingUp className="h-3.5 w-3.5 text-red-400" />
                <span>Kits completos</span>
              </button>
            </div>

          </div>

          {/* Interactive Range Slider (Expandable or Active) */}
          {(isSliderOpen || selectedPreset === 'custom' || maxBudget !== null) && (
            <div className="mt-4 pt-4 border-t border-white/10 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Presupuesto máximo asignado:</span>
                  <span className="rounded bg-red-600/20 border border-red-500/40 px-2 py-0.5 font-bold text-red-400 text-sm tabular-nums">
                    {maxBudget !== null ? (
                      currency === 'CUP'
                        ? `$${maxBudget.toLocaleString('es-ES')} CUP`
                        : `$${maxBudget} USD`
                    ) : (
                      `Sin tope (hasta $${catalogMaxPrice.toLocaleString('es-ES')} ${currency})`
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-[11px]">
                    <strong className="text-white tabular-nums">{filteredRepuestos.length}</strong> piezas dentro del presupuesto
                  </span>
                  {hasPriceFilter && (
                    <button
                      onClick={handleClearBudget}
                      className="inline-flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 underline underline-offset-2"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Quitar tope</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Range Slider Control */}
              <div className="relative flex items-center gap-3 py-1">
                <span className="text-[11px] font-mono text-slate-500 shrink-0">$0</span>
                <div className="relative flex-1">
                  <input
                    type="range"
                    min={currency === 'CUP' ? 1000 : 5}
                    max={catalogMaxPrice}
                    step={currency === 'CUP' ? 500 : 5}
                    value={currentSliderValue}
                    onChange={(e) => handleSliderChange(Number(e.target.value))}
                    className="w-full h-2.5 rounded-lg appearance-none cursor-pointer accent-red-600 transition-all focus:outline-none focus:ring-2 focus:ring-red-500/40"
                    style={{
                      background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${sliderPercentage}%, rgba(255, 255, 255, 0.12) ${sliderPercentage}%, rgba(255, 255, 255, 0.12) 100%)`,
                    }}
                  />
                </div>
                <span className="text-[11px] font-mono text-slate-400 shrink-0 tabular-nums">
                  ${catalogMaxPrice.toLocaleString('es-ES')} {currency}
                </span>
              </div>
            </div>
          )}

        </div>

        {/* Horizontal Category Pill Tabs & Wishlist Toggle */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {/* Quick favorites filter toggle */}
          {favorites.size > 0 && (
            <button
              onClick={() => setShowOnlyFavorites((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-mono transition-all border shrink-0 ${
                showOnlyFavorites
                  ? 'border-red-500 bg-red-600 text-white font-bold shadow-md shadow-red-600/30'
                  : 'border-red-500/30 bg-red-950/20 text-red-400 hover:bg-red-900/30'
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${showOnlyFavorites ? 'fill-white stroke-white' : 'stroke-current'}`} />
              <span>Mis Favoritos ({favorites.size})</span>
            </button>
          )}

          {CATEGORIAS.map((cat) => {
            const isCatActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as Category)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-all border ${
                  isCatActive
                    ? 'border-red-500/80 bg-red-600/15 text-red-300 font-bold'
                    : 'border-white/5 bg-[#14171f] text-slate-400 hover:border-white/20 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Active Filters Summary */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
          <div className="flex flex-wrap items-center gap-1.5">
            <span>
              Mostrando <span className="font-bold text-white tabular-nums">{filteredRepuestos.length}</span> repuestos
            </span>

            {showOnlyFavorites && (
              <span className="rounded bg-red-600/20 border border-red-500/30 px-2 py-0.5 text-red-300 font-semibold text-[11px]">
                Favoritos
              </span>
            )}

            {activeModel !== 'all' && (
              <span className="rounded bg-white/5 border border-white/10 px-2 py-0.5 text-slate-300 font-semibold text-[11px]">
                {activeModel}
              </span>
            )}

            {hasPriceFilter && (
              <span className="inline-flex items-center gap-1 rounded bg-red-600/20 border border-red-500/40 px-2 py-0.5 text-red-300 font-semibold text-[11px]">
                Presupuesto: {minBudget !== null ? `> $${minBudget.toLocaleString('es-ES')}` : ''}{maxBudget !== null ? `≤ $${maxBudget.toLocaleString('es-ES')} ${currency}` : ''}
                <button
                  onClick={handleClearBudget}
                  className="hover:text-white p-0.5"
                  title="Eliminar filtro de presupuesto"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {sortBy !== 'featured' && (
              <span className="rounded bg-white/5 border border-white/10 px-2 py-0.5 text-slate-300 text-[11px]">
                Orden: {sortBy === 'price-asc' ? 'Menor precio' : sortBy === 'price-desc' ? 'Mayor precio' : 'Nombre A-Z'}
              </span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 underline underline-offset-4"
            >
              <X className="h-3 w-3" />
              <span>Limpiar todos los filtros</span>
            </button>
          )}
        </div>

        {/* Product Cards Grid */}
        {filteredRepuestos.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRepuestos.map((repuesto) => (
              <ProductCard
                key={repuesto.id}
                repuesto={repuesto}
                currency={currency}
                onOpenDetails={onOpenDetails}
                onAddToCart={onAddToCart}
                isInCart={cartItemIds.has(repuesto.id)}
                onToggleCompare={onToggleCompare}
                isCompared={comparedItemIds.has(repuesto.id)}
                isFavorite={favorites.has(repuesto.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="mt-12 rounded-2xl border border-white/10 bg-[#14171e] p-12 text-center max-w-xl mx-auto">
            <PackageX className="h-12 w-12 text-slate-500 mx-auto mb-4 stroke-1" />
            <h3 className="font-condensed text-2xl font-bold uppercase text-white">
              No encontramos piezas con estos criterios
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Prueba ampliando el presupuesto en el control deslizante, cambiando el modelo o eliminando los filtros activos.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleResetFilters}
                className="rounded-lg bg-white/10 px-4 py-2 text-xs font-mono font-medium text-white hover:bg-white/20 transition-colors"
              >
                Restablecer todos los filtros
              </button>
              {hasPriceFilter && (
                <button
                  onClick={handleClearBudget}
                  className="rounded-lg border border-red-500/50 bg-red-950/40 px-4 py-2 text-xs font-mono font-bold text-red-200 hover:bg-red-900/40 transition-colors"
                >
                  Quitar límite de precio
                </button>
              )}
              <a
                href="#encargo"
                className="rounded-lg bg-red-600 px-4 py-2 text-xs font-mono font-bold text-white hover:bg-red-500 transition-colors shadow-lg shadow-red-600/30"
              >
                Solicitar pieza por encargo
              </a>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
