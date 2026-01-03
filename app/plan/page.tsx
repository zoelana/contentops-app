export const dynamic = "force-dynamic";

import { AppShell } from '@/components/AppShell';
import { getActiveOrganisationId } from '@/lib/auth';

export default async function PlanPage() {
  const orgId = await getActiveOrganisationId();
  return (
    <AppShell title="Plan">
      <h1 className="text-xl font-semibold">Planning</h1>
      <p className="mt-2 text-sm text-slate-600">
        MVP placeholder for Slot Plan generation (month or quarter) based on quarterly weighting,
        monthly objectives, and weekly horizon ratios.
      </p>
      <div className="mt-4 rounded border p-4 text-sm">
        <div><span className="font-medium">Active org:</span> {orgId ?? 'None'}</div>
      </div>
    </AppShell>
  );
}
