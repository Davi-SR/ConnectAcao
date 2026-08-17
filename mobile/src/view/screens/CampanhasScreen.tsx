import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, StyleSheet, Text } from 'react-native';

import { RootStackParamList } from '../../navigation/types';
import { ScreenMessage } from '../components/ScreenMessage';
import { useCampanhasViewModel } from '../../viewmodel/useCampanhasViewModel';

type Props = NativeStackScreenProps<RootStackParamList, 'Campanhas'>;

export function CampanhasScreen({ route }: Props) {
  const { campanhas, isLoading, error } = useCampanhasViewModel(route.params.ongId);
  if (isLoading) return <ScreenMessage>Carregando campanhas...</ScreenMessage>;
  if (error) return <ScreenMessage>{error}</ScreenMessage>;

  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={campanhas}
      keyExtractor={(campanha) => String(campanha.id)}
      ListEmptyComponent={<ScreenMessage>Nenhuma campanha encontrada.</ScreenMessage>}
      renderItem={({ item }) => <Text style={styles.card}>{item.titulo} - {item.status}</Text>}
    />
  );
}

const styles = StyleSheet.create({ list: { padding: 16, gap: 12 }, card: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 16 } });
