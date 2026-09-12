import { Doacao } from '../entities/Doacao';
import { fetchJson } from '../services/api';

export const DoacaoRepository = {
  listarPorUsuario: (usuarioId: number) => fetchJson<Doacao[]>(`/usuarios/${usuarioId}/doacoes`),
  buscarPorId: (id: number) => fetchJson<Doacao>(`/doacoes/${id}`),
  criar: (payload: { usuarioId: number; campanhaId: number; valor: number; formaPagamento: 'PIX' | 'CARTAO' }) =>
    fetchJson<Doacao>('/doacoes', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
