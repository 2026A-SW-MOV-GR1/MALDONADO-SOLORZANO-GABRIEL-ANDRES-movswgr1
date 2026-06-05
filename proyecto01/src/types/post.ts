export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}
