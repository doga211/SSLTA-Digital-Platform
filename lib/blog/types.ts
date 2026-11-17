export type BlogStatus = "draft" | "published" | "archived";

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  social_image_url: string | null;
  category_id: string | null;
  author_id: string | null;
  author_name: string | null;
  status: BlogStatus;
  is_featured: boolean;
  is_breaking: boolean;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  reading_time_minutes: number;
  view_count: number;
  created_at: string;
  updated_at: string;
  category?: BlogCategory | null;
  tags?: BlogTag[];
}
