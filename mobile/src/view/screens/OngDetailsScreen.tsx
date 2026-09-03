import React from 'react';
import { ActivityIndicator, Image, Linking, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../navigation/types';
import { authTheme as t } from '../../theme/authTheme';
import { AppIcon } from '../components/HomeIcons';
import { useOngDetailsViewModel } from '../../viewmodel/useOngDetailsViewModel';

type Props = NativeStackScreenProps<RootStackParamList, 'OngDetails'>;

function valueOrNull(value: string | null | undefined) {
  return value?.trim() || null;
}

function addressLines(ong: NonNullable<ReturnType<typeof useOngDetailsViewModel>['ong']>) {
  const street = [valueOrNull(ong.logradouro), valueOrNull(ong.numero)].filter(Boolean).join(', ');
  const complement = valueOrNull(ong.complemento);
  const neighborhood = valueOrNull(ong.bairro);
  const city = [valueOrNull(ong.cidade), valueOrNull(ong.estado)].filter(Boolean).join(' - ');
  const cep = valueOrNull(ong.cep);
  const address = [[street, complement].filter(Boolean).join(', '), neighborhood].filter(Boolean).join(' - ');
  return [address, city, cep ? `CEP ${cep}` : null].filter((line): line is string => Boolean(line));
}

function DetailRow({ icon, children, onPress }: { icon: string; children: string; onPress?: () => void }) {
  const content = <><View style={styles.detailIcon}><AppIcon name={icon} size={20} color={t.colors.tealDark} /></View><Text style={styles.detailText}>{children}</Text></>;
  if (!onPress) return <View style={styles.detailRow}>{content}</View>;
  return <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.detailRow, pressed && styles.pressed]}>{content}</Pressable>;
}

function ImageFallback() {
  return <View style={[styles.heroImage, styles.heroFallback]}><AppIcon name="volunteer_activism" size={42} color={t.colors.tealDark} /></View>;
}

