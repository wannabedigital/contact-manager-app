import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { runMigrations } from '../src/database/migrations';

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await runMigrations();
      } catch (error) {
        console.error('Ошибка инициализации БД:', error);
      } finally {
        setReady(true);
      }
    };

    init();
  }, []);

  if (!ready) return null;

  return <Stack />;
}
