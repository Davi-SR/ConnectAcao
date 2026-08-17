export interface Ong {
  id: number;
  categoriaId: number;
  nome: string;
  cnpj: string | null;
  descricao: string;
  email: string | null;
  telefone: string | null;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string | null;
  bairro: string | null;
  cidade: string;
  estado: string;
  latitude: number | null;
  longitude: number | null;
  imagemUrl: string | null;
  criadoEm: string | null;
  atualizadoEm: string | null;
}
