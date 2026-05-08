import { colors } from '@/src/constants/colors';
import { useContactStore } from '@/src/store/useContactStore';
import { router } from 'expo-router';
import React from 'react';
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';

export const GroupChips = () => {
	const { groups, selectedGroupId, setSelectedGroupId, deleteGroup } =
		useContactStore();

	const { showActionSheetWithOptions } = useActionSheet();

	const handleLongPress = (id: number, name: string) => {
		const options = [
			'Настроить порядок',
			'Изменить группу',
			'Удалить группу',
			'Отмена',
		];
		const destructiveButtonIndex = 2;
		const cancelButtonIndex = 3;

		showActionSheetWithOptions(
			{
				options,
				cancelButtonIndex,
				destructiveButtonIndex,
				title: `Управление группой "${name}"`,
			},
			(selectedIndex) => {
				switch (selectedIndex) {
					case 0:
						router.push(`/groups`);
						break;
					case 1:
						router.push(`/groups/${id}`);
						break;
					case 2:
						deleteGroup(id);
						break;
				}
			},
		);
	};

	return (
		<View style={styles.container}>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}
			>
				<TouchableOpacity
					style={[styles.chip, selectedGroupId === null && styles.chipActive]}
					onPress={() => setSelectedGroupId(null)}
				>
					<Text
						style={[
							styles.chipText,
							selectedGroupId === null && styles.chipTextActive,
						]}
					>
						Все
					</Text>
				</TouchableOpacity>

				{groups.map((group) => (
					<TouchableOpacity
						key={group.id}
						style={[
							styles.chip,
							selectedGroupId === group.id && styles.chipActive,
						]}
						onPress={() => setSelectedGroupId(group.id)}
						onLongPress={() => handleLongPress(group.id, group.name)}
						delayLongPress={500}
					>
						<Text
							style={[
								styles.chipText,
								selectedGroupId === group.id && styles.chipTextActive,
							]}
						>
							{group.name}
						</Text>
					</TouchableOpacity>
				))}
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.surface,
		marginTop: 4,
		marginHorizontal: 6,
		padding: 2,
		borderWidth: 2,
		borderColor: colors.primaryLight,
		borderRadius: 28,
	},
	scrollContent: {
		padding: 2,
		gap: 8,
	},
	chip: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 24,
		backgroundColor: colors.background,
		borderWidth: 2,
		borderColor: colors.primary,
	},
	chipActive: {
		backgroundColor: colors.primaryDark,
		borderColor: colors.primaryDark,
	},
	chipText: {
		fontSize: 14,
		color: colors.textPrimary,
		fontWeight: '500',
	},
	chipTextActive: {
		color: colors.surface,
	},
});
