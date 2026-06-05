import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useDualStorage } from '../context/DualStorageContext';
import { logger } from '../services/logger';

export const CRUDForm: React.FC = () => {
  const { createItem, isLoading, currentStorage } = useDualStorage();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = async () => {
    if (!title.trim() || !description.trim()) {
      logger.warn('Formulario incompleto');
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      logger.info(`[${currentStorage.toUpperCase()}] Creando nuevo item desde formulario`, {
        title,
        description,
      });

      await createItem({ title, description });

      logger.info(`✓ Item creado exitosamente en ${currentStorage}`);

      setTitle('');
      setDescription('');
      alert('¡Item creado exitosamente!');
    } catch (error) {
      logger.error('Error creando item', error);
      alert('Error creando item');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Nuevo Item</Text>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Título</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa el título"
            value={title}
            onChangeText={setTitle}
            editable={!isLoading}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Ingresa la descripción"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            editable={!isLoading}
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleCreate}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Crear Item</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  form: {
    gap: 12,
  },
  inputGroup: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fafafa',
  },
  textArea: {
    height: 100,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
