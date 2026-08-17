import { useCallback, useEffect, useState } from 'react';

import { Ong } from '../model/entities/Ong';
import { OngRepository } from '../model/repositories/OngRepository';

export function useHomeViewModel() {
  const [ongs, setOngs] = useState<Ong[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarOngs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setOngs(await OngRepository.listarTodas());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível carregar as ONGs.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void carregarOngs();
  }, [carregarOngs]);

  return { ongs, loading, error, carregarOngs };
}
