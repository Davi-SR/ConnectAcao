import { CadastroRequest } from '../entities/Cadastro';
import { Usuario } from '../entities/Usuario';
import { fetchJson } from '../services/api';

export const UsuarioRepository = {
  cadastrar: (dados: CadastroRequest) => fetchJson<Usuario>('/usuarios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  }),
  buscarPorId: (id: number) => fetchJson<Usuario>(`/usuarios/${id}`),
  atualizar: (id: number, dados: Partial<Usuario>) => fetchJson<Usuario>(`/usuarios/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  }),
};
