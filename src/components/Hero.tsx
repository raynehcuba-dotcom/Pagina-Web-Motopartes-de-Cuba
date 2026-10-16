import React from 'react';
import { ArrowRight, MessageCircle, ShieldCheck, Truck, Wrench, CheckCircle2 } from 'lucide-react';
import { MotorcycleModel } from '../types';

interface HeroProps {
  onSelectModel: (model: MotorcycleModel) => void;
  onOpenWhatsAppGeneral: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onSelectModel, onOpenWhatsAppGeneral }) => {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#0c0e12] pt-8 pb-16 lg:pt-14 lg:pb-20">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-amber-500/5 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline and Pitch */}
          <div className="lg:col-span-7 flex flex-col items-start z-10">
            
            {/* Business Trust Kicker */}
            <div className="inline-flex items-center gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-mono font-medium text-amber-400 mb-5">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
              <span>MIPYME REGISTRADA · ALMACÉN EN LA HABANA</span>
            </div>

            <h1 className="font-condensed text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white uppercase leading-[1.05] [text-wrap:balance]">
              Piezas y Repuestos <span className="text-amber-500">de Precisión</span> para las Motos de Cuba
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Especialistas en componentes mecánicos, eléctricos y de transmisión para <strong className="text-white font-semibold">MZ 250 / 150</strong>, <strong className="text-white font-semibold">Suzuki GN125</strong>, <strong className="text-white font-semibold">Suzuki AX100</strong> y <strong className="text-white font-semibold">Karpaty 50</strong>. Catálogo con precios transparentes en CUP y USD, con pedido directo a WhatsApp.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#catalogo"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-6 py-3.5 text-sm font-bold text-black hover:bg-amber-400 active:scale-95 transition-all shadow-lg shadow-amber-500/25 uppercase font-condensed tracking-wider"
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
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#16191f] px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-amber-500 hover:text-amber-400 hover:bg-[#1d222b] transition-all"
                  >
                    <Wrench className="h-3 w-3 text-amber-500" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: High-End Workshop Showcase Media Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-[#16191f] shadow-2xl">
              
              {/* Image with subtle dark scrim */}
              <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden bg-slate-900">
                <img
                  src="/src/assets/images/hero_workshop_mechanic_1792157004650.jpg"
                  alt="Taller de motos y repuestos Motopartes de Cuba S.R.L"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e12] via-black/30 to-transparent" />
                
                {/* Floating pill-less overlay banner */}
                <div className="absolute bottom-4 left-4 right-4 bg-[#12151c]/90 backdrop-blur-md border border-white/15 p-3.5 rounded-xl">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                    <span className="text-amber-400 font-semibold uppercase">Almacén Central</span>
                    <span>La Habana · Cuba</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Garantía mecánica de compatibilidad en cilindros, cigüeñales y encendidos.
                  </p>
                </div>
              </div>

              {/* Trust Badges Strip */}
              <div className="grid grid-cols-2 divide-x divide-white/10 border-t border-white/10 bg-[#11141a] p-4 text-xs font-mono">
                <div className="flex items-center gap-2.5 pr-2">
                  <Truck className="h-4 w-4 text-amber-400 shrink-0" />
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
