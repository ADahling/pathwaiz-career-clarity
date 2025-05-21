import { createClient } from '@supabase/supabase-js';
import { env } from '@/config/env';
import type { Database } from './types';

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
  env.supabaseUrl,
  env.supabaseAnonKey
);
