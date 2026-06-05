/**
 * Servicio de persistencia dual
 */

import { CRUDItem, CRUDPayload, StorageType } from '../types';
import { logger } from './logger';
import { sqliteStorage } from '../persistence/sqlite/storage';
import { watermelonStorage } from '../persistence/watermelon/storage';

export class DualStorageService {
  private currentStorage: StorageType = 'sqlite';
  private sqliteReady = false;
  private watermelonReady = false;

  async initialize(): Promise<void> {
    try {
      logger.info('Inicializando servicio de persistencia dual');
      
      await Promise.all([
        sqliteStorage.initialize(),
        watermelonStorage.initialize(),
      ]);
      
      this.sqliteReady = true;
      this.watermelonReady = true;
      logger.info('✓ Servicio de persistencia dual listo');
    } catch (error) {
      logger.error('Error inicializando servicio dual', error);
      throw error;
    }
  }

  getCurrentStorage(): StorageType {
    return this.currentStorage;
  }

  private getActiveStorage() {
    if (this.currentStorage === 'sqlite') {
      if (!this.sqliteReady) throw new Error('SQLite not initialized');
      return sqliteStorage;
    } else {
      if (!this.watermelonReady) throw new Error('WatermelonDB not initialized');
      return watermelonStorage;
    }
  }

  async switchStorage(storageType: StorageType): Promise<void> {
    try {
      if (storageType === this.currentStorage) {
        logger.debug(`Ya estamos usando ${storageType}`);
        return;
      }

      logger.info(`Cambiando almacenamiento de ${this.currentStorage} a ${storageType}`);
      this.currentStorage = storageType;
      logger.info(`✓ Almacenamiento cambiado a ${storageType}`);
    } catch (error) {
      logger.error(`Error cambiando almacenamiento a ${storageType}`, error);
      throw error;
    }
  }

  async createItem(payload: CRUDPayload): Promise<CRUDItem> {
    try {
      const storage = this.getActiveStorage();
      const item: CRUDItem = {
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...payload,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      logger.debug(`[${this.currentStorage.toUpperCase()}] Creando nuevo item`);
      const created = await storage.create(item);
      return created;
    } catch (error) {
      logger.error(`[${this.currentStorage.toUpperCase()}] Error creando item`, error);
      throw error;
    }
  }

  async readItems(): Promise<CRUDItem[]> {
    try {
      const storage = this.getActiveStorage();
      logger.debug(`[${this.currentStorage.toUpperCase()}] Leyendo items`);
      const items = await storage.readAll();
      return items;
    } catch (error) {
      logger.error(`[${this.currentStorage.toUpperCase()}] Error leyendo items`, error);
      throw error;
    }
  }

  async updateItem(id: string, payload: CRUDPayload): Promise<CRUDItem> {
    try {
      const storage = this.getActiveStorage();
      logger.debug(`[${this.currentStorage.toUpperCase()}] Actualizando item ${id}`);
      const updated = await storage.update(id, payload);
      return updated;
    } catch (error) {
      logger.error(`[${this.currentStorage.toUpperCase()}] Error actualizando item ${id}`, error);
      throw error;
    }
  }

  async deleteItem(id: string): Promise<void> {
    try {
      const storage = this.getActiveStorage();
      logger.debug(`[${this.currentStorage.toUpperCase()}] Eliminando item ${id}`);
      await storage.delete(id);
    } catch (error) {
      logger.error(`[${this.currentStorage.toUpperCase()}] Error eliminando item ${id}`, error);
      throw error;
    }
  }
}

export const dualStorageService = new DualStorageService();
