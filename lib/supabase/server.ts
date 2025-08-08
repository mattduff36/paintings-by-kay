import { createClient } from '@supabase/supabase-js';

// If Supabase env is not provided, fall back to Postgres with pg (Neon)
const supabaseUrl = process.env.SUPABASE_URL as string | undefined;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined;

export function getSupabaseAdmin() {
  if (!supabaseUrl || !serviceKey) {
    throw new Error('Supabase configuration is required for this implementation.');
  }
  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}


