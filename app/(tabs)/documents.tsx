import { DocumentCard } from '@/src/components/document/DocumentCard';
import { SearchBar } from '@/src/components/ui/SearchBar';
import { colors } from '@/src/constants/colors';
import { useDocumentStore } from '@/src/store/useDocumentStore';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
	FlatList,
	LayoutAnimation,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

export default function DocumentsScreen() {
	const { documents, loadDocuments } = useDocumentStore();
	const [isSearchActive, setIsSearchActive] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');

	useEffect(() => {
		loadDocuments();
	}, [loadDocuments]);

	const toggleSearch = () => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		setIsSearchActive(!isSearchActive);
		setSearchQuery('');
	};

	const filteredDocuments = useMemo(() => {
		let result = documents;

		if (searchQuery.trim().length > 0) {
			const q = searchQuery.toLowerCase().trim();
			result = result.filter(
				(d) =>
					d.document_number.toLowerCase().includes(q) ||
					d.subject?.toLowerCase().includes(q) ||
					d.notes?.toLowerCase().includes(q),
			);
		}

		return result;
	}, [documents, searchQuery]);

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

					<Text style={styles.headerTitle}>Договоры</Text>

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

			<FlatList
				data={filteredDocuments}
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item }) => <DocumentCard document={item} />}
				contentContainerStyle={styles.listContent}
				ItemSeparatorComponent={() => <View style={styles.separator} />}
				ListEmptyComponent={
					<View style={styles.emptyContainer}>
						<Text style={styles.emptyText}>
							{searchQuery
								? 'По вашему запросу ничего не найдено'
								: 'У вас пока нет добавленных договоров'}
						</Text>
					</View>
				}
			/>

			<TouchableOpacity
				style={styles.fab}
				onPress={() => router.push('/document/new')}
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
	listContent: {
		paddingVertical: 12,
		paddingBottom: 80,
	},
	separator: {
		height: 1,
		backgroundColor: colors.divider,
	},
	emptyContainer: {
		padding: 32,
		alignItems: 'center',
		marginTop: 40,
	},
	emptyText: {
		fontSize: 18,
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
