import type { Product } from "@/types";

export const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: "Espresso", price: 25000, category: "Kopi", barcodes: ["CF-001", "8991234567890"], stock: 100, image: "https://placehold.co/300x300.png", 'data-ai-hint': 'espresso coffee' },
  { id: 2, name: "Latte", price: 35000, category: "Kopi", barcodes: ["CF-002"], stock: 100, image: "https://placehold.co/300x300.png", 'data-ai-hint': 'latte art' },
  { id: 3, name: "Cappuccino", price: 35000, category: "Kopi", barcodes: ["CF-003"], stock: 80, image: "https://placehold.co/300x300.png", 'data-ai-hint': 'cappuccino foam' },
  { id: 4, name: "Croissant", price: 20000, category: "Roti", barcodes: ["PS-001", "8991234567891"], stock: 50, image: "https://placehold.co/300x300.png", 'data-ai-hint': 'croissant pastry' },
  { id: 5, name: "Muffin", price: 22000, category: "Roti", barcodes: ["PS-002"], stock: 60, image: "https://placehold.co/300x300.png", 'data-ai-hint': 'blueberry muffin' },
  { id: 6, name: "Air Mineral", price: 10000, category: "Minuman", barcodes: ["BV-001"], stock: 200, image: "https://placehold.co/300x300.png", 'data-ai-hint': 'water bottle' },
  { id: 7, name: "Es Teh", price: 18000, category: "Minuman", barcodes: ["BV-002"], stock: 90, image: "https://placehold.co/300x300.png", 'data-ai-hint': 'iced tea' },
  { id: 8, name: "Americano", price: 30000, category: "Kopi", barcodes: ["CF-004"], stock: 120, image: "https://placehold.co/300x300.png", 'data-ai-hint': 'americano coffee' },
  { id: 9, name: "Kue Danish", price: 25000, category: "Roti", barcodes: ["PS-003"], stock: 40, image: "https://placehold.co/300x300.png", 'data-ai-hint': 'danish pastry' },
  { id: 10, name: "Jus Jeruk", price: 25000, category: "Minuman", barcodes: ["BV-003"], stock: 75, image: "https://placehold.co/300x300.png", 'data-ai-hint': 'orange juice' },
  { id: 11, name: "Macchiato", price: 27500, category: "Kopi", barcodes: ["CF-005"], stock: 70, image: "https://placehold.co/300x300.png", 'data-ai-hint': 'macchiato coffee' },
  { id: 12, name: "Roti Kayu Manis", price: 32500, category: "Roti", barcodes: ["PS-004"], stock: 35, image: "https://placehold.co/300x300.png", 'data-ai-hint': 'cinnamon roll' },
];
