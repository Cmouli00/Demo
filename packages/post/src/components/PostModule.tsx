"use client";

import { useState } from "react";

import type {
  Post,
  CreatePostDto,
} from "@company/models";

import {
  useCreatePost,
  useUpdatePost,
} from "../hooks/usePosts";

import { PostList } from "./PostList";
import { PostForm } from "./PostForm";

import { Button, Modal } from "@company/ui";

export function PostModule() {
  const [open, setOpen] = useState(false);
  const [selectedPost, setSelectedPost] =
    useState<Post | undefined>();

  const createMutation = useCreatePost();
  const updateMutation = useUpdatePost();

  const loading =
    createMutation.isPending ||
    updateMutation.isPending;

  function handleSubmit(data: CreatePostDto) {
    if (selectedPost) {
      updateMutation.mutate(
        {
          id: selectedPost.id,
          data,
        },
        {
          onSuccess: () => {
            setOpen(false);
            setSelectedPost(undefined);
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          setOpen(false);
        },
      });
    }
  }

  function handleEdit(post: Post) {
    setSelectedPost(post);
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setSelectedPost(undefined);
  }

  return (
    <div className="shared-post-module">

      <div className="shared-post-header">
        <div>
          <h1 className="text-2xl font-bold">
            Posts
          </h1>

          <p className="text-sm text-gray-500">
            Manage and organize your posts.
          </p>
        </div>

        <Button
          onClick={() => {
            setSelectedPost(undefined);
            setOpen(true);
          }}
        >
          Create Post
        </Button>
      </div>

      <PostList onEdit={handleEdit} />

      <Modal
        open={open}
        title={selectedPost ? "Edit Post" : "Create Post"}
        onClose={handleClose}
      >
        <PostForm
          post={selectedPost}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </Modal>

    </div>
  );
}