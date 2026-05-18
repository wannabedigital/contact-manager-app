import { DocumentForm } from '@/src/components/document/DocumentForm';
import { useDocumentStore } from '@/src/store/useDocumentStore';
import { useContactStore } from '@/src/store/useContactStore';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function NewDocumentScreen() {
	const router = useRouter();
	const { addDocument } = useDocumentStore();
	const { contacts, loadContacts } = useContactStore();

	useEffect(() => {
		loadContacts();
	}, [loadContacts]);

	const handleSave = async (data: any) => {
		await addDocument(data);
		router.back();
	};

	return (
		<DocumentForm
			title='Новый договор'
			contacts={contacts}
			onSave={handleSave}
			onCancel={() => router.back()}
		/>
	);
}
