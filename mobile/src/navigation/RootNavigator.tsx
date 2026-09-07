import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

import { CampanhasScreen } from '../view/screens/CampanhasScreen';
import { HomeScreen } from '../view/screens/HomeScreen';
import { LoginScreen } from '../view/screens/LoginScreen';
import { CadastroScreen } from '../view/screens/CadastroScreen';
import { OngDetailsScreen } from '../view/screens/OngDetailsScreen';
import { MainPlaceholderScreen } from '../view/screens/MainPlaceholderScreen';
import { FavoritosScreen } from '../view/screens/FavoritosScreen';
import { DrawerPlaceholderScreen } from '../view/screens/DrawerPlaceholderScreen';
import { MainTabScreen } from '../view/components/MainTabScreen';
import { AppDrawer } from '../view/components/AppDrawer';
import { useAuth } from '../viewmodel/AuthContext';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
    const { isAuthenticated, isLoadingSession } = useAuth();

    if (isLoadingSession) {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!isAuthenticated) {
        return (
            <Stack.Navigator
                screenOptions={{
                    animation: 'slide_from_right',
                }}
            >
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="Cadastro"
                    component={CadastroScreen}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <Stack.Navigator>
                <Stack.Screen
                    name="Home"
                    options={{ headerShown: false }}
                >
                    {(props) => (
                        <MainTabScreen
                            activeTab="Home"
                            navigation={props.navigation}
                        >
                            <HomeScreen {...props} />
                        </MainTabScreen>
                    )}
                </Stack.Screen>

                <Stack.Screen
                    name="Buscar"
                    component={MainPlaceholderScreen}
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="Doacoes"
                    component={MainPlaceholderScreen}
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="Perfil"
                    component={MainPlaceholderScreen}
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="Favoritos"
                    component={FavoritosScreen}
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="Configuracoes"
                    component={DrawerPlaceholderScreen}
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="OngDetails"
                    component={OngDetailsScreen}
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="Campanhas"
                    component={CampanhasScreen}
                />
            </Stack.Navigator>

            <AppDrawer />
        </View>
    );
}