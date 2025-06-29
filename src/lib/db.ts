import { openDB, type IDBPDatabase } from 'idb';
import type { Product, Transaction, NewTransaction } from '@/types';
import { MOCK_PRODUCTS } from './data';

const DB_NAME = 'e-kasir-db';
const DB_VERSION = 1;
const PRODUCTS_STORE = 'products';
const TRANSACTIONS_STORE = 'transactions';

let dbPromise: Promise<IDBPDatabase> | null = null;

const initDB = () => {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('IndexedDB cannot be used in SSR.'));
  }

  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      if (oldVersion < 1) {
        if (!db.objectStoreNames.contains(PRODUCTS_STORE)) {
          const productStore = db.createObjectStore(PRODUCTS_STORE, { keyPath: 'id' });
          productStore.createIndex('name', 'name');
          productStore.createIndex('category', 'category');
        }
        if (!db.objectStoreNames.contains(TRANSACTIONS_STORE)) {
          const transactionStore = db.createObjectStore(TRANSACTIONS_STORE, {
            keyPath: 'id',
            autoIncrement: true,
          });
          transactionStore.createIndex('date', 'date');
          transactionStore.createIndex('customerName', 'customerName');
          transactionStore.createIndex('customerPhone', 'customerPhone');
        }
      }
    },
  });
};

const getDB = async () => {
  if (!dbPromise) {
    dbPromise = initDB();
  }

  const db = await dbPromise;

  // Seed data if products store is empty
  const productCount = await db.count(PRODUCTS_STORE);
  if (productCount === 0) {
    const tx = db.transaction(PRODUCTS_STORE, 'readwrite');
    await Promise.all(MOCK_PRODUCTS.map(product => tx.store.add(product)));
    await tx.done;
  }
  
  return db;
};

// Product Operations
export const getAllProducts = async (): Promise<Product[]> => {
  const db = await getDB();
  return db.getAll(PRODUCTS_STORE);
};

export const getProduct = async (id: number): Promise<Product | undefined> => {
    const db = await getDB();
    return db.get(PRODUCTS_STORE, id);
}

export const saveProduct = async (product: Product): Promise<IDBValidKey> => {
  const db = await getDB();
  return db.put(PRODUCTS_STORE, product);
};

export const deleteProduct = async (id: number): Promise<void> => {
  const db = await getDB();
  return db.delete(PRODUCTS_STORE, id);
};

// Transaction Operations
export const getAllTransactions = async (): Promise<Transaction[]> => {
  const db = await getDB();
  return db.getAll(TRANSACTIONS_STORE);
};

export const addTransaction = async (transaction: NewTransaction): Promise<Transaction> => {
  const db = await getDB();
  const id = await db.add(TRANSACTIONS_STORE, transaction);
  const newTransaction = await db.get(TRANSACTIONS_STORE, id);
  // The 'as Transaction' cast is safe because we just added it and retrieved it.
  return newTransaction as Transaction;
};

export const updateTransaction = async (transaction: Transaction): Promise<IDBValidKey> => {
  const db = await getDB();
  return db.put(TRANSACTIONS_STORE, transaction);
};
