import { getNewsBySlug } from '@/lib/utils/news';
import { getPublishedNewsPublic, getNewsBySlugPublic } from '@/lib/utils/news-public';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import Link from 'next/link';
import { generateSEOMetadata } from '@/components/SEO';
import type { Metadata } from 'next';

/**
 * Generate dynamic heading based on source URL
 */
function getSourceHeading(url: string | null): string | null {
  if (!url) return null;

  const lower = url.toLowerCase();

  if (lower.endsWith('.pdf')) return 'OFFICIAL NOTICE PDF';
  if (lower.includes('cbse.gov.in')) return 'OFFICIAL CBSE NOTICE';
  if (lower.includes('nta.ac.in')) return 'OFFICIAL NTA NOTICE';
  if (lower.includes('nic.in')) return 'GOVERNMENT CIRCULAR';

  return 'OFFICIAL WEBSITE';
}

/**
 * Generate dynamic button label based on source URL
 */
function getSourceButtonLabel(url: string | null): string | null {
  if (!url) return null;

  const lower = url.toLowerCase();

  if (lower.endsWith('.pdf')) return 'Download Official PDF';
  if (lower.includes('cbse.gov.in') || lower.includes('nta.ac.in') || lower.includes('nic.in')) {
    return 'View Official Circular';
  }

  return 'Visit Official Website';
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Generate static params at build time using public client (no cookies).
 * This pre-generates pages for all published news articles.
 * New articles will be generated on-demand or during next build.
 */
export async function generateStaticParams() {
  const news = await getPublishedNewsPublic();
  return news.map((item) => ({
    slug: item.slug,
  }));
}

// Use public client for metadata generation (can run at build-time)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNewsBySlugPublic(slug);

  if (!news) {
    return {
      title: 'News Not Found',
    };
  }

  return generateSEOMetadata({
    title: news.title,
    description: news.short_description,
    image: news.image_url || undefined,
    path: `/news/${slug}`,
  });
}

// Use regular client for page rendering (request-time)
export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  if (!news) {
    notFound();
  }

  // Calculate reading time (approximate: 200 words per minute)
  const wordCount = news.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <div className="max-w-3xl mx-auto mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 dark:text-[#9ca3af] hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>

        {/* Article Container */}
        <article className="max-w-3xl mx-auto">
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
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-[#9ca3af]">
              {news.published_at && (
                <time className="uppercase tracking-wide">
                  {format(new Date(news.published_at), 'MMMM dd, yyyy')}
                </time>
              )}
              <span className="text-gray-300 dark:text-[#6b7280]">•</span>
              <span>{readingTime} min read</span>
            </div>
          </header>

          {/* Featured Image */}
          {news.image_url && (
            <div className="relative w-full aspect-video mb-12 rounded-2xl overflow-hidden bg-gray-100 dark:bg-[#2d2d2d] shadow-lg dark:shadow-none">
              <Image
                src={news.image_url}
                alt={news.title}
                fill
                className="object-cover"
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
              prose-p:text-base md:prose-p:text-lg prose-p:leading-relaxed prose-p:text-gray-700 dark:prose-p:text-[#d1d5db]
              prose-p:mb-6
              prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900 dark:prose-strong:text-white
              prose-ul:my-6 prose-ol:my-6
              prose-li:my-2
              prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic
              prose-img:rounded-xl prose-img:shadow-md"
            dangerouslySetInnerHTML={{ __html: news.content.replace(/\n/g, '<br />') }}
          />

          {/* Source Link */}
          {news.source_link && getSourceHeading(news.source_link) && (
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-white/10">
              <p className="text-xs font-semibold text-gray-500 dark:text-[#9ca3af] uppercase tracking-wide mb-3">
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

          {/* Footer Navigation */}
          <div className="mt-16 pt-8 border-t border-gray-200 dark:border-white/10">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-gray-600 dark:text-[#9ca3af] hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
