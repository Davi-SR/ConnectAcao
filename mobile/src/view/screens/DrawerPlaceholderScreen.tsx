import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { RootStackParamList } from '../../navigation/types';
import { authTheme as t } from '../../theme/authTheme';
import { AppIcon } from '../components/HomeIcons';

type Props = NativeStackScreenProps<RootStackParamList, 'Favoritos' | 'Configuracoes'>;

export function DrawerPlaceholderScreen({ navigation, route }: Props) {
  const title = route.name === 'Favoritos' ? 'ONGs Favoritas' : 'Configurações';
  return <SafeAreaView style={styles.safe}><View style={styles.header}><Pressable accessibilityRole="button" accessibilityLabel="Voltar" onPress={() => navigation.goBack()} style={styles.back}><AppIcon name="arrow_back" size={23} color={t.colors.brand} /></Pressable><Text style={styles.title}>{title}</Text><View style={styles.spacer} /></View><View style={styles.content}><Text style={styles.message}>Esta área será implementada em uma próxima etapa.</Text></View></SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: t.colors.page }, header: { height: 58, paddingHorizontal: t.spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: t.colors.surface, borderBottomWidth: 1, borderBottomColor: t.colors.line }, back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }, title: { color: t.colors.brand, fontFamily: 'Plus Jakarta Sans', fontSize: 16, fontWeight: '700' }, spacer: { width: 44 }, content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: t.spacing.xl }, message: { color: t.colors.muted, fontFamily: 'Plus Jakarta Sans', fontSize: 14, textAlign: 'center', lineHeight: 21 } });
