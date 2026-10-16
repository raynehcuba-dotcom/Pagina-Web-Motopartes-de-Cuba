import React from 'react';
import { Repuesto, Currency } from '../types';
import { Clock, Eye, ShoppingBag, Check, Trash2, ArrowRight } from 'lucide-react';

interface RecentlyViewedProps {
  recentRepuestos: Repuesto[];
  currency: Currency;
  onOpenDetails: (repuesto: Repuesto) => void;
  onAddToCart: (repuesto: Repuesto) => void;
  onClearRecent: () => void;
  cartItemIds: Set<string>;
}

export const RecentlyViewed: React.FC<RecentlyViewedProps> = ({
  recentRepuestos,
  currency,
  onOpenDetails,
  onAddToCart,
  onClearRecent,
  cartItemIds,
}) => {
  if (recentRepuestos.length === 0) return null;

  return (
    <div className="mb-10 rounded-2xl border border-white/10 bg-[#13161e] p-5 sm:p-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-500">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-condensed text-xl font-bold uppercase tracking-wide text-white">
              Vistos Recientemente
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              Tus últimas {recentRepuestos.length} {recentRepuestos.length === 1 ? 'pieza consultada' : 'piezas consultadas'} para acceso rápido
            </span>
          </div>
        </div>

        <button
          onClick={onClearRecent}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-red-400 transition-colors"
          title="Borrar historial de visualizaciones recientes"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Limpiar historial</span>
        </button>
      </div>

      {/* Grid of up to 5 items */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {recentRepuestos.map((repuesto) => {
          const isInCart = cartItemIds.has(repuesto.id);

          return (
            <div
              key={repuesto.id}
              className="group relative flex flex-col justify-between rounded-xl border border-white/10 bg-[#0e1017] hover:border-amber-500/40 hover:bg-[#161a23] transition-all p-3"
            >
              <div>
                {/* Thumbnail Image */}
                <div
                  onClick={() => onOpenDetails(repuesto)}
                  className="relative aspect-video sm:aspect-square w-full rounded-lg overflow-hidden bg-black/50 cursor-pointer mb-2.5 border border-white/5"
                >
                  <img
                    src={repuesto.image}
                    alt={repuesto.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-1.5 left-1.5 rounded bg-black/80 px-1.5 py-0.5 text-[9px] font-mono font-bold text-amber-400 border border-white/10">
                    {repuesto.model}
                  </span>
                </div>

                {/* Title */}
                <h4
                  onClick={() => onOpenDetails(repuesto)}
                  className="text-xs font-semibold text-white group-hover:text-amber-400 transition-colors line-clamp-2 cursor-pointer leading-snug"
                  title={repuesto.name}
                >
                  {repuesto.name}
                </h4>

                <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                  Cód: {repuesto.code}
                </div>
              </div>

              {/* Bottom: Price and Quick Add */}
              <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between gap-1.5">
                <div className="font-mono tabular-nums text-xs font-bold text-white">
                  {currency === 'CUP' ? (
                    <span className="text-amber-400">
                      ${repuesto.priceCUP.toLocaleString('es-ES')}{' '}
                      <span className="text-[10px] font-normal text-slate-400">CUP</span>
                    </span>
                  ) : (
                    <span className="text-emerald-400">
                      ${repuesto.priceUSD.toFixed(2)}{' '}
                      <span className="text-[10px] font-normal text-slate-400">USD</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onOpenDetails(repuesto)}
                    className="flex h-7 w-7 items-center justify-center rounded bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                    title="Ver ficha técnica"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => onAddToCart(repuesto)}
                    className={`flex h-7 items-center gap-1 rounded px-2 text-[10px] font-mono font-bold uppercase transition-all ${
                      isInCart
                        ? 'bg-emerald-500 text-black'
                        : 'bg-amber-500 text-black hover:bg-amber-400 active:scale-95'
                    }`}
                    title="Añadir al pedido"
                  >
                    {isInCart ? (
                      <Check className="h-3 w-3 stroke-[3]" />
                    ) : (
                      <ShoppingBag className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
