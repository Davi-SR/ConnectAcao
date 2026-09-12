import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Usuario } from '../model/entities/Usuario';
import { ApiError } from '../model/services/api';
import { AuthRepository } from '../model/repositories/AuthRepository';
import { checkGoogleRedirectOnMount, promptGoogleAuth } from '../model/services/googleAuth';

type AuthContextValue = {
  user: Usuario | null;
  isAuthenticated: boolean;
  isLoadingSession: boolean;
  signIn: (email: string, senha: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  restoreSession: () => Promise<void>;
  atualizarUsuarioState: (usuario: Usuario) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  const restoreSession = useCallback(async () => {
    setIsLoadingSession(true);
    try {
      // 1. Se acabou de retornar de um redirecionamento do Google
      const googleProfile = await checkGoogleRedirectOnMount();
      if (googleProfile) {
        await AuthRepository.loginGoogle({
          email: googleProfile.email,
          nome: googleProfile.nome,
          fotoUrl: googleProfile.fotoUrl,
          googleId: googleProfile.googleId,
        });
        setUser(await AuthRepository.obterUsuarioAtual());
        return;
      }

      // 2. Se já tem token salvo
      if (!(await AuthRepository.obterToken())) {
        setUser(null);
        return;
      }
      setUser(await AuthRepository.obterUsuarioAtual());
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 401) await AuthRepository.removerToken();
      setUser(null);
    } finally {
      setIsLoadingSession(false);
    }
  }, []);

  useEffect(() => { void restoreSession(); }, [restoreSession]);

  const signIn = useCallback(async (email: string, senha: string) => {
    await AuthRepository.login(email, senha);
    setUser(await AuthRepository.obterUsuarioAtual());
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const profile = await promptGoogleAuth();
    await AuthRepository.loginGoogle({
      email: profile.email,
      nome: profile.nome,
      fotoUrl: profile.fotoUrl,
      googleId: profile.googleId,
    });
    setUser(await AuthRepository.obterUsuarioAtual());
  }, []);

  const signOut = useCallback(async () => {
    await AuthRepository.removerToken();
    setUser(null);
  }, []);

  const atualizarUsuarioState = useCallback((novoUsuario: Usuario) => {
    setUser(novoUsuario);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: user !== null, isLoadingSession, signIn, signInWithGoogle, signOut, restoreSession, atualizarUsuarioState }),
    [user, isLoadingSession, signIn, signInWithGoogle, signOut, restoreSession, atualizarUsuarioState]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  return context;
}
