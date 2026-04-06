import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ContactCard } from '../../src/components/ContactCard';
import { useContactStore } from '../../src/store/useContactStore';

export default function ContactsScreen() {
  const { contacts, loadContacts, addContact } = useContactStore();

  useEffect(() => {
    loadContacts();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id!.toString()}
        renderItem={({ item }) => <ContactCard contact={item} />}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          addContact({
            first_name: 'Имя',
            last_name: 'Контакта',
            company: 'Организация',
          })
        }
      >
        <Ionicons name='add' size={28} color='#fff' />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#2F80ED',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});
