import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getNewsById, updateNews, deleteNews } from '@/lib/utils/news';
import { uploadImage, deleteImage } from '@/lib/utils/storage';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existingNews = await getNewsById(id);
    if (!existingNews) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
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

    let imageUrl: string | null = existingNews.image_url;

    if (image && image.size > 0) {
      // Delete old image if exists
      if (existingNews.image_url) {
        try {
          await deleteImage(supabase, existingNews.image_url);
        } catch (error) {
          // Continue even if deletion fails
        }
      }
      imageUrl = await uploadImage(supabase, image, slug);
    }

    const publishedAt = status === 'published' && !existingNews.published_at
      ? new Date().toISOString()
      : existingNews.published_at;

    const news = await updateNews(id, {
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

    return NextResponse.json(news);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update news' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existingNews = await getNewsById(id);
    if (!existingNews) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }

    // Delete image if exists
    if (existingNews.image_url) {
      try {
        await deleteImage(supabase, existingNews.image_url);
      } catch (error) {
        // Continue even if deletion fails
      }
    }

    await deleteNews(id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete news' },
      { status: 500 }
    );
  }
}
