import { useCallback, useEffect, useMemo, useState } from 'react';

import { Categoria } from '../model/entities/Categoria';
import { CampanhaDestaque } from '../model/entities/CampanhaDestaque';
import { Ong } from '../model/entities/Ong';
import { CampanhaRepository } from '../model/repositories/CampanhaRepository';
import { CategoriaRepository } from '../model/repositories/CategoriaRepository';
import { OngRepository } from '../model/repositories/OngRepository';
import { useAuth } from './AuthContext';

export type TipoFiltroBuscar = 'TUDO' | 'ONGS' | 'CAMPANHAS' | 'FAVORITAS';

export function useBuscarViewModel() {
  const { user } = useAuth();
  const [search, setSearch] = useState<string>('');
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<number | null>(null);
  const [tipoFiltro, setTipoFiltro] = useState<TipoFiltroBuscar>('TUDO');

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [todasOngs, setTodasOngs] = useState<Ong[]>([]);
  const [todasCampanhas, setTodasCampanhas] = useState<CampanhaDestaque[]>([]);
  const [favoritoIds, setFavoritoIds] = useState<number[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarDados = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [categoriasRes, ongsRes, campanhasRes, favoritosRes] = await Promise.all([
        CategoriaRepository.listar().catch(() => [] as Categoria[]),
        OngRepository.listarTodas().catch(() => [] as Ong[]),
        CampanhaRepository.listar().catch(() => [] as CampanhaDestaque[]),
        user?.id
          ? OngRepository.listarFavoritos(user.id)
              .then((f) => f.map((o) => o.id))
              .catch(() => [] as number[])
          : Promise.resolve([] as number[]),
      ]);

      setCategorias(categoriasRes);
      setTodasOngs(ongsRes);
      setTodasCampanhas(campanhasRes);
      setFavoritoIds(favoritosRes);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível carregar as informações.');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    void carregarDados();
  }, [carregarDados]);

  const selecionarCategoria = useCallback((id: number | null) => {
    setSelectedCategoriaId((current) => (current === id ? null : id));
  }, []);

  const toggleFavorito = useCallback(
    async (ongId: number) => {
      if (!user?.id) return;
      const isFavorito = favoritoIds.includes(ongId);
      setFavoritoIds((atuais) =>
        isFavorito ? atuais.filter((id) => id !== ongId) : [...atuais, ongId],
      );
      try {
        if (isFavorito) {
          await OngRepository.desfavoritar(user.id, ongId);
        } else {
          await OngRepository.favoritar(user.id, ongId);
        }
      } catch (cause) {
        console.error('Erro ao alternar favorito:', cause);
        setFavoritoIds((atuais) =>
          isFavorito ? [...atuais, ongId] : atuais.filter((id) => id !== ongId),
        );
      }
    },
    [user?.id, favoritoIds],
  );

  // Mapeamento de contagem de ONGs por categoria
  const contagemPorCategoria = useMemo(() => {
    const mapa: Record<number, number> = {};
    for (const ong of todasOngs) {
      if (ong.categoriaId) {
        mapa[ong.categoriaId] = (mapa[ong.categoriaId] || 0) + 1;
      }
    }
    return mapa;
  }, [todasOngs]);

  // Filtro dinâmico de ONGs
  const ongsFiltradas = useMemo(() => {
    if (tipoFiltro === 'CAMPANHAS') return [];

    let list = todasOngs;

    if (tipoFiltro === 'FAVORITAS') {
      list = list.filter((ong) => favoritoIds.includes(ong.id));
    }

    if (selectedCategoriaId !== null) {
      list = list.filter((ong) => ong.categoriaId === selectedCategoriaId);
    }

    if (search.trim()) {
      const term = search.trim().toLowerCase();
      list = list.filter(
        (ong) =>
          ong.nome.toLowerCase().includes(term) ||
          ong.descricao?.toLowerCase().includes(term) ||
          ong.cidade?.toLowerCase().includes(term) ||
          ong.estado?.toLowerCase().includes(term),
      );
    }

    return list;
  }, [todasOngs, selectedCategoriaId, search, tipoFiltro, favoritoIds]);

  // Filtro dinâmico de Campanhas
  const campanhasFiltradas = useMemo(() => {
    if (tipoFiltro === 'ONGS' || tipoFiltro === 'FAVORITAS') return [];

    let list = todasCampanhas;

    if (selectedCategoriaId !== null) {
      const ongsDaCategoria = new Set(
        todasOngs.filter((o) => o.categoriaId === selectedCategoriaId).map((o) => o.id),
      );
      list = list.filter((c) => ongsDaCategoria.has(c.ongId));
    }

    if (search.trim()) {
      const term = search.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.titulo.toLowerCase().includes(term) ||
          c.descricao?.toLowerCase().includes(term) ||
          c.ongNome?.toLowerCase().includes(term),
      );
    }

    return list;
  }, [todasCampanhas, todasOngs, selectedCategoriaId, search, tipoFiltro]);

  const totalResultados = ongsFiltradas.length + campanhasFiltradas.length;

  const selectedCategoriaNome = useMemo(() => {
    if (selectedCategoriaId === null) return null;
    return categorias.find((c) => c.id === selectedCategoriaId)?.nome ?? null;
  }, [categorias, selectedCategoriaId]);

  return {
    search,
    setSearch,
    selectedCategoriaId,
    selectedCategoriaNome,
    selecionarCategoria,
    tipoFiltro,
    setTipoFiltro,
    categorias,
    todasOngs,
    ongsFiltradas,
    campanhasFiltradas,
    contagemPorCategoria,
    totalResultados,
    favoritoIds,
    toggleFavorito,
    isLoading,
    error,
    recarregar: carregarDados,
  };
}
