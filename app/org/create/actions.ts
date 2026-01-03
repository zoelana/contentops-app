'use server';

import { redirect } from 'next/navigation';
import { createActionSupabaseClient } from '@/lib/supabase/actions';

export async function createOrganisation(formData: FormData): Promise<void> {
  const nameRaw = formData.get('name');
  const timezoneRaw = formData.get('timezone');

  const name = typeof nameRaw === 'string' ? nameRaw.trim() : '';
  const timezone = typeof timezoneRaw === 'string' ? timezoneRaw.trim() : 'Australia/Sydney';

  if (!name) {
    redirect('/org/create?error=missing_name');
  }

  const supabase = await createActionSupabaseClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  const { data: org, error: orgError } = await supabase
    .from('organisations')
    .insert({ name, timezone, owner_id: session.user.id })
    .select('id')
    .single();

  if (orgError || !org) {
    redirect(`/org/create?error=${encodeURIComponent(orgError?.message ?? 'org_create_failed')}`);
  }

  const { error: memberError } = await supabase.from('organisation_members').insert({
    organisation_id: org.id,
    user_id: session.user.id,
    role: 'owner'
  });

  if (memberError) {
    redirect(`/org/create?error=${encodeURIComponent(memberError.message)}`);
  }

  redirect(`/org/${org.id}`);
}
