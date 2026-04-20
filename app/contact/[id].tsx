import { colors } from '@/src/constants/colors';
import { useContactStore } from '@/src/store/useContactStore';
import { Contact } from '@/src/types/contact';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ContactDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { showActionSheetWithOptions } = useActionSheet();
  const { contacts, loadContacts, deleteContact } = useContactStore();
  const [contact, setContact] = useState<Contact | null>(null);

  useEffect(() => {
    const loadContact = async () => {
      await loadContacts();
    };
    loadContact();
  }, [loadContacts]);

  useEffect(() => {
    const found = contacts.find((c) => c.id.toString() === id);
    setContact(found || null);
  }, [contacts, id]);

  if (!contact) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.headerButton}
          >
            <Ionicons name='arrow-back' size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Контакт</Text>
          <View style={styles.headerButton} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Загрузка...</Text>
        </View>
      </View>
    );
  }

  const handlePhonePress = (phones: Contact['phones']) => {
    if (!phones || phones.length === 0) return;

    if (phones.length === 1) {
      const number = phones[0].phone_number.replace(/\D/g, '');
      Linking.openURL(`tel:${number}`);
    } else {
      const options = [
        ...phones.map((p) => `${p.phone_number} (${p.type})`),
        'Отмена',
      ];
      const cancelButtonIndex = options.length - 1;

      showActionSheetWithOptions(
        { options, cancelButtonIndex, title: 'Выберите номер' },
        (selectedIndex) => {
          if (
            selectedIndex !== undefined &&
            selectedIndex !== cancelButtonIndex
          ) {
            const phone = phones[selectedIndex];
            const number = phone.phone_number.replace(/\D/g, '');
            Linking.openURL(`tel:${number}`);
          }
        },
      );
    }
  };

  const handleEmailPress = (emails: Contact['emails']) => {
    if (!emails || emails.length === 0) return;

    if (emails.length === 1) {
      Linking.openURL(`mailto:${emails[0].email_address}`);
    } else {
      const options = [
        ...emails.map((e) => `${e.email_address} (${e.type})`),
        'Отмена',
      ];
      const cancelButtonIndex = options.length - 1;

      showActionSheetWithOptions(
        { options, cancelButtonIndex, title: 'Выберите email' },
        (selectedIndex) => {
          if (
            selectedIndex !== undefined &&
            selectedIndex !== cancelButtonIndex
          ) {
            const email = emails[selectedIndex];
            Linking.openURL(`mailto:${email.email_address}`);
          }
        },
      );
    }
  };

  const handleSmsPress = (phones: Contact['phones']) => {
    if (!phones || phones.length === 0) return;

    if (phones.length === 1) {
      const number = phones[0].phone_number.replace(/\D/g, '');
      Linking.openURL(`sms:${number}`);
    } else {
      const options = [
        ...phones.map((p) => `${p.phone_number} (${p.type})`),
        'Отмена',
      ];
      const cancelButtonIndex = options.length - 1;

      showActionSheetWithOptions(
        { options, cancelButtonIndex, title: 'Выберите номер для SMS' },
        (selectedIndex) => {
          if (
            selectedIndex !== undefined &&
            selectedIndex !== cancelButtonIndex
          ) {
            const phone = phones[selectedIndex];
            const number = phone.phone_number.replace(/\D/g, '');
            Linking.openURL(`sms:${number}`);
          }
        },
      );
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Удаление контакта',
      `Вы действительно хотите удалить контакт "${contact.last_name} ${contact.first_name}"?`,
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Хорошо',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteContact(contact.id);
              router.back();
            } catch (error) {
              console.error('Ошибка при удалении:', error);
              Alert.alert('Ошибка', 'Не удалось удалить контакт');
            }
          },
        },
      ],
    );
  };

  const hasPhones = contact.phones && contact.phones.length > 0;
  const hasEmails = contact.emails && contact.emails.length > 0;
  const hasAddresses = contact.addresses && contact.addresses.length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerButton}
        >
          <Ionicons name='arrow-back' size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {contact.first_name} {contact.last_name || 'Контакт'}
        </Text>
        <TouchableOpacity
          onPress={() => router.push(`/edit-contact/${contact.id}`)}
          style={styles.headerButton}
        >
          <Ionicons name='create-outline' size={28} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarContainer}>
          {contact.photo_uri ? (
            <Image source={{ uri: contact.photo_uri }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Ionicons
                name='person-outline'
                size={64}
                color={colors.primary}
              />
            </View>
          )}

          <Text style={styles.fullName}>
            {contact.last_name} {contact.first_name}
          </Text>
          {contact.patronymic && (
            <Text style={styles.patronymic}>{contact.patronymic}</Text>
          )}
        </View>

        {contact.date_of_birth && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Дата рождения</Text>
            <Text style={styles.infoText}>{contact.date_of_birth}</Text>
          </View>
        )}

        {contact.company && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Организация</Text>
            <Text style={styles.infoText}>{contact.company}</Text>
          </View>
        )}

        {contact.position && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Должность</Text>
            <Text style={styles.infoText}>{contact.position}</Text>
          </View>
        )}
        {(hasEmails || hasPhones) && (
          <View style={styles.quickActions}>
            {hasEmails && (
              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={() => handleEmailPress(contact.emails)}
              >
                <Ionicons name='mail' size={32} color={colors.primary} />
                <Text style={styles.quickActionText}>Email</Text>
              </TouchableOpacity>
            )}
            {hasPhones && (
              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={() => handleSmsPress(contact.phones)}
              >
                <Ionicons name='chatbubble' size={32} color={colors.primary} />
                <Text style={styles.quickActionText}>SMS</Text>
              </TouchableOpacity>
            )}
            {hasPhones && (
              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={() => handlePhonePress(contact.phones)}
              >
                <Ionicons name='call' size={32} color={colors.primary} />
                <Text style={styles.quickActionText}>Звонок</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        {hasPhones && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Телефоны</Text>
            {contact.phones?.map((phone, index) => (
              <View key={phone.id || index} style={styles.itemRow}>
                <View style={styles.itemContent}>
                  <Text style={styles.itemText}>{phone.phone_number}</Text>
                  <Text style={styles.itemType}>{phone.type}</Text>
                </View>
                <View style={styles.itemActions}>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => handleSmsPress([phone])}
                  >
                    <Ionicons
                      name='chatbubble-outline'
                      size={28}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => handlePhonePress([phone])}
                  >
                    <Ionicons
                      name='call-outline'
                      size={28}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {hasEmails && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Электронная почта</Text>
            {contact.emails?.map((email, index) => (
              <View key={email.id || index} style={styles.itemRow}>
                <View style={styles.itemContent}>
                  <Text style={styles.itemText}>{email.email_address}</Text>
                  <Text style={styles.itemType}>{email.type}</Text>
                </View>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => handleEmailPress([email])}
                >
                  <Ionicons
                    name='mail-outline'
                    size={28}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {hasAddresses && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Адреса</Text>
            {contact.addresses?.map((address, index) => (
              <View key={address.id || index} style={styles.addressRow}>
                <View style={styles.addressContent}>
                  <Text style={styles.addressText}>{address.address}</Text>
                  <Text style={styles.itemType}>{address.type}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {contact.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Примечание</Text>
            <Text style={styles.notesText}>{contact.notes}</Text>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={handleDelete}>
        <Ionicons name='trash-outline' size={28} color={colors.surface} />
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 44,
    paddingBottom: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 2,
    borderBottomColor: colors.divider,
  },
  headerButton: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  avatarContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: colors.surface,
    marginBottom: 8,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  patronymic: {
    fontSize: 18,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  fullName: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 16,
    textAlign: 'center',
  },
  company: {
    fontSize: 16,
    color: colors.textPrimary,
    marginTop: 4,
    textAlign: 'center',
  },
  position: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 64,
    backgroundColor: colors.surface,
    marginBottom: 8,
    gap: 24,
  },
  quickActionButton: {
    alignItems: 'center',
  },
  quickActionText: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 4,
  },
  infoText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  notesText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  addressText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  section: {
    backgroundColor: colors.surface,
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  itemContent: {
    flex: 1,
    marginVertical: 8,
  },
  itemText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  itemType: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  itemActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  addressContent: {
    marginVertical: 8,
  },
  bottomPadding: {
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    bottom: 48,
    right: 20,
    backgroundColor: colors.error,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: colors.error,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
