import { createClient } from '@supabase/supabase-js';

export const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET || 'uploads';

let _client = null;
function getSupabase() {
  if (_client) return _client;
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  _client = createClient(url, key);
  return _client;
}

export async function uploadBufferToSupabase(path, buffer, contentType) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.storage.from(SUPABASE_BUCKET).upload(path, buffer, {
    contentType,
    upsert: false,
  });
  if (error) throw error;
  return data; // { path }
}

export function getPublicUrl(path) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  const { data } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(path);
  return data?.publicUrl;
}

export async function getSignedUrl(path, expiresInSeconds = 60 * 60) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.storage
    .from(SUPABASE_BUCKET)
    .createSignedUrl(path, expiresInSeconds);
  if (error) throw error;
  return data?.signedUrl;
}
