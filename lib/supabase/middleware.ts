import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import { getSupabaseEnv } from '@/lib/supabase/env';

export type TypedSupabaseClient = SupabaseClient<Database>;

export type CookieToSet = { name: string; value: string; options: CookieOptions };

export async function createMiddlewareClient(
  request: NextRequest
): Promise<{ supabase: TypedSupabaseClient; response: NextResponse; cookiesToSet: CookieToSet[] }> {
  const { url, anonKey } = getSupabaseEnv();
  const response = NextResponse.next({ request: { headers: request.headers } });

  const cookiesToSet: CookieToSet[] = [];

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(newCookies: CookieToSet[]) {
        newCookies.forEach((c) => {
          cookiesToSet.push(c);
          response.cookies.set(c.name, c.value, c.options);
        });
      }
    }
  });

  // Refresh session (if needed) and ensure cookies are synchronised.
  await supabase.auth.getSession();

  return { supabase, response, cookiesToSet };
}
