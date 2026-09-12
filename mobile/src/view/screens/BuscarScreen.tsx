import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
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
import { SearchBar } from '../components/SearchBar';
import { CategoryCarousel } from '../components/CategoryCarousel';
import { OngRecommendedCard } from '../components/OngRecommendedCard';
import { AppIcon, CategoryIcon } from '../components/HomeIcons';
import {
  TipoFiltroBuscar,
  useBuscarViewModel,
} from '../../viewmodel/useBuscarViewModel';
import { CampanhaDestaque } from '../../model/entities/CampanhaDestaque';

type Props = NativeStackScreenProps<RootStackParamList, 'Buscar'>;

const SUGESTOES_POPULARES = [
  { label: '🐾 Animais', query: 'animal' },
  { label: '🍲 Combate à Fome', query: 'alimento' },
  { label: '🌳 Sustentabilidade', query: 'ambiente' },
  { label: '🎓 Apoio Escolar', query: 'educ' },
  { label: '🏥 Saúde & Cuidados', query: 'saúde' },
];

function CampanhaBuscarCard({
  campanha,
  onPress,
}: {
  campanha: CampanhaDestaque;
  onPress: () => void;
}) {
  const metaVal = campanha.meta || 0;
  const arrecadadoVal = campanha.valorArrecadado || 0;
  const percentual = Math.min(
    100,
    Math.max(0, Math.round(campanha.percentualMeta || 0)),
  );

  return (
    <Pressable
      style={({ pressed }) => [styles.campanhaCard, pressed && styles.cardPressed]}
      onPress={onPress}
      accessibilityRole="button"
    >
      <View style={styles.campanhaCardTop}>
        <View style={styles.campanhaInfo}>
          <Text style={styles.campanhaTitle} numberOfLines={2}>
            {campanha.titulo}
          </Text>
          {campanha.ongNome && (
            <Text style={styles.campanhaOngNome} numberOfLines={1}>
              Por {campanha.ongNome}
            </Text>
          )}
        </View>
        <View style={styles.percentBadge}>
          <Text style={styles.percentText}>{percentual}%</Text>
        </View>
      </View>

      {/* Barra de Progresso */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${percentual}%` }]} />
      </View>

      {/* Valores e Ação */}
      <View style={styles.campanhaFooter}>
        <Text style={styles.campanhaValor}>
          R${' '}
          {arrecadadoVal.toLocaleString('pt-BR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}{' '}
          de R${' '}
          {metaVal.toLocaleString('pt-BR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
        </Text>
        <View style={styles.doarMiniBtn}>
          <AppIcon name="volunteer_activism" size={14} color={t.colors.tealDark} />
          <Text style={styles.doarMiniText}>Apoiar</Text>
        </View>
      </View>
    </Pressable>
  );
}

export function BuscarScreen({ navigation }: Props) {
  const {
    search,
    setSearch,
    selectedCategoriaId,
    selectedCategoriaNome,
    selecionarCategoria,
    tipoFiltro,
    setTipoFiltro,
    categorias,
    ongsFiltradas,
    campanhasFiltradas,
    contagemPorCategoria,
    totalResultados,
    favoritoIds,
    toggleFavorito,
    isLoading,
    error,
    recarregar,
  } = useBuscarViewModel();

  const filtrosTipo: { tipo: TipoFiltroBuscar; label: string }[] = [
    { tipo: 'TUDO', label: 'Tudo' },
    { tipo: 'ONGS', label: 'ONGs' },
    { tipo: 'CAMPANHAS', label: 'Campanhas' },
    { tipo: 'FAVORITAS', label: 'Favoritas' },
  ];

  const emModoExploracao = !search.trim() && selectedCategoriaId === null && tipoFiltro === 'TUDO';

  return (
    <SafeAreaView style={styles.safeArea}>
      <HomeHeader />

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
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
        {/* Barra de Busca Unificada */}
        <View style={styles.searchSection}>
          <SearchBar value={search} onChangeText={setSearch} />
        </View>

        {/* Abas / Tipos de Filtro */}
        <View style={styles.tabsRow}>
          {filtrosTipo.map((f) => {
            const isActive = tipoFiltro === f.tipo;
            return (
              <Pressable
                key={f.tipo}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
                onPress={() => setTipoFiltro(f.tipo)}
                accessibilityRole="button"
              >
                <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Carrossel de Categorias */}
        <View style={styles.categorySection}>
          <CategoryCarousel
            categorias={categorias}
            selectedCategoriaId={selectedCategoriaId}
            onSelect={selecionarCategoria}
          />
        </View>

        {/* Estado de Carregamento */}
        {isLoading && (
          <View style={styles.centerState}>
            <ActivityIndicator size="small" color={t.colors.tealDark} />
            <Text style={styles.loadingText}>Atualizando resultados...</Text>
          </View>
        )}

        {/* Estado de Erro */}
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable onPress={recarregar} style={styles.retryBtn}>
              <Text style={styles.retryText}>Tentar novamente</Text>
            </Pressable>
          </View>
        )}

        {/* Modo Exploração: Tags Populares e Grade de Categorias */}
        {!isLoading && emModoExploracao && (
          <>
            {/* Sugestões Populares */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Sugestões Populares</Text>
            </View>
            <View style={styles.sugestoesRow}>
              {SUGESTOES_POPULARES.map((sug) => (
                <Pressable
                  key={sug.label}
                  style={styles.sugestaoChip}
                  onPress={() => setSearch(sug.query)}
                >
                  <Text style={styles.sugestaoChipText}>{sug.label}</Text>
                </Pressable>
              ))}
            </View>

            {/* Grid de Exploração por Categorias */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Explorar por Causa</Text>
            </View>
            <View style={styles.categoryGrid}>
              {categorias.map((cat) => {
                const count = contagemPorCategoria[cat.id] || 0;
                return (
                  <Pressable
                    key={cat.id}
                    style={styles.gridCard}
                    onPress={() => selecionarCategoria(cat.id)}
                  >
                    <View style={styles.gridIconCircle}>
                      <CategoryIcon
                        type={
                          cat.nome.toLowerCase().includes('educ')
                            ? 'education'
                            : cat.nome.toLowerCase().includes('saude') ||
                              cat.nome.toLowerCase().includes('saúde')
                            ? 'health'
                            : cat.nome.toLowerCase().includes('ambiente') ||
                              cat.nome.toLowerCase().includes('animal')
                            ? 'environment'
                            : cat.nome.toLowerCase().includes('comun') ||
                              cat.nome.toLowerCase().includes('social')
                            ? 'community'
                            : 'default'
                        }
                      />
                    </View>
                    <Text style={styles.gridTitle} numberOfLines={1}>
                      {cat.nome}
                    </Text>
                    <Text style={styles.gridCount}>
                      {count} {count === 1 ? 'ONG' : 'ONGs'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        )}

        {/* Resultados da Busca / Filtro */}
        {!isLoading && (
          <>
            {/* Cabeçalho de Resultados com Contador */}
            <View style={styles.resultsHeader}>
              <Text style={styles.sectionTitle}>
                {search.trim()
                  ? `Resultados para "${search.trim()}"`
                  : selectedCategoriaNome
                  ? `Causas em ${selectedCategoriaNome}`
                  : tipoFiltro === 'FAVORITAS'
                  ? 'Minhas ONGs Favoritas'
                  : 'Todas as Causas e ONGs'}
              </Text>
              <Text style={styles.resultsCountBadge}>
                {totalResultados} {totalResultados === 1 ? 'item' : 'itens'}
              </Text>
            </View>

            {/* Empty State */}
            {totalResultados === 0 ? (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconCircle}>
                  <AppIcon name="search_off" size={32} color={t.colors.muted} />
                </View>
                <Text style={styles.emptyTitle}>Nenhum resultado encontrado</Text>
                <Text style={styles.emptySubtitle}>
                  {search.trim()
                    ? `Não encontramos nenhuma ONG ou campanha para "${search.trim()}".`
                    : 'Tente selecionar outra categoria ou limpar os filtros aplicados.'}
                </Text>
                <Pressable
                  style={styles.clearAllBtn}
                  onPress={() => {
                    setSearch('');
                    selecionarCategoria(null);
                    setTipoFiltro('TUDO');
                  }}
                >
                  <Text style={styles.clearAllText}>Limpar todos os filtros</Text>
                </Pressable>
              </View>
            ) : (
              <>
                {/* Seção de Campanhas Encontradas */}
                {campanhasFiltradas.length > 0 && (
                  <View style={styles.groupSection}>
                    <Text style={styles.subGroupTitle}>Campanhas em Andamento</Text>
                    {campanhasFiltradas.map((campanha) => (
                      <CampanhaBuscarCard
                        key={campanha.id}
                        campanha={campanha}
                        onPress={() =>
                          navigation.navigate('OngDetails', { ongId: campanha.ongId })
                        }
                      />
                    ))}
                  </View>
                )}

                {/* Seção de ONGs Encontradas */}
                {ongsFiltradas.length > 0 && (
                  <View style={styles.groupSection}>
                    {campanhasFiltradas.length > 0 && (
                      <Text style={styles.subGroupTitle}>ONGs & Instituições</Text>
                    )}
                    {ongsFiltradas.map((ong) => (
                      <View key={ong.id} style={styles.ongSpacing}>
                        <OngRecommendedCard
                          ong={ong}
                          categorias={categorias}
                          isFavorite={favoritoIds.includes(ong.id)}
                          onFavoritePress={() => void toggleFavorito(ong.id)}
                          onProfile={() =>
                            navigation.navigate('OngDetails', { ongId: ong.id })
                          }
                        />
                      </View>
                    ))}
                  </View>
                )}
              </>
            )}
          </>
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
  searchSection: {
    marginBottom: 14,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: t.radius.pill,
    backgroundColor: t.colors.surface,
    borderWidth: 1.5,
    borderColor: t.colors.inputBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: t.colors.activeSurface,
    borderColor: t.colors.tealDark,
  },
  tabButtonText: {
    color: t.colors.text,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    fontWeight: '700',
  },
  tabButtonTextActive: {
    color: t.colors.tealDark,
  },
  categorySection: {
    marginBottom: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 12,
  },
  sectionTitle: {
    color: t.colors.ink,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 18,
    fontWeight: '800',
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 14,
  },
  resultsCountBadge: {
    color: t.colors.tealDark,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    fontWeight: '700',
    backgroundColor: t.colors.activeSurface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: t.radius.pill,
  },
  sugestoesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  sugestaoChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: t.radius.pill,
    backgroundColor: t.colors.surface,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  sugestaoChipText: {
    color: '#334155',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    fontWeight: '600',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 22,
  },
  gridCard: {
    width: '48%',
    backgroundColor: t.colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  gridIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: t.colors.activeSurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  gridTitle: {
    color: '#0A2540',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  gridCount: {
    color: t.colors.muted,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    fontWeight: '500',
  },
  groupSection: {
    marginBottom: 16,
  },
  subGroupTitle: {
    color: t.colors.muted,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 10,
    marginTop: 6,
  },
  ongSpacing: {
    marginBottom: t.spacing.lg,
  },

  /* Campanha Card */
  campanhaCard: {
    backgroundColor: t.colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  campanhaCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10,
  },
  campanhaInfo: {
    flex: 1,
  },
  campanhaTitle: {
    color: '#0A2540',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  campanhaOngNome: {
    color: t.colors.muted,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  percentBadge: {
    backgroundColor: t.colors.activeSurface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  percentText: {
    color: t.colors.tealDark,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    fontWeight: '800',
  },
  progressTrack: {
    height: 7,
    backgroundColor: '#E0F2FE',
    borderRadius: 3.5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FB6407',
    borderRadius: 3.5,
  },
  campanhaFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  campanhaValor: {
    color: '#64748B',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    fontWeight: '600',
  },
  doarMiniBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E6F8F6',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: t.radius.pill,
  },
  doarMiniText: {
    color: t.colors.tealDark,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    fontWeight: '700',
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },

  /* Empty State */
  emptyContainer: {
    backgroundColor: t.colors.surface,
    borderRadius: 18,
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    gap: 10,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    color: '#0A2540',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptySubtitle: {
    color: t.colors.muted,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 10,
  },
  clearAllBtn: {
    marginTop: 6,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: t.radius.pill,
    backgroundColor: t.colors.activeSurface,
  },
  clearAllText: {
    color: t.colors.tealDark,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    fontWeight: '700',
  },

  /* Status */
  centerState: {
    paddingVertical: 16,
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    color: t.colors.muted,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
  },
  errorBox: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#FFF0F0',
    alignItems: 'center',
    marginBottom: 14,
  },
  errorText: {
    color: t.colors.error,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 6,
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
});
