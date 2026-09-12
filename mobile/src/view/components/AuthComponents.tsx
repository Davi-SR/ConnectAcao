import React, { forwardRef } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, TextInput, TextInputProps, View, useWindowDimensions } from 'react-native';

import { authTheme as t } from '../../theme/authTheme';

type AuthTextFieldProps = TextInputProps & {
  label: string;
  icon: 'email' | 'person' | 'lock' | 'confirm';
  error?: boolean;
  trailing?: React.ReactNode;
};

export const AuthTextField = forwardRef<TextInput, AuthTextFieldProps>(function AuthTextField(
  { label, icon, error = false, trailing, style, onFocus, onBlur, ...props }, ref,
) {
  const [focused, setFocused] = React.useState(false);
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.field, focused && styles.fieldFocused, error && styles.fieldError]}>
        <FieldGlyph name={icon} active={focused} />
        <TextInput ref={ref} {...props} style={[styles.input, style]} placeholderTextColor={t.colors.muted}
          onFocus={(event) => { setFocused(true); onFocus?.(event); }} onBlur={(event) => { setFocused(false); onBlur?.(event); }} />
        {trailing}
      </View>
    </View>
  );
});

function FieldGlyph({ name, active }: { name: AuthTextFieldProps['icon']; active: boolean }) {
  return <View style={[styles.glyph, active && styles.glyphActive]} accessibilityElementsHidden>
    {name === 'email' && <View style={styles.envelope}><View style={styles.envelopeLeft} /><View style={styles.envelopeRight} /></View>}
    {name === 'person' && <><View style={styles.personHead} /><View style={styles.personBody} /></>}
    {name === 'lock' && <><View style={styles.lockShackle} /><View style={styles.lockBody}><View style={styles.lockKeyhole} /></View></>}
    {name === 'confirm' && <Text style={styles.confirmGlyph}>↻</Text>}
  </View>;
}

type PasswordFieldProps = Omit<AuthTextFieldProps, 'icon' | 'trailing'> & { icon?: 'lock' | 'confirm'; visible: boolean; onToggle: () => void };

export function PasswordField({ icon = 'lock', visible, onToggle, ...props }: PasswordFieldProps) {
  return <AuthTextField {...props} icon={icon} secureTextEntry={!visible}
    trailing={<Pressable onPress={onToggle} style={styles.trailingButton} accessibilityRole="button" accessibilityLabel={visible ? 'Ocultar senha' : 'Mostrar senha'} hitSlop={8}>
      <View style={styles.eye}><View style={styles.eyePupil} />{!visible && <View style={styles.eyeSlash} />}</View>
    </Pressable>} />;
}

export function AuthHeader({ title, description }: { title: string; description: string }) {
  const { width } = useWindowDimensions();
  const titleSize = Math.min(28, Math.max(23, width * 0.067));
  return <View style={styles.header}>
    <Image source={require('../../Assets/Logo.jpg')} style={styles.logo} resizeMode="contain" accessibilityLabel="Logo ConectAção" />
    <Text style={[styles.title, { fontSize: titleSize, lineHeight: Math.round(titleSize * 1.25) }]}>{title}</Text>
    <Text style={styles.description}>{description}</Text>
  </View>;
}

export function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <Image
      source={require('../../Assets/google-logo.png')}
      style={{ width: size, height: size }}
      resizeMode="contain"
      accessibilityLabel="Logo Google"
    />
  );
}

