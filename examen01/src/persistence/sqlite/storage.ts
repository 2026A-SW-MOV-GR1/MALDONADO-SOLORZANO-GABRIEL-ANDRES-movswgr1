/**
 * Storage simulado en memoria para SQLite
 */

import { CRUDItem } from '../../types';
import { logger } from '../../services/logger';

export class InMemorySQLiteStorage {
  private store: Map<string, CRUDItem> = new Map();
  private readonly storageName = 'sqlite_items';

  async initialize(): Promise<void> {
    try {
      logger.debug('Inicializando almacenamiento SQLite (en memoria)...');
      this.loadFromLocalStorage();
      logger.info('✓ SQLite inicializado correctamente');
    } catch (error) {
      logger.error('Error inicializando SQLite', error);
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
      logger.warn('No se pudieron cargar datos previos de SQLite', error);
    }
  }

  private saveToLocalStorage(): void {
    try {
      const obj = Object.fromEntries(this.store);
      localStorage.setItem(this.storageName, JSON.stringify(obj));
    } catch (error) {
      logger.error('Error guardando datos en SQLite', error);
    }
  }

  async create(item: CRUDItem): Promise<CRUDItem> {
    try {
      logger.debug(`Creando item en SQLite: ${item.id}`);
      this.store.set(item.id, item);
      this.saveToLocalStorage();
      logger.info(`✓ Item creado en SQLite: ${item.id}`, { title: item.title });
      return item;
    } catch (error) {
      logger.error(`Error creando item en SQLite`, error);
      throw error;
    }
  }

  async readAll(): Promise<CRUDItem[]> {
    try {
      logger.debug('Leyendo todos los items de SQLite');
      const items = Array.from(this.store.values()).sort((a, b) => b.createdAt - a.createdAt);
      logger.info(`✓ ${items.length} items leídos de SQLite`);
      return items;
    } catch (error) {
      logger.error('Error leyendo items de SQLite', error);
      throw error;
    }
  }

  async update(id: string, updates: Partial<CRUDItem>): Promise<CRUDItem> {
    try {
      logger.debug(`Actualizando item en SQLite: ${id}`);
      const item = this.store.get(id);
      if (!item) throw new Error(`Item not found: ${id}`);

      const updated: CRUDItem = {
        ...item,
        ...updates,
        updatedAt: Date.now(),
      };
      this.store.set(id, updated);
      this.saveToLocalStorage();
      logger.info(`✓ Item actualizado en SQLite: ${id}`);
      return updated;
    } catch (error) {
      logger.error(`Error actualizando item en SQLite`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      logger.debug(`Eliminando item de SQLite: ${id}`);
      this.store.delete(id);
      this.saveToLocalStorage();
      logger.info(`✓ Item eliminado de SQLite: ${id}`);
    } catch (error) {
      logger.error(`Error eliminando item de SQLite`, error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      logger.debug('Borrando todos los items de SQLite');
      this.store.clear();
      this.saveToLocalStorage();
      logger.info('✓ Almacenamiento SQLite limpiado');
    } catch (error) {
      logger.error('Error limpiando SQLite', error);
      throw error;
    }
  }
}

export const sqliteStorage = new InMemorySQLiteStorage();
