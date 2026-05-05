import { ContactCard } from '@/src/components/contact/ContactCard';
import { GroupChips } from '@/src/components/contact/GroupChips';
import { SearchBar } from '@/src/components/ui/SearchBar';
import { colors } from '@/src/constants/colors';
import { useContactStore } from '@/src/store/useContactStore';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState, useMemo } from 'react';
import {
	FlatList,
	LayoutAnimation,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

export default function ContactsScreen() {
	const { contacts, loadContacts, selectedGroupId, loadGroups } =
		useContactStore();
	const [isSearchActive, setIsSearchActive] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');

	useEffect(() => {
		loadContacts();
		loadGroups();
	}, [loadContacts, loadGroups]);

	const toggleSearch = () => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		setIsSearchActive(!isSearchActive);
		setSearchQuery('');
	};

	const filteredContacts = useMemo(() => {
		let result = contacts;

		if (selectedGroupId !== null) {
			result = result.filter((c) =>
				c.groups?.some((g) => g.id === selectedGroupId),
			);
		}

		if (searchQuery.trim().length > 0) {
			const q = searchQuery.toLowerCase().trim();
			result = result.filter(
				(c) =>
					c.first_name.toLowerCase().includes(q) ||
					c.last_name?.toLowerCase().includes(q) ||
					c.company?.toLowerCase().includes(q) ||
					c.phones?.some((p) => p.phone_number.includes(q)) ||
					c.emails?.some((e) => e.email_address.toLowerCase().includes(q)),
			);
		}

		return result;
	}, [contacts, selectedGroupId, searchQuery]);

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<View
					style={[
						styles.topHeader,
						isSearchActive && { backgroundColor: colors.background },
					]}
				/>

				<SearchBar isActive={isSearchActive} onSearch={setSearchQuery} />

				<View style={styles.headerContent}>
					<View style={styles.headerLeft}>
						<TouchableOpacity style={styles.headerButton}>
							<Ionicons
								name='filter-outline'
								size={24}
								color={colors.primary}
							/>
						</TouchableOpacity>
					</View>

					<Text style={styles.headerTitle}>Контакты</Text>

					<View style={styles.headerRight}>
						<TouchableOpacity
							style={styles.headerButton}
							onPress={toggleSearch}
						>
							<Ionicons
								name={isSearchActive ? 'close' : 'search-outline'}
								size={24}
								color={colors.primary}
							/>
						</TouchableOpacity>
					</View>
				</View>
			</View>

			{/*<SearchBar isActive={isSearchActive} onSearch={setSearchQuery} />*/}

			<GroupChips />

			<FlatList
				data={filteredContacts}
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item }) => <ContactCard contact={item} />}
				contentContainerStyle={styles.listContent}
				ItemSeparatorComponent={() => <View style={styles.separator} />}
				ListEmptyComponent={
					<View style={styles.emptyContainer}>
						<Text style={styles.emptyText}>
							{searchQuery || selectedGroupId !== null
								? 'Ничего не найдено'
								: 'Нет контактов.'}
						</Text>
					</View>
				}
			/>

			<TouchableOpacity
				style={styles.fab}
				onPress={() => router.push('/contact/new')}
			>
				<Ionicons name='add' size={28} color={colors.surface} />
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
	},
	topHeader: {
		height: 28,
		width: '100%',
		backgroundColor: colors.surface,
	},
	header: {
		backgroundColor: colors.background,
	},
	headerContent: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingTop: 16,
		paddingBottom: 16,
		backgroundColor: colors.surface,
	},
	headerLeft: {
		width: 40,
	},
	headerTitle: {
		flex: 1,
		textAlign: 'center',
		fontSize: 20,
		fontWeight: '600',
		color: colors.textPrimary,
		paddingHorizontal: 16,
	},
	headerRight: {
		width: 40,
		alignItems: 'flex-end',
	},
	headerButton: {
		padding: 4,
	},
	clearButton: {
		padding: 4,
	},
	listContent: {
		paddingVertical: 4,
		paddingBottom: 20,
	},
	separator: {
		height: 4,
	},
	emptyContainer: {
		padding: 32,
		alignItems: 'center',
	},
	emptyText: {
		fontSize: 24,
		color: colors.textSecondary,
		textAlign: 'center',
	},
	fab: {
		position: 'absolute',
		bottom: 20,
		right: 20,
		backgroundColor: colors.primary,
		width: 56,
		height: 56,
		borderRadius: 28,
		justifyContent: 'center',
		alignItems: 'center',
		elevation: 5,
		shadowColor: colors.primaryDark,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
	},
});
