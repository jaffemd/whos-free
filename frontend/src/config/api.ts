// API configuration for different environments
const isDevelopment = import.meta.env.DEV;
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const apiUrl = (endpoint: string) => {
  // In development, use the Vite proxy by returning relative paths
  if (isDevelopment && !API_BASE_URL) {
    // Remove leading slash if present
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return cleanEndpoint;
  }
  
  // In production without explicit API URL (Vercel deployment), use relative paths
  if (!API_BASE_URL) {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `/api/${cleanEndpoint.replace(/^\/api\//, '').replace(/^\//, '')}`;
  }
  
  // When VITE_API_URL is explicitly set, use absolute URL
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

export { API_BASE_URL };