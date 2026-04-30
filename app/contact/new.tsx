import { ContactForm } from '@/src/components/contact/ContactForm';
import { useContactStore } from '@/src/store/useContactStore';
import { useRouter } from 'expo-router';

export default function NewContactScreen() {
  const router = useRouter();
  const { addContact } = useContactStore();

  const handleSave = async (data: any) => {
    await addContact(data);
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <ContactForm
      title='Новый контакт'
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}
