import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key';

// Initialize the Supabase client for ICAT
// This client connects to the shared REINOCLASS database architecture.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
