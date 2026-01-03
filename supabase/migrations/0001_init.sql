-- ContentOps baseline schema (multi-organisation) + MVP tables
-- IMPORTANT: run in Supabase SQL editor

-- Enable required extension
create extension if not exists "pgcrypto";

-- ===============================================================
-- 1) ORGANISATIONS & MEMBERSHIP (core requirements)
-- ===============================================================

create table if not exists organisations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  timezone text not null default 'Australia/Sydney',
  created_at timestamptz not null default now()
);

create table if not exists organisation_members (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','admin','member')),
  created_at timestamptz not null default now(),
  unique (organisation_id, user_id)
);

alter table organisations enable row level security;
alter table organisation_members enable row level security;

-- Orgs:
-- - insert allowed only when owner_id = auth.uid()
create policy "org insert owner only"
on organisations for insert
with check (owner_id = auth.uid());

-- - select allowed if user is a member
create policy "org select if member"
on organisations for select
using (
  exists (
    select 1
    from organisation_members
    where organisation_members.organisation_id = organisations.id
      and organisation_members.user_id = auth.uid()
  )
);

-- Memberships:
-- - insert allowed only when user_id = auth.uid()
create policy "membership insert self only"
on organisation_members for insert
with check (user_id = auth.uid());

-- - select allowed only when user_id = auth.uid()
create policy "membership select self"
on organisation_members for select
using (user_id = auth.uid());

-- ===============================================================
-- 2) BUSINESS PROFILE (per org)
-- ===============================================================

create table if not exists business_profiles (
  organisation_id uuid primary key references organisations(id) on delete cascade,
  business_name text not null,
  website text,
  niche text,
  target_audience text,
  positioning text,
  brand_voice jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table business_profiles enable row level security;

create policy "org members manage business profile"
on business_profiles
using (
  exists (
    select 1
    from organisation_members
    where organisation_members.organisation_id = business_profiles.organisation_id
      and organisation_members.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from organisation_members
    where organisation_members.organisation_id = business_profiles.organisation_id
      and organisation_members.user_id = auth.uid()
  )
);

-- ===============================================================
-- 3) STRATEGIC THEMES & WEIGHTING
-- ===============================================================

create table if not exists themes (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique (organisation_id, name)
);

create table if not exists quarterly_theme_weighting (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  quarter text not null, -- e.g. 2026-Q1
  theme_id uuid not null references themes(id) on delete cascade,
  weight integer not null check (weight > 0),
  created_at timestamptz not null default now(),
  unique (organisation_id, quarter, theme_id)
);

alter table themes enable row level security;
alter table quarterly_theme_weighting enable row level security;

create policy "org members manage themes"
on themes
using (
  exists (
    select 1
    from organisation_members
    where organisation_members.organisation_id = themes.organisation_id
      and organisation_members.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from organisation_members
    where organisation_members.organisation_id = themes.organisation_id
      and organisation_members.user_id = auth.uid()
  )
);

create policy "org members manage theme weighting"
on quarterly_theme_weighting
using (
  exists (
    select 1
    from organisation_members
    where organisation_members.organisation_id = quarterly_theme_weighting.organisation_id
      and organisation_members.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from organisation_members
    where organisation_members.organisation_id = quarterly_theme_weighting.organisation_id
      and organisation_members.user_id = auth.uid()
  )
);

-- ===============================================================
-- 4) GOALS BY HORIZON
-- ===============================================================

create table if not exists goals (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  horizon text not null check (horizon in ('long','mid','short')),
  period text not null, -- e.g. 2026, 2026-Q1, 2026-01
  description text not null,
  created_at timestamptz not null default now()
);

alter table goals enable row level security;

create policy "org members manage goals"
on goals
using (
  exists (
    select 1
    from organisation_members
    where organisation_members.organisation_id = goals.organisation_id
      and organisation_members.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from organisation_members
    where organisation_members.organisation_id = goals.organisation_id
      and organisation_members.user_id = auth.uid()
  )
);

