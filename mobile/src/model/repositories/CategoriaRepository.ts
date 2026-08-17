import { Categoria } from '../entities/Categoria';
import { fetchJson } from '../services/api';

export const CategoriaRepository = {
  listar: () => fetchJson<Categoria[]>('/categorias'),
  buscarPorId: (id: number) => fetchJson<Categoria>(`/categorias/${id}`),
};
