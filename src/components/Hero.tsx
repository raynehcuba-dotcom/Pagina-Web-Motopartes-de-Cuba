import React from 'react';
import { ArrowRight, MessageCircle, ShieldCheck, Truck, CheckCircle2, Wrench } from 'lucide-react';
import { MotorcycleModel } from '../types';
import { Logo } from './Logo';

interface HeroProps {
  onSelectModel: (model: MotorcycleModel) => void;
  onOpenWhatsAppGeneral: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onSelectModel, onOpenWhatsAppGeneral }) => {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#0a0c10] pt-8 pb-16 lg:pt-12 lg:pb-20">
      
      {/* Background Red Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-red-600/10 blur-[130px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline and Pitch */}
          <div className="lg:col-span-7 flex flex-col items-start z-10">
            
            {/* Prominent Official Brand Seal */}
            <div className="mb-5 flex items-center gap-3 bg-[#141720]/80 border border-white/10 rounded-2xl px-4 py-2.5 backdrop-blur-md shadow-xl">
              <Logo size="md" theme="dark" />
              <div className="border-l border-white/10 pl-3">
                <div className="text-[10px] font-mono font-bold tracking-widest text-red-400 uppercase">
                  Identidad Oficial Registrada
                </div>
                <div className="text-xs font-semibold text-white">
                  MIPYME · Motopartes de Cuba S.R.L
                </div>
              </div>
            </div>

            {/* Business Trust Kicker */}
            <div className="inline-flex items-center gap-2 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-mono font-medium text-red-400 mb-5">
              <ShieldCheck className="h-3.5 w-3.5 text-red-500" />
              <span>VENTA DIRECTA & DISTRIBUCIÓN NACIONAL · LA HABANA</span>
            </div>

            <h1 className="font-condensed text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white uppercase leading-[1.05] [text-wrap:balance]">
              Piezas y Repuestos <span className="bg-gradient-to-r from-red-500 to-rose-400 bg-clip-text text-transparent">de Alto Rendimiento</span> para las Motos de Cuba
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Especialistas en componentes mecánicos, eléctricos y de transmisión para <strong className="text-white font-semibold">MZ 250 / 150</strong>, <strong className="text-white font-semibold">Suzuki GN125</strong>, <strong className="text-white font-semibold">Suzuki AX100</strong> y <strong className="text-white font-semibold">Karpaty 50</strong>. Catálogo con precios transparentes en CUP y USD, con pedido directo a WhatsApp.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#catalogo"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-6 py-3.5 text-sm font-bold text-white hover:bg-red-500 active:scale-95 transition-all shadow-xl shadow-red-600/30 uppercase font-condensed tracking-wider"
              >
                <span>Ver Catálogo Completo</span>
                <ArrowRight className="h-4 w-4" />
              </a>

              <button
                onClick={onOpenWhatsAppGeneral}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-950/40 px-5 py-3.5 text-sm font-semibold text-emerald-300 hover:bg-emerald-900/40 hover:border-emerald-500/60 active:scale-95 transition-all font-mono"
              >
                <MessageCircle className="h-4 w-4 text-emerald-400" />
                <span>Atención WhatsApp</span>
              </button>
            </div>

            {/* Quick model pills jump */}
            <div className="mt-8 pt-6 border-t border-white/10 w-full">
              <span className="text-xs font-mono uppercase text-slate-400 tracking-wider block mb-3">
                Selecciona tu modelo de moto:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'MZ', label: 'MZ ETZ / TS 250' },
                  { id: 'GN125', label: 'Suzuki GN125H' },
                  { id: 'AX100', label: 'Suzuki AX100 2T' },
                  { id: 'Karpaty', label: 'Karpaty 50 (V-50)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectModel(item.id as MotorcycleModel);
                      const el = document.getElementById('catalogo');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#16191f] px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-red-500 hover:text-red-400 hover:bg-[#1f1a1d] transition-all"
                  >
                    <Wrench className="h-3 w-3 text-red-500" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: High-End Workshop Showcase Media Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-[#141720] shadow-2xl">
              
              {/* Image with subtle dark scrim */}
              <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden bg-slate-900">
                <img
                  src="/src/assets/images/hero_workshop_mechanic_1792157004650.jpg"
                  alt="Taller de motos y repuestos Motopartes de Cuba S.R.L"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] via-black/30 to-transparent" />
                
                {/* Floating pill-less overlay banner */}
                <div className="absolute bottom-4 left-4 right-4 bg-[#10131b]/90 backdrop-blur-md border border-white/15 p-3.5 rounded-xl">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                    <span className="text-red-400 font-bold uppercase flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-red-500" />
                      Almacén Central
                    </span>
                    <span>La Habana · Cuba</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Garantía mecánica de compatibilidad en cilindros, cigüeñales y encendidos.
                  </p>
                </div>
              </div>

              {/* Trust Badges Strip */}
              <div className="grid grid-cols-2 divide-x divide-white/10 border-t border-white/10 bg-[#0f1118] p-4 text-xs font-mono">
                <div className="flex items-center gap-2.5 pr-2">
                  <Truck className="h-4 w-4 text-red-400 shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-200">Envíos a Provincias</div>
                    <div className="text-[11px] text-slate-400">Vía Ómnibus y Agencias</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pl-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-200">Pago en CUP / USD</div>
                    <div className="text-[11px] text-slate-400">Transfermóvil / EnZona / Cash</div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
