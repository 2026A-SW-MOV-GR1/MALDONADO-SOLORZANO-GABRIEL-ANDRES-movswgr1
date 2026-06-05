import { useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { SecretsManager } from "@/services/secrets-manager";
import { SecretStorage, STORAGE_OPTIONS } from "@/types/secrets";

type ScreenMode = "save" | "retrieve";
type ScreenState = "idle" | "loading" | "success" | "error";

export default function SecretsScreen() {
  // Estado general
  const [mode, setMode] = useState<ScreenMode>("save");
  const [state, setState] = useState<ScreenState>("idle");
  const [message, setMessage] = useState<string>("");

  // Estado para guardar secreto
  const [saveKey, setSaveKey] = useState<string>("");
  const [saveValue, setSaveValue] = useState<string>("");
  const [saveStorage, setSaveStorage] =
    useState<SecretStorage>("shared-preferences");
  const [saveStorageOpen, setSaveStorageOpen] = useState(false);

  // Estado para recuperar secreto
  const [retrieveKey, setRetrieveKey] = useState<string>("");
  const [retrieveStorage, setRetrieveStorage] =
    useState<SecretStorage>("shared-preferences");
  const [retrieveStorageOpen, setRetrieveStorageOpen] = useState(false);
  const [retrievedValue, setRetrievedValue] = useState<string | null>(null);

  const isLoading = state === "loading";

  /**
   * Maneja el guardado de un secreto
   */
  const handleSaveSecret = async () => {
    if (!saveKey.trim() || !saveValue.trim()) {
      setMessage("Por favor ingresa una clave y un valor");
      setState("error");
      return;
    }

    setState("loading");
    setMessage("");

    const response = await SecretsManager.saveSecret(
      saveKey,
      saveValue,
      saveStorage,
    );

    if (response.success) {
      setMessage(
        `Secreto guardado exitosamente en ${getStorageLabel(saveStorage)}`,
      );
      setState("success");
      setSaveKey("");
      setSaveValue("");
      setRetrievedValue(null);
    } else {
      setMessage(response.error || "Error al guardar el secreto");
      setState("error");
    }
  };

  /**
   * Maneja la recuperación de un secreto
   */
  const handleRetrieveSecret = async () => {
    if (!retrieveKey.trim()) {
      setMessage("Por favor ingresa una clave");
      setState("error");
      return;
    }

    setState("loading");
    setMessage("");
    setRetrievedValue(null);

    const response = await SecretsManager.getSecret(
      retrieveKey,
      retrieveStorage,
    );

    if (response.success && response.value) {
      setMessage("Secreto recuperado exitosamente");
      setState("success");
      setRetrievedValue(response.value);
    } else {
      setMessage("El secreto no fue encontrado o no existe");
      setState("error");
      setRetrievedValue(null);
    }
  };

  /**
   * Limpia el formulario
   */
  const handleReset = () => {
    setSaveKey("");
    setSaveValue("");
    setRetrieveKey("");
    setRetrievedValue(null);
    setState("idle");
    setMessage("");
  };

  /**
   * Obtiene la etiqueta legible del almacenamiento
   */
  const getStorageLabel = (storage: SecretStorage): string => {
    return (
      STORAGE_OPTIONS.find((opt) => opt.value === storage)?.label || storage
    );
  };

  /**
   * Renderiza el selector de almacenamiento
   */
  const renderStorageSelector = (
    selected: SecretStorage,
    onSelect: (storage: SecretStorage) => void,
    open: boolean,
    onToggle: (value: boolean) => void,
  ) => (
    <ThemedView style={styles.selectorContainer}>
      <Pressable
        style={[styles.selectorButton, isLoading && styles.buttonDisabled]}
        onPress={() => onToggle(!open)}
        disabled={isLoading}
      >
        <ThemedText style={styles.selectorButtonText}>
          {getStorageLabel(selected)}
        </ThemedText>
        <ThemedText style={styles.selectorArrow}>{open ? "▲" : "▼"}</ThemedText>
      </Pressable>

      {open && (
        <ThemedView style={styles.dropdownMenu}>
          {STORAGE_OPTIONS.map((option) => (
            <Pressable
              key={option.value}
              style={[
                styles.dropdownItem,
                selected === option.value && styles.dropdownItemSelected,
              ]}
              onPress={() => {
                onSelect(option.value);
                onToggle(false);
              }}
            >
              <ThemedText
                style={[
                  styles.dropdownItemText,
                  selected === option.value && styles.dropdownItemTextSelected,
                ]}
              >
                {option.label}
              </ThemedText>
            </Pressable>
          ))}
        </ThemedView>
      )}
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Encabezado */}
          <ThemedView style={styles.header}>
            <ThemedText type="title">Gestión de Secretos</ThemedText>
            <ThemedText type="small" style={styles.subtitle}>
              Guarda y recupera secretos en almacenamiento nativo
            </ThemedText>
          </ThemedView>

          {/* Selector de modo */}
          <ThemedView style={styles.modeSelector}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                mode === "save" && styles.modeButtonActive,
              ]}
              onPress={() => {
                setMode("save");
                handleReset();
              }}
              disabled={isLoading}
            >
              <ThemedText
                style={[
                  styles.modeButtonText,
                  mode === "save" && styles.modeButtonTextActive,
                ]}
              >
                Guardar
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modeButton,
                mode === "retrieve" && styles.modeButtonActive,
              ]}
              onPress={() => {
                setMode("retrieve");
                handleReset();
              }}
              disabled={isLoading}
            >
              <ThemedText
                style={[
                  styles.modeButtonText,
                  mode === "retrieve" && styles.modeButtonTextActive,
                ]}
              >
                Recuperar
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>

          {/* Mensaje de estado */}
          {message && (
            <ThemedView
              style={[
                styles.messageBox,
                state === "success" && styles.successMessage,
                state === "error" && styles.errorMessage,
              ]}
            >
              <ThemedText
                style={[
                  styles.messageText,
                  (state === "success" || state === "error") && {
                    color: "#fff",
                  },
                ]}
              >
                {message}
              </ThemedText>
            </ThemedView>
          )}

          {/* Sección de Guardar */}
          {mode === "save" && (
            <ThemedView style={styles.section}>
              <ThemedText type="subtitle">Guardar Nuevo Secreto</ThemedText>

              {/* Clave */}
              <ThemedView style={styles.fieldGroup}>
                <ThemedText type="small" style={styles.label}>
                  Clave (Key)
                </ThemedText>
                <TextInput
                  style={styles.textInput}
                  placeholder="ej: api_key, token, password"
                  placeholderTextColor="#999"
                  value={saveKey}
                  onChangeText={setSaveKey}
                  editable={!isLoading}
                />
              </ThemedView>

              {/* Valor */}
              <ThemedView style={styles.fieldGroup}>
                <ThemedText type="small" style={styles.label}>
                  Valor (Value)
                </ThemedText>
                <TextInput
                  style={[styles.textInput, styles.valueInput]}
                  placeholder="Ingresa el valor secreto"
                  placeholderTextColor="#999"
                  value={saveValue}
                  onChangeText={setSaveValue}
                  editable={!isLoading}
                  secureTextEntry={true}
                  multiline
                />
              </ThemedView>

              {/* Selector de almacenamiento */}
              <ThemedView style={styles.fieldGroup}>
                <ThemedText type="small" style={styles.label}>
                  Método de Almacenamiento
                </ThemedText>
                {renderStorageSelector(
                  saveStorage,
                  setSaveStorage,
                  saveStorageOpen,
                  setSaveStorageOpen,
                )}
              </ThemedView>

              {/* Botón de guardar */}
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.saveButton,
                  isLoading && styles.buttonDisabled,
                ]}
                onPress={handleSaveSecret}
                disabled={isLoading}
                activeOpacity={isLoading ? 1 : 0.7}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <ThemedText style={styles.buttonText}>
                    Guardar Secreto
                  </ThemedText>
                )}
              </TouchableOpacity>
            </ThemedView>
          )}

          {/* Sección de Recuperar */}
          {mode === "retrieve" && (
            <ThemedView style={styles.section}>
              <ThemedText type="subtitle">Recuperar Secreto</ThemedText>

              {/* Clave */}
              <ThemedView style={styles.fieldGroup}>
                <ThemedText type="small" style={styles.label}>
                  Clave (Key)
                </ThemedText>
                <TextInput
                  style={styles.textInput}
                  placeholder="Ingresa la clave del secreto"
                  placeholderTextColor="#999"
                  value={retrieveKey}
                  onChangeText={setRetrieveKey}
                  editable={!isLoading}
                />
              </ThemedView>

              {/* Selector de almacenamiento */}
              <ThemedView style={styles.fieldGroup}>
                <ThemedText type="small" style={styles.label}>
                  Dónde buscarlo
                </ThemedText>
                {renderStorageSelector(
                  retrieveStorage,
                  setRetrieveStorage,
                  retrieveStorageOpen,
                  setRetrieveStorageOpen,
                )}
              </ThemedView>

              {/* Botón de recuperar */}
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.retrieveButton,
                  isLoading && styles.buttonDisabled,
                ]}
                onPress={handleRetrieveSecret}
                disabled={isLoading}
                activeOpacity={isLoading ? 1 : 0.7}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <ThemedText style={styles.buttonText}>
                    Recuperar Secreto
                  </ThemedText>
                )}
              </TouchableOpacity>

              {/* Resultado */}
              {retrievedValue && (
                <ThemedView style={styles.resultBox}>
                  <ThemedText type="small" style={styles.resultLabel}>
                    Secreto Recuperado:
                  </ThemedText>
                  <ThemedView style={styles.resultValue}>
                    <TextInput
                      style={styles.resultInput}
                      value={retrievedValue}
                      editable={false}
                      secureTextEntry={true}
                      multiline
                    />
                  </ThemedView>
                  <ThemedText type="small" style={styles.resultHint}>
                    El valor se muestra de forma segura
                  </ThemedText>
                </ThemedView>
              )}
            </ThemedView>
          )}

          {/* Botón reset */}
          {(saveKey || saveValue || retrieveKey || retrievedValue) && (
            <TouchableOpacity
              style={[
                styles.button,
                styles.resetButton,
                isLoading && styles.buttonDisabled,
              ]}
              onPress={handleReset}
              disabled={isLoading}
            >
              <ThemedText style={styles.buttonText}>Limpiar</ThemedText>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    gap: Spacing.three,
  },
  header: {
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  subtitle: {
    opacity: 0.7,
  },
  modeSelector: {
    flexDirection: "row",
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  modeButton: {
    flex: 1,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  modeButtonActive: {
    backgroundColor: "#0A7EA4",
    borderColor: "#0A7EA4",
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  modeButtonTextActive: {
    color: "#fff",
  },
  section: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.two,
    backgroundColor: "rgba(0, 0, 0, 0.02)",
  },
  fieldGroup: {
    gap: Spacing.one,
  },
  label: {
    marginStart: Spacing.one,
    fontWeight: "600",
    opacity: 0.8,
  },
  textInput: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.one,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 14,
    color: "#000",
    minHeight: 40,
  },
  valueInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  selectorContainer: {
    position: "relative",
  },
  selectorButton: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.one,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 40,
  },
  selectorButtonText: {
    fontSize: 14,
    color: "#000",
    flex: 1,
  },
  selectorArrow: {
    fontSize: 12,
    color: "#999",
    marginLeft: Spacing.one,
  },
  dropdownMenu: {
    marginTop: Spacing.one,
    borderRadius: Spacing.one,
    borderWidth: 1,
    borderColor: "#ccc",
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  dropdownItem: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dropdownItemSelected: {
    backgroundColor: "#0A7EA422",
  },
  dropdownItemText: {
    fontSize: 14,
    color: "#333",
  },
  dropdownItemTextSelected: {
    fontWeight: "600",
    color: "#0A7EA4",
  },
  button: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 44,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  retrieveButton: {
    backgroundColor: "#2196F3",
  },
  resetButton: {
    backgroundColor: "#FF9800",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  messageBox: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    backgroundColor: "rgba(255, 193, 7, 0.1)",
    borderWidth: 1,
    borderColor: "#FFC107",
  },
  successMessage: {
    backgroundColor: "#4CAF5022",
    borderColor: "#4CAF50",
  },
  errorMessage: {
    backgroundColor: "#F4433622",
    borderColor: "#F44336",
  },
  messageText: {
    fontSize: 13,
    color: "#FF9800",
    fontWeight: "500",
  },
  resultBox: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    backgroundColor: "#2196F322",
    borderWidth: 1,
    borderColor: "#2196F3",
    gap: Spacing.one,
  },
  resultLabel: {
    fontWeight: "600",
    color: "#1976D2",
  },
  resultValue: {
    borderRadius: Spacing.one,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  resultInput: {
    paddingHorizontal: Spacing.one,
    paddingVertical: Spacing.one,
    minHeight: 60,
    fontSize: 13,
    color: "#000",
    textAlignVertical: "top",
  },
  resultHint: {
    fontSize: 12,
    opacity: 0.6,
    fontStyle: "italic",
  },
});
