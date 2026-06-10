-- ═══════════════════════════════════════════════════
-- Run this ONCE in Supabase SQL Editor
-- Fixes: follow counts + comments RLS on mobile
-- ═══════════════════════════════════════════════════

-- 1. Make sure columns exist
alter table public.profiles
  add column if not exists followers int not null default 0,
  add column if not exists following int not null default 0;

-- 2. Trigger function — updates counts on follow/unfollow
create or replace function handle_follow_counts()
returns trigger language plpgsql security definer as $$
begin
  if TG_OP = 'INSERT' then
    update profiles set followers = followers + 1 where id = NEW.following_id;
    update profiles set following = following + 1 where id = NEW.follower_id;
  elsif TG_OP = 'DELETE' then
    update profiles set followers = greatest(followers - 1, 0) where id = OLD.following_id;
    update profiles set following = greatest(following - 1, 0) where id = OLD.follower_id;
  end if;
  return null;
end;
$$;

-- 3. Attach trigger to follows table
drop trigger if exists on_follow_change on public.follows;
create trigger on_follow_change
  after insert or delete on public.follows
  for each row execute function handle_follow_counts();

-- 4. Fix comments RLS — allow authenticated users to insert their own comments
drop policy if exists "Users can insert own comments" on public.comments;
create policy "Users can insert own comments"
  on public.comments for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Anyone can read comments" on public.comments;
create policy "Anyone can read comments"
  on public.comments for select
  to authenticated
  using (true);

-- 5. Make sure comments table has RLS enabled
alter table public.comments enable row level security;
