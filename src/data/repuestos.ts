import { Repuesto } from '../types';

export const REPUESTOS: Repuesto[] = [
  // --- MZ 250 / 150 ---
  {
    id: 'mz-cilindro-250',
    name: 'Kit Cilindro + Pistón + Aros 69.00mm MZ ETZ 250',
    code: 'MZ-ENG-01',
    model: 'MZ',
    modelLabel: 'MZ ETZ 250 / TS 250',
    category: 'motor',
    categoryLabel: 'Motor y Cilindrada',
    priceCUP: 32500,
    priceUSD: 95,
    stock: 'disponible',
    stockCount: 8,
    origin: 'Alemania Estándar OEM',
    description: 'Cilindro rectificado con camisa de hierro fundido nodular de alta resistencia al calor. Incluye pistón de aleación de aluminio ligero, 2 aros de compresión cromados, pasador 18mm y circlips.',
    specs: {
      'Diámetro estándar': '69.00 mm',
      'Cilindrada': '243 cc',
      'Pasador de pistón': '18 mm',
      'Material pistón': 'Aluminio forjado Al-Si',
      'Tolerancia de montaje': '0.04 mm'
    },
    compatibility: ['MZ ETZ 250', 'MZ TS 250/1', 'MZ ETZ 251'],
    image: '/src/assets/images/category_engine_parts_1792157004705.jpg',
    isFeatured: true
  },
  {
    id: 'mz-carburador-bvf',
    name: 'Carburador BVF 30N3-1 Original MZ ETZ 250',
    code: 'MZ-CARB-01',
    model: 'MZ',
    modelLabel: 'MZ ETZ 250',
    category: 'carburacion',
    categoryLabel: 'Carburación y Combustible',
    priceCUP: 21000,
    priceUSD: 62,
    stock: 'disponible',
    stockCount: 12,
    origin: 'Berliner Vergaser-Fabrik (Alemania)',
    description: 'Carburador con estárter de émbolo y circuito de ralentí optimizado para menor consumo y respuesta instantánea. Calibrado de fábrica con chiclé principal 130.',
    specs: {
      'Difusor': '30 mm',
      'Chiclé principal': '130',
      'Chiclé de ralentí': '40',
      'Conexión al motor': '35 mm brida'
    },
    compatibility: ['MZ ETZ 250', 'MZ TS 250'],
    image: '/src/assets/images/category_carburetor_parts_1792157005756.jpg',
    isFeatured: true
  },
  {
    id: 'mz-ciguenal-etz',
    name: 'Cigüeñal Reforzado Completo MZ ETZ 250',
    code: 'MZ-ENG-02',
    model: 'MZ',
    modelLabel: 'MZ ETZ 250',
    category: 'motor',
    categoryLabel: 'Motor y Cilindrada',
    priceCUP: 48000,
    priceUSD: 140,
    stock: 'bajo_stock',
    stockCount: 3,
    origin: 'Taiwán Grado Competición',
    description: 'Cigüeñal balanceado con contrapesos forjados y biela pulida con jaula de agujas de plata para soportar altas revoluciones sin juego axial.',
    specs: {
      'Carrera': '65 mm',
      'Diámetro muñón biela': '25 mm',
      'Jaula biela inferior': 'Con rodamientos de aguja plateados',
      'Conicidad volante': '1:5'
    },
    compatibility: ['MZ ETZ 250', 'MZ ETZ 251'],
    image: '/src/assets/images/category_engine_parts_1792157004705.jpg'
  },
  {
    id: 'mz-encendido-cdi',
    name: 'Kit Encendido Electrónico CDI 12V 150W MZ',
    code: 'MZ-ELE-01',
    model: 'MZ',
    modelLabel: 'MZ ETZ 250 / TS 250',
    category: 'electrico',
    categoryLabel: 'Sistema Eléctrico y Encendido',
    priceCUP: 38000,
    priceUSD: 110,
    stock: 'disponible',
    stockCount: 6,
    origin: 'Vape Replica / Taiwán',
    description: 'Elimina para siempre los platinos y condensadores. Genera chispa potente a cualquier régimen y alimenta luces LED sin descargar la batería.',
    specs: {
      'Potencia generador': '12V / 150 Watts',
      'Componentes': 'Rotor, estator, bobina CDI, regulador',
      'Sin mantenimiento': '100% digital sin platinos'
    },
    compatibility: ['MZ ETZ 250', 'MZ TS 250', 'MZ ETZ 150', 'MZ TS 150'],
    image: '/src/assets/images/category_transmission_parts_1792157005308.jpg',
    isFeatured: true
  },
  {
    id: 'mz-embrague-discos',
    name: 'Juego de Discos de Embrague Ferodo MZ 250',
    code: 'MZ-TRM-01',
    model: 'MZ',
    modelLabel: 'MZ ETZ / TS 250',
    category: 'transmision',
    categoryLabel: 'Transmisión y Embrague',
    priceCUP: 12500,
    priceUSD: 36,
    stock: 'disponible',
    stockCount: 15,
    origin: 'Alemania / Repuesto OEM',
    description: 'Set de 5 discos de fricción con compuesto de fibra aramida resistente al deslizamiento y desgaste prematuro por calor.',
    specs: {
      'Cantidad': '5 discos de fricción',
      'Material': 'Aramida y corcho sintético',
      'Uso': 'Baño de aceite SAE 80W90'
    },
    compatibility: ['MZ ETZ 250', 'MZ TS 250', 'MZ ETZ 251'],
    image: '/src/assets/images/category_transmission_parts_1792157005308.jpg'
  },
  {
    id: 'mz-cadena-secundaria',
    name: 'Cadena Secundaria 428H MZ + Mangueras Guía Goma',
    code: 'MZ-TRM-02',
    model: 'MZ',
    modelLabel: 'MZ ETZ 250 / 150',
    category: 'transmision',
    categoryLabel: 'Transmisión y Embrague',
    priceCUP: 16000,
    priceUSD: 47,
    stock: 'disponible',
    stockCount: 9,
    origin: 'KMC / Chequia',
    description: 'Cadena reforzada de 128 eslabones acompañada de los tubos protectores de goma originales MZ que previenen la entrada de polvo y aumentan su vida útil.',
    specs: {
      'Paso': '428H reforzada',
      'Eslabones': '128 pasos con unión rápida',
      'Incluye': '2 mangueras fuelle de goma anti-polvo'
    },
    compatibility: ['MZ ETZ 250', 'MZ ETZ 150', 'MZ TS 250'],
    image: '/src/assets/images/category_transmission_parts_1792157005308.jpg'
  },

  // --- SUZUKI GN125 ---
  {
    id: 'gn-kit-arrastre',
    name: 'Kit de Arrastre Reforzado 428H Gold O-Ring GN125',
    code: 'GN-TRM-01',
    model: 'GN125',
    modelLabel: 'Suzuki GN125H / GN125F',
    category: 'transmision',
    categoryLabel: 'Transmisión y Embrague',
    priceCUP: 19500,
    priceUSD: 57,
    stock: 'disponible',
    stockCount: 14,
    origin: 'Taiwán Grado A',
    description: 'Piñón de ataque 14T de acero tratado, corona trasera de 43T templada y cadena dorada con retenes O-Ring que retienen la lubricación y reducen el estiramiento.',
    specs: {
      'Paso de cadena': '428H con O-Ring dorado',
      'Piñón delantero': '14 Dientes (Acero 20CrMo)',
      'Corona trasera': '43 Dientes (Acero al carbono 1045)',
      'Durabilidad': 'Más de 20,000 km con mantenimiento'
    },
    compatibility: ['Suzuki GN125H', 'Suzuki GN125F', 'Suzuki GS125', 'Suzuki EN125'],
    image: '/src/assets/images/category_transmission_parts_1792157005308.jpg',
    isFeatured: true
  },
  {
    id: 'gn-cilindro-kit',
    name: 'Kit Cilindro + Pistón 57mm Completo Suzuki GN125',
    code: 'GN-ENG-01',
    model: 'GN125',
    modelLabel: 'Suzuki GN125',
    category: 'motor',
    categoryLabel: 'Motor y Cilindrada',
    priceCUP: 28500,
    priceUSD: 83,
    stock: 'disponible',
    stockCount: 10,
    origin: 'Taiwán OEM Suzuki Standard',
    description: 'Bloque de cilindro con aletas de refrigeración sobredimensionadas. Incluye pistón 57mm con baño de teflón lateral, pasador 14mm, anillos japoneses RIK y juego de juntas de culata.',
    specs: {
      'Diámetro': '57.00 mm Standard',
      'Cilindrada': '124 cc 4T',
      'Pasador': '14 mm',
      'Compresión nominal': '9.5:1',
      'Anillos': 'Juego 3 piezas RIK Japón'
    },
    compatibility: ['Suzuki GN125', 'Suzuki GS125', 'Suzuki EN125-2A'],
    image: '/src/assets/images/category_engine_parts_1792157004705.jpg',
    isFeatured: true
  },
  {
    id: 'gn-carburador-mikuni',
    name: 'Carburador de Vacío Mikuni 26mm Suzuki GN125',
    code: 'GN-CARB-01',
    model: 'GN125',
    modelLabel: 'Suzuki GN125H / GN125F',
    category: 'carburacion',
    categoryLabel: 'Carburación y Combustible',
    priceCUP: 22000,
    priceUSD: 65,
    stock: 'disponible',
    stockCount: 8,
    origin: 'Japón Licensed / Keihin Tech',
    description: 'Carburador de diafragma al vacío con bomba de pique para aceleraciones limpias sin ahogos. Arranque en frío inmediato y consumo eficiente de combustible.',
    specs: {
      'Venturi': '26 mm',
      'Tipo': 'Vacío constante con diafragma de goma nitrilo',
      'Chiclé alta': '102.5',
      'Conexión filtro': '45 mm'
    },
    compatibility: ['Suzuki GN125H', 'Suzuki GN125F', 'Suzuki GS125'],
    image: '/src/assets/images/category_carburetor_parts_1792157005756.jpg'
  },
  {
    id: 'gn-estator-bobinas',
    name: 'Estator de 8 Bobinas con Captador Suzuki GN125',
    code: 'GN-ELE-01',
    model: 'GN125',
    modelLabel: 'Suzuki GN125',
    category: 'electrico',
    categoryLabel: 'Sistema Eléctrico y Encendido',
    priceCUP: 15500,
    priceUSD: 45,
    stock: 'disponible',
    stockCount: 11,
    origin: 'India OEM Minda',
    description: 'Estator bobinado en cobre electrolítico de alta pureza con resistencia a altas temperaturas del aceite de cárter. Incluye sensor de pulso y conector original.',
    specs: {
      'Bobinas': '8 núcleos magnéticos',
      'Voltaje': '12V DC',
      'Resistencia pulso': '120 Ohm ± 10%'
    },
    compatibility: ['Suzuki GN125', 'Suzuki GS125', 'Suzuki EN125'],
    image: '/src/assets/images/category_engine_parts_1792157004705.jpg'
  },
  {
    id: 'gn-amortiguadores',
    name: 'Par de Amortiguadores Traseros Reforzados GN125',
    code: 'GN-SUS-01',
    model: 'GN125',
    modelLabel: 'Suzuki GN125',
    category: 'suspension',
    categoryLabel: 'Chasis y Suspensión',
    priceCUP: 24000,
    priceUSD: 70,
    stock: 'disponible',
    stockCount: 7,
    origin: 'Taiwán Heavy Duty',
    description: 'Amortiguadores hidráulicos de doble tubo con vástago de 12mm cromado duro y resorte de paso variable con 5 posiciones de precarga ajustables.',
    specs: {
      'Largo entre ejes': '315 mm',
      'Regulación': '5 puntos de tensión',
      'Buje superior': '12 mm',
      'Buje inferior': '10 mm'
    },
    compatibility: ['Suzuki GN125', 'Suzuki GS125', 'Motos chinas 125/150'],
    image: '/src/assets/images/category_transmission_parts_1792157005308.jpg'
  },
  {
    id: 'gn-pastillas-freno',
    name: 'Pastillas de Freno Delantero Cerámicas GN125',
    code: 'GN-BRK-01',
    model: 'GN125',
    modelLabel: 'Suzuki GN125',
    category: 'frenos',
    categoryLabel: 'Frenos y Cables',
    priceCUP: 6500,
    priceUSD: 19,
    stock: 'disponible',
    stockCount: 25,
    origin: 'Brasil Fras-Le',
    description: 'Pastillas de compuesto cerámico de bajo desgaste que ofrecen frenada progresiva y no rayan el disco de freno bajo lluvia o calor intenso.',
    specs: {
      'Compuesto': 'Cerámico sinterizado semi-metálico',
      'Posición': 'Caliper delantero',
      'Resistencia térmica': 'Hasta 450°C'
    },
    compatibility: ['Suzuki GN125H', 'Suzuki GN125F', 'Suzuki AX4'],
    image: '/src/assets/images/category_transmission_parts_1792157005308.jpg'
  },

  // --- SUZUKI AX100 ---
  {
    id: 'ax-cilindro-kit',
    name: 'Kit Cilindro + Pistón 50.00mm Suzuki AX100 Japón Quality',
    code: 'AX-ENG-01',
    model: 'AX100',
    modelLabel: 'Suzuki AX100 Especial 2T',
    category: 'motor',
    categoryLabel: 'Motor y Cilindrada',
    priceCUP: 26000,
    priceUSD: 76,
    stock: 'disponible',
    stockCount: 16,
    origin: 'Japón Tech / Taiwán',
    description: 'El clásico cilindro de 2 tiempos de 5 transferencias con tobera pulida. Entrega la compresión y potencia exacta del motor AX100 sin vibraciones excesivas.',
    specs: {
      'Diámetro': '50.00 mm STD',
      'Cilindrada': '98 cc 2T',
      'Pasador': '12 mm con canastilla',
      'Transferencias': '5 lumbreras de barrido'
    },
    compatibility: ['Suzuki AX100', 'Suzuki AX115'],
    image: '/src/assets/images/category_engine_parts_1792157004705.jpg',
    isFeatured: true
  },
  {
    id: 'ax-carburador-mikuni',
    name: 'Carburador Mikuni VM20 Original Suzuki AX100',
    code: 'AX-CARB-01',
    model: 'AX100',
    modelLabel: 'Suzuki AX100',
    category: 'carburacion',
    categoryLabel: 'Carburación y Combustible',
    priceCUP: 16500,
    priceUSD: 48,
    stock: 'disponible',
    stockCount: 18,
    origin: 'Mikuni Japan Licensed',
    description: 'Carburador de corredera cilíndrica de respuesta instantánea. Mantiene el ralentí estable y entrega mezcla precisa de aceite y gasolina.',
    specs: {
      'Difusor': '20 mm corredera redonda',
      'Chiclé principal': '92.5',
      'Chiclé de baja': '22.5',
      'Filtro de aire': 'Acople de 38 mm'
    },
    compatibility: ['Suzuki AX100', 'Suzuki AX100 Especial'],
    image: '/src/assets/images/category_carburetor_parts_1792157005756.jpg',
    isFeatured: true
  },
  {
    id: 'ax-ciguenal-completo',
    name: 'Cigüeñal Ensamblado con Biela Japonesa AX100',
    code: 'AX-ENG-02',
    model: 'AX100',
    modelLabel: 'Suzuki AX100',
    category: 'motor',
    categoryLabel: 'Motor y Cilindrada',
    priceCUP: 34000,
    priceUSD: 100,
    stock: 'disponible',
    stockCount: 5,
    origin: 'Taiwán Grado A',
    description: 'Cigüeñal balanceado con muñón de alta resistencia y jaula de agujas de biela tratada térmicamente para evitar agarre a altas revoluciones.',
    specs: {
      'Carrera': '50 mm',
      'Rodamientos': 'Compatible con 6204 y 6304 C3',
      'Biela': 'Forjada en acero cromo-molibdeno'
    },
    compatibility: ['Suzuki AX100'],
    image: '/src/assets/images/category_engine_parts_1792157004705.jpg'
  },
  {
    id: 'ax-plato-bobinas',
    name: 'Plato de Bobinas de Encendido 12V AX100',
    code: 'AX-ELE-01',
    model: 'AX100',
    modelLabel: 'Suzuki AX100',
    category: 'electrico',
    categoryLabel: 'Sistema Eléctrico y Encendido',
    priceCUP: 13500,
    priceUSD: 40,
    stock: 'disponible',
    stockCount: 14,
    origin: 'Taiwán OEM',
    description: 'Plato de bobinas para conversión o mantenimiento a 12V. Proporciona chispa firme y buena potencia de iluminación del faro delantero.',
    specs: {
      'Voltaje': '12V',
      'Bobinas': 'Carga y encendido primario',
      'Instalación': 'Directa sin modificaciones al cárter'
    },
    compatibility: ['Suzuki AX100', 'Suzuki AX100 Especial'],
    image: '/src/assets/images/category_engine_parts_1792157004705.jpg'
  },
  {
    id: 'ax-embrague-discos',
    name: 'Juego de Discos de Embrague (5 Piezas) AX100',
    code: 'AX-TRM-01',
    model: 'AX100',
    modelLabel: 'Suzuki AX100',
    category: 'transmision',
    categoryLabel: 'Transmisión y Embrague',
    priceCUP: 7500,
    priceUSD: 22,
    stock: 'disponible',
    stockCount: 20,
    origin: 'F.C.C. Japón Style',
    description: 'Discos de fricción en corcho aglomerado de alta densidad. Agarre seguro sin resbalamiento ni quemaduras en arrancadas fuertes.',
    specs: {
      'Cantidad': '5 discos',
      'Espesor estándar': '3.0 mm',
      'Tipo': 'Húmedo multidisco'
    },
    compatibility: ['Suzuki AX100', 'Suzuki TR125'],
    image: '/src/assets/images/category_transmission_parts_1792157005308.jpg'
  },
  {
    id: 'ax-tubo-escape',
    name: 'Tubo de Escape Cromado Original Suzuki AX100',
    code: 'AX-EXH-01',
    model: 'AX100',
    modelLabel: 'Suzuki AX100',
    category: 'suspension',
    categoryLabel: 'Chasis y Suspensión',
    priceCUP: 29000,
    priceUSD: 85,
    stock: 'disponible',
    stockCount: 4,
    origin: 'Taiwán Triple Cromo',
    description: 'Silenciador con cámara de resonancia calculada para el motor 2T del AX100. Cromado grueso resistente al óxido y silenciador interior desmontable.',
    specs: {
      'Acabado': 'Cromo espejo de 3 capas',
      'Silenciador': 'Bafle interior desmontable para limpieza',
      'Sonido': 'Típico tono seco metálico AX100'
    },
    compatibility: ['Suzuki AX100'],
    image: '/src/assets/images/category_engine_parts_1792157004705.jpg'
  },

  // --- KARPATY 50 ---
  {
    id: 'kp-piston-kit',
    name: 'Kit Pistón + Aros 38.00mm STD Motor V-50 Karpaty 50',
    code: 'KP-ENG-01',
    model: 'Karpaty',
    modelLabel: 'Karpaty 50 / Delta / Riga',
    category: 'motor',
    categoryLabel: 'Motor y Cilindrada',
    priceCUP: 11000,
    priceUSD: 32,
    stock: 'disponible',
    stockCount: 7,
    origin: 'Chequia / Rusia OEM Spec',
    description: 'Pistón original para los legendarios motores soviéticos V-50 y V-50M. Incluye aros de compresión de hierro fundido fino y pasador de 10mm.',
    specs: {
      'Diámetro': '38.00 mm (Cero)',
      'Cilindrada': '49.8 cc 2T',
      'Pasador': '10 mm',
      'Aros': '2 aros rectificados'
    },
    compatibility: ['Karpaty 50', 'Delta 50', 'Riga 50', 'Verjovina'],
    image: '/src/assets/images/category_engine_parts_1792157004705.jpg',
    isFeatured: true
  },
  {
    id: 'kp-carburador-k60v',
    name: 'Carburador K60V Original Motor V-50 Karpaty',
    code: 'KP-CARB-01',
    model: 'Karpaty',
    modelLabel: 'Karpaty 50 / Riga',
    category: 'carburacion',
    categoryLabel: 'Carburación y Combustible',
    priceCUP: 14500,
    priceUSD: 42,
    stock: 'disponible',
    stockCount: 9,
    origin: 'KVR Pekar Reedición',
    description: 'Carburador compacto con cuba lateral y botón cebador manual. Afinación sencilla con tornillo de aire y aguja de 3 posiciones.',
    specs: {
      'Difusor': '14 mm',
      'Chiclé': '62',
      'Fijación': 'Brida de 2 tornillos al cilindro V-50'
    },
    compatibility: ['Karpaty 50', 'Delta 50', 'Riga 22'],
    image: '/src/assets/images/category_carburetor_parts_1792157005756.jpg',
    isFeatured: true
  },
  {
    id: 'kp-conmutador-cdi',
    name: 'Conmutador Electrónico KET-1A / CDI Karpaty 50',
    code: 'KP-ELE-01',
    model: 'Karpaty',
    modelLabel: 'Karpaty 50',
    category: 'electrico',
    categoryLabel: 'Sistema Eléctrico y Encendido',
    priceCUP: 9500,
    priceUSD: 28,
    stock: 'disponible',
    stockCount: 12,
    origin: 'Polonia / Lituania',
    description: 'Módulo de encendido de estado sólido para alternadores magnéticos de Karpaty. Provee chispa continua sin necesidad de batería.',
    specs: {
      'Voltaje de trabajo': '6V / 12V',
      'Tecnología': 'Tiristor de alta velocidad',
      'Conexiones': '4 bornes roscados rotulados'
    },
    compatibility: ['Karpaty 50', 'Delta 50', 'Riga 50'],
    image: '/src/assets/images/category_transmission_parts_1792157005308.jpg'
  },
  {
    id: 'kp-juntas-retenes',
    name: 'Juego de Juntas de Motor y Retenes NBR Karpaty V-50',
    code: 'KP-ENG-02',
    model: 'Karpaty',
    modelLabel: 'Karpaty 50',
    category: 'motor',
    categoryLabel: 'Motor y Cilindrada',
    priceCUP: 5500,
    priceUSD: 16,
    stock: 'disponible',
    stockCount: 15,
    origin: 'Europa del Este',
    description: 'Juego completo de empacaduras de cárter, base de cilindro, culata de aluminio y retenes de cigüeñal resistentes al combustible.',
    specs: {
      'Contenido': '7 juntas + 4 retenes de aceite',
      'Retenes': 'Caucho NBR de doble labio'
    },
    compatibility: ['Karpaty V-50', 'Karpaty V-50M', 'Delta'],
    image: '/src/assets/images/category_engine_parts_1792157004705.jpg'
  },

  // --- UNIVERSALES Y LUBRICANTES ---
  {
    id: 'uni-bujia-ngk-b8hs',
    name: 'Bujía Japonesa NGK B8HS Rosca Corta (Para 2T)',
    code: 'UNI-ELE-01',
    model: 'Universal',
    modelLabel: 'MZ / AX100 / Karpaty (Rosca Corta)',
    category: 'electrico',
    categoryLabel: 'Sistema Eléctrico y Encendido',
    priceCUP: 2800,
    priceUSD: 8,
    stock: 'disponible',
    stockCount: 50,
    origin: 'NGK Spark Plug Co. Japón',
    description: 'Electrodo central de níquel con núcleo de cobre para máxima disipación térmica en motores de dos tiempos exigidos como MZ y AX100.',
    specs: {
      'Grado térmico': '8 (Fría/Media para 2T)',
      'Rosca': '14 mm x 1.25',
      'Largo de rosca': '12.7 mm (Corta)',
      'Apertura electrodo': '0.6 mm'
    },
    compatibility: ['MZ ETZ 250', 'MZ TS 250', 'Suzuki AX100', 'Karpaty 50', 'Jawa 350'],
    image: '/src/assets/images/category_engine_parts_1792157004705.jpg'
  },
  {
    id: 'uni-bujia-ngk-d8ea',
    name: 'Bujía Japonesa NGK D8EA Rosca Larga (Para GN125)',
    code: 'UNI-ELE-02',
    model: 'Universal',
    modelLabel: 'Suzuki GN125 (Rosca Larga 4T)',
    category: 'electrico',
    categoryLabel: 'Sistema Eléctrico y Encendido',
    priceCUP: 3000,
    priceUSD: 9,
    stock: 'disponible',
    stockCount: 45,
    origin: 'NGK Spark Plug Co. Japón',
    description: 'Bujía estándar para motores Suzuki 4 tiempos de 125cc a 250cc. Excelente encendido en frío y nula formación de carbonilla.',
    specs: {
      'Rosca': '12 mm',
      'Largo de rosca': '19.0 mm',
      'Hexágono': '18 mm',
      'Grado térmico': '8'
    },
    compatibility: ['Suzuki GN125', 'Suzuki GS125', 'Suzuki EN125', 'Motos chinas 4T'],
    image: '/src/assets/images/category_engine_parts_1792157004705.jpg'
  },
  {
    id: 'uni-filtro-gasolina-aluminio',
    name: 'Filtro de Gasolina Desarmable de Cristal y Aluminio CNC',
    code: 'UNI-CARB-01',
    model: 'Universal',
    modelLabel: 'Universal todas las motos',
    category: 'carburacion',
    categoryLabel: 'Carburación y Combustible',
    priceCUP: 3500,
    priceUSD: 10,
    stock: 'disponible',
    stockCount: 30,
    origin: 'Taiwán CNC',
    description: 'Cuerpo de vidrio templado transparente para inspeccionar el flujo y malla de bronce lavable. Evita que impurezas de tanques viejos tapen los chiclés.',
    specs: {
      'Entrada/Salida': 'Para manguera de 6mm y 8mm',
      'Malla filtrante': 'Bronce micrónico lavable',
      'Material': 'Aluminio anodizado y vidrio templado'
    },
    compatibility: ['MZ', 'GN125', 'AX100', 'Karpaty', 'Universal'],
    image: '/src/assets/images/category_carburetor_parts_1792157005756.jpg'
  }
];

export const CATEGORIAS = [
  { id: 'all', label: 'Todas las Categorías' },
  { id: 'motor', label: 'Motor y Cilindrada' },
  { id: 'transmision', label: 'Transmisión y Embrague' },
  { id: 'carburacion', label: 'Carburación y Combustible' },
  { id: 'electrico', label: 'Sistema Eléctrico' },
  { id: 'frenos', label: 'Frenos y Cables' },
  { id: 'suspension', label: 'Chasis y Suspensión' },
];

export const MODELOS_MOTO = [
  { id: 'all', label: 'Todos los Modelos', badge: 'Catálogo General' },
  { id: 'MZ', label: 'MZ 250 / 150', badge: 'ETZ 250 · TS 250 · ETZ 150' },
  { id: 'GN125', label: 'Suzuki GN125', badge: 'GN125H · GN125F · 4T' },
  { id: 'AX100', label: 'Suzuki AX100', badge: 'Especial 2 Tiempos' },
  { id: 'Karpaty', label: 'Karpaty 50', badge: 'V-50 · V-50M · Delta' },
];
