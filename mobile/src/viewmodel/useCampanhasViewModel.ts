import { useCallback, useEffect, useState } from 'react';

import { Campanha } from '../model/entities/Campanha';
import { CampanhaRepository } from '../model/repositories/CampanhaRepository';

export function useCampanhasViewModel(ongId: number) {
  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarCampanhas = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setCampanhas(await CampanhaRepository.listarPorOng(ongId));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível carregar as campanhas.');
    } finally {
      setIsLoading(false);
    }
  }, [ongId]);

  useEffect(() => {
    void carregarCampanhas();
  }, [carregarCampanhas]);

  return { campanhas, isLoading, error, recarregar: carregarCampanhas };
}
