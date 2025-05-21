
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';

interface RequestBody {
  secretName: string;
}

// Securely get secrets stored in Supabase
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
    const { secretName } = requestData;

    if (!secretName) {
      return new Response(
        JSON.stringify({ error: 'Secret name is required' }),
        { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
      );
    }

    // Get secret from Deno.env
    const secretValue = Deno.env.get(secretName);

    // Return the secret value or null
    return new Response(
      JSON.stringify({ secretValue: secretValue || null }),
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
