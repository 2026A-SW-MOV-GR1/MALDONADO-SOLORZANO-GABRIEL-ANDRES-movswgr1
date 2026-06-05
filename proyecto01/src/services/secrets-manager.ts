import { Secret, SecretResponse, SecretStorage } from "@/types/secrets";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

/**
 * Gestor de secretos con soporte para múltiples mecanismos de almacenamiento nativo
 * En Android: Shared Preferences, Jetpack DataStore, EncryptedSharedPref
 * En Web: AsyncStorage (para desarrollo)
 */
export class SecretsManager {
  private static readonly SECRETS_PREFIX = "@secrets:";
  private static readonly METADATA_KEY = "@secrets:metadata";

  /**
   * Guarda un secreto en el almacenamiento especificado
   */
  static async saveSecret(
    key: string,
    value: string,
    storage: SecretStorage,
  ): Promise<SecretResponse> {
    try {
      if (!key.trim() || !value.trim()) {
        return {
          success: false,
          error: "Key and value cannot be empty",
        };
      }

      // Validar que la clave tenga un formato válido (alphanuméricas y guiones)
      if (!/^[a-zA-Z0-9_-]+$/.test(key)) {
        return {
          success: false,
          error:
            "Key can only contain letters, numbers, underscores, and hyphens",
        };
      }

      // Crear metadatos del secreto
      const secret: Secret = {
        key,
        storage,
        timestamp: Date.now(),
      };

      // Guardar en el backend (simulado con AsyncStorage para desarrollo)
      const storageKey = `${this.SECRETS_PREFIX}${key}`;
      const data = JSON.stringify({
        value,
        metadata: secret,
      });

      // En una aplicación real, aquí se usaría:
      // - Platform.OS === 'android' para usar JNI/JSI con Android APIs nativas
      // - Shared Preferences, DataStore, o EncryptedSharedPref según la selección

      if (Platform.OS === "android") {
        // Aquí iría la integración nativa real
        // Por ahora, usamos AsyncStorage para desarrollo
        await AsyncStorage.setItem(storageKey, data);
      } else {
        // En web y iOS, usamos AsyncStorage
        await AsyncStorage.setItem(storageKey, data);
      }

      // Actualizar metadata
      await this.updateMetadata(secret);

      return {
        success: true,
        storage,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return {
        success: false,
        error: `Failed to save secret: ${errorMessage}`,
      };
    }
  }

  /**
   * Recupera un secreto del almacenamiento especificado
   */
  static async getSecret(
    key: string,
    storage: SecretStorage,
  ): Promise<SecretResponse> {
    try {
      if (!key.trim()) {
        return {
          success: false,
          error: "Key cannot be empty",
        };
      }

      const storageKey = `${this.SECRETS_PREFIX}${key}`;

      // En una aplicación real, aquí se verificaría el almacenamiento nativo
      // Por ahora, usamos AsyncStorage
      const data = await AsyncStorage.getItem(storageKey);

      if (!data) {
        return {
          success: false,
          error: "Secret not found",
          storage,
        };
      }

      try {
        const parsed = JSON.parse(data);
        return {
          success: true,
          value: parsed.value,
          storage: parsed.metadata.storage,
        };
      } catch {
        return {
          success: false,
          error: "Failed to parse secret data",
          storage,
        };
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return {
        success: false,
        error: `Failed to retrieve secret: ${errorMessage}`,
        storage,
      };
    }
  }

  /**
   * Elimina un secreto
   */
  static async deleteSecret(key: string): Promise<SecretResponse> {
    try {
      if (!key.trim()) {
        return {
          success: false,
          error: "Key cannot be empty",
        };
      }

      const storageKey = `${this.SECRETS_PREFIX}${key}`;
      await AsyncStorage.removeItem(storageKey);

      // Actualizar metadata
      const metadata = await this.getMetadata();
      const updated = metadata.filter((s: Secret) => s.key !== key);
      await AsyncStorage.setItem(this.METADATA_KEY, JSON.stringify(updated));

      return {
        success: true,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return {
        success: false,
        error: `Failed to delete secret: ${errorMessage}`,
      };
    }
  }

  /**
   * Lista todos los secretos guardados
   */
  static async listSecrets(): Promise<Secret[]> {
    try {
      return await this.getMetadata();
    } catch {
      return [];
    }
  }

  /**
   * Actualiza los metadatos de los secretos
   */
  private static async updateMetadata(secret: Secret): Promise<void> {
    try {
      const metadata = await this.getMetadata();
      const index = metadata.findIndex((s: Secret) => s.key === secret.key);

      if (index >= 0) {
        metadata[index] = secret;
      } else {
        metadata.push(secret);
      }

      await AsyncStorage.setItem(this.METADATA_KEY, JSON.stringify(metadata));
    } catch {
      // Ignorar errores de metadata
    }
  }

  /**
   * Obtiene los metadatos de los secretos
   */
  private static async getMetadata(): Promise<Secret[]> {
    try {
      const data = await AsyncStorage.getItem(this.METADATA_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }
}
