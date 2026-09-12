import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { RootStackParamList } from '../../navigation/types';
import { authTheme as t } from '../../theme/authTheme';
import { CategoryCarousel } from '../components/CategoryCarousel';
import { CampaignHighlightCard } from '../components/CampaignHighlightCard';
import { HomeHeader } from '../components/HomeHeader';
import { OngRecommendedCard } from '../components/OngRecommendedCard';
import { SearchBar } from '../components/SearchBar';
import { useHomeViewModel } from '../../viewmodel/useHomeViewModel';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen(props: Props) {
  const {
    categorias,
    categoriasLoading,
    categoriasError,
    selectedCategoriaId,
    selectedCategoriaNome,
    selecionarCategoria,
    carregarCategorias,
    search,
    setSearch,
    campanhaDestaque,
    campanhaLoading,
    campanhaError,
    ongsRecomendadas,
    ongsLoading,
    ongsError,
    favoritoIds,
    toggleFavorito,
  } = useHomeViewModel();

  const tituloSecaoOngs = search.trim()
    ? `Resultados para "${search.trim()}"`
    : selectedCategoriaNome
    ? `ONGs em ${selectedCategoriaNome}`
    : 'ONGs Recomendadas';

  return (
    <SafeAreaView style={styles.safeArea}>
      <HomeHeader />
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <SearchBar value={search} onChangeText={setSearch} />

        <Text style={styles.sectionTitle}>Categorias</Text>
        {categoriasLoading ? (
          <View style={styles.categoryState}>
            <ActivityIndicator color={t.colors.tealDark} />
          </View>
        ) : categoriasError ? (
          <View style={styles.categoryState}>
            <Text style={styles.error}>{categoriasError}</Text>
            <Pressable onPress={() => void carregarCategorias()} accessibilityRole="button">
              <Text style={styles.retry}>Tentar novamente</Text>
            </Pressable>
          </View>
        ) : (
          <CategoryCarousel
            categorias={categorias}
            selectedCategoriaId={selectedCategoriaId}
            onSelect={selecionarCategoria}
          />
        )}

        <Text style={styles.sectionTitle}>Campanha em Destaque</Text>
        {campanhaLoading ? (
          <View style={styles.contentState}>
            <ActivityIndicator color={t.colors.tealDark} />
          </View>
        ) : campanhaError ? (
          <Text style={styles.error}>{campanhaError}</Text>
        ) : campanhaDestaque ? (
          <CampaignHighlightCard
            campanha={campanhaDestaque}
            onDonate={() =>
              props.navigation.navigate('OngDetails', { ongId: campanhaDestaque.ongId })
            }
          />
        ) : (
          <Text style={styles.empty}>Nenhuma campanha ativa no momento.</Text>
        )}

        <View style={styles.ongsHeading}>
          <Text style={styles.sectionTitle}>{tituloSecaoOngs}</Text>
          <Pressable
            onPress={() => props.navigation.navigate('Favoritos')}
            accessibilityRole="button"
          >
            <Text style={styles.seeAll}>Ver Favoritas</Text>
          </Pressable>
        </View>

        {ongsLoading ? (
          <View style={styles.contentState}>
            <ActivityIndicator color={t.colors.tealDark} />
          </View>
        ) : ongsError ? (
          <Text style={styles.error}>{ongsError}</Text>
        ) : ongsRecomendadas.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.empty}>
              {search.trim()
                ? `Nenhuma ONG encontrada para "${search.trim()}".`
                : selectedCategoriaNome
                ? `Nenhuma ONG encontrada na categoria "${selectedCategoriaNome}".`
                : 'Nenhuma ONG disponível no momento.'}
            </Text>
            {(selectedCategoriaId !== null || search.trim().length > 0) && (
              <Pressable
                onPress={() => {
                  selecionarCategoria(null);
                  setSearch('');
                }}
                style={styles.clearFilterButton}
              >
                <Text style={styles.clearFilterText}>Limpar filtros</Text>
              </Pressable>
            )}
          </View>
        ) : (
          ongsRecomendadas.map((ong) => (
            <View key={ong.id} style={styles.ongSpacing}>
              <OngRecommendedCard
                ong={ong}
                categorias={categorias}
                isFavorite={favoritoIds.includes(ong.id)}
                onFavoritePress={() => void toggleFavorito(ong.id)}
                onProfile={() => props.navigation.navigate('OngDetails', { ongId: ong.id })}
              />
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: t.colors.page },
  body: { flex: 1 },
  content: {
    paddingTop: t.spacing.lg,
    paddingHorizontal: t.spacing.lg,
    paddingBottom: t.spacing.xl,
  },
  sectionTitle: {
    color: t.colors.ink,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 20,
    fontWeight: '700',
    marginTop: t.spacing.xl,
    marginBottom: t.spacing.md,
  },
  categoryState: {
    minHeight: 56,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  contentState: {
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ongsHeading: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  seeAll: {
    marginBottom: t.spacing.md,
    color: t.colors.brand,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    fontWeight: '700',
  },
  ongSpacing: {
    marginBottom: t.spacing.lg,
  },
  emptyContainer: {
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 10,
  },
  empty: {
    color: t.colors.muted,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    textAlign: 'center',
  },
  clearFilterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: t.radius.pill,
    backgroundColor: t.colors.activeSurface,
  },
  clearFilterText: {
    color: t.colors.tealDark,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    fontWeight: '700',
  },
  error: {
    color: t.colors.muted,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
  },
  retry: {
    color: t.colors.brand,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 6,
  },
});

