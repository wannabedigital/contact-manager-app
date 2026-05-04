import { colors } from '@/src/constants/colors';
import { useContactStore } from '@/src/store/useContactStore';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

interface SelectedContactsListProps {
	selectedIds: number[];
	onRemove: (id: number) => void;
}

export const SelectedContactsList = ({
	selectedIds,
	onRemove,
}: SelectedContactsListProps) => {
	const { contacts } = useContactStore();
	const [chipToDelete, setChipToDelete] = useState<number | null>(null);

	const selectedContacts = useMemo(() => {
		return contacts.filter((c) => selectedIds.includes(c.id));
	}, [contacts, selectedIds]);

	const handleChipPress = (id: number) => {
		if (chipToDelete === id) {
			onRemove(id);
			setChipToDelete(null);
		} else {
			setChipToDelete(id);
		}
	};

	return (
		<View style={styles.container}>
			{selectedContacts.length > 0 && (
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.scrollContent}
				>
					{selectedContacts.map((c) => {
						const isDeleting = chipToDelete === c.id;
						return (
							<TouchableOpacity
								key={c.id}
								style={[styles.chip, isDeleting && styles.chipDeleting]}
								onPress={() => handleChipPress(c.id)}
							>
								<Text
									style={[
										styles.chipText,
										isDeleting && styles.chipTextDeleting,
									]}
								>
									{c.first_name} {c.last_name}
								</Text>
							</TouchableOpacity>
						);
					})}
				</ScrollView>
			)}

			<TouchableOpacity
				style={styles.addButton}
				onPress={() => router.push('/groups/select-contacts')}
			>
				<Ionicons name='add-circle-outline' size={20} color={colors.primary} />
				<Text style={styles.addButtonText}>Добавить контакты</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: { marginTop: 8 },
	scrollContent: { gap: 8, paddingBottom: 12 },
	chip: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 16,
		backgroundColor: colors.background,
		borderWidth: 1,
		borderColor: colors.divider,
	},
	chipDeleting: { backgroundColor: colors.error, borderColor: colors.error },
	chipText: { fontSize: 13, color: colors.textPrimary },
	chipTextDeleting: { color: colors.surface },
	addButton: { flexDirection: 'row', alignItems: 'center', gap: 6 },
	addButtonText: { fontSize: 14, color: colors.primary, fontWeight: '500' },
});
