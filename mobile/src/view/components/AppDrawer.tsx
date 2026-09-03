import React from 'react';
import { Animated, BackHandler, Image, Platform, Pressable, SafeAreaView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../navigation/types';
import { authTheme as t } from '../../theme/authTheme';
import { useAuth } from '../../viewmodel/AuthContext';
import { useDrawer } from '../../viewmodel/DrawerContext';
import { AppIcon } from './HomeIcons';

type Navigation = NativeStackNavigationProp<RootStackParamList>;
type MenuKey = 'Home' | 'Doacoes' | 'Favoritos' | 'Configuracoes';
type DrawerRoute = MenuKey;

const menuItems: Array<{ key: MenuKey; label: string; icon: string; route: DrawerRoute }> = [
  { key: 'Home', label: 'Início', icon: 'home', route: 'Home' },
  { key: 'Doacoes', label: 'Minhas Doações', icon: 'history', route: 'Doacoes' },
  { key: 'Favoritos', label: 'ONGs Favoritas', icon: 'favorite_border', route: 'Favoritos' },
  { key: 'Configuracoes', label: 'Configurações', icon: 'settings', route: 'Configuracoes' },
];

function initial(nome: string | undefined) {
  return nome?.trim().charAt(0).toUpperCase() || 'U';
}

export function AppDrawer() {
  const { isOpen, activeRoute, closeDrawer } = useDrawer();
  const { user, signOut } = useAuth();
  const navigation = useNavigation<Navigation>();
  const { width } = useWindowDimensions();
  const drawerWidth = Math.min(width * 0.74, 320);
  const translateX = React.useRef(new Animated.Value(-drawerWidth)).current;
  const [mounted, setMounted] = React.useState(isOpen);

  React.useEffect(() => {
    if (isOpen) {
      setMounted(true);
      translateX.setValue(-drawerWidth);
      Animated.timing(translateX, { toValue: 0, duration: 240, useNativeDriver: true }).start();
      return undefined;
    }
    if (!mounted) return undefined;
    Animated.timing(translateX, { toValue: -drawerWidth, duration: 210, useNativeDriver: true }).start(({ finished }) => {
      if (finished) setMounted(false);
    });
    return undefined;
  }, [drawerWidth, isOpen, mounted, translateX]);

  React.useEffect(() => {
    if (Platform.OS !== 'android' || !isOpen) return undefined;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => { closeDrawer(); return true; });
    return () => subscription.remove();
  }, [closeDrawer, isOpen]);

  if (!mounted) return null;

  const navigate = (route: DrawerRoute) => {
    closeDrawer();
    if (route === 'Home' && activeRoute === 'Home') return;
    navigation.navigate(route);
  };

  return <View style={styles.layer} pointerEvents="box-none">
    <Pressable accessibilityRole="button" accessibilityLabel="Fechar menu" onPress={closeDrawer} style={styles.overlay} />
    <Animated.View style={[styles.drawer, { width: drawerWidth, transform: [{ translateX }] }]}>
      <SafeAreaView style={styles.safeDrawer}>
        <View style={styles.profileHeader}>
          {user?.fotoUrl ? <Image source={{ uri: user.fotoUrl }} style={styles.avatar} /> : <View style={styles.avatar}><Text style={styles.avatarText}>{initial(user?.nome)}</Text></View>}
          <Pressable accessibilityRole="button" accessibilityLabel="Fechar menu" onPress={closeDrawer} style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}><AppIcon name="close" size={26} color={t.colors.text} /></Pressable>
          <Text numberOfLines={2} style={styles.userName}>{user?.nome?.trim() || 'Usuário ConectAção'}</Text>
          {user?.email && <Text numberOfLines={1} style={styles.userEmail}>{user.email}</Text>}
        </View>
        <View style={styles.menuArea}>
          {menuItems.slice(0, 3).map((item) => <DrawerItem key={item.key} item={item} active={activeRoute === item.route} onPress={() => navigate(item.route)} />)}
          <View style={styles.divider} />
          <DrawerItem item={menuItems[3]} active={activeRoute === menuItems[3].route} onPress={() => navigate(menuItems[3].route)} />
        </View>
        <View style={styles.logoutArea}><Pressable accessibilityRole="button" accessibilityLabel="Sair da conta" onPress={() => { closeDrawer(); void signOut(); }} style={({ pressed }) => [styles.logout, pressed && styles.pressed]}><AppIcon name="logout" size={25} color={t.colors.error} /><Text style={styles.logoutText}>Sair</Text></Pressable></View>
      </SafeAreaView>
    </Animated.View>
  </View>;
}

