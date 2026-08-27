export interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone?: string | null;
  fotoUrl?: string | null;
  criadoEm?: string | null;
  atualizadoEm?: string | null;
}
