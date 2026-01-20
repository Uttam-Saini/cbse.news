'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import Link from 'next/link';

// Custom storage adapter that switches between localStorage and sessionStorage
function createStorageAdapter(useLocalStorage: boolean) {
  const storage = useLocalStorage ? window.localStorage : window.sessionStorage;

  return {
    getItem: (key: string) => {
      try {
        return storage.getItem(key);
      } catch (error) {
        return null;
      }
    },
    setItem: (key: string, value: string) => {
      try {
        storage.setItem(key, value);
      } catch (error) {
        // Storage quota exceeded or other error
        console.error('Storage error:', error);
      }
    },
    removeItem: (key: string) => {
      try {
        storage.removeItem(key);
      } catch (error) {
        console.error('Storage error:', error);
      }
    },
  };
}

// Create Supabase client with custom storage for login
// This client is used only for authentication, then we sync to SSR client
function createLoginClient(rememberMe: boolean): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        storage: createStorageAdapter(rememberMe),
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    }
  );
}

// Create SSR browser client for cookie sync (used after login)
function createSSRClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const router = useRouter();

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        // First check SSR client (cookies) - this is the source of truth for server-side
        const ssrClient = createSSRClient();
        const { data: { session: ssrSession } } = await ssrClient.auth.getSession();

        if (ssrSession?.user) {
          router.push('/admin/dashboard');
          router.refresh();
          return;
        }

        // Also check localStorage (remember me)
        const localStorageClient = createLoginClient(true);
        const { data: { session: localStorageSession } } = await localStorageClient.auth.getSession();

        if (localStorageSession?.user) {
          // Sync to SSR client (cookies) for server-side access
          await ssrClient.auth.setSession({
            access_token: localStorageSession.access_token,
            refresh_token: localStorageSession.refresh_token,
          });
          router.push('/admin/dashboard');
          router.refresh();
          return;
        }

        // Check sessionStorage (no remember me)
        const sessionStorageClient = createLoginClient(false);
        const { data: { session: sessionStorageSession } } = await sessionStorageClient.auth.getSession();

        if (sessionStorageSession?.user) {
          // Sync to SSR client (cookies) for server-side access
          await ssrClient.auth.setSession({
            access_token: sessionStorageSession.access_token,
            refresh_token: sessionStorageSession.refresh_token,
          });
          router.push('/admin/dashboard');
          router.refresh();
          return;
        }
      } catch (err) {
        // Ignore errors during session check
        console.error('Session check error:', err);
      } finally {
        setCheckingSession(false);
      }
    };

    checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create login client with appropriate storage based on "Remember Me"
      const loginClient = createLoginClient(rememberMe);

      const { data, error } = await loginClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session && data.user) {
        // Clear the other storage to avoid conflicts
        if (rememberMe) {
          // Clear sessionStorage if using localStorage
          const sessionStorageClient = createLoginClient(false);
          await sessionStorageClient.auth.signOut();
        } else {
          // Clear localStorage if using sessionStorage
          const localStorageClient = createLoginClient(true);
          await localStorageClient.auth.signOut();
        }

        // Sync session to SSR client (cookies) for server-side access
        const ssrClient = createSSRClient();
        await ssrClient.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });

        router.push('/admin/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking session
  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#202124] transition-colors duration-300">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-[#d1d5db]">Checking session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#202124] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-[#1f1f1f] rounded-xl border border-gray-200 dark:border-white/10 p-8 transition-colors duration-300">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-[#d1d5db]">
            Sign in to manage news articles
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded transition-colors duration-300">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-white/20 bg-white dark:bg-[#2d2d2d] placeholder-gray-500 dark:placeholder-[#9ca3af] text-gray-900 dark:text-white rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-colors duration-300"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-white/20 bg-white dark:bg-[#2d2d2d] placeholder-gray-500 dark:placeholder-[#9ca3af] text-gray-900 dark:text-white rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-colors duration-300"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-white/20 rounded bg-white dark:bg-[#2d2d2d] transition-colors duration-300"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-900 dark:text-white"
            >
              Remember Me
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center">
            <Link href="/" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors hover:underline">
              ← Back to Home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
