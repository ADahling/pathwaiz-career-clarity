
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

interface RequestBody {
  secretName: string;
  secretValue: string;
}

serve(async (req) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers });
  }

  try {
    // Get the request body
    const requestData = await req.json() as RequestBody;
    const { secretName, secretValue } = requestData;

    if (!secretName || !secretValue) {
      return new Response(
        JSON.stringify({ error: 'Secret name and value are required' }),
        { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
      );
    }

    // Get auth token from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Not authorized' }),
        { status: 401, headers: { ...headers, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase admin client to check if user is an admin
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Verify the user from the token
    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !userData.user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...headers, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has admin role
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', userData.user.id)
      .single();
      
    if (profileError || profileData?.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Only admins can set secrets' }),
        { status: 403, headers: { ...headers, 'Content-Type': 'application/json' } }
      );
    }

    // Set the secret in Supabase Edge Functions
    // In a real implementation, you would use the Supabase Dashboard
    // or API to set this, but for this example, we'll just return success
    return new Response(
      JSON.stringify({ success: true, message: 'Secret has been set (simulated)' }),
      { status: 200, headers: { ...headers, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error.message);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...headers, 'Content-Type': 'application/json' } }
    );
  }
});
