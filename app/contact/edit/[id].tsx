import { ContactForm } from '@/src/components/contact/ContactForm';
import { Loading } from '@/src/components/ui/Loading';
import { useContactStore } from '@/src/store/useContactStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

export default function EditContactScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const { contacts, updateContact, groups, loadGroups } = useContactStore();
	const [contact, setContact] = useState<any>(null);

	useEffect(() => {
		loadGroups();
		const found = contacts.find((c) => c.id === Number(id));
		setContact(found);
	}, [loadGroups, id, contacts]);

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
			groups={groups}
			onSave={handleSave}
			onCancel={handleCancel}
		/>
	);
}
