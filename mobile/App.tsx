import * as WebBrowser from 'expo-web-browser';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { MaterialSymbols_500Medium } from '@expo-google-fonts/material-symbols';

WebBrowser.maybeCompleteAuthSession();

import { RootNavigator } from './src/navigation/RootNavigator';
import { AuthProvider } from './src/viewmodel/AuthContext';
import { DrawerProvider, useDrawer } from './src/viewmodel/DrawerContext';

function AppNavigation() {
  const { setActiveRoute } = useDrawer();
  return <NavigationContainer onStateChange={(state) => {
    const route = state?.routes[state.index ?? 0]?.name;
    if (route) setActiveRoute(route as keyof import('./src/navigation/types').RootStackParamList);
  }}><RootNavigator /></NavigationContainer>;
}

export default function App() {
  const [fontsLoaded] = useFonts({
    'Plus Jakarta Sans': require('./assets/fonts/PlusJakartaSans.woff2'),
    MaterialSymbols_500Medium,
  });

  if (!fontsLoaded) return null;

  return (
    <AuthProvider><DrawerProvider><AppNavigation /></DrawerProvider></AuthProvider>
  );
}
