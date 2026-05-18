import { GroupListItem } from '@/src/components/group/GroupListItem';
import { colors } from '@/src/constants/colors';
import { useGroupList } from '@/src/hooks/useGroupList';
import { Group } from '@/src/types/contact';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DragList, { DragListRenderItemInfo } from 'react-native-draglist';

export default function GroupsIndexScreen() {
	const { localGroups, handleReorder, handleOptions } = useGroupList();

	const renderItem = useCallback(
		({ item, onDragStart, isActive }: DragListRenderItemInfo<Group>) => {
			return (
				<GroupListItem
					item={item}
					isActive={isActive}
					onDragStart={onDragStart}
					onPress={() => router.push(`/groups/${item.id}`)}
					onOptions={() => handleOptions(item.id, item.name)}
				/>
			);
		},
		[handleOptions],
	);

	const renderEmpty = useCallback(
		() => (
			<View style={styles.emptyContainer}>
				<Text style={styles.emptyText}>У вас пока нет созданных групп.</Text>
			</View>
		),
		[],
	);

	const renderFooter = useCallback(
		() => (
			<TouchableOpacity
				style={styles.createButton}
				onPress={() => router.push('/groups/new')}
			>
				<Ionicons name='add-circle-outline' size={24} color={colors.primary} />
				<Text style={styles.createButtonText}>Создать новую группу</Text>
			</TouchableOpacity>
		),
		[],
	);

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity
					onPress={() => router.back()}
					style={styles.headerButton}
				>
					<Ionicons name='arrow-back' size={24} color={colors.primary} />
				</TouchableOpacity>

				<Text style={styles.headerTitle}>Настройки групп</Text>

				<View style={styles.headerButton} />
			</View>

			<DragList
				data={localGroups}
				onReordered={handleReorder}
				keyExtractor={(item) => item.id.toString()}
				renderItem={renderItem}
				containerStyle={styles.dragContainer}
				contentContainerStyle={styles.listContainer}
				ListEmptyComponent={renderEmpty}
				ListFooterComponent={renderFooter}
			/>
		</View>
	);
}

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
	dragContainer: {
		flex: 1,
	},
	listContainer: {
		paddingBottom: 40,
	},
	createButton: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
		gap: 8,
	},
	createButtonText: {
		fontSize: 16,
		color: colors.primary,
		fontWeight: '500',
	},
	emptyContainer: {
		padding: 40,
		alignItems: 'center',
	},
	emptyText: {
		color: colors.textSecondary,
		textAlign: 'center',
		fontSize: 16,
	},
});
