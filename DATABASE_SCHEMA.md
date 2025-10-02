# Database Schema

## Projects Table

Create the following table in your Supabase database:

```sql
-- Create projects table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  link TEXT,
  tags TEXT[], -- Array of tags for the project
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now (adjust based on your auth requirements)
CREATE POLICY "Allow all operations on projects" ON projects
  FOR ALL USING (true) WITH CHECK (true);

-- Create an index on created_at for better performance
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
```

## Migration for Existing Databases

If you already have a projects table without the tags column, run this migration:

```sql
-- Add tags column to existing projects table
ALTER TABLE projects ADD COLUMN tags TEXT[];

-- Optionally, add some default tags to existing projects
UPDATE projects SET tags = ARRAY['General'] WHERE tags IS NULL;
```

## Environment Variables

Make sure you have the following environment variables set in your `.env` file:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Testing the Schema

You can test the schema by running the following queries in your Supabase SQL editor:

```sql
-- Insert a test project
INSERT INTO projects (title, description, link, tags) 
VALUES (
  'Test Project', 
  'This is a test project description', 
  'https://example.com',
  ARRAY['CS', 'Web Dev', 'React']
);

-- Fetch all projects
SELECT * FROM projects ORDER BY created_at DESC;
```
