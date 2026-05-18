import { colors } from '@/src/constants/colors';
import { DocumentWithContacts } from '@/src/repositories/documentRepo';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
	document: DocumentWithContacts;
}

export const DocumentCard = ({ document }: Props) => {
	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Действующий':
				return colors.success;
			case 'Приостановлен':
				return colors.warning;
			case 'Расторгнут':
				return colors.error;
			case 'Завершен':
				return colors.neutral;
			default:
				return colors.textSecondary;
		}
	};

	return (
		<TouchableOpacity
			style={styles.card}
			activeOpacity={0.7}
			onPress={() => router.push(`/document/${document.id}`)}
		>
			<View style={styles.contentContainer}>
				<Text style={styles.title} numberOfLines={1}>
					{document.document_number}
				</Text>

				<Text style={styles.subText}>
					{document.start_date}{' '}
					{document.end_date ? `— ${document.end_date}` : ''}
				</Text>

				{document.amount ? (
					<Text style={styles.subText}>{document.amount} ₽</Text>
				) : (
					<Text style={styles.subText}>—</Text>
				)}
			</View>

			<View
				style={[
					styles.statusCircle,
					{ backgroundColor: getStatusColor(document.status) },
				]}
			/>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	card: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: colors.surface,
		paddingVertical: 12,
		paddingHorizontal: 16,
	},
	contentContainer: {
		flex: 1,
		marginRight: 16,
	},
	title: {
		fontSize: 16,
		fontWeight: '600',
		color: colors.textPrimary,
		marginBottom: 6,
	},
	subText: {
		fontSize: 14,
		color: colors.textSecondary,
		marginBottom: 2,
	},
	statusCircle: {
		width: 28,
		height: 28,
		borderRadius: 14,
	},
});
