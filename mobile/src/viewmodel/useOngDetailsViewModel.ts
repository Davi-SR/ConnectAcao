import { useCallback, useEffect, useState } from 'react';

import { Ong } from '../model/entities/Ong';
import { OngRepository } from '../model/repositories/OngRepository';

export function useOngDetailsViewModel(ongId: number) {
  const [ong, setOng] = useState<Ong | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarOng = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setOng(await OngRepository.buscarPorId(ongId));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível carregar a ONG.');
    } finally {
      setIsLoading(false);
    }
  }, [ongId]);

  useEffect(() => {
    void carregarOng();
  }, [carregarOng]);

  return { ong, isLoading, error, recarregar: carregarOng };
}
