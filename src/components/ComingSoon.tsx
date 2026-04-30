import { colors } from '@/src/constants/colors';
import { StyleSheet, Text, View } from 'react-native';

interface ComingSoonProps {
  screen?: string;
}

export const ComingSoon = ({ screen }: ComingSoonProps) => {
  const screenName = ` ${screen} `;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Экран
        <Text style={styles.bold}>{screenName || ' '}</Text>в разработке
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  text: {
    marginTop: 10,
    fontSize: 20,
    color: colors.textPrimary,
  },
  bold: {
    fontWeight: 600,
  },
});
