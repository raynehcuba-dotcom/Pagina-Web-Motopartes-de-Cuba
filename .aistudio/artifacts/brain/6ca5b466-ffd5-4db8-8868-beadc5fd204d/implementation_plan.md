# Motopartes de Cuba S.R.L — Plataforma y Catálogo de Repuestos de Motos

Plataforma web comercial y catálogo interactivo de alta gama para la comercializadora MIPYME **Motopartes de Cuba S.R.L**, especializada en piezas y repuestos para motocicletas icónicas en el parque vehicular cubano (MZ 250/150, Suzuki GN125, Suzuki AX100 y Karpaty 50), con filtro inteligente por modelo, carrito cotizador multimoneda (CUP/USD) y generador automático de pedidos formateados para WhatsApp.

---

> [!IMPORTANT]
> **Decisiones Críticas y Preferencias Confirmadas**:
> - **Nombre Comercial**: Motopartes de Cuba S.R.L.
> - **Función Principal**: Catálogo interactivo de repuestos con ficha técnica, carrito cotizador y generación de pedidos directos estructurados para WhatsApp.
> - **Filtros y Búsqueda**: Segmentación instantánea por modelo de moto (MZ, GN125, AX100, Karpaty), categoría de componente (Motor, Transmisión, Sistema Eléctrico, Carburación/Combustible, Frenos, Suspensión y Chasis) y buscador rápido por nombre o código de pieza.
> - **Dirección Estética**: Taller moderno y potente con paleta oscura (fondo carbón `#0f1115`, superficies de acero grafito `#1b1e24`), tipografía industrial estructurada y acento ámbar/naranja automotriz (`#f59e0b` / `#ea580c`).

---

## 1. Visión General y Concepto Central

- **Propósito**: Proveer a los motociclistas, mecánicos de taller y clientes particulares en Cuba una plataforma rápida, visualmente atractiva y optimizada para conexiones móviles, donde puedan consultar disponibilidad real de piezas, verificar compatibilidad exacta con su modelo y coordinar compras o envíos inmediatos por WhatsApp sin fricciones.
- **Público Objetivo**: Dueños de motos MZ (ETZ 250, TS 250, 150), Suzuki GN125, Suzuki AX100, ciclomotores Karpaty / Delta, mecánicos independientes y talleres de reparación en La Habana y provincias.
- **Propuesta de Valor**: Claridad técnica inmediata (fotos nítidas, especificaciones, procedencia de la pieza, compatibilidad probada), cotización transparente en CUP y USD con tasa de cambio ajustable, y cierre de venta ágil mediante WhatsApp.

---

## 2. Experiencia de Usuario y Diseño Visual

### Flujo de Usuario Principal
1. **Cabecera y Selector Rápido de Moto**: El usuario ingresa y ve una barra de navegación limpia con el selector de modelo insignia: `[Todas]` | `[MZ 250 / 150]` | `[Suzuki GN125]` | `[Suzuki AX100]` | `[Karpaty 50]`.
2. **Hero de Taller Especializado**: Presentación de la MIPYME con credenciales de garantía, piezas originales y alternativas de alta durabilidad, botón directo para ver catálogo o solicitar una pieza por encargo.
3. **Catálogo Interactivo con Filtros Facetados**:
   - Barra de búsqueda por texto (ej. "cilindro", "plato de bobinas", "junta", "carburador Mikuni", "pistón 0 standard").
   - Selector de categorías técnicas: Motor y Cilindrada, Transmisión y Embrague, Sistema Eléctrico y Encendido, Carburación y Filtros, Frenos y Cables, Chasis y Amortiguación.
   - Estado de disponibilidad en stock en tiempo real.
4. **Ficha de Producto (Modal / Detalle)**:
   - Imágenes de alta calidad en fondo neutro de taller.
   - Tabla de compatibilidad de modelos, medidas técnicas y procedencia.
   - Selector de cantidad y botón "Agregar al Pedido" o "Consultar por WhatsApp ahora".
5. **Carrito Cotizador y Generador de Pedido WhatsApp**:
   - Drawer lateral que totaliza artículos, subtotal en CUP y USD.
   - Formulario ligero para nombre del cliente, municipio/provincia y notas de entrega.
   - Botón maestro "Enviar Pedido a WhatsApp" que abre la conversación con un mensaje perfectamente tabulado y formateado.
6. **Módulo de Piezas Bajo Pedido / Taller**:
   - Sección para encargar piezas difíciles de encontrar para MZ o Karpaty con formulario directo.
7. **Información de la MIPYME y Ubicación**:
   - Horarios de atención, dirección física de recogida en almacén/tienda, garantías y canales de contacto oficial.

