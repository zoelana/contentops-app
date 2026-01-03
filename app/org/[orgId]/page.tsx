export const dynamic = "force-dynamic";

import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { AppShell } from '@/components/AppShell';

export default async function OrgHomePage({
  params
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  const supabase = await createServerSupabaseClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  const { data: member, error: memberError } = await supabase
    .from('organisation_members')
    .select('id, role')
    .eq('organisation_id', orgId)
    .eq('user_id', session.user.id)
    .maybeSingle();

  if (memberError || !member) {
    redirect('/org');
  }

  const { data: org } = await supabase
    .from('organisations')
    .select('name, timezone, created_at')
    .eq('id', orgId)
    .maybeSingle();

  return (
    <AppShell title={org?.name ?? 'Organisation'}>
      <h1 className="text-xl font-semibold">Organisation home</h1>
      <div className="mt-4 rounded border p-4 text-sm">
        <div><span className="font-medium">Org ID:</span> {orgId}</div>
        <div><span className="font-medium">Role:</span> {member.role}</div>
        <div><span className="font-medium">Timezone:</span> {org?.timezone ?? '-'}</div>
      </div>

      <div className="mt-6 rounded border p-4">
        <p className="text-sm text-slate-600">
          This is the baseline dashboard shell. Next steps: business profile, themes/weighting,
          planning, ideas pipeline, content generation, production calendar, and publishing.
        </p>
      </div>
    </AppShell>
  );
}
