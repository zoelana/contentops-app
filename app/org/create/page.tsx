export const dynamic = "force-dynamic";

import { createOrganisation } from './actions';

export default async function OrgCreatePage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center p-4">
      <h1 className="text-2xl font-semibold">Create organisation</h1>
      <p className="mt-2 text-sm text-slate-600">You need an organisation to continue.</p>

      <form action={createOrganisation} className="mt-6 space-y-3">
        <label className="block text-sm font-medium" htmlFor="name">
          Organisation name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full rounded border p-2"
          placeholder="Buzz Web Media"
        />

        <label className="block text-sm font-medium" htmlFor="timezone">
          Timezone
        </label>
        <input
          id="timezone"
          name="timezone"
          type="text"
          defaultValue="Australia/Sydney"
          className="w-full rounded border p-2"
        />

        <button type="submit" className="w-full rounded bg-slate-900 p-2 text-white">
          Create
        </button>
      </form>

      {error ? (
        <div className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-sm">
          {decodeURIComponent(error)}
        </div>
      ) : null}
    </div>
  );
}
