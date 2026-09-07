import { useCallback, useEffect, useState } from 'react';

import { Ong } from '../model/entities/Ong';
import { OngRepository } from '../model/repositories/OngRepository';
import { useAuth } from './AuthContext';

export function useFavoritosViewModel() {
    const { user } = useAuth();

    const [favoritos, setFavoritos] = useState<Ong[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const carregarFavoritos = useCallback(async () => {
        if (!user?.id) {
            setFavoritos([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const ongs = await OngRepository.listarFavoritos(user.id);
            setFavoritos(ongs);
        } catch (cause) {
            console.error('Erro ao carregar favoritos:', cause);
            setError('Não foi possível carregar suas ONGs favoritas.');
        } finally {
            setIsLoading(false);
        }
    }, [user?.id]);

    async function desfavoritar(ongId: number) {
        if (!user?.id) {
            return;
        }

        try {
            await OngRepository.desfavoritar(user.id, ongId);

            setFavoritos((favoritosAtuais) =>
                favoritosAtuais.filter((ong) => ong.id !== ongId)
            );
        } catch (cause) {
            console.error('Erro ao remover favorito:', cause);
            setError('Não foi possível remover a ONG dos favoritos.');
        }
    }

    useEffect(() => {
        void carregarFavoritos();
    }, [carregarFavoritos]);

    return {
        favoritos,
        isLoading,
        error,
        carregarFavoritos,
        desfavoritar,
    };
}