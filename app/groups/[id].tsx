import { SelectedContactsList } from '@/src/components/contact/SelectedContactsList';
import { colors } from '@/src/constants/colors';
import { useContactStore } from '@/src/store/useContactStore';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
	Alert,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';

export default function EditGroupScreen() {
	const { id } = useLocalSearchParams();
	const groupId = Number(id);

	const {
		groups,
		contacts,
		tempSelectedIds,
		setTempSelectedIds,
		updateGroupDetails,
		deleteGroup,
	} = useContactStore();

	const currentGroup = groups.find((g) => g.id === groupId);
	const [name, setName] = useState(currentGroup?.name || '');

	useEffect(() => {
		if (currentGroup) {
			const groupContacts = contacts.filter((c) =>
				c.groups?.some((g) => g.id === groupId),
			);
			setTempSelectedIds(groupContacts.map((c) => c.id));
		}
	}, []);

	if (!currentGroup) return null;

	const handleSave = async () => {
		if (!name.trim()) return Alert.alert('Ошибка', 'Введите название');
		try {
			await updateGroupDetails(groupId, name.trim(), tempSelectedIds);
			router.back();
		} catch (error: any) {
			Alert.alert(
				'Ошибка сохранения',
				error.message || 'Не удалось обновить группу.',
			);
		}
	};

	const handleDelete = () => {
		Alert.alert('Удаление', 'Удалить эту группу?', [
			{ text: 'Отмена', style: 'cancel' },
			{
				text: 'Удалить',
				style: 'destructive',
				onPress: async () => {
					await deleteGroup(groupId);
					router.back();
				},
			},
		]);
	};

	const removeContact = (contactId: number) => {
		setTempSelectedIds(tempSelectedIds.filter((cId) => cId !== contactId));
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
				<Text style={styles.headerTitle}>Настройка группы</Text>
				<TouchableOpacity onPress={handleSave} style={styles.headerButton}>
					<Ionicons name='checkmark' size={28} color={colors.success} />
				</TouchableOpacity>
			</View>

			<View style={styles.content}>
				<Text style={styles.label}>Название группы</Text>
				<TextInput style={styles.input} value={name} onChangeText={setName} />

				<Text style={[styles.label, { marginTop: 24 }]}>Контакты группы</Text>
				<SelectedContactsList
					selectedIds={tempSelectedIds}
					onRemove={removeContact}
				/>

				<TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
					<Ionicons name='trash-outline' size={20} color={colors.error} />
					<Text style={styles.deleteBtnText}>Удалить группу</Text>
				</TouchableOpacity>
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
	content: { padding: 16, flex: 1 },
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
	deleteBtn: {
		marginTop: 'auto',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 16,
		gap: 8,
	},
	deleteBtnText: { color: colors.error, fontSize: 16, fontWeight: '500' },
});
