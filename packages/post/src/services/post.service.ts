import { apiClient } from "@company/api";

import type {
  Post,
  CreatePostDto,
  UpdatePostDto,
  PostSearchParams,
  PaginatedResponse,
  ApiResponse,
} from "@company/models";

export const postService = {
  async create(data: CreatePostDto) {
    const response = await apiClient.post<ApiResponse<Post>>(
      "/posts",
      data
    );

    return response.data.data;
  },

  async getAll(params?: PostSearchParams) {
    const response = await apiClient.get<
      PaginatedResponse<Post>
    >("/posts", { params });

    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get<ApiResponse<Post>>(
      `/posts/${id}`
    );

    return response.data.data;
  },

  async update(id: string, data: UpdatePostDto) {
    const response = await apiClient.put<ApiResponse<Post>>(
      `/posts/${id}`,
      data
    );

    return response.data.data;
  },

  async delete(id: string) {
    await apiClient.delete(`/posts/${id}`);
  },

  async search(params: PostSearchParams) {
    const response = await apiClient.get<
      PaginatedResponse<Post>
    >("/posts", { params });

    return response.data;
  },
};