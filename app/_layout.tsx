import { getDatabase } from '@/src/database/database';
import { runMigrations } from '@/src/database/migrations';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';

export default function RootLayout() {
	const [ready, setReady] = useState(false);

	useEffect(() => {
		const init = async () => {
			try {
				await runMigrations();
				await getDatabase();
			} catch (error) {
				console.error('Ошибка инициализации БД:', error);
			} finally {
				setReady(true);
			}
		};

		init();
	}, []);

	if (!ready) return null;

	return (
		<ActionSheetProvider>
			<Stack screenOptions={{ headerShown: false }} />
		</ActionSheetProvider>
	);
}
