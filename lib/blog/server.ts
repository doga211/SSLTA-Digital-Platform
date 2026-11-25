import { createServerClient as createSupabaseServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { BlogCategory, BlogPost } from "./types";

async function getServerClient() {
  const cookieStore = await cookies();

  return createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The server component cannot set cookies.
          }
        },
      },
    }
  );
}

export async function getPublishedPosts(options?: {
  category?: string;
  search?: string;
  limit?: number;
}) {
  const supabase = await getServerClient();
  let query = supabase.from("blog_posts").select(`
    *, category:blog_categories(id,name,slug,description,display_order,is_active)
  `).eq("status","published").not("published_at","is",null)
    .lte("published_at",new Date().toISOString())
    .order("published_at",{ascending:false}).limit(options?.limit ?? 12);

  if (options?.category) query = query.eq("category.slug", options.category);
  if (options?.search) {
    const search = options.search.replace(/[%_]/g,"");
    if (search) query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
  }

  const { data, error } = await query;
  if (error) throw new Error(`Failed to load blog posts: ${error.message}`);
  return (data ?? []) as BlogPost[];
}

export async function getFeaturedPosts() {
  const supabase = await getServerClient();
  const { data, error } = await supabase.from("blog_posts").select(`*,category:blog_categories(*)`)
    .eq("status","published").eq("is_featured",true).not("published_at","is",null)
    .lte("published_at",new Date().toISOString()).order("published_at",{ascending:false}).limit(5);
  if (error) throw new Error(`Failed to load featured posts: ${error.message}`);
  return (data ?? []) as BlogPost[];
}

export async function getBlogPostBySlug(slug: string) {
  const supabase = await getServerClient();
  const { data, error } = await supabase.from("blog_posts").select(`
    *, category:blog_categories(*), tags:blog_post_tags(tag:blog_tags(*))
  `).eq("slug",slug).eq("status","published").not("published_at","is",null)
    .lte("published_at",new Date().toISOString()).maybeSingle();
  if (error) throw new Error(`Failed to load article: ${error.message}`);
  if (!data) return null;
  return {
    ...data,
    tags: (data.tags ?? []).map((x: {tag: BlogPost["tags"] extends (infer T)[] ? T : never}) => x.tag).filter(Boolean),
  } as BlogPost;
}

export async function getBlogCategories() {
  const supabase = await getServerClient();
  const { data, error } = await supabase.from("blog_categories").select("*")
    .eq("is_active",true).order("display_order",{ascending:true});
  if (error) throw new Error(`Failed to load categories: ${error.message}`);
  return (data ?? []) as BlogCategory[];
}

export async function getRelatedPosts(postId: string, categoryId: string | null) {
  const supabase = await getServerClient();
  let query = supabase.from("blog_posts").select(`*,category:blog_categories(*)`)
    .eq("status","published").neq("id",postId).not("published_at","is",null)
    .lte("published_at",new Date().toISOString()).order("published_at",{ascending:false}).limit(4);
  if (categoryId) query = query.eq("category_id",categoryId);
  const { data, error } = await query;
  if (error) throw new Error(`Failed to load related posts: ${error.message}`);
  return (data ?? []) as BlogPost[];
}
