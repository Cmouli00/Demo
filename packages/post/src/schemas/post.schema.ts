import { z } from "zod";

export const postSchema = z.object({
  title: z.string()
    .min(3, "Title must contain at least 3 characters"),

  content: z.string()
    .min(10, "Content must contain at least 10 characters"),

  status: z.enum(["draft", "published", "archived"]),
});

export type PostFormValues = z.infer<typeof postSchema>;