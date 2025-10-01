import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and anon key from environment variables
// Fallback to placeholder values if not set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "<SUPABASE_URL>";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "<SUPABASE_ANON_KEY>";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
