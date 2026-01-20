import Link from 'next/link';
import { format } from 'date-fns';
import type { News } from '@/lib/database.types';
import DeleteButton from './DeleteButton';

interface NewsListProps {
  news: News[];
}

export default function NewsList({ news }: NewsListProps) {
  return (
    <div className="bg-white dark:bg-[#1f1f1f] rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden transition-colors duration-300">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
        <thead className="bg-gray-50 dark:bg-[#242424]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-[#9ca3af] uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-[#9ca3af] uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-[#9ca3af] uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-[#9ca3af] uppercase tracking-wider">
              Published
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-[#9ca3af] uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-[#1f1f1f] divide-y divide-gray-200 dark:divide-white/10">
          {news.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-[#d1d5db]">
                No news articles yet. Create your first article!
              </td>
            </tr>
          ) : (
            news.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-[#242424] transition-colors duration-200 cursor-pointer">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</div>
                  <div className="text-sm text-gray-500 dark:text-[#9ca3af]">{item.slug}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.status === 'published'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-[#9ca3af]">
                  {item.published_at
                    ? format(new Date(item.published_at), 'MMM dd, yyyy')
                    : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/news/${item.id}/edit`}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors hover:underline"
                    >
                      Edit
                    </Link>
                    <DeleteButton id={item.id} title={item.title} />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
