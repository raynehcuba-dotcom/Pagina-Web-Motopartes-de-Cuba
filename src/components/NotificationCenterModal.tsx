import React, { useState } from 'react';
import { Repuesto } from '../types';
import { CatalogNotification, requestPushPermission, getNotificationPermission, dispatchRepuestoNotification } from '../lib/notifications';
import { X, Bell, BellRing, Check, ExternalLink, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: CatalogNotification[];
  repuestos: Repuesto[];
  onSelectRepuesto: (repuesto: Repuesto) => void;
  onClearNotifications: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  notifications,
  repuestos,
  onSelectRepuesto,
  onClearNotifications,
}) => {
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(() =>
    getNotificationPermission()
  );
  const [testSent, setTestSent] = useState(false);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const res = await requestPushPermission();
    setPermission(res);
  };

  const handleSendTestPush = () => {
    // Pick an existing repuesto or sample
    const sample = repuestos[0] || {
      id: 'mz-cilindro-250',
      name: 'Cilindro con Pistón Completo MZ ETZ 250',
      code: 'MZ-ENG-001',
      category: 'motor',
      categoryLabel: 'Motor y Cilindro',
      model: 'MZ 250',
      modelLabel: 'MZ ETZ 250 / TS 250',
      priceCUP: 18500,
      priceUSD: 54.41,
      stock: 'disponible',
      stockCount: 6,
      origin: 'Alemania / Repro EU',
      image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
      description: 'Cilindro de 250cc rectificado de fábrica con pistón de dos segmentos.',
      specs: { Cilindrada: '250cc' },
      compatibility: ['MZ ETZ 250', 'MZ TS 250'],
      isFeatured: true,
    };

    dispatchRepuestoNotification(sample, '🏍️ Prueba de Notificación Push - Motopartes de Cuba');
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-xl rounded-2xl border border-white/15 bg-[#12151e] shadow-2xl overflow-hidden my-6 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-[#0a0c10] shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600/15 border border-red-500/30 text-red-500">
              <BellRing className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-condensed text-2xl font-bold uppercase tracking-wide text-white">
                Alertas y Notificaciones Push
              </h2>
              <span className="text-xs font-mono text-slate-400">
                Avisos instantáneos de nuevos repuestos en almacén
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Cerrar notificaciones"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Permission Banner & Push Controls */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-[#161a24] space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-mono font-bold uppercase text-white flex items-center gap-2">
                <span>Estado de Notificaciones:</span>
                {permission === 'granted' ? (
                  <span className="inline-flex items-center gap-1 rounded bg-emerald-500/20 text-emerald-400 px-2 py-0.5 text-[10px] font-bold border border-emerald-500/30">
                    <Check className="h-3 w-3" /> Activadas
                  </span>
                ) : permission === 'denied' ? (
                  <span className="inline-flex items-center gap-1 rounded bg-red-500/20 text-red-400 px-2 py-0.5 text-[10px] font-bold border border-red-500/30">
                    <AlertCircle className="h-3 w-3" /> Bloqueadas por el navegador
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded bg-amber-500/20 text-amber-400 px-2 py-0.5 text-[10px] font-bold border border-amber-500/30">
                    Pendientes de activación
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-slate-300">
                Recibe una alerta inmediata en tu dispositivo tan pronto entre al catálogo un repuesto para tu moto.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {permission !== 'granted' ? (
              <button
                onClick={handleRequestPermission}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-mono font-bold text-white hover:bg-red-500 active:scale-95 transition-all shadow-md shadow-red-600/30 uppercase tracking-wide"
              >
                <Bell className="h-3.5 w-3.5" />
                <span>Activar Notificaciones Push</span>
              </button>
            ) : (
              <button
                onClick={handleSendTestPush}
                disabled={testSent}
                className="flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-950/40 px-3.5 py-2 text-xs font-mono font-semibold text-red-300 hover:bg-red-900/40 hover:text-white active:scale-95 transition-all"
              >
                <Sparkles className="h-3.5 w-3.5 text-red-400" />
                <span>{testSent ? '¡Notificación enviada!' : 'Probar Alerta Push Ahora'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Notifications Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase text-slate-400 font-semibold">
              Historial de Avisos ({notifications.length})
            </span>
            {notifications.length > 0 && (
              <button
                onClick={onClearNotifications}
                className="text-[11px] font-mono text-slate-400 hover:text-red-400 transition-colors"
              >
                Limpiar historial
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="py-12 text-center">
              <Bell className="h-10 w-10 text-slate-600 mx-auto mb-2.5 stroke-1" />
              <div className="font-condensed text-lg font-bold uppercase text-white">
                Sin avisos pendientes
              </div>
              <p className="mt-1 text-xs font-mono text-slate-400 max-w-xs mx-auto">
                Cuando nuestro almacén agregue nuevas piezas o recargue inventario en Firestore, las verás aquí al instante.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {notifications.map((item) => {
                const repuesto = item.repuestoId
                  ? repuestos.find((r) => r.id === item.repuestoId)
                  : null;

                return (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-white/10 bg-[#161a22] hover:border-red-500/30 transition-all flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-[10px] font-mono text-red-400 mb-1">
                        <span className="font-bold uppercase">{item.model || 'Almacén'}</span>
                        <span>·</span>
                        <span className="text-slate-500">
                          {new Date(item.timestamp).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        {item.body}
                      </p>
                    </div>

                    {repuesto && (
                      <button
                        onClick={() => {
                          onSelectRepuesto(repuesto);
                          onClose();
                        }}
                        className="flex items-center gap-1 shrink-0 rounded-lg bg-red-600/20 border border-red-500/30 px-2.5 py-1.5 text-[11px] font-mono font-bold text-red-300 hover:bg-red-600 hover:text-white transition-all self-center"
                        title="Ver ficha técnica"
                      >
                        <span>Ver</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
