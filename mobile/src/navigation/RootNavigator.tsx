import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, Button, View } from 'react-native';

import { CampanhasScreen } from '../view/screens/CampanhasScreen';
import { HomeScreen } from '../view/screens/HomeScreen';
import { LoginScreen } from '../view/screens/LoginScreen';
import { OngDetailsScreen } from '../view/screens/OngDetailsScreen';
import { useAuth } from '../viewmodel/AuthContext';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { isAuthenticated, isLoadingSession, signOut } = useAuth();
  if (isLoadingSession) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator size="large" /></View>;
  if (!isAuthenticated) return <Stack.Navigator><Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} /></Stack.Navigator>;
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'ConectAção', headerRight: () => <Button title="Sair" onPress={() => void signOut()} /> }} />
      <Stack.Screen name="OngDetails" component={OngDetailsScreen} options={{ title: 'ONG' }} />
      <Stack.Screen name="Campanhas" component={CampanhasScreen} />
    </Stack.Navigator>
  );
}
