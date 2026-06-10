import { supabase } from './supabase';

/* ══════════════════════════════════
   PROFILE
══════════════════════════════════ */
export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
}

export async function getProfileByHandle(handle) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('handle', handle)
    .single();
  return { data, error };
}

export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
}

/* ══════════════════════════════════
   POSTS
══════════════════════════════════ */
export async function getFeedPosts(limit = 20) {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles (id, name, handle, init, avatar_color, accuracy)
    `)
    .order('created_at', { ascending: false })
    .limit(limit);
  return { data, error };
}

export async function getPostsByTicker(ticker) {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles (id, name, handle, init, avatar_color, accuracy)
    `)
    .eq('ticker', ticker)
    .order('created_at', { ascending: false });
  return { data, error };
}

export async function getMyPosts(userId) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
}

export async function createPost(post) {
  const { data, error } = await supabase
    .from('posts')
    .insert(post)
    .select(`*, profiles (id, name, handle, init, avatar_color)`)
    .single();
  return { data, error };
}

export async function deletePost(postId) {
  const { error } = await supabase.from('posts').delete().eq('id', postId);
  return { error };
}

/* ══════════════════════════════════
   LIKES
══════════════════════════════════ */
export async function likePost(postId, userId) {
  const { error } = await supabase
    .from('likes')
    .insert({ post_id: postId, user_id: userId });
  if (!error) {
    await supabase.rpc('increment_likes', { post_id: postId });
  }
  return { error };
}

export async function unlikePost(postId, userId) {
  const { error } = await supabase
    .from('likes')
    .delete()
    .eq('post_id', postId)
    .eq('user_id', userId);
  if (!error) {
    await supabase.rpc('decrement_likes', { post_id: postId });
  }
  return { error };
}

export async function getMyLikes(userId) {
  const { data } = await supabase
    .from('likes')
    .select('post_id')
    .eq('user_id', userId);
  return data?.map(l => l.post_id) || [];
}

/* ══════════════════════════════════
   COMMENTS
══════════════════════════════════ */
export async function getComments(postId) {
  const { data, error } = await supabase
    .from('comments')
    .select(`*, profiles (name, handle, init, avatar_color)`)
    .eq('post_id', postId)
    .order('created_at', { ascending: true });
  return { data, error };
}

export async function addComment(postId, userId, text) {
  const { data, error } = await supabase
    .from('comments')
    .insert({ post_id: postId, user_id: userId, text })
    .select(`*, profiles (name, handle, init, avatar_color)`)
    .single();
  return { data, error };
}

/* ══════════════════════════════════
   WATCHLIST
══════════════════════════════════ */
export async function getWatchlist(userId) {
  const { data, error } = await supabase
    .from('watchlist')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });
  return { data, error };
}

export async function addToWatchlistDB(userId, stock) {
  const { data, error } = await supabase
    .from('watchlist')
    .upsert({ user_id: userId, ...stock }, { onConflict: 'user_id,ticker' })
    .select()
    .single();
  return { data, error };
}

export async function removeFromWatchlistDB(userId, ticker) {
  const { error } = await supabase
    .from('watchlist')
    .delete()
    .eq('user_id', userId)
    .eq('ticker', ticker);
  return { error };
}

/* ══════════════════════════════════
   SAVED POSTS
══════════════════════════════════ */
export async function getSavedPosts(userId) {
  const { data, error } = await supabase
    .from('saved_posts')
    .select(`*, posts (*, profiles (name, handle, init, avatar_color))`)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
}

export async function savePostDB(userId, postId) {
  const { error } = await supabase
    .from('saved_posts')
    .insert({ user_id: userId, post_id: postId });
  return { error };
}

export async function unsavePostDB(userId, postId) {
  const { error } = await supabase
    .from('saved_posts')
    .delete()
    .eq('user_id', userId)
    .eq('post_id', postId);
  return { error };
}

export async function getMySavedIds(userId) {
  const { data } = await supabase
    .from('saved_posts')
    .select('post_id')
    .eq('user_id', userId);
  return data?.map(s => s.post_id) || [];
}

/* ══════════════════════════════════
   VOTES
══════════════════════════════════ */
export async function vote(postId, userId, direction) {
  const { error } = await supabase
    .from('votes')
    .upsert({ post_id: postId, user_id: userId, direction }, { onConflict: 'post_id,user_id' });
  return { error };
}

export async function getMyVotes(userId) {
  const { data } = await supabase
    .from('votes')
    .select('post_id, direction')
    .eq('user_id', userId);
  return data || [];
}

/* ══════════════════════════════════
   FOLLOWS
══════════════════════════════════ */
export async function followUser(followerId, followingId) {
  const { error } = await supabase
    .from('follows')
    .insert({ follower_id: followerId, following_id: followingId });
  /* follower/following counts are updated by a DB trigger — see follow_trigger.sql */
  return { error };
}

export async function unfollowUser(followerId, followingId) {
  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('follower_id', followerId)
    .eq('following_id', followingId);
  return { error };
}

export async function getFollowing(userId) {
  const { data } = await supabase
    .from('follows')
    .select('following_id')
    .eq('follower_id', userId);
  return data?.map(f => f.following_id) || [];
}
