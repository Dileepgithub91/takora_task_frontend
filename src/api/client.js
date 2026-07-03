const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });

  const contentType = response.headers.get('content-type') || '';

  if (!response.ok) {
    let message = 'Request Failed';

    try {
      if (contentType.includes('application/json')) {
        const data = await response.json();
        message = data.message || data.error || message;
      } else {
        const text = await response.text();
        message = text || message;
      }
    } catch {
      message = response.statusText || message;
    }

    if (response.status === 401) {
      clearToken();
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response;
}

export async function downloadFile(path, fileName = 'download') {
  const token = getToken();

  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });

  const contentType = response.headers.get('content-type') || '';

  if (!response.ok) {
    let message = 'File Download Failed';

    try {
      if (contentType.includes('application/json')) {
        const data = await response.json();
        message = data.message || data.error || message;
      } else {
        const text = await response.text();
        message = text || message;
      }
    } catch {
      message = response.statusText || message;
    }

    if (response.status === 401) {
      clearToken();
    }

    throw new Error(message);
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
}

// Backward-compatible helper for old pages that import { download }.
export async function download(path, fileName = 'download') {
  return downloadFile(path, fileName);
}
