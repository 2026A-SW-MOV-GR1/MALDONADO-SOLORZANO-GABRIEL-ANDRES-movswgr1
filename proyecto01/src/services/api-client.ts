import { ApiResponse, Post } from "@/types/post";

const JSONPLACEHOLDER_API = "https://jsonplaceholder.typicode.com";

export class ApiClient {
  /**
   * Obtiene un post específico por su ID
   */
  static async getPost(postId: number): Promise<ApiResponse<Post>> {
    try {
      const response = await fetch(`${JSONPLACEHOLDER_API}/posts/${postId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Error ${response.status}: ${response.statusText}`,
          statusCode: response.status,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
        statusCode: response.status,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return {
        success: false,
        error: `Network error: ${errorMessage}`,
      };
    }
  }

  /**
   * Actualiza un post existente con PUT
   */
  static async updatePost(
    postId: number,
    updatedPost: Partial<Post>,
  ): Promise<ApiResponse<Post>> {
    try {
      const response = await fetch(`${JSONPLACEHOLDER_API}/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPost),
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Error ${response.status}: ${response.statusText}`,
          statusCode: response.status,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
        statusCode: response.status,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return {
        success: false,
        error: `Network error: ${errorMessage}`,
      };
    }
  }
}
