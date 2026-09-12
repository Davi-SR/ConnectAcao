import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

import { CampanhasScreen } from '../view/screens/CampanhasScreen';
import { HomeScreen } from '../view/screens/HomeScreen';
import { BuscarScreen } from '../view/screens/BuscarScreen';
import { LoginScreen } from '../view/screens/LoginScreen';
import { CadastroScreen } from '../view/screens/CadastroScreen';
import { OngDetailsScreen } from '../view/screens/OngDetailsScreen';
import { PerfilScreen } from '../view/screens/PerfilScreen';
import { FavoritosScreen } from '../view/screens/FavoritosScreen';
import { DoacoesScreen } from '../view/screens/DoacoesScreen';
import { ConfiguracoesScreen } from '../view/screens/ConfiguracoesScreen';
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
                    options={{ headerShown: false }}
                >
                    {(props) => (
                        <MainTabScreen
                            activeTab="Buscar"
                            navigation={props.navigation}
                        >
                            <BuscarScreen {...props} />
                        </MainTabScreen>
                    )}
                </Stack.Screen>

                <Stack.Screen
                    name="Doacoes"
                    options={{ headerShown: false }}
                >
                    {(props) => (
                        <MainTabScreen
                            activeTab="Doacoes"
                            navigation={props.navigation}
                        >
                            <DoacoesScreen />
                        </MainTabScreen>
                    )}
                </Stack.Screen>

                <Stack.Screen
                    name="Perfil"
                    options={{ headerShown: false }}
                >
                    {(props) => (
                        <MainTabScreen
                            activeTab="Perfil"
                            navigation={props.navigation}
                        >
                            <PerfilScreen {...props} />
                        </MainTabScreen>
                    )}
                </Stack.Screen>

                <Stack.Screen
                    name="Favoritos"
                    component={FavoritosScreen}
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="Configuracoes"
                    options={{ headerShown: false }}
                >
                    {(props) => (
                        <MainTabScreen
                            activeTab="Perfil"
                            navigation={props.navigation}
                        >
                            <ConfiguracoesScreen />
                        </MainTabScreen>
                    )}
                </Stack.Screen>

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