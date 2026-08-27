import { Usuario } from './Usuario';

export interface LoginRequest { email: string; senha: string; }

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  usuario: Usuario;
}
