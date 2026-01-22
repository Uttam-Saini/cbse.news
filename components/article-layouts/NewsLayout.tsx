import Image from 'next/image';
import { format } from 'date-fns';
import Link from 'next/link';
import type { News } from '@/lib/database.types';

interface NewsLayoutProps {
  news: News;
  readingTime: number;
  getSourceHeading: (url: string | null) => string | null;
  getSourceButtonLabel: (url: string | null) => string | null;
}

/**
 * News Layout - Standard article layout for news articles
 * Optimized for landscape images and news-style content
 */
export default function NewsLayout({
  news,
  readingTime,
  getSourceHeading,
  getSourceButtonLabel,
}: NewsLayoutProps) {
  return (
    <>
      {/* Article Header */}
      <header className="mb-10">
        {/* Category Badge */}
        <div className="mb-6">
          <span className="inline-block px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-blue-400 rounded-full text-xs uppercase tracking-wide font-semibold">
            {news.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 leading-tight">
          {news.title}
        </h1>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-slate-400">
          {news.published_at && (
            <time className="uppercase tracking-wide">
              {format(new Date(news.published_at), 'MMMM dd, yyyy')}
            </time>
          )}
          <span className="text-gray-300 dark:text-slate-500">•</span>
          <span>{readingTime} min read</span>
        </div>
      </header>

      {/* Featured Image - Landscape optimized */}
      {news.image_url && (
        <div className="relative w-full aspect-video mb-12 rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-950 shadow-lg dark:shadow-none">
          <Image
            src={news.image_url}
            alt={news.title}
            fill
            className="object-cover object-center w-full h-full"
            priority
            sizes="(max-width: 768px) 100vw, 896px"
          />
        </div>
      )}

      {/* Article Content */}
      <div
        className="prose prose-lg prose-slate dark:prose-invert max-w-none 
          prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900 dark:prose-headings:text-white
          prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
          prose-p:text-base md:prose-p:text-lg prose-p:leading-relaxed prose-p:text-gray-700 dark:prose-p:text-slate-300
          prose-p:mb-6
          prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-gray-900 dark:prose-strong:text-white
          prose-ul:my-6 prose-ol:my-6
          prose-li:my-2 prose-li:text-gray-700 dark:prose-li:text-slate-300
          prose-blockquote:border-l-4 prose-blockquote:border-blue-500 dark:prose-blockquote:border-blue-400 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700 dark:prose-blockquote:text-slate-300
          prose-img:rounded-xl prose-img:shadow-md dark:prose-img:opacity-90"
        dangerouslySetInnerHTML={{ __html: news.content.replace(/\n/g, '<br />') }}
      />

      {/* Source Link */}
      {news.source_link && getSourceHeading(news.source_link) && (
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-slate-800">
          <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-3">
            {getSourceHeading(news.source_link)}
          </p>
          <a
            href={news.source_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-blue-600 text-white px-6 py-3.5 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm shadow-sm hover:shadow-md"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            {getSourceButtonLabel(news.source_link)}
          </a>
        </div>
      )}
    </>
  );
}
