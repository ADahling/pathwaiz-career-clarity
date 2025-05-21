
// This is a updated mock client for Supabase, used for testing and development
// It provides mock responses for tables that might not exist yet in the Supabase project
import { createClient } from '@supabase/supabase-js';
import { env } from '@/config/env';
import { Database } from './types';

// Create a set of allowed tables to query
const ALLOWED_TABLES = [
  'bookings',
  'availability_exceptions',
  'profiles',
  'mentee_profiles',
  'mentor_availability',
  'mentor_profiles',
  'reviews', // Added reviews even though it doesn't exist yet
  'notifications', // Added notifications table
  'payments', // Added payments table
  'video_sessions', // Added video sessions table
  'mentees' // Added mentees table
];

// Enhanced mock Supabase client with type-safe wrapper
export const enhancedSupabase = {
  from: (table: string) => {
    // Return a mock implementation that matches the Supabase client API
    return {
      select: (columns = '*') => ({
        eq: (column: string, value: any) => ({
          data: [],
          error: null
        }),
        order: (column: string, options: any) => ({
          data: [],
          error: null
        }),
        data: [],
        error: null
      }),
      insert: (values: any, options?: any) => ({
        data: [],
        error: null
      }),
      update: (values: any, options?: any) => ({
        data: [],
        error: null
      }),
      delete: () => ({
        data: [],
        error: null
      })
    };
  },
  auth: {
    getUser: async () => ({ 
      data: { 
        user: { 
          id: 'mock-user-id',
          email: 'mock@example.com',
          user_metadata: { name: 'Mock User' }
        } 
      }, 
      error: null 
    }),
    getSession: async () => ({ 
      data: { 
        session: { 
          user: { 
            id: 'mock-user-id',
            email: 'mock@example.com',
            user_metadata: { name: 'Mock User' }
          }
        } 
      }, 
      error: null 
    })
  },
  storage: {
    from: (bucket: string) => ({
      upload: async (path: string, file: any) => ({ data: { Key: path }, error: null }),
      getPublicUrl: (path: string) => ({ data: { publicUrl: `https://example.com/${path}` } }),
    })
  },
  functions: {
    invoke: async (name: string, options?: { body?: any }) => ({ 
      data: {}, 
      error: null 
    })
  }
};

// Use the values from environment variables
const supabaseUrl = env.supabaseUrl || 'https://sgctvgyzikwdogqudjzr.supabase.co';
const supabaseAnonKey = env.supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnY3R2Z3l6aWt3ZG9ncXVkanpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2OTAwMjMsImV4cCI6MjA2MzI2NjAyM30.u28O7pc-mT065D54BKjega7owIVGZYN-nI4SgAhG80s';
