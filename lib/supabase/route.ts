import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import { getSupabaseEnv } from '@/lib/supabase/env';

export type TypedSupabaseClient = SupabaseClient<Database>;
export type CookieToSet = { name: string; value: string; options: CookieOptions };

export function createRouteHandlerSupabaseClient(params: {
  requestCookies: { getAll: () => { name: string; value: string }[] };
  setCookie: (cookie: CookieToSet) => void;
}): TypedSupabaseClient {
  const { url, anonKey } = getSupabaseEnv();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return params.requestCookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach((cookie) => params.setCookie(cookie));
      }
    }
  });
}
