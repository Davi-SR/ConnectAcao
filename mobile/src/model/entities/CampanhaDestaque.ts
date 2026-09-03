export interface CampanhaDestaque {
  id: number;
  ongId: number;
  ongNome: string | null;
  titulo: string;
  descricao: string;
  imagemUrl: string | null;
  meta: number;
  valorArrecadado: number;
  percentualMeta: number;
  dataFim: string | null;
}
