export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://nainalanddeals.com/api'  // Updated to include /api path
  : 'http://localhost:5008';

export const getApiUrl = (path: string) => {
  return `${API_BASE_URL}${path}`;
}; 