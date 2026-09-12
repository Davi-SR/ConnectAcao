import { Pressable, StyleSheet, Text } from 'react-native';

import { Categoria } from '../../model/entities/Categoria';
import { authTheme as t } from '../../theme/authTheme';
import { CategoryIcon } from './HomeIcons';

function iconType(nome: string): 'all' | 'environment' | 'education' | 'health' | 'community' | 'default' {
  const value = nome.toLowerCase();
  if (value === 'todas' || value === 'todos') return 'all';
  if (value.includes('ambiente') || value.includes('animal') || value.includes('sustent')) return 'environment';
  if (value.includes('educ')) return 'education';
  if (value.includes('saúde') || value.includes('saude')) return 'health';
  if (value.includes('comun') || value.includes('social')) return 'community';
  return 'default';
}

export function CategoryChip({
  categoria,
  selected,
  onPress,
}: {
  categoria: { id: number | null; nome: string };
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipSelected,
        pressed && styles.chipPressed,
      ]}
    >
      <CategoryIcon type={iconType(categoria.nome)} />
      <Text numberOfLines={1} style={[styles.text, selected && styles.textSelected]}>
        {categoria.nome}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 56,
    paddingHorizontal: 20,
    marginRight: 12,
    borderRadius: t.radius.pill,
    borderWidth: 1.5,
    borderColor: t.colors.inputBorder,
    backgroundColor: t.colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  chipSelected: {
    backgroundColor: t.colors.activeSurface,
    borderColor: t.colors.teal,
  },
  chipPressed: {
    opacity: 0.78,
  },
  text: {
    color: t.colors.text,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 15,
    fontWeight: '600',
  },
  textSelected: {
    color: t.colors.tealDark,
  },
});
