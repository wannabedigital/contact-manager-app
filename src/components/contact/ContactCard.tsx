import { colors } from '@/src/constants/colors';
import { Contact } from '@/src/types/contact';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
	contact: Contact;
};

export const ContactCard = ({ contact }: Props) => {
	const { showActionSheetWithOptions } = useActionSheet();
	const router = useRouter();

	const handlePhonePress = () => {
		const phones = contact.phones?.filter((p) => p.phone_number.trim()) || [];
		if (phones.length === 0) return;

		if (phones.length === 1) {
			const number = phones[0].phone_number.replace(/\D/g, '');
			Linking.openURL(`tel:${number}`);
		} else {
			const options = [
				...phones.map((p) => `${p.phone_number} (${p.type})`),
				'Отмена',
			];
			const cancelButtonIndex = options.length - 1;

			showActionSheetWithOptions(
				{ options, cancelButtonIndex, title: 'Выберите номер' },
				(selectedIndex) => {
					if (
						selectedIndex !== undefined &&
						selectedIndex !== cancelButtonIndex
					) {
						const phone = phones[selectedIndex];
						const number = phone.phone_number.replace(/\D/g, '');
						Linking.openURL(`tel:${number}`);
					}
				},
			);
		}
	};

	const handleEmailPress = () => {
		const emails = contact.emails?.filter((e) => e.email_address.trim()) || [];
		if (emails.length === 0) return;

		if (emails.length === 1) {
			Linking.openURL(`mailto:${emails[0].email_address}`);
		} else {
			const options = [
				...emails.map((e) => `${e.email_address} (${e.type})`),
				'Отмена',
			];
			const cancelButtonIndex = options.length - 1;

			showActionSheetWithOptions(
				{ options, cancelButtonIndex, title: 'Выберите email' },
				(selectedIndex) => {
					if (
						selectedIndex !== undefined &&
						selectedIndex !== cancelButtonIndex
					) {
						const email = emails[selectedIndex];
						Linking.openURL(`mailto:${email.email_address}`);
					}
				},
			);
		}
	};

	const handleCardPress = () => {
		router.push(`/contact/${contact.id}`);
	};

	const hasPhones = contact.phones && contact.phones.length > 0;
	const hasEmails = contact.emails && contact.emails.length > 0;

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
							handleEmailPress();
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
							handlePhonePress();
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
