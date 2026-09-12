import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { RootStackParamList } from '../../navigation/types';
import { authTheme as t } from '../../theme/authTheme';
import { HomeHeader } from '../components/HomeHeader';
import { AppIcon } from '../components/HomeIcons';
import {
  OngApoiadaItem,
  usePerfilViewModel,
} from '../../viewmodel/usePerfilViewModel';

type Props = NativeStackScreenProps<RootStackParamList, 'Perfil'>;

function OngApoiadaCard({
  ong,
  onPress,
}: {
  ong: OngApoiadaItem;
  onPress: () => void;
}) {
  const [imageFailed, setImageFailed] = React.useState(false);

  return (
    <Pressable
      style={({ pressed }) => [styles.ongCard, pressed && styles.cardPressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Ver perfil de ${ong.nome}`}
    >
      {/* Banner com Badge de Categoria */}
      <View style={styles.cardBannerContainer}>
        {ong.imagemUrl && !imageFailed ? (
          <Image
            source={{ uri: ong.imagemUrl }}
            onError={() => setImageFailed(true)}
            style={styles.cardBannerImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.cardBannerImage, styles.cardBannerFallback]}>
            <AppIcon name="volunteer_activism" size={36} color={t.colors.tealDark} />
          </View>
        )}

        <View style={styles.categoryPill}>
          <Text style={styles.categoryPillText}>{ong.categoriaNome}</Text>
        </View>
      </View>

      {/* Conteúdo do Card */}
      <View style={styles.cardBody}>
        <Text style={styles.cardOngName} numberOfLines={1}>
          {ong.nome}
        </Text>

        <View style={styles.progressHeaderRow}>
          <Text style={styles.progressLabel}>Progresso da meta</Text>
          <Text style={styles.progressPercentage}>{ong.progressoMeta}%</Text>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${ong.progressoMeta}%` }]} />
        </View>
      </View>
    </Pressable>
  );
}

