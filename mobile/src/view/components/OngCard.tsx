import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { Ong } from '../../model/entities/Ong';

type OngCardProps = {
  ong: Ong;
  onPress: () => void;
};

export function OngCard({ ong, onPress }: OngCardProps) {
  const hasValidImage = Boolean(ong.imagemUrl && /^https?:\/\//i.test(ong.imagemUrl));

  return (
    <Pressable style={styles.card} onPress={onPress}>
      {hasValidImage ? <Image source={{ uri: ong.imagemUrl as string }} style={styles.image} /> : null}
      <View style={styles.content}>
        <Text style={styles.name}>{ong.nome}</Text>
        <Text>{ong.cidade} - {ong.estado}</Text>
        <Text numberOfLines={2}>{ong.descricao}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, overflow: 'hidden' },
  image: { width: '100%', height: 160 },
  content: { padding: 16, gap: 6 },
  name: { fontSize: 18, fontWeight: '600' },
});
