import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - CBSE.News',
  description: 'Privacy Policy for CBSE.News - Learn how we collect, use, and protect your information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-8">
            Privacy Policy for CBSE.News
          </h1>
          
          <div className="prose prose-lg prose-slate dark:prose-invert max-w-none
            prose-p:text-gray-700 dark:prose-p:text-slate-300
            prose-strong:text-gray-900 dark:prose-strong:text-white
            prose-li:text-gray-700 dark:prose-li:text-slate-300">
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-8">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Information We Collect
              </h2>
              <p className="text-base leading-relaxed text-gray-700 dark:text-slate-300 mb-4">
                CBSE.News may collect information that you provide directly to us, including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base leading-relaxed text-gray-700 dark:text-slate-300 ml-4">
                <li>Personal information such as name and email address when you contact us</li>
                <li>Usage data and analytics information when you visit our website</li>
                <li>Device information, browser type, and IP address</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                How We Use Information
              </h2>
              <p className="text-base leading-relaxed text-gray-700 dark:text-slate-300 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base leading-relaxed text-gray-700 dark:text-slate-300 ml-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Send you updates and newsletters (if you subscribe)</li>
                <li>Analyze website usage and trends to enhance user experience</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Cookies and Web Beacons
              </h2>
              <p className="text-base leading-relaxed text-gray-700 dark:text-slate-300 mb-4">
                CBSE.News uses cookies to enhance your browsing experience. Cookies are small text files stored on your device that help us:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base leading-relaxed text-gray-700 dark:text-slate-300 ml-4">
                <li>Remember your preferences and settings</li>
                <li>Analyze website traffic and usage patterns</li>
                <li>Provide personalized content and advertisements</li>
              </ul>
              <p className="text-base leading-relaxed text-gray-700 dark:text-slate-300 mt-4">
                You can control cookie preferences through your browser settings. However, disabling cookies may affect the functionality of our website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Google AdSense & DoubleClick Cookie
              </h2>
              <p className="text-base leading-relaxed text-gray-700 dark:text-slate-300 mb-4">
                As a third party vendor, Google uses cookies to serve ads on CBSE.News. Google's use of the DoubleClick cookie enables it and its partners to serve ads to our users based on their visit to our site and/or other sites on the Internet.
              </p>
              <p className="text-base leading-relaxed text-gray-700 dark:text-slate-300 mb-4">
                You may opt out of the use of the DoubleClick cookie for interest-based advertising by visiting the{' '}
                <a 
                  href="https://www.google.com/ads/preferences/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Google Ads Settings page
                </a>
                .
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Third Party Privacy Policies
              </h2>
              <p className="text-base leading-relaxed text-gray-700 dark:text-slate-300 mb-4">
                CBSE.News's Privacy Policy does not apply to other advertisers or websites. We advise you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
              </p>
              <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers' respective websites.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Consent
              </h2>
              <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                By using our website, you hereby consent to our Privacy Policy and agree to its terms. If you do not agree with our policies and practices, please do not use our website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Updates
              </h2>
              <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-slate-800">
              <p className="text-base leading-relaxed text-gray-700 dark:text-slate-300 mb-2">
                <strong className="text-gray-900 dark:text-white">Owner:</strong> This website is owned and operated by CBSE.News
              </p>
              <p className="text-base leading-relaxed text-gray-700 dark:text-slate-300">
                <strong className="text-gray-900 dark:text-white">Developed by:</strong> Uttam Saini for Nodia Learning Private Limited.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
