import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Usuario } from '../model/entities/Usuario';
import { ApiError } from '../model/services/api';
import { AuthRepository } from '../model/repositories/AuthRepository';

type AuthContextValue = {
  user: Usuario | null;
  isAuthenticated: boolean;
  isLoadingSession: boolean;
  signIn: (email: string, senha: string) => Promise<void>;
  signOut: () => Promise<void>;
  restoreSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  const restoreSession = useCallback(async () => {
    setIsLoadingSession(true);
    try {
      if (!(await AuthRepository.obterToken())) { setUser(null); return; }
      setUser(await AuthRepository.obterUsuarioAtual());
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 401) await AuthRepository.removerToken();
      setUser(null);
    } finally { setIsLoadingSession(false); }
  }, []);

  useEffect(() => { void restoreSession(); }, [restoreSession]);

  const signIn = useCallback(async (email: string, senha: string) => {
    await AuthRepository.login(email, senha);
    setUser(await AuthRepository.obterUsuarioAtual());
  }, []);

  const signOut = useCallback(async () => {
    await AuthRepository.removerToken();
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, isAuthenticated: user !== null, isLoadingSession, signIn, signOut, restoreSession }), [user, isLoadingSession, signIn, signOut, restoreSession]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  return context;
}
