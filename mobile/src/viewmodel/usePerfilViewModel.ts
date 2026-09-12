import { useCallback, useEffect, useMemo, useState } from 'react';

import { Doacao } from '../model/entities/Doacao';
import { Ong } from '../model/entities/Ong';
import { CampanhaDestaque } from '../model/entities/CampanhaDestaque';
import { Categoria } from '../model/entities/Categoria';
import { DoacaoRepository } from '../model/repositories/DoacaoRepository';
import { OngRepository } from '../model/repositories/OngRepository';
import { CampanhaRepository } from '../model/repositories/CampanhaRepository';
import { CategoriaRepository } from '../model/repositories/CategoriaRepository';
import { useAuth } from './AuthContext';

export type OngApoiadaItem = {
  id: number;
  nome: string;
  imagemUrl: string | null;
  categoriaNome: string;
  progressoMeta: number;
};

export type DoacaoHistoricoItem = {
  id: number;
  ongNome: string;
  dataFormatada: string;
  valorFormatado: string;
  valor: number;
  ongId?: number;
};

const MESES_EXTENSO = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

function formatarDataPorExtenso(dataStr?: string): string {
  if (!dataStr) return 'Data recente';
  try {
    const dt = new Date(dataStr);
    if (isNaN(dt.getTime())) return 'Data recente';
    const dia = dt.getDate().toString().padStart(2, '0');
    const mes = MESES_EXTENSO[dt.getMonth()];
    const ano = dt.getFullYear();
    return `${dia} de ${mes}, ${ano}`;
  } catch {
    return 'Data recente';
  }
}

export function usePerfilViewModel() {
  const { user } = useAuth();
  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  const [ongs, setOngs] = useState<Ong[]>([]);
  const [campanhas, setCampanhas] = useState<CampanhaDestaque[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarDados = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [doacoesRes, ongsRes, campanhasRes, categoriasRes] = await Promise.all([
        user?.id
          ? DoacaoRepository.listarPorUsuario(user.id).catch(() => [] as Doacao[])
          : Promise.resolve([] as Doacao[]),
        OngRepository.listarTodas().catch(() => [] as Ong[]),
        CampanhaRepository.listar().catch(() => [] as CampanhaDestaque[]),
        CategoriaRepository.listar().catch(() => [] as Categoria[]),
      ]);

      setDoacoes(doacoesRes);
      setOngs(ongsRes);
      setCampanhas(campanhasRes);
      setCategorias(categoriasRes);
    } catch (cause) {
      console.error('Erro ao carregar dados do perfil:', cause);
      setError('Não foi possível carregar as informações do perfil.');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    void carregarDados();
  }, [carregarDados]);

  const primeiroNome = useMemo(() => {
    if (!user?.nome) return 'Usuário(a)';
    const partes = user.nome.trim().split(' ');
    return partes[0] || 'Usuário(a)';
  }, [user?.nome]);

  // Doações válidas (concluídas ou sem status de erro)
  const doacoesValidas = useMemo(() => {
    return doacoes.filter((d) => d.status !== 'CANCELADA' && d.status !== 'FALHOU');
  }, [doacoes]);

  // Total doado financeiramente
  const totalDoado = useMemo(() => {
    return doacoesValidas.reduce((sum, d) => sum + (Number(d.valor) || 0), 0);
  }, [doacoesValidas]);

  const totalDoadoFormatado = useMemo(() => {
    return totalDoado.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }, [totalDoado]);

  // Métrica de impacto: quantidade de doações realizadas pelo usuário
  const vidasImpactadas = useMemo(() => {
    return doacoesValidas.length;
  }, [doacoesValidas]);

  // ONGs apoiadas pelo usuário a partir do histórico real de doações no banco
  const ongsApoiadas: OngApoiadaItem[] = useMemo(() => {
    const ongIdsApoiadas = new Set<number>();
    doacoesValidas.forEach((d) => {
      const camp = campanhas.find((c) => c.id === d.campanhaId);
      if (camp?.ongId) {
        ongIdsApoiadas.add(camp.ongId);
      }
    });

    // Apenas as ONGs que o usuário realmente doou via banco
    const ongsAlvo = ongs.filter((o) => ongIdsApoiadas.has(o.id));

    return ongsAlvo.map((ong) => {
      const cat = categorias.find((c) => c.id === ong.categoriaId);
      const campDaOng = campanhas.find((c) => c.ongId === ong.id);
      const progresso =
        campDaOng && typeof campDaOng.percentualMeta === 'number'
          ? Math.min(100, Math.max(0, Math.round(campDaOng.percentualMeta)))
          : 0;

      return {
        id: ong.id,
        nome: ong.nome,
        imagemUrl: ong.imagemUrl || campDaOng?.imagemUrl || null,
        categoriaNome: cat?.nome?.toUpperCase() || 'CAUSA',
        progressoMeta: progresso,
      };
    });
  }, [doacoesValidas, campanhas, ongs, categorias]);

  // Histórico das doações mais recentes
  const doacoesRecentes: DoacaoHistoricoItem[] = useMemo(() => {
    if (!doacoes || doacoes.length === 0) return [];

    const ordenadas = [...doacoes].sort((a, b) => {
      const dtA = a.dataDoacao ? new Date(a.dataDoacao).getTime() : 0;
      const dtB = b.dataDoacao ? new Date(b.dataDoacao).getTime() : 0;
      return dtB - dtA;
    });

    return ordenadas.slice(0, 4).map((d) => {
      const campanha = campanhas.find((c) => c.id === d.campanhaId);
      const ong = campanha ? ongs.find((o) => o.id === campanha.ongId) : undefined;
      const ongNome = ong?.nome || campanha?.titulo || `Causa #${d.campanhaId}`;
      const valorNum = Number(d.valor) || 0;

      return {
        id: d.id,
        ongNome,
        dataFormatada: formatarDataPorExtenso(d.dataDoacao),
        valor: valorNum,
        valorFormatado: valorNum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }),
        ongId: ong?.id,
      };
    });
  }, [doacoes, campanhas, ongs]);

  return {
    user,
    primeiroNome,
    totalDoado,
    totalDoadoFormatado,
    vidasImpactadas,
    ongsApoiadas,
    doacoesRecentes,
    isLoading,
    error,
    recarregar: carregarDados,
  };
}
