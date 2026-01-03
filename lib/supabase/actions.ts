'use server';

import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import { getSupabaseEnv } from '@/lib/supabase/env';

export type TypedSupabaseClient = SupabaseClient<Database>;

type CookieToSet = { name: string; value: string; options: CookieOptions };

export async function createActionSupabaseClient(): Promise<TypedSupabaseClient> {
  const cookieStore = await cookies();
  const { url, anonKey } = getSupabaseEnv();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach((cookie) => {
          cookieStore.set(cookie.name, cookie.value, cookie.options);
        });
      }
    }
  });
}
