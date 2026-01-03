import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * Require an authenticated user.
 * Redirects to /auth/login if not authenticated.
 */
export async function requireUser() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || !session.user) {
    redirect('/auth/login');
  }

  return session.user;
}

/**
 * Resolve the active organisation for the current user.
 * If none exists, redirect to /org/create.
 */
export async function getActiveOrganisationId(): Promise<string> {
  const supabase = await createServerSupabaseClient();
  const user = await requireUser();

  const { data: membership } = await supabase
    .from('organisation_members')
    .select('organisation_id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
    .limit(1)
    .single();

  if (!membership) {
    redirect('/org/create');
  }

  return membership.organisation_id;
}
