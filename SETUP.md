# Setup Guide for CBSE.News

This guide will walk you through setting up the CBSE.News project from scratch.

## Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- A Supabase account (free tier works fine)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Supabase

### 2.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in your project details:
   - Name: `cbse-news` (or any name you prefer)
   - Database Password: Choose a strong password (save it!)
   - Region: Choose the closest region to your users
4. Wait for the project to be created (takes 1-2 minutes)

### 2.2 Set Up the Database

1. In your Supabase project, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `supabase/schema.sql`
4. Paste it into the SQL Editor
5. Click **Run** (or press Cmd/Ctrl + Enter)
6. You should see "Success. No rows returned"

### 2.3 Set Up Storage

1. Go to **Storage** in your Supabase dashboard
2. Click **New bucket**
3. Configure the bucket:
   - Name: `news-images`
   - Public bucket: **Enable this** (toggle it ON)
   - File size limit: 5MB (or your preference)
   - Allowed MIME types: `image/*` (or leave empty for all)
4. Click **Create bucket**

### 2.4 Get Your API Keys

1. Go to **Settings** > **API**
2. You'll need:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys" > "anon" > "public")
   - **service_role key** (under "Project API keys" > "service_role" > "secret") - Keep this secret!

## Step 3: Configure Environment Variables

1. Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

2. Open `.env.local` and fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Important:** Never commit `.env.local` to git! It's already in `.gitignore`.

## Step 4: Create an Admin User

1. In Supabase, go to **Authentication** > **Users**
2. Click **Add user** > **Create new user**
3. Fill in:
   - Email: your admin email
   - Password: a strong password
   - Auto Confirm User: **Enable this**
4. Click **Create user**
5. Save these credentials - you'll use them to log in to the admin panel

## Step 5: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 6: Test the Admin Panel

1. Navigate to [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. Log in with the admin credentials you created
3. You should see the admin dashboard
4. Try creating a test news article!

## Troubleshooting

### "Invalid API key" error
- Double-check your `.env.local` file
- Make sure you copied the keys correctly (no extra spaces)
- Restart your dev server after changing environment variables

### "Bucket not found" error
- Make sure you created the `news-images` bucket
- Verify the bucket name is exactly `news-images` (case-sensitive)
- Check that the bucket is set to public

### "Unauthorized" error when accessing admin
- Make sure you created a user in Supabase Authentication
- Verify the user is confirmed (Auto Confirm should be enabled)
- Try logging out and logging back in

### Images not uploading
- Check that the `news-images` bucket exists and is public
- Verify file size is under the limit
- Check browser console for specific error messages

## Next Steps

- Customize the design in `tailwind.config.ts`
- Add more categories if needed
- Set up custom domain
- Deploy to Cloudflare Pages (see README.md)

## Production Deployment

Before deploying to production:

1. Update `NEXT_PUBLIC_SITE_URL` in your production environment variables to your actual domain
2. Add your production domain to Supabase CORS settings (Settings > API > CORS)
3. Consider setting up email templates in Supabase for password resets
4. Review and adjust RLS policies if needed

## Support

If you encounter any issues, check:
- Supabase logs (Dashboard > Logs)
- Browser console for client-side errors
- Terminal for server-side errors
