import React from 'react';
import { PanResponder, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { Categoria } from '../../model/entities/Categoria';
import { authTheme as t } from '../../theme/authTheme';
import { CategoryChip } from './CategoryChip';

type Props = {
  categorias: Categoria[];
  selectedCategoriaId: number | null;
  onSelect: (id: number) => void;
};

type WheelViewProps = React.ComponentProps<typeof View> & {
  onWheel?: (event: { deltaX?: number; deltaY?: number; preventDefault?: () => void }) => void;
};

const WheelView = View as React.ComponentType<WheelViewProps>;

export function CategoryCarousel({ categorias, selectedCategoriaId, onSelect }: Props) {
  const scrollRef = React.useRef<ScrollView>(null);
  const offsetX = React.useRef(0);
  const contentWidth = React.useRef(0);
  const viewportWidth = React.useRef(0);
  const dragStartOffset = React.useRef(0);

  const scrollToOffset = React.useCallback((nextOffset: number) => {
    const maxOffset = Math.max(0, contentWidth.current - viewportWidth.current);
    const boundedOffset = Math.max(0, Math.min(nextOffset, maxOffset));
    offsetX.current = boundedOffset;
    scrollRef.current?.scrollTo({ x: boundedOffset, animated: false });
  }, []);

  const panResponder = React.useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_event, gestureState) => Platform.OS === 'web'
      && Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
      && Math.abs(gestureState.dx) > 5,
    onPanResponderGrant: () => {
      dragStartOffset.current = offsetX.current;
    },
    onPanResponderMove: (_event, gestureState) => {
      scrollToOffset(dragStartOffset.current - gestureState.dx);
    },
  }), [scrollToOffset]);

  return (
    <WheelView
      style={styles.wrapper}
      onLayout={(event) => { viewportWidth.current = event.nativeEvent.layout.width; }}
      onWheel={(event) => {
        if (Platform.OS !== 'web') return;
        const delta = event.deltaX || event.deltaY || 0;
        if (delta === 0) return;
        event.preventDefault?.();
        scrollToOffset(offsetX.current + delta);
      }}
      {...panResponder.panHandlers}
    >
      <ScrollView
        ref={scrollRef}
        horizontal
        scrollEnabled={Platform.OS !== 'web'}
        nestedScrollEnabled
        directionalLockEnabled
        alwaysBounceHorizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroller}
        contentContainerStyle={styles.content}
        onContentSizeChange={(width) => { contentWidth.current = width; }}
        onScroll={(event) => { offsetX.current = event.nativeEvent.contentOffset.x; }}
        scrollEventThrottle={16}
      >
        {categorias.map((categoria) => (
          <CategoryChip
            key={categoria.id}
            categoria={categoria}
            selected={categoria.id === selectedCategoriaId}
            onPress={() => onSelect(categoria.id)}
          />
        ))}
      </ScrollView>
    </WheelView>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: '100%' },
  scroller: { flexGrow: 0 },
  content: { paddingRight: t.spacing.lg },
});
