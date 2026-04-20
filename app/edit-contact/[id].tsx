import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function EditContactScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    alert(`Редактирование контакта #${id} пока не реализовано`);
    router.back();
  }, [id, router]);

  return null;
}
