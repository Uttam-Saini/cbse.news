import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getAllNews } from '@/lib/utils/news';
import NewsList from '@/components/admin/NewsList';
import LogoutButton from '@/components/admin/LogoutButton';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  const news = await getAllNews();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#202124] transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-[#d1d5db] mt-1">Manage your news articles</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/admin/news/new"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              + New Article
            </Link>
            <LogoutButton />
          </div>
        </div>

        <NewsList news={news} />
      </div>
    </div>
  );
}
