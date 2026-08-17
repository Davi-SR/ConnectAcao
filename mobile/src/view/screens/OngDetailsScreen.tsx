import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, ScrollView, StyleSheet, Text } from 'react-native';

import { RootStackParamList } from '../../navigation/types';
import { ScreenMessage } from '../components/ScreenMessage';
import { useOngDetailsViewModel } from '../../viewmodel/useOngDetailsViewModel';

type Props = NativeStackScreenProps<RootStackParamList, 'OngDetails'>;

export function OngDetailsScreen({ navigation, route }: Props) {
  const { ong, isLoading, error } = useOngDetailsViewModel(route.params.ongId);
  if (isLoading) return <ScreenMessage>Carregando ONG...</ScreenMessage>;
  if (error || !ong) return <ScreenMessage>{error ?? 'ONG não encontrada.'}</ScreenMessage>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{ong.nome}</Text>
      <Text>{ong.descricao}</Text>
      <Text>{ong.cidade} - {ong.estado}</Text>
      <Button title="Ver campanhas" onPress={() => navigation.navigate('Campanhas', { ongId: ong.id })} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({ container: { padding: 20, gap: 16 }, title: { fontSize: 26, fontWeight: '700' } });
