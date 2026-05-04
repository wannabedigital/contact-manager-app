import { colors } from '@/src/constants/colors';
import { useContactStore } from '@/src/store/useContactStore';
import { Ionicons } from '@expo/vector-icons';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { router } from 'expo-router';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DraggableFlatList, {
	RenderItemParams,
	ScaleDecorator,
} from 'react-native-draggable-flatlist';

export default function GroupsIndexScreen() {
	const { groups, updateGroupsOrder, deleteGroup } = useContactStore();
	const { showActionSheetWithOptions } = useActionSheet();

	const handleOptions = (id: number, name: string) => {
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
	};

	const renderItem = ({ item, drag, isActive }: RenderItemParams<any>) => {
		return (
			<ScaleDecorator>
				<TouchableOpacity
					activeOpacity={1}
					style={[styles.rowItem, isActive && styles.rowItemActive]}
					onPress={() => router.push(`/groups/${item.id}`)}
					onLongPress={drag}
				>
					<TouchableOpacity onPressIn={drag} style={styles.dragHandle}>
						<Ionicons
							name='reorder-two'
							size={24}
							color={colors.textSecondary}
						/>
					</TouchableOpacity>

					<Text style={styles.rowTitle}>{item.name}</Text>

					<TouchableOpacity
						onPress={() => handleOptions(item.id, item.name)}
						style={styles.optionsHandle}
					>
						<Ionicons
							name='ellipsis-vertical'
							size={20}
							color={colors.textSecondary}
						/>
					</TouchableOpacity>
				</TouchableOpacity>
			</ScaleDecorator>
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
				<View style={styles.headerButton} />
			</View>

			<DraggableFlatList
				data={groups}
				onDragEnd={({ data }) => updateGroupsOrder(data)}
				keyExtractor={(item) => item.id.toString()}
				renderItem={renderItem}
				contentContainerStyle={styles.listContainer}
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
	headerButton: { width: 40, alignItems: 'center' },
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
		backgroundColor: colors.background,
		elevation: 5,
		shadowColor: '#000',
		shadowOpacity: 0.1,
		shadowRadius: 5,
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
});
