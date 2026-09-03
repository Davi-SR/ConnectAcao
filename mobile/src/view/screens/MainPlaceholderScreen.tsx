import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import { RootStackParamList } from '../../navigation/types';
import { authTheme as t } from '../../theme/authTheme';
import { MainTabScreen } from '../components/MainTabScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'Buscar' | 'Doacoes' | 'Perfil'>;

export function MainPlaceholderScreen({ navigation, route }: Props) {
  const labels = { Buscar: 'Buscar', Doacoes: 'Doações', Perfil: 'Perfil' } as const;
  return <MainTabScreen activeTab={route.name} navigation={navigation}><View style={styles.container}><Text style={styles.title}>{labels[route.name]}</Text></View></MainTabScreen>;
}

const styles = StyleSheet.create({ container: { flex: 1, alignItems: 'center', justifyContent: 'center' }, title: { color: t.colors.brand, fontFamily: 'Plus Jakarta Sans', fontSize: 22, fontWeight: '700' } });
