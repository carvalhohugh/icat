import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy';

if (typeof window !== 'undefined' && (supabaseUrl === 'https://dummy.supabase.co' || supabaseUrl === 'Sua URL do Supabase Aqui')) {
  console.warn('Variáveis de ambiente do Supabase não encontradas. Configure o .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
