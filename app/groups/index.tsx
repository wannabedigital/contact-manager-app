import { colors } from '@/src/constants/colors';
import { useContactStore } from '@/src/store/useContactStore';
import { Ionicons } from '@expo/vector-icons';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import DraggableFlatList, {
	RenderItemParams,
} from 'react-native-draggable-flatlist';
import { Group } from '@/src/types/contact';

export default function GroupsIndexScreen() {
	const { showActionSheetWithOptions } = useActionSheet();

	const {
		groups,
		loadGroups,
		updateGroupsOrder,
		deleteGroup,
		setGroupsOrderLocally,
	} = useContactStore();
	const [isReordered, setIsReordered] = useState(false);

	useEffect(() => {
		loadGroups();
	}, [loadGroups]);

	useEffect(() => {
		const ids = groups.map((g) => g.id);
		console.warn('[DEBUG] groups в сторе:', ids);
	}, [groups]);

	const handleSaveOrder = () => {
		updateGroupsOrder(groups);
		setIsReordered(false);
	};

	const handleOptions = useCallback(
		(id: number, name: string) => {
			showActionSheetWithOptions(
				{
					options: ['Настроить группу', 'Удалить', 'Отмена'],
					destructiveButtonIndex: 1,
					cancelButtonIndex: 2,
					title: `Управление: ${name}`,
				},
				(buttonIndex) => {
					if (buttonIndex === 0) {
						router.push(`/groups/${id}`);
					} else if (buttonIndex === 1) {
						Alert.alert(
							'Удаление',
							`Точно удалить группу "${name}"? Контакты не удалятся.`,
							[
								{ text: 'Отмена', style: 'cancel' },
								{
									text: 'Удалить',
									style: 'destructive',
									onPress: () => deleteGroup(id),
								},
							],
						);
					}
				},
			);
		},
		[deleteGroup, showActionSheetWithOptions],
	);

	const renderItem = ({ item, drag, isActive }: RenderItemParams<Group>) => {
		return (
			<TouchableOpacity
				activeOpacity={0.8}
				style={[styles.rowItem, isActive && styles.rowItemActive]}
				onPress={() => router.push(`/groups/${item.id}`)}
			>
				<TouchableOpacity
					style={styles.dragHandle}
					onPressIn={drag}
					hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
				>
					<Ionicons name='reorder-two' size={24} color={colors.textSecondary} />
				</TouchableOpacity>

				<Text style={styles.rowTitle}>{item.name}</Text>

				<TouchableOpacity
					onPress={() => handleOptions(item.id, item.name)}
					style={styles.optionsHandle}
					hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
				>
					<Ionicons
						name='ellipsis-vertical'
						size={20}
						color={colors.textSecondary}
					/>
				</TouchableOpacity>
			</TouchableOpacity>
		);
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

				<Text style={styles.headerTitle}>Настройки групп</Text>

				<View style={styles.headerButton}>
					{isReordered && (
						<TouchableOpacity onPress={handleSaveOrder}>
							<Ionicons name='checkmark' size={24} color={colors.success} />
						</TouchableOpacity>
					)}
				</View>
			</View>

			<DraggableFlatList
				data={groups}
				onDragEnd={({ data }) => {
					const ids = data.map((g) => g.id);
					console.warn('[DEBUG] onDragEnd вызван, порядок:', ids);

					setGroupsOrderLocally(data);
					setIsReordered(true);
				}}
				removeClippedSubviews={false}
				keyExtractor={(item) => item.id.toString()}
				renderItem={renderItem}
				containerStyle={{ flex: 1 }}
				contentContainerStyle={styles.listContainer}
				ListEmptyComponent={
					<View style={styles.emptyContainer}>
						<Text style={styles.emptyText}>
							У вас пока нет созданных групп.
						</Text>
					</View>
				}
				ListFooterComponent={
					<TouchableOpacity
						style={styles.createButton}
						onPress={() => router.push('/groups/new')}
					>
						<Ionicons
							name='add-circle-outline'
							size={24}
							color={colors.primary}
						/>
						<Text style={styles.createButtonText}>Создать новую группу</Text>
					</TouchableOpacity>
				}
			/>
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
	listContainer: { paddingBottom: 40 },
	rowItem: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: colors.surface,
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: colors.divider,
	},
	rowItemActive: {
		backgroundColor: colors.primaryLight,
	},
	dragHandle: { paddingHorizontal: 16, paddingVertical: 8 },
	rowTitle: { flex: 1, fontSize: 16, color: colors.textPrimary },
	optionsHandle: { paddingHorizontal: 16, paddingVertical: 8 },
	createButton: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
		gap: 8,
	},
	createButtonText: { fontSize: 16, color: colors.primary, fontWeight: '500' },
	emptyContainer: { padding: 40, alignItems: 'center' },
	emptyText: { color: colors.textSecondary, textAlign: 'center', fontSize: 16 },
});
