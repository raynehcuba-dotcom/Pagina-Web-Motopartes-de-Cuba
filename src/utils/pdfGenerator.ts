import jsPDF from 'jspdf';
import { CartItem, Currency, OrderCustomerInfo } from '../types';

export interface PDFOrderItem {
  name: string;
  code: string;
  model: string;
  priceCUP: number;
  priceUSD: number;
  quantity: number;
}

interface GeneratePDFParams {
  items: (CartItem | PDFOrderItem)[];
  customer: OrderCustomerInfo;
  currency: Currency;
  exchangeRate: number;
  orderId?: string;
  orderDate?: string;
}

export function generateOrderPDF({
  items,
  customer,
  currency,
  exchangeRate,
  orderId,
  orderDate,
}: GeneratePDFParams): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let currentY = 16;

  // Normalize items whether they come from CartItem or OrderItem
  const normalizedItems: PDFOrderItem[] = items.map((it) => {
    if ('repuesto' in it) {
      return {
        name: it.repuesto.name,
        code: it.repuesto.code,
        model: it.repuesto.model,
        priceCUP: it.repuesto.priceCUP,
        priceUSD: it.repuesto.priceUSD,
        quantity: it.quantity,
      };
    }
    return it;
  });

  // 1. Header Bar with Brand Color
  doc.setFillColor(220, 38, 38); // Motopartes Red (#dc2626)
  doc.rect(0, 0, pageWidth, 6, 'F');

  // Brand Name & Subtitle
  doc.setTextColor(17, 24, 39); // Gray 900
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('MOTOPARTES DE CUBA S.R.L.', margin, currentY);

  currentY += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139); // Slate 500
  doc.text('Especialistas en repuestos originales y compatibles: MZ, GN125, AX100, Karpaty', margin, currentY);
  
  // Right header: Date & Order / Cotización ID
  const resolvedOrderId = orderId || `MP-${Date.now().toString().slice(-6)}`;
  const resolvedDateStr = orderDate || new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(17, 24, 39);
  doc.text(`COMPROBANTE N°: ${resolvedOrderId}`, pageWidth - margin, 16, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Fecha: ${resolvedDateStr}`, pageWidth - margin, 21, { align: 'right' });
  doc.text('Validez: 72 horas', pageWidth - margin, 25, { align: 'right' });

  currentY += 8;
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  currentY += 7;

  // 2. Customer Info Card
  doc.setFillColor(248, 250, 252); // Slate 50
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, pageWidth - (margin * 2), 26, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(220, 38, 38);
  doc.text('DATOS DEL CLIENTE Y ENTREGA', margin + 4, currentY + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);

  const clientName = customer.name.trim() ? customer.name.trim() : 'Cliente particular (Mostrador)';
  const clientPhone = customer.phone.trim() ? customer.phone.trim() : 'Por confirmar vía WhatsApp';
  const clientLoc = `${customer.province}${customer.municipality ? ' - ' + customer.municipality : ''}`;

  let deliveryLabel = 'Recogida en Almacén Central (La Habana)';
  if (customer.deliveryMethod === 'envio_mensajeria') deliveryLabel = 'Mensajería directa a domicilio (La Habana)';
  if (customer.deliveryMethod === 'envio_provincial') deliveryLabel = 'Envío provincial (Ómnibus / Agencia de Carga)';

  doc.text(`Cliente: ${clientName}`, margin + 4, currentY + 11);
  doc.text(`Teléfono / WhatsApp: ${clientPhone}`, margin + 4, currentY + 16);
  doc.text(`Ubicación: ${clientLoc}`, margin + 4, currentY + 21);

  doc.text(`Modalidad de Entrega: ${deliveryLabel}`, margin + 95, currentY + 11);
  doc.text(`Moneda preferida: ${currency} (Tasa ref: 1 USD = ${exchangeRate} CUP)`, margin + 95, currentY + 16);
  if (customer.notes.trim()) {
    const truncatedNote = customer.notes.length > 50 ? customer.notes.slice(0, 48) + '...' : customer.notes;
    doc.text(`Nota: ${truncatedNote}`, margin + 95, currentY + 21);
  }

  currentY += 33;

  // 3. Products Table Header
  const colX = {
    index: margin,
    product: margin + 8,
    model: margin + 78,
    qty: margin + 112,
    unitPrice: margin + 126,
    subtotalCUP: margin + 154,
    subtotalUSD: pageWidth - margin,
  };

  doc.setFillColor(30, 41, 59); // Slate 800
  doc.rect(margin, currentY, pageWidth - (margin * 2), 7.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);

  doc.text('#', colX.index + 2, currentY + 5);
  doc.text('PIEZA / DESCRIPCIÓN', colX.product, currentY + 5);
  doc.text('MODELO / CÓDIGO', colX.model, currentY + 5);
  doc.text('CANT.', colX.qty, currentY + 5);
  doc.text('P. UNIT (CUP)', colX.unitPrice, currentY + 5);
  doc.text('SUBTOTAL CUP', colX.subtotalCUP, currentY + 5);
  doc.text('SUBTOTAL USD', colX.subtotalUSD - 2, currentY + 5, { align: 'right' });

  currentY += 7.5;

  // Calculate totals
  let totalCUP = 0;
  let totalUSD = 0;

  // 4. Products Table Rows
  normalizedItems.forEach((item, index) => {
    // Check page overflow
    if (currentY > pageHeight - 35) {
      doc.addPage();
      currentY = 16;
      // Repeat header on new page
      doc.setFillColor(30, 41, 59);
      doc.rect(margin, currentY, pageWidth - (margin * 2), 7.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text('#', colX.index + 2, currentY + 5);
      doc.text('PIEZA / DESCRIPCIÓN', colX.product, currentY + 5);
      doc.text('MODELO / CÓDIGO', colX.model, currentY + 5);
      doc.text('CANT.', colX.qty, currentY + 5);
      doc.text('P. UNIT (CUP)', colX.unitPrice, currentY + 5);
      doc.text('SUBTOTAL CUP', colX.subtotalCUP, currentY + 5);
      doc.text('SUBTOTAL USD', colX.subtotalUSD - 2, currentY + 5, { align: 'right' });
      currentY += 7.5;
    }

    const itemSubtotalCUP = item.priceCUP * item.quantity;
    const itemSubtotalUSD = item.priceUSD * item.quantity;
    totalCUP += itemSubtotalCUP;
    totalUSD += itemSubtotalUSD;

    // Alternate row styling
    if (index % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, currentY, pageWidth - (margin * 2), 7, 'F');
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);

    // Index
    doc.text(String(index + 1), colX.index + 2, currentY + 4.8);

    // Name (Truncated if too long)
    const truncatedName = item.name.length > 40
      ? item.name.slice(0, 38) + '...'
      : item.name;
    doc.text(truncatedName, colX.product, currentY + 4.8);

    // Model & Code
    const modelCode = `${item.model} (${item.code})`;
    doc.text(modelCode.slice(0, 22), colX.model, currentY + 4.8);

    // Qty
    doc.setFont('helvetica', 'bold');
    doc.text(String(item.quantity), colX.qty + 2, currentY + 4.8);
    doc.setFont('helvetica', 'normal');

    // Unit Price
    doc.text(`$${item.priceCUP.toLocaleString('es-ES')}`, colX.unitPrice, currentY + 4.8);

    // Subtotal CUP
    doc.setFont('helvetica', 'bold');
    doc.text(`$${itemSubtotalCUP.toLocaleString('es-ES')}`, colX.subtotalCUP, currentY + 4.8);

    // Subtotal USD
    doc.setFont('helvetica', 'normal');
    doc.text(`$${itemSubtotalUSD.toFixed(2)}`, colX.subtotalUSD - 2, currentY + 4.8, { align: 'right' });

    // Subtle bottom row border
    doc.setDrawColor(241, 245, 249);
    doc.setLineWidth(0.2);
    doc.line(margin, currentY + 7, pageWidth - margin, currentY + 7);

    currentY += 7;
  });

  // Table bottom border
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  currentY += 6;

  // Check page overflow for summary box
  if (currentY > pageHeight - 50) {
    doc.addPage();
    currentY = 16;
  }

  // 5. Total Summary Box
  const summaryBoxWidth = 85;
  const summaryBoxX = pageWidth - margin - summaryBoxWidth;
  const summaryBoxHeight = 24;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(220, 38, 38);
  doc.setLineWidth(0.6);
  doc.roundedRect(summaryBoxX, currentY, summaryBoxWidth, summaryBoxHeight, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('TOTAL COTIZADO (CUP):', summaryBoxX + 4, currentY + 7);
  doc.setTextColor(220, 38, 38);
  doc.setFontSize(11);
  doc.text(`$${totalCUP.toLocaleString('es-ES')} CUP`, pageWidth - margin - 4, currentY + 7, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('EQUIVALENTE USD:', summaryBoxX + 4, currentY + 14);
  doc.setTextColor(16, 185, 129); // Emerald 500
  doc.setFontSize(10);
  doc.text(`$${totalUSD.toFixed(2)} USD`, pageWidth - margin - 4, currentY + 14, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(`Tasa aplicada: 1 USD = ${exchangeRate} CUP`, summaryBoxX + 4, currentY + 20);

  // Left Note Box beside totals
  const noteBoxWidth = summaryBoxX - margin - 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(17, 24, 39);
  doc.text('MÉTODOS DE PAGO Y CONFIRMACIÓN:', margin, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('• Transfermóvil (CUP) o EnZona al momento de coordinar despacho.', margin, currentY + 11);
  doc.text('• Efectivo (CUP o USD) al recibir en Almacén o por mensajería.', margin, currentY + 16);
  doc.text('• Confirmación inmediata a través de WhatsApp comercial: +53 50000000.', margin, currentY + 21);

  currentY += summaryBoxHeight + 12;

  // 6. Guarantee & Footer
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  currentY += 5;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Motopartes de Cuba S.R.L. garantiza la autenticidad y estado nuevo de los repuestos contra defectos de fabricación.',
    pageWidth / 2,
    currentY,
    { align: 'center' }
  );

  currentY += 4;
  doc.text(
    'Almacén Central: Calle 100 y Boyeros, La Habana, Cuba | Contacto: +53 50000000 | info@motopartescuba.cu',
    pageWidth / 2,
    currentY,
    { align: 'center' }
  );

  // Trigger browser download
  const sanitizedName = customer.name.trim().replace(/[^a-zA-Z0-9]/g, '_') || 'Cliente';
  doc.save(`Cotizacion_Motopartes_${sanitizedName}_${resolvedOrderId}.pdf`);
}
