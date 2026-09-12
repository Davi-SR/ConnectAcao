import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { BellIcon, MenuIcon } from './HomeIcons';
import { authTheme as t } from '../../theme/authTheme';
import { useDrawer } from '../../viewmodel/DrawerContext';
import { Usuario } from '../../model/entities/Usuario';

type Props = {
  user: Usuario | null;
  primeiroNome: string;
};

export function DoacoesHeader({ user, primeiroNome }: Props) {
  const { openDrawer } = useDrawer();

  return (
    <View style={styles.header}>
      {/* Botão Menu / Drawer idêntico ao HomeHeader */}
      <Pressable
        style={styles.iconButton}
        onPress={openDrawer}
        accessibilityRole="button"
        accessibilityLabel="Abrir menu"
      >
        <MenuIcon />
      </Pressable>

      {/* Centro: Perfil e Saudação do Usuário */}
      <View style={styles.userCenter}>
        {user?.fotoUrl ? (
          <Image
            source={{ uri: user.fotoUrl }}
            style={styles.avatar}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarInitial}>
              {primeiroNome.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        <View style={styles.userText}>
          <Text style={styles.caption}>BEM-VINDO(A) DE VOLTA</Text>
          <Text style={styles.userName}>Olá, {primeiroNome} 👋</Text>
        </View>
      </View>

      {/* Botão de Notificações idêntico ao HomeHeader */}
      <Pressable
        style={styles.iconButton}
        onPress={() => undefined}
        accessibilityRole="button"
        accessibilityLabel="Notificações"
      >
        <BellIcon />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 76,
    paddingHorizontal: t.spacing.lg,
    backgroundColor: t.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: t.colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: t.colors.subtle,
  },
  avatarFallback: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: t.colors.activeSurface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: t.colors.tealDark,
  },
  avatarInitial: {
    color: t.colors.tealDark,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 16,
    fontWeight: '800',
  },
  userText: {
    justifyContent: 'center',
  },
  caption: {
    color: t.colors.muted,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  userName: {
    color: t.colors.ink,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 17,
    fontWeight: '800',
    marginTop: 1,
  },
});
