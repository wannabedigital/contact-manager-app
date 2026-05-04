import { ContactForm } from '@/src/components/contact/ContactForm';
import { useContactStore } from '@/src/store/useContactStore';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function NewContactScreen() {
	const router = useRouter();
	const { addContact, groups, loadGroups } = useContactStore();

	useEffect(() => {
		loadGroups();
	}, [loadGroups]);

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
			groups={groups}
			onSave={handleSave}
			onCancel={handleCancel}
		/>
	);
}
