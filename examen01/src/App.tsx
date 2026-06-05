import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Text,
  StatusBar,
} from 'react-native';
import { DualStorageProvider } from './context/DualStorageContext';
import { StorageSwitch } from './components/StorageSwitch';
import { CRUDForm } from './components/CRUDForm';
import { CRUDList } from './components/CRUDList';
import { logger } from './services/logger';

const AppContent: React.FC = () => {
  React.useEffect(() => {
    logger.info('🚀 Aplicación iniciada');
    return () => {
      logger.info('🛑 Aplicación cerrada');
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>Persistencia Dual</Text>
          <Text style={styles.appSubtitle}>
            SQLite + WatermelonDB en Tiempo Real
          </Text>
        </View>

        {/* Storage Switch */}
        <StorageSwitch />

        {/* Form */}
        <CRUDForm />

        {/* List */}
        <View style={styles.listSection}>
          <CRUDList />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            💾 Todos los datos se guardan localmente
          </Text>
          <Text style={styles.footerText}>
            🔄 Cambio instantáneo entre almacenamientos
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <DualStorageProvider>
      <AppContent />
    </DualStorageProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#1976d2',
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
  },
  appSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  listSection: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  footer: {
    marginHorizontal: 16,
    marginTop: 24,
    paddingHorizontal: 12,
    paddingVertical: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    marginVertical: 4,
  },
});
