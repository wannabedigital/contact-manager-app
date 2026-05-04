import { ComingSoon } from '@/src/components/ui/ComingSoon';
import { useRouter } from 'expo-router';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function MoreScreen() {
	const router = useRouter();
	return (
		<View style={styles.container}>
			<TouchableOpacity
				onPress={() => router.push('/groups/index')}
				style={styles.button}
			>
				<Text>Перейти к группам</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	button: {
		padding: 10,
		backgroundColor: '',
	},
});
