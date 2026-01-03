import { notFound } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { createServerSupabaseClient } from '@/lib/supabase/server';

type OrgRow = {
  id: string;
  name: string;
  timezone: string;
};

export default async function OrgPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;

  const supabase = await createServerSupabaseClient();

  const { data: org, error } = await supabase
    .from('organisations')
    .select('id, name, timezone')
    .eq('id', orgId)
    .single<OrgRow>();

  if (error || !org) {
    notFound();
  }

  return (
    <AppShell title={org.name ?? 'Organisation'}>
      <h1 className="text-xl font-semibold">Organisation home</h1>

      <div className="mt-4 rounded border p-4 text-sm">
        <div>
          <span className="font-medium">Org ID:</span> {orgId}
        </div>
        <div>
          <span className="font-medium">Timezone:</span> {org.timezone}
        </div>
      </div>
    </AppShell>
  );
}
