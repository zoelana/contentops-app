export function getSupabaseEnv(): {
  url: string;
  anonKey: string;
  siteUrl: string;
} {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!url) throw new Error('Missing env NEXT_PUBLIC_SUPABASE_URL');
  if (!anonKey) throw new Error('Missing env NEXT_PUBLIC_SUPABASE_ANON_KEY');
  if (!siteUrl) throw new Error('Missing env NEXT_PUBLIC_SITE_URL');

  return { url, anonKey, siteUrl };
}
