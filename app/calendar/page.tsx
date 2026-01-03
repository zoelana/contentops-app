export const dynamic = "force-dynamic";

import { AppShell } from '@/components/AppShell';
import { getActiveOrganisationId } from '@/lib/auth';

export default async function CalendarPage() {
  const orgId = await getActiveOrganisationId();
  return (
    <AppShell title="Calendar">
      <h1 className="text-xl font-semibold">Production calendar</h1>
      <p className="mt-2 text-sm text-slate-600">
        MVP placeholder for production tasks, approvals, due dates, and team assignments.
      </p>
      <div className="mt-4 rounded border p-4 text-sm">
        Active org: {orgId ?? '—'}
      </div>
    </AppShell>
  );
}
