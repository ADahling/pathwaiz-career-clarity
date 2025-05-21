
import { createClient } from '@supabase/supabase-js';
import { env } from '@/config/env';
import type { Database } from './types';

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

// Use the values from environment variables
const supabaseUrl = env.supabaseUrl || 'https://sgctvgyzikwdogqudjzr.supabase.co';
const supabaseAnonKey = env.supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnY3R2Z3l6aWt3ZG9ncXVkanpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2OTAwMjMsImV4cCI6MjA2MzI2NjAyM30.u28O7pc-mT065D54BKjega7owIVGZYN-nI4SgAhG80s';

// Create a Supabase client with proper configuration
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);

// Create a custom type-safe wrapper for tables that don't exist yet in the Database type
export const mockSupabase = {
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        data: [],
        error: null,
      }),
      data: [],
      error: null,
    }),
  }),
};

// Function to fetch secrets from Supabase securely using an edge function
export const getSecret = async (secretName: string): Promise<string | null> => {
  try {
    if (!supabase) return null;
    
    const { data, error } = await supabase.functions.invoke('get-secret', {
      body: { secretName }
    });
    
    if (error) {
      console.error(`Error fetching secret ${secretName}:`, error);
      return null;
    }
    
    return data?.secretValue || null;
  } catch (error) {
    console.error(`Error in getSecret for ${secretName}:`, error);
    return null;
  }
};
