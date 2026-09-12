import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { Categoria } from '../../model/entities/Categoria';
import { Ong } from '../../model/entities/Ong';
import { authTheme as t } from '../../theme/authTheme';
import { AppIcon, HeartIcon, PersonIcon } from './HomeIcons';

type Props = {
  ong: Ong;
  categorias: Categoria[];
  onProfile: () => void;
  isFavorite?: boolean;
  onFavoritePress?: () => void;
};

export function OngRecommendedCard({
                                     ong,
                                     categorias,
                                     onProfile,
                                     isFavorite = false,
                                     onFavoritePress,
                                   }: Props) {
  const [imageFailed, setImageFailed] = React.useState(false);

  const categoria =
      categorias.find((item) => item.id === ong.categoriaId)?.nome ??
      'Causa social';

  return (
      <View style={styles.card}>
        {ong.imagemUrl && !imageFailed ? (
            <Image
                source={{ uri: ong.imagemUrl }}
                onError={() => setImageFailed(true)}
                style={styles.image}
                resizeMode="cover"
            />
        ) : (
            <View style={[styles.image, styles.fallback]}>
              <PersonIcon />
            </View>
        )}

        <View style={styles.body}>
          <View style={styles.nameRow}>
            <Text numberOfLines={1} style={styles.name}>
              {ong.nome}
            </Text>

            <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                  isFavorite
                      ? 'Remover dos favoritos'
                      : 'Adicionar aos favoritos'
                }
                onPress={onFavoritePress}
                disabled={!onFavoritePress}
                style={({ pressed }) => [
                  styles.favoriteButton,
                  pressed && onFavoritePress && styles.pressed,
                ]}
            >
              <HeartIcon
                  filled={isFavorite}
                  size={28}
                  color={isFavorite ? t.colors.heart : t.colors.inputBorder}
              />
            </Pressable>
          </View>

          <Text style={styles.category}>{categoria}</Text>

          <Text numberOfLines={3} style={styles.description}>
            {ong.descricao}
          </Text>

          <Pressable
              accessibilityRole="button"
              onPress={onProfile}
              style={({ pressed }) => [
                styles.profileButton,
                pressed && styles.pressed,
              ]}
          >
            <Text style={styles.profileText}>Ver Perfil</Text>
          </Pressable>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderRadius: t.radius.card,
    backgroundColor: t.colors.surface,
    shadowColor: t.colors.brand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },

  image: {
    width: '100%',
    height: 190,
    backgroundColor: t.colors.subtle,
  },

  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  body: {
    padding: t.spacing.lg,
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  name: {
    flex: 1,
    color: t.colors.ink,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 18,
    fontWeight: '800',
  },

  favoriteButton: {
    marginLeft: t.spacing.sm,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  category: {
    alignSelf: 'flex-start',
    marginTop: t.spacing.sm,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    color: t.colors.tealDark,
    backgroundColor: t.colors.activeSurface,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    fontWeight: '700',
  },

  description: {
    minHeight: 62,
    marginTop: t.spacing.md,
    color: t.colors.text,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
  },

  profileButton: {
    minHeight: 48,
    marginTop: t.spacing.md,
    borderRadius: t.radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: t.colors.subtle,
  },

  profileText: {
    color: t.colors.brand,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 16,
    fontWeight: '800',
  },

  pressed: {
    opacity: 0.78,
  },
});