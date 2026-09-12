import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  LayoutChangeEvent,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { authTheme as t } from '../../theme/authTheme';
import {
  ChartDataPoint,
  ModoFiltro,
  MONTH_NAMES_FULL,
  MONTH_NAMES_SHORT,
} from '../../viewmodel/useDoacoesViewModel';

type Props = {
  modoFiltro: ModoFiltro;
  onSelectModoFiltro: (m: ModoFiltro) => void;
  anoSelecionado: number;
  canRetrocederAno: boolean;
  canAvancarAno: boolean;
  onAvancarAno: () => void;
  onRetrocederAno: () => void;
  mesSelecionado: number;
  canRetrocederMes: boolean;
  canAvancarMes: boolean;
  onSelectMes: (mesIndex: number) => void;
  onAvancarMes: () => void;
  onRetrocederMes: () => void;
  semestreSelecionado: 1 | 2;
  onSelectSemestre: (semestre: 1 | 2) => void;
  chartData: ChartDataPoint[];
  kpis: {
    totalPeriodo: number;
    mediaPorDoacao: number;
    maiorDoacao: number;
    qtdDoacoesPeriodo: number;
  };
  selectedPointIndex: number | null;
  onSelectPoint: (index: number | null) => void;
};

const modos: Array<{ id: ModoFiltro; label: string }> = [
  { id: 'meses', label: 'Por Mês' },
  { id: 'semanas', label: 'Por Semana' },
  { id: 'anos', label: 'Por Ano' },
];

