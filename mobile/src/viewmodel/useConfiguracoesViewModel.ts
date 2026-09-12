import { useCallback, useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

import { UsuarioRepository } from '../model/repositories/UsuarioRepository';
import { useAuth } from './AuthContext';

export function useConfiguracoesViewModel() {
  const { user, signOut, atualizarUsuarioState } = useAuth();

  // Preferências
  const [notificacoesCampanhas, setNotificacoesCampanhas] = useState<boolean>(true);
  const [temaEscuro, setTemaEscuro] = useState<boolean>(false);

  // Estados dos Modais
  const [modalEditarPerfilVisible, setModalEditarPerfilVisible] = useState(false);
  const [modalSobreVisible, setModalSobreVisible] = useState(false);
  const [modalTermosVisible, setModalTermosVisible] = useState(false);
  const [modalSuporteVisible, setModalSuporteVisible] = useState(false);
  const [modalLogoutVisible, setModalLogoutVisible] = useState(false);

  // Formulário de Edição do Usuário
  const [nomeEdit, setNomeEdit] = useState('');
  const [emailEdit, setEmailEdit] = useState('');
  const [telefoneEdit, setTelefoneEdit] = useState('');
  const [fotoUrlEdit, setFotoUrlEdit] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Sincroniza formulário com usuário autenticado
  useEffect(() => {
    if (user) {
      setNomeEdit(user.nome || '');
      setEmailEdit(user.email || '');
      setTelefoneEdit(user.telefone || '');
      setFotoUrlEdit(user.fotoUrl || '');
    }
  }, [user]);

  const toggleNotificacoes = useCallback(() => {
    setNotificacoesCampanhas((prev) => !prev);
  }, []);

  const toggleTemaEscuro = useCallback(() => {
    setTemaEscuro((prev) => !prev);
  }, []);

  const selecionarFotoDaGaleria = useCallback(async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setSaveError('É necessário permitir o acesso à galeria para selecionar uma foto.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const uri = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri;
        setFotoUrlEdit(uri);
        setSaveError(null);
      }
    } catch (err) {
      console.error('Erro ao selecionar foto:', err);
      setSaveError('Não foi possível carregar a imagem da galeria.');
    }
  }, []);

  const abrirEditarPerfil = useCallback(() => {
    if (user) {
      setNomeEdit(user.nome || '');
      setEmailEdit(user.email || '');
      setTelefoneEdit(user.telefone || '');
      setFotoUrlEdit(user.fotoUrl || '');
    }
    setSaveError(null);
    setModalEditarPerfilVisible(true);
  }, [user]);

  const fecharEditarPerfil = useCallback(() => {
    setModalEditarPerfilVisible(false);
    setSaveError(null);
  }, []);

  const salvarPerfil = useCallback(async () => {
    if (!user?.id) return;
    if (!nomeEdit.trim()) {
      setSaveError('O nome não pode ficar em branco.');
      return;
    }
    if (!emailEdit.trim() || !emailEdit.includes('@')) {
      setSaveError('Informe um e-mail válido.');
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    try {
      const usuarioAtualizado = await UsuarioRepository.atualizar(user.id, {
        nome: nomeEdit.trim(),
        email: emailEdit.trim(),
        telefone: telefoneEdit.trim() || undefined,
        fotoUrl: fotoUrlEdit.trim() || undefined,
      });

      atualizarUsuarioState(usuarioAtualizado);
      setModalEditarPerfilVisible(false);
    } catch (cause) {
      console.error('Erro ao salvar perfil:', cause);
      setSaveError(
        cause instanceof Error ? cause.message : 'Não foi possível salvar as alterações do perfil.'
      );
    } finally {
      setIsSaving(false);
    }
  }, [user?.id, nomeEdit, emailEdit, telefoneEdit, fotoUrlEdit, atualizarUsuarioState]);

  const abrirSobre = useCallback(() => setModalSobreVisible(true), []);
  const fecharSobre = useCallback(() => setModalSobreVisible(false), []);

  const abrirTermos = useCallback(() => setModalTermosVisible(true), []);
  const fecharTermos = useCallback(() => setModalTermosVisible(false), []);

  const abrirSuporte = useCallback(() => setModalSuporteVisible(true), []);
  const fecharSuporte = useCallback(() => setModalSuporteVisible(false), []);

  const abrirLogout = useCallback(() => setModalLogoutVisible(true), []);
  const fecharLogout = useCallback(() => setModalLogoutVisible(false), []);

  const confirmarLogout = useCallback(async () => {
    setModalLogoutVisible(false);
    await signOut();
  }, [signOut]);

  return {
    user,
    notificacoesCampanhas,
    temaEscuro,
    toggleNotificacoes,
    toggleTemaEscuro,

    // Edição
    modalEditarPerfilVisible,
    abrirEditarPerfil,
    fecharEditarPerfil,
    nomeEdit,
    setNomeEdit,
    emailEdit,
    setEmailEdit,
    telefoneEdit,
    setTelefoneEdit,
    fotoUrlEdit,
    setFotoUrlEdit,
    selecionarFotoDaGaleria,
    salvarPerfil,
    isSaving,
    saveError,

    // Modais informativos
    modalSobreVisible,
    abrirSobre,
    fecharSobre,
    modalTermosVisible,
    abrirTermos,
    fecharTermos,
    modalSuporteVisible,
    abrirSuporte,
    fecharSuporte,
    modalLogoutVisible,
    abrirLogout,
    fecharLogout,
    confirmarLogout,
  };
}
