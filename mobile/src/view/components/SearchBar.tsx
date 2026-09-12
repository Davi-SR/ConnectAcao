import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppIcon, SearchIcon } from './HomeIcons';
import { authTheme as t } from '../../theme/authTheme';

export function SearchBar({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (value: string) => void;
}) {
  return (
    <View style={styles.container}>
      <SearchIcon />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
        placeholder="Buscar ONGs, campanhas, locais..."
        placeholderTextColor={t.colors.muted}
        accessibilityLabel="Buscar ONGs, campanhas e locais"
        returnKeyType="search"
      />
      {value.length > 0 && (
        <Pressable
          onPress={() => onChangeText('')}
          accessibilityRole="button"
          accessibilityLabel="Limpar busca"
          style={styles.clearButton}
        >
          <AppIcon name="close" size={18} color={t.colors.muted} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: t.colors.surface,
    borderWidth: 1.5,
    borderColor: t.colors.inputBorder,
    borderRadius: t.radius.field,
    paddingLeft: 18,
    paddingRight: 14,
  },
  input: {
    flex: 1,
    minHeight: 56,
    marginLeft: 12,
    color: t.colors.ink,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 15,
    outlineStyle: 'none',
    outlineWidth: 0,
    outlineColor: 'transparent',
  } as any,
  clearButton: {
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

