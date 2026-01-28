import { getPublishedNewsPaginated } from '@/lib/utils/news';
import NewsListItem from '@/components/NewsListItem';
import Pagination from '@/components/Pagination';
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Hero Section with Title and Weather Card */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          {/* Heading and Weather Card Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
            
            {/* Compact Weather Card */}
            {/* <div className="flex-shrink-0">
              <WeatherCard compact />
            </div> */}
          </div>
          {/* Subheading */}
          {/* <p className="text-sm md:text-base text-gray-600 dark:text-slate-300 leading-relaxed">
            Official CBSE updates, exam notifications, results, admissions and student guidance — updated daily.
          </p> */}
        </div>

        {result.data.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm dark:shadow-none border border-gray-200 dark:border-slate-800 p-16 text-center transition-colors duration-300">
            <p className="text-gray-500 dark:text-slate-300 text-lg">No news articles available at the moment.</p>
            <p className="text-gray-400 dark:text-slate-400 mt-2">Check back soon for updates!</p>
          </div>
        ) : (
          <>
            {/* News Cards List */}
            <div className="space-y-2.5">
              {result.data.map((item, index) => (
                <NewsListItem key={item.id} news={item} priority={index < 3} />
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
