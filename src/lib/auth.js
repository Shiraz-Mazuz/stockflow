import { supabase } from './supabase';

/* ── Sign up with email ── */
export async function signUpEmail(email, password, name) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  });
  return { data, error };
}

/* ── Sign in with email ── */
export async function signInEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

/* ── Sign in with Google ── */
export async function signInGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  });
  return { data, error };
}

/* ── Sign out ── */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

/* ── Get current session ── */
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

/* ── Listen to auth changes ── */
export function onAuthChange(callback) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
  return subscription;
}
