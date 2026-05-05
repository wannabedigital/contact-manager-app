import { ContactSelector } from '@/src/components/contact/ContactSelector';
import { useContactStore } from '@/src/store/useContactStore';
import { router } from 'expo-router';
import { View } from 'react-native';

export default function SelectContactsScreen() {
	const { tempSelectedIds, setTempSelectedIds } = useContactStore();

	const handleSave = (newIds: number[]) => {
		console.log('[select-contacts.tsx] Сохраняем выбранные ID:', newIds);
		setTempSelectedIds(newIds);
		router.back();
	};

	const handleCancel = () => {
		console.log('[select-contacts.tsx] Отмена выбора');
		router.back();
	};

	return (
		<View style={{ flex: 1 }}>
			<ContactSelector
				initialSelectedIds={tempSelectedIds}
				onSave={handleSave}
				onCancel={handleCancel}
				title='Добавить контакты'
			/>
		</View>
	);
}
