import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About - CBSE.News',
  description: 'Learn about CBSE.News - an independent education news platform providing educational updates, exam news, and results.',
};

export default function AboutPage() {
  return (
    <div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-8">
            About CBSE.News
          </h1>
          
          <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
            <p className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-[#d1d5db] mb-6">
              CBSE.News is an independent education news platform providing educational updates, exam news, results, and important announcements for students, teachers, and parents.
            </p>
            
            <p className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-[#d1d5db] mb-6">
              Our mission is to make education-related information easily accessible, accurate, and timely for everyone in the academic community.
            </p>
            
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-white/10">
              <p className="text-base leading-relaxed text-gray-700 dark:text-[#d1d5db]">
                This platform is built and maintained by <strong className="text-gray-900 dark:text-white">Uttam Saini</strong>, MERN Developer at Nodia Learning Private Limited.
              </p>
              <p className="text-base leading-relaxed text-gray-700 dark:text-[#d1d5db] mt-4">
                The website is developed for <strong className="text-gray-900 dark:text-white">Nodia Learning Private Limited</strong>, with full credit given to Uttam Saini for design and development.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
