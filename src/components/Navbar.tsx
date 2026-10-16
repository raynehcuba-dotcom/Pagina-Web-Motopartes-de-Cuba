import React from 'react';
import { ShoppingBag, Database } from 'lucide-react';
import { Repuesto, MotorcycleModel, Currency } from '../types';
import { NavbarSearch } from './NavbarSearch';
import { Logo } from './Logo';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  currency: Currency;
  onToggleCurrency: () => void;
  exchangeRate: number;
  repuestos: Repuesto[];
  activeModel: MotorcycleModel;
  onSelectRepuesto: (repuesto: Repuesto) => void;
  onOpenInventoryManager?: () => void;
  isDbConnected?: boolean;
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
  onOpenInventoryManager,
  isDbConnected = true,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0a0c10]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 lg:gap-8 px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Official Brand Logo */}
        <a href="#" className="flex items-center gap-3 shrink-0 group py-1" aria-label="Motopartes de Cuba Home">
          <Logo size="md" theme="dark" className="group-hover:scale-105 transition-transform" />
          <div className="hidden sm:flex flex-col border-l border-white/15 pl-2.5">
            <span className="font-condensed text-xs font-extrabold uppercase tracking-widest text-white leading-none">
              Motopartes
            </span>
            <span className="text-[9px] tracking-widest text-red-400 font-mono font-bold mt-0.5">
              S.R.L · CUBA
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
            <a href="#catalogo" className="hover:text-red-400 transition-colors whitespace-nowrap shrink-0">
              Catálogo
            </a>
            <a href="#modelos" className="hover:text-red-400 transition-colors whitespace-nowrap shrink-0">
              Modelos
            </a>
            <a href="#encargo" className="hover:text-red-400 transition-colors whitespace-nowrap shrink-0">
              Encargos
            </a>
            <a href="#envios" className="hover:text-red-400 transition-colors whitespace-nowrap shrink-0">
              Envíos & Pagos
            </a>
          </nav>
        </div>

        {/* Zone 3: Actions (Inventory DB, Currency Switcher & Cart) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Inventory Manager Live Trigger */}
          {onOpenInventoryManager && (
            <button
              onClick={onOpenInventoryManager}
              className="hidden md:flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-950/30 px-2.5 py-1.5 text-xs font-mono font-medium text-red-300 hover:bg-red-900/40 hover:border-red-500/50 transition-colors"
              title="Base de Datos Firestore en vivo. Clic para gestionar stock y precios"
            >
              <Database className="h-3.5 w-3.5 text-red-400" />
              <span className="hidden lg:inline">Inventario BD</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </button>
          )}

          {/* Currency Toggle */}
          <button
            onClick={onToggleCurrency}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#141720] px-2.5 py-1.5 text-xs font-mono font-medium text-slate-300 hover:border-red-500/40 hover:text-white transition-colors"
            title={`Tasa: 1 USD = ${exchangeRate} CUP. Clic para alternar`}
          >
            <span className="text-slate-500 hidden sm:inline">Moneda:</span>
            <span className={`px-1 py-0.5 rounded text-[11px] font-bold ${currency === 'CUP' ? 'bg-red-600 text-white' : 'text-slate-400'}`}>
              CUP
            </span>
            <span className="text-slate-600">/</span>
            <span className={`px-1 py-0.5 rounded text-[11px] font-bold ${currency === 'USD' ? 'bg-red-600 text-white' : 'text-slate-400'}`}>
              USD
            </span>
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 rounded-lg bg-red-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-red-500 active:scale-95 transition-all whitespace-nowrap shadow-lg shadow-red-600/30"
            aria-label="Ver carrito y cotizador"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Pedido</span>
            {cartCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-extrabold text-red-600 font-mono shadow">
                {cartCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