function DrawerItem({ item, active, onPress }: { item: (typeof menuItems)[number]; active: boolean; onPress: () => void }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={item.key === 'Home' ? 'Ir para início' : item.key === 'Doacoes' ? 'Ver minhas doações' : item.label} accessibilityState={{ selected: active }} onPress={onPress} style={({ pressed }) => [styles.item, active && styles.activeItem, pressed && styles.pressed]}>
    <AppIcon name={item.icon} size={27} color={active ? t.colors.brand : t.colors.text} />
    <Text style={[styles.itemText, active && styles.activeItemText]}>{item.label}</Text>
    {active && <View style={styles.activeIndicator} />}
  </Pressable>;
}

const styles = StyleSheet.create({
  layer: { ...StyleSheet.absoluteFill, zIndex: 20, elevation: 20 },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(25, 28, 29, 0.38)' },
  drawer: { position: 'absolute', top: 0, bottom: 0, left: 0, overflow: 'hidden', backgroundColor: t.colors.surface, shadowColor: t.colors.ink, shadowOffset: { width: 5, height: 0 }, shadowOpacity: 0.18, shadowRadius: 14, elevation: 12 },
  safeDrawer: { flex: 1, backgroundColor: t.colors.surface },
  profileHeader: { minHeight: 286, paddingHorizontal: t.spacing.lg, paddingTop: t.spacing.lg, backgroundColor: t.colors.subtle },
  avatar: { width: 96, height: 96, borderRadius: t.radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: t.colors.cyan ?? '#0AAEEE' },
  avatarText: { color: t.colors.brand, fontFamily: 'Plus Jakarta Sans', fontSize: 46, fontWeight: '500' },
  closeButton: { position: 'absolute', top: t.spacing.md, right: t.spacing.md, width: 46, height: 46, borderRadius: t.radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: t.colors.surface },
  userName: { marginTop: t.spacing.lg, color: t.colors.ink, fontFamily: 'Plus Jakarta Sans', fontSize: 24, fontWeight: '600', lineHeight: 31 },
  userEmail: { marginTop: 4, color: t.colors.text, fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: '500', lineHeight: 22 },
  menuArea: { paddingTop: t.spacing.sm },
  item: { minHeight: 64, paddingHorizontal: t.spacing.lg, flexDirection: 'row', alignItems: 'center', gap: t.spacing.md },
  activeItem: { backgroundColor: t.colors.activeSurface },
  itemText: { flex: 1, color: t.colors.ink, fontFamily: 'Plus Jakarta Sans', fontSize: 17, fontWeight: '500' },
  activeItemText: { color: t.colors.brand, fontWeight: '600' },
  activeIndicator: { width: 6, alignSelf: 'stretch', backgroundColor: t.colors.brand },
  divider: { height: 1, marginHorizontal: t.spacing.lg, marginVertical: t.spacing.sm, backgroundColor: t.colors.line },
  logoutArea: { flex: 1, justifyContent: 'flex-end', paddingHorizontal: t.spacing.lg, paddingBottom: t.spacing.lg },
  logout: { minHeight: 54, flexDirection: 'row', alignItems: 'center', gap: t.spacing.md },
  logoutText: { color: t.colors.error, fontFamily: 'Plus Jakarta Sans', fontSize: 17, fontWeight: '500' },
  pressed: { opacity: 0.72 },
});
