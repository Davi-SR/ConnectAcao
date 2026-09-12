import { useCallback, useState } from 'react';

import { ApiError } from '../model/services/api';
import { UsuarioRepository } from '../model/repositories/UsuarioRepository';
import { useAuth } from './AuthContext';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useCadastroViewModel() {
  const { signIn, signInWithGoogle } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const cadastrar = useCallback(async () => {
    if (loading || loadingGoogle) return;
    const nomeNormalizado = nome.trim();
    const emailNormalizado = email.trim().toLowerCase();
    if (!nomeNormalizado) { setErro('Informe seu nome completo.'); return; }
    if (!emailNormalizado || !emailPattern.test(emailNormalizado)) { setErro('Informe um email válido.'); return; }
    if (!senha) { setErro('Crie uma senha para continuar.'); return; }
    if (senha.length < 8) { setErro('Use pelo menos 8 caracteres na senha.'); return; }
    if (!confirmarSenha) { setErro('Confirme sua senha.'); return; }
    if (senha !== confirmarSenha) { setErro('As senhas não coincidem.'); return; }

    setLoading(true); setErro(null);
    try {
      await UsuarioRepository.cadastrar({ nome: nomeNormalizado, email: emailNormalizado, senha });
      await signIn(emailNormalizado, senha);
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 409) setErro('Já existe uma conta cadastrada com este email.');
      else if (cause instanceof ApiError && cause.status === 400) setErro('Confira os dados informados.');
      else if (cause instanceof ApiError && cause.status === 0) setErro(cause.message);
      else setErro('Não foi possível criar sua conta agora. Tente novamente mais tarde.');
    } finally { setLoading(false); }
  }, [confirmarSenha, email, loading, loadingGoogle, nome, senha, signIn]);

  const cadastrarGoogle = useCallback(async () => {
    if (loading || loadingGoogle) return;
    setLoadingGoogle(true); setErro(null);
    try {
      await signInWithGoogle();
    } catch (cause) {
      if (cause instanceof Error && cause.message.includes('cancelada')) {
        return;
      }
      setErro(cause instanceof Error ? cause.message : 'Não foi possível cadastrar com o Google.');
    } finally {
      setLoadingGoogle(false);
    }
  }, [loading, loadingGoogle, signInWithGoogle]);

  return { nome, email, senha, confirmarSenha, loading, loadingGoogle, erro, setNome, setEmail, setSenha, setConfirmarSenha, cadastrar, cadastrarGoogle };
}
