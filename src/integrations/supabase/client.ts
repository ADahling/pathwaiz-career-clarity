
import { createClient } from '@supabase/supabase-js';
import { env } from '@/config/env';
import type { Database } from './types';

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

// Provide fallback values to prevent "supabaseUrl is required" error
const supabaseUrl = env.supabaseUrl || 'https://sgctvgyzikwdogqudjzr.supabase.co';
const supabaseAnonKey = env.supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnY3R2Z3l6aWt3ZG9ncXVkanpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2OTAwMjMsImV4cCI6MjA2MzI2NjAyM30.u28O7pc-mT065D54BKjega7owIVGZYN-nI4SgAhG80s';

// Create a mock instance for database tables not yet created
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
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
