import { Metadata } from 'next';

export function generateSEOMetadata({
  title,
  description,
  image,
  path,
}: {
  title: string;
  description: string;
  image?: string;
  path?: string;
}): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cbse.news';
  const url = path ? `${baseUrl}${path}` : baseUrl;
  const ogImage = image || `${baseUrl}/og-image.jpg`;

  return {
    title: `${title} | CBSE.News`,
    description,
    openGraph: {
      title: `${title} | CBSE.News`,
      description,
      url,
      siteName: 'CBSE.News',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | CBSE.News`,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
    },
  };
}
