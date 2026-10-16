import React from 'react';
import { Wrench, MessageCircle, Phone, MapPin, Clock, ShieldCheck } from 'lucide-react';
import { MotorcycleModel } from '../types';

interface FooterProps {
  onSelectModel: (model: MotorcycleModel) => void;
  onOpenWhatsAppGeneral: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectModel, onOpenWhatsAppGeneral }) => {
  return (
    <footer id="contacto" className="border-t border-white/10 bg-[#08090c] text-slate-400 text-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand & Description (Col 1 & 2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-500">
                <Wrench className="h-4 w-4" />
              </div>
              <div>
                <span className="font-condensed text-xl font-bold uppercase text-white tracking-wider block">
                  Motopartes de Cuba
                </span>
                <span className="text-[10px] font-mono text-amber-500 tracking-widest block -mt-1">
                  S.R.L · MIPYME CUBANA
                </span>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed max-w-sm">
              Comercializadora de piezas, repuestos y accesorios de alta durabilidad para motocicletas en Cuba. Especialistas en MZ 250/150, Suzuki GN125, Suzuki AX100 y Karpaty 50.
            </p>

            <div className="pt-2">
              <button
                onClick={onOpenWhatsAppGeneral}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2 font-mono text-xs font-semibold text-emerald-300 hover:bg-emerald-500 hover:text-black transition-all"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Atención WhatsApp Directa</span>
              </button>
            </div>
          </div>

          {/* Quick Models (Col 3) */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-white mb-3">
              Modelos de Motos
            </h4>
            <ul className="space-y-2">
              {[
                { id: 'MZ', label: 'MZ ETZ 250 / TS 250' },
                { id: 'GN125', label: 'Suzuki GN125' },
                { id: 'AX100', label: 'Suzuki AX100 2T' },
                { id: 'Karpaty', label: 'Karpaty 50 (V-50)' },
                { id: 'all', label: 'Catálogo Completo' },
              ].map((m) => (
                <li key={m.id}>
                  <button
                    onClick={() => {
                      onSelectModel(m.id as MotorcycleModel);
                      const el = document.getElementById('catalogo');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-amber-400 transition-colors"
                  >
                    {m.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links (Col 4) */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-white mb-3">
              Servicios & Envíos
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#encargo" className="hover:text-amber-400 transition-colors">
                  Piezas por Encargo Especial
                </a>
              </li>
              <li>
                <a href="#envios" className="hover:text-amber-400 transition-colors">
                  Envíos a Provincias
                </a>
              </li>
              <li>
                <a href="#envios" className="hover:text-amber-400 transition-colors">
                  Recogida en Almacén Habana
                </a>
              </li>
              <li>
                <a href="#envios" className="hover:text-amber-400 transition-colors">
                  Pago Transfermóvil / EnZona
                </a>
              </li>
            </ul>
          </div>

          {/* Contact and Location (Col 5) */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-white mb-3">
              Atención Comercial
            </h4>
            <div className="space-y-2.5 font-mono text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span>La Habana, Cuba</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Lun - Sáb: 8:30 AM - 5:30 PM</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>+53 50000000 (WhatsApp)</span>
              </div>
              <div className="pt-2 text-[11px] text-slate-500">
                Respuesta promedio en menos de 15 minutos en horario laboral.
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright and legal */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-slate-500">
          <div>
            © {new Date().getFullYear()} Motopartes de Cuba S.R.L. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-4">
            <span>Comercializadora de Repuestos y Accesorios</span>
            <span>·</span>
            <span>Hecho para Cuba</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
