import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { CampanhaDestaque } from '../../model/entities/CampanhaDestaque';
import { authTheme as t } from '../../theme/authTheme';

type Props = { campanha: CampanhaDestaque; onDonate?: () => void };

function brl(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}

function isUrgente(dataFim: string | null) {
  if (!dataFim) return false;
  const dias = Math.ceil((new Date(`${dataFim}T23:59:59`).getTime() - Date.now()) / 86400000);
  return dias >= 0 && dias <= 30;
}

export function CampaignHighlightCard({ campanha, onDonate }: Props) {
  const [imageFailed, setImageFailed] = React.useState(false);
  const percentual = Math.max(0, campanha.percentualMeta);
  const progresso = Math.min(100, percentual);
  return <View style={styles.card}>
    {campanha.imagemUrl && !imageFailed ? <Image source={{ uri: campanha.imagemUrl }} onError={() => setImageFailed(true)} style={styles.image} resizeMode="cover" /> : <View style={[styles.image, styles.imageFallback]} />}
    <LinearGradient
      pointerEvents="none"
      colors={['rgba(1, 57, 120, 0.06)', 'rgba(1, 57, 120, 0.08)', 'rgba(1, 57, 120, 0.14)', 'rgba(1, 57, 120, 0.24)', 'rgba(1, 57, 120, 0.42)']}
      locations={[0, 0.25, 0.5, 0.75, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.gradient}
    />
    <View style={styles.overlay}>
      {isUrgente(campanha.dataFim) && <Text style={styles.badge}>URGENTE</Text>}
      <Text numberOfLines={2} style={styles.title}>{campanha.titulo}</Text>
      <Text numberOfLines={2} style={styles.description}>{campanha.descricao}</Text>
      <View style={styles.bottomRow}>
        <View style={styles.progressColumn}>
          <View style={styles.metrics}><Text style={styles.metric}>{brl(campanha.valorArrecadado)} arrecadados</Text><Text style={styles.metric}>{Math.round(percentual)}%</Text></View>
          <View style={styles.progressTrack}><View style={[styles.progress, { width: `${progresso}%` }]} /></View>
        </View>
        <Pressable accessibilityRole="button" onPress={onDonate} style={({ pressed }) => [styles.donate, pressed && styles.pressed]}><Text style={styles.donateText}>Doar Agora</Text></Pressable>
      </View>
    </View>
  </View>;
}

const styles = StyleSheet.create({
  card: { height: 320, borderRadius: t.radius.card, overflow: 'hidden', backgroundColor: t.colors.brand },
  image: { ...StyleSheet.absoluteFill, width: undefined, height: undefined },
  imageFallback: { backgroundColor: t.colors.brand },
  gradient: { ...StyleSheet.absoluteFill },
  overlay: { flex: 1, justifyContent: 'flex-end', padding: t.spacing.md },
  badge: { alignSelf: 'flex-start', marginBottom: t.spacing.sm, paddingHorizontal: 9, paddingVertical: 5, borderRadius: t.radius.button, color: t.colors.surface, backgroundColor: t.colors.orange, fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: '700', letterSpacing: 0.2 },
  title: { maxWidth: '94%', color: t.colors.surface, fontFamily: 'Plus Jakarta Sans', fontSize: 18, fontWeight: '600', lineHeight: 23 },
  description: { maxWidth: '94%', marginTop: 6, color: t.colors.surface, fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: '400', lineHeight: 16 },
  progressColumn: { flex: 1, minWidth: 0 },
  metrics: { marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between' },
  metric: { color: t.colors.surface, fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: '600' },
  bottomRow: { marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 12 },
  progressTrack: { width: '100%', height: 8, borderRadius: t.radius.pill, backgroundColor: 'rgba(255,255,255,0.45)', overflow: 'hidden' },
  progress: { height: 8, minWidth: 2, borderRadius: t.radius.pill, backgroundColor: t.colors.orange },
  donate: { width: 84, minHeight: 34, borderRadius: t.radius.button, alignItems: 'center', justifyContent: 'center', backgroundColor: t.colors.teal },
  donateText: { color: t.colors.surface, fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: '700' },
  pressed: { opacity: 0.78 },
});
