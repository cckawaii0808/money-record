import { createClient } from "@supabase/supabase-js";

export const isMockMode = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// 假資料模式下的 Mock Auth
const mockAuth = {
  getSession: async () => ({ data: { session: { user: { id: 'mock-user' } } }, error: null }),
  onAuthStateChange: (cb: any) => {
    // 立即調用一次初始狀態
    cb('SIGNED_IN', { user: { id: 'mock-user' } });
    return { data: { subscription: { unsubscribe: () => {} } } };
  },
  signInWithOAuth: async () => ({ data: {}, error: null }),
  signOut: async () => ({ error: null }),
  getUser: async () => ({ data: { user: { id: 'mock-user' } }, error: null })
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// 只有在非假資料模式且資料齊全時才初始化
export const supabase = (!isMockMode && supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    })
  : { 
      auth: mockAuth,
      from: () => ({
        select: () => ({ order: () => ({ order: () => Promise.resolve({ data: [], error: null }) }) }),
        insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: {}, error: null }) }) }),
        upsert: () => Promise.resolve({ error: null }),
        update: () => ({ eq: () => Promise.resolve({ error: null }) }),
        delete: () => ({ eq: () => Promise.resolve({ error: null }) })
      })
    } as any;

if (!isMockMode && (!supabaseUrl || !supabaseAnonKey)) {
  console.error("Supabase URL or Anon Key is missing. Please check your .env file.");
}
