import { getDatabase } from '@/src/database/database';
import { Group } from '@/src/types/contact';

export const groupRepo = {
	async getAll(): Promise<Group[]> {
		const db = await getDatabase();
		return (await db.getAllAsync(
			'SELECT * FROM groups ORDER BY sort_order ASC, created_at ASC',
		)) as Group[];
	},

	async create(name: string): Promise<number> {
		try {
			const db = await getDatabase();
			const maxOrderRes: any = await db.getFirstAsync(
				'SELECT MAX(sort_order) as maxOrder FROM groups',
			);
			const nextOrder = (maxOrderRes?.maxOrder ?? 0) + 1;

			console.log(
				`[REPO] SQL INSERT INTO groups: name=${name}, sort_order=${nextOrder}`,
			);
			const result = await db.runAsync(
				'INSERT INTO groups (name, sort_order) VALUES (?, ?)',
				name,
				nextOrder,
			);
			return result.lastInsertRowId as number;
		} catch (e) {
			console.error('[REPO] ОШИБКА ПРИ INSERT ГРУППЫ:', e);
			throw e;
		}
	},

	async updateOrder(groups: Group[]): Promise<void> {
		const db = await getDatabase();
		await db.withTransactionAsync(async () => {
			for (let i = 0; i < groups.length; i++) {
				await db.runAsync(
					'UPDATE groups SET sort_order = ? WHERE id = ?',
					i,
					groups[i].id,
				);
			}
		});
	},

	async update(
		groupId: number,
		name: string,
		contactIds: number[],
	): Promise<void> {
		const db = await getDatabase();
		await db.withTransactionAsync(async () => {
			await db.runAsync(
				'UPDATE groups SET name = ? WHERE id = ?',
				name,
				groupId,
			);
			await db.runAsync(
				'DELETE FROM contact_groups WHERE group_id = ?',
				groupId,
			);
			for (const cId of contactIds) {
				await db.runAsync(
					'INSERT INTO contact_groups (contact_id, group_id) VALUES (?, ?)',
					cId,
					groupId,
				);
			}
		});
	},

	async delete(id: number): Promise<void> {
		const db = await getDatabase();
		await db.runAsync('DELETE FROM groups WHERE id = ?', [id]);
	},
};
