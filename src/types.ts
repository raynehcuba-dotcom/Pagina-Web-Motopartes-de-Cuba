export type MotorcycleModel = 'all' | 'MZ' | 'GN125' | 'AX100' | 'Karpaty' | 'Universal';

export type Category = 
  | 'all' 
  | 'motor' 
  | 'transmision' 
  | 'electrico' 
  | 'carburacion' 
  | 'frenos' 
  | 'suspension' 
  | 'accesorios';

export type StockStatus = 'disponible' | 'bajo_stock' | 'encargo';

export interface Repuesto {
  id: string;
  name: string;
  code: string;
  model: MotorcycleModel;
  modelLabel: string;
  category: Category;
  categoryLabel: string;
  priceCUP: number;
  priceUSD: number;
  stock: StockStatus;
  stockCount: number;
  origin: string;
  description: string;
  specs: Record<string, string>;
  compatibility: string[];
  image: string;
  isFeatured?: boolean;
}

export interface CartItem {
  repuesto: Repuesto;
  quantity: number;
}

export type Currency = 'CUP' | 'USD';

export interface OrderCustomerInfo {
  name: string;
  phone: string;
  province: string;
  municipality: string;
  deliveryMethod: 'recogida_almacen' | 'envio_mensajeria' | 'envio_provincial';
  notes: string;
}
