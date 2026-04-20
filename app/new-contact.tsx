import { colors } from '@/src/constants/colors';
import { useContactStore } from '@/src/store/useContactStore';
import {
  ADDRESS_TYPES,
  AddressType,
  EMAIL_TYPES,
  EmailType,
  PHONE_TYPES,
  PhoneType,
} from '@/src/types/contact';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type PhoneField = {
  id: string;
  phone_number: string;
  type: PhoneType;
};

type EmailField = {
  id: string;
  email_address: string;
  type: EmailType;
};

type AddressField = {
  id: string;
  address: string;
  type: AddressType;
};

export default function NewContactScreen() {
  const router = useRouter();
  const { addContact } = useContactStore();

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [notes, setNotes] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const [phones, setPhones] = useState<PhoneField[]>([]);
  const [emails, setEmails] = useState<EmailField[]>([]);
  const [addresses, setAddresses] = useState<AddressField[]>([]);

  const getInputStyle = (fieldName: string) => [
    styles.input,
    focusedField === fieldName && styles.inputFocused,
  ];

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        'Разрешение требуется',
        'Необходим доступ к галерее для выбора фото',
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const addPhone = () => {
    setPhones([
      ...phones,
      { id: Date.now().toString(), phone_number: '', type: PHONE_TYPES[0] },
    ]);
  };

  const removePhone = (id: string) => {
    setPhones(phones.filter((p) => p.id !== id));
  };

  const updatePhone = (id: string, field: keyof PhoneField, value: string) => {
    setPhones(phones.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const addEmail = () => {
    setEmails([
      ...emails,
      { id: Date.now().toString(), email_address: '', type: EMAIL_TYPES[0] },
    ]);
  };

  const removeEmail = (id: string) => {
    setEmails(emails.filter((e) => e.id !== id));
  };

  const updateEmail = (id: string, field: keyof EmailField, value: string) => {
    setEmails(emails.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  const addAddress = () => {
    setAddresses([
      ...addresses,
      { id: Date.now().toString(), address: '', type: ADDRESS_TYPES[0] },
    ]);
  };

  const removeAddress = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  const updateAddress = (
    id: string,
    field: keyof AddressField,
    value: string,
  ) => {
    setAddresses(
      addresses.map((a) => (a.id === id ? { ...a, [field]: value } : a)),
    );
  };

  const handleSave = async () => {
    if (!firstName.trim()) {
      Alert.alert('Ошибка', 'Поле "Имя" обязательно для заполнения');
      return;
    }

    const contactData = {
      first_name: firstName.trim(),
      last_name: lastName.trim() || undefined,
      patronymic: patronymic.trim() || undefined,
      company: company.trim() || undefined,
      position: position.trim() || undefined,
      date_of_birth: dateOfBirth || undefined,
      notes: notes.trim() || undefined,
      photo_uri: photoUri || undefined,
      phones: phones
        .filter((p) => p.phone_number.trim())
        .map((p) => ({
          phone_number: p.phone_number.trim(),
          type: p.type,
        })),
      emails: emails
        .filter((e) => e.email_address.trim())
        .map((e) => ({
          email_address: e.email_address.trim(),
          type: e.type,
        })),
      addresses: addresses
        .filter((a) => a.address.trim())
        .map((a) => ({
          address: a.address.trim(),
          type: a.type,
        })),
    };

    try {
      await addContact(contactData);
      router.back();
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      Alert.alert('Ошибка', 'Не удалось сохранить контакт');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={'padding'}
      keyboardVerticalOffset={0}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
            <Ionicons name='arrow-back' size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Новый контакт</Text>
          <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
            <Ionicons name='checkmark' size={28} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={styles.scrollViewContent}
        >
          <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Ionicons
                  name='person-outline'
                  size={48}
                  color={colors.primary}
                />
              </View>
            )}
            <Text style={styles.avatarHint}>
              {photoUri ? 'Изменить фото' : 'Добавить фото'}
            </Text>
          </TouchableOpacity>

          <View style={styles.section}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Имя *</Text>
              <TextInput
                style={getInputStyle('firstName')}
                value={firstName}
                onChangeText={setFirstName}
                placeholder='Имя контакта'
                placeholderTextColor={colors.textSecondary}
                onFocus={() => setFocusedField('firstName')}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Фамилия</Text>
              <TextInput
                style={getInputStyle('lastName')}
                value={lastName}
                onChangeText={setLastName}
                placeholder='Фамилия'
                placeholderTextColor={colors.textSecondary}
                onFocus={() => setFocusedField('lastName')}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Отчество</Text>
              <TextInput
                style={getInputStyle('patronymic')}
                value={patronymic}
                onChangeText={setPatronymic}
                placeholder='Отчество'
                placeholderTextColor={colors.textSecondary}
                onFocus={() => setFocusedField('patronymic')}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Организация</Text>
              <TextInput
                style={getInputStyle('company')}
                value={company}
                onChangeText={setCompany}
                placeholder='Организация'
                placeholderTextColor={colors.textSecondary}
                onFocus={() => setFocusedField('company')}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Должность</Text>
              <TextInput
                style={getInputStyle('position')}
                value={position}
                onChangeText={setPosition}
                placeholder='Должность'
                placeholderTextColor={colors.textSecondary}
                onFocus={() => setFocusedField('position')}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Дата рождения</Text>
              <TextInput
                style={getInputStyle('dateOfBirth')}
                value={dateOfBirth}
                onChangeText={setDateOfBirth}
                placeholder='ДД.ММ.ГГГГ'
                placeholderTextColor={colors.textSecondary}
                onFocus={() => setFocusedField('dateOfBirth')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Телефон</Text>
            {phones.map((phone) => (
              <View key={phone.id} style={styles.dynamicField}>
                <View style={styles.dynamicFieldRow}>
                  <TextInput
                    style={[
                      ...getInputStyle(`phone_${phone.id}`),
                      styles.inputFlex,
                    ]}
                    value={phone.phone_number}
                    onChangeText={(value) =>
                      updatePhone(phone.id, 'phone_number', value)
                    }
                    placeholder='+7 (999) 888-77-66'
                    placeholderTextColor={colors.textSecondary}
                    keyboardType='phone-pad'
                    onFocus={() => setFocusedField(`phone_${phone.id}`)}
                    onBlur={() => setFocusedField(null)}
                  />
                  <TouchableOpacity
                    onPress={() => removePhone(phone.id)}
                    style={styles.deleteButton}
                  >
                    <Ionicons name='trash-outline' size={20} color='#F44336' />
                  </TouchableOpacity>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.dropdown}
                >
                  {PHONE_TYPES.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.dropdownItem,
                        phone.type === type && styles.dropdownItemActive,
                      ]}
                      onPress={() => updatePhone(phone.id, 'type', type)}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          phone.type === type && styles.dropdownItemTextActive,
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            ))}
            <TouchableOpacity onPress={addPhone} style={styles.addButton}>
              <Ionicons
                name='add-circle-outline'
                size={20}
                color={colors.primary}
              />
              <Text style={styles.addButtonText}>Добавить телефон</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Эл. почта</Text>
            {emails.map((email) => (
              <View key={email.id} style={styles.dynamicField}>
                <View style={styles.dynamicFieldRow}>
                  <TextInput
                    style={[
                      ...getInputStyle(`email_${email.id}`),
                      styles.inputFlex,
                    ]}
                    value={email.email_address}
                    onChangeText={(value) =>
                      updateEmail(email.id, 'email_address', value)
                    }
                    placeholder='example@mail.ru'
                    placeholderTextColor={colors.textSecondary}
                    keyboardType='email-address'
                    autoCapitalize='none'
                    onFocus={() => setFocusedField(`email_${email.id}`)}
                    onBlur={() => setFocusedField(null)}
                  />
                  <TouchableOpacity
                    onPress={() => removeEmail(email.id)}
                    style={styles.deleteButton}
                  >
                    <Ionicons name='trash-outline' size={20} color='#F44336' />
                  </TouchableOpacity>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.dropdown}
                >
                  {EMAIL_TYPES.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.dropdownItem,
                        email.type === type && styles.dropdownItemActive,
                      ]}
                      onPress={() => updateEmail(email.id, 'type', type)}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          email.type === type && styles.dropdownItemTextActive,
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            ))}

            <TouchableOpacity onPress={addEmail} style={styles.addButton}>
              <Ionicons
                name='add-circle-outline'
                size={20}
                color={colors.primary}
              />
              <Text style={styles.addButtonText}>Добавить эл. почту</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Физический адрес</Text>
            {addresses.map((address) => (
              <View key={address.id} style={styles.dynamicField}>
                <View style={styles.dynamicFieldRow}>
                  <TextInput
                    style={[
                      ...getInputStyle(`address_${address.id}`),
                      styles.inputFlex,
                    ]}
                    value={address.address}
                    onChangeText={(value) =>
                      updateAddress(address.id, 'address', value)
                    }
                    placeholder='г. Москва, ул. Примерная, д. 1'
                    placeholderTextColor={colors.textSecondary}
                    multiline
                    onFocus={() => setFocusedField(`address_${address.id}`)}
                    onBlur={() => setFocusedField(null)}
                  />
                  <TouchableOpacity
                    onPress={() => removeAddress(address.id)}
                    style={styles.deleteButton}
                  >
                    <Ionicons
                      name='trash-outline'
                      size={20}
                      color={colors.error}
                    />
                  </TouchableOpacity>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.dropdown}
                >
                  {ADDRESS_TYPES.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.dropdownItem,
                        address.type === type && styles.dropdownItemActive,
                      ]}
                      onPress={() => updateAddress(address.id, 'type', type)}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          address.type === type &&
                            styles.dropdownItemTextActive,
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            ))}

            <TouchableOpacity onPress={addAddress} style={styles.addButton}>
              <Ionicons
                name='add-circle-outline'
                size={20}
                color={colors.primary}
              />
              <Text style={styles.addButtonText}>Добавить адрес</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Примечание</Text>
            <TextInput
              style={[...getInputStyle('notes'), styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder='Текст примечания...'
              placeholderTextColor={colors.textSecondary}
              multiline
              textAlignVertical='top'
              onFocus={() => setFocusedField('notes')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
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
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
  },

  scrollView: {
    flex: 1,
  },

  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },

  avatarContainer: {
    alignItems: 'center',
    paddingVertical: 24,
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

  avatarHint: {
    marginTop: 16,
    fontSize: 16,
    color: colors.primary,
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

  field: {
    marginBottom: 16,
  },

  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 6,
  },

  input: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 2,
    borderColor: colors.primary,
  },

  inputFocused: {
    borderColor: colors.primaryDark,
  },

  dynamicField: {
    marginBottom: 16,
  },

  dynamicFieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  inputFlex: {
    flex: 1,
  },

  deleteButton: {
    padding: 8,
  },

  dropdown: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  dropdownItemActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dropdownItemText: {
    fontSize: 13,
    color: colors.textPrimary,
  },
  dropdownItemTextActive: {
    color: '#FFFFFF',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  addButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 10,
    paddingBottom: 10,
  },
  bottomPadding: {
    height: 40,
  },
});
