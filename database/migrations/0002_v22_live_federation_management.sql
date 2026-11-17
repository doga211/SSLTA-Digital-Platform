create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  member_number text unique not null,
  profile_id uuid references public.profiles(id) on delete set null,
  full_name text not null,
  membership_type text not null check (membership_type in ('player','junior','coach','official','club','volunteer','staff','partner')),
  club_id uuid references public.clubs(id) on delete set null,
  status text not null default 'pending' check (status in ('pending','active','expired','suspended','cancelled')),
  valid_from date,
  valid_until date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tournament_categories (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  name text not null,
  gender text,
  age_group text,
  format text not null default 'knockout',
  max_entries integer,
  entry_fee numeric(12,2) default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.tournament_registrations (
  id uuid primary key default gen_random_uuid(),
  tournament_category_id uuid not null references public.tournament_categories(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  seed integer,
  eligibility_status text not null default 'pending' check (eligibility_status in ('pending','eligible','ineligible','verified')),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid','pending','paid','waived')),
  registered_at timestamptz not null default now(),
  unique(tournament_category_id, player_id)
);

create table if not exists public.draws (
  id uuid primary key default gen_random_uuid(),
  tournament_category_id uuid not null references public.tournament_categories(id) on delete cascade,
  draw_type text not null default 'knockout',
  draw_size integer,
  status text not null default 'draft' check (status in ('draft','published','locked','completed')),
  generated_at timestamptz,
  published_at timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.match_officials (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  role text not null check (role in ('chair_umpire','referee','line_umpire','technical_official')),
  assigned_at timestamptz not null default now(),
  unique(match_id, profile_id, role)
);

create table if not exists public.ranking_seasons (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  starts_on date not null,
  ends_on date not null,
  status text not null default 'draft' check (status in ('draft','active','frozen','published','archived')),
  created_at timestamptz not null default now()
);

create table if not exists public.ranking_publications (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references public.ranking_seasons(id) on delete cascade,
  category text not null,
  published_at timestamptz not null default now(),
  published_by uuid references public.profiles(id),
  snapshot jsonb not null default '[]'::jsonb,
  unique(season_id, category)
);

create table if not exists public.national_teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  season text,
  head_coach text,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists public.national_team_players (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.national_teams(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  role text default 'player',
  selection_date date default current_date,
  status text not null default 'selected',
  unique(team_id, player_id)
);

create table if not exists public.development_programs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  programme_type text not null,
  description text,
  venue text,
  start_date date,
  end_date date,
  status text not null default 'planned',
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_memberships_status on public.memberships(status);
create index if not exists idx_registrations_category on public.tournament_registrations(tournament_category_id);
create index if not exists idx_matches_tournament_status on public.matches(tournament_id,status);
create index if not exists idx_ranking_publications_category on public.ranking_publications(category,published_at desc);

alter table public.memberships enable row level security;
alter table public.tournament_categories enable row level security;
alter table public.tournament_registrations enable row level security;
alter table public.draws enable row level security;
alter table public.match_officials enable row level security;
alter table public.ranking_seasons enable row level security;
alter table public.ranking_publications enable row level security;
alter table public.national_teams enable row level security;
alter table public.national_team_players enable row level security;
alter table public.development_programs enable row level security;

-- Public-safe reads for published federation information.
create policy "public published ranking snapshots" on public.ranking_publications for select using (true);
create policy "public active national teams" on public.national_teams for select using (status = 'active');
create policy "public active development programs" on public.development_programs for select using (status in ('planned','active','completed'));

-- Operational writes are granted through server-side role guards plus authenticated access.
create policy "authenticated federation users read memberships" on public.memberships for select to authenticated using (true);
create policy "authenticated federation users manage registrations" on public.tournament_registrations for all to authenticated using (true) with check (true);
create policy "authenticated federation users manage draws" on public.draws for all to authenticated using (true) with check (true);
create policy "authenticated federation users manage match officials" on public.match_officials for all to authenticated using (true) with check (true);
create policy "authenticated federation users manage ranking seasons" on public.ranking_seasons for all to authenticated using (true) with check (true);
create policy "authenticated federation users manage national teams" on public.national_teams for all to authenticated using (true) with check (true);
create policy "authenticated federation users manage national team players" on public.national_team_players for all to authenticated using (true) with check (true);
create policy "authenticated federation users manage development" on public.development_programs for all to authenticated using (true) with check (true);
