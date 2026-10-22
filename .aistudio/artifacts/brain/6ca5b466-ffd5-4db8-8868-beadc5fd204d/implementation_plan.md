# Motopartes de Cuba S.R.L — Plataforma y Catálogo de Repuestos de Motos

Plataforma web comercial y catálogo interactivo de alta gama para la comercializadora MIPYME **Motopartes de Cuba S.R.L**, especializada en piezas y repuestos para motocicletas icónicas en el parque vehicular cubano (MZ 250/150, Suzuki GN125, Suzuki AX100 y Karpaty 50), con filtro inteligente por modelo, base de datos en tiempo real con Firebase Firestore, sistema de favoritos con persistencia local, notificaciones push de nuevos repuestos (FCM y navegador), comparador técnico de hasta 3 piezas y generador automático de pedidos formateados para WhatsApp.

---

> [!IMPORTANT]
> **Identidad de Marca y Decisiones Técnicas Implementadas**:
> - **Nombre Comercial**: Motopartes de Cuba S.R.L.
> - **Logo Oficial**: Silueta deportiva de motocicleta de carreras en rojo vivo sobre el logotipo "MOTO" (con ruedas de llanta en las 'O') y "PARTES" inferior, implementado en SVG vectorial ultranítido (`/src/components/Logo.tsx`, `/public/logo.svg`).
> - **Paleta de Colores Oficial**: Rojo competición (`#dc2626` / `#ef4444`), negro carbón de taller (`#0a0c10` / `#12151e`), detalles metálicos plateados y acentos verdes de confirmación (`#10b981`).
> - **Lista de Favoritos ('Favoritos')**: Sistema de guardado rápido con ícono de corazón en tarjetas y fichas técnicas, persistido en `localStorage` con la clave `motopartes_cuba_favorites`, contador en la barra de navegación, filtro rápido en el catálogo y modal dedicado para gestionar, cotizar o consultar la lista completa por WhatsApp.
> - **Notificaciones Push y Alertas de Catálogo**: Arquitectura Firebase Cloud Messaging (`/public/firebase-messaging-sw.js` y `/src/lib/notifications.ts`) combinada con listener en tiempo real de Firestore. Alerta al usuario en su dispositivo tan pronto un nuevo repuesto entra al catálogo, con panel de control de permisos y prueba inmediata de push en un clic.
> - **Persistencia y Base de Datos**: Firebase Firestore provisionado y enlazado en tiempo real con fallback inteligente y panel de administración de inventario.
> - **Comparador de Repuestos**: Selector y modal comparativo de hasta 3 piezas técnicas en paralelo con barra flotante inferior.

---

## 1. Módulos y Funcionalidades Activas

1. **Barra de Navegación (`Navbar.tsx`)**:
   - Logotipo oficial de Motopartes de Cuba S.R.L. con enlace de inicio.
   - Barra de búsqueda predictiva con autocompletado en tiempo real y priorización por modelo de moto seleccionado.
   - Campana de Notificaciones Push con insignia de avisos no leídos y acceso al centro de alertas.
   - Botón de **Favoritos** con ícono de corazón y contador dinámico de piezas guardadas.
   - Selector rápido de moneda (CUP / USD con tasa fija 1:340).
   - **Interruptor de temas Claro/Oscuro** con persistencia en `localStorage` (`motopartes_cuba_theme`) e íconos interactivos Sol/Luna.
   - Acceso al gestor de inventario Firestore para administradores.
   - Botón de Pedido con contador de unidades añadidas.

2. **Lista de Deseos / Favoritos (`FavoritesModal.tsx`, `ProductCard.tsx`, `ProductModal.tsx`)**:
   - Botón táctil con ícono de corazón en cada tarjeta de repuesto y dentro del modal de detalles.
   - Persistencia automática en el navegador mediante `motopartes_cuba_favorites`.
   - Filtro directo "Mis Favoritos (N)" en la barra de filtros del catálogo.
   - Modal de favoritos con vista detallada, adición masiva o individual al pedido y consulta directa de toda la lista por WhatsApp.

3. **Notificaciones Push y Alertas en Vivo (`NotificationCenterModal.tsx`, `notifications.ts`, `firebase-messaging-sw.js`)**:
   - Soporte para notificaciones push en navegador y Service Worker de FCM.
   - Detección automática en tiempo real cuando se añade un repuesto a la base de datos Firestore.
   - Despacho de notificación al sistema operativo (si los permisos están concedidos) y banner interactivo en pantalla con botón "Ver Pieza".
   - Historial de avisos y botón "Probar Alerta Push Ahora" para verificar funcionamiento.

4. **Catálogo y Fichas Técnicas (`Catalog.tsx`, `ProductCard.tsx`, `ProductModal.tsx`)**:
   - Segmentación por modelo (MZ 250, GN125, AX100, Karpaty 50, Universal).
   - Filtros de categorías técnicas (Motor, Transmisión, Sistema Eléctrico, Carburación, Frenos, Chasis).
   - Carrusel de piezas vistas recientemente (últimas 5 piezas consultadas).
   - Fichas completas con especificaciones mecánicas detalladas, compatibilidad comprobada y garantía de control de calidad.

5. **Comparador de Repuestos (`ProductCompareModal.tsx`, `CompareFloatingBar.tsx`)**:
   - Selección de hasta 3 piezas para comparar tabla de especificaciones lado a lado, precios y compatibilidad.

6. **Logística y Contacto Directo (`CartDrawer.tsx`, `CustomOrderSection.tsx`, `WarehouseDeliveryInfo.tsx`, `Footer.tsx`)**:
   - Drawer de cotización con formulario de cliente para recogida en La Habana o mensajería/envío provincial.
   - Formulario de encargos especiales para piezas escasas o difíciles de encontrar.
   - Conexión directa a WhatsApp con mensajes tabulados y formateados automáticamente.
