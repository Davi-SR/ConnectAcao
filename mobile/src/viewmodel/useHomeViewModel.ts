import { useCallback, useEffect, useState } from 'react';

import { Categoria } from '../model/entities/Categoria';
import { CampanhaDestaque } from '../model/entities/CampanhaDestaque';
import { Ong } from '../model/entities/Ong';
import { CampanhaRepository } from '../model/repositories/CampanhaRepository';
import { CategoriaRepository } from '../model/repositories/CategoriaRepository';
import { OngRepository } from '../model/repositories/OngRepository';

export function useHomeViewModel() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriasLoading, setCategoriasLoading] = useState(true);
  const [categoriasError, setCategoriasError] = useState<string | null>(null);
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<number | null>(null);
  const [campanhaDestaque, setCampanhaDestaque] = useState<CampanhaDestaque | null>(null);
  const [campanhaLoading, setCampanhaLoading] = useState(true);
  const [campanhaError, setCampanhaError] = useState<string | null>(null);
  const [ongsRecomendadas, setOngsRecomendadas] = useState<Ong[]>([]);
  const [ongsLoading, setOngsLoading] = useState(true);
  const [ongsError, setOngsError] = useState<string | null>(null);

  const carregarCategorias = useCallback(async () => {
    setCategoriasLoading(true);
    setCategoriasError(null);
    try {
      const data = await CategoriaRepository.listar();
      setCategorias(data);
      setSelectedCategoriaId((current) => current ?? data[0]?.id ?? null);
    } catch {
      setCategoriasError('Não foi possível carregar as categorias.');
    } finally {
      setCategoriasLoading(false);
    }
  }, []);

  useEffect(() => { void carregarCategorias(); }, [carregarCategorias]);

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
      .then((data) => setOngsRecomendadas(data.slice(0, 3)))
      .catch(() => setOngsError('Não foi possível carregar as ONGs recomendadas.'))
      .finally(() => setOngsLoading(false));
    await Promise.all([campanhaPromise, ongsPromise]);
  }, []);

  useEffect(() => { void carregarConteudo(); }, [carregarConteudo]);

  const selecionarCategoria = useCallback((id: number) => setSelectedCategoriaId(id), []);

  return { categorias, categoriasLoading, categoriasError, selectedCategoriaId, selecionarCategoria, carregarCategorias, campanhaDestaque, campanhaLoading, campanhaError, ongsRecomendadas, ongsLoading, ongsError, carregarConteudo };
}
