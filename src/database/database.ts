import * as SQLite from 'expo-sqlite';

export const DB_NAME = 'contact_manager.db';

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync(DB_NAME);
  await db.execAsync(`PRAGMA foreign_keys = ON;`);
  return db;
}
