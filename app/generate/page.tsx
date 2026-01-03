export const dynamic = "force-dynamic";

import { AppShell } from '@/components/AppShell';
import { getActiveOrganisationId } from '@/lib/auth';

export default async function GeneratePage() {
  const orgId = await getActiveOrganisationId();
  return (
    <AppShell title="Generate">
      <h1 className="text-xl font-semibold">Generate</h1>
      <p className="mt-2 text-sm text-slate-600">
        MVP placeholder for constrained AI generation (fill Slot Plan, not freeform).
      </p>

      <div className="mt-6 rounded border p-4 text-sm">
        Active org: {orgId ?? 'none'}
      </div>
    </AppShell>
  );
}
