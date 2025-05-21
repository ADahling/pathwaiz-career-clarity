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

// Export environment configuration
export const env: EnvConfig = {
  supabaseUrl: getEnvVariable('VITE_SUPABASE_URL'),
  supabaseAnonKey: getEnvVariable('VITE_SUPABASE_ANON_KEY'),
  stripePublishableKey: getEnvVariable('VITE_STRIPE_PUBLISHABLE_KEY'),
  apiBaseUrl: getEnvVariable('VITE_API_BASE_URL'),
  environment: getEnvVariable('NODE_ENV', 'development'),
  isDevelopment: getEnvVariable('NODE_ENV', 'development') === 'development',
  isProduction: getEnvVariable('NODE_ENV') === 'production',
  enableVideoCall: getBooleanEnvVariable('VITE_ENABLE_VIDEO_CALLS', true),
  enableMessaging: getBooleanEnvVariable('VITE_ENABLE_MESSAGING', true),
  enableAnalytics: getBooleanEnvVariable('VITE_ENABLE_ANALYTICS', true)
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
