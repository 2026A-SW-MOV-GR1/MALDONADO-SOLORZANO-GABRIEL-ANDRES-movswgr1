/**
 * Arreglando la importación en watermelon storage
 */
import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import {
  CRUDItem,
  CRUDPayload,
  DualStorageContextType,
  StorageType,
} from '../types';
import { dualStorageService } from '../services/dualStorageService';
import { logger } from '../services/logger';

interface State {
  items: CRUDItem[];
  currentStorage: StorageType;
  isLoading: boolean;
  error: string | null;
}

type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ITEMS'; payload: CRUDItem[] }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_STORAGE'; payload: StorageType }
  | { type: 'ADD_ITEM'; payload: CRUDItem }
  | { type: 'DELETE_ITEM'; payload: string };

const initialState: State = {
  items: [],
  currentStorage: 'sqlite',
  isLoading: false,
  error: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ITEMS':
      return { ...state, items: action.payload, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_STORAGE':
      return { ...state, currentStorage: action.payload };
    case 'ADD_ITEM':
      return { ...state, items: [action.payload, ...state.items] };
    case 'DELETE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    default:
      return state;
  }
}

const DualStorageContext = createContext<DualStorageContextType | undefined>(undefined);

interface DualStorageProviderProps {
  children: React.ReactNode;
}

export const DualStorageProvider: React.FC<DualStorageProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const init = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        await dualStorageService.initialize();
        
        const items = await dualStorageService.readItems();
        dispatch({ type: 'SET_ITEMS', payload: items });
        logger.info('✓ Contexto inicializado correctamente');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        logger.error('Error inicializando contexto', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    init();
  }, []);

  const createItem = useCallback(async (payload: CRUDPayload) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const newItem = await dualStorageService.createItem(payload);
      dispatch({ type: 'ADD_ITEM', payload: newItem });
      
      logger.info(`Elemento creado: ${newItem.id}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error creando item';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      logger.error('Error creando item', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const readItems = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const items = await dualStorageService.readItems();
      dispatch({ type: 'SET_ITEMS', payload: items });
      
      logger.info(`${items.length} elementos cargados`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error leyendo items';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      logger.error('Error leyendo items', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const deleteItem = useCallback(async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      await dualStorageService.deleteItem(id);
      dispatch({ type: 'DELETE_ITEM', payload: id });
      
      logger.info(`Elemento eliminado: ${id}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error eliminando item';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      logger.error('Error eliminando item', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const switchStorage = useCallback(async (storageType: StorageType) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      await dualStorageService.switchStorage(storageType);
      dispatch({ type: 'SET_STORAGE', payload: storageType });
      
      const items = await dualStorageService.readItems();
      dispatch({ type: 'SET_ITEMS', payload: items });
      
      logger.info(`Almacenamiento cambiado a ${storageType}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error cambiando almacenamiento';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      logger.error('Error cambiando almacenamiento', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const updateItem = useCallback(async (id: string, payload: CRUDPayload) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      await dualStorageService.updateItem(id, payload);
      
      logger.info(`Elemento actualizado: ${id}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error actualizando item';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      logger.error('Error actualizando item', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const value: DualStorageContextType = {
    items: state.items,
    currentStorage: state.currentStorage,
    isLoading: state.isLoading,
    error: state.error,
    createItem,
    readItems,
    updateItem,
    deleteItem,
    switchStorage,
  };

  return (
    <DualStorageContext.Provider value={value}>
      {children}
    </DualStorageContext.Provider>
  );
};

export const useDualStorage = (): DualStorageContextType => {
  const context = useContext(DualStorageContext);
  if (!context) {
    throw new Error('useDualStorage debe usarse dentro de DualStorageProvider');
  }
  return context;
};
