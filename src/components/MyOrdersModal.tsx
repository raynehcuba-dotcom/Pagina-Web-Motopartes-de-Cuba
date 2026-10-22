import React, { useState } from 'react';
import { CompletedOrder } from '../types';
import { User } from 'firebase/auth';
import {
  X,
  PackageCheck,
  Receipt,
  FileDown,
  MessageCircle,
  Clock,
  MapPin,
  Phone,
  User as UserIcon,
  Truck,
  LogIn,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { generateOrderPDF } from '../utils/pdfGenerator';

interface MyOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: CompletedOrder[];
  currentUser: User | null;
  onLogin: () => void;
  exchangeRate: number;
}

export const MyOrdersModal: React.FC<MyOrdersModalProps> = ({
  isOpen,
  onClose,
  orders,
  currentUser,
  onLogin,
  exchangeRate,
}) => {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [downloadingOrderId, setDownloadingOrderId] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleExpand = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const handleDownloadPDF = (order: CompletedOrder) => {
    setDownloadingOrderId(order.id);
    try {
      generateOrderPDF({
        items: order.items,
        customer: order.customer,
        currency: order.currency,
        exchangeRate: order.exchangeRate || exchangeRate,
        orderId: order.id,
        orderDate: new Date(order.createdAt).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      });
    } catch (err) {
      console.error('Error generating PDF for order:', err);
    } finally {
      setTimeout(() => setDownloadingOrderId(null), 1000);
    }
  };

  const handleWhatsAppInquiry = (order: CompletedOrder) => {
    const text = encodeURIComponent(
      `🏍️ *CONSULTA DE ESTADO DE PEDIDO*\n` +
      `📦 *N° Pedido:* ${order.id}\n` +
      `👤 *Cliente:* ${order.customer.name}\n` +
      `📅 *Fecha:* ${new Date(order.createdAt).toLocaleDateString('es-ES')}\n` +
      `💰 *Total:* $${order.totalCUP.toLocaleString('es-ES')} CUP ($${order.totalUSD.toFixed(2)} USD)\n\n` +
      `Hola equipo de Motopartes de Cuba, quisiera consultar el estado de despacho o preparación de mi pedido. ¡Gracias!`
    );
    window.open(`https://wa.me/5350000000?text=${text}`, '_blank');
  };

  const getStatusBadge = (status: CompletedOrder['status']) => {
    switch (status) {
      case 'entregado':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-mono font-bold text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Entregado
          </span>
        );
      case 'en_camino':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 px-2.5 py-0.5 text-[11px] font-mono font-bold text-blue-400">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
            En Despacho
          </span>
        );
      case 'procesando':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[11px] font-mono font-bold text-amber-400">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            En Preparación
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600/15 border border-red-500/30 px-2.5 py-0.5 text-[11px] font-mono font-bold text-red-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
            Pedido Registrado
          </span>
        );
    }
  };

  const getDeliveryLabel = (method: string) => {
    if (method === 'envio_mensajeria') return 'Mensajería directa en La Habana';
    if (method === 'envio_provincial') return 'Envío provincial (Ómnibus / Carga)';
    return 'Recogida en Almacén Central';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-4xl rounded-2xl border border-white/15 bg-[#12151d] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-[#0d0f14] shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/15 border border-red-500/30 text-red-500">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-condensed text-2xl font-bold uppercase tracking-wide text-white">
                  Mis Pedidos y Cotizaciones
                </h2>
                <span className="rounded bg-white/10 border border-white/10 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                  {orders.length} {orders.length === 1 ? 'pedido' : 'pedidos'}
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Historial de repuestos solicitados, comprobantes PDF y seguimiento
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sync Info Strip */}
        <div className="bg-[#0f1118] border-b border-white/10 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>
                Conectado como <strong className="text-white">{currentUser.email}</strong> · Sincronizado en Firestore
              </span>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between w-full gap-2">
              <span className="text-slate-400">
                Pedidos guardados en este navegador. Inicia sesión con Google para sincronizar tus pedidos en la nube de Firestore.
              </span>
              <button
                type="button"
                onClick={onLogin}
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-600/20 border border-red-500/40 px-2.5 py-1 text-red-300 hover:bg-red-600/30 font-bold transition-colors"
              >
                <LogIn className="h-3 w-3" />
                <span>Acceder con Google</span>
              </button>
            </div>
          )}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {orders.length === 0 ? (
            <div className="py-16 text-center max-w-md mx-auto">
              <PackageCheck className="h-14 w-14 text-slate-600 mx-auto mb-4 stroke-1" />
              <h3 className="font-condensed text-2xl font-bold uppercase text-white">
                Aún no tienes pedidos registrados
              </h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Cuando armes un pedido desde el carrito y lo envíes por WhatsApp o descargues tu cotización en PDF, se guardará automáticamente en este historial con su comprobante para futuras consultas.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-mono font-bold text-white hover:bg-red-500 transition-colors shadow-lg shadow-red-600/30 uppercase tracking-wider"
              >
                Explorar Catálogo de Piezas
              </button>
            </div>
          ) : (
            orders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              const formattedDate = new Date(order.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={order.id}
                  className="rounded-2xl border border-white/10 bg-[#161a24] overflow-hidden transition-all hover:border-white/20"
                >
                  {/* Order Card Top Bar */}
                  <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 bg-[#141720]">
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white shrink-0 font-mono text-xs font-bold">
                        #{order.id.slice(-4)}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono font-bold text-white text-sm">
                            {order.id}
                          </span>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-1">
                          <Calendar className="h-3.5 w-3.5 text-slate-500" />
                          <span>{formattedDate}</span>
                          <span>·</span>
                          <span>{order.items.length} {order.items.length === 1 ? 'pieza' : 'piezas'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Totals & Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
                      <div className="text-right">
                        <div className="text-sm font-bold font-mono text-red-400 tabular-nums">
                          ${order.totalCUP.toLocaleString('es-ES')} CUP
                        </div>
                        <div className="text-xs font-mono text-emerald-400 tabular-nums">
                          ${order.totalUSD.toFixed(2)} USD
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleDownloadPDF(order)}
                          disabled={downloadingOrderId === order.id}
                          className="flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-950/20 px-2.5 py-1.5 text-xs font-mono font-semibold text-red-300 hover:bg-red-900/30 transition-colors"
                          title="Descargar comprobante en PDF"
                        >
                          <FileDown className="h-3.5 w-3.5 text-red-400" />
                          <span className="hidden sm:inline">
                            {downloadingOrderId === order.id ? 'Descargando...' : 'PDF'}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleWhatsAppInquiry(order)}
                          className="flex items-center gap-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-1.5 text-xs font-mono font-semibold text-emerald-300 hover:bg-emerald-500/30 transition-colors"
                          title="Consultar pedido por WhatsApp"
                        >
                          <MessageCircle className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="hidden sm:inline">Consultar</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleExpand(order.id)}
                          className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs font-mono text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Order Details Accordion (Delivery + Items) */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 space-y-4 bg-[#11141c] animate-in fade-in duration-150">
                      
                      {/* Customer Info Box */}
                      <div className="rounded-xl border border-white/5 bg-[#161a24] p-3 text-xs font-mono grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="flex items-center gap-2">
                          <UserIcon className="h-3.5 w-3.5 text-red-400 shrink-0" />
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase block">Cliente</span>
                            <span className="text-white font-medium">{order.customer.name || 'Cliente Particular'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-red-400 shrink-0" />
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase block">Teléfono / WhatsApp</span>
                            <span className="text-white">{order.customer.phone || 'No especificado'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Truck className="h-3.5 w-3.5 text-red-400 shrink-0" />
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase block">Entrega</span>
                            <span className="text-slate-300">{getDeliveryLabel(order.customer.deliveryMethod)}</span>
                          </div>
                        </div>

                        {order.customer.province && (
                          <div className="flex items-center gap-2 sm:col-span-2 md:col-span-3 pt-2 border-t border-white/5 text-slate-400">
                            <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                            <span>
                              {order.customer.province}
                              {order.customer.municipality ? ` - ${order.customer.municipality}` : ''}
                            </span>
                            {order.customer.notes && (
                              <span className="text-slate-500 ml-2">· Nota: "{order.customer.notes}"</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Items Table */}
                      <div className="space-y-2">
                        <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider block">
                          Piezas Solicitadas
                        </span>

                        <div className="divide-y divide-white/5 rounded-xl border border-white/5 bg-[#161a24] overflow-hidden">
                          {order.items.map((item, idx) => (
                            <div
                              key={`${order.id}-${idx}`}
                              className="p-3 flex items-center justify-between gap-3 text-xs font-mono"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className="text-slate-500 text-[11px] font-bold">#{idx + 1}</span>
                                <div className="min-w-0">
                                  <h5 className="font-medium text-white truncate">{item.name}</h5>
                                  <div className="text-[10px] text-slate-400 flex items-center gap-2">
                                    <span className="text-red-400 font-bold">{item.model}</span>
                                    <span>·</span>
                                    <span>Cód: {item.code}</span>
                                    <span>·</span>
                                    <span>{item.quantity} un. x ${item.priceCUP.toLocaleString('es-ES')} CUP</span>
                                  </div>
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <div className="font-bold text-white tabular-nums">
                                  ${(item.priceCUP * item.quantity).toLocaleString('es-ES')} CUP
                                </div>
                                <div className="text-[10px] text-emerald-400 tabular-nums">
                                  ${(item.priceUSD * item.quantity).toFixed(2)} USD
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 bg-[#0d0f14] px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-500" />
            <span>
              Todos los pedidos quedan registrados con número de folio único para garantía y despacho.
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-white/10 px-4 py-1.5 text-white hover:bg-white/20 transition-colors"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
