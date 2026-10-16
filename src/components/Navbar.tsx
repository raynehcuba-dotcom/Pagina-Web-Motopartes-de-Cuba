import React from 'react';
import { ShoppingBag, Wrench } from 'lucide-react';
import { Repuesto, MotorcycleModel, Currency } from '../types';
import { NavbarSearch } from './NavbarSearch';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  currency: Currency;
  onToggleCurrency: () => void;
  exchangeRate: number;
  repuestos: Repuesto[];
  activeModel: MotorcycleModel;
  onSelectRepuesto: (repuesto: Repuesto) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  currency,
  onToggleCurrency,
  exchangeRate,
  repuestos,
  activeModel,
  onSelectRepuesto,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0c0e12]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 lg:gap-8 px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Wordmark Brand */}
        <a href="#" className="flex items-center gap-2.5 shrink-0 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-500 group-hover:bg-amber-500 group-hover:text-black transition-colors">
            <Wrench className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-condensed text-xl font-bold tracking-wider text-white uppercase whitespace-nowrap">
              Motopartes de Cuba
            </span>
            <span className="text-[10px] tracking-widest text-amber-400 font-mono -mt-1 hidden sm:block">
              S.R.L · REPUESTOS DE MOTOS
            </span>
          </div>
        </a>

        {/* Zone 2: Real-time Predictive Search & Nav Links */}
        <div className="flex-1 flex items-center justify-center gap-6 max-w-2xl">
          {/* Predictive Search Bar with Active Model Priority */}
          <NavbarSearch
            repuestos={repuestos}
            activeModel={activeModel}
            currency={currency}
            onSelectRepuesto={onSelectRepuesto}
          />

          {/* Quick Nav Links on desktop */}
          <nav className="hidden xl:flex items-center gap-5 text-xs font-medium text-slate-300">
            <a href="#catalogo" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">
              Catálogo
            </a>
            <a href="#modelos" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">
              Modelos
            </a>
            <a href="#encargo" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">
              Encargos
            </a>
            <a href="#envios" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">
              Envíos & Pagos
            </a>
          </nav>
        </div>

        {/* Zone 3: Actions (Currency Switcher & Cart) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Currency Toggle */}
          <button
            onClick={onToggleCurrency}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#16191f] px-2.5 py-1.5 text-xs font-mono font-medium text-slate-300 hover:border-amber-500/40 hover:text-white transition-colors"
            title={`Tasa: 1 USD = ${exchangeRate} CUP. Clic para alternar`}
          >
            <span className="text-slate-500 hidden sm:inline">Moneda:</span>
            <span className={`px-1 py-0.5 rounded text-[11px] font-bold ${currency === 'CUP' ? 'bg-amber-500 text-black' : 'text-slate-400'}`}>
              CUP
            </span>
            <span className="text-slate-600">/</span>
            <span className={`px-1 py-0.5 rounded text-[11px] font-bold ${currency === 'USD' ? 'bg-amber-500 text-black' : 'text-slate-400'}`}>
              USD
            </span>
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-black hover:bg-amber-400 active:scale-95 transition-all whitespace-nowrap shadow-lg shadow-amber-500/20"
            aria-label="Ver carrito y cotizador"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Pedido</span>
            {cartCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-[11px] font-bold text-amber-400 font-mono">
                {cartCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
