import { colors } from '@/src/constants/colors';
import { useRouter } from 'expo-router';
import { useContactStore } from '@/src/store/useContactStore';
import { SelectedContactsList } from '@/src/components/contact/SelectedContactsList';
import { DOCUMENT_STATUSES, DocumentStatus } from '@/src/types';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useEffect, useState } from 'react';
import {
	Alert,
	KeyboardAvoidingView,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { validateDate } from '@/src/utils/validation';
import { formatDate } from '@/src/utils/formatters';

interface DocumentFormProps {
	initialData?: any;
	onSave: (data: any) => Promise<void>;
	onCancel: () => void;
	title: string;
}

export const DocumentForm = ({
	initialData,
	onSave,
	onCancel,
	title,
}: DocumentFormProps) => {
	const router = useRouter();

	const { tempSelectedIds, setTempSelectedIds } = useContactStore();
	const [focusedField, setFocusedField] = useState<string | null>(null);

	const [documentNumber, setDocumentNumber] = useState('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [subject, setSubject] = useState('');
	const [amount, setAmount] = useState('');
	const [status, setStatus] = useState<DocumentStatus>('Действующий');
	const [fileUri, setFileUri] = useState<string | null>(null);
	const [fileName, setFileName] = useState<string | null>(null);
	const [notes, setNotes] = useState('');

	useEffect(() => {
		if (initialData) {
			setDocumentNumber(initialData.document_number || '');
			setStartDate(initialData.start_date || '');
			setEndDate(initialData.end_date || '');
			setSubject(initialData.subject || '');
			setAmount(initialData.amount ? initialData.amount.toString() : '');
			setStatus(initialData.status || 'Действующий');
			setFileUri(initialData.file_uri || null);
			setFileName(
				initialData.file_uri ? initialData.file_uri.split('/').pop() : null,
			);
			setNotes(initialData.notes || '');

			setTempSelectedIds(initialData.contactIds || []);
		} else {
			setDocumentNumber('');
			setStartDate('');
			setEndDate('');
			setSubject('');
			setAmount('');
			setStatus('Действующий');
			setFileUri(null);
			setFileName(null);
			setNotes('');

			setTempSelectedIds([]);
		}
	}, [initialData, setTempSelectedIds]);

	const getInputStyle = (fieldName: string) => [
		styles.input,
		focusedField === fieldName && styles.inputFocused,
	];

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
				return colors.primary;
		}
	};

	const pickDocument = async () => {
		try {
			const result = await DocumentPicker.getDocumentAsync({
				type: [
					'application/pdf',
					'application/msword',
					'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
				],
				copyToCacheDirectory: true,
			});

			if (!result.canceled && result.assets[0]) {
				setFileUri(result.assets[0].uri);
				setFileName(result.assets[0].name);
			}
		} catch (error) {
			console.error('Ошибка при выборе файла:', error);
			Alert.alert('Ошибка', 'Не удалось выбрать файл');
		}
	};

	const removeContact = (id: number) => {
		setTempSelectedIds(tempSelectedIds.filter((cId) => cId !== id));
	};

	const handleSave = async () => {
		if (!documentNumber.trim()) {
			Alert.alert('Ошибка', 'Поле "Номер договора" обязательно для заполнения');
			return;
		}

		if (!startDate.trim() || !validateDate(startDate)) {
			Alert.alert(
				'Ошибка',
				'Укажите корректную дату заключения в формате ДД.ММ.ГГГГ',
			);
			return;
		}

		if (endDate.trim() && !validateDate(endDate)) {
			Alert.alert(
				'Ошибка',
				'Неверный формат даты окончания. Используйте ДД.ММ.ГГГГ',
			);
			return;
		}

		const documentData = {
			document_number: documentNumber.trim(),
			start_date: startDate,
			end_date: endDate.trim() || undefined,
			subject: subject.trim() || undefined,
			amount: amount ? parseFloat(amount) : undefined,
			status,
			file_uri: fileUri || undefined,
			notes: notes.trim() || undefined,
			contactIds: tempSelectedIds,
		};

		try {
			await onSave(documentData);
		} catch (error) {
			console.error('Ошибка сохранения договора:', error);
			Alert.alert('Ошибка', 'Не удалось сохранить договор');
		}
	};

	return (
		<KeyboardAvoidingView style={styles.container} behavior='padding'>
			<View style={styles.container}>
				<View style={styles.header}>
					<TouchableOpacity onPress={onCancel} style={styles.headerButton}>
						<Ionicons name='arrow-back' size={24} color={colors.primary} />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>{title}</Text>
					<TouchableOpacity onPress={handleSave} style={styles.headerButton}>
						<Ionicons name='checkmark' size={28} color={colors.success} />
					</TouchableOpacity>
				</View>

				<ScrollView
					style={styles.scrollView}
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps='handled'
					contentContainerStyle={styles.scrollViewContent}
				>
					<View style={styles.section}>
						<View style={styles.field}>
							<Text style={styles.fieldLabel}>Номер договора *</Text>
							<TextInput
								style={getInputStyle('documentNumber')}
								value={documentNumber}
								onChangeText={setDocumentNumber}
								placeholder='Например, 123-А'
								placeholderTextColor={colors.textSecondary}
								onFocus={() => setFocusedField('documentNumber')}
								onBlur={() => setFocusedField(null)}
							/>
						</View>

						<View style={styles.field}>
							<Text style={styles.fieldLabel}>Дата заключения *</Text>
							<TextInput
								style={getInputStyle('startDate')}
								value={startDate}
								onChangeText={(val) => setStartDate(formatDate(val))}
								placeholder='ДД.ММ.ГГГГ'
								placeholderTextColor={colors.textSecondary}
								keyboardType='numeric'
								maxLength={10}
								onFocus={() => setFocusedField('startDate')}
								onBlur={() => setFocusedField(null)}
							/>
						</View>

						<View style={styles.field}>
							<Text style={styles.fieldLabel}>Дата окончания</Text>
							<TextInput
								style={getInputStyle('endDate')}
								value={endDate}
								onChangeText={(val) => setEndDate(formatDate(val))}
								placeholder='ДД.ММ.ГГГГ'
								placeholderTextColor={colors.textSecondary}
								keyboardType='numeric'
								maxLength={10}
								onFocus={() => setFocusedField('endDate')}
								onBlur={() => setFocusedField(null)}
							/>
						</View>

						<View style={styles.field}>
							<Text style={styles.fieldLabel}>Сумма договора (₽)</Text>
							<TextInput
								style={getInputStyle('amount')}
								value={amount}
								onChangeText={setAmount}
								placeholder='0.00'
								placeholderTextColor={colors.textSecondary}
								keyboardType='numeric'
								onFocus={() => setFocusedField('amount')}
								onBlur={() => setFocusedField(null)}
							/>
						</View>

						<View style={styles.field}>
							<Text style={styles.fieldLabel}>Предмет договора</Text>
							<TextInput
								style={getInputStyle('subject')}
								value={subject}
								onChangeText={setSubject}
								placeholder='Краткое описание предмета...'
								placeholderTextColor={colors.textSecondary}
								onFocus={() => setFocusedField('subject')}
								onBlur={() => setFocusedField(null)}
							/>
						</View>
					</View>

					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Статус договора</Text>
						<View style={styles.dropdown}>
							{DOCUMENT_STATUSES.map((item) => {
								const isActive = status === item;
								const itemColor = getStatusColor(item);

								return (
									<TouchableOpacity
										key={item}
										style={[
											styles.dropdownItem,
											isActive && {
												borderColor: itemColor,
												backgroundColor: itemColor + '15',
											},
										]}
										onPress={() => setStatus(item)}
									>
										<Text
											style={[
												styles.dropdownItemText,
												isActive && { color: itemColor, fontWeight: '600' },
											]}
										>
											{item}
										</Text>
									</TouchableOpacity>
								);
							})}
						</View>
					</View>

					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Файл договора</Text>
						<TouchableOpacity
							style={styles.filePickerButton}
							onPress={pickDocument}
						>
							<Ionicons
								name={fileUri ? 'document-attach' : 'cloud-upload-outline'}
								size={24}
								color={colors.primary}
							/>
							<Text style={styles.filePickerText} numberOfLines={1}>
								{fileName ? fileName : 'Выбрать файл (PDF, DOC, DOCX)'}
							</Text>
						</TouchableOpacity>
						{fileUri && (
							<TouchableOpacity
								style={styles.clearFileButton}
								onPress={() => {
									setFileUri(null);
									setFileName(null);
								}}
							>
								<Text style={styles.clearFileText}>Удалить файл</Text>
							</TouchableOpacity>
						)}
					</View>

					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Привязанные контакты</Text>
						<SelectedContactsList
							selectedIds={tempSelectedIds}
							onRemove={removeContact}
							onAddPress={() => router.push('/document/select-contacts')}
						/>
					</View>

					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Примечания</Text>
						<TextInput
							style={[...getInputStyle('notes'), styles.textArea]}
							value={notes}
							onChangeText={setNotes}
							placeholder='Дополнительная информация...'
							placeholderTextColor={colors.textSecondary}
							multiline
							textAlignVertical='top'
							onFocus={() => setFocusedField('notes')}
							onBlur={() => setFocusedField(null)}
						/>
					</View>

					<View style={styles.bottomPadding} />
				</ScrollView>
			</View>
		</KeyboardAvoidingView>
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
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingTop: 44,
		paddingBottom: 16,
		backgroundColor: colors.surface,
		borderBottomWidth: 2,
		borderBottomColor: colors.divider,
	},
	headerButton: {
		width: 40,
		alignItems: 'center',
		justifyContent: 'center',
	},
	headerTitle: {
		flex: 1,
		textAlign: 'center',
		fontSize: 20,
		fontWeight: '600',
		color: colors.textPrimary,
	},
	scrollView: {
		flex: 1,
	},
	scrollViewContent: {
		flexGrow: 1,
		paddingBottom: 100,
	},
	section: {
		backgroundColor: colors.surface,
		padding: 16,
		marginBottom: 8,
	},
	sectionTitle: {
		fontSize: 14,
		fontWeight: '600',
		color: colors.textPrimary,
		marginBottom: 12,
	},
	field: {
		marginBottom: 16,
	},
	fieldLabel: {
		fontSize: 14,
		fontWeight: '500',
		color: colors.textPrimary,
		marginBottom: 6,
	},
	input: {
		backgroundColor: colors.surface,
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 10,
		fontSize: 16,
		color: colors.textPrimary,
		borderWidth: 2,
		borderColor: colors.primary,
	},
	inputFocused: {
		borderColor: colors.primaryDark,
	},
	dropdown: {
		marginTop: 4,
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8,
	},
	dropdownItem: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 16,
		backgroundColor: colors.background,
		borderWidth: 1,
		borderColor: colors.divider,
	},
	dropdownItemActive: {
		backgroundColor: colors.primary,
		borderColor: colors.primary,
	},
	dropdownItemText: {
		fontSize: 13,
		color: colors.textPrimary,
	},
	dropdownItemTextActive: {
		color: colors.surface,
	},
	filePickerButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: colors.background,
		borderWidth: 1,
		borderColor: colors.divider,
		borderRadius: 8,
		padding: 12,
		gap: 10,
	},
	filePickerText: {
		fontSize: 14,
		color: colors.textPrimary,
		flex: 1,
	},
	clearFileButton: {
		marginTop: 8,
		alignSelf: 'flex-start',
	},
	clearFileText: {
		fontSize: 14,
		color: colors.error,
		fontWeight: '500',
	},
	textArea: {
		minHeight: 100,
		paddingTop: 10,
		paddingBottom: 10,
	},
	bottomPadding: {
		height: 40,
	},
});
