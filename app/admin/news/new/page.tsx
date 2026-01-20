import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import NewsForm from '@/components/admin/NewsForm';

export default async function NewNewsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#202124] transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Create New Article</h1>
        <NewsForm />
      </div>
    </div>
  );
}
