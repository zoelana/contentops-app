import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerSupabaseClient, type CookieToSet } from '@/lib/supabase/route';

function toCsv(rows: Array<Record<string, string>>): string {
  const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
  const escapeValue = (value: string) => {
    const needsQuotes = /[",\n]/.test(value);
    const escaped = value.replace(/"/g, '""');
    return needsQuotes ? `"${escaped}"` : escaped;
  };

  const lines = [
    headers.join(','),
    ...rows.map((row) => headers.map((h) => escapeValue(row[h] ?? '')).join(','))
  ];

  return lines.join('\n');
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);

  const cookiesToSet: CookieToSet[] = [];

  const supabase = createRouteHandlerSupabaseClient({
    requestCookies: { getAll: () => request.cookies.getAll() },
    setCookie: (cookie: CookieToSet) => {
      cookiesToSet.push(cookie);
    }
  });

  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.redirect(new URL('/auth/login', url.origin));
  }

  const { data: memberships } = await supabase
    .from('organisation_members')
    .select('organisation_id')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: true })
    .limit(1);

  const orgId = memberships && memberships.length > 0 ? memberships[0].organisation_id : null;
  if (!orgId) {
    return NextResponse.redirect(new URL('/org/create', url.origin));
  }

  const { data: items } = await supabase
    .from('content_items')
    .select('id, body, status, created_at')
    .eq('organisation_id', orgId)
    .order('created_at', { ascending: false })
    .limit(200);

  const rows: Array<Record<string, string>> = (items ?? []).map((i) => ({
    id: i.id,
    status: i.status,
    body: i.body,
    created_at: i.created_at
  }));

  if (rows.length === 0) {
    rows.push({ id: '', status: '', body: 'No content items yet', created_at: '' });
  }

  const csv = toCsv(rows);

  const downloadResponse = new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="contentops-export.csv"'
    }
  });

  cookiesToSet.forEach((c) => {
    downloadResponse.cookies.set(c.name, c.value, c.options);
  });

  return downloadResponse;
}
