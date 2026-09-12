export type FormaPagamento = 'PIX' | 'CARTAO';
export type StatusDoacao = 'PENDENTE' | 'CONCLUIDA' | 'FALHOU' | 'CANCELADA';

export type Doacao = {
  id: number;
  usuarioId: number;
  campanhaId: number;
  valor: number;
  formaPagamento: FormaPagamento;
  status: StatusDoacao;
  dataDoacao: string;
};
