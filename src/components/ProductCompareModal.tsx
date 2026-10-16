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
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-[#0d0f14] shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-500">
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
              <button
                onClick={onClose}
                className="mt-6 rounded-lg bg-amber-500 px-5 py-2.5 text-xs font-mono font-bold text-black hover:bg-amber-400 transition-colors"
              >
                Explorar Catálogo
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left font-sans text-xs">
                <thead>
                  <tr>
                    {/* Fixed row label column */}
                    <th className="w-48 p-3 text-[11px] font-mono uppercase tracking-wider text-slate-500 bg-[#0e1017] border border-white/10 rounded-tl-xl align-top">
                      Criterio Técnico
                    </th>

                    {/* Columns for each compared item */}
                    {comparedRepuestos.map((item) => (
                      <th
                        key={item.id}
                        className="p-3 bg-[#151922] border border-white/10 align-top min-w-[220px] max-w-[280px]"
                      >
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <span className="rounded bg-black/60 px-2 py-0.5 text-[10px] font-mono text-amber-400 border border-white/10">
                            {item.model}
                          </span>
                          <button
                            onClick={() => onRemoveCompareItem(item.id)}
                            className="text-slate-400 hover:text-red-400 p-0.5 rounded transition-colors"
                            title="Quitar de la comparación"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Image */}
                        <div className="aspect-[4/3] w-full rounded-lg overflow-hidden bg-black/40 border border-white/10 mb-2.5">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        <h4 className="font-bold text-white text-xs line-clamp-2 leading-snug">
                          {item.name}
                        </h4>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                          Cód: {item.code}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/10 font-mono">
                  {/* Row: Price */}
                  <tr className="bg-[#12151e]">
                    <td className="p-3 font-semibold text-slate-400 border border-white/10 bg-[#0e1017]">
                      Precio en CUP
                    </td>
                    {comparedRepuestos.map((item) => (
                      <td key={item.id} className="p-3 font-bold text-base text-amber-400 tabular-nums border border-white/10">
                        ${item.priceCUP.toLocaleString('es-ES')} CUP
                      </td>
                    ))}
                  </tr>

                  {/* Row: Price in USD */}
                  <tr className="bg-[#12151e]">
                    <td className="p-3 font-semibold text-slate-400 border border-white/10 bg-[#0e1017]">
                      Precio en USD
                    </td>
                    {comparedRepuestos.map((item) => (
                      <td key={item.id} className="p-3 font-bold text-sm text-emerald-400 tabular-nums border border-white/10">
                        ${item.priceUSD.toFixed(2)} USD
                      </td>
                    ))}
                  </tr>

                  {/* Row: Model & Subtype */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-400 border border-white/10 bg-[#0e1017]">
                      Modelo Asignado
                    </td>
                    {comparedRepuestos.map((item) => (
                      <td key={item.id} className="p-3 text-white border border-white/10">
                        <div className="font-bold text-amber-400">{item.model}</div>
                        <div className="text-[11px] text-slate-400 font-sans">{item.modelLabel}</div>
                      </td>
                    ))}
                  </tr>

                  {/* Row: Category */}
                  <tr className="bg-[#10131b]">
                    <td className="p-3 font-semibold text-slate-400 border border-white/10 bg-[#0e1017]">
                      Categoría
                    </td>
                    {comparedRepuestos.map((item) => (
                      <td key={item.id} className="p-3 text-slate-200 border border-white/10">
                        {item.categoryLabel}
                      </td>
                    ))}
                  </tr>

                  {/* Row: Stock */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-400 border border-white/10 bg-[#0e1017]">
                      Disponibilidad
                    </td>
                    {comparedRepuestos.map((item) => (
                      <td key={item.id} className="p-3 border border-white/10">
                        <span
                          className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold ${
                            item.stock === 'disponible'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          <span>
                            {item.stock === 'disponible' ? `En Stock (${item.stockCount} un.)` : `Poco stock (${item.stockCount} un.)`}
                          </span>
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Row: Origin & Manufacturer */}
                  <tr className="bg-[#10131b]">
                    <td className="p-3 font-semibold text-slate-400 border border-white/10 bg-[#0e1017]">
                      Procedencia
                    </td>
                    {comparedRepuestos.map((item) => (
                      <td key={item.id} className="p-3 text-slate-300 border border-white/10">
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                          <span>{item.origin}</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Row: Compatibility Matrix */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-400 border border-white/10 bg-[#0e1017]">
                      Compatibilidad
                    </td>
                    {comparedRepuestos.map((item) => (
                      <td key={item.id} className="p-3 border border-white/10">
                        <div className="flex flex-wrap gap-1">
                          {item.compatibility.map((c, i) => (
                            <span key={i} className="rounded bg-black/40 px-1.5 py-0.5 text-[10px] text-slate-300 border border-white/5">
                              {c}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Dynamic Technical Specs Rows */}
                  {allSpecKeys.map((specKey) => (
                    <tr key={specKey} className="hover:bg-white/5">
                      <td className="p-3 font-semibold text-slate-400 border border-white/10 bg-[#0e1017]">
                        {specKey}
                      </td>
                      {comparedRepuestos.map((item) => {
                        const val = item.specs?.[specKey];
                        return (
                          <td key={item.id} className="p-3 text-slate-200 border border-white/10">
                            {val ? (
                              <span className="font-semibold text-white">{val}</span>
                            ) : (
                              <span className="text-slate-600 font-normal">N/A</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* Bottom Row: Direct Cart Actions */}
                  <tr className="bg-[#0e1017]">
                    <td className="p-3 font-semibold text-slate-400 border border-white/10">
                      Acción
                    </td>
                    {comparedRepuestos.map((item) => {
                      const isInCart = cartItemIds.has(item.id);
                      return (
                        <td key={item.id} className="p-3 border border-white/10">
                          <button
                            onClick={() => onAddToCart(item)}
                            className={`w-full flex items-center justify-center gap-2 rounded-lg py-2.5 px-3 text-xs font-bold uppercase transition-all ${
                              isInCart
                                ? 'bg-emerald-500 text-black'
                                : 'bg-amber-500 text-black hover:bg-amber-400 active:scale-95'
                            }`}
                          >
                            {isInCart ? (
                              <>
                                <Check className="h-4 w-4 stroke-[3]" />
                                <span>En tu Pedido</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="h-4 w-4" />
                                <span>Añadir al Pedido</span>
                              </>
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 bg-[#0d0f14] px-6 py-3.5 flex items-center justify-between text-xs font-mono text-slate-400 shrink-0">
          <span>* Todas las piezas cuentan con garantía de compatibilidad física y encaje.</span>
          <button
            onClick={onClose}
            className="rounded-lg bg-white/10 px-4 py-1.5 text-white hover:bg-white/20 transition-colors"
          >
            Cerrar Comparador
          </button>
        </div>

      </div>

    </div>
  );
};
