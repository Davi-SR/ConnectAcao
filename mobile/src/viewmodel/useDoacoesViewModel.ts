import { useCallback, useEffect, useMemo, useState } from 'react';
import { Doacao, StatusDoacao } from '../model/entities/Doacao';
import { CampanhaDestaque } from '../model/entities/CampanhaDestaque';
import { Ong } from '../model/entities/Ong';
import { DoacaoRepository } from '../model/repositories/DoacaoRepository';
import { CampanhaRepository } from '../model/repositories/CampanhaRepository';
import { OngRepository } from '../model/repositories/OngRepository';
import { useAuth } from './AuthContext';

export type ModoFiltro = 'meses' | 'semanas' | 'anos';

export type ChartDataPoint = {
  label: string;
  value: number;
  formattedValue: string;
  fullLabel: string;
  count: number;
};

export type DoacaoRecenteItem = {
  id: number;
  campanhaId: number;
  ongId?: number;
  titulo: string;
  ongNome?: string;
  imagemUrl?: string | null;
  valor: number;
  valorFormatado: string;
  status: StatusDoacao;
  statusLabel: string;
  statusColor: 'concluida' | 'pendente' | 'cancelada';
  dataFormatada: string;
  dataOriginal: string;
};

export const ANO_BASE_INICIAL = 2026;

export const MONTH_NAMES_SHORT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
export const MONTH_NAMES_FULL = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

function formatarDataDoacao(dataStr?: string): string {
  if (!dataStr) return 'Data não informada';
  try {
    const dt = new Date(dataStr);
    if (isNaN(dt.getTime())) return 'Data não informada';
    const dia = dt.getDate().toString().padStart(2, '0');
    const mes = MONTH_NAMES_SHORT[dt.getMonth()];
    const ano = dt.getFullYear();
    return `${dia} ${mes}, ${ano}`;
  } catch {
    return 'Data não informada';
  }
}

