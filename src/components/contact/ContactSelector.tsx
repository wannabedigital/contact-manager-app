import { SearchBar } from '@/src/components/ui/SearchBar';
import { colors } from '@/src/constants/colors';
import { useContactStore } from '@/src/store/useContactStore';
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
	FlatList,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Image,
} from 'react-native';

interface ContactSelectorProps {
	initialSelectedIds: number[];
	onSave: (ids: number[]) => void;
	onCancel: () => void;
	title?: string;
}

export const ContactSelector = ({
	initialSelectedIds,
	onSave,
	onCancel,
	title = 'Выбор контактов',
}: ContactSelectorProps) => {
	const { contacts } = useContactStore();

	const [selectedIds, setSelectedIds] = useState<number[]>(initialSelectedIds);
	const [searchQuery, setSearchQuery] = useState('');
	const [chipToDelete, setChipToDelete] = useState<number | null>(null);

	const filteredContacts = useMemo(() => {
		if (!searchQuery.trim()) return contacts;
		const q = searchQuery.toLowerCase().trim();
		return contacts.filter(
			(c) =>
				c.first_name.toLowerCase().includes(q) ||
				c.last_name?.toLowerCase().includes(q) ||
				c.company?.toLowerCase().includes(q),
		);
	}, [contacts, searchQuery]);

	const selectedContacts = useMemo(() => {
		return contacts.filter((c) => selectedIds.includes(c.id));
	}, [contacts, selectedIds]);

	const toggleContact = (id: number) => {
		setChipToDelete(null);
		if (selectedIds.includes(id)) {
			setSelectedIds(selectedIds.filter((cid) => cid !== id));
		} else {
			setSelectedIds([...selectedIds, id]);
		}
	};

	const handleChipPress = (id: number) => {
		if (chipToDelete === id) {
			setSelectedIds(selectedIds.filter((cid) => cid !== id));
			setChipToDelete(null);
		} else {
			setChipToDelete(id);
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity onPress={onCancel} style={styles.headerButton}>
					<Ionicons name='close' size={28} color={colors.error} />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>{title}</Text>
				<TouchableOpacity
					onPress={() => onSave(selectedIds)}
					style={styles.headerButton}
				>
					<Ionicons name='checkmark' size={28} color={colors.success} />
				</TouchableOpacity>
			</View>

			<SearchBar isActive={true} onSearch={setSearchQuery} />

			{selectedContacts.length > 0 && (
				<View style={styles.chipsContainer}>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.chipsScroll}
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
				</View>
			)}

			<FlatList
				data={filteredContacts}
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item }) => {
					const isSelected = selectedIds.includes(item.id);
					return (
						<TouchableOpacity
							style={styles.listItem}
							onPress={() => toggleContact(item.id)}
							activeOpacity={0.7}
						>
							<View style={styles.avatar}>
								{item.photo_uri ? (
									<Image
										source={{ uri: item.photo_uri }}
										style={styles.avatarImage}
									/>
								) : (
									<Ionicons name='person' size={20} color={colors.primary} />
								)}
							</View>
							<View style={styles.listTextContainer}>
								<Text style={styles.listName}>
									{item.first_name} {item.last_name}
								</Text>
								{item.company && (
									<Text style={styles.listCompany}>{item.company}</Text>
								)}
							</View>
							{isSelected && (
								<Ionicons
									name='checkmark-circle'
									size={24}
									color={colors.primary}
								/>
							)}
						</TouchableOpacity>
					);
				}}
				ItemSeparatorComponent={() => <View style={styles.separator} />}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
	},
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
	headerButton: {
		width: 40,
		alignItems: 'center',
	},
	headerTitle: {
		flex: 1,
		textAlign: 'center',
		fontSize: 18,
		fontWeight: '600',
		color: colors.textPrimary,
	},
	chipsContainer: {
		backgroundColor: colors.surface,
		borderBottomWidth: 1,
		borderBottomColor: colors.divider,
		paddingVertical: 8,
	},
	chipsScroll: { paddingHorizontal: 16, gap: 8 },
	chip: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 16,
		backgroundColor: colors.primary,
		borderWidth: 1,
		borderColor: colors.primary,
	},
	chipDeleting: {
		backgroundColor: colors.error,
		borderColor: colors.error,
	},
	chipText: {
		fontSize: 13,
		color: colors.surface,
		fontWeight: '500',
	},
	chipTextDeleting: {
		color: colors.surface,
	},
	listItem: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
		backgroundColor: colors.surface,
	},
	avatar: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: colors.background,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 12,
		borderWidth: 2,
		borderColor: colors.divider,
	},
	avatarImage: {
		width: '100%',
		height: '100%',
	},
	listTextContainer: { flex: 1 },
	listName: {
		fontSize: 16,
		fontWeight: '500',
		color: colors.textPrimary,
	},
	listCompany: {
		fontSize: 13,
		color: colors.textSecondary,
		marginTop: 2,
	},
	separator: {
		height: 1,
		backgroundColor: colors.divider,
		marginLeft: 68,
	},
});
