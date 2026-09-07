import { Ong } from '../entities/Ong';
import { fetchJson } from '../services/api';

export const OngRepository = {
  listarTodas: () => fetchJson<Ong[]>('/ongs'),

  buscarPorId: (id: number) =>
      fetchJson<Ong>(`/ongs/${id}`),

  listarFavoritos: (usuarioId: number) =>
      fetchJson<Ong[]>(`/usuarios/${usuarioId}/favoritos`),

  desfavoritar: (usuarioId: number, ongId: number) =>
      fetchJson<void>(
          `/usuarios/${usuarioId}/favoritos/${ongId}`,
          {
            method: 'DELETE',
          }
      ),
};