import { ContactForm } from '@/src/components/ContactForm';
import { Loading } from '@/src/components/Loading';
import { useContactStore } from '@/src/store/useContactStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

export default function EditContactScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { contacts, loadContacts, updateContact } = useContactStore();
  const [contact, setContact] = useState<any>(null);

  useEffect(() => {
    if (contacts.length === 0) {
      loadContacts();
    }
  }, [contacts.length, loadContacts]);

  useEffect(() => {
    const found = contacts.find((c) => c.id.toString() === id);
    if (found) {
      setContact(found);
    }
  }, [contacts, id]);

  const handleSave = async (data: any) => {
    await updateContact(parseInt(id), data);
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  if (!contact) {
    return <Loading />;
  }

  return (
    <ContactForm
      title='Редактирование контакта'
      initialData={contact}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}
