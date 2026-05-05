import { colors } from '@/src/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MoreScreen() {
	const router = useRouter();

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Дополнительно</Text>
			</View>

			<View style={styles.content}>
				<TouchableOpacity
					onPress={() => router.push('/groups')}
					style={styles.menuItem}
					activeOpacity={0.7}
				>
					<View style={styles.iconContainer}>
						<Ionicons
							name='folder-open-outline'
							size={24}
							color={colors.primary}
						/>
					</View>

					<Text style={styles.menuText}>Управление группами</Text>

					<Ionicons
						name='chevron-forward'
						size={20}
						color={colors.textSecondary}
					/>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
	},
	header: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 16,
		paddingTop: 44,
		paddingBottom: 16,
		backgroundColor: colors.surface,
		borderBottomWidth: 1,
		borderBottomColor: colors.divider,
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: '600',
		color: colors.textPrimary,
	},
	content: {
		marginTop: 20,
	},
	menuItem: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: colors.surface,
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderColor: colors.divider,
	},
	iconContainer: {
		padding: 8,
		borderRadius: 8,
		borderWidth: 2,
		borderColor: colors.primaryLight,
		backgroundColor: colors.background,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 16,
	},
	menuText: {
		flex: 1,
		fontSize: 16,
		fontWeight: '500',
		color: colors.textPrimary,
	},
});
