'use client';

import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    // Sign out from SSR client (cookies)
    const ssrClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await ssrClient.auth.signOut();

    // Also clear localStorage (remember me sessions)
    const localStorageClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          storage: window.localStorage,
        },
      }
    );
    await localStorageClient.auth.signOut();

    // Clear sessionStorage (non-remember me sessions)
    const sessionStorageClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          storage: window.sessionStorage,
        },
      }
    );
    await sessionStorageClient.auth.signOut();

    router.push('/admin/login');
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300"
    >
      Logout
    </button>
  );
}
