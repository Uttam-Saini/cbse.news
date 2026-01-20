import { createClient } from '@supabase/supabase-js';

/**
 * Creates a Supabase browser client for client-side operations.
 * Use this in client components, forms, and browser-side code.
 * This client does NOT use cookies() and is safe for client components.
 */
export function createBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
