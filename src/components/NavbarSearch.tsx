import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Repuesto, MotorcycleModel, Currency } from '../types';
import { Search, X, ChevronRight, Sparkles, AlertCircle } from 'lucide-react';

interface NavbarSearchProps {
  repuestos: Repuesto[];
  activeModel: MotorcycleModel;
  currency: Currency;
  onSelectRepuesto: (repuesto: Repuesto) => void;
}

export const NavbarSearch: React.FC<NavbarSearchProps> = ({
  repuestos,
  activeModel,
  currency,
  onSelectRepuesto,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current && !['INPUT', 'TEXTAREA'].includes((document.activeElement as HTMLElement)?.tagName)) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Compute predictive suggestions prioritized by active motorcycle model
  const suggestions = useMemo(() => {
    if (!query.trim()) return [];

    const cleanQuery = query.toLowerCase().trim();

    // Score and filter items
    const matches = repuestos
      .map((item) => {
        const matchName = item.name.toLowerCase().includes(cleanQuery);
        const matchCode = item.code.toLowerCase().includes(cleanQuery);
        const matchModel = item.model.toLowerCase().includes(cleanQuery) || item.modelLabel.toLowerCase().includes(cleanQuery);
        const matchCat = item.categoryLabel.toLowerCase().includes(cleanQuery);
        const matchCompat = item.compatibility.some((c) => c.toLowerCase().includes(cleanQuery));

        if (!matchName && !matchCode && !matchModel && !matchCat && !matchCompat) {
          return null;
        }

        // Calculate prioritization score
        let priorityScore = 1;

        // Highest priority: Matches the active motorcycle model
        if (activeModel !== 'all' && item.model === activeModel) {
          priorityScore = 4;
        } else if (item.model === 'Universal') {
          priorityScore = 2; // Universal parts come before other unrelated models
        } else if (activeModel === 'all') {
          priorityScore = 3;
        }

        // Additional boost if query matches starting prefix of name or code
        if (item.name.toLowerCase().startsWith(cleanQuery) || item.code.toLowerCase().startsWith(cleanQuery)) {
          priorityScore += 1;
        }

        return { item, score: priorityScore };
      })
      .filter(Boolean) as { item: Repuesto; score: number }[];

    // Sort descending by score, then by stock availability
    matches.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (b.item.isFeatured ? 1 : 0) - (a.item.isFeatured ? 1 : 0);
    });

    return matches.slice(0, 6).map((m) => m.item);
  }, [repuestos, query, activeModel]);

  // Handle keyboard navigation in suggestions dropdown
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        handleSelectItem(suggestions[selectedIndex]);
      } else if (suggestions.length > 0) {
        handleSelectItem(suggestions[0]);
      }
    }
  };

  const handleSelectItem = (repuesto: Repuesto) => {
    onSelectRepuesto(repuesto);
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(-1);
  };

  return (
    <div ref={containerRef} className="relative flex-1 max-w-xs lg:max-w-sm">
      {/* Search Input Box */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={
            activeModel !== 'all'
              ? `Buscar piezas ${activeModel}...`
              : 'Buscar pieza, código o modelo...'
          }
          className="w-full rounded-lg border border-white/10 bg-[#161921] pl-8 pr-14 py-1.5 text-xs text-white placeholder-slate-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-sans"
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {query ? (
            <button
              onClick={() => {
                setQuery('');
                setIsOpen(false);
              }}
              className="text-slate-400 hover:text-white p-0.5"
              title="Borrar texto"
            >
              <X className="h-3 w-3" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[9px] font-mono text-slate-400">
              /
            </kbd>
          )}
        </div>
      </div>

      {/* Real-time Predictive Dropdown */}
      {isOpen && query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-xl border border-white/15 bg-[#12151d] shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in-50 duration-150">
          
          {/* Header indicator */}
          <div className="flex items-center justify-between px-3 py-2 bg-[#0c0e13] border-b border-white/10 text-[10px] font-mono">
            <span className="text-slate-400 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-red-500" />
              <span>Sugerencias en tiempo real</span>
            </span>
            {activeModel !== 'all' && (
              <span className="rounded bg-red-600/15 border border-red-500/30 px-1.5 py-0.2 text-red-400 font-bold">
                Priorizando: {activeModel}
              </span>
            )}
          </div>

          {/* Results list */}
          {suggestions.length > 0 ? (
            <div className="divide-y divide-white/5 max-h-80 overflow-y-auto">
              {suggestions.map((item, idx) => {
                const isSelected = selectedIndex === idx;
                const isItemFromActiveModel = activeModel !== 'all' && item.model === activeModel;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectItem(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center gap-3 p-2.5 cursor-pointer transition-colors ${
                      isSelected ? 'bg-red-600/20 text-white' : 'hover:bg-white/5 text-slate-300'
                    }`}
                  >
                    {/* Thumbnail */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-10 w-10 rounded-md object-cover bg-black/40 border border-white/10 shrink-0"
                    />

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono">
                        <span className={`font-bold ${isItemFromActiveModel ? 'text-red-400' : 'text-slate-400'}`}>
                          {item.model}
                        </span>
                        <span className="text-slate-600">·</span>
                        <span className="text-slate-400 truncate">{item.code}</span>
                        {isItemFromActiveModel && (
                          <span className="text-[9px] text-red-500 font-semibold ml-auto hidden sm:inline">
                            ★ Modelo activo
                          </span>
                        )}
                      </div>

                      <div className="text-xs font-semibold text-white truncate leading-tight mt-0.5">
                        {item.name}
                      </div>

                      <div className="text-[10px] font-mono text-slate-400 truncate mt-0.5">
                        {item.categoryLabel}
                      </div>
                    </div>

                    {/* Price in current currency */}
                    <div className="text-right shrink-0 font-mono">
                      <div className="text-xs font-bold tabular-nums text-white">
                        {currency === 'CUP' ? (
                          <span className="text-red-400 font-bold">
                            ${item.priceCUP.toLocaleString('es-ES')}{' '}
                            <span className="text-[9px] text-slate-400">CUP</span>
                          </span>
                        ) : (
                          <span className="text-emerald-400">
                            ${item.priceUSD.toFixed(2)}{' '}
                            <span className="text-[9px] text-slate-400">USD</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] text-slate-500 block">
                        {item.stock === 'bajo_stock' ? 'Poco stock' : 'Disponible'}
                      </span>
                    </div>

                    <ChevronRight className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                  </div>
                );
              })}
            </div>
          ) : (
            /* No results inside predictive box */
            <div className="p-4 text-center text-xs font-mono text-slate-400">
              <AlertCircle className="h-5 w-5 text-amber-500 mx-auto mb-1.5 opacity-80" />
              <span>No encontramos piezas para "{query}"</span>
              <div className="mt-2 text-[11px] text-slate-500">
                Prueba buscando por "cilindro", "carburador", "cadena" o solicita una pieza por encargo.
              </div>
            </div>
          )}

          {/* Footer prompt */}
          <div className="px-3 py-1.5 bg-[#090b0f] border-t border-white/5 text-[10px] font-mono text-slate-500 flex items-center justify-between">
            <span>Usa ↑↓ para navegar, Enter para seleccionar</span>
            <span>ESC para cerrar</span>
          </div>

        </div>
      )}
    </div>
  );
};
