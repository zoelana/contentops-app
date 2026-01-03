import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@/lib/supabase/middleware';

const PUBLIC_FILE = /\.(.*)$/;

function isAllowedPath(pathname: string): boolean {
  if (pathname.startsWith('/auth/')) return true;
  if (pathname.startsWith('/api/')) return true;
  if (pathname.startsWith('/_next/')) return true;
  if (pathname === '/favicon.ico') return true;
  if (PUBLIC_FILE.test(pathname)) return true;
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isAllowedPath(pathname)) {
    // Still refresh session cookies if needed (non-mutating for public routes)
    const { response } = await createMiddlewareClient(request);
    return response;
  }

  const { supabase, response, cookiesToSet } = await createMiddlewareClient(request);
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/auth/login';
    loginUrl.searchParams.set('redirectedFrom', pathname);

    const redirectResponse = NextResponse.redirect(loginUrl);
    // Forward any cookies Supabase wanted to set on this request.
    cookiesToSet.forEach((c) => {
      redirectResponse.cookies.set(c.name, c.value, c.options);
    });
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)']
};
