import { Campanha } from '../entities/Campanha';
import { fetchJson } from '../services/api';

export const CampanhaRepository = {
  listar: () => fetchJson<Campanha[]>('/campanhas'),
  listarPorOng: (ongId: number) => fetchJson<Campanha[]>(`/ongs/${ongId}/campanhas`),
  buscarPorId: (id: number) => fetchJson<Campanha>(`/campanhas/${id}`),
};
