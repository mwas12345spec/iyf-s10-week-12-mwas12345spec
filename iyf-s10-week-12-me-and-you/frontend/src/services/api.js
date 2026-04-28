const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Generic request
const request = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers
    }
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Session expired');
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
};

// AUTH
export const authAPI = {
  register: (data) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  login: (data) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getMe: () => request('/auth/me')
};

// POSTS
export const postsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/posts${query ? `?${query}` : ''}`);
  },
  create: (data) => request('/posts', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  like: (id) => request(`/posts/${id}/like`, { method: 'POST' }),
  delete: (id) => request(`/posts/${id}`, { method: 'DELETE' })
};

// COMMENTS
export const commentsAPI = {
  getByPost: (id) => request(`/posts/${id}/comments`),
  create: (id, data) => request(`/posts/${id}/comments`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
};