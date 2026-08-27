import { LoginResponse } from '../entities/Auth';
import { Usuario } from '../entities/Usuario';
import { fetchJson } from '../services/api';
import { getToken, removeToken, saveToken } from '../services/authStorage';

export const AuthRepository = {
  async login(email: string, senha: string): Promise<LoginResponse> {
    const response = await fetchJson<LoginResponse>('/auth/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });
    await saveToken(response.accessToken);
    return response;
  },
  obterUsuarioAtual: () => fetchJson<Usuario>('/me'),
  obterToken: getToken,
  removerToken: removeToken,
};
