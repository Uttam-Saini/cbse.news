'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchQuery.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      }
    }
  };

  return (
    <header className="bg-white dark:bg-slate-950 shadow-sm dark:shadow-none sticky top-0 z-50 transition-colors duration-300 border-b border-gray-200 dark:border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl sm:text-2xl font-bold text-primary-600 dark:text-blue-400 hover:text-primary-700 dark:hover:text-blue-300 transition-colors whitespace-nowrap">
              CBSE.News
            </Link>
          </div>
          
          {/* Search Bar - Desktop Only */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8 ml-10">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 dark:text-slate-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search news, topics, exams..."
                className="w-full h-10 pl-10 pr-4 rounded-full bg-gray-100 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors duration-200"
              />
            </div>
          </form>
          
          {/* Right Side: Navigation and Mobile Menu */}
          <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-blue-300 font-medium transition-colors text-sm hover:underline">
                Home
              </Link>
              <Link href="/category/Notice" className="text-gray-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-blue-300 font-medium transition-colors text-sm hover:underline">
                Notices
              </Link>
              <Link href="/category/Results" className="text-gray-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-blue-300 font-medium transition-colors text-sm hover:underline">
                Results
              </Link>
              <Link href="/admin/login" className="text-gray-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-blue-300 font-medium transition-colors text-sm hover:underline">
                Admin
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-blue-300 transition"
              aria-label="Toggle menu"
            >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-slate-800 pt-4">
            <div className="flex flex-col space-y-3">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-blue-300 transition py-2"
              >
                Home
              </Link>
              <Link
                href="/category/Notice"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-blue-300 transition py-2"
              >
                Notices
              </Link>
              <Link
                href="/category/Results"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-blue-300 transition py-2"
              >
                Results
              </Link>
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-blue-300 transition py-2"
              >
                Admin
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
