import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import type { News } from '@/lib/database.types';

interface NewsCardProps {
  news: News;
}

export default function NewsCard({ news }: NewsCardProps) {
  return (
    <Link href={`/news/${news.slug}`}>
      <article className="bg-white dark:bg-[#1f1f1f] rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden hover:bg-gray-50 dark:hover:bg-[#242424] transition-all duration-200 cursor-pointer group">
        {news.image_url && (
          <div className="relative w-full aspect-[3/2] bg-gray-100 dark:bg-[#2d2d2d] overflow-hidden">
            <Image
              src={news.image_url}
              alt={news.title}
              fill
              className="object-cover object-center w-full h-full group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <div className="p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] uppercase tracking-wide font-medium text-primary-600 dark:text-blue-400">{news.category}</span>
            {news.published_at && (
              <time className="text-[10px] text-gray-500 dark:text-[#9ca3af]">
                {format(new Date(news.published_at), 'MMM dd, yyyy')}
              </time>
            )}
          </div>
          <h2 className="text-base font-medium leading-tight text-gray-900 dark:text-white mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition line-clamp-2">
            {news.title}
          </h2>
          <p className="text-sm leading-snug text-gray-600 dark:text-[#d1d5db] line-clamp-2">{news.short_description}</p>
        </div>
      </article>
    </Link>
  );
}
