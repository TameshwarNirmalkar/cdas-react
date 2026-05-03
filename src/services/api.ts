const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiCall = async (endpoint: string, options?: RequestInit) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${sessionStorage.getItem('token')}`,
      ...options?.headers,
    },
  });

  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};