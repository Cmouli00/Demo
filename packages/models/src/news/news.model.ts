// news.model.ts

export interface News {
  id: string;
  title: string;
  description: string;
  content: string;
  publishedAt: string | null;
  status: "draft" | "published" | "archived";
  createdAt: string;
  updatedAt: string;
}