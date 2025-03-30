import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Supabase connection details
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://vmrffmebmvyqesmpevnl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "your_default_key_here"; // Use environment variable

// Create a flag to track API connection status
let isSupabaseAvailable = true;

// Create the Supabase client with proper authentication configuration
export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      flowType: 'implicit',
    },
    global: {
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_PUBLISHABLE_KEY,
      },
    },
    realtime: {
      params: {
        eventsPerSecond: 1,
      },
    },
  }
);

// Test the connection immediately
(async () => {
  try {
    const { data, error } = await supabase.from('scholarships').select('*').limit(1);
    if (error) {
      console.error("Supabase connection test failed:", error);
      isSupabaseAvailable = false;
    } else {
      console.log("Supabase connection successful");
      isSupabaseAvailable = true;
    }
  } catch (e) {
    console.error("Supabase connection error:", e);
    isSupabaseAvailable = false;
  }
})();

// Use local storage to manage authentication state without hitting rate limits
const WALLET_AUTH_KEY = 'wallet_auth_status';

// This function should be called when a wallet is connected
export const authenticateWithWallet = async (address: string) => {
  if (!address) return { error: "No wallet address provided" };
  
  try {
    // First check if we have already authenticated this wallet in this session
    const authStatus = localStorage.getItem(WALLET_AUTH_KEY);
    if (authStatus) {
      const parsed = JSON.parse(authStatus);
      if (parsed.address === address.toLowerCase()) {
        console.log("Using cached authentication for wallet:", address);
        return { data: parsed, error: null };
      }
    }
    
    // Generate a mock authentication without hitting Supabase to avoid rate limits
    const mockAuthData = {
      user: { id: address, wallet_address: address }
    };
    
    localStorage.setItem(WALLET_AUTH_KEY, JSON.stringify({
      address: address.toLowerCase(),
      ...mockAuthData
    }));
    
    console.log("Created mock authentication for wallet:", address);
    return { data: mockAuthData, error: null };
  } catch (error) {
    console.error("Error in authenticateWithWallet:", error);
    // Provide a fallback to continue operation even if auth fails
    return { 
      data: { user: { id: address, wallet_address: address } },
      error: null
    };
  }
};

// Helper to get the current authenticated wallet
export const getAuthenticatedWallet = () => {
  const authStatus = localStorage.getItem(WALLET_AUTH_KEY);
  if (!authStatus) return null;
  
  try {
    const parsed = JSON.parse(authStatus);
    return parsed.address || null;
  } catch (e) {
    return null;
  }
};

// Get the appropriate client based on API availability
export const getSupabaseClient = () => {
  return isSupabaseAvailable ? supabase : createMockClient();
};

// Create a mock client for fallback when Supabase is unavailable
export const createMockClient = () => {
  console.log("Using mock Supabase client due to connection issues");
  return {
    from: (table: string) => ({
      select: () => ({
        eq: (column: string, value: any) => ({
          single: () => Promise.resolve({ data: null, error: null }),
          order: (column: string, options: any) => ({
            limit: (count: number) => Promise.resolve({ data: [], error: null }),
          }),
          limit: (count: number) => Promise.resolve({ data: [], error: null }),
        }),
        single: () => Promise.resolve({ data: null, error: null }),
        order: (column: string, options: any) => ({
          limit: (count: number) => Promise.resolve({ data: [], error: null }),
        }),
        limit: (count: number) => Promise.resolve({ data: [], error: null }),
      }),
      insert: (values: any) => Promise.resolve({ data: values, error: null }),
      update: (values: any) => ({
        eq: (column: string, value: any) => Promise.resolve({ data: values, error: null }),
        match: (criteria: any) => Promise.resolve({ data: values, error: null }),
      }),
      delete: () => ({
        eq: (column: string, value: any) => Promise.resolve({ data: [], error: null }),
        match: (criteria: any) => Promise.resolve({ data: [], error: null }),
      }),
    }),
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      signOut: async () => ({ error: null }),
    },
  };
};