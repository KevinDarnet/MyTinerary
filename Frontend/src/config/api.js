// Centralized API configuration for React
// In development: reads REACT_APP_API_URL from .env.development (http://localhost:4000)
// In production: reads REACT_APP_API_URL from .env.production (https://<your-render-service>.onrender.com)
export const API_URL = (process.env.REACT_APP_API_URL || "")
  .trim()
  .replace(/\/api\/?$/, "");

export const API_BASE_URL = `${API_URL}/api`;

export default API_URL;
