import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        // Don't retry on 404 or 401 errors
        if (error?.status === 404 || error?.status === 401) {
          return false;
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: false,
    },
  },
});

// Default fetch function for React Query
const defaultFetch = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, options);
  
  if (!response.ok) {
    const error = new Error(`HTTP error! status: ${response.status}`);
    (error as any).status = response.status;
    throw error;
  }
  
  return response.json();
};

// Setup default query function
queryClient.setQueryDefaults(['api'], {
  queryFn: ({ queryKey }) => {
    const [, ...path] = queryKey;
    const url = `/api/${path.join('/')}`;
    return defaultFetch(url);
  },
});

export { defaultFetch as apiRequest };