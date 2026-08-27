import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLoginViewModel } from '../../viewmodel/useLoginViewModel';

export function LoginScreen() {
  const { email, senha, loading, erro, setEmail, setSenha, login } = useLoginViewModel();
  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.content}>
        <Text style={styles.title}>ConectAção</Text>
        <Text style={styles.subtitle}>Entre para continuar</Text>
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} editable={!loading} accessibilityLabel="Email" />
        <TextInput style={styles.input} placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry autoCapitalize="none" autoCorrect={false} editable={!loading} accessibilityLabel="Senha" />
        {erro ? <Text style={styles.error} accessibilityRole="alert">{erro}</Text> : null}
        <Pressable style={[styles.button, loading && styles.disabled]} onPress={() => void login()} disabled={loading} accessibilityRole="button">
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Entrar</Text>}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 }, content: { gap: 14 },
  title: { fontSize: 30, fontWeight: '700', textAlign: 'center' }, subtitle: { textAlign: 'center', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 14, fontSize: 16 }, error: { color: '#b00020', textAlign: 'center' },
  button: { backgroundColor: '#208AEF', borderRadius: 8, padding: 14, alignItems: 'center' }, disabled: { opacity: 0.6 }, buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
