import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CBSE.News - Latest Education News & Updates",
  description: "Stay updated with the latest CBSE news, notices, and educational updates. Your trusted source for CBSE exam results and announcements.",
  keywords: ["CBSE", "education news", "CBSE notices", "exam results", "education updates"],
  authors: [{ name: "CBSE.News" }],
  openGraph: {
    title: "CBSE.News - Latest Education News & Updates",
    description: "Stay updated with the latest CBSE news, notices, and educational updates.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col bg-slate-50 text-gray-900 transition-colors duration-300`}>
        <Header />
        <main className="flex-1 transition-colors duration-300">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