export function GoogleAuthButton({
  title = 'Continuar com o Google',
  loading = false,
  onPress,
}: {
  title?: string;
  loading?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [
        styles.socialButton,
        styles.googleButton,
        pressed && !loading && styles.socialButtonPressed,
        loading && styles.buttonDisabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={t.colors.ink} />
      ) : (
        <>
          <GoogleIcon size={20} />
          <Text style={styles.googleButtonText}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

export function SocialDivider({ label = 'OU ENTRE COM SEU E-MAIL' }: { label?: string }) {
  return (
    <View style={styles.dividerContainer}>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerLabel}>{label}</Text>
      <View style={styles.dividerLine} />
    </View>
  );
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return <View style={styles.errorBox}><Text style={styles.errorText} accessibilityRole="alert">{message}</Text></View>;
}

export function AuthButton({ title, loading, onPress }: { title: string; loading: boolean; onPress: () => void }) {
  return <Pressable onPress={onPress} disabled={loading} accessibilityRole="button" accessibilityState={{ disabled: loading, busy: loading }}
    style={({ pressed }) => [styles.button, pressed && !loading && styles.buttonPressed, loading && styles.buttonDisabled]}>
    {loading ? <ActivityIndicator color={t.colors.surface} /> : <Text style={styles.buttonText}>{title}  →</Text>}
  </Pressable>;
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginBottom: t.spacing.xl },
  logo: { width: 176, height: 128, marginBottom: t.spacing.sm },
  title: { color: t.colors.brand, fontFamily: 'Plus Jakarta Sans', fontSize: 28, lineHeight: 35, fontWeight: '800', textAlign: 'center', letterSpacing: -0.6 },
  description: { color: t.colors.text, fontFamily: 'Plus Jakarta Sans', fontSize: 15, lineHeight: 22, textAlign: 'center', marginTop: t.spacing.sm, maxWidth: 340 },
  fieldGroup: { marginBottom: t.spacing.md }, label: { color: t.colors.text, fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: '700', marginBottom: 8 },
  field: { minHeight: 58, flexDirection: 'row', alignItems: 'center', backgroundColor: t.colors.surface, borderWidth: 1.5, borderColor: t.colors.inputBorder, borderRadius: t.radius.field, paddingHorizontal: 16 },
  fieldFocused: { borderColor: t.colors.teal, shadowColor: t.colors.teal, shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2 }, fieldError: { borderColor: t.colors.error },
  glyph: { width: 24, height: 24, marginRight: 10, alignItems: 'center', justifyContent: 'center', opacity: 0.72 }, glyphActive: { opacity: 1 },
  envelope: { width: 21, height: 16, borderWidth: 1.8, borderColor: t.colors.muted, borderRadius: 3 }, envelopeLeft: { position: 'absolute', width: 12, height: 1.5, backgroundColor: t.colors.muted, top: 5, left: 0, transform: [{ rotate: '31deg' }] }, envelopeRight: { position: 'absolute', width: 12, height: 1.5, backgroundColor: t.colors.muted, top: 5, right: 0, transform: [{ rotate: '-31deg' }] },
  personHead: { width: 8, height: 8, borderWidth: 1.8, borderColor: t.colors.muted, borderRadius: 4, marginBottom: 2 }, personBody: { width: 17, height: 8, borderWidth: 1.8, borderColor: t.colors.muted, borderRadius: 9 },
  lockShackle: { width: 11, height: 9, borderWidth: 1.8, borderColor: t.colors.muted, borderBottomWidth: 0, borderTopLeftRadius: 7, borderTopRightRadius: 7, marginBottom: -1 }, lockBody: { width: 17, height: 13, borderWidth: 1.8, borderColor: t.colors.muted, borderRadius: 3, alignItems: 'center', justifyContent: 'center' }, lockKeyhole: { width: 3, height: 4, borderRadius: 2, backgroundColor: t.colors.muted },
  confirmGlyph: { color: t.colors.muted, fontSize: 27, lineHeight: 27, fontWeight: '500' },
  input: { flex: 1, minHeight: 56, color: t.colors.ink, fontFamily: 'Plus Jakarta Sans', fontSize: 15, paddingVertical: 0, outlineStyle: 'solid', outlineWidth: 0, outlineColor: 'transparent' }, trailingButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginRight: -8 }, eye: { width: 22, height: 14, borderWidth: 1.7, borderColor: t.colors.muted, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }, eyePupil: { width: 5, height: 5, borderRadius: 3, backgroundColor: t.colors.muted }, eyeSlash: { position: 'absolute', width: 27, height: 1.7, backgroundColor: t.colors.muted, transform: [{ rotate: '43deg' }] },
  errorBox: { backgroundColor: t.colors.errorSurface, borderRadius: 10, borderWidth: 1, borderColor: t.colors.errorBorder, padding: 12, marginBottom: t.spacing.md }, errorText: { color: t.colors.error, fontFamily: 'Plus Jakarta Sans', fontSize: 13, lineHeight: 19, textAlign: 'center' },
  button: { minHeight: 58, borderRadius: t.radius.button, backgroundColor: t.colors.tealDark, alignItems: 'center', justifyContent: 'center', marginTop: 4 }, buttonPressed: { backgroundColor: t.colors.teal }, buttonDisabled: { opacity: 0.62 }, buttonText: { color: t.colors.surface, fontFamily: 'Plus Jakarta Sans', fontSize: 16, fontWeight: '800' },
  socialButton: { minHeight: 54, borderRadius: t.radius.button, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: t.spacing.sm },
  googleButton: { backgroundColor: t.colors.surface, borderWidth: 1.5, borderColor: t.colors.line },
  googleButtonText: { color: t.colors.ink, fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: '700' },
  socialButtonPressed: { opacity: 0.76 },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: t.spacing.lg },
  dividerLine: { flex: 1, height: 1, backgroundColor: t.colors.line },
  dividerLabel: { marginHorizontal: 12, color: t.colors.muted, fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
});
