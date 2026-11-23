"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import type {
  CreatePostDto,
  UpdatePostDto,
  PostSearchParams,
} from "@company/models";

import { postService } from "../services/post.service";

export const postKeys = {
  all: ["posts"] as const,

  lists: () => [...postKeys.all, "list"] as const,

  list: (params: PostSearchParams) =>
    [...postKeys.lists(), params] as const,

  details: () => [...postKeys.all, "detail"] as const,

  detail: (id: string) =>
    [...postKeys.details(), id] as const,
};

export function usePosts(params: PostSearchParams = {}) {
  return useQuery({
    queryKey: postKeys.list(params),
    queryFn: () => postService.getAll(params),
  });
}

export function usePost(id: string) {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => postService.getById(id),
    enabled: Boolean(id),
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostDto) =>
      postService.create(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: postKeys.all,
      });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdatePostDto;
    }) => postService.update(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: postKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: postKeys.detail(variables.id),
      });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      postService.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: postKeys.all,
      });
    },
  });
}