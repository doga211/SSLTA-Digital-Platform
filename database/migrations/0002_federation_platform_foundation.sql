-- SSLTA V2.1 — Federation Platform Foundation
-- Apply after database/schema.sql. Designed for Supabase/PostgreSQL.

create schema if not exists private;

-- Extend the existing profile role model without breaking legacy records.
alter table public.profiles
  drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check check (role in (
    'super_admin','admin','competition_manager','ranking_officer',
    'membership_officer','finance_officer','club_admin','coach','official',
    'player','editor','staff','tournament_official'
  ));

alter table public.players
  add column if not exists member_number text unique,
  add column if not exists license_status text not null default 'active',
  add column if not exists ranking_category text,
  add column if not exists emergency_contact_name text,
  add column if not exists emergency_contact_phone text;

alter table public.clubs
  add column if not exists slug text unique,
  add column if not exists email text,
  add column if not exists website text,
  add column if not exists logo_url text,
  add column if not exists status text not null default 'active';

alter table public.tournaments
  add column if not exists slug text unique,
  add column if not exists tournament_type text,
  add column if not exists sanction_status text not null default 'pending',
  add column if not exists published boolean not null default false;

-- Federation membership registry.
create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  member_number text unique not null,
  profile_id uuid references public.profiles(id) on delete set null,
  player_id uuid references public.players(id) on delete set null,
  club_id uuid references public.clubs(id) on delete set null,
  member_type text not null check (member_type in ('player','junior','coach','official','referee','club','administrator','volunteer','partner')),
  status text not null default 'pending' check (status in ('pending','active','suspended','expired','revoked')),
  valid_from date,
  valid_until date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Competition categories and draw/match governance.
create table if not exists public.tournament_categories (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  name text not null,
  gender text,
  age_group text,
  format text not null default 'knockout',
  ranking_eligible boolean not null default true,
  max_entries integer,
  created_at timestamptz not null default now(),
  unique(tournament_id, name)
);

