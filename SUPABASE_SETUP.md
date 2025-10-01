# Supabase Setup Guide

This guide will help you set up Supabase for the Connectivity project.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. A new Supabase project created

## Setup Steps

### 1. Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy your:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### 2. Configure Environment Variables

#### Option A: Using Environment Variables (Recommended)

1. Create a `.env` file in the project root:
   ```bash
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

2. Replace the placeholder values with your actual credentials

#### Option B: Direct Configuration

1. Open `src/lib/supabaseClient.js`
2. Replace `<SUPABASE_URL>` and `<SUPABASE_ANON_KEY>` with your actual values

### 3. Test the Connection

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open the browser console (F12)
3. Navigate to the Explore page
4. Check the console for Supabase connection test results

### 4. Database Schema (Optional)

If you want to create a `projects` table to test the connection:

```sql
-- Create projects table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  author_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access" ON projects
  FOR SELECT USING (true);
```

## Usage Examples

### Fetching Data

```javascript
import { supabase } from '../lib/supabaseClient';

// Fetch all projects
const { data, error } = await supabase
  .from('projects')
  .select('*');

// Fetch with filters
const { data, error } = await supabase
  .from('projects')
  .select('*')
  .eq('author_id', userId)
  .order('created_at', { ascending: false });
```

### Inserting Data

```javascript
// Insert a new project
const { data, error } = await supabase
  .from('projects')
  .insert([
    {
      title: 'My Project',
      description: 'Project description',
      author_id: userId
    }
  ]);
```

### Real-time Subscriptions

```javascript
// Subscribe to changes
const subscription = supabase
  .channel('projects')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'projects' },
    (payload) => console.log('Change received!', payload)
  )
  .subscribe();
```

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**
   - Check that your anon key is correct
   - Ensure you're using the anon key, not the service role key

2. **CORS errors**
   - Make sure your domain is added to the allowed origins in Supabase settings

3. **"Table doesn't exist" error**
   - This is expected if you haven't created the `projects` table yet
   - The connection test will still work and show this error in the console

### Getting Help

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)

