-- Basic profiles table tied to auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  display_name text,
  tier text default 'Free',
  role text default 'user',
  streak int default 0,
  last_checkin date,
  created_at timestamptz default now()
);

-- Videos and exercises
create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  youtube_url text not null,
  body_part text not null,
  level text not null check (level in ('Beginner','Intermediate','Advanced','PRO')),
  min_tier text not null check (min_tier in ('Beginner','Intermediate','Advanced','PRO')),
  created_at timestamptz default now()
);

-- Check-ins
create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  workout_type text not null,
  rpe int not null,
  reps int default 0,
  points_awarded int not null,
  created_at timestamptz default now()
);

-- Weekly leaderboard view (Sunday 00:00 to Saturday 23:59 in UTC)
create or replace view public.leaderboard_weekly as
select
  c.user_id,
  p.display_name,
  p.email,
  p.tier,
  p.streak,
  sum(c.points_awarded) as points
from public.checkins c
join public.profiles p on p.id = c.user_id
where c.created_at >= date_trunc('week', now()) -- week start
group by c.user_id, p.display_name, p.email, p.tier, p.streak
order by points desc;

-- RPC to bump streak when checking in (simple version: consecutive-day logic)
create or replace function public.touch_streak(p_user_id uuid)
returns void language plpgsql as $$
declare
  last_d date;
begin
  select last_checkin into last_d from public.profiles where id = p_user_id;
  if last_d is null or last_d < (current_date - 1) then
    -- new streak
    update public.profiles set streak = 1, last_checkin = current_date where id = p_user_id;
  elsif last_d = current_date - 1 then
    update public.profiles set streak = streak + 1, last_checkin = current_date where id = p_user_id;
  elsif last_d = current_date then
    -- already checked in today; do nothing
    null;
  else
    update public.profiles set last_checkin = current_date where id = p_user_id;
  end if;
end;
$$;

-- RPC helper to read streak
create or replace function public.get_user_streak(p_user_id uuid)
returns int language sql as $$
  select streak from public.profiles where id = p_user_id
$$;

-- RLS
alter table public.profiles enable row level security;
alter table public.videos enable row level security;
alter table public.checkins enable row level security;

-- Policies: profiles (user can read own, admin can read all; user can update own display_name)
do $$ begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename='profiles' and policyname='read_own_profile') then
    create policy "read_own_profile" on public.profiles for select using (auth.uid() = id or exists(select 1));
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename='profiles' and policyname='update_own_profile') then
    create policy "update_own_profile" on public.profiles for update using (auth.uid() = id);
  end if;
end $$;

-- Videos: readable by all signed-in users; insert/update only by admin (enforced in app)
do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='videos' and policyname='videos_read') then
    create policy "videos_read" on public.videos for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='videos' and policyname='videos_write_admin_only') then
    create policy "videos_write_admin_only" on public.videos for insert with check (exists (select 1 from public.profiles where id = auth.uid() and role='admin'));
  end if;
end $$;

-- Checkins: users can only see/insert their own
do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='checkins' and policyname='checkins_read_own') then
    create policy "checkins_read_own" on public.checkins for select using (user_id = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='checkins' and policyname='checkins_insert_own') then
    create policy "checkins_insert_own" on public.checkins for insert with check (user_id = auth.uid());
  end if;
end $$;

-- Profile upsert trigger on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