### Identidad Visual y Estilo de Marca
- **Alineación con Frontend Design & E-Commerce Retail**:
  - **Fondo Neutro Primario (60%)**: `#0d0f12` (carbón profundo de taller mecánico de precisión).
  - **Superficies Estructurales (30%)**: `#16191f` y `#212631` con bordes sutiles en tono acero `rgba(255, 255, 255, 0.08)`.
  - **Acento Energético (10%)**: Ámbar mecánico `#f59e0b` y naranja de impacto `#ea580c` aplicados estrictamente en botones de acción primaria, badges de modelo activo y precio final.
- **Tipografía**:
  - *Titulares y Marca*: `Plus Jakarta Sans` y `Barlow Condensed` / `Outfit` para una presencia automotriz estructurada y legible.
  - *Cuerpo y Fichas*: `Plus Jakarta Sans` para descripciones fluidas.
  - *Precios, Códigos de Pieza y Cotizaciones*: Tipografía tabular y monoespaciada (`font-mono tabular-nums`) para alineación vertical perfecta en listas y totales.
- **Disciplina Anti-Slop**:
  - Cero pills genéricas de colores en datos estáticos; metadatos limpios separados por puntos tipográficos (`·`).
  - Botones con etiquetas humanas y directas ("Agregar al pedido", "Enviar por WhatsApp", "Filtrar").
  - Sin indicadores de estado falsos ni animaciones invasivas.

---

## 3. Decisiones de Producto y Compensaciones Técnicas

- **Persistencia y Estado Local**:
  - *Decisión*: Estado del carrito, selector de moneda (CUP / USD) y lista de repuestos favoritos gestionados mediante React state sincronizado con `localStorage`.
  - *Justificación*: Carga instantánea, sin latencia de red para los usuarios en Cuba y funcionamiento fluido incluso con fluctuaciones de conectividad móvil.
- **Canal de Conversión WhatsApp**:
  - *Decisión*: Los pedidos generan un enlace directo `https://wa.me/...` con codificación URI limpia que incluye el resumen detallado de artículos, códigos, precios y datos del comprador.
  - *Justificación*: Es el estándar comercial más efectivo y habitual para transacciones de MIPYMEs en Cuba, permitiendo acordar entrega, pago por Transfermóvil/EnZona/efectivo y envío provincial.
- **Base de Datos de Repuestos Pre-Cargada y Extensible**:
  - *Decisión*: Catálogo completo de más de 30 repuestos emblemáticos listos para entrega inmediata clasificados por los 4 modelos (MZ, GN125, AX100, Karpaty), con opción para que los administradores busquen, filtren o simulen nuevos ingresos.
  - *Justificación*: Demostración inmediata de valor con datos realistas y vocabulario técnico exacto utilizado en el mercado de motos de Cuba.

---

## 4. Arquitectura del Sistema y Componentes

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Motopartes de Cuba S.R.L                        │
│               Navbar: Marca · Selector de Modelo · Carrito             │
└────────────────────────────────────────────────────────────────────────┘
                                    │
       ┌────────────────────────────┼────────────────────────────┐
       ▼                            ▼                            ▼
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│   Hero & Trust   │      │ Filtros & Buscar │      │  Drawer Carrito  │
│ - Garantía       │      │ - Modelo Moto    │      │ - Items / Cant.  │
│ - Envíos Cuba    │      │ - Categoría      │      │ - Moneda CUP/USD │
│ - Piezas stock   │      │ - Búsqueda texto │      │ - Botón WhatsApp │
└──────────────────┘      └──────────────────┘      └──────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     Rejilla de Repuestos (Grid)                        │
│ ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────┐ │
│ │ Card MZ 250          │ │ Card GN125           │ │ Card AX100       │ │
│ │ Cilindro + Pistón    │ │ Kit Arrastre O-Ring  │ │ Carburador Orig. │ │
│ │ $ CUP / USD · Stock  │ │ $ CUP / USD · Stock  │ │ $ CUP / USD      │ │
│ └──────────────────────┘ └──────────────────────┘ └──────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
                                    │
       ┌────────────────────────────┴────────────────────────────┐
       ▼                                                         ▼
┌──────────────────────────────────┐        ┌──────────────────────────┐
│   Modal Ficha Técnica Repuesto   │        │ Módulo Pedidos Especiales│
│ - Compatibilidad de modelo       │        │ - Pieza no listada       │
│ - Especificaciones mecánicas     │        │ - Asesoría técnica       │
│ - Añadir al carrito              │        │ - Contacto directo       │
└──────────────────────────────────┘        └──────────────────────────┘
```

### Modelos de Datos Clave
- `Repuesto`: ID, nombre, código, modelo (`MZ` | `GN125` | `AX100` | `Karpaty` | `Universal`), categoría, descripción, precioCUP, precioUSD, enStock, procedencia, compatibilidad, imagen.
- `CartItem`: Repuesto asociado, cantidad, precio unitario seleccionado.
- `CustomerOrder`: Lista de ítems, moneda de pago seleccionada, nombre del cliente, teléfono, provincia/municipio, método de entrega.
