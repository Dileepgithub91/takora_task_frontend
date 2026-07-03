const API_URL = (
  import.meta.env.VITE_API_URL || 'https://mart-task.onrender.com/api'
).replace(/\/$/, '');

console.log('CURRENT API URL:', API_URL);

export function getToken() {
  return localStorage.getItem('takoraToken') || localStorage.getItem('token');
}

export function setToken(token) {
  if (token) {
    localStorage.setItem('takoraToken', token);
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('takoraToken');
    localStorage.removeItem('token');
  }
}

export function clearToken() {
  localStorage.removeItem('takoraToken');
  localStorage.removeItem('token');
}

export async function api(path, options = {}) {
  const token = getToken();

  const headers = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });

  if (response.status === 401) {
    clearToken();
  }

  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    if (!response.ok) {
      throw new Error('Request failed');
    }

    return response;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

export async function downloadFile(path, fileName) {
  const token = getToken();

  const response = await fetch(`${API_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });

  if (!response.ok) {
    throw new Error('Download failed');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');

  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();

  window.URL.revokeObjectURL(url);
}

export const download = downloadFile;