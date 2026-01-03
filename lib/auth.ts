import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function requireSession() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  return { supabase, session };
}

export async function getActiveOrganisationId(): Promise<string | null> {
  const { supabase, session } = await requireSession();
  const { data } = await supabase
    .from('organisation_members')
    .select('organisation_id')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: true })
    .limit(1);

  return data && data.length > 0 ? data[0].organisation_id : null;
}