function createSmoothPath(
  points: Array<{ x: number; y: number }>,
  height: number
): { linePath: string; areaPath: string } {
  if (points.length === 0) return { linePath: '', areaPath: '' };
  if (points.length === 1) {
    return {
      linePath: `M ${points[0].x} ${points[0].y}`,
      areaPath: `M ${points[0].x} ${points[0].y} L ${points[0].x} ${height} Z`,
    };
  }

  let d = `M ${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 >= points.length ? i + 1 : i + 2];

    const cp1x = p1.x + (p2.x - p0.x) / 5.5;
    const cp1y = p1.y + (p2.y - p0.y) / 5.5;

    const cp2x = p2.x - (p3.x - p1.x) / 5.5;
    const cp2y = p2.y - (p3.y - p1.y) / 5.5;

    d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }

  const linePath = d;
  const areaPath = `${d} L ${points[points.length - 1].x.toFixed(1)},${height} L ${points[0].x.toFixed(1)},${height} Z`;

  return { linePath, areaPath };
}

export function DoacoesChartCard({
  modoFiltro,
  onSelectModoFiltro,
  anoSelecionado,
  canRetrocederAno,
  canAvancarAno,
  onAvancarAno,
  onRetrocederAno,
  mesSelecionado,
  canRetrocederMes,
  canAvancarMes,
  onSelectMes,
  onAvancarMes,
  onRetrocederMes,
  semestreSelecionado,
  onSelectSemestre,
  chartData,
  kpis,
  selectedPointIndex,
  onSelectPoint,
}: Props) {
  const [chartWidth, setChartWidth] = useState(300);
  const chartHeight = 190;

  // Animação de transição suave ao alternar filtros
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    translateYAnim.setValue(8);

    const useNative = Platform.OS !== 'web';
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 340,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: useNative,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 340,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: useNative,
      }),
    ]).start();
  }, [modoFiltro, anoSelecionado, mesSelecionado, semestreSelecionado]);

  const handleLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    if (width > 60) {
      setChartWidth(width);
    }
  };

  const rawMax = Math.max(...chartData.map((d) => d.value), 0);
  const maxValue = rawMax > 0 ? (rawMax <= 450 ? 450 : Math.ceil(rawMax / 100) * 100) : 450;

  const yTicks = [
    maxValue,
    Math.round(maxValue * 0.66),
    Math.round(maxValue * 0.33),
    0,
  ];

  const activeIndex =
    selectedPointIndex !== null && selectedPointIndex < chartData.length
      ? selectedPointIndex
      : chartData.reduce((maxIdx, curr, idx, arr) => (curr.value > arr[maxIdx].value ? idx : maxIdx), 0);

  const activePoint = chartData[activeIndex] || chartData[0];

  const paddingLeft = 14;
  const paddingRight = 14;
  const usableWidth = Math.max(chartWidth - paddingLeft - paddingRight, 10);
  const paddingTop = 20;
  const paddingBottom = 16;
  const usableHeight = chartHeight - paddingTop - paddingBottom;

  const points = chartData.map((d, i) => {
    const total = chartData.length;
    const x = total > 1 ? paddingLeft + (i / (total - 1)) * usableWidth : paddingLeft + usableWidth / 2;
    const ratio = maxValue > 0 ? Math.min(1, Math.max(0, d.value / maxValue)) : 0;
    const y = chartHeight - paddingBottom - ratio * usableHeight;
    return { x, y, data: d, index: i };
  });

  const { linePath, areaPath } = createSmoothPath(points, chartHeight - paddingBottom);
  const isWeb = Platform.OS === 'web';

  // Título contextual do gráfico
  const tituloContextual =
    modoFiltro === 'semanas'
      ? `Doações em ${MONTH_NAMES_FULL[mesSelecionado]} de ${anoSelecionado}`
      : modoFiltro === 'anos'
      ? `Evolução Anual de Doações`
      : `Doações por Mês em ${anoSelecionado}`;

  return (
    <View style={styles.card}>
      {/* 1. Barra de Modos de Visualização (Por Mês | Por Semana | Por Ano) */}
      <View style={styles.topControlRow}>
        <View style={styles.modeTabs}>
          {modos.map((item) => {
            const active = modoFiltro === item.id;
            return (
              <Pressable
                key={item.id}
                style={[styles.modeTab, active && styles.modeTabActive]}
                onPress={() => {
                  onSelectModoFiltro(item.id);
                  onSelectPoint(null);
                }}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Text style={[styles.modeTabText, active && styles.modeTabTextActive]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* 2. Navegador de Data Específico (Ano / Mês / Semestre) com Limites Temporais */}
      <View style={styles.dateNavigatorRow}>
        {modoFiltro === 'semanas' ? (
          <View style={styles.navBlock}>
            <Pressable
              style={({ pressed }) => [
                styles.navArrow,
                !canRetrocederMes && styles.navArrowDisabled,
                pressed && canRetrocederMes && styles.pressed,
              ]}
              onPress={onRetrocederMes}
              disabled={!canRetrocederMes}
              accessibilityLabel="Mês anterior"
            >
              <Text style={[styles.arrowText, !canRetrocederMes && styles.arrowTextDisabled]}>‹</Text>
            </Pressable>

            <View style={styles.navLabelWrapper}>
              <Text style={styles.navCurrentLabel}>
                {MONTH_NAMES_FULL[mesSelecionado]} de {anoSelecionado}
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.navArrow,
                !canAvancarMes && styles.navArrowDisabled,
                pressed && canAvancarMes && styles.pressed,
              ]}
              onPress={onAvancarMes}
              disabled={!canAvancarMes}
              accessibilityLabel="Próximo mês"
            >
              <Text style={[styles.arrowText, !canAvancarMes && styles.arrowTextDisabled]}>›</Text>
            </Pressable>
          </View>
        ) : modoFiltro === 'meses' ? (
          <View style={styles.navBlock}>
            <View style={styles.yearNavigator}>
              <Pressable
                style={({ pressed }) => [
                  styles.navArrow,
                  !canRetrocederAno && styles.navArrowDisabled,
                  pressed && canRetrocederAno && styles.pressed,
                ]}
                onPress={onRetrocederAno}
                disabled={!canRetrocederAno}
                accessibilityLabel="Ano anterior"
              >
                <Text style={[styles.arrowText, !canRetrocederAno && styles.arrowTextDisabled]}>‹</Text>
              </Pressable>

              <Text style={styles.navCurrentLabel}>Ano {anoSelecionado}</Text>

              <Pressable
                style={({ pressed }) => [
                  styles.navArrow,
                  !canAvancarAno && styles.navArrowDisabled,
                  pressed && canAvancarAno && styles.pressed,
                ]}
                onPress={onAvancarAno}
                disabled={!canAvancarAno}
                accessibilityLabel="Próximo ano"
              >
                <Text style={[styles.arrowText, !canAvancarAno && styles.arrowTextDisabled]}>›</Text>
              </Pressable>
            </View>

            <View style={styles.semesterTabs}>
              <Pressable
                style={[styles.semTab, semestreSelecionado === 1 && styles.semTabActive]}
                onPress={() => {
                  onSelectSemestre(1);
                  onSelectPoint(null);
                }}
              >
                <Text style={[styles.semTabText, semestreSelecionado === 1 && styles.semTabTextActive]}>
                  1º Sem (Jan-Jun)
                </Text>
              </Pressable>
              <Pressable
                style={[styles.semTab, semestreSelecionado === 2 && styles.semTabActive]}
                onPress={() => {
                  onSelectSemestre(2);
                  onSelectPoint(null);
                }}
              >
                <Text style={[styles.semTabText, semestreSelecionado === 2 && styles.semTabTextActive]}>
                  2º Sem (Jul-Dez)
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={styles.navBlock}>
            <Text style={styles.navCurrentLabel}>Histórico Anual a partir de 2026</Text>
          </View>
        )}
      </View>

      {/* 3. Título Contextual */}
      <Text style={styles.contextTitle}>{tituloContextual}</Text>

      {/* 4. Área do Gráfico Interativo com Linhas de Grade e Curva Suave */}
      <Animated.View
        style={[
          styles.chartContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: translateYAnim }],
          },
        ]}
      >
        {/* Linhas de Grade e Eixo Y */}
        <View style={styles.gridContainer}>
          {yTicks.map((tick, idx) => (
            <View key={idx} style={styles.gridRow}>
              <Text style={styles.yAxisLabel}>{tick}</Text>
              <View style={styles.gridLine} />
            </View>
          ))}
        </View>

        {/* Área de Plotagem da Curva e Pontos */}
        <View style={[styles.plotArea, { height: chartHeight }]} onLayout={handleLayout}>
          {isWeb && chartWidth > 50 && (
            <svg
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                overflow: 'visible',
                pointerEvents: 'none',
              }}
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="donationCurveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FB6407" stopOpacity="0.32" />
                  <stop offset="60%" stopColor="#FB6407" stopOpacity="0.10" />
                  <stop offset="100%" stopColor="#FB6407" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {areaPath ? <path d={areaPath} fill="url(#donationCurveGrad)" /> : null}

              {linePath ? (
                <path
                  d={linePath}
                  fill="none"
                  stroke="#FB6407"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : null}
            </svg>
          )}

          {!isWeb &&
            points.map((p, i) => {
              if (i === points.length - 1) return null;
              const nextP = points[i + 1];
              const dx = nextP.x - p.x;
              const dy = nextP.y - p.y;
              const length = Math.sqrt(dx * dx + dy * dy);
              const angle = Math.atan2(dy, dx) * (180 / Math.PI);

              return (
                <View
                  key={`segment-${i}`}
                  style={[
                    styles.nativeLineSegment,
                    {
                      left: p.x,
                      top: p.y,
                      width: length,
                      transform: [{ rotate: `${angle}deg` }, { translateY: -1.75 }],
                    },
                  ]}
                />
              );
            })}

          {/* Tooltip Flutuante Interativo */}
          {activePoint && points[activeIndex] && (
            <View
              style={[
                styles.tooltip,
                {
                  left: Math.max(4, Math.min(chartWidth - 120, points[activeIndex].x - 60)),
                  top: Math.max(0, points[activeIndex].y - 42),
                },
              ]}
              pointerEvents="none"
            >
              <Text style={styles.tooltipLabel}>
                {activePoint.fullLabel}: <Text style={styles.tooltipValue}>{activePoint.formattedValue}</Text>
              </Text>
            </View>
          )}

          {/* Pontos Clicáveis (Nós da Curva) */}
          {points.map((p) => {
            const isSelected = p.index === activeIndex;
            return (
              <Pressable
                key={`point-${p.index}`}
                style={[
                  styles.pointTouchTarget,
                  {
                    left: p.x - 20,
                    top: p.y - 20,
                  },
                ]}
                onPress={() => onSelectPoint(p.index)}
                accessibilityRole="button"
                accessibilityLabel={`${p.data.label}: ${p.data.formattedValue}`}
              >
                <View style={[styles.nodeOuter, isSelected && styles.nodeOuterSelected]}>
                  <View style={[styles.nodeInner, isSelected && styles.nodeInnerSelected]} />
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Eixo X com Rótulos de Período Espaçados */}
        <View style={styles.xAxisRow}>
          {chartData.map((d, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <Pressable
                key={idx}
                onPress={() => onSelectPoint(idx)}
                style={styles.xLabelTouch}
              >
                <Text style={[styles.xAxisText, isSelected && styles.xAxisTextSelected]}>
                  {d.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Animated.View>

      {/* 5. Barra Resumo de KPIs com Tipografia Elegante e Sem Sobreposição */}
      <View style={styles.kpiContainer}>
        <View style={styles.kpiBox}>
          <Text style={styles.kpiCaption}>Total no Período</Text>
          <Text style={styles.kpiNumber}>
            {kpis.totalPeriodo.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              maximumFractionDigits: 0,
            })}
          </Text>
        </View>

        <View style={[styles.kpiBox, styles.kpiBorder]}>
          <Text style={styles.kpiCaption}>Média / Doação</Text>
          <Text style={[styles.kpiNumber, { color: t.colors.tealDark }]}>
            {kpis.mediaPorDoacao.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              maximumFractionDigits: 0,
            })}
          </Text>
        </View>

        <View style={styles.kpiBox}>
          <Text style={styles.kpiCaption}>Maior Doação</Text>
          <Text style={[styles.kpiNumber, { color: t.colors.orange }]}>
            {kpis.maiorDoacao.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              maximumFractionDigits: 0,
            })}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: t.colors.surface,
    borderRadius: t.radius.card,
    padding: 22,
    shadowColor: t.colors.brand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 3,
    borderWidth: 1,
    borderColor: t.colors.line,
  },
  topControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  modeTabs: {
    flexDirection: 'row',
    backgroundColor: t.colors.subtle,
    borderRadius: t.radius.pill,
    padding: 3,
    gap: 2,
    flex: 1,
    justifyContent: 'space-between',
  },
  modeTab: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: t.radius.pill,
  },
  modeTabActive: {
    backgroundColor: t.colors.brand,
    shadowColor: t.colors.brand,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 4,
    elevation: 2,
  },
  modeTabText: {
    color: t.colors.muted,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    fontWeight: '700',
  },
  modeTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  dateNavigatorRow: {
    marginBottom: 14,
    backgroundColor: t.colors.page,
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: t.colors.line,
  },
  navBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  yearNavigator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  navArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: t.colors.surface,
    borderWidth: 1,
    borderColor: t.colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navArrowDisabled: {
    opacity: 0.35,
    backgroundColor: t.colors.subtle,
  },
  arrowText: {
    color: t.colors.ink,
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 18,
  },
  arrowTextDisabled: {
    color: t.colors.muted,
  },
  navLabelWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  navCurrentLabel: {
    color: t.colors.ink,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12.5,
    fontWeight: '700',
  },
  semesterTabs: {
    flexDirection: 'row',
    backgroundColor: t.colors.surface,
    borderRadius: t.radius.pill,
    padding: 2,
    gap: 2,
    borderWidth: 1,
    borderColor: t.colors.line,
  },
  semTab: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: t.radius.pill,
  },
  semTabActive: {
    backgroundColor: t.colors.tealDark,
  },
  semTabText: {
    color: t.colors.muted,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 10,
    fontWeight: '700',
  },
  semTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  contextTitle: {
    color: t.colors.brand,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 16,
  },
  chartContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  gridContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'space-between',
    pointerEvents: 'none',
    paddingBottom: 16,
  },
  gridRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  yAxisLabel: {
    width: 28,
    textAlign: 'right',
    color: '#94A3B8',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    fontWeight: '600',
  },
  gridLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  plotArea: {
    marginLeft: 38,
    position: 'relative',
  },
  nativeLineSegment: {
    position: 'absolute',
    height: 3.5,
    backgroundColor: t.colors.orange,
    borderRadius: 2,
    transformOrigin: 'left center',
  },
  pointTouchTarget: {
    position: 'absolute',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  nodeOuter: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: t.colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: t.colors.orange,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  nodeOuterSelected: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    transform: [{ scale: 1.25 }],
    backgroundColor: '#FFFFFF',
    shadowOpacity: 0.5,
  },
  nodeInner: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: t.colors.orange,
  },
  nodeInnerSelected: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: t.colors.orange,
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: t.colors.ink,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 30,
  },
  tooltipLabel: {
    color: '#FFFFFF',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    fontWeight: '600',
  },
  tooltipValue: {
    color: t.colors.orange,
    fontWeight: '800',
  },
  xAxisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 38,
    marginTop: 8,
  },
  xLabelTouch: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  xAxisText: {
    color: '#64748B',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    fontWeight: '600',
  },
  xAxisTextSelected: {
    color: t.colors.orange,
    fontWeight: '800',
  },
  kpiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: t.colors.page,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 6,
    marginTop: 8,
    borderWidth: 1,
    borderColor: t.colors.line,
  },
  kpiBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  kpiBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: t.colors.line,
  },
  kpiCaption: {
    color: '#64748B',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    textAlign: 'center',
    lineHeight: 14,
    marginBottom: 4,
  },
  kpiNumber: {
    color: t.colors.ink,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});
