-- ═══════════════════════════════════════
-- StockFlow — Supabase Schema
-- הדבק את כל הקובץ ב SQL Editor והרץ
-- ═══════════════════════════════════════

-- ── 1. PROFILES ──────────────────────────
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null default 'משתמש חדש',
  handle text unique,
  bio text default 'טריידר חדש ב-StockFlow 🚀',
  avatar_color text default 'linear-gradient(135deg,#00ff88,#4da6ff)',
  init text default 'מ',
  posts_count int default 0,
  accuracy int default 0,
  bull_acc int default 0,
  bear_acc int default 0,
  followers int default 0,
  following int default 0,
  pnl text default '+0%',
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
declare
  raw_name text;
  raw_handle text;
begin
  raw_name := coalesce(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    split_part(new.email, '@', 1)
  );
  raw_handle := lower(regexp_replace(raw_name, '[^a-zA-Z0-9֐-׿]', '', 'g'));
  raw_handle := coalesce(nullif(raw_handle, ''), 'user') || '_' || substring(new.id::text, 1, 6);

  insert into public.profiles (id, name, handle, init)
  values (
    new.id,
    raw_name,
    raw_handle,
    substring(raw_name, 1, 1)
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── 2. POSTS ─────────────────────────────
create table if not exists public.posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  ticker text not null,
  text text not null,
  sentiment text check (sentiment in ('bull','bear')) not null,
  likes int default 0,
  bull_pct int default 50,
  price text,
  exchange text,
  change_pct text,
  direction int default 1,
  base numeric,
  tr numeric,
  vol numeric,
  created_at timestamptz default now()
);

-- ── 3. COMMENTS ──────────────────────────
create table if not exists public.comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  text text not null,
  likes int default 0,
  created_at timestamptz default now()
);

-- ── 4. WATCHLIST ─────────────────────────
create table if not exists public.watchlist (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  ticker text not null,
  name text,
  price text,
  change_pct text,
  direction int default 1,
  base numeric,
  tr numeric,
  vol numeric,
  created_at timestamptz default now(),
  unique(user_id, ticker)
);

-- ── 5. SAVED POSTS ───────────────────────
create table if not exists public.saved_posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  post_id uuid references public.posts(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, post_id)
);

-- ── 6. VOTES (Bull/Bear) ─────────────────
create table if not exists public.votes (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  direction text check (direction in ('bull','bear')) not null,
  created_at timestamptz default now(),
  unique(post_id, user_id)
);

-- ── 7. LIKES ─────────────────────────────
create table if not exists public.likes (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(post_id, user_id)
);

-- ── 8. FOLLOWS ───────────────────────────
create table if not exists public.follows (
  id uuid default gen_random_uuid() primary key,
  follower_id uuid references public.profiles(id) on delete cascade not null,
  following_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(follower_id, following_id)
);

-- ═══════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════

alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.watchlist enable row level security;
alter table public.saved_posts enable row level security;
alter table public.votes enable row level security;
alter table public.likes enable row level security;
alter table public.follows enable row level security;

-- Profiles: everyone can read, only owner can write
create policy "profiles_read" on public.profiles for select using (true);
create policy "profiles_write" on public.profiles for all using (auth.uid() = id);

-- Posts: everyone can read, only owner can insert/delete
create policy "posts_read" on public.posts for select using (true);
create policy "posts_insert" on public.posts for insert with check (auth.uid() = user_id);
create policy "posts_delete" on public.posts for delete using (auth.uid() = user_id);
create policy "posts_update_likes" on public.posts for update using (true);

-- Comments: everyone reads, auth users write
create policy "comments_read" on public.comments for select using (true);
create policy "comments_insert" on public.comments for insert with check (auth.uid() = user_id);
create policy "comments_delete" on public.comments for delete using (auth.uid() = user_id);

-- Watchlist: private per user
create policy "watchlist_own" on public.watchlist for all using (auth.uid() = user_id);

-- Saved posts: private per user
create policy "saved_own" on public.saved_posts for all using (auth.uid() = user_id);

-- Votes: everyone reads, auth users write own
create policy "votes_read" on public.votes for select using (true);
create policy "votes_write" on public.votes for all using (auth.uid() = user_id);

-- Likes: everyone reads, auth users write own
create policy "likes_read" on public.likes for select using (true);
create policy "likes_write" on public.likes for all using (auth.uid() = user_id);

-- Follows: everyone reads, auth users write own
create policy "follows_read" on public.follows for select using (true);
create policy "follows_write" on public.follows for all using (auth.uid() = user_id);

-- ═══════════════════════════════════════
-- SEED: כמה פוסטים לדמו
-- ═══════════════════════════════════════
-- (הפוסטים יווצרו אחרי שיש משתמשים)
