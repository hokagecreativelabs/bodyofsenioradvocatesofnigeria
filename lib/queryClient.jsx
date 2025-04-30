// lib/queryClient.js - Improved version

import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export async function apiRequest(method, url, data = null) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Important for cookies/auth
  };

  if (data && (method === "POST" || method === "PUT" || method === "PATCH")) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    
    // Handle different response scenarios
    if (response.status === 204) {
      return null; // No content
    }
    
    // For responses with content
    let responseData;
    const contentType = response.headers.get("content-type");
    
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }
    
    // Handle error responses
    if (!response.ok) {
      // Handle authentication errors
      if (response.status === 401) {
        throw new Error("Unauthorized");
      }
      
      // Handle other errors with details if available
      const errorMessage = responseData?.error || responseData?.message || "Request failed";
      throw new Error(errorMessage);
    }
    
    return responseData;
  } catch (error) {
    // Pass through error objects
    if (error instanceof Error) {
      throw error;
    }
    
    // Handle network errors
    throw new Error("Network error occurred");
  }
}

export function getQueryFn({ on401 = "throw" } = {}) {
  return async ({ queryKey }) => {
    const [url] = queryKey;
    try {
      return await apiRequest("GET", url);
    } catch (err) {
      if (on401 === "returnNull" && err.message === "Unauthorized") {
        return null;
      }
      throw err;
    }
  };
}