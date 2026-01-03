export const dynamic = "force-dynamic";

import Link from 'next/link';
import { AppShell } from '@/components/AppShell';
import { getActiveOrganisationId } from '@/lib/auth';

export default async function PublishPage() {
  const orgId = await getActiveOrganisationId();

  return (
    <AppShell title="Publish">
      <h1 className="text-xl font-semibold">Publishing</h1>
      <p className="mt-2 text-sm text-slate-600">
        MVP placeholder for scheduling & publishing jobs. CSV export is available as a fallback.
      </p>

      <div className="mt-6 rounded border p-4">
        <div className="text-sm">
          Active org: <span className="font-mono">{orgId ?? '-'}</span>
        </div>
        <div className="mt-3">
          <Link href="/publish/export" className="rounded bg-slate-900 px-3 py-2 text-sm text-white">
            Download CSV export
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
