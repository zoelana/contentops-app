# ContentOps (baseline)

Production-ready baseline for ContentOps using:
- Next.js App Router (v15+)
- TypeScript (`strict: true`)
- Supabase Auth (magic link PKCE) via `@supabase/ssr` (no deprecated helpers)

## Environment variables

Copy `.env.example` to `.env.local` and set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` (e.g. `https://app.buzzwebmedia.au`)

## Supabase Auth settings

- Auth provider: Email
- Magic link / OTP enabled
- Site URL: `NEXT_PUBLIC_SITE_URL`
- Redirect URLs allow-list must include:
  - `https://app.buzzwebmedia.au/auth/callback`

### Email template (required)

Use this exact link format:

```html
<a href="{{ .ConfirmationURL }}">Log in</a>
```

## Database migrations

SQL migrations live in `supabase/migrations`.

- `0001_init.sql`

Run the migration SQL in the Supabase SQL editor.

## Local development

```bash
npm install
npm run dev
```

## Key routes

- `/auth/login` send magic link
- `/auth/callback` exchanges `?code=` for a session
- `/org` resolves membership
- `/org/create` creates org + membership
- `/publish/export` CSV export
