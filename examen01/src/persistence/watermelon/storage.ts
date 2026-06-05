/**
 * Storage simulado en memoria para WatermelonDB
 */

import { CRUDItem } from '../../types';
import { logger } from '../../services/logger';

export class InMemoryWatermelonStorage {
  private store: Map<string, CRUDItem> = new Map();
  private readonly storageName = 'watermelon_items';

  async initialize(): Promise<void> {
    try {
      logger.debug('Inicializando almacenamiento WatermelonDB (en memoria)...');
      this.loadFromLocalStorage();
      logger.info('✓ WatermelonDB inicializado correctamente');
    } catch (error) {
      logger.error('Error inicializando WatermelonDB', error);
      throw error;
    }
  }

  private loadFromLocalStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageName);
      if (stored) {
        const items = JSON.parse(stored);
        this.store = new Map(Object.entries(items));
      }
    } catch (error) {
      logger.warn('No se pudieron cargar datos previos de WatermelonDB', error);
    }
  }

  private saveToLocalStorage(): void {
    try {
      const obj = Object.fromEntries(this.store);
      localStorage.setItem(this.storageName, JSON.stringify(obj));
    } catch (error) {
      logger.error('Error guardando datos en WatermelonDB', error);
    }
  }

  async create(item: CRUDItem): Promise<CRUDItem> {
    try {
      logger.debug(`Creando documento en WatermelonDB: ${item.id}`);
      if (this.store.has(item.id)) {
        throw new Error(`Document already exists: ${item.id}`);
      }
      this.store.set(item.id, { ...item });
      this.saveToLocalStorage();
      logger.info(`✓ Documento creado en WatermelonDB: ${item.id}`, { title: item.title });
      return item;
    } catch (error) {
      logger.error(`Error creando documento en WatermelonDB`, error);
      throw error;
    }
  }

  async readAll(): Promise<CRUDItem[]> {
    try {
      logger.debug('Leyendo todos los documentos de WatermelonDB');
      const items = Array.from(this.store.values()).sort((a, b) => b.createdAt - a.createdAt);
      logger.info(`✓ ${items.length} documentos leídos de WatermelonDB`);
      return items;
    } catch (error) {
      logger.error('Error leyendo documentos de WatermelonDB', error);
      throw error;
    }
  }

  async update(id: string, updates: Partial<CRUDItem>): Promise<CRUDItem> {
    try {
      logger.debug(`Actualizando documento en WatermelonDB: ${id}`);
      const item = this.store.get(id);
      if (!item) throw new Error(`Document not found: ${id}`);

      const updated: CRUDItem = {
        ...item,
        ...updates,
        updatedAt: Date.now(),
      };
      this.store.set(id, updated);
      this.saveToLocalStorage();
      logger.info(`✓ Documento actualizado en WatermelonDB: ${id}`);
      return updated;
    } catch (error) {
      logger.error(`Error actualizando documento en WatermelonDB`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      logger.debug(`Eliminando documento de WatermelonDB: ${id}`);
      if (!this.store.has(id)) {
        throw new Error(`Document not found: ${id}`);
      }
      this.store.delete(id);
      this.saveToLocalStorage();
      logger.info(`✓ Documento eliminado de WatermelonDB: ${id}`);
    } catch (error) {
      logger.error(`Error eliminando documento de WatermelonDB`, error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      logger.debug('Borrando todos los documentos de WatermelonDB');
      this.store.clear();
      this.saveToLocalStorage();
      logger.info('✓ Almacenamiento WatermelonDB limpiado');
    } catch (error) {
      logger.error('Error limpiando WatermelonDB', error);
      throw error;
    }
  }
}

export const watermelonStorage = new InMemoryWatermelonStorage();
