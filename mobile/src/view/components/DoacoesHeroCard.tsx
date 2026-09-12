import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { authTheme as t } from '../../theme/authTheme';
import { GlobeIcon } from './HomeIcons';

type Props = {
  valorTotalDoado: number;
  ongsApoiadasCount: number;
  onDoarPress: () => void;
};

export function DoacoesHeroCard({ valorTotalDoado, ongsApoiadasCount, onDoarPress }: Props) {
  const valorFormatado = valorTotalDoado.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return (
    <LinearGradient
      colors={['#0AAEEE', '#05BCAA', '#006A60']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      {/* Rótulo e Valor Principal */}
      <View style={styles.topSection}>
        <Text style={styles.label}>Valor Total Doado</Text>
        <Text style={styles.totalValue}>{valorFormatado}</Text>
      </View>

      {/* Barra Inferior: ONGs Apoiadas + Botão Doar Agora */}
      <View style={styles.bottomRow}>
        <View style={styles.ongBadge}>
          <View style={styles.iconCircle}>
            <GlobeIcon size={20} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.ongLabel}>ONGs Apoiadas</Text>
            <Text style={styles.ongCount}>{ongsApoiadasCount}</Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [styles.donateButton, pressed && styles.pressed]}
          onPress={onDoarPress}
          accessibilityRole="button"
          accessibilityLabel="Doar Agora"
        >
          <Text style={styles.donateButtonText}>Doar Agora</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: t.radius.card,
    padding: t.spacing.lg,
    paddingTop: 26,
    paddingBottom: 22,
    shadowColor: t.colors.brand,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 6,
  },
  topSection: {
    marginBottom: 26,
  },
  label: {
    color: 'rgba(255, 255, 255, 0.92)',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  totalValue: {
    color: '#FFFFFF',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ongBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ongLabel: {
    color: 'rgba(255, 255, 255, 0.92)',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    fontWeight: '600',
  },
  ongCount: {
    color: '#FFFFFF',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 22,
  },
  donateButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: t.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  donateButtonText: {
    color: t.colors.tealDark,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
});
