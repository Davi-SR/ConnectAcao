import { useCallback, useState } from 'react';
import { ApiError } from '../model/services/api';
import { useAuth } from './AuthContext';

export function useLoginViewModel() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const login = useCallback(async () => {
    if (loading) return;
    const normalizedEmail = email.trim();
    if (!normalizedEmail || !senha) { setErro('Informe seu email e sua senha.'); return; }
    setLoading(true); setErro(null);
    try { await signIn(normalizedEmail, senha); }
    catch (cause) {
      if (cause instanceof ApiError && cause.status === 400) setErro('Confira os dados informados.');
      else if (cause instanceof ApiError && cause.status === 401) setErro('Email ou senha inválidos.');
      else if (cause instanceof ApiError && cause.status === 0) setErro(cause.message);
      else setErro('Não foi possível entrar agora. Tente novamente mais tarde.');
    } finally { setLoading(false); }
  }, [email, senha, loading, signIn]);

  return { email, senha, loading, erro, setEmail, setSenha, login };
}
