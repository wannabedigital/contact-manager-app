import { colors } from '@/src/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface QuickActionsProps {
  onCall: () => void;
  onSms: () => void;
  onEmail: () => void;
  hasPhones: boolean;
  hasEmails: boolean;
}

export const QuickActions = ({
  onCall,
  onSms,
  onEmail,
  hasPhones,
  hasEmails,
}: QuickActionsProps) => {
  if (!hasPhones && !hasEmails) return null;

  return (
    <View style={styles.container}>
      {hasEmails && (
        <TouchableOpacity style={styles.button} onPress={onEmail}>
          <Ionicons name='mail' size={32} color={colors.primary} />
          <Text style={styles.text}>Email</Text>
        </TouchableOpacity>
      )}
      {hasPhones && (
        <TouchableOpacity style={styles.button} onPress={onSms}>
          <Ionicons name='chatbubble' size={32} color={colors.primary} />
          <Text style={styles.text}>SMS</Text>
        </TouchableOpacity>
      )}
      {hasPhones && (
        <TouchableOpacity style={styles.button} onPress={onCall}>
          <Ionicons name='call' size={32} color={colors.primary} />
          <Text style={styles.text}>Звонок</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 32,
    backgroundColor: colors.surface,
    marginBottom: 8,
    gap: 24,
  },
  button: {
    alignItems: 'center',
    flex: 1,
  },
  text: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 4,
  },
});
