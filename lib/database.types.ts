export type NewsStatus = 'published' | 'draft';
export type NewsCategory = 'News' | 'Notice' | 'Results';

export interface News {
  id: string;
  title: string;
  slug: string;
  image_url: string | null;
  short_description: string;
  content: string;
  source_link: string | null;
  category: NewsCategory;
  status: NewsStatus;
  published_at: string | null;
  updated_at: string;
}

export interface NewsInsert {
  title: string;
  slug: string;
  image_url?: string | null;
  short_description: string;
  content: string;
  source_link?: string | null;
  category: NewsCategory;
  status: NewsStatus;
  published_at?: string | null;
}

export interface NewsUpdate {
  title?: string;
  slug?: string;
  image_url?: string | null;
  short_description?: string;
  content?: string;
  source_link?: string | null;
  category?: NewsCategory;
  status?: NewsStatus;
  published_at?: string | null;
}
