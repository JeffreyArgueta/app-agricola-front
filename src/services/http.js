// Único wrapper de fetch para toda la app. Toda función de dominio pasa por http().
import { env } from '@/config/env.js';

const REQUEST_TIMEOUT_MS = 15000;

export class HttpError extends Error {
  constructor(message, { status, code, details } = {}) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function buildUrl(path) {
  const base = env.VITE_API_URL.replace(/\/+$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

async function parseBody(res) {
  const text = await res.text().catch(() => '');
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

function toHttpError(payload, status) {
  // Backend: éxito { status:true, message, data } / error { status:false, message, code }
  const message =
    typeof payload?.message === 'string' && payload.message.trim().length > 0
      ? payload.message
      : `Request failed with status ${status}`;
  return new HttpError(message, {
    status,
    code: payload?.code,
    details: payload,
  });
}

export async function http(path, { method = 'GET', body, headers, signal } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let res;
  try {
    res = await fetch(buildUrl(path), {
      method,
      headers: { 'Content-Type': 'application/json', ...headers },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: signal ?? controller.signal,
    });
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new HttpError('Request timed out or was cancelled', { status: 408, code: 'TIMEOUT' });
    }
    throw new HttpError('Network error. Check your connection and try again.', {
      cause: error,
    });
  } finally {
    clearTimeout(timeout);
  }

  const payload = await parseBody(res);

  if (!res.ok || payload?.status === false) {
    throw toHttpError(payload, res.status);
  }

  // Desenvuelve el backend: { status, message, data } -> data. Devuelve el payload tal cual.
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return payload.data;
  }
  return payload;
}
