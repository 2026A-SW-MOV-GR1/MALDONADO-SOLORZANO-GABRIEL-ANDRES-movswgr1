/**
 * Tipos base para la aplicación de persistencia dual
 */

export type StorageType = 'sqlite' | 'watermelon';

export interface CRUDItem {
  id: string;
  title: string;
  description: string;
  createdAt: number;
  updatedAt: number;
}

export interface CRUDPayload {
  title: string;
  description: string;
}

export interface DualStorageContextType {
  items: CRUDItem[];
  currentStorage: StorageType;
  isLoading: boolean;
  error: string | null;
  
  createItem: (payload: CRUDPayload) => Promise<void>;
  readItems: () => Promise<void>;
  updateItem: (id: string, payload: CRUDPayload) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  switchStorage: (storageType: StorageType) => Promise<void>;
}
