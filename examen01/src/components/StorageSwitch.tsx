import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDualStorage } from '../context/DualStorageContext';
import { StorageType } from '../types';

export const StorageSwitch: React.FC = () => {
  const { currentStorage, switchStorage, isLoading } = useDualStorage();

  const handleSwitch = async () => {
    try {
      const nextStorage: StorageType = currentStorage === 'sqlite' ? 'watermelon' : 'sqlite';
      await switchStorage(nextStorage);
    } catch (error) {
      console.error('Error cambiando almacenamiento', error);
    }
  };

  const getStorageLabel = (storage: StorageType): string => {
    return storage === 'sqlite' ? 'SQLite (SQL)' : 'WatermelonDB (NoSQL)';
  };

  const getStorageColor = (storage: StorageType): string => {
    return storage === 'sqlite' ? '#4CAF50' : '#2196F3';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Origen de Datos Activo</Text>
      </View>

      <View style={styles.switchContainer}>
        <View style={[styles.badge, { backgroundColor: getStorageColor(currentStorage) }]}>
          <Text style={styles.badgeText}>{getStorageLabel(currentStorage)}</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSwitch}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Cambiando...' : 'Alternar Almacenamiento'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.info}>
        <Text style={styles.infoLabel}>Almacenamiento Actual:</Text>
        <Text
          style={[
            styles.infoValue,
            { color: getStorageColor(currentStorage) },
          ]}
        >
          {currentStorage === 'sqlite'
            ? '🗄️ SQLite (Relacional)'
            : '📄 WatermelonDB (No Relacional)'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#e0e0e0',
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  switchContainer: {
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  info: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});
