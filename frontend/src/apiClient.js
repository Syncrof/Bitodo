// Lightweight fetch wrapper that enforces cookie-based auth (credentials: 'include')
import { API_BASE_URL } from './apiConfig';

let _onUnauthorized = null;
export function setOnUnauthorized(cb) {
  _onUnauthorized = cb;
}
let _onError = null;
export function setOnError(cb) {
  _onError = cb;
}

export async function apiFetch(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
  const opts = {
    credentials: 'include', // include cookies for auth
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  };

  // If body is provided and is an object, stringify it
  if (opts.body && typeof opts.body === 'object' && !(opts.body instanceof FormData)) {
    opts.body = JSON.stringify(opts.body);
  }

  const res = await fetch(url, opts);
  // Try to parse JSON when possible
  let data = null;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await res.json().catch(() => null);
  }

  if (!res.ok) {
    const err = new Error(data?.error?.message || res.statusText || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    if (res.status === 401 && typeof _onUnauthorized === 'function') {
      try { _onUnauthorized(); } catch (e) { /* ignore */ }
    } else if (typeof _onError === 'function') {
      try { _onError(err); } catch (e) { /* ignore */ }
    }
    throw err;
  }

  return { status: res.status, data };
}

export default apiFetch;
