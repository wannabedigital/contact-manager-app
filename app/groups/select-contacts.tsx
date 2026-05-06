import { ContactSelector } from '@/src/components/contact/ContactSelector';
import { useContactStore } from '@/src/store/useContactStore';
import { router } from 'expo-router';
import { View } from 'react-native';

export default function SelectContactsScreen() {
	const { tempSelectedIds, setTempSelectedIds } = useContactStore();

	const handleSave = (newIds: number[]) => {
		setTempSelectedIds(newIds);
		router.back();
	};

	const handleCancel = () => {
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
