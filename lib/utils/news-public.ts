import { createPublicClient } from '@/lib/supabase/server';
import type { News } from '@/lib/database.types';

/**
 * Public news utility functions that use the public client.
 * These can be safely used in generateStaticParams() and other build-time functions.
 */

export async function getPublishedNewsPublic(limit?: number) {
  const supabase = createPublicClient();
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

export async function getNewsBySlugPublic(slug: string) {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) throw error;
  return data as News | null;
}

export async function getNewsByCategoryPublic(category: string) {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('category', category)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) throw error;
  return data as News[];
}
