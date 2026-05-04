import { colors } from '@/src/constants/colors';

import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

interface LoadingProps {
	text?: string;
}

export const Loading = ({ text }: LoadingProps) => {
	return (
		<View style={styles.loadingContainer}>
			<ActivityIndicator size='large' color={colors.primary} />
			<Text style={styles.loadingText}>{text || 'Загрузка...'}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.background,
	},
	loadingText: {
		marginTop: 10,
		color: colors.textSecondary,
	},
});
