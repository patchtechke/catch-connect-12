import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabaseAdmin: SupabaseClient | null = null;

function getSupabaseUrl(): string | undefined {
  return process.env.SUPABASE_URL;
}

function getSupabaseServiceKey(): string | undefined {
  return process.env.SUPABASE_SERVICE_ROLE_KEY;
}

export function getSupabaseAdmin(): SupabaseClient {
  const supabaseUrl = getSupabaseUrl();
  const supabaseServiceKey = getSupabaseServiceKey();
  
  if (!_supabaseAdmin) {
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase is not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.");
    }
    _supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return _supabaseAdmin;
}

export const supabaseAdmin: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return getSupabaseAdmin()[prop as keyof SupabaseClient];
  },
});

export function createSupabaseClient(accessToken?: string): SupabaseClient {
  const supabaseUrl = getSupabaseUrl();
  const anonKey = process.env.SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !anonKey) {
    throw new Error("Supabase is not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.");
  }
  
  if (accessToken) {
    return createClient(supabaseUrl, anonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });
  }
  
  return createClient(supabaseUrl, anonKey);
}

export function isSupabaseConfigured(): boolean {
  return !!(getSupabaseUrl() && getSupabaseServiceKey());
}
