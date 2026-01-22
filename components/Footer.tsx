import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-800 dark:bg-slate-950 text-white dark:text-slate-400 mt-16 transition-colors duration-300 border-t border-gray-700 dark:border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center">
          <p className="text-xl font-bold mb-2">
            <span className="text-white">CBSE.</span>
            <span className="text-blue-400">News</span>
          </p>
          <p className="text-gray-300 dark:text-slate-400 text-sm mb-4">
            Your daily source for CBSE announcements, board exam updates, results and education news.
          </p>
          <nav className="mb-4">
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-gray-300 dark:text-slate-400">
              <Link href="/" className="hover:text-blue-400 dark:hover:text-blue-400 transition-colors">
                Home
              </Link>
              <span className="text-gray-500 dark:text-slate-500">•</span>
              <Link href="/category/Notice" className="hover:text-blue-400 dark:hover:text-blue-400 transition-colors">
                Notices
              </Link>
              <span className="text-gray-500 dark:text-slate-500">•</span>
              <Link href="/category/Results" className="hover:text-blue-400 dark:hover:text-blue-400 transition-colors">
                Results
              </Link>
              <span className="text-gray-500 dark:text-slate-500">•</span>
              <Link href="/about" className="hover:text-blue-400 dark:hover:text-blue-400 transition-colors">
                About
              </Link>
              <span className="text-gray-500 dark:text-slate-500">•</span>
              <Link href="/contact" className="hover:text-blue-400 dark:hover:text-blue-400 transition-colors">
                Contact
              </Link>
              <span className="text-gray-500 dark:text-slate-500">•</span>
              <Link href="/privacy-policy" className="hover:text-blue-400 dark:hover:text-blue-400 transition-colors">
                Privacy Policy
              </Link>
            </div>
          </nav>
          <p className="text-gray-400 dark:text-slate-400 text-xs">
            © 2026 CBSE.News — All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
