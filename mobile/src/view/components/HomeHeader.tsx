import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { BellIcon, MenuIcon } from './HomeIcons';
import { authTheme as t } from '../../theme/authTheme';
import { useDrawer } from '../../viewmodel/DrawerContext';

export function HomeHeader() {
  const { openDrawer } = useDrawer();
  return <View style={styles.header}>
    <Pressable style={styles.iconButton} onPress={openDrawer} accessibilityRole="button" accessibilityLabel="Abrir menu"><MenuIcon /></Pressable>
    <View style={styles.brandMark} accessibilityLabel="Logo ConectAção">
      <View style={styles.logoCrop}><Image source={require('../../Assets/Logo.jpg')} style={styles.logo} resizeMode="contain" /></View>
      <Text style={styles.wordmark}><Text style={styles.wordmarkBrand}>Conect</Text><Text style={styles.wordmarkTeal}>Ação</Text></Text>
    </View>
    <Pressable style={styles.iconButton} onPress={() => undefined} accessibilityRole="button" accessibilityLabel="Notificações"><BellIcon /></Pressable>
  </View>;
}

const styles = StyleSheet.create({
  header: { height: 76, paddingHorizontal: t.spacing.lg, backgroundColor: t.colors.surface, borderBottomWidth: 1, borderBottomColor: t.colors.line, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }, brandMark: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1 }, logoCrop: { width: 34, height: 34, overflow: 'hidden', marginRight: 5 }, logo: { width: 44, height: 44, position: 'absolute', top: -4, left: -5 }, wordmark: { fontFamily: 'Plus Jakarta Sans', fontSize: 23, fontWeight: '800', letterSpacing: -0.8 }, wordmarkBrand: { color: t.colors.tealDark }, wordmarkTeal: { color: t.colors.tealDark },
});
