import { searchPublishedNews } from '@/lib/utils/news';
import NewsCard from '@/components/NewsCard';
import { Metadata } from 'next';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q || '';

  if (query) {
    return {
      title: `Search Results for "${query}" - CBSE.News`,
      description: `Search results for "${query}" on CBSE.News`,
    };
  }

  return {
    title: 'Search - CBSE.News',
    description: 'Search for CBSE news, notices, and educational updates',
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || '';

  let results: any[] = [];
  let hasSearched = false;

  if (query.trim()) {
    hasSearched = true;
    try {
      results = await searchPublishedNews(query.trim(), 20);
    } catch (error) {
      console.error('Search error:', error);
      results = [];
    }
  }

  return (
    <div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10">
          {hasSearched ? (
            <>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white mb-2">
                Search Results for: <span className="text-blue-600 dark:text-blue-400">&quot;{query}&quot;</span>
              </h1>
              <p className="text-sm md:text-base text-gray-600 dark:text-slate-300 leading-relaxed">
                Found {results.length} {results.length === 1 ? 'result' : 'results'}
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white mb-2">
                Search
              </h1>
              <p className="text-sm md:text-base text-gray-600 dark:text-slate-300 leading-relaxed">
                Enter a search query to find news articles
              </p>
            </>
          )}
        </div>

        {!hasSearched ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-16 text-center shadow-sm dark:shadow-none">
            <p className="text-gray-500 dark:text-slate-300 text-lg">Please enter a search query in the search bar above.</p>
          </div>
        ) : results.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-16 text-center shadow-sm dark:shadow-none">
            <p className="text-gray-500 dark:text-slate-300 text-lg">No results found for &quot;{query}&quot;.</p>
            <p className="text-gray-400 dark:text-slate-400 mt-2">Try different keywords or check your spelling.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {results.map((item, index) => (
              <NewsCard key={item.id} news={item} priority={index < 3} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