export function PerfilScreen({ navigation }: Props) {
  const {
    user,
    primeiroNome,
    totalDoadoFormatado,
    vidasImpactadas,
    ongsApoiadas,
    doacoesRecentes,
    isLoading,
    error,
    recarregar,
  } = usePerfilViewModel();

  return (
    <SafeAreaView style={styles.safeArea}>
      <HomeHeader />

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={recarregar}
            tintColor={t.colors.tealDark}
            colors={[t.colors.tealDark]}
          />
        }
      >
        {/* Identidade do Usuário */}
        <View style={styles.identitySection}>
          {user?.fotoUrl ? (
            <Image
              source={{ uri: user.fotoUrl }}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarInitial}>
                {primeiroNome.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}

          <View style={styles.identityText}>
            <Text style={styles.greetingTitle}>Olá, {primeiroNome}</Text>
          </View>
        </View>

        {/* Linha de Cards de Impacto (KPIs) */}
        <View style={styles.kpiRow}>
          {/* Card 1: Vidas Impactadas */}
          <View style={styles.kpiWhiteCard}>
            <View style={styles.kpiTopRow}>
              <AppIcon name="favorite" size={18} color="#05BCAA" />
              <Text style={styles.kpiTealLabel}>Vidas{'\n'}Impactadas</Text>
            </View>
            <Text style={styles.kpiBigNumber}>{vidasImpactadas}</Text>
            <Text style={styles.kpiSubtitle}>Neste ano</Text>
          </View>

          {/* Card 2: Total Doado */}
          <View style={styles.kpiBlueCard}>
            <View style={styles.kpiTopRow}>
              <AppIcon name="payments" size={18} color="#05BCAA" />
              <Text style={styles.kpiWhiteLabel}>Total Doado</Text>
            </View>
            <Text style={styles.kpiBigNumberWhite}>{totalDoadoFormatado}</Text>
            <Text style={styles.kpiSubtitleWhite}>Histórico completo</Text>
          </View>
        </View>

        {/* Estado de Carregamento / Erro */}
        {isLoading && (
          <View style={styles.centerState}>
            <ActivityIndicator size="small" color={t.colors.tealDark} />
            <Text style={styles.loadingText}>Atualizando perfil...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable onPress={recarregar} style={styles.retryBtn}>
              <Text style={styles.retryText}>Tentar novamente</Text>
            </Pressable>
          </View>
        )}

        {/* Seção ONGs Apoiadas */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeading}>ONGs Apoiadas</Text>
          <Pressable
            onPress={() => navigation.navigate('Buscar')}
            accessibilityRole="button"
            accessibilityLabel="Ver todas as ONGs"
          >
            <Text style={styles.seeAllText}>Ver todas</Text>
          </Pressable>
        </View>

        {ongsApoiadas.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {ongsApoiadas.map((ong) => (
              <OngApoiadaCard
                key={ong.id}
                ong={ong}
                onPress={() => navigation.navigate('OngDetails', { ongId: ong.id })}
              />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyCardText}>
              Você ainda não fez doações para ONGs.
            </Text>
            <Pressable
              style={styles.exploreBtn}
              onPress={() => navigation.navigate('Buscar')}
            >
              <Text style={styles.exploreBtnText}>Explorar Causas</Text>
            </Pressable>
          </View>
        )}

        {/* Seção Histórico de Doações */}
        <View style={styles.historySectionHeader}>
          <Text style={styles.sectionHeading}>Histórico de Doações</Text>
        </View>

        {doacoesRecentes.length > 0 ? (
          <View style={styles.historyList}>
            {doacoesRecentes.map((d) => (
              <View key={d.id} style={styles.historyItemCard}>
                <View style={styles.historyLeft}>
                  <View style={styles.historyIconCircle}>
                    <AppIcon
                      name="volunteer_activism"
                      size={20}
                      color={t.colors.teal}
                    />
                  </View>
                  <View style={styles.historyInfo}>
                    <Text style={styles.historyOngName} numberOfLines={1}>
                      {d.ongNome}
                    </Text>
                    <Text style={styles.historyDate}>{d.dataFormatada}</Text>
                  </View>
                </View>

                <Text style={styles.historyValue}>{d.valorFormatado}</Text>
              </View>
            ))}

            {/* Botão Ver todo o histórico */}
            <Pressable
              style={({ pressed }) => [
                styles.seeAllHistoryBtn,
                pressed && styles.cardPressed,
              ]}
              onPress={() => navigation.navigate('Doacoes')}
              accessibilityRole="button"
              accessibilityLabel="Ver todo o histórico"
            >
              <Text style={styles.seeAllHistoryText}>Ver todo o histórico</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.emptyHistoryCard}>
            <AppIcon name="receipt_long" size={32} color={t.colors.muted} />
            <Text style={styles.emptyHistoryTitle}>Nenhuma doação registrada</Text>
            <Text style={styles.emptyHistorySubtitle}>
              Quando você fizer uma doação para uma campanha ou ONG, ela aparecerá aqui.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: t.colors.page,
  },
  body: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: t.spacing.md,
    paddingHorizontal: t.spacing.lg,
    paddingBottom: 90,
  },

  /* Identidade */
  identitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 18,
    gap: 16,
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: t.colors.teal,
  },
  avatarFallback: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: t.colors.activeSurface,
    borderWidth: 2,
    borderColor: t.colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: t.colors.tealDark,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 24,
    fontWeight: '800',
  },
  identityText: {
    flex: 1,
  },
  greetingTitle: {
    color: '#0A2540',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.4,
  },

  /* Linha de KPIs */
  kpiRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 26,
  },
  kpiWhiteCard: {
    flex: 1,
    backgroundColor: t.colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  kpiBlueCard: {
    flex: 1,
    backgroundColor: '#004380',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#004380',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },
  kpiTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  kpiTealLabel: {
    color: '#05BCAA',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 15,
  },
  kpiWhiteLabel: {
    color: '#FFFFFF',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    fontWeight: '700',
  },
  kpiBigNumber: {
    color: '#0A2540',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
  },
  kpiBigNumberWhite: {
    color: '#FFFFFF',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 34,
  },
  kpiSubtitle: {
    color: '#64748B',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  kpiSubtitleWhite: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },

  /* Seções */
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  historySectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 26,
    marginBottom: 14,
  },
  sectionHeading: {
    color: '#0A2540',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  seeAllText: {
    color: '#05BCAA',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    fontWeight: '700',
  },

  /* Carrossel de ONGs */
  horizontalScroll: {
    paddingRight: 8,
    gap: 14,
  },
  ongCard: {
    width: 200,
    backgroundColor: t.colors.surface,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardBannerContainer: {
    width: '100%',
    height: 110,
    backgroundColor: t.colors.subtle,
    position: 'relative',
  },
  cardBannerImage: {
    width: '100%',
    height: '100%',
  },
  cardBannerFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E6F4F1',
  },
  categoryPill: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryPillText: {
    color: t.colors.tealDark,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  cardBody: {
    padding: 12,
  },
  cardOngName: {
    color: '#0A2540',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 8,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    color: '#64748B',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    fontWeight: '500',
  },
  progressPercentage: {
    color: '#FB6407',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    fontWeight: '800',
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#E0F2FE',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FB6407',
    borderRadius: 3,
  },

  /* Histórico */
  historyList: {
    gap: 10,
  },
  historyItemCard: {
    backgroundColor: t.colors.surface,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  historyIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E6F8F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyInfo: {
    flex: 1,
  },
  historyOngName: {
    color: '#0A2540',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    fontWeight: '700',
  },
  historyDate: {
    color: '#64748B',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  historyValue: {
    color: '#05BCAA',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 16,
    fontWeight: '800',
  },
  seeAllHistoryBtn: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#05BCAA',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  seeAllHistoryText: {
    color: '#05BCAA',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    fontWeight: '700',
  },

  /* Empty States */
  emptyCard: {
    backgroundColor: t.colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    gap: 10,
  },
  emptyCardText: {
    color: t.colors.muted,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    textAlign: 'center',
  },
  exploreBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: t.radius.pill,
    backgroundColor: t.colors.activeSurface,
  },
  exploreBtnText: {
    color: t.colors.tealDark,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyHistoryCard: {
    backgroundColor: t.colors.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    gap: 8,
  },
  emptyHistoryTitle: {
    color: '#0A2540',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 15,
    fontWeight: '700',
  },
  emptyHistorySubtitle: {
    color: t.colors.muted,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },

  /* Status */
  centerState: {
    paddingVertical: 12,
    alignItems: 'center',
    gap: 6,
  },
  loadingText: {
    color: t.colors.muted,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
  },
  errorBox: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FFF0F0',
    alignItems: 'center',
    marginBottom: 12,
  },
  errorText: {
    color: t.colors.error,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 4,
  },
  retryBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: t.colors.error,
  },
  retryText: {
    color: '#FFFFFF',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    fontWeight: '700',
  },
  cardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
});
