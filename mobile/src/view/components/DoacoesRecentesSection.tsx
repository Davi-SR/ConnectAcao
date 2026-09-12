import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { authTheme as t } from '../../theme/authTheme';
import { DoacaoRecenteItem } from '../../viewmodel/useDoacoesViewModel';
import { AppIcon, DonationIcon } from './HomeIcons';

type Props = {
  doacoes: DoacaoRecenteItem[];
  onVerHistorico?: () => void;
  onExplorarCampanhas?: () => void;
};

export function DoacoesRecentesSection({
  doacoes,
  onVerHistorico,
  onExplorarCampanhas,
}: Props) {
  const [imageErrors, setImageErrors] = React.useState<Record<number, boolean>>({});

  const handleImageError = (id: number) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <View style={styles.section}>
      {/* Cabeçalho da Seção */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Doações Recentes</Text>
        {doacoes.length > 0 && (
          <Pressable
            onPress={onVerHistorico}
            accessibilityRole="button"
            style={({ pressed }) => [styles.seeAllButton, pressed && styles.pressed]}
          >
            <Text style={styles.seeAllText}>VER HISTÓRICO</Text>
          </Pressable>
        )}
      </View>

      {/* Lista de Doações Recentes */}
      {doacoes.length === 0 ? (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconCircle}>
            <AppIcon name="volunteer_activism" size={32} color={t.colors.tealDark} />
          </View>
          <Text style={styles.emptyTitle}>Nenhuma doação no histórico</Text>
          <Text style={styles.emptyMessage}>
            As doações que você realizar para campanhas sociais ficarão salvas e listadas aqui.
          </Text>
          {onExplorarCampanhas && (
            <Pressable
              style={({ pressed }) => [styles.exploreButton, pressed && styles.pressed]}
              onPress={onExplorarCampanhas}
              accessibilityRole="button"
            >
              <Text style={styles.exploreButtonText}>Explorar Causas</Text>
            </Pressable>
          )}
        </View>
      ) : (
        <View style={styles.list}>
          {doacoes.map((item) => {
            const hasValidImage = Boolean(item.imagemUrl && !imageErrors[item.id]);

            return (
              <View key={item.id} style={styles.donationCard}>
                {/* Ícone / Imagem da ONG */}
                <View style={styles.imageWrapper}>
                  {hasValidImage && item.imagemUrl ? (
                    <Image
                      source={{ uri: item.imagemUrl }}
                      onError={() => handleImageError(item.id)}
                      style={styles.ongImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.fallbackIcon}>
                      <DonationIcon active />
                    </View>
                  )}
                </View>

                {/* Informações da Doação: Título e Data */}
                <View style={styles.infoWrapper}>
                  <Text numberOfLines={1} style={styles.donationTitle}>
                    {item.titulo}
                  </Text>
                  <Text style={styles.donationDate}>{item.dataFormatada}</Text>
                </View>

                {/* Valor e Badge de Status */}
                <View style={styles.valueWrapper}>
                  <Text style={styles.donationValue}>{item.valorFormatado}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      item.statusColor === 'concluida' && styles.statusBadgeSuccess,
                      item.statusColor === 'pendente' && styles.statusBadgePending,
                      item.statusColor === 'cancelada' && styles.statusBadgeError,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        item.statusColor === 'concluida' && styles.statusTextSuccess,
                        item.statusColor === 'pendente' && styles.statusTextPending,
                        item.statusColor === 'cancelada' && styles.statusTextError,
                      ]}
                    >
                      {item.statusLabel}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}

          {/* Botão de Download de Relatório (como no design) */}
          <Pressable
            style={({ pressed }) => [styles.reportButton, pressed && styles.pressed]}
            onPress={() => undefined}
            accessibilityRole="button"
            accessibilityLabel="Baixar Relatório Anual"
          >
            <AppIcon name="download" size={18} color={t.colors.brand} />
            <Text style={styles.reportButtonText}>Baixar Relatório Anual</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 4,
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    color: t.colors.brand,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 18,
    fontWeight: '700',
  },
  seeAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  seeAllText: {
    color: t.colors.cyan,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  list: {
    gap: 12,
  },
  donationCard: {
    backgroundColor: t.colors.surface,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: t.colors.brand,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: t.colors.line,
  },
  imageWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: t.colors.subtle,
    borderWidth: 1,
    borderColor: t.colors.line,
    marginRight: 14,
  },
  ongImage: {
    width: '100%',
    height: '100%',
  },
  fallbackIcon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: t.colors.activeSurface,
  },
  infoWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  donationTitle: {
    color: t.colors.ink,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  donationDate: {
    color: t.colors.muted,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12.5,
    fontWeight: '500',
    marginTop: 3,
  },
  valueWrapper: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 10,
  },
  donationValue: {
    color: t.colors.ink,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 15,
    fontWeight: '800',
  },
  statusBadge: {
    marginTop: 4,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: t.radius.pill,
  },
  statusBadgeSuccess: {
    backgroundColor: '#E6F8F6',
  },
  statusBadgePending: {
    backgroundColor: '#FFF0E5',
  },
  statusBadgeError: {
    backgroundColor: '#FFF0F0',
  },
  statusBadgeText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  statusTextSuccess: {
    color: t.colors.tealDark,
  },
  statusTextPending: {
    color: t.colors.orange,
  },
  statusTextError: {
    color: t.colors.error,
  },
  reportButton: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: t.colors.surface,
    borderRadius: t.radius.card,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: t.colors.line,
    shadowColor: t.colors.brand,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  reportButtonText: {
    color: t.colors.brand,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyCard: {
    backgroundColor: t.colors.surface,
    borderRadius: t.radius.card,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: t.colors.line,
    shadowColor: t.colors.brand,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: t.colors.activeSurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    color: t.colors.ink,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  emptyMessage: {
    color: t.colors.muted,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginBottom: 16,
  },
  exploreButton: {
    backgroundColor: t.colors.tealDark,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: t.radius.button,
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.75,
  },
});
