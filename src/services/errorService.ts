import { SupabaseError } from '@supabase/supabase-js';

// Error types
export enum ErrorType {
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  NETWORK = 'NETWORK',
  UNKNOWN = 'UNKNOWN'
}

// Error severity levels
export enum ErrorSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL'
}

// Structured error interface
export interface AppError {
  type: ErrorType;
  code: string;
  message: string;
  userMessage: string;
  severity: ErrorSeverity;
  timestamp: Date;
  context?: Record<string, any>;
  originalError?: any;
}

// Error mapping functions
export function mapSupabaseError(error: SupabaseError): AppError {
  // Map Supabase error codes to our error types
  let type = ErrorType.UNKNOWN;
  let severity = ErrorSeverity.ERROR;
  let userMessage = 'An unexpected error occurred. Please try again.';
  
  if (error.code === 'auth/invalid-email' || error.code === 'auth/user-not-found') {
    type = ErrorType.AUTHENTICATION;
    userMessage = 'Invalid email or password. Please try again.';
  } else if (error.code === 'auth/insufficient-permissions') {
    type = ErrorType.AUTHORIZATION;
    userMessage = 'You do not have permission to perform this action.';
  } else if (error.code?.startsWith('validation')) {
    type = ErrorType.VALIDATION;
    userMessage = 'Please check your input and try again.';
  } else if (error.code === '404' || error.code === 'not-found') {
    type = ErrorType.NOT_FOUND;
    userMessage = 'The requested resource was not found.';
  } else if (error.code?.startsWith('server')) {
    type = ErrorType.SERVER;
    severity = ErrorSeverity.CRITICAL;
    userMessage = 'A server error occurred. Our team has been notified.';
  }
  
  return {
    type,
    code: error.code || 'unknown',
    message: error.message || 'Unknown error',
    userMessage,
    severity,
    timestamp: new Date(),
    originalError: error
  };
}

// Generic error mapper
export function createError(
  type: ErrorType,
  message: string,
  userMessage: string,
  severity: ErrorSeverity = ErrorSeverity.ERROR,
  context?: Record<string, any>,
  originalError?: any
): AppError {
  return {
    type,
    code: `${type.toLowerCase()}/custom`,
    message,
    userMessage,
    severity,
    timestamp: new Date(),
    context,
    originalError
  };
}

// Error logging
export function logError(error: AppError): void {
  // Log to console in development
  console.error('[ERROR]', error);
  
  // In production, you would send to a logging service
  if (process.env.NODE_ENV === 'production') {
    // Example: send to a logging service
    // logService.captureError(error);
  }
}

// Error handling
export function handleError(error: any): AppError {
  let appError: AppError;
  
  // Map different error types
  if (error.code && (error.message || error.error_description)) {
    // Likely a Supabase error
    appError = mapSupabaseError(error);
  } else if (error.name === 'FetchError' || error.name === 'NetworkError') {
    // Network error
    appError = createError(
      ErrorType.NETWORK,
      error.message || 'Network error',
      'Unable to connect to the server. Please check your internet connection.'
    );
  } else {
    // Unknown error
    appError = createError(
      ErrorType.UNKNOWN,
      error.message || 'Unknown error',
      'An unexpected error occurred. Please try again.'
    );
  }
  
  // Log the error
  logError(appError);
  
  return appError;
}
