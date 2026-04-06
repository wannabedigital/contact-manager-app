import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#E5E5E5',
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#2F80ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  info: {
    flex: 1,
  },

  name: {
    fontSize: 16,
    fontWeight: '600',
  },

  company: {
    fontSize: 13,
    color: '#777',
  },

  actions: {
    flexDirection: 'row',
  },
});
