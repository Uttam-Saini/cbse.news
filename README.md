# CBSE.News - Educational News Portal

A modern, SEO-friendly educational news website built with Next.js and Supabase.

## Features

### Public Website
- **Homepage**: Latest education news in a clean, responsive layout
- **News Detail Pages**: SEO-friendly slug URLs with full article content
- **Category Pages**: Filter news by category (Education News, CBSE Notices, Results)
- **Fully Responsive**: Works seamlessly on all devices
- **SEO Optimized**: Meta tags, Open Graph, and Twitter cards

### Admin System
- **Secure Authentication**: Email/password login via Supabase Auth
- **Admin Dashboard**: Manage all news articles
- **CRUD Operations**: Create, edit, and delete news articles
- **Image Upload**: Upload featured images to Supabase Storage
- **Publish/Unpublish**: Control article visibility with draft/published status

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (Database, Auth, Storage)
- **Cloudflare Pages** (Deployment ready)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd cbse.news
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**

   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Go to SQL Editor and run the SQL from `supabase/schema.sql`
   - Go to Storage and create a bucket named `news-images` with public access
   - Get your project URL and anon key from Settings > API

4. **Configure environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Setup

Run the SQL script in `supabase/schema.sql` in your Supabase SQL Editor. This will:
- Create the `news` table with all required fields
- Set up indexes for performance
- Configure Row Level Security (RLS) policies
- Create triggers for automatic timestamp updates

## Storage Setup

1. Go to Storage in your Supabase dashboard
2. Create a new bucket named `news-images`
3. Set the bucket to **Public**
4. Configure CORS if needed for your domain

## Admin Access

1. Go to Authentication in your Supabase dashboard
2. Create a new user with email and password
3. Use these credentials to log in at `/admin/login`

## Deployment to Cloudflare Pages

1. **Push your code to GitHub**

2. **Connect to Cloudflare Pages**
   - Go to Cloudflare Dashboard > Pages
   - Click "Create a project"
   - Connect your GitHub repository

3. **Configure build settings**
   - Build command: `npm run build`
   - Build output directory: `.next`
   - Node version: `18`

4. **Add environment variables**
   Add all your environment variables from `.env.local` in the Cloudflare Pages settings

5. **Deploy**
   Cloudflare Pages will automatically build and deploy your site

## Project Structure

```
cbse.news/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin pages (login, dashboard)
│   ├── api/               # API routes
│   ├── category/          # Category pages
│   ├── news/              # News detail pages
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── admin/            # Admin components
│   ├── Header.tsx        # Site header
│   ├── Footer.tsx        # Site footer
│   ├── NewsCard.tsx      # News card component
│   └── SEO.tsx           # SEO metadata helper
├── lib/                   # Utilities and configurations
│   ├── supabase/         # Supabase client setup
│   ├── utils/            # Helper functions
│   └── database.types.ts # TypeScript types
├── supabase/             # Database schema
│   └── schema.sql        # SQL schema file
└── public/               # Static assets
```

## Features in Detail

### SEO Optimization
- Dynamic meta tags for each page
- Open Graph tags for social sharing
- Twitter Card support
- Canonical URLs
- Semantic HTML structure

### Image Handling
- Automatic image optimization with Next.js Image component
- Upload to Supabase Storage
- Automatic cleanup when deleting articles
- Responsive image sizing

### Security
- Row Level Security (RLS) on Supabase
- Protected admin routes
- Server-side authentication checks
- Secure file uploads

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.
