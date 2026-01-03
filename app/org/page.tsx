export const dynamic = "force-dynamic";

import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function OrgIndexPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  const { data: memberships, error } = await supabase
    .from('organisation_members')
    .select('organisation_id, role')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: true });

  if (error) {
    // Conservative fallback: if membership query fails, force re-login.
    redirect('/auth/login');
  }

  if (!memberships || memberships.length === 0) {
    redirect('/org/create');
  }

  redirect(`/org/${memberships[0].organisation_id}`);
}
