'use server';

import { redirect } from 'next/navigation';
import { createActionSupabaseClient } from '@/lib/supabase/actions';
import { requireUser } from '@/lib/auth';
import type { Database } from '@/types/supabase';

type OrgRow = Database['public']['Tables']['organisations']['Row'];
type MemberRow = Database['public']['Tables']['organisation_members']['Row'];

export async function createOrganisation(formData: FormData) {
  const name = String(formData.get('name') || '').trim();
  const timezone = String(formData.get('timezone') || 'Australia/Sydney');

  if (!name) {
    throw new Error('Organisation name is required');
  }

  const supabase = await createActionSupabaseClient();
  const user = await requireUser();

  const { data: org, error } = await supabase
    .from<OrgRow>('organisations')
    .insert([
      {
        name,
        timezone,
        owner_id: user.id,
        created_at: new Date().toISOString(),
        id: crypto.randomUUID(),
      },
    ])
    .select('id')
    .single();

  if (error || !org) {
    throw new Error(error?.message ?? 'Failed to create organisation');
  }

  const { error: memberError } = await supabase
    .from<MemberRow>('organisation_members')
    .insert([
      {
        organisation_id: org.id,
        user_id: user.id,
        role: 'owner',
        created_at: new Date().toISOString(),
        id: crypto.randomUUID(),
      },
    ]);

  if (memberError) {
    throw new Error(memberError.message);
  }

  redirect(`/org/${org.id}`);
}
