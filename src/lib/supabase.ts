import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Initialize the Supabase client for ICAT
// This client connects to the shared REINOCLASS database architecture.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
