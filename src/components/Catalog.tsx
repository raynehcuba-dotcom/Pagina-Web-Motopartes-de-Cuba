import React, { useState, useMemo } from 'react';
import { Repuesto, MotorcycleModel, Category, Currency } from '../types';
import { CATEGORIAS, MODELOS_MOTO } from '../data/repuestos';
import { ProductCard } from './ProductCard';
import { RecentlyViewed } from './RecentlyViewed';
import { Search, X, SlidersHorizontal, PackageX, Sparkles } from 'lucide-react';

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
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');

  // Filter and sort items
  const filteredRepuestos = useMemo(() => {
    return repuestos
      .filter((item) => {
        // Model filter
        if (activeModel !== 'all' && item.model !== activeModel && item.model !== 'Universal') {
          return false;
        }

        // Category filter
        if (selectedCategory !== 'all' && item.category !== selectedCategory) {
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
  }, [repuestos, activeModel, selectedCategory, searchQuery, sortBy]);

  const hasActiveFilters = activeModel !== 'all' || selectedCategory !== 'all' || searchQuery.trim() !== '';

  const handleResetFilters = () => {
    onSelectModel('all');
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('featured');
  };

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

          {/* Model Selector Tabs (clean segmented button tabs) */}
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

        {/* Recently Viewed Strip (Last 5 items) */}
        <RecentlyViewed
          recentRepuestos={recentRepuestos}
          currency={currency}
          onOpenDetails={onOpenDetails}
          onAddToCart={onAddToCart}
          onClearRecent={onClearRecent}
          cartItemIds={cartItemIds}
        />

        {/* Filter Controls Bar (Search, Category, Sorting) */}
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

        {/* Horizontal Category Pill Tabs */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
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
        <div className="mt-4 flex items-center justify-between text-xs font-mono text-slate-400">
          <div>
            Mostrando <span className="font-bold text-white tabular-nums">{filteredRepuestos.length}</span> repuestos encontrados
            {activeModel !== 'all' && (
              <> para <span className="text-red-400 font-semibold">{activeModel}</span></>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 underline underline-offset-4"
            >
              <X className="h-3 w-3" />
              <span>Limpiar filtros</span>
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
              Prueba cambiando el modelo seleccionado o busca con otro término. Si necesitas una pieza especial que no ves en el catálogo, podemos traértela por encargo.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleResetFilters}
                className="rounded-lg bg-white/10 px-4 py-2 text-xs font-mono font-medium text-white hover:bg-white/20 transition-colors"
              >
                Restablecer búsqueda
              </button>
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
