// lib/queryClient.js

/**
 * Make an API request to the server
 * @param {string} method - The HTTP method (GET, POST, PUT, DELETE)
 * @param {string} url - The URL to fetch
 * @param {object} data - The data to send (for POST/PUT requests)
 * @returns {Promise<any>} - The response data
 */
export async function apiRequest(method, url, data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);
  
  const responseData = await response.json();
  
  if (!response.ok) {
    throw new Error(responseData.error || 'An error occurred');
  }
  
  return responseData;
}