import { useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { ApiClient } from "@/services/api-client";
import { Post } from "@/types/post";

type ScreenState =
  | "idle"
  | "loading-fetch"
  | "loading-update"
  | "success"
  | "error";

export default function PostsScreen() {
  const [postId, setPostId] = useState<string>("1");
  const [post, setPost] = useState<Post | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>("");
  const [editedBody, setEditedBody] = useState<string>("");
  const [state, setState] = useState<ScreenState>("idle");
  const [message, setMessage] = useState<string>("");

  // Determina si debe deshabilitar los controles
  const isLoading = state === "loading-fetch" || state === "loading-update";

  /**
   * Maneja la consulta de un post por ID
   */
  const handleFetchPost = async () => {
    if (!postId.trim()) {
      setMessage("Please enter a valid post ID");
      setState("error");
      return;
    }

    setState("loading-fetch");
    setMessage("");
    setPost(null);

    const id = parseInt(postId, 10);
    if (isNaN(id)) {
      setMessage("Post ID must be a valid number");
      setState("error");
      return;
    }

    const response = await ApiClient.getPost(id);

    if (response.success && response.data) {
      setPost(response.data);
      setEditedTitle(response.data.title);
      setEditedBody(response.data.body);
      setMessage("Post loaded successfully");
      setState("success");
    } else {
      setMessage(response.error || "Failed to load post");
      setState("error");
    }
  };

  /**
   * Maneja la actualización de un post
   */
  const handleUpdatePost = async () => {
    if (!post) return;

    setState("loading-update");
    setMessage("");

    const updatedPost: Partial<Post> = {
      title: editedTitle,
      body: editedBody,
    };

    const response = await ApiClient.updatePost(post.id, updatedPost);

    if (response.success && response.statusCode === 200) {
      setMessage("Post updated successfully (Status: 200)");
      setState("success");
      if (response.data) {
        setPost(response.data);
      }
    } else {
      setMessage(response.error || "Failed to update post");
      setState("error");
    }
  };

  /**
   * Limpia el formulario y regresa al estado inicial
   */
  const handleReset = () => {
    setPostId("1");
    setPost(null);
    setEditedTitle("");
    setEditedBody("");
    setState("idle");
    setMessage("");
  };

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
            <ThemedText type="title">JSONPlaceholder Posts</ThemedText>
            <ThemedText type="small" style={styles.subtitle}>
              Fetch and update posts from the fake API
            </ThemedText>
          </ThemedView>

          {/* Sección de búsqueda */}
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle">Search Post</ThemedText>

            <ThemedView style={styles.inputRow}>
              <TextInput
                style={[styles.input, styles.postIdInput]}
                placeholder="Enter post ID (1-100)"
                placeholderTextColor="#999"
                keyboardType="number-pad"
                value={postId}
                onChangeText={setPostId}
                editable={!isLoading}
                maxLength={3}
              />
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.fetchButton,
                  isLoading && styles.buttonDisabled,
                ]}
                onPress={handleFetchPost}
                disabled={isLoading}
                activeOpacity={isLoading ? 1 : 0.7}
              >
                {state === "loading-fetch" ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <ThemedText style={styles.buttonText}>Fetch</ThemedText>
                )}
              </TouchableOpacity>
            </ThemedView>
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

          {/* Formulario de edición */}
          {post && (
            <ThemedView style={styles.section}>
              <ThemedText type="subtitle">Edit Post</ThemedText>

              {/* Post ID */}
              <ThemedView style={styles.fieldGroup}>
                <ThemedText type="small" style={styles.label}>
                  Post ID
                </ThemedText>
                <ThemedView style={styles.disabledField}>
                  <ThemedText type="code">{post.id}</ThemedText>
                </ThemedView>
              </ThemedView>

              {/* User ID */}
              <ThemedView style={styles.fieldGroup}>
                <ThemedText type="small" style={styles.label}>
                  User ID
                </ThemedText>
                <ThemedView style={styles.disabledField}>
                  <ThemedText type="code">{post.userId}</ThemedText>
                </ThemedView>
              </ThemedView>

              {/* Título */}
              <ThemedView style={styles.fieldGroup}>
                <ThemedText type="small" style={styles.label}>
                  Title
                </ThemedText>
                <TextInput
                  style={styles.textInput}
                  placeholder="Post title"
                  placeholderTextColor="#999"
                  value={editedTitle}
                  onChangeText={setEditedTitle}
                  editable={!isLoading}
                  multiline
                />
              </ThemedView>

              {/* Contenido */}
              <ThemedView style={styles.fieldGroup}>
                <ThemedText type="small" style={styles.label}>
                  Body
                </ThemedText>
                <TextInput
                  style={[styles.textInput, styles.bodyInput]}
                  placeholder="Post content"
                  placeholderTextColor="#999"
                  value={editedBody}
                  onChangeText={setEditedBody}
                  editable={!isLoading}
                  multiline
                  numberOfLines={6}
                />
              </ThemedView>

              {/* Botones de acción */}
              <ThemedView style={styles.actionButtons}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.updateButton,
                    isLoading && styles.buttonDisabled,
                  ]}
                  onPress={handleUpdatePost}
                  disabled={isLoading}
                  activeOpacity={isLoading ? 1 : 0.7}
                >
                  {state === "loading-update" ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <ThemedText style={styles.buttonText}>
                      Update (PUT)
                    </ThemedText>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.resetButton,
                    isLoading && styles.buttonDisabled,
                  ]}
                  onPress={handleReset}
                  disabled={isLoading}
                  activeOpacity={isLoading ? 1 : 0.7}
                >
                  <ThemedText style={styles.buttonText}>Reset</ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>
          )}

          {/* Estado vacío */}
          {!post && state !== "loading-fetch" && (
            <ThemedView style={styles.emptyState}>
              <ThemedText type="small" style={styles.emptyText}>
                {state === "idle"
                  ? 'Enter a post ID and tap "Fetch" to get started'
                  : "No post loaded"}
              </ThemedText>
            </ThemedView>
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
  section: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.two,
    backgroundColor: "rgba(0, 0, 0, 0.02)",
  },
  inputRow: {
    flexDirection: "row",
    gap: Spacing.two,
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.one,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 14,
    color: "#000",
  },
  postIdInput: {
    maxWidth: "40%",
  },
  fieldGroup: {
    gap: Spacing.one,
  },
  label: {
    marginStart: Spacing.one,
    fontWeight: "600",
    opacity: 0.8,
  },
  disabledField: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.one,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    justifyContent: "center",
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
    textAlignVertical: "top",
  },
  bodyInput: {
    minHeight: 120,
  },
  button: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 44,
  },
  fetchButton: {
    backgroundColor: "#0A7EA4",
    minWidth: "30%",
  },
  updateButton: {
    backgroundColor: "#4CAF50",
    flex: 1,
  },
  resetButton: {
    backgroundColor: "#FF9800",
    flex: 1,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: "row",
    gap: Spacing.two,
    marginTop: Spacing.two,
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
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing.four,
  },
  emptyText: {
    textAlign: "center",
    opacity: 0.6,
  },
});
