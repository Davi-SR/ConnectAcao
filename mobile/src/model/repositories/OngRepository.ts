import { Ong } from '../entities/Ong';
import { fetchJson } from '../services/api';

export const OngRepository = {
  listarTodas: () => fetchJson<Ong[]>('/ongs'),
  buscarPorId: (id: number) => fetchJson<Ong>(`/ongs/${id}`),
};
