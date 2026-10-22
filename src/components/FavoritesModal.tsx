import React, { useEffect } from 'react';
import { Repuesto, Currency } from '../types';
import { X, Heart, ShoppingBag, Trash2, MessageCircle, ExternalLink, ArrowRight } from 'lucide-react';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: string[];
  repuestos: Repuesto[];
  currency: Currency;
  onAddToCart: (repuesto: Repuesto) => void;
  onToggleFavorite: (id: string) => void;
  onClearFavorites: () => void;
  onOpenDetails: (repuesto: Repuesto) => void;
  cartItemIds: Set<string>;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  onClose,
  favorites,
  repuestos,
  currency,
  onAddToCart,
  onToggleFavorite,
  onClearFavorites,
  onOpenDetails,
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

  // Resolve repuesto objects for favorited IDs
  const favoriteItems = favorites
    .map((id) => repuestos.find((r) => r.id === id))
    .filter(Boolean) as Repuesto[];

  const handleWhatsAppAllFavorites = () => {
    if (favoriteItems.length === 0) return;

    const itemsText = favoriteItems
      .map(
        (it, idx) =>
          `${idx + 1}. *${it.name}* (Cód: ${it.code} · ${it.model})\n` +
          `   Precio: $${it.priceCUP.toLocaleString('es-ES')} CUP ($${it.priceUSD} USD)`
      )
      .join('\n\n');

    const text = encodeURIComponent(
      `🏍️ *LISTA DE FAVORITOS - MOTOPARTES DE CUBA S.R.L*\n\n` +
      `Hola, he guardado los siguientes repuestos en mi lista de favoritos y deseo consultar disponibilidad inmediata:\n\n` +
      `${itemsText}\n\n` +
      `¿Tienen entrega en La Habana o envíos a provincia? Gracias.`
    );

    window.open(`https://wa.me/5350000000?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-white/15 bg-[#12151e] shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-[#0a0c10] shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600/15 border border-red-500/30 text-red-500">
              <Heart className="h-5 w-5 fill-red-500" />
            </div>
            <div>
              <h2 className="font-condensed text-2xl font-bold uppercase tracking-wide text-white">
                Mis Repuestos Favoritos
              </h2>
              <span className="text-xs font-mono text-slate-400">
                {favoriteItems.length === 1
                  ? '1 repuesto guardado en este dispositivo'
                  : `${favoriteItems.length} repuestos guardados en este dispositivo`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {favoriteItems.length > 0 && (
              <button
                onClick={onClearFavorites}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-red-400 transition-colors mr-2"
                title="Vaciar toda la lista de favoritos"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Vaciar</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Cerrar favoritos"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {favoriteItems.length === 0 ? (
            <div className="py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-950/30 border border-red-500/20 text-red-500 mx-auto mb-4">
                <Heart className="h-8 w-8 stroke-1" />
              </div>
              <h3 className="font-condensed text-2xl font-bold uppercase text-white">
                Tu lista de favoritos está vacía
              </h3>
              <p className="mt-2 text-xs font-mono text-slate-400 max-w-sm mx-auto">
                Toca el ícono del corazón en cualquier repuesto del catálogo para guardarlo aquí y tener acceso rápido a tus piezas recurrentes.
              </p>
              <button
                onClick={onClose}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-mono font-bold text-white hover:bg-red-500 transition-all shadow-lg shadow-red-600/30 uppercase tracking-wide"
              >
                <span>Explorar Catálogo</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {favoriteItems.map((repuesto) => {
                const isInCart = cartItemIds.has(repuesto.id);
                return (
                  <div
                    key={repuesto.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-white/10 bg-[#161a22] hover:border-red-500/30 hover:bg-[#1a1e28] transition-all"
                  >
                    {/* Media & Info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        onClick={() => {
                          onOpenDetails(repuesto);
                          onClose();
                        }}
                        className="relative h-16 w-16 rounded-lg overflow-hidden bg-black/60 shrink-0 border border-white/10 cursor-pointer group"
                      >
                        <img
                          src={repuesto.image}
                          alt={repuesto.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mb-0.5">
                          <span className="text-red-400 font-bold">{repuesto.model}</span>
                          <span>·</span>
                          <span className="text-slate-300">{repuesto.code}</span>
                          <span>·</span>
                          <span>{repuesto.origin}</span>
                        </div>
                        <h4
                          onClick={() => {
                            onOpenDetails(repuesto);
                            onClose();
                          }}
                          className="font-semibold text-sm text-white hover:text-red-400 transition-colors truncate cursor-pointer"
                          title={repuesto.name}
                        >
                          {repuesto.name}
                        </h4>

                        <div className="font-mono text-xs font-bold text-white mt-1">
                          {currency === 'CUP' ? (
                            <span>
                              <span className="text-red-400">$</span>
                              {repuesto.priceCUP.toLocaleString('es-ES')} CUP
                            </span>
                          ) : (
                            <span>
                              <span className="text-emerald-400">$</span>
                              {repuesto.priceUSD.toFixed(2)} USD
                            </span>
                          )}
                          <span className="text-[10px] text-slate-500 font-normal ml-2">
                            {currency === 'CUP' ? `≈ $${repuesto.priceUSD} USD` : `≈ $${repuesto.priceCUP.toLocaleString('es-ES')} CUP`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {/* View details */}
                      <button
                        onClick={() => {
                          onOpenDetails(repuesto);
                          onClose();
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:border-white/25 transition-colors"
                        title="Ver detalles completos"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </button>

                      {/* Add to cart */}
                      <button
                        onClick={() => onAddToCart(repuesto)}
                        className={`flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-mono font-bold uppercase transition-all ${
                          isInCart
                            ? 'bg-emerald-500 text-black hover:bg-emerald-400'
                            : 'bg-red-600 text-white hover:bg-red-500 active:scale-95 shadow-md shadow-red-600/20'
                        }`}
                        title="Añadir al pedido"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        <span>{isInCart ? 'En Carrito' : 'Pedir'}</span>
                      </button>

                      {/* Remove from favorites */}
                      <button
                        onClick={() => onToggleFavorite(repuesto.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/20 bg-red-950/20 text-red-400 hover:bg-red-900/40 hover:text-red-200 transition-colors"
                        title="Quitar de favoritos"
                        aria-label="Quitar de favoritos"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer CTAs */}
        {favoriteItems.length > 0 && (
          <div className="border-t border-white/10 bg-[#0a0c10] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <button
              onClick={handleWhatsAppAllFavorites}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 px-4 text-xs font-mono font-bold text-black hover:bg-emerald-400 active:scale-95 transition-all shadow-md shadow-emerald-500/20 uppercase"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Consultar todos por WhatsApp</span>
            </button>

            <button
              onClick={() => {
                favoriteItems.forEach((it) => {
                  if (!cartItemIds.has(it.id)) {
                    onAddToCart(it);
                  }
                });
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-red-500/40 bg-red-950/30 py-2.5 px-4 text-xs font-mono font-bold text-red-300 hover:bg-red-900/40 hover:text-white transition-all uppercase"
            >
              <ShoppingBag className="h-4 w-4 text-red-400" />
              <span>Agregar todos al carrito</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
