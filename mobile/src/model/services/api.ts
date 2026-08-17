const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

if (!configuredApiUrl) {
  console.warn(
    'EXPO_PUBLIC_API_URL não está configurada. Crie mobile/.env a partir de mobile/.env.example.',
  );
}

export const API_BASE_URL = configuredApiUrl?.replace(/\/$/, '') ?? '';

export async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error('Configure EXPO_PUBLIC_API_URL antes de acessar a API.');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Accept: 'application/json', ...init?.headers },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`A API respondeu com HTTP ${response.status}.`);
  }

  return response.json() as Promise<T>;
}
