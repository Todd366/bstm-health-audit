create table if not exists public.audit_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  business_name text,
  industry text,
  location text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  auto_export_elos boolean not null default true,
  email_reports boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  business jsonb not null,
  health_score numeric(5,2) not null,
  category_scores jsonb not null,
  diagnosis jsonb not null,
  answers jsonb not null,
  elos_status text not null default 'pending' check (elos_status in ('pending','sent','failed')),
  elos_error text,
  created_at timestamptz not null default now()
);

create index if not exists audit_reports_user_created_idx
  on public.audit_reports (user_id, created_at desc);

alter table public.audit_profiles enable row level security;
alter table public.audit_settings enable row level security;
alter table public.audit_reports enable row level security;

drop policy if exists audit_profiles_select_own on public.audit_profiles;
drop policy if exists audit_profiles_insert_own on public.audit_profiles;
drop policy if exists audit_profiles_update_own on public.audit_profiles;
create policy audit_profiles_select_own on public.audit_profiles for select using (auth.uid() = id);
create policy audit_profiles_insert_own on public.audit_profiles for insert with check (auth.uid() = id);
create policy audit_profiles_update_own on public.audit_profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists audit_settings_select_own on public.audit_settings;
drop policy if exists audit_settings_insert_own on public.audit_settings;
drop policy if exists audit_settings_update_own on public.audit_settings;
create policy audit_settings_select_own on public.audit_settings for select using (auth.uid() = user_id);
create policy audit_settings_insert_own on public.audit_settings for insert with check (auth.uid() = user_id);
create policy audit_settings_update_own on public.audit_settings for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists audit_reports_select_own on public.audit_reports;
drop policy if exists audit_reports_insert_own on public.audit_reports;
drop policy if exists audit_reports_update_own on public.audit_reports;
drop policy if exists audit_reports_delete_own on public.audit_reports;
create policy audit_reports_select_own on public.audit_reports for select using (auth.uid() = user_id);
create policy audit_reports_insert_own on public.audit_reports for insert with check (auth.uid() = user_id);
create policy audit_reports_update_own on public.audit_reports for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy audit_reports_delete_own on public.audit_reports for delete using (auth.uid() = user_id);
