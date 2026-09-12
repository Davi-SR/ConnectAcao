import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { RootStackParamList } from '../../navigation/types';
import {
  AuthButton,
  AuthHeader,
  AuthTextField,
  FormError,
  GoogleAuthButton,
  PasswordField,
  SocialDivider,
} from '../components/AuthComponents';
import { authTheme as t } from '../../theme/authTheme';
import { useLoginViewModel } from '../../viewmodel/useLoginViewModel';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { email, senha, loading, loadingGoogle, erro, setEmail, setSenha, login, loginGoogle } = useLoginViewModel();
  const [senhaVisivel, setSenhaVisivel] = React.useState(false);
  const isBusy = loading || loadingGoogle;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <AuthHeader title={'Faça parte dessa corrente\ndo bem'} description="Conecte-se para ajudar ou ser ajudado." />

            <GoogleAuthButton title="Continuar com o Google" loading={loadingGoogle} onPress={() => void loginGoogle()} />

            <SocialDivider label="OU ENTRE COM SEU E-MAIL" />

            <AuthTextField
              label="E-mail"
              icon="email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              placeholder="seu@email.com"
              editable={!isBusy}
              returnKeyType="next"
            />
            <PasswordField
              label="Senha"
              value={senha}
              onChangeText={setSenha}
              visible={senhaVisivel}
              onToggle={() => setSenhaVisivel((value) => !value)}
              placeholder="Digite sua senha"
              editable={!isBusy}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="password"
              returnKeyType="done"
              onSubmitEditing={() => void login()}
            />

            <View style={styles.forgotRow}>
              <Pressable onPress={() => undefined} accessibilityRole="button" accessibilityLabel="Esqueci minha senha">
                <Text style={styles.forgotText}>Esqueci minha senha</Text>
              </Pressable>
            </View>

            <FormError message={erro} />
            <AuthButton title="Entrar" loading={loading} onPress={() => void login()} />

            <View style={styles.footer}>
              <Text style={styles.footerText}>Ainda não tem conta?</Text>
              <Pressable onPress={() => navigation.navigate('Cadastro')} disabled={isBusy} accessibilityRole="button" accessibilityLabel="Cadastre-se">
                <Text style={styles.link}>Cadastre-se</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: t.colors.canvas },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: t.spacing.lg, paddingVertical: t.spacing.xl },
  content: { width: '100%', maxWidth: 390, alignSelf: 'center', paddingHorizontal: 8 },
  forgotRow: { alignItems: 'flex-end', marginTop: -4, marginBottom: t.spacing.md },
  forgotText: { color: t.colors.error, fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 5, marginTop: t.spacing.xl },
  footerText: { color: t.colors.text, fontFamily: 'Plus Jakarta Sans', fontSize: 14 },
  link: { color: t.colors.brand, fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: '800' },
});
