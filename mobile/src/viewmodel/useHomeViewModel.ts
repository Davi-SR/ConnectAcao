import { useCallback, useEffect, useMemo, useState } from 'react';

import { Categoria } from '../model/entities/Categoria';
import { CampanhaDestaque } from '../model/entities/CampanhaDestaque';
import { Ong } from '../model/entities/Ong';
import { CampanhaRepository } from '../model/repositories/CampanhaRepository';
import { CategoriaRepository } from '../model/repositories/CategoriaRepository';
import { OngRepository } from '../model/repositories/OngRepository';
import { useAuth } from './AuthContext';

export function useHomeViewModel() {
  const { user } = useAuth();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriasLoading, setCategoriasLoading] = useState(true);
  const [categoriasError, setCategoriasError] = useState<string | null>(null);
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<number | null>(null);
  const [search, setSearch] = useState<string>('');
  const [campanhaDestaque, setCampanhaDestaque] = useState<CampanhaDestaque | null>(null);
  const [campanhaLoading, setCampanhaLoading] = useState(true);
  const [campanhaError, setCampanhaError] = useState<string | null>(null);
  const [todasOngs, setTodasOngs] = useState<Ong[]>([]);
  const [ongsLoading, setOngsLoading] = useState(true);
  const [ongsError, setOngsError] = useState<string | null>(null);
  const [favoritoIds, setFavoritoIds] = useState<number[]>([]);

  const carregarCategorias = useCallback(async () => {
    setCategoriasLoading(true);
    setCategoriasError(null);
    try {
      const data = await CategoriaRepository.listar();
      setCategorias(data);
    } catch {
      setCategoriasError('Não foi possível carregar as categorias.');
    } finally {
      setCategoriasLoading(false);
    }
  }, []);

  useEffect(() => {
    void carregarCategorias();
  }, [carregarCategorias]);

  const carregarConteudo = useCallback(async () => {
    setCampanhaLoading(true);
    setOngsLoading(true);
    setCampanhaError(null);
    setOngsError(null);
    const campanhaPromise = CampanhaRepository.buscarDestaque()
      .then(setCampanhaDestaque)
      .catch(() => setCampanhaError('Não foi possível carregar a campanha em destaque.'))
      .finally(() => setCampanhaLoading(false));
    const ongsPromise = OngRepository.listarTodas()
      .then((data) => setTodasOngs(data))
      .catch(() => setOngsError('Não foi possível carregar as ONGs recomendadas.'))
      .finally(() => setOngsLoading(false));
    const favoritosPromise = user?.id
      ? OngRepository.listarFavoritos(user.id)
          .then((ongs) => setFavoritoIds(ongs.map((o) => o.id)))
          .catch(() => setFavoritoIds([]))
      : Promise.resolve();

    await Promise.all([campanhaPromise, ongsPromise, favoritosPromise]);
  }, [user?.id]);

  useEffect(() => {
    void carregarConteudo();
  }, [carregarConteudo]);

  const selecionarCategoria = useCallback((id: number | null) => {
    setSelectedCategoriaId((current) => (current === id ? null : id));
  }, []);

  const ongsFiltradas = useMemo(() => {
    let list = todasOngs;
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
  }, [todasOngs, selectedCategoriaId, search]);

  const selectedCategoriaNome = useMemo(() => {
    if (selectedCategoriaId === null) return null;
    return categorias.find((c) => c.id === selectedCategoriaId)?.nome ?? null;
  }, [categorias, selectedCategoriaId]);

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

  return {
    categorias,
    categoriasLoading,
    categoriasError,
    selectedCategoriaId,
    selectedCategoriaNome,
    selecionarCategoria,
    carregarCategorias,
    search,
    setSearch,
    campanhaDestaque,
    campanhaLoading,
    campanhaError,
    ongsRecomendadas: ongsFiltradas,
    todasOngs,
    ongsLoading,
    ongsError,
    carregarConteudo,
    favoritoIds,
    toggleFavorito,
  };
}
