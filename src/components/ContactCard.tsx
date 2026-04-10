import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../constants/colors';
import { Contact } from '../types/contact';

type Props = {
  contact: Contact;
  onDelete?: () => void;
};

export const ContactCard = ({ contact, onDelete }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Ionicons name='person-outline' size={32} color='#2F80ED' />
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>
          {contact.first_name} {contact.last_name}
        </Text>
        <Text style={styles.company}>{contact.company || ''}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity>
          <Ionicons name='mail-outline' size={22} color='#2F80ED' />
        </TouchableOpacity>

        <TouchableOpacity style={{ marginLeft: 12 }}>
          <Ionicons name='call-outline' size={22} color='#2F80ED' />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: colors.divider,
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
    fontSize: 18,
    fontWeight: '600',
  },

  company: {
    fontSize: 14,
    color: colors.textPrimary,
  },

  actions: {
    flexDirection: 'row',
  },
});
