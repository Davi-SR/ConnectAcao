import { getToken } from './authStorage';

const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

if (!configuredApiUrl) {
  console.warn('EXPO_PUBLIC_API_URL não está configurada. Crie mobile/.env a partir de mobile/.env.example.');
}

export const API_BASE_URL = configuredApiUrl?.replace(/\/$/, '') ?? '';

export class ApiError extends Error {
  constructor(public readonly status: number, message?: string) {
    super(message ?? `A API respondeu com HTTP ${status}.`);
    this.name = 'ApiError';
  }
}

export async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_BASE_URL) throw new ApiError(0, 'Configure EXPO_PUBLIC_API_URL antes de acessar a API.');

  let response: Response;
  try {
    const token = await getToken();
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init?.headers,
      },
    });
  } catch {
    throw new ApiError(0, 'Não foi possível conectar ao servidor. Verifique sua conexão.');
  }

  if (!response.ok) {
    let errorMessage: string | undefined;
    try {
      const errorBody = await response.json();
      errorMessage = errorBody.message || errorBody.error || errorBody.mensagem;
    } catch {
      // Ignora erro de parse
    }
    throw new ApiError(response.status, errorMessage);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
