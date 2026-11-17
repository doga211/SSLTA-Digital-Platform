create extension if not exists pgcrypto;

create table if not exists public.blog_categories (
  id uuid primary key default gen_random_uuid(), name text not null unique, slug text not null unique,
  description text, display_order integer not null default 0, is_active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(), title text not null, slug text not null unique,
  excerpt text, content text not null, cover_image_url text, social_image_url text,
  category_id uuid references public.blog_categories(id) on delete set null,
  author_id uuid references auth.users(id) on delete set null, author_name text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  is_featured boolean not null default false, is_breaking boolean not null default false,
  published_at timestamptz, seo_title text, seo_description text,
  reading_time_minutes integer not null default 1 check (reading_time_minutes > 0),
  view_count bigint not null default 0 check (view_count >= 0),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.blog_tags (
  id uuid primary key default gen_random_uuid(), name text not null unique, slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.blog_post_tags (
  post_id uuid not null references public.blog_posts(id) on delete cascade,
  tag_id uuid not null references public.blog_tags(id) on delete cascade,
  primary key (post_id,tag_id)
);

create index if not exists blog_posts_status_idx on public.blog_posts(status);
create index if not exists blog_posts_published_at_idx on public.blog_posts(published_at desc);
create index if not exists blog_posts_category_idx on public.blog_posts(category_id);
create index if not exists blog_posts_featured_idx on public.blog_posts(is_featured);
create index if not exists blog_posts_slug_idx on public.blog_posts(slug);

alter table public.blog_categories enable row level security;
alter table public.blog_posts enable row level security;
alter table public.blog_tags enable row level security;
alter table public.blog_post_tags enable row level security;

drop policy if exists "Public can read active blog categories" on public.blog_categories;
create policy "Public can read active blog categories" on public.blog_categories for select to anon,authenticated using (is_active=true);

drop policy if exists "Public can read published blog posts" on public.blog_posts;
create policy "Public can read published blog posts" on public.blog_posts for select to anon,authenticated
using (status='published' and published_at is not null and published_at<=now());

drop policy if exists "Public can read blog tags" on public.blog_tags;
create policy "Public can read blog tags" on public.blog_tags for select to anon,authenticated using (true);

drop policy if exists "Public can read published post tags" on public.blog_post_tags;
create policy "Public can read published post tags" on public.blog_post_tags for select to anon,authenticated
using (exists(select 1 from public.blog_posts p where p.id=post_id and p.status='published' and p.published_at is not null and p.published_at<=now()));

insert into public.blog_categories(name,slug,description,display_order) values
('Federation News','federation-news','Official SSLTA news, announcements and institutional updates.',1),
('Tournaments','tournaments','Tournament announcements, draws, results and reports.',2),
('Rankings','rankings','National rankings, ranking updates and player performance.',3),
('Players','players','Stories and profiles of South Sudanese tennis players.',4),
('Junior Tennis','junior-tennis','Development and competition opportunities for young players.',5),
('Women''s Tennis','womens-tennis','Women and girls in South Sudanese tennis.',6),
('Coaching & Development','coaching-development','Coaching, education and player development.',7),
('Officials & Umpires','officials-umpires','Officials education, certification and tournament officiating.',8),
('Clubs & Academies','clubs-academies','Updates from clubs, academies and tennis communities.',9),
('National Team','national-team','South Sudan national team news and international representation.',10),
('International Tennis','international-tennis','South Sudan tennis developments in the international arena.',11),
('Community Tennis','community-tennis','Grassroots and community tennis development.',12),
('Governance','governance','Federation governance, policies and institutional development.',13)
on conflict(slug) do nothing;
