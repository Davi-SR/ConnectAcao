import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, StyleSheet, Text, View } from 'react-native';

import { authTheme as t } from '../../theme/authTheme';

function MaterialIcon({ name, size = 24, color = t.colors.tealDark }: { name: string; size?: number; color?: string }) {
  return (
    <Text
      style={[
        styles.icon,
        {
          fontSize: size,
          lineHeight: size + 2,
          color,
        },
      ]}
      accessibilityElementsHidden
    >
      {name}
    </Text>
  );
}

export function HeartIcon({ filled = false, size = 26, color }: { filled?: boolean; size?: number; color?: string }) {
  const iconColor = color ?? (filled ? t.colors.heart : t.colors.inputBorder);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const burstAnim = useRef(new Animated.Value(0)).current;
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const useNative = Platform.OS !== 'web';

    if (filled) {
      burstAnim.setValue(0);
      scaleAnim.setValue(0.7);

      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3.5,
          tension: 130,
          useNativeDriver: useNative,
        }),
        Animated.timing(burstAnim, {
          toValue: 1,
          duration: 480,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: useNative,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.85);
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 100,
        useNativeDriver: useNative,
      }).start();
    }
  }, [filled]);

  // Burst Ring interpolations
  const ringScale = burstAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1.8],
  });
  const ringOpacity = burstAnim.interpolate({
    inputRange: [0, 0.3, 0.8, 1],
    outputRange: [0.9, 0.7, 0.2, 0],
  });

  // Sparkles distance, opacity and scale
  const dist = size * 0.7;
  const diag = dist * 0.707;
  const pOpacity = burstAnim.interpolate({
    inputRange: [0, 0.2, 0.7, 1],
    outputRange: [0, 1, 0.8, 0],
  });
  const pScale = burstAnim.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0.3, 1.2, 0],
  });

  const particles = [
    { x: 0, y: -dist, color: t.colors.heart, size: 4 },
    { x: diag, y: -diag, color: t.colors.orange, size: 3.5 },
    { x: dist, y: 0, color: t.colors.teal, size: 4 },
    { x: diag, y: diag, color: t.colors.heart, size: 3.5 },
    { x: -diag, y: diag, color: t.colors.brand, size: 3.5 },
    { x: -dist, y: 0, color: t.colors.teal, size: 4 },
    { x: -diag, y: -diag, color: t.colors.orange, size: 3.5 },
  ];

  return (
    <View style={[styles.heartContainer, { width: size + 8, height: size + 8 }]}>
      {/* Halo / Burst Ring */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.burstRing,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: t.colors.heart,
            backgroundColor: t.colors.heartSurface,
            opacity: ringOpacity,
            transform: [{ scale: ringScale }],
          },
        ]}
      />

      {/* Sparkle Particles */}
      {particles.map((p, idx) => {
        const transX = burstAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, p.x],
        });
        const transY = burstAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, p.y],
        });

        return (
          <Animated.View
            key={idx}
            pointerEvents="none"
            style={[
              styles.particle,
              {
                width: p.size,
                height: p.size,
                borderRadius: p.size / 2,
                backgroundColor: p.color,
                opacity: pOpacity,
                transform: [
                  { translateX: transX },
                  { translateY: transY },
                  { scale: pScale },
                ],
              },
            ]}
          />
        );
      })}

      {/* Main Heart with Spring Scale */}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        {filled ? (
          <Text
            style={[
              styles.solidHeart,
              {
                fontSize: size,
                lineHeight: size + 2,
                color: iconColor,
              },
            ]}
            accessibilityElementsHidden
          >
            ♥
          </Text>
        ) : (
          <Text
            style={[
              styles.icon,
              {
                fontSize: size,
                lineHeight: size + 2,
                color: iconColor,
              },
            ]}
            accessibilityElementsHidden
          >
            favorite_border
          </Text>
        )}
      </Animated.View>
    </View>
  );
}

export function AppIcon({ name, size = 22, color = t.colors.tealDark, filled = false }: { name: string; size?: number; color?: string; filled?: boolean }) {
  if (name === 'favorite' || filled) {
    return <HeartIcon filled={true} size={size} color={color} />;
  }
  if (name === 'favorite_border') {
    return <HeartIcon filled={false} size={size} color={color} />;
  }
  return <MaterialIcon name={name} size={size} color={color} />;
}

export function MenuIcon() { return <MaterialIcon name="menu" size={25} />; }
export function BellIcon() { return <MaterialIcon name="notifications" size={26} />; }
export function SearchIcon() { return <MaterialIcon name="search" size={23} color={t.colors.text} />; }
export function FilterIcon() { return <MaterialIcon name="tune" size={22} />; }
export function HomeIcon({ active = false }: { active?: boolean }) { return <MaterialIcon name="home" size={24} color={active ? t.colors.tealDark : t.colors.muted} />; }
export function DonationIcon({ active = false }: { active?: boolean }) { return <MaterialIcon name="volunteer_activism" size={24} color={active ? t.colors.tealDark : t.colors.muted} />; }
export function PersonIcon({ active = false }: { active?: boolean }) { return <MaterialIcon name="person" size={24} color={active ? t.colors.tealDark : t.colors.muted} />; }
export function GlobeIcon({ size = 20, color = '#FFFFFF' }: { size?: number; color?: string }) { return <MaterialIcon name="public" size={size} color={color} />; }

export function CategoryIcon({ type }: { type: 'all' | 'environment' | 'education' | 'health' | 'community' | 'default' }) {
  const names = { all: 'apps', environment: 'nature', education: 'school', health: 'health_and_safety', community: 'groups', default: 'category' } as const;
  return <MaterialIcon name={names[type]} size={21} color={type === 'environment' || type === 'all' ? t.colors.tealDark : t.colors.text} />;
}

const styles = StyleSheet.create({
  icon: { fontFamily: 'MaterialSymbols_500Medium', textAlign: 'center', includeFontPadding: false },
  solidHeart: { textAlign: 'center', includeFontPadding: false, fontWeight: '900' },
  heartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  burstRing: {
    position: 'absolute',
    borderWidth: 1.5,
  },
  particle: {
    position: 'absolute',
  },
});
