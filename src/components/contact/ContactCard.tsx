import { colors } from '@/src/constants/colors';
import { useContactActions } from '@/src/hooks/useContactActions';
import { Contact } from '@/src/types/contact';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
	contact: Contact;
};

export const ContactCard = ({ contact }: Props) => {
	const router = useRouter();

	const { handleCall, handleEmail } = useContactActions();

	const handleCardPress = () => {
		router.push(`/contact/${contact.id}`);
	};

	const activePhones =
		contact.phones?.filter((p) => p.phone_number.trim()) || [];
	const activeEmails =
		contact.emails?.filter((e) => e.email_address.trim()) || [];
	const hasPhones = activePhones.length > 0;
	const hasEmails = activeEmails.length > 0;

	return (
		<TouchableOpacity
			style={styles.container}
			onPress={handleCardPress}
			activeOpacity={0.7}
		>
			<View style={styles.avatar}>
				{contact.photo_uri ? (
					<Image
						source={{ uri: contact.photo_uri }}
						style={styles.avatarImage}
					/>
				) : (
					<Ionicons name='person-outline' size={36} color={colors.primary} />
				)}
			</View>

			<View style={styles.info}>
				<Text style={styles.name}>
					{contact.first_name} {contact.last_name}
				</Text>
				<Text style={styles.company}>{contact.company || ''}</Text>
			</View>

			<View style={styles.actions}>
				{hasEmails && (
					<TouchableOpacity
						style={styles.actionButton}
						onPress={(e) => {
							e.stopPropagation();
							handleEmail(activeEmails);
						}}
					>
						<Ionicons name='mail-outline' size={32} color={colors.primary} />
					</TouchableOpacity>
				)}
				{hasPhones && (
					<TouchableOpacity
						style={styles.actionButton}
						onPress={(e) => {
							e.stopPropagation();
							handleCall(activePhones);
						}}
					>
						<Ionicons name='call-outline' size={32} color={colors.primary} />
					</TouchableOpacity>
				)}
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		padding: 16,
		alignItems: 'center',
		backgroundColor: colors.surface,
		borderRadius: 8,
	},
	avatar: {
		width: 60,
		height: 60,
		borderRadius: 30,
		borderWidth: 2,
		borderColor: colors.primary,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 16,
		overflow: 'hidden',
	},
	avatarImage: {
		width: '100%',
		height: '100%',
	},
	info: {
		flex: 1,
	},
	name: {
		fontSize: 16,
		fontWeight: '600',
		color: colors.textPrimary,
	},
	company: {
		fontSize: 14,
		color: colors.textSecondary,
		marginTop: 2,
	},
	actions: {
		flexDirection: 'row',
		gap: 16,
	},
	actionButton: {
		width: 40,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
