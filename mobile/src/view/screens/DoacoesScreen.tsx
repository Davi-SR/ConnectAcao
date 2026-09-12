import React from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../navigation/types';
import { authTheme as t } from '../../theme/authTheme';
import { useDoacoesViewModel } from '../../viewmodel/useDoacoesViewModel';
import { DoacoesHeader } from '../components/DoacoesHeader';
import { DoacoesHeroCard } from '../components/DoacoesHeroCard';
import { DoacoesChartCard } from '../components/DoacoesChartCard';
import { DoacoesRecentesSection } from '../components/DoacoesRecentesSection';
import { AppIcon } from '../components/HomeIcons';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

export function DoacoesScreen() {
  const navigation = useNavigation<Navigation>();
  const {
    user,
    primeiroNome,
    doacoesRecentes,
    valorTotalDoado,
    ongsApoiadasCount,
    modoFiltro,
    setModoFiltro,
    anoSelecionado,
    canRetrocederAno,
    canAvancarAno,
    avancarAno,
    retrocederAno,
    mesSelecionado,
    canRetrocederMes,
    canAvancarMes,
    setMesSelecionado,
    avancarMes,
    retrocederMes,
    semestreSelecionado,
    setSemestreSelecionado,
    selectedPointIndex,
    setSelectedPointIndex,
    chartData,
    kpis,
    isLoading,
    error,
    recarregar,
  } = useDoacoesViewModel();

  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await recarregar();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 1. Cabeçalho Oficial do Usuário */}
      <DoacoesHeader user={user} primeiroNome={primeiroNome} />

      {/* 2. Conteúdo Scrollável com Pull to Refresh */}
      {isLoading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={t.colors.tealDark} />
          <Text style={styles.loadingText}>Carregando suas doações...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <AppIcon name="error_outline" size={36} color={t.colors.error} />
          <Text style={styles.errorText}>{error}</Text>
          <Pressable
            style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]}
            onPress={() => void recarregar()}
            accessibilityRole="button"
          >
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => void handleRefresh()}
              colors={[t.colors.tealDark, t.colors.brand]}
              tintColor={t.colors.tealDark}
            />
          }
        >
          {/* Card Hero: Valor Total Doado e ONGs Apoiadas */}
          <DoacoesHeroCard
            valorTotalDoado={valorTotalDoado}
            ongsApoiadasCount={ongsApoiadasCount}
            onDoarPress={() => navigation.navigate('Home')}
          />

          {/* Gráfico Visual: Doações com Filtros Temporais Específicos e KPIs */}
          <DoacoesChartCard
            modoFiltro={modoFiltro}
            onSelectModoFiltro={setModoFiltro}
            anoSelecionado={anoSelecionado}
            canRetrocederAno={canRetrocederAno}
            canAvancarAno={canAvancarAno}
            onAvancarAno={avancarAno}
            onRetrocederAno={retrocederAno}
            mesSelecionado={mesSelecionado}
            canRetrocederMes={canRetrocederMes}
            canAvancarMes={canAvancarMes}
            onSelectMes={setMesSelecionado}
            onAvancarMes={avancarMes}
            onRetrocederMes={retrocederMes}
            semestreSelecionado={semestreSelecionado}
            onSelectSemestre={setSemestreSelecionado}
            chartData={chartData}
            kpis={kpis}
            selectedPointIndex={selectedPointIndex}
            onSelectPoint={setSelectedPointIndex}
          />

          {/* Seção de Doações Recentes salvas no banco de dados */}
          <DoacoesRecentesSection
            doacoes={doacoesRecentes}
            onVerHistorico={() => navigation.navigate('Home')}
            onExplorarCampanhas={() => navigation.navigate('Home')}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: t.colors.page,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: t.spacing.lg,
    paddingBottom: 40,
    gap: t.spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: t.spacing.xl,
  },
  loadingText: {
    color: t.colors.muted,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: t.spacing.xl,
  },
  errorText: {
    color: t.colors.ink,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 8,
    backgroundColor: t.colors.tealDark,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: t.radius.button,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.8,
  },
});
