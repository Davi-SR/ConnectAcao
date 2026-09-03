import { StyleSheet, TextInput, View } from 'react-native';

import { SearchIcon } from './HomeIcons';
import { authTheme as t } from '../../theme/authTheme';

export function SearchBar({ value, onChangeText }: { value: string; onChangeText: (value: string) => void }) {
  return <View style={styles.container}>
    <SearchIcon />
    <TextInput value={value} onChangeText={onChangeText} style={styles.input} placeholder="Buscar ONGs, campanhas, locais..." placeholderTextColor={t.colors.muted} accessibilityLabel="Buscar ONGs, campanhas e locais" returnKeyType="search" />
  </View>;
}

const styles = StyleSheet.create({
  container: { minHeight: 64, flexDirection: 'row', alignItems: 'center', backgroundColor: t.colors.surface, borderWidth: 1.5, borderColor: t.colors.inputBorder, borderRadius: t.radius.field, paddingLeft: 20, paddingRight: 20 }, input: { flex: 1, minHeight: 60, marginLeft: 12, color: t.colors.ink, fontFamily: 'Plus Jakarta Sans', fontSize: 15, outlineStyle: 'solid', outlineWidth: 0, outlineColor: 'transparent' },
});
