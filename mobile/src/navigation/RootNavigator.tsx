import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { CampanhasScreen } from '../view/screens/CampanhasScreen';
import { HomeScreen } from '../view/screens/HomeScreen';
import { OngDetailsScreen } from '../view/screens/OngDetailsScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'ConectAção' }} />
      <Stack.Screen name="OngDetails" component={OngDetailsScreen} options={{ title: 'ONG' }} />
      <Stack.Screen name="Campanhas" component={CampanhasScreen} />
    </Stack.Navigator>
  );
}
