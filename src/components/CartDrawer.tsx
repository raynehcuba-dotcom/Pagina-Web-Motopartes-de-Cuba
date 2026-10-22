import React, { useState } from 'react';
import { CartItem, Currency, OrderCustomerInfo, CompletedOrder } from '../types';
import { X, Trash2, MessageCircle, ShoppingBag, Truck, MapPin, User, Phone, CheckCircle2, FileDown } from 'lucide-react';
import { generateOrderPDF } from '../utils/pdfGenerator';
import { saveCompletedOrder } from '../lib/firebase';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: Currency;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onToggleCurrency: () => void;
  exchangeRate: number;
  onOrderCompleted?: (order: CompletedOrder) => void;
}

const PROVINCIAS_CUBA = [
  'La Habana',
  'Pinar del Río',
  'Artemisa',
  'Mayabeque',
  'Matanzas',
  'Cienfuegos',
  'Villa Clara',
  'Sancti Spíritus',
  'Ciego de Ávila',
  'Camagüey',
  'Las Tunas',
  'Holguín',
  'Granma',
  'Santiago de Cuba',
  'Guantánamo',
  'Isla de la Juventud'
];

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onToggleCurrency,
  exchangeRate,
  onOrderCompleted,
}) => {
  const [customer, setCustomer] = useState<OrderCustomerInfo>({
    name: '',
    phone: '',
    province: 'La Habana',
    municipality: '',
    deliveryMethod: 'recogida_almacen',
    notes: '',
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [orderRecordedMessage, setOrderRecordedMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Calculate totals
  const totalCUP = items.reduce((sum, item) => sum + item.repuesto.priceCUP * item.quantity, 0);
  const totalUSD = items.reduce((sum, item) => sum + item.repuesto.priceUSD * item.quantity, 0);

  const createOrderRecord = (orderId?: string): CompletedOrder => {
    const id = orderId || `MP-${Date.now().toString().slice(-6)}`;
    return {
      id,
      customer,
      items: items.map((it) => ({
        repuestoId: it.repuesto.id,
        name: it.repuesto.name,
        code: it.repuesto.code,
        model: it.repuesto.model,
        priceCUP: it.repuesto.priceCUP,
        priceUSD: it.repuesto.priceUSD,
        quantity: it.quantity,
        image: it.repuesto.image,
      })),
      totalCUP,
      totalUSD,
      currency,
      exchangeRate,
      status: 'completado',
      createdAt: new Date().toISOString(),
    };
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    const orderId = `MP-${Date.now().toString().slice(-6)}`;
    try {
      generateOrderPDF({
        items,
        customer,
        currency,
        exchangeRate,
        orderId,
      });

      // Save to historical orders in Firestore & LocalStorage
      const newOrder = createOrderRecord(orderId);
      saveCompletedOrder(newOrder);
      if (onOrderCompleted) onOrderCompleted(newOrder);

      setPdfSuccess(true);
      setOrderRecordedMessage(`¡Cotización guardada en 'Mis Pedidos' como #${orderId}!`);
      setTimeout(() => setPdfSuccess(false), 3500);
      setTimeout(() => setOrderRecordedMessage(null), 5000);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleSendWhatsAppOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customer.name.trim()) {
      setFormError('Por favor escribe tu nombre completo para la orden.');
      return;
    }
    if (!customer.phone.trim()) {
      setFormError('Por favor introduce un teléfono o número de WhatsApp de contacto.');
      return;
    }

    setFormError(null);

    const orderId = `MP-${Date.now().toString().slice(-6)}`;
    const newOrder = createOrderRecord(orderId);

    // Save order in Firestore & LocalStorage for 'Mis Pedidos' tracking
    saveCompletedOrder(newOrder);
    if (onOrderCompleted) onOrderCompleted(newOrder);

    // Format delivery label
    let deliveryLabel = 'Recogida en Almacén (La Habana)';
    if (customer.deliveryMethod === 'envio_mensajeria') deliveryLabel = 'Mensajería a Domicilio (La Habana)';
    if (customer.deliveryMethod === 'envio_provincial') deliveryLabel = 'Envío Provincial (Ómnibus / Agencia)';

    // Items list
    const itemsFormatted = items
      .map(
        (it, idx) =>
          `${idx + 1}. *${it.repuesto.name}*\n` +
          `   • Cód: ${it.repuesto.code} | Modelo: ${it.repuesto.model}\n` +
          `   • Cantidad: ${it.quantity} x $${it.repuesto.priceCUP.toLocaleString('es-ES')} CUP ($${it.repuesto.priceUSD} USD)\n` +
          `   • Subtotal: $${(it.repuesto.priceCUP * it.quantity).toLocaleString('es-ES')} CUP ($${(it.repuesto.priceUSD * it.quantity).toFixed(2)} USD)`
      )
      .join('\n\n');

    const message =
      `🏍️ *PEDIDO DE REPUESTOS - MOTOPARTES DE CUBA S.R.L*\n` +
      `📦 *Folio de Registro:* ${orderId}\n` +
      `📅 *Fecha:* ${new Date().toLocaleDateString('es-ES')}\n\n` +
      `👤 *DATOS DEL CLIENTE:*\n` +
      `• *Nombre:* ${customer.name}\n` +
      `• *Teléfono:* ${customer.phone}\n` +
      `• *Provincia:* ${customer.province}\n` +
      `• *Municipio:* ${customer.municipality || 'No especificado'}\n` +
      `• *Modalidad:* ${deliveryLabel}\n\n` +
      `📦 *PIEZAS SOLICITADAS:*\n` +
      `${itemsFormatted}\n\n` +
      `💰 *TOTAL ESTIMADO:*\n` +
      `• *Total CUP:* $${totalCUP.toLocaleString('es-ES')} CUP\n` +
      `• *Total USD:* $${totalUSD.toFixed(2)} USD\n` +
      `• *Moneda de preferencia:* ${currency}\n\n` +
      `📝 *Observaciones:* ${customer.notes.trim() || 'Ninguna'}\n\n` +
      `---------------------------------\n` +
      `_Por favor confirmar disponibilidad en almacén y datos de pago por Transfermóvil / EnZona / Efectivo._`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/5350000000?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-lg bg-[#11141b] border-l border-white/10 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-[#0d0f14]">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600/15 border border-red-500/30 text-red-500">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-condensed text-xl font-bold uppercase text-white tracking-wide">
                  Tu Cotización y Pedido
                </h3>
                <span className="text-[11px] font-mono text-slate-400">
                  {items.length} {items.length === 1 ? 'pieza seleccionada' : 'piezas seleccionadas'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onToggleCurrency}
                className="rounded border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-mono text-red-400 hover:border-red-500"
                title="Cambiar moneda de visualización"
              >
                Moneda: {currency}
              </button>

              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Cerrar pedido"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {items.length === 0 ? (
              <div className="py-16 text-center">
                <ShoppingBag className="h-12 w-12 text-slate-600 mx-auto mb-3 stroke-1" />
                <h4 className="font-condensed text-xl font-bold uppercase text-slate-300">
                  Tu pedido está vacío
                </h4>
                <p className="mt-1 text-xs text-slate-400 max-w-xs mx-auto">
                  Agrega repuestos desde el catálogo para MZ, GN125, AX100 o Karpaty y cotiza de inmediato.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 rounded-lg bg-red-600 px-4 py-2 text-xs font-mono font-bold text-white hover:bg-red-500 transition-colors shadow-lg shadow-red-600/30"
                >
                  Ir al Catálogo
                </button>
              </div>
            ) : (
              <>
                {/* Items List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-1 border-b border-white/5">
                    <span>Artículos</span>
                    <button
                      onClick={onClearCart}
                      className="text-[11px] text-red-400 hover:text-red-300 hover:underline"
                    >
                      Vaciar pedido
                    </button>
                  </div>

                  {items.map((it) => (
                    <div
                      key={it.repuesto.id}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#161a22] p-3 text-xs"
                    >
                      <img
                        src={it.repuesto.image}
                        alt={it.repuesto.name}
                        className="h-14 w-14 rounded-lg object-cover bg-black/40 shrink-0 border border-white/5"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-red-400">
                          <span>{it.repuesto.model}</span>
                          <span>·</span>
                          <span className="text-slate-400">{it.repuesto.code}</span>
                        </div>
                        <h5 className="font-medium text-white truncate text-xs" title={it.repuesto.name}>
                          {it.repuesto.name}
                        </h5>
                        <div className="font-mono tabular-nums text-slate-200 mt-1">
                          {currency === 'CUP' ? (
                            <span className="text-red-400 font-bold">
                              ${(it.repuesto.priceCUP * it.quantity).toLocaleString('es-ES')} CUP
                            </span>
                          ) : (
                            <span className="text-emerald-400 font-bold">
                              ${(it.repuesto.priceUSD * it.quantity).toFixed(2)} USD
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center rounded border border-white/10 bg-black/40 font-mono text-xs">
                        <button
                          onClick={() => onUpdateQuantity(it.repuesto.id, -1)}
                          className="px-2 py-1 text-slate-400 hover:text-white"
                        >
                          -
                        </button>
                        <span className="px-1 text-center font-bold text-white tabular-nums">
                          {it.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(it.repuesto.id, 1)}
                          className="px-2 py-1 text-slate-400 hover:text-white"
                        >
                          +
                        </button>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => onRemoveItem(it.repuesto.id)}
                        className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                        title="Eliminar pieza"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Customer Information Form */}
                <form id="order-form" onSubmit={handleSendWhatsAppOrder} className="space-y-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-red-400">
                    <User className="h-3.5 w-3.5" />
                    <span>Datos de Entrega en Cuba</span>
                  </div>

                  {orderRecordedMessage && (
                    <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs font-mono flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>{orderRecordedMessage}</span>
                    </div>
                  )}

                  {formError && (
                    <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-mono">
                      {formError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">
                        Nombre completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={customer.name}
                        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                        placeholder="Ej. Carlos Valdés"
                        className="w-full rounded-lg border border-white/10 bg-[#161a22] px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-red-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">
                        Teléfono / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={customer.phone}
                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                        placeholder="+53 5xxxxxxx"
                        className="w-full rounded-lg border border-white/10 bg-[#161a22] px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-red-500 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">
                        Provincia
                      </label>
                      <select
                        value={customer.province}
                        onChange={(e) => setCustomer({ ...customer, province: e.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-[#161a22] px-3 py-2 text-xs text-white focus:border-red-500 focus:outline-none font-mono"
                      >
                        {PROVINCIAS_CUBA.map((prov) => (
                          <option key={prov} value={prov}>
                            {prov}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">
                        Municipio
                      </label>
                      <input
                        type="text"
                        value={customer.municipality}
                        onChange={(e) => setCustomer({ ...customer, municipality: e.target.value })}
                        placeholder="Ej. Plaza, Diez de Octubre..."
                        className="w-full rounded-lg border border-white/10 bg-[#161a22] px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-red-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Modalidad de Entrega
                    </label>
                    <select
                      value={customer.deliveryMethod}
                      onChange={(e) => setCustomer({ ...customer, deliveryMethod: e.target.value as any })}
                      className="w-full rounded-lg border border-white/10 bg-[#161a22] px-3 py-2 text-xs text-white focus:border-red-500 focus:outline-none font-mono"
                    >
                      <option value="recogida_almacen">Recogida personal en Almacén (La Habana - Gratis)</option>
                      <option value="envio_mensajeria">Mensajería directa a domicilio (La Habana)</option>
                      <option value="envio_provincial">Envío provincial (Vía Ómnibus / Agencia de Carga)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Notas o consultas de compatibilidad
                    </label>
                    <textarea
                      rows={2}
                      value={customer.notes}
                      onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                      placeholder="Ej. Medida de cilindro o si desean pagar por Transfermóvil..."
                      className="w-full rounded-lg border border-white/10 bg-[#161a22] px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-red-500 focus:outline-none resize-none"
                    />
                  </div>
                </form>
              </>
            )}

          </div>

          {/* Footer Totals and WhatsApp CTA */}
          {items.length > 0 && (
            <div className="border-t border-white/10 bg-[#0d0f14] p-6 space-y-4">
              
              {/* Total Calculation Strip */}
              <div className="space-y-1.5 font-mono">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Total en Pesos Cubanos:</span>
                  <span className="font-bold text-white tabular-nums text-sm">
                    ${totalCUP.toLocaleString('es-ES')} CUP
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Equivalente en USD:</span>
                  <span className="font-semibold text-emerald-400 tabular-nums">
                    ${totalUSD.toFixed(2)} USD
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 pt-1">
                  * Pago aceptado en CUP o USD según tasa acordada por Transfermóvil, EnZona o Efectivo.
                </div>
              </div>

              {/* Actions Stack */}
              <div className="space-y-2.5">
                {/* Download PDF Button */}
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPDF}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-500/40 bg-red-950/30 hover:bg-red-900/40 hover:border-red-500 py-3 px-4 text-xs font-bold font-mono text-red-200 active:scale-95 transition-all shadow-md shadow-red-950/50"
                  title="Descargar cotización oficial en PDF con nombres de piezas, cantidades y costo total"
                >
                  {pdfSuccess ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span className="text-emerald-300">¡PDF Generado y Descargado!</span>
                    </>
                  ) : (
                    <>
                      <FileDown className="h-4 w-4 text-red-400" />
                      <span>{isGeneratingPDF ? 'Generando PDF...' : 'Descargar Resumen en PDF'}</span>
                    </>
                  )}
                </button>

                {/* Master WhatsApp Button */}
                <button
                  type="submit"
                  form="order-form"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 px-4 text-sm font-bold font-mono text-black hover:bg-emerald-400 active:scale-95 transition-all shadow-lg shadow-emerald-500/25 uppercase tracking-wide"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Enviar Pedido por WhatsApp</span>
                </button>
              </div>

              <p className="text-center text-[11px] font-mono text-slate-400">
                Guarda tu cotización en PDF o envíala directamente a nuestro asesor comercial por WhatsApp.
              </p>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
