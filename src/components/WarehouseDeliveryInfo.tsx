import React from 'react';
import { Truck, MapPin, CreditCard, ShieldCheck, Clock, CheckCircle } from 'lucide-react';

export const WarehouseDeliveryInfo: React.FC = () => {
  return (
    <section id="envios" className="border-b border-white/10 bg-[#0a0c10] py-16 scroll-mt-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-red-500 font-semibold">
            Logística y Pagos Seguros
          </span>
          <h2 className="font-condensed text-3xl sm:text-4xl font-extrabold uppercase text-white mt-1">
            Envíos en La Habana y a Todas las Provincias
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            MIPYME legalmente constituida. Flexibilidad de entrega y métodos de pago adaptados a Cuba.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Pillar 1: Recogida en Almacén */}
          <div className="rounded-xl border border-white/10 bg-[#12151c] p-6 flex flex-col justify-between">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600/10 border border-red-500/30 text-red-400 mb-4">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="font-condensed text-2xl font-bold uppercase text-white mb-2">
                1. Recogida en Almacén
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Puedes recoger tus piezas directamente en nuestro almacén central previa confirmación de pedido por WhatsApp.
              </p>
              
              <ul className="text-xs font-mono text-slate-400 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Sin costo adicional por entrega.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Inspección física de la pieza antes de pagar.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
                  <span>Lunes a Sábado: 8:30 AM – 5:30 PM.</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 text-[11px] font-mono text-slate-500">
              Ubicación: La Habana, Cuba.
            </div>
          </div>

          {/* Pillar 2: Mensajería y Envíos Nacionales */}
          <div className="rounded-xl border border-white/10 bg-[#12151c] p-6 flex flex-col justify-between">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-4">
                <Truck className="h-5 w-5" />
              </div>
              <h3 className="font-condensed text-2xl font-bold uppercase text-white mb-2">
                2. Envíos y Mensajería
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Contamos con red de mensajeros para la capital y despachos diarios coordinados para el resto de las provincias del país.
              </p>

              <ul className="text-xs font-mono text-slate-400 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Mensajería en todos los municipios de La Habana.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Envíos por Ómnibus Nacionales o agencias de carga.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Embalaje reforzado anti-golpes para cilindros y piezas delicadas.</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 text-[11px] font-mono text-slate-500">
              Cobertura de Pinar del Río a Guantánamo.
            </div>
          </div>

          {/* Pillar 3: Métodos de Pago */}
          <div className="rounded-xl border border-white/10 bg-[#12151c] p-6 flex flex-col justify-between">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 mb-4">
                <CreditCard className="h-5 w-5" />
              </div>
              <h3 className="font-condensed text-2xl font-bold uppercase text-white mb-2">
                3. Pagos Transparentes
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Aceptamos transferencias electrónicas bancarias cubanas y pagos en efectivo en la moneda que más te convenga.
              </p>

              <ul className="text-xs font-mono text-slate-400 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Transfermóvil (BPA, BANDEC, Banco Metropolitano).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>EnZona mediante código QR o número de tarjeta.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Efectivo en CUP o USD al momento de la entrega.</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 text-[11px] font-mono text-slate-500">
              Factura y comprobante de compra para cada cliente.
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
