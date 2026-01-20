/**
 * Pure utility function for generating URL-friendly slugs.
 * This file has no dependencies on Supabase or Next.js server APIs.
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
