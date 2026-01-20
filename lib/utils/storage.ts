import type { SupabaseClient } from '@supabase/supabase-js';

export async function uploadImage(
  supabase: SupabaseClient,
  file: File,
  fileName: string
): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const filePath = `${fileName}-${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('news-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('news-images')
    .getPublicUrl(data.path);

  return publicUrl;
}

export async function deleteImage(supabase: SupabaseClient, imageUrl: string) {
  const urlParts = imageUrl.split('/');
  const filePath = urlParts[urlParts.length - 1];

  const { error } = await supabase.storage
    .from('news-images')
    .remove([filePath]);

  if (error) throw error;
}
