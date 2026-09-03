import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { RootStackParamList } from '../../navigation/types';
import { AuthButton, AuthHeader, AuthTextField, FormError, PasswordField } from '../components/AuthComponents';
import { authTheme as t } from '../../theme/authTheme';
import { useCadastroViewModel } from '../../viewmodel/useCadastroViewModel';

type Props = NativeStackScreenProps<RootStackParamList, 'Cadastro'>;

export function CadastroScreen({ navigation }: Props) {
  const { nome, email, senha, confirmarSenha, loading, erro, setNome, setEmail, setSenha, setConfirmarSenha, cadastrar } = useCadastroViewModel();
  const [senhaVisivel, setSenhaVisivel] = React.useState(false);
  const [confirmacaoVisivel, setConfirmacaoVisivel] = React.useState(false);
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
              <AuthHeader title="Crie sua conta e comece a transformar vidas" description="Junte-se a uma comunidade que conecta pessoas e causas." />
              <AuthTextField label="Nome completo" icon="person" value={nome} onChangeText={setNome} autoCapitalize="words" autoCorrect={false} autoComplete="name" placeholder="Digite seu nome" editable={!loading} returnKeyType="next" />
              <AuthTextField label="E-mail" icon="email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" placeholder="seu@email.com" editable={!loading} returnKeyType="next" />
              <PasswordField label="Senha" value={senha} onChangeText={setSenha} visible={senhaVisivel} onToggle={() => setSenhaVisivel((value) => !value)} placeholder="Mínimo de 8 caracteres" editable={!loading} autoCapitalize="none" autoCorrect={false} autoComplete="new-password" returnKeyType="next" />
              <PasswordField icon="confirm" label="Confirmar senha" value={confirmarSenha} onChangeText={setConfirmarSenha} visible={confirmacaoVisivel} onToggle={() => setConfirmacaoVisivel((value) => !value)} placeholder="Repita sua senha" editable={!loading} autoCapitalize="none" autoCorrect={false} autoComplete="new-password" returnKeyType="done" onSubmitEditing={() => void cadastrar()} />
              <FormError message={erro} />
              <AuthButton title="Criar conta" loading={loading} onPress={() => void cadastrar()} />
              <View style={styles.footer}>
                <Text style={styles.footerText}>Já tem uma conta?</Text>
                <Pressable onPress={() => navigation.navigate('Login')} disabled={loading} accessibilityRole="button" accessibilityLabel="Entrar">
                  <Text style={styles.link}>Entre aqui</Text>
                </Pressable>
              </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: t.colors.canvas }, flex: { flex: 1 },
  scroll: { flexGrow: 1, padding: t.spacing.lg, paddingVertical: t.spacing.xl },
  card: { width: '100%', maxWidth: 390, alignSelf: 'center', paddingHorizontal: 8 },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 5, marginTop: t.spacing.xl }, footerText: { color: t.colors.text, fontFamily: 'Plus Jakarta Sans', fontSize: 14 }, link: { color: t.colors.brand, fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: '800' },
});
