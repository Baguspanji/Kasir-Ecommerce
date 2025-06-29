export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  barcodes: string[];
  stock: number;
  image: string;
  'data-ai-hint'?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface DraftCart {
  id: string;
  name: string;
  items: CartItem[];
}

export interface StockItem extends Product {
  threshold: number;
}

export interface Transaction {
  id: number;
  items: CartItem[];
  total: number;
  payment: number;
  change: number;
  date: Date;
  cogs: number;
  profit: number;
  customerName?: string;
  customerPhone?: string;
}

export type NewTransaction = Omit<Transaction, 'id'>;

export interface AppSettings {
  appName: string;
  address: string;
  phone: string;
  receiptFooter: string;
}
