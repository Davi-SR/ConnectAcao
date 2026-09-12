import React from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import { authTheme as t } from '../../theme/authTheme';
import { HomeHeader } from '../components/HomeHeader';
import { AppIcon } from '../components/HomeIcons';
import { useConfiguracoesViewModel } from '../../viewmodel/useConfiguracoesViewModel';

export function ConfiguracoesScreen() {
  const {
    user,
    notificacoesCampanhas,
    temaEscuro,
    toggleNotificacoes,
    toggleTemaEscuro,

    // Edição de Perfil
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
  } = useConfiguracoesViewModel();

  const [avatarError, setAvatarError] = React.useState(false);

  const initial = user?.nome?.trim().charAt(0).toUpperCase() || 'U';
  const initialEdit = nomeEdit?.trim().charAt(0).toUpperCase() || initial;

  return (
    <SafeAreaView style={styles.safeArea}>
      <HomeHeader />

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Título da Tela */}
        <Text style={styles.pageTitle}>Configurações</Text>

        {/* Card de Identificação do Usuário */}
        <View style={styles.userCard}>
          <View style={styles.avatarWrapper}>
            {user?.fotoUrl && !avatarError ? (
              <Image
                source={{ uri: user.fotoUrl }}
                onError={() => setAvatarError(true)}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarInitial}>{initial}</Text>
              </View>
            )}
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {user?.nome || 'Marina Silva'}
            </Text>
            <Text style={styles.userEmail} numberOfLines={1}>
              {user?.email || 'marina.silva@email.com'}
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Editar dados do perfil"
            onPress={abrirEditarPerfil}
            style={({ pressed }) => [styles.editIconButton, pressed && styles.cardPressed]}
          >
            <AppIcon name="edit" size={22} color="#006A60" />
          </Pressable>
        </View>

        {/* Seção: PREFERÊNCIAS */}
        <Text style={styles.sectionHeading}>PREFERÊNCIAS</Text>
        <View style={styles.cardContainer}>
          {/* Notificações de Campanhas */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconCircle, { backgroundColor: '#CCFBF1' }]}>
                <AppIcon name="campaign" size={22} color="#006A60" />
              </View>
              <Text style={styles.settingLabel}>
                Notificações de{'\n'}Campanhas
              </Text>
            </View>

            <Switch
              value={notificacoesCampanhas}
              onValueChange={toggleNotificacoes}
              trackColor={{ false: '#E5E7EB', true: '#006A60' }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#E5E7EB"
            />
          </View>

          <View style={styles.rowDivider} />

          {/* Tema Escuro */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconCircle, { backgroundColor: '#F3F4F6' }]}>
                <AppIcon name="dark_mode" size={20} color="#374151" />
              </View>
              <Text style={styles.settingLabel}>Tema Escuro</Text>
            </View>

            <Switch
              value={temaEscuro}
              onValueChange={toggleTemaEscuro}
              trackColor={{ false: '#E5E7EB', true: '#006A60' }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#E5E7EB"
            />
          </View>
        </View>

        {/* Seção: INFORMAÇÕES */}
        <Text style={styles.sectionHeading}>INFORMAÇÕES</Text>
        <View style={styles.cardContainer}>
          {/* Sobre o ConectAção */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Sobre o ConectAção"
            onPress={abrirSobre}
            style={({ pressed }) => [styles.infoRow, pressed && styles.cardPressed]}
          >
            <View style={styles.infoLeft}>
              <AppIcon name="info" size={22} color="#006A60" />
              <Text style={styles.infoLabel}>Sobre o ConectAção</Text>
            </View>
            <AppIcon name="chevron_right" size={22} color="#9CA3AF" />
          </Pressable>

          <View style={styles.infoDivider} />

          {/* Termos de Uso e Privacidade */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Termos de Uso e Privacidade"
            onPress={abrirTermos}
            style={({ pressed }) => [styles.infoRow, pressed && styles.cardPressed]}
          >
            <View style={styles.infoLeft}>
              <AppIcon name="policy" size={22} color="#006A60" />
              <Text style={styles.infoLabel}>Termos de Uso e Privacidade</Text>
            </View>
            <AppIcon name="chevron_right" size={22} color="#9CA3AF" />
          </Pressable>

          <View style={styles.infoDivider} />

          {/* Ajuda e Suporte */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ajuda e Suporte"
            onPress={abrirSuporte}
            style={({ pressed }) => [styles.infoRow, pressed && styles.cardPressed]}
          >
            <View style={styles.infoLeft}>
              <AppIcon name="help_outline" size={22} color="#006A60" />
              <Text style={styles.infoLabel}>Ajuda e Suporte</Text>
            </View>
            <AppIcon name="chevron_right" size={22} color="#9CA3AF" />
          </Pressable>
        </View>

        {/* Botão Sair da Conta */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Sair da Conta"
          onPress={abrirLogout}
          style={({ pressed }) => [styles.logoutButton, pressed && styles.cardPressed]}
        >
          <AppIcon name="logout" size={20} color="#DC2626" />
          <Text style={styles.logoutButtonText}>SAIR DA CONTA</Text>
        </Pressable>
      </ScrollView>

      {/* 1. Modal: Editar Perfil */}
      <Modal
        visible={modalEditarPerfilVisible}
        transparent
        animationType="slide"
        onRequestClose={fecharEditarPerfil}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <Pressable style={styles.modalBackdrop} onPress={fecharEditarPerfil} />
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Perfil</Text>
              <Pressable onPress={fecharEditarPerfil} style={styles.modalCloseBtn}>
                <AppIcon name="close" size={22} color="#0A2540" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {saveError && (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorBannerText}>{saveError}</Text>
                </View>
              )}

              {/* Seletor de Foto da Galeria */}
              <View style={styles.photoPickerContainer}>
                <View style={styles.modalAvatarWrapper}>
                  {fotoUrlEdit ? (
                    <Image
                      source={{ uri: fotoUrlEdit }}
                      style={styles.modalAvatarImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.modalAvatarFallback}>
                      <Text style={styles.modalAvatarInitial}>{initialEdit}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.photoPickerActions}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.pickGalleryBtn,
                      pressed && styles.cardPressed,
                    ]}
                    onPress={selecionarFotoDaGaleria}
                  >
                    <AppIcon name="photo_library" size={18} color="#006A60" />
                    <Text style={styles.pickGalleryBtnText}>Escolher da Galeria</Text>
                  </Pressable>

                  {fotoUrlEdit ? (
                    <Pressable
                      style={styles.removePhotoBtn}
                      onPress={() => setFotoUrlEdit('')}
                    >
                      <Text style={styles.removePhotoBtnText}>Remover foto</Text>
                    </Pressable>
                  ) : null}
                </View>
              </View>

              <Text style={styles.inputLabel}>Nome Completo</Text>
              <TextInput
                style={styles.input}
                value={nomeEdit}
                onChangeText={setNomeEdit}
                placeholder="Seu nome completo"
                placeholderTextColor={t.colors.muted}
              />

              <Text style={styles.inputLabel}>E-mail</Text>
              <TextInput
                style={styles.input}
                value={emailEdit}
                onChangeText={setEmailEdit}
                placeholder="seu.email@exemplo.com"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={t.colors.muted}
              />

              <Text style={styles.inputLabel}>Telefone</Text>
              <TextInput
                style={styles.input}
                value={telefoneEdit}
                onChangeText={setTelefoneEdit}
                placeholder="(00) 00000-0000"
                keyboardType="phone-pad"
                placeholderTextColor={t.colors.muted}
              />

              <Pressable
                style={({ pressed }) => [
                  styles.primaryModalBtn,
                  (isSaving || pressed) && styles.cardPressed,
                ]}
                onPress={salvarPerfil}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.primaryModalBtnText}>Salvar Alterações</Text>
                )}
              </Pressable>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* 2. Modal: Sobre o ConectAção */}
      <Modal
        visible={modalSobreVisible}
        transparent
        animationType="fade"
        onRequestClose={fecharSobre}
      >
        <View style={styles.centerModalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={fecharSobre} />
          <View style={styles.infoDialog}>
            <View style={styles.infoIconCircle}>
              <AppIcon name="volunteer_activism" size={32} color="#006A60" />
            </View>
            <Text style={styles.infoDialogTitle}>Sobre o ConectAção</Text>
            <Text style={styles.infoDialogBody}>
              O ConectAção é uma plataforma solidária e transparente desenvolvida para conectar
              corações generosos a organizações não governamentais que transformam vidas.
            </Text>
            <View style={styles.versionBadge}>
              <Text style={styles.versionText}>Versão 1.0.0 • 2026</Text>
            </View>
            <Pressable style={styles.dialogCloseBtn} onPress={fecharSobre}>
              <Text style={styles.dialogCloseBtnText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* 3. Modal: Termos de Uso e Privacidade */}
      <Modal
        visible={modalTermosVisible}
        transparent
        animationType="fade"
        onRequestClose={fecharTermos}
      >
        <View style={styles.centerModalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={fecharTermos} />
          <View style={styles.infoDialog}>
            <View style={styles.infoIconCircle}>
              <AppIcon name="policy" size={32} color="#006A60" />
            </View>
            <Text style={styles.infoDialogTitle}>Privacidade e Segurança</Text>
            <ScrollView style={{ maxHeight: 220 }} showsVerticalScrollIndicator={false}>
              <Text style={styles.infoDialogBody}>
                Seus dados cadastrais e histórico de doações são estritamente protegidos de acordo
                com a Lei Geral de Proteção de Dados (LGPD). As doações financeiras utilizam
                criptografia ponta a ponta e auditoria transparente para assegurar que 100% dos
                recursos cheguem às causas apoiadas.
              </Text>
            </ScrollView>
            <Pressable style={styles.dialogCloseBtn} onPress={fecharTermos}>
              <Text style={styles.dialogCloseBtnText}>Entendido</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* 4. Modal: Ajuda e Suporte */}
      <Modal
        visible={modalSuporteVisible}
        transparent
        animationType="fade"
        onRequestClose={fecharSuporte}
      >
        <View style={styles.centerModalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={fecharSuporte} />
          <View style={styles.infoDialog}>
            <View style={styles.infoIconCircle}>
              <AppIcon name="help_outline" size={32} color="#006A60" />
            </View>
            <Text style={styles.infoDialogTitle}>Ajuda e Suporte</Text>
            <Text style={styles.infoDialogBody}>
              Precisa de ajuda com uma doação ou tem dúvidas sobre a plataforma? Nossa equipe está
              pronta para te atender:
            </Text>
            <View style={styles.supportContactBox}>
              <Text style={styles.supportContactText}>📧 contato@conectacao.org</Text>
              <Text style={styles.supportContactText}>💬 WhatsApp: (11) 98765-4321</Text>
            </View>
            <Pressable style={styles.dialogCloseBtn} onPress={fecharSuporte}>
              <Text style={styles.dialogCloseBtnText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* 5. Modal: Confirmação de Logout */}
      <Modal
        visible={modalLogoutVisible}
        transparent
        animationType="fade"
        onRequestClose={fecharLogout}
      >
        <View style={styles.centerModalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={fecharLogout} />
          <View style={styles.infoDialog}>
            <View style={[styles.infoIconCircle, { backgroundColor: '#FEE2E2' }]}>
              <AppIcon name="logout" size={28} color="#DC2626" />
            </View>
            <Text style={styles.infoDialogTitle}>Sair da Conta?</Text>
            <Text style={styles.infoDialogBody}>
              Você precisará realizar o login novamente para acessar seus dados e histórico de
              doações.
            </Text>
            <View style={styles.logoutActionsRow}>
              <Pressable style={styles.cancelBtn} onPress={fecharLogout}>
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </Pressable>
              <Pressable style={styles.confirmLogoutBtn} onPress={confirmarLogout}>
                <Text style={styles.confirmLogoutBtnText}>Sair</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  body: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: t.spacing.sm,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  /* Título */
  pageTitle: {
    color: '#0A2540',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginTop: 10,
    marginBottom: 18,
  },

  /* Card do Usuário */
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },
  avatarWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#E6F8F6',
    borderWidth: 2,
    borderColor: '#05BCAA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E6F8F6',
  },
  avatarInitial: {
    color: '#006A60',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 24,
    fontWeight: '800',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#111827',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 18,
    fontWeight: '700',
  },
  userEmail: {
    color: '#6B7280',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    fontWeight: '400',
    marginTop: 2,
  },
  editIconButton: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Seções */
  sectionHeading: {
    color: '#9CA3AF',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 22,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: {
    color: '#1F2937',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    flex: 1,
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 72,
  },

  /* Linhas de Informações */
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  infoLabel: {
    color: '#1F2937',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 15,
    fontWeight: '600',
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 16,
    marginRight: 16,
  },

  /* Botão Sair da Conta */
  logoutButton: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#DC2626',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  logoutButtonText: {
    color: '#DC2626',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  /* Modais Gerais */
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFill,
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 22,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    color: '#0A2540',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 19,
    fontWeight: '800',
  },
  modalCloseBtn: {
    padding: 4,
  },

  /* Seletor de Foto */
  photoPickerContainer: {
    alignItems: 'center',
    marginVertical: 12,
    gap: 12,
  },
  modalAvatarWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E6F8F6',
    borderWidth: 2.5,
    borderColor: '#006A60',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalAvatarImage: {
    width: '100%',
    height: '100%',
  },
  modalAvatarFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E6F8F6',
  },
  modalAvatarInitial: {
    color: '#006A60',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 32,
    fontWeight: '800',
  },
  photoPickerActions: {
    alignItems: 'center',
    gap: 6,
  },
  pickGalleryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E6F8F6',
    borderWidth: 1,
    borderColor: '#BDEBE5',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
  },
  pickGalleryBtnText: {
    color: '#006A60',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    fontWeight: '700',
  },
  removePhotoBtn: {
    paddingVertical: 4,
  },
  removePhotoBtnText: {
    color: '#DC2626',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    fontWeight: '600',
  },

  inputLabel: {
    color: '#0A2540',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 15,
    color: '#0A2540',
    backgroundColor: '#F8FAFC',
  },
  primaryModalBtn: {
    height: 50,
    borderRadius: 14,
    backgroundColor: '#006A60',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
    marginBottom: 14,
  },
  primaryModalBtnText: {
    color: '#FFFFFF',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 16,
    fontWeight: '800',
  },
  errorBanner: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    marginBottom: 8,
  },
  errorBannerText: {
    color: '#DC2626',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    textAlign: 'center',
  },

  /* Modais Centrais Informativos */
  centerModalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    padding: 24,
  },
  infoDialog: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 8,
  },
  infoIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E6F8F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  infoDialogTitle: {
    color: '#0A2540',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 19,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  infoDialogBody: {
    color: '#475569',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 16,
  },
  versionBadge: {
    backgroundColor: '#E6F8F6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#BDEBE5',
  },
  versionText: {
    color: '#006A60',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    fontWeight: '700',
  },
  dialogCloseBtn: {
    width: '100%',
    height: 46,
    borderRadius: 12,
    backgroundColor: '#006A60',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogCloseBtnText: {
    color: '#FFFFFF',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 15,
    fontWeight: '700',
  },
  supportContactBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    width: '100%',
    gap: 6,
    marginBottom: 18,
  },
  supportContactText: {
    color: '#0A2540',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    fontWeight: '600',
  },
  logoutActionsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 6,
  },
  cancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    color: '#475569',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    fontWeight: '700',
  },
  confirmLogoutBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmLogoutBtnText: {
    color: '#FFFFFF',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    fontWeight: '700',
  },
  cardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
});
