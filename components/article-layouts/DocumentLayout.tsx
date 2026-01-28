import Image from 'next/image';
import { format } from 'date-fns';
import Link from 'next/link';
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

      {/* Document Preview Section */}
      <div className="mb-8">
        {/* Source Link - Primary CTA for documents */}
        {news.source_link && getSourceHeading(news.source_link) && (
          <div className="mb-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-900 border border-blue-200 dark:border-slate-800 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg
                  className="w-8 h-8 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide mb-2">
                  {getSourceHeading(news.source_link)}
                </p>
                <a
                  href={news.source_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm shadow-md hover:shadow-lg"
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
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  {getSourceButtonLabel(news.source_link)}
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Document Preview Image - Tall/portrait optimized */}
        {news.image_url && (
          <div className="relative w-full max-w-md mx-auto aspect-[3/4] mb-6 rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-950 shadow-lg dark:shadow-none border-2 border-gray-200 dark:border-slate-800">
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
      </div>

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
