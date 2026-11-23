export type PostStatus = "draft" | "published" | "archived";

export interface Post {
  id: string;
  title: string;
  content: string;
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostDto {
  title: string;
  content: string;
  status: PostStatus;
}

export interface UpdatePostDto {
  title?: string;
  content?: string;
  status?: PostStatus;
}

export interface PostSearchParams {
  keyword?: string;
  status?: PostStatus;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}