export function OngDetailsScreen({ navigation, route }: Props) {
  const { ong, categoriaNome, isLoading, error, recarregar } = useOngDetailsViewModel(route.params.ongId);
  const [imageFailed, setImageFailed] = React.useState(false);

  if (isLoading) return <SafeAreaView style={styles.safeArea}><View style={styles.state}><ActivityIndicator size="small" color={t.colors.tealDark} /><Text style={styles.stateText}>Carregando perfil...</Text></View></SafeAreaView>;
  if (error || !ong) return <SafeAreaView style={styles.safeArea}><View style={styles.state}><AppIcon name="error_outline" size={30} color={t.colors.error} /><Text style={styles.errorTitle}>Não foi possível carregar esta ONG.</Text><Pressable onPress={() => void recarregar()} accessibilityRole="button" style={styles.retry}><Text style={styles.retryText}>Tentar novamente</Text></Pressable><Pressable onPress={() => navigation.goBack()} accessibilityRole="button"><Text style={styles.backText}>Voltar</Text></Pressable></View></SafeAreaView>;

  const email = valueOrNull(ong.email);
  const telefone = valueOrNull(ong.telefone);
  const address = addressLines(ong);
  return <SafeAreaView style={styles.safeArea}>
    <View style={styles.topBar}>
      <Pressable onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Voltar" style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}><AppIcon name="arrow_back" size={23} color={t.colors.brand} /></Pressable>
      <Text style={styles.topBarTitle}>Perfil da ONG</Text>
      <View style={styles.topBarSpacer} />
    </View>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {ong.imagemUrl && !imageFailed ? <Image source={{ uri: ong.imagemUrl }} onError={() => setImageFailed(true)} style={styles.heroImage} resizeMode="cover" /> : <ImageFallback />}
      <View style={styles.identity}>
        <Text style={styles.ongName}>{ong.nome}</Text>
        {categoriaNome && <Text style={styles.category}>{categoriaNome}</Text>}
        {(valueOrNull(ong.cidade) || valueOrNull(ong.estado)) && <View style={styles.locationLine}><AppIcon name="location_on" size={18} color={t.colors.tealDark} /><Text style={styles.locationText}>{[valueOrNull(ong.cidade), valueOrNull(ong.estado)].filter(Boolean).join(' - ')}</Text></View>}
      </View>
      <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Campanhas', { ongId: ong.id })} style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryPressed]}><AppIcon name="campaign" size={20} color={t.colors.surface} /><Text style={styles.primaryText}>Ver campanhas</Text></Pressable>
      <View style={styles.section}><Text style={styles.sectionTitle}>Sobre a ONG</Text><Text style={styles.bodyText}>{valueOrNull(ong.descricao) ?? 'Esta ONG ainda não possui uma descrição cadastrada.'}</Text></View>
      {address.length > 0 && <View style={styles.section}><Text style={styles.sectionTitle}>Localização</Text><View style={styles.detailGroup}><DetailRow icon="location_on">{address.join('\n')}</DetailRow></View></View>}
      {(email || telefone) && <View style={styles.section}><Text style={styles.sectionTitle}>Contato</Text><View style={styles.detailGroup}>{email && <DetailRow icon="mail" onPress={() => void Linking.openURL(`mailto:${email}`)}>{email}</DetailRow>}{telefone && <DetailRow icon="phone" onPress={() => void Linking.openURL(`tel:${telefone}`)}>{telefone}</DetailRow>}</View></View>}
    </ScrollView>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: t.colors.page },
  topBar: { height: 58, paddingHorizontal: t.spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: t.colors.surface, borderBottomWidth: 1, borderBottomColor: t.colors.line },
  backButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  topBarTitle: { color: t.colors.brand, fontFamily: 'Plus Jakarta Sans', fontSize: 16, fontWeight: '700' },
  topBarSpacer: { width: 44 },
  content: { padding: t.spacing.md, paddingBottom: t.spacing.xxl },
  heroImage: { width: '100%', height: 210, borderRadius: t.radius.card, backgroundColor: t.colors.subtle },
  heroFallback: { alignItems: 'center', justifyContent: 'center' },
  identity: { paddingTop: t.spacing.lg },
  ongName: { color: t.colors.ink, fontFamily: 'Plus Jakarta Sans', fontSize: 25, fontWeight: '700', lineHeight: 32 },
  category: { alignSelf: 'flex-start', marginTop: t.spacing.sm, paddingHorizontal: 12, paddingVertical: 6, borderRadius: t.radius.button, color: t.colors.tealDark, backgroundColor: t.colors.activeSurface, fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: '600' },
  locationLine: { marginTop: t.spacing.sm, flexDirection: 'row', alignItems: 'center', gap: 6 },
  locationText: { color: t.colors.text, fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: '500' },
  primaryButton: { minHeight: 54, marginTop: t.spacing.lg, borderRadius: t.radius.button, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: t.colors.tealDark },
  primaryPressed: { backgroundColor: t.colors.teal },
  primaryText: { color: t.colors.surface, fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: '700' },
  section: { marginTop: t.spacing.xxl },
  sectionTitle: { color: t.colors.ink, fontFamily: 'Plus Jakarta Sans', fontSize: 19, fontWeight: '700', lineHeight: 26, marginBottom: t.spacing.sm },
  bodyText: { color: t.colors.text, fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: '400', lineHeight: 24 },
  detailGroup: { gap: t.spacing.sm },
  detailRow: { minHeight: 48, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: t.spacing.sm },
  detailIcon: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: t.radius.pill, backgroundColor: t.colors.activeSurface },
  detailText: { flex: 1, color: t.colors.text, fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: '500', lineHeight: 21 },
  pressed: { opacity: 0.72 },
  state: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: t.spacing.xl, gap: t.spacing.sm },
  stateText: { color: t.colors.muted, fontFamily: 'Plus Jakarta Sans', fontSize: 14 },
  errorTitle: { color: t.colors.ink, fontFamily: 'Plus Jakarta Sans', fontSize: 16, fontWeight: '700', textAlign: 'center' },
  retry: { marginTop: t.spacing.sm, paddingHorizontal: t.spacing.lg, paddingVertical: 12, borderRadius: t.radius.button, backgroundColor: t.colors.tealDark },
  retryText: { color: t.colors.surface, fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: '700' },
  backText: { color: t.colors.brand, fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: '600' },
});
