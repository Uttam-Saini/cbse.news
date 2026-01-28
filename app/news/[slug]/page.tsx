import { getNewsBySlug } from '@/lib/utils/news';
import { getPublishedNewsPublic, getNewsBySlugPublic } from '@/lib/utils/news-public';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import Link from 'next/link';
import { generateSEOMetadata } from '@/components/SEO';
import type { Metadata } from 'next';
import { detectArticleLayoutSync } from '@/lib/utils/article-layout';
import NewsLayout from '@/components/article-layouts/NewsLayout';
import NoticeLayout from '@/components/article-layouts/NoticeLayout';
import DocumentLayout from '@/components/article-layouts/DocumentLayout';

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

  // Detect the best layout for this article
  const layout = detectArticleLayoutSync(news);

  // Render the appropriate layout component
  const renderLayout = () => {
    const commonProps = {
      news,
      readingTime,
      getSourceHeading,
      getSourceButtonLabel,
    };

    switch (layout) {
      case 'notice':
        return <NoticeLayout {...commonProps} />;
      case 'document':
        return <DocumentLayout {...commonProps} />;
      case 'news':
      default:
        return <NewsLayout {...commonProps} />;
    }
  };

  return (
    <div className="bg-white min-h-screen transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="max-w-3xl mx-auto mb-4">
          <Link
            href="/"
            className="inline-flex items-center text-xs text-gray-600 hover:text-blue-600 transition-colors"
          >
            <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
        </div>

        {/* Article Container with Smart Layout (no card wrapper) */}
        <article className="max-w-3xl mx-auto">
          {renderLayout()}
        </article>
      </div>
    </div>
  );
}
  