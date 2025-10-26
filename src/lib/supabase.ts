import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Client-side Supabase client (for non-SSR usage)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client component client (for browser)
export const createClientComponent = () => createBrowserClient(supabaseUrl, supabaseAnonKey);
