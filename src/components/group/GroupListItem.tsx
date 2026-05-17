import { colors } from '@/src/constants/colors';
import { Group } from '@/src/types/contact';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface Props {
	item: Group;
	isActive: boolean;
	onDragStart: () => void;
	onPress: () => void;
	onOptions: () => void;
}

export const GroupListItem = ({
	item,
	isActive,
	onDragStart,
	onPress,
	onOptions,
}: Props) => {
	return (
		<TouchableOpacity
			activeOpacity={0.8}
			style={[styles.rowItem, isActive && styles.rowItemActive]}
			onPress={onPress}
		>
			<TouchableOpacity
				style={styles.dragHandle}
				onPressIn={onDragStart}
				hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
			>
				<Ionicons name='reorder-two' size={24} color={colors.textSecondary} />
			</TouchableOpacity>

			<Text style={styles.rowTitle}>{item.name}</Text>

			<TouchableOpacity
				onPress={onOptions}
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

const styles = StyleSheet.create({
	rowItem: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: colors.surface,
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: colors.divider,
	},
	rowItemActive: {
		shadowColor: colors.primaryDark,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	dragHandle: {
		paddingHorizontal: 16,
		paddingVertical: 8,
	},
	rowTitle: {
		flex: 1,
		fontSize: 16,
		color: colors.textPrimary,
	},
	optionsHandle: {
		paddingHorizontal: 16,
		paddingVertical: 8,
	},
});
