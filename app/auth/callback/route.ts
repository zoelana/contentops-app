import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerSupabaseClient, type CookieToSet } from '@/lib/supabase/route';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    const redirectUrl = new URL('/auth/login', url.origin);
    return NextResponse.redirect(redirectUrl);
  }

  const response = NextResponse.redirect(new URL('/org', url.origin));

  const supabase = createRouteHandlerSupabaseClient({
    requestCookies: {
      getAll: () => request.cookies.getAll()
    },
    setCookie: (cookie: CookieToSet) => {
      response.cookies.set(cookie.name, cookie.value, cookie.options);
    }
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const errUrl = new URL('/auth/login', url.origin);
    errUrl.searchParams.set('error', error.message);
    return NextResponse.redirect(errUrl);
  }

  return response;
}
