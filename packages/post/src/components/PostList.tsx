"use client";

import { useState } from "react";

import type {
  Post,
  PostSearchParams,
} from "@company/models";

import {
  usePosts,
  useDeletePost,
} from "../hooks/usePosts";

import { Button, Input } from "@company/ui";

interface PostListProps {
  onEdit: (post: Post) => void;
}

export function PostList({ onEdit }: PostListProps) {
  const [params, setParams] = useState<PostSearchParams>({
    page: 1,
    limit: 10,
  });

  const { data, isLoading, error } = usePosts(params);

  const deleteMutation = useDeletePost();

  const posts = data?.data ?? [];
  const meta = data?.meta;

  function updateSearch(keyword: string) {
    setParams((current) => ({
      ...current,
      keyword,
      page: 1,
    }));
  }

  if (isLoading) {
    return <p className="shared-loading">Loading posts...</p>;
  }

  if (error) {
    return <p className="shared-error">Unable to load posts.</p>;
  }

  return (
    <div className="shared-post-list">

      <div className="shared-post-toolbar">
        <Input
          placeholder="Search posts..."
          value={params.keyword ?? ""}
          onChange={(event) =>
            updateSearch(event.target.value)
          }
        />

        <select
          value={params.status ?? ""}
          onChange={(event) =>
            setParams((current) => ({
              ...current,
              status: event.target.value
                ? event.target.value as PostSearchParams["status"]
                : undefined,
              page: 1,
            }))
          }
          className="shared-select"
        >
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="shared-table-wrap">
        <table className="shared-table">

          <thead>
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Status</th>
              <th className="p-4">Created</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-t">

                <td>
                  {post.title}
                </td>

                <td>
                  <span className="shared-status">{post.status}</span>
                </td>

                <td>
                  {new Date(post.createdAt).toLocaleDateString()}
                </td>

                <td>
                  <div className="shared-row-actions">
                    <Button
                      variant="secondary"
                      onClick={() => onEdit(post)}
                    >
                      Edit
                    </Button>

                    <Button
                      variant="danger"
                      disabled={deleteMutation.isPending}
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this post?"
                          )
                        ) {
                          deleteMutation.mutate(post.id);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </td>

              </tr>
            ))}

            {posts.length === 0 && (
              <tr>
                <td colSpan={4} className="shared-empty">
                  No posts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="shared-pagination">

        <p className="text-sm text-gray-500">
          {meta?.total ?? 0} posts
        </p>

        <div className="shared-pagination-controls">
          <Button
            variant="secondary"
            disabled={!meta || meta.page <= 1}
            onClick={() =>
              setParams((current) => ({
                ...current,
                page: (current.page ?? 1) - 1,
              }))
            }
          >
            Previous
          </Button>

          <span className="self-center text-sm">
            {meta?.page ?? 1} / {meta?.totalPages ?? 1}
          </span>

          <Button
            variant="secondary"
            disabled={
              !meta || meta.page >= meta.totalPages
            }
            onClick={() =>
              setParams((current) => ({
                ...current,
                page: (current.page ?? 1) + 1,
              }))
            }
          >
            Next
          </Button>
        </div>

      </div>
    </div>
  );
}