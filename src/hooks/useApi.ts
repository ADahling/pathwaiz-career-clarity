
import { useState, useCallback } from 'react';
import { useError } from '@/contexts/ErrorContext';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useApi<T = any>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null
  });
  
  const { captureError } = useError();

  const execute = useCallback(async (
    apiCall: () => Promise<T>,
    errorMessage = 'Failed to fetch data'
  ) => {
    setState({ data: null, loading: true, error: null });
    
    try {
      const data = await apiCall();
      setState({ data, loading: false, error: null });
      return { data, error: null };
    } catch (error: any) {
      const appError = error instanceof Error ? error : new Error(errorMessage);
      captureError(appError); // Just capture the error
      setState({ data: null, loading: false, error: appError }); // Use the error directly
      return { data: null, error: appError };
    }
  }, [captureError]);

  return { ...state, execute };
}
