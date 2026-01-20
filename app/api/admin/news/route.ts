import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createNews } from '@/lib/utils/news';
import { uploadImage } from '@/lib/utils/storage';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const short_description = formData.get('short_description') as string;
    const content = formData.get('content') as string;
    const source_link = formData.get('source_link') as string;
    const category = formData.get('category') as string;
    const status = formData.get('status') as string;
    const image = formData.get('image') as File | null;

    let imageUrl: string | null = null;

    if (image && image.size > 0) {
      imageUrl = await uploadImage(supabase, image, slug);
    }

    const publishedAt = status === 'published' ? new Date().toISOString() : null;

    const news = await createNews({
      title,
      slug,
      image_url: imageUrl,
      short_description,
      content,
      source_link: source_link?.trim() || null,
      category: category as any,
      status: status as any,
      published_at: publishedAt,
    });

    return NextResponse.json(news, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create news' },
      { status: 500 }
    );
  }
}
