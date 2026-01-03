'use server';

import { redirect } from 'next/navigation';
import { createActionSupabaseClient } from '@/lib/supabase/actions';
import { getSupabaseEnv } from '@/lib/supabase/env';

export async function sendMagicLink(formData: FormData): Promise<void> {
  const emailRaw = formData.get('email');
  const email = typeof emailRaw === 'string' ? emailRaw.trim() : '';

  if (!email) {
    redirect('/auth/login?error=missing_email');
  }

  const supabase = await createActionSupabaseClient();
  const { siteUrl } = getSupabaseEnv();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`
    }
  });

  if (error) {
    redirect(`/auth/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect('/auth/login?sent=true');
}
