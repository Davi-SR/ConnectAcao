import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Categoria } from '../../model/entities/Categoria';
import { CategoriaRepository } from '../../model/repositories/CategoriaRepository';
import { RootStackParamList } from '../../navigation/types';
import { authTheme as t } from '../../theme/authTheme';
import { useFavoritosViewModel } from '../../viewmodel/useFavoritosViewModel';
import { useDrawer } from '../../viewmodel/DrawerContext';
import { OngRecommendedCard } from '../components/OngRecommendedCard';
import { AppIcon } from '../components/HomeIcons';
type Navigation = NativeStackNavigationProp<RootStackParamList>;

export function FavoritosScreen() {
    const navigation = useNavigation<Navigation>();
    const { openDrawer } = useDrawer();

    const {
        favoritos,
        isLoading,
        error,
        carregarFavoritos,
        desfavoritar,
    } = useFavoritosViewModel();

    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        async function carregarCategorias() {
            try {
                const resultado = await CategoriaRepository.listar();
                setCategorias(resultado);
            } catch (cause) {
                console.error('Erro ao carregar categorias:', cause);
            }
        }

        void carregarCategorias();
    }, []);

    async function atualizar() {
        setRefreshing(true);

        try {
            await carregarFavoritos();
        } finally {
            setRefreshing(false);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Abrir menu"
                    onPress={openDrawer}
                    style={({ pressed }) => [
                        styles.menuButton,
                        pressed && styles.pressed,
                    ]}
                >
                    <AppIcon name="menu" size={28} color={t.colors.ink} />
                </Pressable>

                <Text style={styles.title}>ONGs Favoritas</Text>

                <View style={styles.headerSpacer} />
            </View>

            {isLoading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={t.colors.brand} />
                    <Text style={styles.message}>Carregando favoritas...</Text>
                </View>
            ) : error ? (
                <View style={styles.center}>
                    <Text style={styles.error}>{error}</Text>

                    <Pressable
                        onPress={() => void carregarFavoritos()}
                        style={({ pressed }) => [
                            styles.retryButton,
                            pressed && styles.pressed,
                        ]}
                    >
                        <Text style={styles.retryText}>Tentar novamente</Text>
                    </Pressable>
                </View>
            ) : favoritos.length === 0 ? (
                <View style={styles.center}>
                    <AppIcon
                        name="favorite_border"
                        size={54}
                        color={t.colors.inputBorder}
                    />

                    <Text style={styles.emptyTitle}>
                        Nenhuma ONG favorita
                    </Text>

                    <Text style={styles.message}>
                        As ONGs que você favoritar aparecerão aqui.
                    </Text>
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={styles.content}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => void atualizar()}
                        />
                    }
                >
                    <Text style={styles.subtitle}>
                        Suas causas favoritas
                    </Text>

                    <View style={styles.cards}>
                        {favoritos.map((ong) => (
                            <OngRecommendedCard
                                key={ong.id}
                                ong={ong}
                                categorias={categorias}
                                isFavorite
                                onFavoritePress={() => void desfavoritar(ong.id)}
                                onProfile={() =>
                                    navigation.navigate('OngDetails', {
                                        ongId: ong.id,
                                    })
                                }
                            />
                        ))}
                    </View>
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: t.colors.page,
    },

    header: {
        minHeight: 88,
        paddingTop: 32,
        paddingHorizontal: t.spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: t.colors.line,
        backgroundColor: t.colors.surface,
    },

    menuButton: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: t.radius.pill,
    },

    title: {
        flex: 1,
        textAlign: 'center',
        color: t.colors.ink,
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 20,
        fontWeight: '800',
    },

    headerSpacer: {
        width: 48,
    },

    content: {
        padding: t.spacing.lg,
        paddingBottom: 40,
    },

    subtitle: {
        marginBottom: t.spacing.lg,
        color: t.colors.ink,
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 22,
        fontWeight: '800',
    },

    cards: {
        gap: t.spacing.lg,
    },

    center: {
        flex: 1,
        paddingHorizontal: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },

    emptyTitle: {
        marginTop: t.spacing.md,
        color: t.colors.ink,
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 20,
        fontWeight: '800',
        textAlign: 'center',
    },

    message: {
        marginTop: t.spacing.sm,
        color: t.colors.text,
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 15,
        lineHeight: 22,
        textAlign: 'center',
    },

    error: {
        color: t.colors.error,
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },

    retryButton: {
        minHeight: 48,
        marginTop: t.spacing.lg,
        paddingHorizontal: t.spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: t.radius.button,
        backgroundColor: t.colors.brand,
    },

    retryText: {
        color: t.colors.surface,
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 15,
        fontWeight: '800',
    },

    pressed: {
        opacity: 0.75,
    },
});