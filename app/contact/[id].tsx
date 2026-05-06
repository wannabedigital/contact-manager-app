import { ContactHeader } from '@/src/components/contact/details/ContactHeader';
import { ContactInfoSections } from '@/src/components/contact/details/ContactInfoSections';
import { QuickActions } from '@/src/components/contact/details/QuickActions';
import { Loading } from '@/src/components/ui/Loading';
import { colors } from '@/src/constants/colors';
import { useContactActions } from '@/src/hooks/useContactActions';
import { useContactStore } from '@/src/store/useContactStore';
import { Contact } from '@/src/types/contact';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
	Alert,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

export default function ContactDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const { contacts, loadContacts, deleteContact } = useContactStore();
	const [contact, setContact] = useState<Contact | null>(null);

	const { handleCall, handleSms, handleEmail } = useContactActions();

	useEffect(() => {
		if (contacts.length === 0) loadContacts();
	}, [contacts.length, loadContacts]);

	useEffect(() => {
		const found = contacts.find((c) => c.id.toString() === id);
		setContact(found || null);
	}, [contacts, id]);

	if (!contact) return <Loading />;

	const handleDelete = () => {
		Alert.alert(
			'Удаление контакта',
			`Удалить "${contact.first_name} ${contact.last_name}"?`,
			[
				{ text: 'Отмена', style: 'cancel' },
				{
					text: 'Удалить',
					style: 'destructive',
					onPress: async () => {
						await deleteContact(contact.id);
						router.back();
					},
				},
			],
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
				<Text style={styles.headerTitle} numberOfLines={1}>
					{contact.first_name} {contact.last_name}
				</Text>
				<TouchableOpacity
					onPress={() => router.push(`/contact/edit/${contact.id}`)}
					style={styles.headerButton}
				>
					<Ionicons name='create-outline' size={28} color={colors.primary} />
				</TouchableOpacity>
			</View>

			<ScrollView
				style={styles.scrollView}
				showsVerticalScrollIndicator={false}
			>
				<ContactHeader
					firstName={contact.first_name}
					lastName={contact.last_name}
					patronymic={contact.patronymic}
					photoUri={contact.photo_uri}
				/>

				<QuickActions
					hasPhones={!!(contact.phones && contact.phones.length > 0)}
					hasEmails={!!(contact.emails && contact.emails.length > 0)}
					onCall={() => handleCall(contact.phones || [])}
					onSms={() => handleSms(contact.phones || [])}
					onEmail={() => handleEmail(contact.emails || [])}
				/>

				<ContactInfoSections
					contact={contact}
					onCall={handleCall}
					onSms={handleSms}
					onEmail={handleEmail}
				/>

				<View style={{ height: 100 }} />
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
		fontSize: 20,
		fontWeight: '600',
		color: colors.textPrimary,
		paddingHorizontal: 16,
	},
	scrollView: {
		flex: 1,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	loadingText: {
		fontSize: 16,
		color: colors.textSecondary,
	},
	avatarContainer: {
		alignItems: 'center',
		paddingVertical: 32,
		backgroundColor: colors.surface,
		marginBottom: 8,
	},
	avatar: {
		width: 120,
		height: 120,
		borderRadius: 60,
	},
	avatarPlaceholder: {
		backgroundColor: colors.background,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 2,
		borderColor: colors.primary,
	},
	patronymic: {
		fontSize: 18,
		color: colors.textSecondary,
		marginTop: 4,
		textAlign: 'center',
	},
	fullName: {
		fontSize: 22,
		fontWeight: '600',
		color: colors.textPrimary,
		marginTop: 16,
		textAlign: 'center',
	},
	company: {
		fontSize: 16,
		color: colors.textPrimary,
		marginTop: 4,
		textAlign: 'center',
	},
	position: {
		fontSize: 14,
		color: colors.textSecondary,
		marginTop: 2,
		textAlign: 'center',
	},
	quickActions: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 16,
		paddingHorizontal: 64,
		backgroundColor: colors.surface,
		marginBottom: 8,
		gap: 24,
	},
	quickActionButton: {
		alignItems: 'center',
	},
	quickActionText: {
		fontSize: 12,
		color: colors.primary,
		marginTop: 4,
	},
	infoText: {
		fontSize: 16,
		color: colors.textPrimary,
	},
	notesText: {
		fontSize: 14,
		color: colors.textPrimary,
	},
	addressText: {
		fontSize: 16,
		color: colors.textPrimary,
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
	itemRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 8,
		borderBottomWidth: 1,
		borderBottomColor: colors.divider,
	},
	itemContent: {
		flex: 1,
		marginVertical: 8,
	},
	itemText: {
		fontSize: 16,
		color: colors.textPrimary,
	},
	itemType: {
		fontSize: 13,
		color: colors.textSecondary,
		marginTop: 2,
	},
	itemActions: {
		flexDirection: 'row',
		gap: 12,
	},
	iconButton: {
		padding: 4,
	},
	addressRow: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		paddingVertical: 8,
		borderBottomWidth: 1,
		borderBottomColor: colors.divider,
	},
	addressContent: {
		marginVertical: 8,
	},
	bottomPadding: {
		paddingBottom: 100,
	},
	fab: {
		position: 'absolute',
		bottom: 48,
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
