import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';

import { RootStackParamList } from '../../navigation/types';
import { authTheme as t } from '../../theme/authTheme';
import { BottomNavigation } from './BottomNavigation';

type TabName = 'Home' | 'Buscar' | 'Doacoes' | 'Perfil';
type Props = { activeTab: TabName; navigation: NativeStackNavigationProp<RootStackParamList, TabName>; children: React.ReactNode };

export function MainTabScreen({ activeTab, navigation, children }: Props) {
  return <View style={styles.container}><View style={styles.content}>{children}</View><BottomNavigation activeTab={activeTab} navigation={navigation} /></View>;
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: t.colors.page }, content: { flex: 1 } });
