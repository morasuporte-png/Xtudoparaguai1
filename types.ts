
export enum UserRole {
  BUYER = 'buyer',
  SELLER = 'seller',
  WHOLESALE = 'wholesale',
  INVESTOR = 'investor',
  ADMIN = 'admin'
}

export type CategorySlug =
  | 'mais-vendidos' | 'ofertas' | 'celulares' | 'apple' | 'games'
  | 'notebook' | 'perfumes' | 'relogios' | 'drones' | 'audio'
  | 'smartwatch' | 'cameras' | 'casa' | 'pet' | 'infantil' | 'moda';

export interface ProductVariation {
  label: string;    // ex: 'Cor' ou 'Tamanho'
  options: { value: string; stock: number }[];
}

export interface ProductDraft {
  title: string;
  category: string;
  subCategory: string;
  subSubCategory?: string;
  description: string;
  brand: string;
  condition: 'new' | 'refurbished' | 'original';
  origin: string;
  specs: { key: string; value: string }[];
  images: string[];
  priceBRL: number | '';
  comparePriceBRL: number | '';
  stock: number | '';
  sku: string;
  warranty: string;
  shipping: 'included' | 'buyer' | 'free';
  deliveryDays: number;
  variations: ProductVariation[];
}

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  category: string;
  sub_category?: string;
  sub_sub_category?: string;
  title: string;
  description: string;
  priceBRL: number;
  comparePriceBRL: number; // Price in traditional BR retail
  stock: number;
  rating: number;
  images: string[];
  specs: Record<string, string>;
  isVerified: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Order {
  id: string;
  buyerId: string;
  items: OrderItem[];
  totalBRL: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'pix' | 'credit_card' | 'boleto';
  trackingCode?: string;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  priceBRL: number;
}

export interface MetricData {
  name: string;
  value: number;
  change: number;
  prefix?: string;
  suffix?: string;
}
