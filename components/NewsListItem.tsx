import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import type { News } from '@/lib/database.types';

interface NewsListItemProps {
  news: News;
  priority?: boolean;
}

// Minimal category label (editorial style)
function getCategoryStyles(category: string) {
  switch (category) {
    case 'News':
      return 'text-blue-600 dark:text-blue-400';
    case 'Notice':
      return 'text-orange-600 dark:text-orange-400';
    case 'Results':
      return 'text-green-600 dark:text-green-400';
    default:
      return 'text-gray-600 dark:text-slate-400';
  }
}

export default function NewsListItem({ news, priority = false }: NewsListItemProps) {
  const categoryStyles = getCategoryStyles(news.category);

  return (
    <Link
      href={`/news/${news.slug}`}
      className="block border-b border-gray-200 dark:border-slate-700 py-3 sm:py-4 last:border-b-0 transition-colors hover:opacity-90 group"
    >
      <div className="flex flex-row items-center gap-4 sm:gap-5 min-w-0">
        {/* Left: Square thumbnail - 1:1, fixed size */}
        <div className="flex-shrink-0 relative w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] bg-gray-100 dark:bg-slate-800 overflow-hidden rounded-sm">
          {news.image_url ? (
            <Image
              src={news.image_url}
              alt={news.title}
              fill
              className="object-cover object-center w-full h-full group-hover:opacity-95 transition-opacity"
              sizes="(max-width: 640px) 80px, 100px"
              priority={priority}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-slate-600" aria-hidden>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
              </svg>
            </div>
          )}
        </div>

        {/* Right: Category, title, excerpt, date */}
        <div className="flex-1 min-w-0 flex flex-col justify-center py-0.5">
          <span className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wider ${categoryStyles} mb-0.5`}>
            {news.category}
          </span>
          <h2 className="text-sm sm:text-base font-medium leading-snug text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-0.5">
            {news.title}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 leading-snug line-clamp-2 mb-0.5">
            {news.short_description}
          </p>
          {news.published_at && (
            <time className="text-[10px] sm:text-xs text-gray-500 dark:text-slate-500">
              {format(new Date(news.published_at), 'MMM dd, yyyy')}
            </time>
          )}
        </div>
      </div>
    </Link>
  );
}
