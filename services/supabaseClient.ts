import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Supabase environment variables are missing! Check your Vercel/Local settings.');
}

// Fallback to empty strings but prevent crashing if possible, although createClient will still throw if Url is invalid
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null as any;

if (!supabase) {
    console.error('❌ Supabase client failed to initialize. The app may not function correctly.');
}
