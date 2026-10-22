import React, { useState } from 'react';
import { Send, Wrench, MessageSquare, Sparkles, CheckCircle2 } from 'lucide-react';

export const CustomOrderSection: React.FC = () => {
  const [model, setModel] = useState('MZ 250');
  const [partName, setPartName] = useState('');
  const [yearOrDetails, setYearOrDetails] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const text = encodeURIComponent(
      `🔧 *SOLICITUD DE PIEZA POR ENCARGO - MOTOPARTES DE CUBA S.R.L*\n\n` +
      `Hola equipo de Motopartes, busco una pieza especial que no encontré en el catálogo:\n` +
      `• *Modelo de Moto:* ${model}\n` +
      `• *Pieza Solicitada:* ${partName}\n` +
      `• *Detalles / Medidas / Año:* ${yearOrDetails || 'No especificado'}\n` +
      `• *Teléfono de Contacto:* ${phone || 'Mismo número de WhatsApp'}\n\n` +
      `¿Podrían verificar si pueden traerla por encargo o si la tienen por entrar al almacén? Gracias.`
    );

    window.open(`https://wa.me/5350000000?text=${text}`, '_blank');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="encargo" className="border-b border-white/10 bg-[#0d0f15] py-16 scroll-mt-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#151922] to-[#10131a] p-8 lg:p-12 shadow-2xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 rounded-md border border-red-500/30 bg-red-950/20 px-3 py-1 text-xs font-mono font-medium text-red-400 mb-4">
                <Sparkles className="h-3.5 w-3.5" />
                <span>SERVICIO ESPECIALIZADO DE IMPORTACIÓN</span>
              </div>

              <h2 className="font-condensed text-3xl sm:text-4xl font-extrabold uppercase text-white tracking-tight">
                ¿Buscas una pieza difícil de encontrar?
              </h2>

              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                Sabemos que en Cuba mantener un <strong className="text-white">MZ</strong>, <strong className="text-white">Karpaty</strong>, <strong className="text-white">GN</strong> o <strong className="text-white">AX</strong> requiere piezas a veces escasas. Si necesitas una medida especial de pistón, juego de piñones o adaptaciones electrónicas, te la gestionamos directamente con nuestros proveedores en el exterior.
              </p>

              {/* Guarantees */}
              <div className="mt-6 space-y-2.5 text-xs font-mono text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Asesoría mecánica sobre compatibilidad antes de encargar</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Plazo de importación estimado y seguimiento continuo</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Pago flexible con anticipo acordado en CUP o USD</span>
                </div>
              </div>
            </div>

            {/* Right Form */}
            <div className="lg:col-span-6">
              <form
                onSubmit={handleSubmit}
                className="rounded-xl border border-white/10 bg-[#0c0e13] p-6 shadow-inner space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-white uppercase">
                    <Wrench className="h-4 w-4 text-red-500" />
                    <span>Formulario de Pedido Especial</span>
                  </div>
                  <span className="text-[10px] font-mono text-red-400">Respuesta por WhatsApp</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Modelo de tu moto *
                    </label>
                    <select
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-[#151921] px-3 py-2 text-xs text-white focus:border-red-500 focus:outline-none font-mono"
                    >
                      <option value="MZ ETZ 250 / TS 250">MZ 250 (ETZ / TS)</option>
                      <option value="MZ ETZ 150 / TS 150">MZ 150 (ETZ / TS)</option>
                      <option value="Suzuki GN125H / GN125F">Suzuki GN125</option>
                      <option value="Suzuki AX100 2 Tiempos">Suzuki AX100</option>
                      <option value="Karpaty 50 (V-50/V-50M)">Karpaty 50 / Delta</option>
                      <option value="Jawa 350 / CZ">Jawa 350 / CZ</option>
                      <option value="Otra moto clásica o moderna">Otro modelo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Teléfono o WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+53 5xxxxxxx"
                      className="w-full rounded-lg border border-white/10 bg-[#151921] px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-red-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    Pieza o repuesto que necesitas *
                  </label>
                  <input
                    type="text"
                    required
                    value={partName}
                    onChange={(e) => setPartName(e.target.value)}
                    placeholder="Ej. Embrague completo con campana, juego de rayos reforzados 16 pulg..."
                    className="w-full rounded-lg border border-white/10 bg-[#151921] px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    Medidas, detalles o número de parte grabado
                  </label>
                  <textarea
                    rows={2}
                    value={yearOrDetails}
                    onChange={(e) => setYearOrDetails(e.target.value)}
                    placeholder="Ej. Medida de muñón, si es encendido de 6V o 12V, o si el motor tiene alguna modificación..."
                    className="w-full rounded-lg border border-white/10 bg-[#151921] px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-red-500 focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3 px-4 text-xs font-bold font-mono text-white hover:bg-red-500 active:scale-95 transition-all shadow-lg shadow-red-600/30 uppercase tracking-wider"
                >
                  <Send className="h-4 w-4" />
                  <span>{submitted ? '¡Consulta Enviada!' : 'Consultar Pieza por WhatsApp'}</span>
                </button>
              </form>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