-- ===============================================================
-- 5) PLANNING SLOTS (the AI contract)
-- ===============================================================

create table if not exists content_slots (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  week_start date not null,
  channel text not null,
  horizon text not null check (horizon in ('LT','MT','ST')),
  theme_id uuid references themes(id),
  objective text not null,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

alter table content_slots enable row level security;

create policy "org members manage slots"
on content_slots
using (
  exists (
    select 1
    from organisation_members
    where organisation_members.organisation_id = content_slots.organisation_id
      and organisation_members.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from organisation_members
    where organisation_members.organisation_id = content_slots.organisation_id
      and organisation_members.user_id = auth.uid()
  )
);

-- ===============================================================
-- 6) IDEAS & CONTENT
-- ===============================================================

create table if not exists ideas (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  slot_id uuid references content_slots(id) on delete set null,
  title text not null,
  horizon text not null check (horizon in ('LT','MT','ST')),
  theme_id uuid references themes(id),
  channel text not null,
  status text not null default 'proposed',
  created_at timestamptz not null default now()
);

create table if not exists content_items (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  idea_id uuid references ideas(id) on delete cascade,
  body text not null,
  metadata jsonb not null default '{}'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now()
);

alter table ideas enable row level security;
alter table content_items enable row level security;

create policy "org members manage ideas"
on ideas
using (
  exists (
    select 1
    from organisation_members
    where organisation_members.organisation_id = ideas.organisation_id
      and organisation_members.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from organisation_members
    where organisation_members.organisation_id = ideas.organisation_id
      and organisation_members.user_id = auth.uid()
  )
);

create policy "org members manage content"
on content_items
using (
  exists (
    select 1
    from organisation_members
    where organisation_members.organisation_id = content_items.organisation_id
      and organisation_members.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from organisation_members
    where organisation_members.organisation_id = content_items.organisation_id
      and organisation_members.user_id = auth.uid()
  )
);

-- ===============================================================
-- 7) PUBLISHING & JOBS
-- ===============================================================

create table if not exists publish_jobs (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  content_id uuid references content_items(id) on delete cascade,
  channel text not null,
  provider text not null,
  status text not null,
  publish_at timestamptz,
  last_error text,
  created_at timestamptz not null default now()
);

alter table publish_jobs enable row level security;

create policy "org members manage publish jobs"
on publish_jobs
using (
  exists (
    select 1
    from organisation_members
    where organisation_members.organisation_id = publish_jobs.organisation_id
      and organisation_members.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from organisation_members
    where organisation_members.organisation_id = publish_jobs.organisation_id
      and organisation_members.user_id = auth.uid()
  )
);

-- ===============================================================
-- 8) AI USAGE & AUDIT LOGS
-- ===============================================================

create table if not exists ai_usage (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  user_id uuid references auth.users(id),
  request_id uuid default gen_random_uuid(),
  model text not null,
  purpose text not null,
  endpoint text,
  prompt_tokens integer,
  completion_tokens integer,
  total_tokens integer,
  estimated_cost numeric,
  latency_ms integer,
  status text not null default 'success',
  error_code text,
  error_message text,
  created_at timestamptz not null default now()
);

create table if not exists audit_events (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  user_id uuid references auth.users(id),
  action text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table ai_usage enable row level security;
alter table audit_events enable row level security;

create policy "org members read ai usage"
on ai_usage for select
using (
  exists (
    select 1
    from organisation_members
    where organisation_members.organisation_id = ai_usage.organisation_id
      and organisation_members.user_id = auth.uid()
  )
);

create policy "org members read audit logs"
on audit_events for select
using (
  exists (
    select 1
    from organisation_members
    where organisation_members.organisation_id = audit_events.organisation_id
      and organisation_members.user_id = auth.uid()
  )
);
