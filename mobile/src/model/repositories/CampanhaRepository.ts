import { Campanha } from '../entities/Campanha';
import { CampanhaDestaque } from '../entities/CampanhaDestaque';
import { fetchJson } from '../services/api';

export const CampanhaRepository = {
  listar: () => fetchJson<CampanhaDestaque[]>('/campanhas'),
  listarPorOng: (ongId: number) => fetchJson<CampanhaDestaque[]>(`/ongs/${ongId}/campanhas`),
  buscarPorId: (id: number) => fetchJson<Campanha>(`/campanhas/${id}`),
  buscarDestaque: () => fetchJson<CampanhaDestaque>('/campanhas/destaque'),
};
