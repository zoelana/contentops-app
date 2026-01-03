export const dynamic = "force-dynamic";

import { AppShell } from '@/components/AppShell';
import { getActiveOrganisationId } from '@/lib/auth';

export default async function IdeasPage() {
  const orgId = await getActiveOrganisationId();
  return (
    <AppShell title="Ideas">
      <h1 className="text-xl font-semibold">Ideas</h1>
      <p className="mt-2 text-sm text-slate-600">
        MVP placeholder for Ideas inbox (Proposed → Approved → Briefed → Drafted → Reviewed → Approved to Produce → Scheduled → Published).
      </p>
      <div className="mt-4 rounded border p-4 text-sm">
        Active org: {orgId ?? 'None'}
      </div>
    </AppShell>
  );
}
