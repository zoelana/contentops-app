import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import { getSupabaseEnv } from '@/lib/supabase/env';

export type TypedSupabaseClient = SupabaseClient<Database>;

type CookieToSet = { name: string; value: string; options: CookieOptions };

/**
 * Server Components: cookie writes may throw. We catch & ignore writes here.
 */
export async function createServerSupabaseClient(): Promise<TypedSupabaseClient> {
  const cookieStore = await cookies();
  const { url, anonKey } = getSupabaseEnv();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach((cookie) => {
            cookieStore.set(cookie.name, cookie.value, cookie.options);
          });
        } catch {
          // Server Components may not set cookies.
        }
      }
    }
  });
}
