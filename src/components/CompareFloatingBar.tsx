import React from 'react';
import { Repuesto } from '../types';
import { Scale, X, ArrowRight, Trash2 } from 'lucide-react';

interface CompareFloatingBarProps {
  comparedRepuestos: Repuesto[];
  onOpenModal: () => void;
  onRemoveItem: (id: string) => void;
  onClear: () => void;
}

export const CompareFloatingBar: React.FC<CompareFloatingBarProps> = ({
  comparedRepuestos,
  onOpenModal,
  onRemoveItem,
  onClear,
}) => {
  if (comparedRepuestos.length === 0) return null;

  return (
    <aside aria-label="Barra de comparación de repuestos" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-2xl animate-in slide-in-from-bottom-6 duration-300">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-red-500/40 bg-[#12151e]/95 backdrop-blur-xl p-3 sm:px-4 sm:py-2.5 shadow-2xl shadow-black/80">
        
        {/* Left: Counter & Thumbnails */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-600 text-white font-bold">
              <Scale className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Comparador ({comparedRepuestos.length}/3)
              </div>
              <div className="text-[10px] font-mono text-slate-400 hidden sm:block">
                {comparedRepuestos.length === 1 ? 'Elige otra pieza para comparar' : 'Listo para contrastar'}
              </div>
            </div>
          </div>

          {/* Thumbnails with X to remove */}
          <div className="flex items-center gap-1.5">
            {comparedRepuestos.map((item) => (
              <div
                key={item.id}
                className="group/thumb relative h-9 w-9 rounded-lg overflow-hidden bg-black/60 border border-white/20 shrink-0"
                title={`${item.name} (${item.code})`}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity text-red-400"
                  title="Quitar"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={onClear}
            className="text-[11px] font-mono text-slate-400 hover:text-red-400 px-2 py-1 transition-colors"
            title="Quitar todas las piezas seleccionadas"
          >
            Limpiar
          </button>

          <button
            onClick={onOpenModal}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-mono font-bold text-white hover:bg-red-500 active:scale-95 transition-all shadow-md shadow-red-600/30 uppercase tracking-wide whitespace-nowrap"
          >
            <span>Comparar ({comparedRepuestos.length})</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>
    </aside>
  );
};
