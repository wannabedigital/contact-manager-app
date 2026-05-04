import * as SQLite from 'expo-sqlite';

export const DB_NAME = 'contact_manager.db';

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
	if (dbInstance) {
		return dbInstance;
	}

	dbInstance = await SQLite.openDatabaseAsync(DB_NAME);
	await dbInstance.execAsync(`PRAGMA foreign_keys = ON;`);
	return dbInstance;
}

export async function closeDatabase(): Promise<void> {
	if (dbInstance) {
		await dbInstance.closeAsync();
		dbInstance = null;
	}
}
