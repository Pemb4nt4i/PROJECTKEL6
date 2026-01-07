
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
}

export interface SaleItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  timestamp: number;
  items: SaleItem[];
  total: number;
  profit: number;
}

export type ViewType = 'dashboard' | 'pos' | 'inventory' | 'sales-history' | 'settings';
