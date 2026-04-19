import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../constants/colors';
import { Contact } from '../types/contact';

type Props = {
  contact: Contact;
  onDelete?: () => void;
};

export const ContactCard = ({ contact, onDelete }: Props) => {
  const hasPhones = contact.phones && contact.phones.length > 0;
  const hasEmails = contact.emails && contact.emails.length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Ionicons name='person-outline' size={32} color={colors.primary} />
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>
          {contact.first_name} {contact.last_name}
        </Text>
        <Text style={styles.company}>{contact.company || ''}</Text>
      </View>

      <View style={styles.actions}>
        {hasEmails && (
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name='mail-outline' size={32} color={colors.primary} />
          </TouchableOpacity>
        )}
        {hasPhones && (
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name='call-outline' size={32} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  info: {
    flex: 1,
  },

  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },

  company: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },

  actions: {
    flexDirection: 'row',
    gap: 24,
  },

  actionButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
