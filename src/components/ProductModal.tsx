import React, { useState, useEffect } from 'react';
import { Repuesto, Currency } from '../types';
import { X, ShoppingBag, MessageCircle, Check, Wrench, ShieldCheck, CheckCircle2, Scale } from 'lucide-react';

interface ProductModalProps {
  repuesto: Repuesto | null;
  onClose: () => void;
  currency: Currency;
  onAddToCart: (repuesto: Repuesto, quantity: number) => void;
  isInCart: boolean;
  onToggleCompare?: (id: string) => void;
  isCompared?: boolean;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  repuesto,
  onClose,
  currency,
  onAddToCart,
  isInCart,
  onToggleCompare,
  isCompared,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    setQuantity(1);
    setJustAdded(false);
  }, [repuesto]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!repuesto) return null;

  const handleAdd = () => {
    onAddToCart(repuesto, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleDirectWhatsApp = () => {
    const text = encodeURIComponent(
      `🏍️ *CONSULTA DE REPUESTO - MOTOPARTES DE CUBA S.R.L*\n\n` +
      `Hola, me interesa consultar disponibilidad inmediata para:\n` +
      `• *Pieza:* ${repuesto.name}\n` +
      `• *Código:* ${repuesto.code}\n` +
      `• *Modelo:* ${repuesto.modelLabel}\n` +
      `• *Precio:* $${repuesto.priceCUP.toLocaleString('es-ES')} CUP / $${repuesto.priceUSD} USD\n` +
      `• *Procedencia:* ${repuesto.origin}\n\n` +
      `¿Tienen entrega en La Habana o envíos a provincia? Gracias.`
    );
    window.open(`https://wa.me/5350000000?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-3xl rounded-2xl border border-white/15 bg-[#12151c] shadow-2xl overflow-hidden my-8">
        
        {/* Header Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-slate-400 hover:text-white hover:bg-black/90 border border-white/10 transition-colors"
          aria-label="Cerrar ventana"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Column: Image & Origin */}
          <div className="relative flex flex-col justify-between bg-[#0b0d12] p-6 border-b md:border-b-0 md:border-r border-white/10">
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#161a22] border border-white/10">
              <img
                src={repuesto.image}
                alt={repuesto.name}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded text-xs font-mono font-bold text-amber-400 border border-white/10">
                {repuesto.code}
              </div>
            </div>

            {/* Quality & Origin Notice */}
            <div className="mt-4 rounded-xl border border-white/10 bg-[#161a22] p-3 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-2 text-amber-400 font-semibold mb-1">
                <ShieldCheck className="h-4 w-4" />
                <span>Control de Calidad Motopartes</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Procedencia: <strong className="text-white">{repuesto.origin}</strong>. Todas las piezas son inspeccionadas físicamente antes de entrega para asegurar tolerancias exactas.
              </p>
            </div>
          </div>

          {/* Right Column: Information, Specs, Compatibility and Order Actions */}
          <div className="flex flex-col justify-between p-6 overflow-y-auto max-h-[80vh] md:max-h-none">
            <div>
              {/* Category & Model */}
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-2">
                <span className="text-amber-400 font-semibold uppercase">{repuesto.model}</span>
                <span>·</span>
                <span>{repuesto.categoryLabel}</span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                {repuesto.name}
              </h2>

              {/* Price Block */}
              <div className="mt-3 p-3 rounded-xl border border-white/10 bg-[#171a23] flex items-baseline justify-between">
                <div>
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Precio Unitario</div>
                  <div className="font-mono tabular-nums text-2xl font-extrabold text-white">
                    {currency === 'CUP' ? (
                      <>
                        <span className="text-amber-400 text-lg">$</span>
                        {repuesto.priceCUP.toLocaleString('es-ES')}{' '}
                        <span className="text-xs text-slate-400 font-normal">CUP</span>
                      </>
                    ) : (
                      <>
                        <span className="text-emerald-400 text-lg">$</span>
                        {repuesto.priceUSD.toFixed(2)}{' '}
                        <span className="text-xs text-slate-400 font-normal">USD</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-right text-xs font-mono text-slate-400">
                  <div>Equivalente:</div>
                  <div className="text-amber-400 font-semibold">
                    {currency === 'CUP' 
                      ? `$${repuesto.priceUSD} USD` 
                      : `$${repuesto.priceCUP.toLocaleString('es-ES')} CUP`}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {repuesto.description}
              </p>

              {/* Specs Table */}
              <div className="mt-4">
                <h4 className="text-xs font-mono font-semibold uppercase text-slate-400 tracking-wider mb-2">
                  Especificaciones Técnicas
                </h4>
                <div className="rounded-lg border border-white/10 bg-[#0d0f14] divide-y divide-white/5 text-xs font-mono">
                  {Object.entries(repuesto.specs).map(([key, val]) => (
                    <div key={key} className="flex justify-between p-2">
                      <span className="text-slate-400">{key}:</span>
                      <span className="font-semibold text-slate-200 tabular-nums">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compatibility List */}
              <div className="mt-4">
                <h4 className="text-xs font-mono font-semibold uppercase text-slate-400 tracking-wider mb-2">
                  Compatibilidad Verificada
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {repuesto.compatibility.map((m, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 rounded bg-white/5 border border-white/10 px-2 py-0.5 text-xs font-mono text-slate-300"
                    >
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                      <span>{m}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 pt-4 border-t border-white/10">
              
              {/* Quantity Stepper */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-slate-400">Cantidad:</span>
                <div className="flex items-center rounded-lg border border-white/15 bg-[#171a23] p-1 font-mono">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-7 w-7 items-center justify-center rounded text-slate-300 hover:bg-white/10 active:scale-95"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-white tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="flex h-7 w-7 items-center justify-center rounded text-slate-300 hover:bg-white/10 active:scale-95"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <button
                    onClick={handleAdd}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-mono font-bold uppercase transition-all shadow-lg ${
                      justAdded || isInCart
                        ? 'bg-emerald-500 text-black hover:bg-emerald-400'
                        : 'bg-amber-500 text-black hover:bg-amber-400 active:scale-95'
                    }`}
                  >
                    {justAdded ? (
                      <>
                        <Check className="h-4 w-4 stroke-[3]" />
                        <span>¡Añadido al pedido!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-4 w-4" />
                        <span>{isInCart ? 'Actualizar Pedido' : 'Añadir al Carrito'}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDirectWhatsApp}
                    className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/40 px-4 py-3 text-xs font-mono font-semibold text-emerald-300 hover:bg-emerald-900/40 hover:border-emerald-500/60 active:scale-95 transition-all"
                  >
                    <MessageCircle className="h-4 w-4 text-emerald-400" />
                    <span>Consultar WhatsApp</span>
                  </button>
                </div>

                {onToggleCompare && (
                  <button
                    type="button"
                    onClick={() => onToggleCompare(repuesto.id)}
                    className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-mono font-medium border transition-colors ${
                      isCompared
                        ? 'border-amber-500 bg-amber-500/20 text-amber-400'
                        : 'border-white/10 bg-white/5 text-slate-300 hover:text-white hover:border-amber-500/40'
                    }`}
                  >
                    <Scale className="h-4 w-4" />
                    <span>{isCompared ? 'Pieza agregada al comparador (Clic para quitar)' : 'Comparar especificaciones con otras piezas (Hasta 3)'}</span>
                  </button>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
