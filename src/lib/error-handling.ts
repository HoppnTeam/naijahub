import { toast } from '@/components/ui/use-toast';
import * as Sentry from '@sentry/react';

/**
 * A utility function to handle errors in async operations
 * 
 * @param error The error object
 * @param customMessage Optional custom message to display to the user
 * @param silent If true, no toast will be shown to the user
 * @returns The error object for further handling if needed
 */
export const handleAsyncError = (
  error: unknown, 
  customMessage?: string,
  silent: boolean = false
): Error => {
  // Convert to Error object if it's not already
  const errorObject = error instanceof Error ? error : new Error(
    typeof error === 'string' ? error : 'An unexpected error occurred'
  );
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error caught by handleAsyncError:', errorObject);
  }
  
  // Report to Sentry
  Sentry.captureException(errorObject);
  
  // Show toast notification unless silent is true
  if (!silent) {
    toast({
      title: "Error",
      description: customMessage || errorObject.message || 'An unexpected error occurred',
      variant: "destructive",
    });
  }
  
  return errorObject;
};

/**
 * A higher-order function that wraps an async function with error handling
 * 
 * @param fn The async function to wrap
 * @param errorMessage Optional custom error message
 * @param silent If true, no toast will be shown on error
 * @returns A wrapped function with error handling
 */
export function withErrorHandling<T, Args extends unknown[]>(
  fn: (...args: Args) => Promise<T>,
  errorMessage?: string,
  silent: boolean = false
): (...args: Args) => Promise<T | undefined> {
  return async (...args: Args): Promise<T | undefined> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleAsyncError(error, errorMessage, silent);
      return undefined;
    }
  };
}

/**
 * Interface for Supabase error structure
 */
interface SupabaseError {
  code: string;
  message: string;
  details?: string;
}

/**
 * Type guard to check if an error is a Supabase error
 */
export const isSupabaseError = (error: unknown): error is SupabaseError => {
  return error !== null && 
         typeof error === 'object' && 
         'code' in error && 
         'message' in error;
};

/**
 * Get a user-friendly message from a Supabase error
 */
export const getSupabaseErrorMessage = (error: unknown): string => {
  if (!isSupabaseError(error)) {
    return 'An unexpected error occurred';
  }

  // Handle common Supabase error codes
  switch (error.code) {
    case '23505': // unique_violation
      return 'This record already exists';
    case '23503': // foreign_key_violation
      return 'This operation references a record that does not exist';
    case '42P01': // undefined_table
      return 'The requested resource does not exist';
    case '42501': // insufficient_privilege
      return 'You do not have permission to perform this action';
    case 'PGRST116': // Row-level security violation
      return 'You do not have permission to access this resource';
    case 'P0001': // raise_exception (custom error)
      return error.details || error.message;
    default:
      return error.message || 'An unexpected database error occurred';
  }
};
