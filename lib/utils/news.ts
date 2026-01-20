import { createClient } from '@/lib/supabase/server';
import type { News, NewsInsert, NewsUpdate } from '@/lib/database.types';

export async function getPublishedNews(limit?: number) {
  const supabase = await createClient();
  let query = supabase
    .from('news')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as News[];
}

export interface PaginatedNewsResult {
  data: News[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * Get paginated published news
 * @param page - Page number (1-indexed)
 * @param limit - Number of items per page (default: 10)
 */
export async function getPublishedNewsPaginated(
  page: number = 1,
  limit: number = 10
): Promise<PaginatedNewsResult> {
  const supabase = await createClient();
  // Calculate range: start = (page - 1) * limit, end = start + limit - 1
  const offset = (page - 1) * limit;

  // Get total count
  const { count, error: countError } = await supabase
    .from('news')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published');

  if (countError) throw countError;

  const total = count || 0;
  const totalPages = Math.ceil(total / limit);

  // Get paginated data
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  return {
    data: (data as News[]) || [],
    total,
    page,
    totalPages,
  };
}

export async function getNewsBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) throw error;
  return data as News | null;
}

export async function getNewsByCategory(category: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('category', category)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) throw error;
  return data as News[];
}

export async function getAllNews() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('published_at', { ascending: false, nullsFirst: false });

  if (error) throw error;
  return data as News[];
}

export async function getNewsById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as News | null;
}

export async function createNews(news: NewsInsert) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('news')
    .insert(news)
    .select()
    .single();

  if (error) throw error;
  return data as News;
}

export async function updateNews(id: string, news: NewsUpdate) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('news')
    .update(news)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as News;
}

export async function deleteNews(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('news')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// generateSlug has been moved to @/lib/utils/slug.ts
// to avoid importing server Supabase client in client components

/**
 * Search published news by query string
 * Searches in title, content, and short_description
 * @param query - Search query string
 * @param limit - Maximum number of results (default: 20)
 */
export async function searchPublishedNews(query: string, limit: number = 20) {
  const supabase = await createClient();
  const searchPattern = `%${query}%`;
  
  // Use or() with proper ilike syntax for case-insensitive search
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('status', 'published')
    .or(`title.ilike.${searchPattern},content.ilike.${searchPattern},short_description.ilike.${searchPattern}`)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data as News[]) || [];
}
