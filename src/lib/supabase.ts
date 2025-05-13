import { createClient } from '@supabase/supabase-js';

// Clean up environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim().replace(/^"|"$/g, '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim().replace(/^"|"$/g, '');

if (!supabaseUrl) throw new Error('Missing environment variable: VITE_SUPABASE_URL');
if (!supabaseAnonKey) throw new Error('Missing environment variable: VITE_SUPABASE_ANON_KEY');

console.log('Initializing Supabase with URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});