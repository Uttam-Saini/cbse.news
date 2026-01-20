import { getPublishedNewsPaginated } from '@/lib/utils/news';
import NewsListItem from '@/components/NewsListItem';
import Pagination from '@/components/Pagination';
import WeatherCard from '@/components/WeatherCard';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;

  if (page > 1) {
    return {
      title: `Home - Page ${page}`,
      description: 'Latest CBSE news, notices, and educational updates',
    };
  }

  return {
    title: 'Home',
    description: 'Latest CBSE news, notices, and educational updates',
  };
}

interface HomePageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;

  // Validate page number
  if (isNaN(page) || page < 1) {
    redirect('/');
  }

  const ITEMS_PER_PAGE = 10;
  const result = await getPublishedNewsPaginated(page, ITEMS_PER_PAGE);

  // Redirect if page exceeds total pages
  if (page > result.totalPages && result.totalPages > 0) {
    redirect(`/?page=${result.totalPages}`);
  }

  return (
    <div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section with Title and Weather Card */}
        <div className="mb-10">
          {/* Heading and Weather Card Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
              Education News Hub
            </h1>
            {/* Compact Weather Card */}
            <div className="flex-shrink-0">
              <WeatherCard compact />
            </div>
          </div>
          {/* Subheading */}
          <p className="text-sm md:text-base text-gray-600 dark:text-[#d1d5db] leading-relaxed">
            Official CBSE updates, exam notifications, results, admissions and student guidance — updated daily.
          </p>
        </div>

        {result.data.length === 0 ? (
          <div className="bg-white dark:bg-[#1f1f1f] rounded-xl shadow-sm dark:shadow-none border border-gray-200 dark:border-white/10 p-16 text-center transition-colors duration-300">
            <p className="text-gray-500 dark:text-[#d1d5db] text-lg">No news articles available at the moment.</p>
            <p className="text-gray-400 dark:text-[#9ca3af] mt-2">Check back soon for updates!</p>
          </div>
        ) : (
          <>
            {/* News Cards List */}
            <div className="space-y-4">
              {result.data.map((item) => (
                <NewsListItem key={item.id} news={item} />
              ))}
            </div>

            <div className="mt-10">
              <Pagination
                currentPage={result.page}
                totalPages={result.totalPages}
                basePath="/"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
