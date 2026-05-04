import { colors } from '@/src/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, View } from 'react-native';

interface ContactHeaderProps {
	firstName: string;
	lastName?: string;
	patronymic?: string;
	photoUri?: string | null;
}

export const ContactHeader = ({
	firstName,
	lastName,
	patronymic,
	photoUri,
}: ContactHeaderProps) => {
	return (
		<View style={styles.container}>
			{photoUri ? (
				<Image source={{ uri: photoUri }} style={styles.avatar} />
			) : (
				<View style={[styles.avatar, styles.avatarPlaceholder]}>
					<Ionicons name='person-outline' size={64} color={colors.primary} />
				</View>
			)}
			<Text style={styles.fullName}>
				{lastName} {firstName}
			</Text>
			{patronymic && <Text style={styles.patronymic}>{patronymic}</Text>}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
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
	fullName: {
		fontSize: 22,
		fontWeight: '600',
		color: colors.textPrimary,
		marginTop: 16,
		textAlign: 'center',
	},
	patronymic: {
		fontSize: 18,
		color: colors.textSecondary,
		marginTop: 4,
		textAlign: 'center',
	},
});
