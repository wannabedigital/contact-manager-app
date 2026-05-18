import { DocumentForm } from '@/src/components/document/DocumentForm';
import { Loading } from '@/src/components/ui/Loading';
import { useDocumentStore } from '@/src/store/useDocumentStore';
import { useContactStore } from '@/src/store/useContactStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

export default function EditDocumentScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const { documents, updateDocument } = useDocumentStore();
	const { loadContacts } = useContactStore();
	const [document, setDocument] = useState<any>(null);

	useEffect(() => {
		loadContacts();
		const found = documents.find((d) => d.id === Number(id));
		setDocument(found);
	}, [id, documents, loadContacts]);

	const handleSave = async (data: any) => {
		await updateDocument(Number(id), data);
		router.back();
	};

	if (!document) {
		return <Loading />;
	}

	return (
		<DocumentForm
			title='Редактирование'
			initialData={document}
			onSave={handleSave}
			onCancel={() => router.back()}
		/>
	);
}
