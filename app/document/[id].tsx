import { DocumentInfoSections } from '@/src/components/document/details/DocumentInfoSections';
import { LinkedContactsSection } from '@/src/components/document/details/LinkedContactsSection';
import { Loading } from '@/src/components/ui/Loading';
import { colors } from '@/src/constants/colors';
import { useDocumentStore } from '@/src/store/useDocumentStore';
import { useContactStore } from '@/src/store/useContactStore';
import { DocumentWithContacts } from '@/src/repositories/documentRepo';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
	Alert,
	Linking,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Platform,
} from 'react-native';

import * as FileSystem from 'expo-file-system/legacy';
import * as IntentLauncher from 'expo-intent-launcher';

export default function DocumentDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();

	const { documents, loadDocuments, deleteDocument } = useDocumentStore();
	const { contacts, loadContacts } = useContactStore();

	const [document, setDocument] = useState<DocumentWithContacts | null>(null);

	useEffect(() => {
		if (documents.length === 0) loadDocuments();
		if (contacts.length === 0) loadContacts();
	}, [documents.length, contacts.length, loadDocuments, loadContacts]);

	useEffect(() => {
		const found = documents.find((d) => d.id.toString() === id);
		setDocument(found || null);
	}, [documents, id]);

	if (!document) return <Loading />;

	const handleDelete = () => {
		Alert.alert(
			'Удаление договора',
			`Вы уверены, что хотите удалить договор № "${document.document_number}"?`,
			[
				{ text: 'Отмена', style: 'cancel' },
				{
					text: 'Удалить',
					style: 'destructive',
					onPress: async () => {
						await deleteDocument(document.id);
						router.back();
					},
				},
			],
		);
	};

	const handleOpenFile = async () => {
		if (!document.file_uri) {
			Alert.alert(
				'Информация',
				'К данному договору не прикреплен электронный файл',
			);
			return;
		}

		try {
			if (Platform.OS === 'android') {
				const contentUri = await FileSystem.getContentUriAsync(
					document.file_uri,
				);

				await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
					data: contentUri,
					flags: 1,
				});
			} else {
				const supported = await Linking.canOpenURL(document.file_uri);
				if (supported) {
					await Linking.openURL(document.file_uri);
				} else {
					Alert.alert('Ошибка', 'Не удалось открыть файл на данном устройстве');
				}
			}
		} catch (error) {
			console.error('Ошибка при открытии файла:', error);
			Alert.alert(
				'Ошибка',
				'Произошла ошибка при попытке открыть файл. Возможно, на устройстве нет приложения для чтения этого формата.',
			);
		}
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
				<Text style={styles.headerTitle} numberOfLines={1}>
					Договор № {document.document_number}
				</Text>
				<TouchableOpacity
					onPress={() => router.push(`/document/edit/${document.id}`)}
					style={styles.headerButton}
				>
					<Ionicons name='create-outline' size={28} color={colors.primary} />
				</TouchableOpacity>
			</View>

			<ScrollView
				style={styles.scrollView}
				showsVerticalScrollIndicator={false}
			>
				<DocumentInfoSections document={document} />

				<LinkedContactsSection
					contactIds={document.contactIds}
					allContacts={contacts}
				/>
				{document.file_uri && (
					<View style={styles.buttonContainer}>
						<TouchableOpacity
							style={styles.openFileButton}
							onPress={handleOpenFile}
						>
							<Text style={styles.openFileButtonText}>Перейти к документу</Text>
							<Ionicons
								name='document-attach-outline'
								size={24}
								color={colors.primary}
							/>
						</TouchableOpacity>
					</View>
				)}

				<View style={{ height: 120 }} />
			</ScrollView>

			<TouchableOpacity style={styles.fab} onPress={handleDelete}>
				<Ionicons name='trash-outline' size={28} color={colors.surface} />
			</TouchableOpacity>
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
		fontSize: 18,
		fontWeight: '600',
		color: colors.textPrimary,
		paddingHorizontal: 8,
	},
	scrollView: {
		flex: 1,
	},
	buttonContainer: {
		paddingHorizontal: 16,
		marginTop: 12,
		marginBottom: 24,
	},
	openFileButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colors.surface,
		borderWidth: 1,
		borderColor: colors.divider,
		borderRadius: 12,
		paddingVertical: 14,
		gap: 8,
		elevation: 1,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
	},
	openFileButtonText: {
		fontSize: 16,
		fontWeight: '600',
		color: colors.primary,
	},
	fab: {
		position: 'absolute',
		bottom: 32,
		right: 20,
		backgroundColor: colors.error,
		width: 56,
		height: 56,
		borderRadius: 28,
		justifyContent: 'center',
		alignItems: 'center',
		elevation: 5,
		shadowColor: colors.error,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
	},
});
