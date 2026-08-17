import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, View } from 'react-native';

import { RootStackParamList } from '../../navigation/types';
import { OngCard } from '../components/OngCard';
import { ScreenMessage } from '../components/ScreenMessage';
import { useHomeViewModel } from '../../viewmodel/useHomeViewModel';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { ongs, loading, error, carregarOngs } = useHomeViewModel();

  if (loading) {
    return (
      <View style={styles.message}>
        <ActivityIndicator size="large" />
        <Text>Carregando ONGs...</Text>
      </View>
    );
  }

  if (error) {
    return <View style={styles.message}>
      <Text style={styles.error}>{error}</Text>
      <Button title="Tentar novamente" onPress={() => void carregarOngs()} />
    </View>;
  }

  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={ongs}
      keyExtractor={(ong) => String(ong.id)}
      ListEmptyComponent={<ScreenMessage>Nenhuma ONG encontrada.</ScreenMessage>}
      ListHeaderComponent={<Text style={styles.heading}>ONGs disponíveis</Text>}
      renderItem={({ item }) => (
        <OngCard ong={item} onPress={() => navigation.navigate('OngDetails', { ongId: item.id })} />
      )}
      refreshing={loading}
      onRefresh={() => void carregarOngs()}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, gap: 12 },
  heading: { fontSize: 24, fontWeight: '700', marginBottom: 4 },
  message: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 },
  error: { textAlign: 'center' },
});
