import React from 'react';
import { Repuesto, Currency } from '../types';
import { ShoppingBag, Eye, Check, AlertCircle, Scale, Heart } from 'lucide-react';

interface ProductCardProps {
  repuesto: Repuesto;
  currency: Currency;
  onOpenDetails: (repuesto: Repuesto) => void;
  onAddToCart: (repuesto: Repuesto) => void;
  isInCart: boolean;
  onToggleCompare: (id: string) => void;
  isCompared: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  repuesto,
  currency,
  onOpenDetails,
  onAddToCart,
  isInCart,
  onToggleCompare,
  isCompared,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const isOutOfStock = repuesto.stock === 'encargo';
  const isLowStock = repuesto.stock === 'bajo_stock';

  return (
    <div className={`group relative flex flex-col justify-between rounded-xl border transition-all duration-200 overflow-hidden shadow-md hover:shadow-xl ${
      isCompared
        ? 'border-red-500 bg-[#171b24] ring-1 ring-red-500/30'
        : 'border-white/10 bg-[#14171f] hover:border-red-500/40 hover:bg-[#181c25]'
    }`}>
      
      {/* Top Media Container */}
      <div 
        onClick={() => onOpenDetails(repuesto)}
        className="relative aspect-[4/3] w-full overflow-hidden bg-[#0d0f14] cursor-pointer"
      >
        <img
          src={repuesto.image}
          alt={repuesto.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        
        {/* Subtle scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#14171f] via-transparent to-black/20" />

        {/* Code & Origin Tag */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-mono pointer-events-none">
          <span className="rounded bg-black/85 backdrop-blur-md px-2 py-0.5 text-red-400 font-bold border border-white/10 pointer-events-auto">
            {repuesto.code}
          </span>
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <span className="rounded bg-black/75 backdrop-blur-md px-2 py-0.5 text-slate-300 border border-white/10 text-[10px]">
              {repuesto.origin}
            </span>

            {/* Wishlist Heart Button */}
            {onToggleFavorite && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(repuesto.id);
                }}
                className={`flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-md border transition-all ${
                  isFavorite
                    ? 'bg-red-600/90 text-white border-red-500 shadow-md shadow-red-600/40'
                    : 'bg-black/70 text-slate-300 hover:text-red-400 hover:bg-black/90 border-white/15'
                }`}
                title={isFavorite ? 'Quitar de Favoritos' : 'Guardar en Favoritos'}
                aria-label={isFavorite ? 'Quitar de Favoritos' : 'Guardar en Favoritos'}
              >
                <Heart className={`h-3.5 w-3.5 ${isFavorite ? 'fill-white stroke-white' : 'stroke-current'}`} />
              </button>
            )}
          </div>
        </div>

        {/* Stock Alert if low or special */}
        {isLowStock && (
          <div className="absolute bottom-2.5 left-2.5 rounded bg-red-600 text-white px-2 py-0.5 text-[10px] font-mono font-bold flex items-center gap-1 shadow-md shadow-red-600/30">
            <AlertCircle className="h-3 w-3" />
            <span>ÚLTIMAS {repuesto.stockCount} UNIDADES</span>
          </div>
        )}
      </div>

      {/* Body Content */}
      <div className="flex flex-col flex-1 p-4">
        
        {/* Category & Model Line */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1.5">
          <span className="text-red-400 font-bold">{repuesto.model}</span>
          <span aria-hidden="true">·</span>
          <span className="truncate">{repuesto.categoryLabel}</span>
        </div>

        {/* Title */}
        <h3
          onClick={() => onOpenDetails(repuesto)}
          className="text-base font-semibold text-white group-hover:text-red-400 transition-colors line-clamp-2 cursor-pointer leading-snug"
          title={repuesto.name}
        >
          {repuesto.name}
        </h3>

        {/* Short Specs Snippet */}
        <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed flex-1">
          {repuesto.description}
        </p>

        {/* Bottom Price & Actions */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
          
          {/* Price display with dual currency reference */}
          <div>
            <div className="font-mono tabular-nums text-lg font-bold text-white">
              {currency === 'CUP' ? (
                <>
                  <span className="text-red-400 text-sm font-extrabold">$</span>
                  {repuesto.priceCUP.toLocaleString('es-ES')}{' '}
                  <span className="text-xs text-slate-400 font-normal">CUP</span>
                </>
              ) : (
                <>
                  <span className="text-emerald-400 text-sm font-extrabold">$</span>
                  {repuesto.priceUSD.toFixed(2)}{' '}
                  <span className="text-xs text-slate-400 font-normal">USD</span>
                </>
              )}
            </div>
            
            <div className="text-[11px] font-mono text-slate-500">
              {currency === 'CUP' 
                ? `≈ $${repuesto.priceUSD} USD` 
                : `≈ $${repuesto.priceCUP.toLocaleString('es-ES')} CUP`}
            </div>
          </div>

          {/* Action Buttons: Compare, View, Add */}
          <div className="flex items-center gap-1.5">
            {/* Compare Toggle Button */}
            <button
              onClick={() => onToggleCompare(repuesto.id)}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all ${
                isCompared
                  ? 'border-red-500 bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'border-white/10 bg-white/5 text-slate-400 hover:text-red-400 hover:border-red-500/40'
              }`}
              title={isCompared ? 'Quitar del comparador' : 'Añadir al comparador (hasta 3)'}
              aria-label="Comparar repuesto"
            >
              <Scale className="h-4 w-4" />
            </button>

            {/* View Details */}
            <button
              onClick={() => onOpenDetails(repuesto)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:border-white/30 transition-colors"
              title="Ver ficha técnica completa"
              aria-label="Ver ficha técnica"
            >
              <Eye className="h-4 w-4" />
            </button>

            {/* Add to Cart */}
            <button
              onClick={() => onAddToCart(repuesto)}
              className={`flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold font-mono uppercase transition-all ${
                isInCart
                  ? 'bg-emerald-500 text-black hover:bg-emerald-400'
                  : 'bg-red-600 text-white hover:bg-red-500 active:scale-95 shadow-md shadow-red-600/20'
              }`}
              title="Añadir al pedido WhatsApp"
            >
              {isInCart ? (
                <>
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                  <span>Listo</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Pedir</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
