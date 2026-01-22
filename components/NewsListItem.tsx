import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import type { News } from '@/lib/database.types';

interface NewsListItemProps {
  news: News;
}

// Category color mapping
function getCategoryStyles(category: string) {
  switch (category) {
    case 'News':
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
    case 'Notice':
      return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400';
    case 'Results':
      return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
    default:
      return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400';
  }
}

export default function NewsListItem({ news }: NewsListItemProps) {
  const categoryStyles = getCategoryStyles(news.category);

  return (
    <Link href={`/news/${news.slug}`}>
      <article className="bg-white dark:bg-[#1f1f1f] rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden hover:bg-gray-50 dark:hover:bg-[#242424] transition-all duration-200 cursor-pointer group">
        <div className="flex flex-col sm:flex-row gap-3 p-3">
          {/* Left side: Featured image */}
          {news.image_url && (
            <div className="flex-shrink-0 sm:w-40">
              <div className="relative w-full aspect-[4/3] sm:aspect-[4/3] bg-gray-100 dark:bg-[#2d2d2d] rounded-lg overflow-hidden">
                <Image
                  src={news.image_url}
                  alt={news.title}
                  fill
                  className="object-cover object-center w-full h-full group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, 160px"
                />
              </div>
            </div>
          )}

          {/* Right side: Content */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Category Badge */}
            <div className="mb-1.5">
              <span className={`inline-block text-[10px] font-medium uppercase tracking-wide px-2 py-0.5 rounded-full ${categoryStyles}`}>
                {news.category}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-base font-medium leading-tight text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-1.5">
              {news.title}
            </h2>

            {/* Short description */}
            <p className="text-sm leading-snug text-gray-600 dark:text-[#d1d5db] mb-2 line-clamp-2 flex-1">
              {news.short_description}
            </p>

            {/* Meta info */}
            <div className="flex items-center gap-3 text-[10px] text-gray-500 dark:text-[#9ca3af]">
              {news.published_at && (
                <time>
                  {format(new Date(news.published_at), 'MMM dd, yyyy')}
                </time>
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
