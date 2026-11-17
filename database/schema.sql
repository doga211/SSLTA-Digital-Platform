-- SSLTA production database foundation for Supabase/PostgreSQL
create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text,
  role text not null default 'staff' check (role in ('super_admin','admin','editor','tournament_official','staff')),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  gender text check (gender in ('male','female','other')),
  category text not null,
  club_id uuid,
  date_of_birth date,
  nationality text default 'South Sudan',
  ranking_points integer not null default 0,
  ranking_position integer,
  status text not null default 'active',
  photo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.clubs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text,
  contact_name text,
  contact_email text,
  phone text,
  court_count integer default 0,
  verified boolean default false,
  created_at timestamptz not null default now()
);

create table if not exists public.tournaments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  description text,
  venue text,
  start_date date,
  end_date date,
  status text not null default 'draft',
  registration_open boolean default false,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tournament_entries (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  seed integer,
  status text not null default 'registered',
  unique(tournament_id, player_id)
);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  round_name text,
  player_a_id uuid references public.players(id),
  player_b_id uuid references public.players(id),
  score_a text,
  score_b text,
  winner_id uuid references public.players(id),
  scheduled_at timestamptz,
  court text,
  status text not null default 'scheduled'
);

create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  body text,
  cover_url text,
  status text not null default 'draft',
  published_at timestamptz,
  author_id uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  title text,
  file_url text not null,
  alt_text text,
  category text,
  uploaded_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  action text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Approved prototype rankings seed
insert into public.players (full_name, category, ranking_position) values
('Emmanuel Khamis','Men''s Singles',1),('Sabri John','Men''s Singles',2),('Yohana Onset','Men''s Singles',3),('Paul Juma','Men''s Singles',4),('Emmanuel Juma','Men''s Singles',5),
('Amanda Madeng','Women''s Singles',1),('Abuk Madeng','Women''s Singles',2),('Sunday Fanta','Women''s Singles',3),('Diana Poni','Women''s Singles',4),('Doris Morris','Women''s Singles',5),
('Kobako Mboko','Boys U18',1),('Machar Deng','Boys U18',2),('Akech Khamis','Boys U18',3),('Emmanuel Paul','Boys U18',4),('Martine Kella','Boys U18',5),
('Farida','Girls U18',1),('Achik','Girls U18',2),('Juju','Girls U18',3),('Martha','Girls U18',4),('Emlda','Girls U18',5)
on conflict do nothing;
