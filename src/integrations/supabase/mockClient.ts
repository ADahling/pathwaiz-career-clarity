
// This file is now deprecated and should not be used
// All components should import from '@/integrations/supabase/client' instead
import { supabase } from './client';

console.warn(
  'Warning: The mockClient is deprecated and will be removed. ' +
  'Please use the real Supabase client from "@/integrations/supabase/client" instead.'
);

// Export the real client to allow existing code to continue working
// while migrations are being performed
export const enhancedSupabase = supabase;
export default supabase;
