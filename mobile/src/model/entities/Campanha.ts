export type StatusCampanha = 'RASCUNHO' | 'ATIVA' | 'ENCERRADA' | 'CANCELADA';

export interface Campanha {
  id: number;
  ongId: number;
  titulo: string;
  descricao: string;
  meta: number;
  dataInicio: string;
  dataFim: string | null;
  status: StatusCampanha;
  imagemUrl: string | null;
  criadoEm: string;
  atualizadoEm: string;
}
