
interface EnvConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  stripePublishableKey: string;
  apiBaseUrl: string;
  environment: string;
  isDevelopment: boolean;
  isProduction: boolean;
  enableVideoCall: boolean;
  enableMessaging: boolean;
  enableAnalytics: boolean;
  openai: {
    apiKey: string;
  };
}

// Helper function to get environment variables with validation
function getEnvVariable(key: string, defaultValue?: string): string {
  const value = import.meta.env[key] || defaultValue;
  
  if (!value && defaultValue === undefined) {
    console.warn(`Environment variable ${key} is not defined`);
  }
  
  return value || '';
}

// Helper function to get boolean environment variables
function getBooleanEnvVariable(key: string, defaultValue: boolean): boolean {
  const value = import.meta.env[key];
  
  if (value === undefined) {
    return defaultValue;
  }
  
  return value === 'true' || value === '1';
}

// Export environment configuration with actual Supabase values
export const env: EnvConfig = {
  supabaseUrl: getEnvVariable('VITE_SUPABASE_URL', 'https://sgctvgyzikwdogqudjzr.supabase.co'),
  supabaseAnonKey: getEnvVariable('VITE_SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnY3R2Z3l6aWt3ZG9ncXVkanpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2OTAwMjMsImV4cCI6MjA2MzI2NjAyM30.u28O7pc-mT065D54BKjega7owIVGZYN-nI4SgAhG80s'),
  stripePublishableKey: getEnvVariable('VITE_STRIPE_PUBLISHABLE_KEY', ''),
  apiBaseUrl: getEnvVariable('VITE_API_BASE_URL', 'https://sgctvgyzikwdogqudjzr.supabase.co'),
  environment: getEnvVariable('NODE_ENV', 'development'),
  isDevelopment: getEnvVariable('NODE_ENV', 'development') === 'development',
  isProduction: getEnvVariable('NODE_ENV') === 'production',
  enableVideoCall: getBooleanEnvVariable('VITE_ENABLE_VIDEO_CALLS', true),
  enableMessaging: getBooleanEnvVariable('VITE_ENABLE_MESSAGING', true),
  enableAnalytics: getBooleanEnvVariable('VITE_ENABLE_ANALYTICS', true),
  openai: {
    apiKey: getEnvVariable('VITE_OPENAI_API_KEY', '')
  }
};

// Validate required environment variables
export function validateEnv(): boolean {
  const requiredVars = [
    'supabaseUrl',
    'supabaseAnonKey'
  ];
  
  const missingVars = requiredVars.filter(name => !env[name as keyof EnvConfig]);
  
  if (missingVars.length > 0) {
    console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    return false;
  }
  
  return true;
}