export function useDoacoesViewModel() {
  const { user } = useAuth();
  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  const [campanhas, setCampanhas] = useState<CampanhaDestaque[]>([]);
  const [ongs, setOngs] = useState<Ong[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dataAtual = useMemo(() => new Date(), []);
  const anoAtual = dataAtual.getFullYear();
  const mesAtual = dataAtual.getMonth();

  // Estados dos filtros temporais (base inicial: ano atual >= 2026, mês atual)
  const [modoFiltro, setModoFiltro] = useState<ModoFiltro>('meses');
  const [anoSelecionado, setAnoSelecionado] = useState<number>(Math.max(ANO_BASE_INICIAL, anoAtual));
  const [mesSelecionado, setMesSelecionado] = useState<number>(mesAtual);
  const [semestreSelecionado, setSemestreSelecionado] = useState<1 | 2>(mesAtual >= 6 ? 2 : 1);
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);

  // Busca dados diretamente do Banco de Dados via API do Backend
  const carregarDados = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [campanhasRes, ongsRes, doacoesRes] = await Promise.all([
        CampanhaRepository.listar().catch(() => [] as CampanhaDestaque[]),
        OngRepository.listarTodas().catch(() => [] as Ong[]),
        user?.id
          ? DoacaoRepository.listarPorUsuario(user.id).catch(() => [] as Doacao[])
          : Promise.resolve([] as Doacao[]),
      ]);

      setCampanhas(campanhasRes);
      setOngs(ongsRes);
      setDoacoes(doacoesRes);
    } catch (cause) {
      console.error('Erro ao carregar doações do usuário do banco:', cause);
      setError('Não foi possível carregar as informações do banco de dados.');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    void carregarDados();
  }, [carregarDados]);

  // Anos disponíveis: começa no ano base (2026) e escala para anos futuros
  const anosDisponiveis = useMemo(() => {
    const maxAno = Math.max(ANO_BASE_INICIAL, anoAtual);
    const yearsSet = new Set<number>();
    for (let y = ANO_BASE_INICIAL; y <= maxAno; y++) {
      yearsSet.add(y);
    }
    doacoes.forEach((d) => {
      if (d.dataDoacao) {
        const y = new Date(d.dataDoacao).getFullYear();
        if (!isNaN(y) && y >= ANO_BASE_INICIAL) yearsSet.add(y);
      }
    });
    return Array.from(yearsSet).sort((a, b) => a - b);
  }, [doacoes, anoAtual]);

  // Total doado real e ONGs apoiadas calculados exclusivamente a partir dos registros do banco
  const { valorTotalDoado, ongsApoiadasCount } = useMemo(() => {
    const doacoesValidas = doacoes.filter(
      (d) => d.status === 'CONCLUIDA' || d.status === 'PENDENTE'
    );

    const total = doacoesValidas.reduce(
      (acc, curr) => acc + (Number(curr.valor) || 0),
      0
    );

    const ongIds = new Set<number>();
    doacoesValidas.forEach((d) => {
      const campanhaCorrespondente = campanhas.find((c) => c.id === d.campanhaId);
      if (campanhaCorrespondente?.ongId) {
        ongIds.add(campanhaCorrespondente.ongId);
      }
    });

    return {
      valorTotalDoado: total,
      ongsApoiadasCount: ongIds.size,
    };
  }, [doacoes, campanhas]);

  // Lista de Doações Recentes formatada 100% a partir dos registros reais do banco
  const doacoesRecentes: DoacaoRecenteItem[] = useMemo(() => {
    if (!doacoes || doacoes.length === 0) return [];

    // Ordena por data decrescente (mais recente primeiro)
    const ordenadas = [...doacoes].sort((a, b) => {
      const dtA = a.dataDoacao ? new Date(a.dataDoacao).getTime() : 0;
      const dtB = b.dataDoacao ? new Date(b.dataDoacao).getTime() : 0;
      return dtB - dtA;
    });

    return ordenadas.map((d) => {
      const campanha = campanhas.find((c) => c.id === d.campanhaId);
      const ong = campanha ? ongs.find((o) => o.id === campanha.ongId) : undefined;

      const titulo = ong?.nome || campanha?.titulo || `Campanha #${d.campanhaId}`;
      const imagemUrl = ong?.imagemUrl || campanha?.imagemUrl;
      const valorNum = Number(d.valor) || 0;

      let statusLabel = 'CONCLUÍDO';
      let statusColor: 'concluida' | 'pendente' | 'cancelada' = 'concluida';

      if (d.status === 'PENDENTE') {
        statusLabel = 'PROCESSANDO';
        statusColor = 'pendente';
      } else if (d.status === 'CANCELADA' || d.status === 'FALHOU') {
        statusLabel = 'CANCELADO';
        statusColor = 'cancelada';
      }

      return {
        id: d.id,
        campanhaId: d.campanhaId,
        ongId: ong?.id,
        titulo,
        ongNome: ong?.nome,
        imagemUrl,
        valor: valorNum,
        valorFormatado: valorNum.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        status: d.status,
        statusLabel,
        statusColor,
        dataFormatada: formatarDataDoacao(d.dataDoacao),
        dataOriginal: d.dataDoacao || '',
      };
    });
  }, [doacoes, campanhas, ongs]);

  // Agregação dinâmica e precisa dos dados do banco a partir de 2026
  const chartData: ChartDataPoint[] = useMemo(() => {
    const doacoesValidas = doacoes.filter(
      (d) => d.status === 'CONCLUIDA' || d.status === 'PENDENTE'
    );

    // 1. MODO SEMANAS: Detalha as semanas de um mês e ano específicos a partir de Jan/2026
    if (modoFiltro === 'semanas') {
      const diasNoMes = new Date(anoSelecionado, mesSelecionado + 1, 0).getDate();
      const semanasDefs = [
        { label: 'Sem 1', start: 1, end: 7, desc: `1 a 7 de ${MONTH_NAMES_SHORT[mesSelecionado]}` },
        { label: 'Sem 2', start: 8, end: 14, desc: `8 a 14 de ${MONTH_NAMES_SHORT[mesSelecionado]}` },
        { label: 'Sem 3', start: 15, end: 21, desc: `15 a 21 de ${MONTH_NAMES_SHORT[mesSelecionado]}` },
        { label: 'Sem 4', start: 22, end: 28, desc: `22 a 28 de ${MONTH_NAMES_SHORT[mesSelecionado]}` },
      ];

      if (diasNoMes > 28) {
        semanasDefs.push({
          label: 'Sem 5',
          start: 29,
          end: diasNoMes,
          desc: `29 a ${diasNoMes} de ${MONTH_NAMES_SHORT[mesSelecionado]}`,
        });
      }

      return semanasDefs.map((sem) => {
        const doacoesDaSemana = doacoesValidas.filter((d) => {
          if (!d.dataDoacao) return false;
          const dt = new Date(d.dataDoacao);
          return (
            dt.getFullYear() === anoSelecionado &&
            dt.getMonth() === mesSelecionado &&
            dt.getDate() >= sem.start &&
            dt.getDate() <= sem.end
          );
        });

        const soma = doacoesDaSemana.reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);
        return {
          label: sem.label,
          fullLabel: `${sem.label} (${sem.desc})`,
          value: soma,
          formattedValue: soma.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
          count: doacoesDaSemana.length,
        };
      });
    }

    // 2. MODO ANOS: Histórico comparativo a partir de 2026 escalável para anos futuros
    if (modoFiltro === 'anos') {
      return anosDisponiveis.map((ano) => {
        const doacoesDoAno = doacoesValidas.filter((d) => {
          if (!d.dataDoacao) return false;
          const dt = new Date(d.dataDoacao);
          return dt.getFullYear() === ano;
        });

        const soma = doacoesDoAno.reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);
        return {
          label: String(ano),
          fullLabel: `Ano de ${ano}`,
          value: soma,
          formattedValue: soma.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
          count: doacoesDoAno.length,
        };
      });
    }

    // 3. MODO MESES: Detalha os meses do ano selecionado a partir de 2026
    let mesesIndices: number[];
    if (anoSelecionado === anoAtual) {
      if (semestreSelecionado === 1) {
        mesesIndices = [0, 1, 2, 3, 4, 5].filter((m) => anoSelecionado < anoAtual || m <= Math.max(mesAtual, 5));
      } else {
        mesesIndices = [6, 7, 8, 9, 10, 11].filter((m) => anoSelecionado < anoAtual || m <= Math.max(mesAtual, 6));
      }
    } else {
      mesesIndices = semestreSelecionado === 1 ? [0, 1, 2, 3, 4, 5] : [6, 7, 8, 9, 10, 11];
    }

    if (mesesIndices.length === 0) {
      mesesIndices = [0, 1, 2, 3, 4, 5];
    }

    return mesesIndices.map((mesIndex) => {
      const doacoesDoMes = doacoesValidas.filter((d) => {
        if (!d.dataDoacao) return false;
        const dt = new Date(d.dataDoacao);
        return dt.getFullYear() === anoSelecionado && dt.getMonth() === mesIndex;
      });

      const soma = doacoesDoMes.reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);
      return {
        label: MONTH_NAMES_SHORT[mesIndex],
        fullLabel: `${MONTH_NAMES_FULL[mesIndex]} de ${anoSelecionado}`,
        value: soma,
        formattedValue: soma.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        count: doacoesDoMes.length,
      };
    });
  }, [doacoes, modoFiltro, anoSelecionado, mesSelecionado, semestreSelecionado, anosDisponiveis, anoAtual, mesAtual]);

  // KPIs calculados dinamicamente para o filtro temporal atual
  const kpis = useMemo(() => {
    const total = chartData.reduce((acc, curr) => acc + curr.value, 0);
    const doacoesCount = chartData.reduce((acc, curr) => acc + curr.count, 0);
    const media = doacoesCount > 0 ? total / doacoesCount : 0;
    const maior = Math.max(...chartData.map((d) => d.value), 0);

    return {
      totalPeriodo: total,
      mediaPorDoacao: media,
      maiorDoacao: maior,
      qtdDoacoesPeriodo: doacoesCount,
    };
  }, [chartData]);

  const primeiroNome = useMemo(() => {
    if (!user?.nome) return 'Usuário(a)';
    const parts = user.nome.trim().split(' ');
    return parts[0] || 'Usuário(a)';
  }, [user?.nome]);

  // Controles de limites temporais (mínimo 2026, máximo ano corrente / futuro)
  const canRetrocederAno = anoSelecionado > ANO_BASE_INICIAL;
  const canAvancarAno = anoSelecionado < Math.max(ANO_BASE_INICIAL, anoAtual);

  const canRetrocederMes = !(anoSelecionado === ANO_BASE_INICIAL && mesSelecionado === 0);
  const canAvancarMes = !(anoSelecionado === anoAtual && mesSelecionado >= mesAtual);

  const avancarAno = () => {
    if (canAvancarAno) setAnoSelecionado((prev) => prev + 1);
  };
  const retrocederAno = () => {
    if (canRetrocederAno) setAnoSelecionado((prev) => prev - 1);
  };

  const avancarMes = () => {
    if (canAvancarMes) {
      if (mesSelecionado === 11) {
        setMesSelecionado(0);
        setAnoSelecionado((prev) => prev + 1);
      } else {
        setMesSelecionado((prev) => prev + 1);
      }
    }
  };

  const retrocederMes = () => {
    if (canRetrocederMes) {
      if (mesSelecionado === 0) {
        setMesSelecionado(11);
        setAnoSelecionado((prev) => prev - 1);
      } else {
        setMesSelecionado((prev) => prev - 1);
      }
    }
  };

  return {
    user,
    primeiroNome,
    doacoes,
    doacoesRecentes,
    valorTotalDoado,
    ongsApoiadasCount,
    modoFiltro,
    setModoFiltro,
    anoSelecionado,
    setAnoSelecionado,
    mesSelecionado,
    setMesSelecionado,
    semestreSelecionado,
    setSemestreSelecionado,
    anosDisponiveis,
    canRetrocederAno,
    canAvancarAno,
    canRetrocederMes,
    canAvancarMes,
    avancarAno,
    retrocederAno,
    avancarMes,
    retrocederMes,
    selectedPointIndex,
    setSelectedPointIndex,
    chartData,
    kpis,
    isLoading,
    error,
    recarregar: carregarDados,
  };
}
