import type { News } from '@/lib/database.types';

export type ArticleLayout = 'news' | 'notice' | 'document';

/**
 * Detects if an image is likely landscape based on URL patterns or dimensions
 * For now, uses heuristics. Can be enhanced with actual image dimension checking.
 */
async function isImageLandscape(imageUrl: string | null): Promise<boolean> {
  if (!imageUrl) return false;

  // Heuristic: If image URL contains dimension hints, use them
  // Common patterns: _w800_h600, _800x600, etc.
  const dimensionMatch = imageUrl.match(/(\d+)x(\d+)|_w(\d+)_h(\d+)/i);
  if (dimensionMatch) {
    const width = parseInt(dimensionMatch[1] || dimensionMatch[3] || '0');
    const height = parseInt(dimensionMatch[2] || dimensionMatch[4] || '0');
    if (width > 0 && height > 0) {
      return width > height; // Landscape if width > height
    }
  }

  // Default: Assume landscape for most news images
  // This can be enhanced with actual image loading if needed
  return true;
}

/**
 * Detects if an image is likely a tall screenshot (portrait/document style)
 */
async function isTallScreenshot(imageUrl: string | null): Promise<boolean> {
  if (!imageUrl) return false;

  // Heuristic: Check for screenshot indicators in URL
  const screenshotKeywords = ['screenshot', 'screen', 'mobile', 'portrait', 'vertical'];
  const lowerUrl = imageUrl.toLowerCase();
  
  if (screenshotKeywords.some(keyword => lowerUrl.includes(keyword))) {
    return true;
  }

  // Check dimensions if available
  const dimensionMatch = imageUrl.match(/(\d+)x(\d+)|_w(\d+)_h(\d+)/i);
  if (dimensionMatch) {
    const width = parseInt(dimensionMatch[1] || dimensionMatch[3] || '0');
    const height = parseInt(dimensionMatch[2] || dimensionMatch[4] || '0');
    if (width > 0 && height > 0) {
      // Tall if height is significantly greater than width (aspect ratio > 1.3)
      return height / width > 1.3;
    }
  }

  return false;
}

/**
 * Smart Article Layout Detection
 * 
 * Automatically determines the best layout based on:
 * - Category (NEWS / NOTICE / RESULT)
 * - Image type (photo, screenshot, PDF preview)
 * - Source link type (PDF, govt site, portal)
 * - Title keywords
 * 
 * @param article - The news article object
 * @returns The detected layout type: 'news', 'notice', or 'document'
 */
export async function detectArticleLayout(article: News): Promise<ArticleLayout> {
  const { category, title, source_link, image_url } = article;

  const lowerTitle = title.toLowerCase();
  const lowerSourceLink = source_link?.toLowerCase() || '';

  // Detection Rule 1: Document Layout
  // - Source link ends with .pdf
  // - OR image is a tall screenshot
  if (lowerSourceLink.endsWith('.pdf')) {
    return 'document';
  }

  const isTall = await isTallScreenshot(image_url);
  if (isTall) {
    return 'document';
  }

  // Detection Rule 2: Notice Layout
  // - Category is "Notice"
  // - OR title contains "circular", "notification", "notice"
  if (category === 'Notice') {
    return 'notice';
  }

  const noticeKeywords = ['circular', 'notification', 'notice', 'announcement', 'advisory'];
  if (noticeKeywords.some(keyword => lowerTitle.includes(keyword))) {
    return 'notice';
  }

  // Detection Rule 3: News Layout (default)
  // - Category is "News" AND image is landscape
  // - OR category is "Results" (treat as news-style)
  if (category === 'News') {
    const isLandscape = await isImageLandscape(image_url);
    if (isLandscape) {
      return 'news';
    }
  }

  if (category === 'Results') {
    return 'news'; // Results use news layout
  }

  // Default fallback: news layout
  return 'news';
}

/**
 * Synchronous version for cases where async is not needed
 * Uses simpler heuristics without image dimension checking
 */
export function detectArticleLayoutSync(article: News): ArticleLayout {
  const { category, title, source_link, image_url } = article;

  const lowerTitle = title.toLowerCase();
  const lowerSourceLink = source_link?.toLowerCase() || '';

  // Document: PDF source link
  if (lowerSourceLink.endsWith('.pdf')) {
    return 'document';
  }

  // Document: Tall screenshot indicators in URL
  if (image_url) {
    const lowerImageUrl = image_url.toLowerCase();
    const screenshotKeywords = ['screenshot', 'screen', 'mobile', 'portrait', 'vertical'];
    if (screenshotKeywords.some(keyword => lowerImageUrl.includes(keyword))) {
      return 'document';
    }
  }

  // Notice: Category or title keywords
  if (category === 'Notice') {
    return 'notice';
  }

  const noticeKeywords = ['circular', 'notification', 'notice', 'announcement', 'advisory'];
  if (noticeKeywords.some(keyword => lowerTitle.includes(keyword))) {
    return 'notice';
  }

  // News: Default for News and Results categories
  return 'news';
}
