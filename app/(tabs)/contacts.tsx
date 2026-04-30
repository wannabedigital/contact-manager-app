import { ContactCard } from '@/src/components/ContactCard';
import { SearchBar } from '@/src/components/SearchBar';
import { colors } from '@/src/constants/colors';
import { useContactStore } from '@/src/store/useContactStore';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  FlatList,
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ContactsScreen() {
  const { contacts, loadContacts, searchContacts } = useContactStore();
  const [isSearchActive, setIsSearchActive] = useState(false);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const toggleSearch = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsSearchActive(!isSearchActive);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name='filter-outline' size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.headerTitle}>Контакты</Text>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton} onPress={toggleSearch}>
            <Ionicons
              name={isSearchActive ? 'close' : 'search-outline'}
              size={24}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <SearchBar
        isActive={isSearchActive}
        onSearch={searchContacts}
      />

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id!.toString()}
        renderItem={({ item }) => <ContactCard contact={item} />}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {isSearchActive ? 'Ничего не найдено' : 'Нет контактов.'}
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/contact/new')}
      >
        <Ionicons name='add' size={28} color={colors.surface} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 44,
    paddingBottom: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 2,
    borderBottomColor: colors.divider,
  },
  headerLeft: {
    width: 40,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    paddingHorizontal: 16,
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  headerButton: {
    padding: 4,
  },
  clearButton: {
    padding: 4,
  },
  listContent: {
    paddingVertical: 4,
    paddingBottom: 20,
  },
  separator: {
    height: 4,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 24,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
