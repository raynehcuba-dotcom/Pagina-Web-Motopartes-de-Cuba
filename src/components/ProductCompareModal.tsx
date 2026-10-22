import React, { useEffect } from 'react';
import { Repuesto, Currency } from '../types';
import { X, Scale, ShoppingBag, Check, CheckCircle2, ShieldCheck, ArrowRight, Trash2 } from 'lucide-react';

interface ProductCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparedRepuestos: Repuesto[];
  currency: Currency;
  onAddToCart: (repuesto: Repuesto) => void;
  onRemoveCompareItem: (id: string) => void;
  onClearCompare: () => void;
  cartItemIds: Set<string>;
}

export const ProductCompareModal: React.FC<ProductCompareModalProps> = ({
  isOpen,
  onClose,
  comparedRepuestos,
  currency,
  onAddToCart,
  onRemoveCompareItem,
  onClearCompare,
  cartItemIds,
}) => {
  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Extract all unique spec keys across all compared items
  const allSpecKeys = Array.from(
    new Set(comparedRepuestos.flatMap((r) => Object.keys(r.specs || {})))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative z-10 w-full max-w-5xl rounded-2xl border border-white/15 bg-[#12151d] shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-[#0a0c10] shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600/15 border border-red-500/30 text-red-500">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-condensed text-2xl font-bold uppercase tracking-wide text-white">
                Comparador de Repuestos y Especificaciones
              </h2>
              <span className="text-xs font-mono text-slate-400">
                Comparando {comparedRepuestos.length} de 3 piezas permitidas
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {comparedRepuestos.length > 0 && (
              <button
                onClick={onClearCompare}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-red-400 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Limpiar comparación</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Cerrar comparador"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {comparedRepuestos.length === 0 ? (
            <div className="py-16 text-center">
              <Scale className="h-12 w-12 text-slate-600 mx-auto mb-3 stroke-1" />
              <h3 className="font-condensed text-2xl font-bold uppercase text-white">
                No hay piezas seleccionadas para comparar
              </h3>
              <p className="mt-2 text-xs font-mono text-slate-400 max-w-md mx-auto">
                Selecciona hasta 3 repuestos del catálogo usando el botón "Comparar" en cada tarjeta para contrastar medidas, compatibilidad y precios.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto pb-4">
              <table className="w-full text-left border-collapse min-w-[620px]">
                
                {/* Table Header: Repuesto Cards / Photos */}
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="p-3 w-40 text-xs font-mono uppercase text-slate-400 bg-[#0d0f14]/60 sticky left-0 z-20 backdrop-blur-md">
                      Característica
                    </th>
                    {comparedRepuestos.map((item) => {
                      const isInCart = cartItemIds.has(item.id);
                      return (
                        <th key={item.id} className="p-3 w-64 align-top">
                          <div className="flex flex-col rounded-xl border border-white/10 bg-[#161a23] p-3 h-full justify-between">
                            
                            <div>
                              {/* Remove button */}
                              <div className="flex justify-end mb-2">
                                <button
                                  onClick={() => onRemoveCompareItem(item.id)}
                                  className="text-[11px] font-mono text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors"
                                  title="Quitar de la comparación"
                                >
                                  <X className="h-3 w-3" />
                                  <span>Quitar</span>
                                </button>
                              </div>

                              {/* Photo */}
                              <div className="aspect-[4/3] w-full rounded-lg overflow-hidden bg-black/40 border border-white/10 mb-2.5">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-full w-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </div>

                              {/* Code & Model */}
                              <div className="flex items-center gap-1.5 text-[10px] font-mono mb-1">
                                <span className="text-red-400 font-bold">{item.model}</span>
                                <span>·</span>
                                <span className="text-slate-400">{item.code}</span>
                              </div>

                              {/* Name */}
                              <h4 className="font-semibold text-white text-xs leading-snug line-clamp-2" title={item.name}>
                                {item.name}
                              </h4>
                            </div>

                            {/* Price & Add to Cart button */}
                            <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-col gap-2">
                              <div className="font-mono text-base font-bold text-white tabular-nums">
                                {currency === 'CUP' ? (
                                  <>
                                    <span className="text-red-400 text-sm">$</span>
                                    {item.priceCUP.toLocaleString('es-ES')}{' '}
                                    <span className="text-[10px] text-slate-400 font-normal">CUP</span>
                                  </>
                                ) : (
                                  <>
                                    <span className="text-emerald-400 text-sm">$</span>
                                    {item.priceUSD.toFixed(2)}{' '}
                                    <span className="text-[10px] text-slate-400 font-normal">USD</span>
                                  </>
                                )}
                              </div>

                              <button
                                onClick={() => onAddToCart(item)}
                                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 px-3 text-xs font-mono font-bold uppercase transition-all ${
                                  isInCart
                                    ? 'bg-emerald-500 text-black hover:bg-emerald-400'
                                    : 'bg-red-600 text-white hover:bg-red-500 shadow-md shadow-red-600/30'
                                }`}
                              >
                                {isInCart ? (
                                  <>
                                    <Check className="h-3 w-3 stroke-[3]" />
                                    <span>En Pedido</span>
                                  </>
                                ) : (
                                  <>
                                    <ShoppingBag className="h-3 w-3" />
                                    <span>Pedir</span>
                                  </>
                                )}
                              </button>
                            </div>

                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                {/* Table Body: Detailed Specs Comparison */}
                <tbody className="divide-y divide-white/5 font-mono text-xs">
                  
                  {/* Category */}
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-3 text-slate-400 font-semibold bg-[#0d0f14]/60 sticky left-0 backdrop-blur-md">
                      Categoría
                    </td>
                    {comparedRepuestos.map((item) => (
                      <td key={item.id} className="p-3 text-slate-200">
                        {item.categoryLabel}
                      </td>
                    ))}
                  </tr>

                  {/* Stock Status */}
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-3 text-slate-400 font-semibold bg-[#0d0f14]/60 sticky left-0 backdrop-blur-md">
                      Disponibilidad
                    </td>
                    {comparedRepuestos.map((item) => (
                      <td key={item.id} className="p-3">
                        {item.stock === 'disponible' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Disponible ({item.stockCount} uds)
                          </span>
                        ) : item.stock === 'bajo_stock' ? (
                          <span className="inline-flex items-center gap-1 text-red-400 font-bold">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                            Últimas {item.stockCount} uds
                          </span>
                        ) : (
                          <span className="text-slate-400">Por encargo</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Origin */}
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-3 text-slate-400 font-semibold bg-[#0d0f14]/60 sticky left-0 backdrop-blur-md">
                      Procedencia
                    </td>
                    {comparedRepuestos.map((item) => (
                      <td key={item.id} className="p-3 text-slate-300">
                        {item.origin}
                      </td>
                    ))}
                  </tr>

                  {/* Dynamic Technical Specs */}
                  {allSpecKeys.map((specKey) => (
                    <tr key={specKey} className="hover:bg-white/[0.02]">
                      <td className="p-3 text-slate-400 font-semibold bg-[#0d0f14]/60 sticky left-0 backdrop-blur-md">
                        {specKey}
                      </td>
                      {comparedRepuestos.map((item) => {
                        const val = item.specs?.[specKey];
                        return (
                          <td key={item.id} className="p-3 text-white font-medium">
                            {val ? (
                              <span className="tabular-nums">{val}</span>
                            ) : (
                              <span className="text-slate-600 italic">No aplica</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* Compatibility */}
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-3 text-slate-400 font-semibold bg-[#0d0f14]/60 sticky left-0 backdrop-blur-md">
                      Motos Compatibles
                    </td>
                    {comparedRepuestos.map((item) => (
                      <td key={item.id} className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {item.compatibility.map((comp, idx) => (
                            <span
                              key={idx}
                              className="rounded bg-white/5 border border-white/10 px-1.5 py-0.5 text-[10px] text-slate-300"
                            >
                              {comp}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 bg-[#0a0c10] px-6 py-3.5 flex items-center justify-between text-xs font-mono text-slate-400 shrink-0">
          <div>
            * Precios y stock sincronizados en vivo desde Firestore.
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-white/10 px-4 py-1.5 text-white hover:bg-white/20 transition-colors font-semibold"
          >
            Volver al Catálogo
          </button>
        </div>

      </div>
    </div>
  );
};
