import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fallback to empty strings but prevent crashing if possible
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        auth: {
            getSession: async () => ({ data: { session: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            signOut: async () => { }
        },
        from: () => ({
            select: () => ({ eq: () => ({ single: () => ({ data: null, error: null }), update: () => ({ eq: () => ({}) }) }) })
        })
    } as any;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Supabase client failed to initialize due to missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.');
}
