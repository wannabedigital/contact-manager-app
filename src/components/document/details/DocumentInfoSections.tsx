import { colors } from '@/src/constants/colors';
import { Document } from '@/src/types';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
	document: Document;
}

export const DocumentInfoSections = ({ document }: Props) => {
	const getStatusColor = (statusName: string) => {
		switch (statusName) {
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

	const statusColor = getStatusColor(document.status);

	return (
		<View style={styles.container}>
			<Text style={styles.sectionTitle}>Информация по договору</Text>

			<View style={styles.field}>
				<Text style={styles.fieldLabel}>Номер договора</Text>
				<View style={styles.infoBox}>
					<Text style={styles.infoText}>{document.document_number}</Text>
				</View>
			</View>

			<View style={styles.row}>
				<View style={styles.flexField}>
					<Text style={styles.fieldLabel}>Дата заключения</Text>
					<View style={styles.infoBox}>
						<Text style={styles.infoText}>{document.start_date}</Text>
					</View>
				</View>
				<View style={styles.flexField}>
					<Text style={styles.fieldLabel}>Дата окончания</Text>
					<View style={styles.infoBox}>
						<Text style={styles.infoText}>{document.end_date || '—'}</Text>
					</View>
				</View>
			</View>

			<View style={styles.field}>
				<Text style={styles.fieldLabel}>Предмет договора</Text>
				<View style={[styles.infoBox, styles.multiLineBox]}>
					<Text style={styles.infoText}>{document.subject || '—'}</Text>
				</View>
			</View>

			<View style={styles.field}>
				<Text style={styles.fieldLabel}>Сумма договора</Text>
				<View style={styles.infoBox}>
					<Text style={styles.infoText}>
						{document.amount ? `${document.amount} ₽` : '—'}
					</Text>
				</View>
			</View>

			<View style={styles.field}>
				<Text style={styles.fieldLabel}>Примечание</Text>
				<View style={[styles.infoBox, styles.multiLineBox]}>
					<Text style={styles.infoText}>{document.notes || '—'}</Text>
				</View>
			</View>

			<View style={styles.field}>
				<Text style={styles.fieldLabel}>Статус договора</Text>
				<View
					style={[
						styles.infoBox,
						{ borderColor: statusColor, backgroundColor: statusColor + '15' },
					]}
				>
					<Text
						style={[styles.infoText, { color: statusColor, fontWeight: '600' }]}
					>
						{document.status}
					</Text>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.surface,
		padding: 16,
		marginBottom: 8,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: colors.textPrimary,
		marginBottom: 16,
	},
	row: {
		flexDirection: 'row',
		gap: 16,
		marginBottom: 14,
	},
	field: {
		marginBottom: 14,
	},
	flexField: {
		flex: 1,
	},
	fieldLabel: {
		fontSize: 13,
		fontWeight: '500',
		color: colors.textSecondary,
		marginBottom: 6,
	},
	infoBox: {
		backgroundColor: colors.background,
		borderWidth: 1,
		borderColor: colors.divider,
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 10,
		justifyContent: 'center',
	},
	multiLineBox: {
		minHeight: 60,
		justifyContent: 'flex-start',
	},
	infoText: {
		fontSize: 15,
		color: colors.textPrimary,
	},
});
