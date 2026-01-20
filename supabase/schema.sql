-- Create news table
CREATE TABLE IF NOT EXISTS news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT,
  short_description TEXT NOT NULL,
  content TEXT NOT NULL,
  source_link TEXT,
  category TEXT NOT NULL CHECK (category IN (' News', 'Notices', 'Results')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('published', 'draft')),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);

-- Create index on status and published_at for filtering
CREATE INDEX IF NOT EXISTS idx_news_status_published ON news(status, published_at DESC);

-- Create index on category for category pages
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);

-- Enable Row Level Security
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published news
CREATE POLICY "Published news are viewable by everyone"
  ON news FOR SELECT
  USING (status = 'published');

-- Policy: Only authenticated users can insert news
CREATE POLICY "Authenticated users can insert news"
  ON news FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Only authenticated users can update news
CREATE POLICY "Authenticated users can update news"
  ON news FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Policy: Only authenticated users can delete news
CREATE POLICY "Authenticated users can delete news"
  ON news FOR DELETE
  USING (auth.role() = 'authenticated');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON news
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
