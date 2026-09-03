import { useCallback, useEffect, useState } from 'react';

import { Ong } from '../model/entities/Ong';
import { OngRepository } from '../model/repositories/OngRepository';
import { CategoriaRepository } from '../model/repositories/CategoriaRepository';

export function useOngDetailsViewModel(ongId: number) {
  const [ong, setOng] = useState<Ong | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoriaNome, setCategoriaNome] = useState<string | null>(null);

  const carregarOng = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [ongData, categorias] = await Promise.all([OngRepository.buscarPorId(ongId), CategoriaRepository.listar()]);
      setOng(ongData);
      setCategoriaNome(categorias.find((categoria) => categoria.id === ongData.categoriaId)?.nome ?? null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível carregar a ONG.');
    } finally {
      setIsLoading(false);
    }
  }, [ongId]);

  useEffect(() => {
    void carregarOng();
  }, [carregarOng]);

  return { ong, categoriaNome, isLoading, error, recarregar: carregarOng };
}
