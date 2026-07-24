const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

function buildUrl(path: string, params?: FetchOptions['params']) {
  const url = new URL(path.startsWith('http') ? path : `${API_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') url.searchParams.set(key, String(value));
    });
  }
  return url.toString();
}

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<ApiResponse<T>> {
  const { params, ...init } = options;
  const url = buildUrl(path, params);

  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...init.headers,
      },
    });
  } catch {
    throw new ApiError(
      'NETWORK_ERROR',
      'Could not reach the API. If this persists, the server may be starting up — wait 30s and try again.',
      0
    );
  }

  let json: ApiResponse<T>;
  try {
    json = await res.json();
  } catch {
    throw new ApiError(
      'PARSE_ERROR',
      res.ok ? 'Invalid API response' : `API error (${res.status})`,
      res.status
    );
  }

  if (!json.success) {
    throw new ApiError(
      json.error?.code ?? 'UNKNOWN',
      json.error?.message ?? 'Request failed',
      res.status,
      json.error?.details
    );
  }

  return json;
}

export const api = {
  get: <T>(path: string, params?: FetchOptions['params']) =>
    apiFetch<T>(`/api/v1${path}`, { params }),
  post: <T>(path: string, body?: unknown) =>
    apiFetch<T>(`/api/v1${path}`, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown) =>
    apiFetch<T>(`/api/v1${path}`, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => apiFetch<T>(`/api/v1${path}`, { method: 'DELETE' }),
};
