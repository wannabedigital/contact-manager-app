import { SelectedContactsList } from '@/src/components/contact/SelectedContactsList';
import { colors } from '@/src/constants/colors';
import { useContactStore } from '@/src/store/useContactStore';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
	Alert,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';

export default function NewGroupScreen() {
	const { tempSelectedIds, setTempSelectedIds, createGroupWithMembers } =
		useContactStore();
	const [name, setName] = useState('');

	useEffect(() => {
		setTempSelectedIds([]);
	}, []);

	const handleSave = async () => {
		if (!name.trim()) {
			Alert.alert('Ошибка', 'Введите название группы');
			return;
		}

		try {
			await createGroupWithMembers(name.trim(), tempSelectedIds);
			router.back();
		} catch (error: any) {
			// Теперь, если SQLite ругнется на отсутствие колонки, ты увидишь это!
			Alert.alert(
				'Ошибка сохранения',
				error.message || 'Не удалось создать группу.',
			);
		}
	};

	const removeContact = (id: number) => {
		setTempSelectedIds(tempSelectedIds.filter((cId) => cId !== id));
	};

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity
					onPress={() => router.back()}
					style={styles.headerButton}
				>
					<Ionicons name='arrow-back' size={24} color={colors.primary} />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Новая группа</Text>
				<TouchableOpacity onPress={handleSave} style={styles.headerButton}>
					<Ionicons name='checkmark' size={28} color={colors.success} />
				</TouchableOpacity>
			</View>

			<View style={styles.content}>
				<Text style={styles.label}>Название группы</Text>
				<TextInput
					style={styles.input}
					value={name}
					onChangeText={setName}
					placeholder='Например: Коллеги'
					autoFocus
				/>

				<Text style={[styles.label, { marginTop: 24 }]}>Контакты группы</Text>
				<SelectedContactsList
					selectedIds={tempSelectedIds}
					onRemove={removeContact}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: colors.background },
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingTop: 44,
		paddingBottom: 16,
		backgroundColor: colors.surface,
		borderBottomWidth: 1,
		borderBottomColor: colors.divider,
	},
	headerButton: { width: 40, alignItems: 'center' },
	headerTitle: {
		flex: 1,
		textAlign: 'center',
		fontSize: 18,
		fontWeight: '600',
		color: colors.textPrimary,
	},
	content: { padding: 16 },
	label: {
		fontSize: 14,
		fontWeight: '500',
		color: colors.textSecondary,
		marginBottom: 8,
	},
	input: {
		backgroundColor: colors.surface,
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 12,
		fontSize: 16,
		color: colors.textPrimary,
		borderWidth: 1,
		borderColor: colors.divider,
	},
});
