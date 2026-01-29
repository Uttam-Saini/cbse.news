import { getNewsByCategory } from '@/lib/utils/news';
import NewsCard from '@/components/NewsCard';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { generateSEOMetadata } from '@/components/SEO';
import type { NewsCategory } from '@/lib/database.types';

/** ISR: revalidate category listing every 5 minutes */
export const revalidate = 300;

interface PageProps {
  params: Promise<{ category: string }>;
}

const validCategories: NewsCategory[] = ['News', 'Notice', 'Results'];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);

  if (!validCategories.includes(decodedCategory as NewsCategory)) {
    return {
      title: 'Category Not Found',
    };
  }

  return generateSEOMetadata({
    title: decodedCategory,
    description: `Latest ${decodedCategory} from CBSE.News`,
    path: `/category/${category}`,
  });
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);

  if (!validCategories.includes(decodedCategory as NewsCategory)) {
    notFound();
  }

  const news = await getNewsByCategory(decodedCategory);

  return (
    <div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white mb-2">{decodedCategory}</h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-slate-300 leading-relaxed">All articles in this category</p>
        </div>

        {news.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-16 text-center shadow-sm dark:shadow-none">
            <p className="text-gray-500 dark:text-slate-300 text-lg">No articles available in this category.</p>
            <p className="text-gray-400 dark:text-slate-400 mt-2">Check back soon for updates!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {news.map((item, index) => (
              <NewsCard key={item.id} news={item} priority={index < 3} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
