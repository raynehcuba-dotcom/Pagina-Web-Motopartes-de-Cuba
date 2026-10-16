import React from 'react';
import { MotorcycleModel } from '../types';
import { ChevronRight, Wrench, Flame, Zap, Compass } from 'lucide-react';

interface ModelShowcaseProps {
  activeModel: MotorcycleModel;
  onSelectModel: (model: MotorcycleModel) => void;
}

export const ModelShowcase: React.FC<ModelShowcaseProps> = ({
  activeModel,
  onSelectModel,
}) => {
  const models = [
    {
      id: 'MZ' as MotorcycleModel,
      name: 'MZ 250 / 150',
      subtitle: 'ETZ 250 · TS 250 · ETZ 150 · 2 Tiempos',
      icon: Flame,
      summary: 'El caballo de batalla clásico de dos tiempos de la ingeniería alemana en Cuba. Cilindros, cigüeñales reforzados, encendidos electrónicos CDI 12V y carburadores BVF.',
      popularParts: ['Cilindro 69mm', 'Encendido Vape 12V', 'Carburador BVF 30N3', 'Cadena + Mangueras'],
      tag: 'Piezas Alemanas y Taiwán',
      color: 'from-amber-500/20 to-orange-500/5',
      borderColor: 'border-amber-500/30'
    },
    {
      id: 'GN125' as MotorcycleModel,
      name: 'Suzuki GN125',
      subtitle: 'GN125H · GN125F · 4 Tiempos SOHC',
      icon: Zap,
      summary: 'La reina de la durabilidad urbana y carretera interprovincial. Kits de arrastre O-Ring reforzados, cilindros 57mm, carburadores de vacío Mikuni y estatores.',
      popularParts: ['Kit Arrastre 428H Gold', 'Cilindro 57mm STD', 'Carburador Mikuni 26', 'Amortiguadores HD'],
      tag: 'Calidad OEM Japonesa',
      color: 'from-blue-500/20 to-cyan-500/5',
      borderColor: 'border-blue-500/30'
    },
    {
      id: 'AX100' as MotorcycleModel,
      name: 'Suzuki AX100',
      subtitle: 'AX100 Especial · 98cc 2 Tiempos',
      icon: Compass,
      summary: 'La moto de dos tiempos más ágil y popular en todas las ciudades de Cuba. Cilindros de 5 transferencias, carburadores Mikuni VM20, platos de bobinas y escapes cromados.',
      popularParts: ['Cilindro 50mm STD', 'Carburador Mikuni VM20', 'Discos F.C.C. 5Pz', 'Escape Cromado'],
      tag: 'Repuestos Originales 2T',
      color: 'from-emerald-500/20 to-teal-500/5',
      borderColor: 'border-emerald-500/30'
    },
    {
      id: 'Karpaty' as MotorcycleModel,
      name: 'Karpaty 50',
      subtitle: 'Motores V-50 · V-50M · Delta 50cc',
      icon: Wrench,
      summary: 'Repuestos especializados difíciles de conseguir para el ciclomotor soviético. Pistones 38mm estándar, carburadores K60V, conmutadores KET-1A y juego de juntas.',
      popularParts: ['Pistón 38mm STD', 'Carburador K60V', 'Conmutador KET-1A', 'Juego de Juntas'],
      tag: 'Especialidad & Vintage',
      color: 'from-purple-500/20 to-indigo-500/5',
      borderColor: 'border-purple-500/30'
    },
  ];

  return (
    <section id="modelos" className="border-b border-white/10 bg-[#0f1116] py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-red-500 font-bold">
              Especialización por Modelo
            </span>
            <h2 className="font-condensed text-3xl sm:text-4xl font-extrabold uppercase text-white mt-1">
              Catálogo Directo para tu Moto
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-md">
            Piezas con garantía de encaje y compatibilidad probada en talleres cubanos. Haz clic en tu moto para filtrar el catálogo al instante.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {models.map((model) => {
            const Icon = model.icon;
            const isSelected = activeModel === model.id;

            return (
              <div
                key={model.id}
                onClick={() => {
                  onSelectModel(model.id);
                  const el = document.getElementById('catalogo');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`group relative rounded-xl border p-5 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#181d25] border-red-500 ring-2 ring-red-500/20 shadow-xl'
                    : 'bg-[#14171e] border-white/10 hover:border-red-500/40 hover:bg-[#181c24]'
                }`}
              >
                <div>
                  {/* Top Bar inside card */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-red-500 group-hover:scale-105 group-hover:bg-red-600/10 transition-transform">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-mono font-medium text-slate-400 border border-white/10 rounded px-2 py-0.5">
                      {model.tag}
                    </span>
                  </div>

                  <h3 className="font-condensed text-2xl font-bold uppercase tracking-wide text-white group-hover:text-red-400 transition-colors">
                    {model.name}
                  </h3>
                  <div className="text-xs font-mono text-slate-400 mb-3">
                    {model.subtitle}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {model.summary}
                  </p>
                </div>

                <div>
                  {/* Popular parts list */}
                  <div className="border-t border-white/10 pt-3 mb-4">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1.5">
                      Repuestos más solicitados:
                    </span>
                    <ul className="text-xs text-slate-300 space-y-1">
                      {model.popularParts.map((part, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="h-1 w-1 rounded-full bg-red-500/80" />
                          <span className="truncate">{part}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Filter action button */}
                  <button
                    className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold font-mono uppercase transition-colors ${
                      isSelected
                        ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                        : 'bg-white/5 text-slate-200 group-hover:bg-red-600 group-hover:text-white'
                    }`}
                  >
                    <span>{isSelected ? 'Filtro Activo' : 'Ver Repuestos'}</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
