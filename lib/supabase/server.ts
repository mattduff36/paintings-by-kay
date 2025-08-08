import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL as string | undefined;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined;

if (!supabaseUrl || !serviceKey) {
  console.warn('Supabase env vars are missing');
}

export function getSupabaseAdmin() {
  return createClient(supabaseUrl || '', serviceKey || '', {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}


