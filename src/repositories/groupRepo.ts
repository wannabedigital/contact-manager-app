import { getDatabase } from '@/src/database/database';
import { Group } from '@/src/types/contact';

export const groupRepo = {
	async getAll(): Promise<Group[]> {
		const db = await getDatabase();
		return (await db.getAllAsync(
			'SELECT * FROM groups ORDER BY name',
		)) as Group[];
	},

	async create(name: string): Promise<number> {
		const db = await getDatabase();
		const result = await db.runAsync(
			'INSERT INTO groups (name) VALUES (?)',
			name,
		);
		return result.lastInsertRowId as number;
	},

	async update(id: number, name: string): Promise<void> {
		const db = await getDatabase();
		await db.runAsync('UPDATE groups SET name = ? WHERE id = ?', [name, id]);
	},

	async delete(id: number): Promise<void> {
		const db = await getDatabase();
		await db.runAsync('DELETE FROM groups WHERE id = ?', [id]);
	},
};
