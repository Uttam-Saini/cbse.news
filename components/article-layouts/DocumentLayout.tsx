import Image from 'next/image';
import { format } from 'date-fns';
import type { News } from '@/lib/database.types';

interface DocumentLayoutProps {
  news: News;
  readingTime: number;
  getSourceHeading: (url: string | null) => string | null;
  getSourceButtonLabel: (url: string | null) => string | null;
}

/**
 * Document Layout - Optimized for PDFs and document previews
 * Emphasizes document download and preview
 */
export default function DocumentLayout({
  news,
  readingTime,
  getSourceHeading,
  getSourceButtonLabel,
}: DocumentLayoutProps) {
  return (
    <>
      {/* Article Header */}
      <header className="mb-6">
        {/* Title */}
        <h1 className="text-lg md:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-3 leading-tight">
          {news.title}
        </h1>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-slate-400">
          {news.published_at && (
            <time className="uppercase tracking-wide">
              {format(new Date(news.published_at), 'MMMM dd, yyyy')}
            </time>
          )}
        </div>
      </header>

      {/* Featured Image - Document preview, tall/portrait optimized */}
      {news.image_url && (
        <div className="relative w-full max-w-md mx-auto aspect-[3/4] mb-8 rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-950 shadow-lg dark:shadow-none border-2 border-gray-200 dark:border-slate-800">
          <Image
            src={news.image_url}
            alt={`${news.title} - Document Preview`}
            fill
            className="object-contain object-center w-full h-full"
            priority
            sizes="(max-width: 768px) 100vw, 448px"
          />
        </div>
      )}

      {/* Official link - directly below featured image */}
      {news.source_link && getSourceHeading(news.source_link) && (
        <div className="mb-8">
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

      {/* Article Content */}
      <div
        className="prose prose-base prose-slate dark:prose-invert max-w-none 
          prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900 dark:prose-headings:text-white
          prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
          prose-p:text-base prose-p:leading-relaxed prose-p:text-gray-700 dark:prose-p:text-slate-300
          prose-p:mb-4
          prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-gray-900 dark:prose-strong:text-white
          prose-ul:my-4 prose-ol:my-4
          prose-li:my-1 prose-li:text-gray-700 dark:prose-li:text-slate-300
          prose-blockquote:border-l-4 prose-blockquote:border-blue-500 dark:prose-blockquote:border-blue-400 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700 dark:prose-blockquote:text-slate-300
          prose-img:rounded-lg prose-img:shadow-sm dark:prose-img:opacity-90"
        dangerouslySetInnerHTML={{ __html: news.content.replace(/\n/g, '<br />') }}
      />
    </>
  );
}
