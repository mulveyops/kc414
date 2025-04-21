import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Add retry logic for network errors
  let retries = 3;
  
  while (retries > 0) {
    try {
      const res = await fetch(url, {
        method,
        headers: {
          ...(data ? { "Content-Type": "application/json" } : {}),
          // Ensure caching doesn't interfere with requests
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        body: data ? JSON.stringify(data) : undefined,
        credentials: "include",
        // Add a timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000)
      });
  
      await throwIfResNotOk(res);
      return res;
    } catch (err) {
      retries--;
      if (retries === 0) {
        throw err;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * (3 - retries)));
      console.log(`Retrying request to ${url}, ${retries} attempts left`);
    }
  }
  
  // This should never be reached due to the throw in the catch block
  throw new Error("Failed to complete request after multiple attempts");
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Add retry logic for network errors
    let retries = 3;
    
    while (retries > 0) {
      try {
        const res = await fetch(queryKey[0] as string, {
          credentials: "include",
          headers: {
            // Ensure caching doesn't interfere with requests
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          // Add a timeout to prevent hanging requests
          signal: AbortSignal.timeout(10000)
        });
    
        if (unauthorizedBehavior === "returnNull" && res.status === 401) {
          return null;
        }
    
        await throwIfResNotOk(res);
        return await res.json();
      } catch (err) {
        retries--;
        if (retries === 0) {
          console.error(`Failed to fetch from ${queryKey[0]} after multiple attempts`);
          throw err;
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * (3 - retries)));
        console.log(`Retrying query to ${queryKey[0]}, ${retries} attempts left`);
      }
    }
    
    // This should never be reached due to the throw in the catch block
    throw new Error("Failed to complete query after multiple attempts");
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 60000, // 1 minute stale time instead of infinite
      retry: 3, // Retry failed queries 3 times
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    },
    mutations: {
      retry: 2, // Retry failed mutations 2 times
      retryDelay: 1000, // 1 second delay between retries
    },
  },
});
