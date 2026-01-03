import Link from 'next/link';
import { sendMagicLink } from './actions';

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const { sent, error } = await searchParams;

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center p-4">
      <h1 className="text-2xl font-semibold">Log in</h1>
      <p className="mt-2 text-sm text-slate-600">
        We will send you a magic link.
      </p>

      {sent === 'true' ? (
        <div className="mt-6 rounded border border-green-200 bg-green-50 p-3 text-sm">
          Link sent. Check your email.
        </div>
      ) : (
        <form action={sendMagicLink} className="mt-6 space-y-3">
          <label className="block text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded border p-2"
            placeholder="you@company.com"
          />
          <button type="submit" className="w-full rounded bg-slate-900 p-2 text-white">
            Send magic link
          </button>
        </form>
      )}

      {error ? (
        <div className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-sm">
          {decodeURIComponent(error)}
        </div>
      ) : null}

      <div className="mt-6 text-sm text-slate-600">
        <Link href="/" className="hover:underline">
          Back to home
        </Link>
      </div>
    </div>
  );
}
