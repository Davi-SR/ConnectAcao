import { StyleSheet, Text } from 'react-native';

import { authTheme as t } from '../../theme/authTheme';

function MaterialIcon({ name, size = 24, color = t.colors.tealDark }: { name: string; size?: number; color?: string }) {
  return <Text style={[styles.icon, { fontSize: size, lineHeight: size + 2, color }]} accessibilityElementsHidden>{name}</Text>;
}

export function AppIcon({ name, size = 22, color = t.colors.tealDark }: { name: string; size?: number; color?: string }) {
  return <MaterialIcon name={name} size={size} color={color} />;
}

export function MenuIcon() { return <MaterialIcon name="menu" size={25} />; }
export function BellIcon() { return <MaterialIcon name="notifications" size={26} />; }
export function SearchIcon() { return <MaterialIcon name="search" size={23} color={t.colors.text} />; }
export function FilterIcon() { return <MaterialIcon name="tune" size={22} />; }
export function HomeIcon({ active = false }: { active?: boolean }) { return <MaterialIcon name="home" size={24} color={active ? t.colors.brand : t.colors.muted} />; }
export function DonationIcon({ active = false }: { active?: boolean }) { return <MaterialIcon name="volunteer_activism" size={24} color={active ? t.colors.brand : t.colors.muted} />; }
export function PersonIcon({ active = false }: { active?: boolean }) { return <MaterialIcon name="person" size={24} color={active ? t.colors.brand : t.colors.muted} />; }

export function CategoryIcon({ type }: { type: 'environment' | 'education' | 'health' | 'community' | 'default' }) {
  const names = { environment: 'nature', education: 'school', health: 'health_and_safety', community: 'groups', default: 'category' } as const;
  return <MaterialIcon name={names[type]} size={21} color={type === 'environment' ? t.colors.tealDark : t.colors.text} />;
}

const styles = StyleSheet.create({ icon: { fontFamily: 'MaterialSymbols_500Medium', textAlign: 'center', includeFontPadding: false }, });
