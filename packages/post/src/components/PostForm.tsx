"use client";

import { useEffect } from "react";

import {
  useForm,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import type {
  Post,
  CreatePostDto,
} from "@company/models";

import {
  postSchema,
  PostFormValues,
} from "../schemas/post.schema";

import { Input, Button } from "@company/ui";

interface PostFormProps {
  post?: Post;
  onSubmit: (data: CreatePostDto) => void;
  loading?: boolean;
}

export function PostForm({
  post,
  onSubmit,
  loading = false,
}: PostFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      status: "draft",
    },
  });

  useEffect(() => {
    reset({
      title: post?.title ?? "",
      content: post?.content ?? "",
      status: post?.status ?? "draft",
    });
  }, [post, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="shared-form"
    >
      <div className="shared-form-field">
        <label>
          Title
        </label>

        <Input {...register("title")} />

        {errors.title && (
          <p className="shared-error">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="shared-form-field">
        <label>
          Content
        </label>

        <textarea
          {...register("content")}
          rows={5}
          className="shared-textarea"
        />

        {errors.content && (
          <p className="shared-error">
            {errors.content.message}
          </p>
        )}
      </div>

      <div className="shared-form-field">
        <label>
          Status
        </label>

        <select
          {...register("status")}
          className="shared-select"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <Button type="submit" disabled={loading}>
        {loading
          ? "Saving..."
          : post
            ? "Update Post"
            : "Create Post"}
      </Button>
    </form>
  );
}