import type { Product, StockItem, Transaction } from "@/types";

export const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: "Espresso", price: 2.5, category: "Coffee", sku: "CF-001", stock: 100, image: "https://placehold.co/300x300.png", 'data-ai-hint': 'espresso coffee' },
  { id: 2, name: "Latte", price: 3.5, category: "Coffee", sku: "CF-002", stock: 100, image: "https://placehold.co/300x300.png", 'data-ai-hint': 'latte art' },
  { id: 3, name: "Cappuccino", price: 3.5, category: "Coffee", sku: "CF-003", stock: 80, image: "https://placehold.co/300x300.png", 'data-ai-hint': 'cappuccino foam' },
  { id: 4, name: "Croissant", price: 2.0, category: "Pastry", sku: "PS-001", stock: 50, image: "https://placehold.co/300x300.png", 'data-ai-hint': 'croissant pastry' },
  { id: 5, name: "Muffin", price: 2.2, category: "Pastry", sku: "PS-002", stock: 60, image: "https://placehold.co/300x300.png", 'data-ai-hint': 'blueberry muffin' },
  { id: 6, name: "Mineral Water", price: 1.5, category: "Beverage", sku: "BV-001", stock: 200, image: "https://placehold.co/300x300.png", 'data-ai-hint': 'water bottle' },
  { id: 7, name: "Iced Tea", price: 2.8, category: "Beverage", sku: "BV-002", stock: 90, image: "https://placehold.co/300x300.png", 'data-ai-hint': 'iced tea' },
  { id: 8, name: "Americano", price: 3.0, category: "Coffee", sku: "CF-004", stock: 120, image: "https://placehold.co/300x300.png", 'data-ai-hint': 'americano coffee' },
  { id: 9, name: "Danish Pastry", price: 2.5, category: "Pastry", sku: "PS-003", stock: 40, image: "https://placehold.co/300x300.png", 'data-ai-hint': 'danish pastry' },
  { id: 10, name: "Orange Juice", price: 3.0, category: "Beverage", sku: "BV-003", stock: 75, image: "https://placehold.co/300x300.png", 'data-ai-hint': 'orange juice' },
  { id: 11, name: "Macchiato", price: 2.75, category: "Coffee", sku: "CF-005", stock: 70, image: "https://placehold.co/300x300.png", 'data-ai-hint': 'macchiato coffee' },
  { id: 12, name: "Cinnamon Roll", price: 3.25, category: "Pastry", sku: "PS-004", stock: 35, image: "https://placehold.co/300x300.png", 'data-ai-hint': 'cinnamon roll' },
];

export const MOCK_STOCK_ITEMS: StockItem[] = MOCK_PRODUCTS.map(product => ({
  ...product,
  threshold: 20,
}));

function generateRandomDate(from: Date, to: Date) {
  return new Date(from.getTime() + Math.random() * (to.getTime() - from.getTime()));
}

export const MOCK_TRANSACTIONS: Transaction[] = Array.from({ length: 50 }, (_, i) => {
  const items = MOCK_PRODUCTS.slice(i % 5, (i % 5) + Math.floor(Math.random() * 3) + 1).map(p => ({ ...p, quantity: Math.floor(Math.random() * 2) + 1 }));
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const payment = Math.ceil(total / 5) * 5;
  return {
    id: `TRX-2024-${String(i + 1).padStart(4, '0')}`,
    items,
    total,
    payment,
    change: payment - total,
    date: generateRandomDate(new Date(2024, 0, 1), new Date()),
    cogs: total * 0.4,
    profit: total * 0.6,
  };
});
