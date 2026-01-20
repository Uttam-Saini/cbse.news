'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { News, NewsCategory, NewsStatus } from '@/lib/database.types';
import { generateSlug } from '@/lib/utils/slug';

interface NewsFormProps {
  news?: News;
}

export default function NewsForm({ news }: NewsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(news?.image_url || null);
  const [formData, setFormData] = useState({
    title: news?.title || '',
    slug: news?.slug || '',
    short_description: news?.short_description || '',
    content: news?.content || '',
    source_link: news?.source_link || '',
    category: (news?.category || 'News') as NewsCategory,
    status: (news?.status || 'draft') as NewsStatus,
    image: null as File | null,
  });
  
  // Track if slug was manually edited
  const slugManuallyEdited = useRef(false);
  const previousTitle = useRef(formData.title);

  // Auto-generate slug from title when title changes
  useEffect(() => {
    // Don't auto-generate if:
    // 1. Slug was manually edited
    // 2. Title hasn't changed
    // 3. Title is empty
    if (slugManuallyEdited.current || formData.title === previousTitle.current || !formData.title) {
      previousTitle.current = formData.title;
      return;
    }

    // Auto-generate slug from title
    const autoSlug = generateSlug(formData.title);
    setFormData((prev) => ({ ...prev, slug: autoSlug }));
    previousTitle.current = formData.title;
  }, [formData.title]);

  // Reset manual edit flag when editing existing article (preserve existing slug)
  useEffect(() => {
    if (news?.slug) {
      slugManuallyEdited.current = true;
    }
  }, [news]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate URL if source_link is provided
      if (formData.source_link && formData.source_link.trim()) {
        try {
          new URL(formData.source_link.trim());
        } catch {
          setError('Please enter a valid URL for the source link');
          setLoading(false);
          return;
        }
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('slug', formData.slug);
      formDataToSend.append('short_description', formData.short_description);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('source_link', formData.source_link.trim() || '');
      formDataToSend.append('category', formData.category);
      formDataToSend.append('status', formData.status);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const url = news ? `/api/admin/news/${news.id}` : '/api/admin/news';
      const method = news ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save news');
      }

      router.push('/admin/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1f1f1f] border border-gray-200 dark:border-white/10 rounded-xl shadow-md dark:shadow-none p-6 space-y-6 transition-colors duration-300">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded transition-colors duration-300">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
          Title *
        </label>
        <input
          type="text"
          id="title"
          required
          value={formData.title}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, title: e.target.value }));
          }}
          className="w-full px-3 py-2 border border-gray-300 dark:border-white/20 rounded-md bg-white dark:bg-[#2d2d2d] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-[#9ca3af] focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
        />
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
          Slug *
        </label>
        <input
          type="text"
          id="slug"
          required
          value={formData.slug}
          onChange={(e) => {
            // Mark slug as manually edited when user types in it
            slugManuallyEdited.current = true;
            setFormData((prev) => ({ ...prev, slug: e.target.value }));
          }}
          className="w-full px-3 py-2 border border-gray-300 dark:border-white/20 rounded-md bg-white dark:bg-[#2d2d2d] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-[#9ca3af] focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
        />
        <p className="mt-1 text-sm text-gray-500 dark:text-[#9ca3af]">
          URL-friendly version of the title (auto-generated from title, but editable)
        </p>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
          Category *
        </label>
        <select
          id="category"
          required
          value={formData.category}
          onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value as NewsCategory }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-white/20 rounded-md bg-white dark:bg-[#2d2d2d] text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
        >
          <option value="News">News</option>
          <option value="Notice">Notice</option>
          <option value="Results">Results</option>
        </select>
      </div>

      <div>
        <label htmlFor="short_description" className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
          Short Description *
        </label>
        <textarea
          id="short_description"
          required
          rows={3}
          value={formData.short_description}
          onChange={(e) => setFormData((prev) => ({ ...prev, short_description: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-white/20 rounded-md bg-white dark:bg-[#2d2d2d] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-[#9ca3af] focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
          Content *
        </label>
        <textarea
          id="content"
          required
          rows={10}
          value={formData.content}
          onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-white/20 rounded-md bg-white dark:bg-[#2d2d2d] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-[#9ca3af] focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
        />
      </div>

      <div>
        <label htmlFor="source_link" className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
          Source Link <span className="text-gray-500 dark:text-[#9ca3af] font-normal">(Optional)</span>
        </label>
        <input
          type="url"
          id="source_link"
          value={formData.source_link}
          onChange={(e) => setFormData((prev) => ({ ...prev, source_link: e.target.value }))}
          placeholder="Paste official notice or PDF link here"
          className="w-full px-3 py-2 border border-gray-300 dark:border-white/20 rounded-md bg-white dark:bg-[#2d2d2d] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-[#9ca3af] focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
        />
        <p className="mt-1 text-sm text-gray-500 dark:text-[#9ca3af]">
          Add a link to the official notice, PDF, or source website
        </p>
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
          Featured Image
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-white/20 rounded-md bg-white dark:bg-[#2d2d2d] text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-700 dark:file:text-blue-400 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
        />
        {imagePreview && (
          <div className="mt-4 relative w-full h-64 rounded-lg overflow-hidden bg-gray-100 dark:bg-[#2d2d2d]">
            <Image
              src={imagePreview}
              alt="Preview"
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
          Status *
        </label>
        <select
          id="status"
          required
          value={formData.status}
          onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as NewsStatus }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-white/20 rounded-md bg-white dark:bg-[#2d2d2d] text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
        >
          {loading ? 'Saving...' : news ? 'Update Article' : 'Create Article'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-[#2d2d2d] text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-[#242424] transition-colors duration-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
