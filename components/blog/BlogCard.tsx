import Link from "next/link";
import type { BlogPost } from "@/lib/blog/types";

export function BlogCard({post}:{post:BlogPost}) {
  return <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
    <Link href={`/news/${post.slug}`}>
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
        {post.cover_image_url ? <img src={post.cover_image_url} alt={post.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/> :
          <div className="flex h-full items-center justify-center bg-slate-900 text-white"><span className="text-4xl font-black">SSLTA</span></div>}
        {post.is_breaking && <span className="absolute left-4 top-4 rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase text-white">Breaking</span>}
      </div>
    </Link>
    <div className="p-6">
      <div className="mb-3 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-wide">
        <span className="text-emerald-700">{post.category?.name ?? "SSLTA News"}</span>
        {post.published_at && <span className="text-slate-400">{new Date(post.published_at).toLocaleDateString()}</span>}
      </div>
      <h2 className="text-xl font-bold leading-tight text-slate-950"><Link href={`/news/${post.slug}`}>{post.title}</Link></h2>
      {post.excerpt && <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{post.excerpt}</p>}
      <div className="mt-5 flex justify-between text-sm"><span className="text-slate-500">{post.reading_time_minutes} min read</span>
        <Link href={`/news/${post.slug}`} className="font-semibold text-emerald-700">Read article →</Link>
      </div>
    </div>
  </article>;
}
