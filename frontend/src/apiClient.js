// Lightweight fetch wrapper that enforces cookie-based auth (credentials: 'include')
import { API_BASE } from './apiConfig';

let _onUnauthorized = null;
export function setOnUnauthorized(cb) {
  _onUnauthorized = cb;
}
let _onError = null;
export function setOnError(cb) {
  _onError = cb;
}

export async function apiFetch(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const opts = {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  };
  if (opts.body && typeof opts.body === 'object' && !(opts.body instanceof FormData)) {
    opts.body = JSON.stringify(opts.body);
  }
  const res = await fetch(url, opts);
  let data = null;
  try { data = await res.json(); } catch {}
  if (!res.ok) {
    throw new Error(data?.message || `HTTP ${res.status}`);
  }
  return data;
}

export default apiFetch;