create table if not exists public.tournament_registrations (
  id uuid primary key default gen_random_uuid(),
  tournament_category_id uuid not null references public.tournament_categories(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','approved','rejected','withdrawn','waitlisted')),
  seed integer,
  registered_at timestamptz not null default now(),
  unique(tournament_category_id, player_id)
);

create table if not exists public.draws (
  id uuid primary key default gen_random_uuid(),
  tournament_category_id uuid not null references public.tournament_categories(id) on delete cascade,
  draw_type text not null default 'knockout',
  draw_size integer,
  status text not null default 'draft' check (status in ('draft','published','locked')),
  published_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.matches
  add column if not exists tournament_category_id uuid references public.tournament_categories(id) on delete set null,
  add column if not exists draw_id uuid references public.draws(id) on delete set null,
  add column if not exists round_number integer,
  add column if not exists match_number integer,
  add column if not exists official_id uuid references public.profiles(id) on delete set null,
  add column if not exists verified_at timestamptz,
  add column if not exists verified_by uuid references public.profiles(id) on delete set null;

-- Ranking governance.
create table if not exists public.ranking_seasons (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  starts_on date not null,
  ends_on date,
  status text not null default 'draft' check (status in ('draft','active','frozen','published','archived')),
  created_at timestamptz not null default now(),
  unique(name, category)
);

create table if not exists public.ranking_points (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references public.ranking_seasons(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  tournament_id uuid references public.tournaments(id) on delete set null,
  match_id uuid references public.matches(id) on delete set null,
  points integer not null default 0,
  reason text,
  awarded_at timestamptz not null default now()
);

create table if not exists public.ranking_publications (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references public.ranking_seasons(id) on delete cascade,
  published_by uuid references public.profiles(id) on delete set null,
  published_at timestamptz not null default now(),
  snapshot jsonb not null default '[]'::jsonb
);

-- National teams and development programmes.
create table if not exists public.national_teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  coach_id uuid references public.profiles(id) on delete set null,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists public.national_team_players (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.national_teams(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  selection_date date not null default current_date,
  status text not null default 'selected',
  unique(team_id, player_id)
);

create table if not exists public.development_programs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  programme_type text not null,
  description text,
  venue text,
  starts_on date,
  ends_on date,
  status text not null default 'planned',
  created_at timestamptz not null default now()
);

-- Notifications and governance audit trail.
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  body text,
  channel text not null default 'in_app' check (channel in ('in_app','email','sms','push')),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- Central authorization helper. It is deliberately kept in a non-exposed schema.
create or replace function private.current_profile_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = (select auth.uid());
$$;

revoke all on function private.current_profile_role() from public;
grant execute on function private.current_profile_role() to authenticated;

-- RLS is mandatory for exposed federation tables.
alter table public.profiles enable row level security;
alter table public.players enable row level security;
alter table public.clubs enable row level security;
alter table public.tournaments enable row level security;
alter table public.tournament_entries enable row level security;
alter table public.matches enable row level security;
alter table public.news enable row level security;
alter table public.media enable row level security;
alter table public.audit_logs enable row level security;
alter table public.memberships enable row level security;
alter table public.tournament_categories enable row level security;
alter table public.tournament_registrations enable row level security;
alter table public.draws enable row level security;
alter table public.ranking_seasons enable row level security;
alter table public.ranking_points enable row level security;
alter table public.ranking_publications enable row level security;
alter table public.national_teams enable row level security;
alter table public.national_team_players enable row level security;
alter table public.development_programs enable row level security;
alter table public.notifications enable row level security;

-- Public-read datasets used by the official website.
create policy "public read active players" on public.players for select to anon, authenticated using (status = 'active');
create policy "public read verified clubs" on public.clubs for select to anon, authenticated using (verified = true and status = 'active');
create policy "public read published tournaments" on public.tournaments for select to anon, authenticated using (published = true or status = 'completed');
create policy "public read published news" on public.news for select to anon, authenticated using (status = 'published');
create policy "public read media" on public.media for select to anon, authenticated using (true);

-- Authenticated federation staff can manage operational records according to role.
create policy "staff manage players" on public.players for all to authenticated
using ((select private.current_profile_role()) in ('super_admin','admin','membership_officer','competition_manager','ranking_officer'))
with check ((select private.current_profile_role()) in ('super_admin','admin','membership_officer','competition_manager','ranking_officer'));

create policy "staff manage clubs" on public.clubs for all to authenticated
using ((select private.current_profile_role()) in ('super_admin','admin','membership_officer','club_admin'))
with check ((select private.current_profile_role()) in ('super_admin','admin','membership_officer','club_admin'));

create policy "staff manage tournaments" on public.tournaments for all to authenticated
using ((select private.current_profile_role()) in ('super_admin','admin','competition_manager'))
with check ((select private.current_profile_role()) in ('super_admin','admin','competition_manager'));

create policy "staff manage competition" on public.tournament_categories for all to authenticated
using ((select private.current_profile_role()) in ('super_admin','admin','competition_manager'))
with check ((select private.current_profile_role()) in ('super_admin','admin','competition_manager'));
create policy "staff manage registrations" on public.tournament_registrations for all to authenticated
using ((select private.current_profile_role()) in ('super_admin','admin','competition_manager','membership_officer'))
with check ((select private.current_profile_role()) in ('super_admin','admin','competition_manager','membership_officer'));
create policy "staff manage draws" on public.draws for all to authenticated
using ((select private.current_profile_role()) in ('super_admin','admin','competition_manager'))
with check ((select private.current_profile_role()) in ('super_admin','admin','competition_manager'));
create policy "staff manage matches" on public.matches for all to authenticated
using ((select private.current_profile_role()) in ('super_admin','admin','competition_manager','official'))
with check ((select private.current_profile_role()) in ('super_admin','admin','competition_manager','official'));

create policy "staff manage rankings" on public.ranking_seasons for all to authenticated
using ((select private.current_profile_role()) in ('super_admin','admin','ranking_officer'))
with check ((select private.current_profile_role()) in ('super_admin','admin','ranking_officer'));
create policy "staff manage ranking points" on public.ranking_points for all to authenticated
using ((select private.current_profile_role()) in ('super_admin','admin','ranking_officer'))
with check ((select private.current_profile_role()) in ('super_admin','admin','ranking_officer'));
create policy "public read ranking publications" on public.ranking_publications for select to anon, authenticated using (true);
create policy "staff publish rankings" on public.ranking_publications for all to authenticated
using ((select private.current_profile_role()) in ('super_admin','admin','ranking_officer'))
with check ((select private.current_profile_role()) in ('super_admin','admin','ranking_officer'));

create policy "members manage own profile" on public.profiles for select to authenticated using (id = (select auth.uid()) or (select private.current_profile_role()) in ('super_admin','admin'));
create policy "members update own profile" on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy "staff manage memberships" on public.memberships for all to authenticated
using ((select private.current_profile_role()) in ('super_admin','admin','membership_officer'))
with check ((select private.current_profile_role()) in ('super_admin','admin','membership_officer'));
create policy "users read own notifications" on public.notifications for select to authenticated using (recipient_id = (select auth.uid()));
create policy "users update own notifications" on public.notifications for update to authenticated using (recipient_id = (select auth.uid())) with check (recipient_id = (select auth.uid()));

create policy "staff manage national teams" on public.national_teams for all to authenticated
using ((select private.current_profile_role()) in ('super_admin','admin','competition_manager','coach'))
with check ((select private.current_profile_role()) in ('super_admin','admin','competition_manager','coach'));
create policy "public read national teams" on public.national_teams for select to anon, authenticated using (status = 'active');
create policy "staff manage national team players" on public.national_team_players for all to authenticated
using ((select private.current_profile_role()) in ('super_admin','admin','competition_manager','coach'))
with check ((select private.current_profile_role()) in ('super_admin','admin','competition_manager','coach'));
create policy "public read development" on public.development_programs for select to anon, authenticated using (status in ('planned','active','completed'));
create policy "staff manage development" on public.development_programs for all to authenticated
using ((select private.current_profile_role()) in ('super_admin','admin','competition_manager','coach'))
with check ((select private.current_profile_role()) in ('super_admin','admin','competition_manager','coach'));

-- Only high-trust roles may inspect the governance audit trail.
create policy "governance audit access" on public.audit_logs for select to authenticated
using ((select private.current_profile_role()) in ('super_admin','admin'));
create policy "governance audit insert" on public.audit_logs for insert to authenticated
with check (actor_id = (select auth.uid()));

-- Explicit Data API grants (required for current/new Supabase projects).
grant select on public.players, public.clubs, public.tournaments, public.news, public.media, public.ranking_publications, public.national_teams, public.development_programs to anon;
grant select, insert, update, delete on public.players, public.clubs, public.tournaments, public.news, public.media, public.memberships, public.tournament_categories, public.tournament_registrations, public.draws, public.matches, public.ranking_seasons, public.ranking_points, public.ranking_publications, public.national_teams, public.national_team_players, public.development_programs, public.notifications, public.audit_logs to authenticated;
grant select, update on public.profiles to authenticated;
