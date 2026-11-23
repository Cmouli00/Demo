export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SearchParams extends PaginationParams {
  keyword?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}