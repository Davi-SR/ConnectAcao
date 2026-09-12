import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../navigation/types';
import { authTheme as t } from '../../theme/authTheme';
import { HomeIcon, PersonIcon, SearchIcon, DonationIcon } from './HomeIcons';

type TabName = 'Home' | 'Buscar' | 'Doacoes' | 'Perfil';
type Navigation = NativeStackNavigationProp<RootStackParamList, TabName>;

type Props = { activeTab: TabName; navigation: Navigation };

const tabs: Array<{ name: TabName; label: string }> = [
  { name: 'Home', label: 'Início' },
  { name: 'Buscar', label: 'Buscar' },
  { name: 'Doacoes', label: 'Doações' },
  { name: 'Perfil', label: 'Perfil' },
];

function TabIcon({ name, active }: { name: TabName; active: boolean }) {
  if (name === 'Home') return <HomeIcon active={active} />;
  if (name === 'Buscar') return <SearchIcon />;
  if (name === 'Doacoes') return <DonationIcon active={active} />;
  return <PersonIcon active={active} />;
}

export function BottomNavigation({ activeTab, navigation }: Props) {
  return (
    <View style={styles.bar} accessibilityRole="tablist">
      {tabs.map((tab) => {
        const active = tab.name === activeTab;
        return (
          <Pressable
            key={tab.name}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={tab.label}
            onPress={() => navigation.navigate(tab.name)}
            style={({ pressed }) => [styles.tab, active && styles.activeTab, pressed && styles.pressed]}
          >
            <TabIcon name={tab.name} active={active} />
            <Text style={[styles.label, active && styles.activeLabel]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { minHeight: 92, paddingHorizontal: t.spacing.md, paddingTop: t.spacing.sm, paddingBottom: t.spacing.sm, backgroundColor: t.colors.surface, borderTopLeftRadius: t.radius.card, borderTopRightRadius: t.radius.card, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', shadowColor: t.colors.brand, shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 8 },
  tab: { minWidth: 68, height: 64, paddingHorizontal: 10, borderRadius: t.radius.pill, alignItems: 'center', justifyContent: 'center', gap: 2 },
  activeTab: { minWidth: 84, backgroundColor: '#5EEAD4' },
  label: { color: t.colors.muted, fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: '600', lineHeight: 17 },
  activeLabel: { color: t.colors.tealDark, fontWeight: '700' },
  pressed: { opacity: 0.76 },
});
