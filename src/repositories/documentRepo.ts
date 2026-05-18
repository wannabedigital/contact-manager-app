import { getDatabase } from '@/src/database/database';
import { Document, DocumentInput } from '@/src/types';

export type DocumentWithContacts = Document & { contactIds: number[] };

export const documentRepo = {
	async getAll(): Promise<DocumentWithContacts[]> {
		const db = await getDatabase();

		const documents = (await db.getAllAsync(
			'SELECT * FROM documents ORDER BY created_at DESC',
		)) as Document[];

		if (documents.length === 0) return [];

		const relations = (await db.getAllAsync(
			'SELECT contact_id, document_id FROM contact_documents',
		)) as { contact_id: number; document_id: number }[];

		const relationsMap = new Map<number, number[]>();
		relations.forEach((r) => {
			if (!relationsMap.has(r.document_id)) relationsMap.set(r.document_id, []);
			relationsMap.get(r.document_id)!.push(r.contact_id);
		});

		return documents.map((doc) => ({
			...doc,
			contactIds: relationsMap.get(doc.id) || [],
		}));
	},

	async getByContactId(contactId: number): Promise<DocumentWithContacts[]> {
		const db = await getDatabase();

		const documents = (await db.getAllAsync(
			`SELECT d.* FROM documents d
             JOIN contact_documents cd ON d.id = cd.document_id
             WHERE cd.contact_id = ?
             ORDER BY d.created_at DESC`,
			contactId,
		)) as Document[];

		if (documents.length === 0) return [];

		const docIds = documents.map((d) => d.id);
		const placeholders = docIds.map(() => '?').join(',');

		const relations = (await db.getAllAsync(
			`SELECT contact_id, document_id FROM contact_documents WHERE document_id IN (${placeholders})`,
			...docIds,
		)) as { contact_id: number; document_id: number }[];

		const relationsMap = new Map<number, number[]>();
		relations.forEach((r) => {
			if (!relationsMap.has(r.document_id)) relationsMap.set(r.document_id, []);
			relationsMap.get(r.document_id)!.push(r.contact_id);
		});

		return documents.map((doc) => ({
			...doc,
			contactIds: relationsMap.get(doc.id) || [],
		}));
	},

	async getById(id: number): Promise<DocumentWithContacts | null> {
		const db = await getDatabase();

		const document = (await db.getFirstAsync(
			'SELECT * FROM documents WHERE id = ?',
			id,
		)) as Document | null;

		if (!document) return null;

		const relations = (await db.getAllAsync(
			'SELECT contact_id FROM contact_documents WHERE document_id = ?',
			id,
		)) as { contact_id: number }[];

		return {
			...document,
			contactIds: relations.map((r) => r.contact_id),
		};
	},

	async create(input: DocumentInput): Promise<number> {
		const db = await getDatabase();
		const { contactIds, ...core } = input;
		let createdId = 0;

		await db.withTransactionAsync(async () => {
			const result = await db.runAsync(
				`INSERT INTO documents (
                    document_number, start_date, end_date, subject,
                    amount, status, file_uri, notes
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
				core.document_number,
				core.start_date,
				core.end_date ?? null,
				core.subject ?? null,
				core.amount ?? null,
				core.status ?? 'Действующий',
				core.file_uri ?? null,
				core.notes ?? null,
			);

			createdId = result.lastInsertRowId as number;

			if (contactIds && contactIds.length > 0) {
				for (const cId of contactIds) {
					await db.runAsync(
						'INSERT INTO contact_documents (contact_id, document_id) VALUES (?, ?)',
						cId,
						createdId,
					);
				}
			}
		});

		return createdId;
	},

	async update(id: number, input: Partial<DocumentInput>): Promise<void> {
		const db = await getDatabase();
		const { contactIds, ...core } = input;

		await db.withTransactionAsync(async () => {
			if (Object.keys(core).length > 0) {
				const sets: string[] = [];
				const values: (string | number | null)[] = [];

				if (core.document_number !== undefined) {
					sets.push('document_number = ?');
					values.push(core.document_number);
				}
				if (core.start_date !== undefined) {
					sets.push('start_date = ?');
					values.push(core.start_date);
				}
				if (core.end_date !== undefined) {
					sets.push('end_date = ?');
					values.push(core.end_date ?? null);
				}
				if (core.subject !== undefined) {
					sets.push('subject = ?');
					values.push(core.subject ?? null);
				}
				if (core.amount !== undefined) {
					sets.push('amount = ?');
					values.push(core.amount ?? null);
				}
				if (core.status !== undefined) {
					sets.push('status = ?');
					values.push(core.status ?? 'Действующий');
				}
				if (core.file_uri !== undefined) {
					sets.push('file_uri = ?');
					values.push(core.file_uri ?? null);
				}
				if (core.notes !== undefined) {
					sets.push('notes = ?');
					values.push(core.notes ?? null);
				}

				sets.push('updated_at = CURRENT_TIMESTAMP');

				await db.runAsync(
					`UPDATE documents SET ${sets.join(', ')} WHERE id = ?`,
					...values,
					id,
				);
			}

			if (contactIds !== undefined) {
				await db.runAsync(
					'DELETE FROM contact_documents WHERE document_id = ?',
					id,
				);

				for (const cId of contactIds) {
					await db.runAsync(
						'INSERT INTO contact_documents (contact_id, document_id) VALUES (?, ?)',
						cId,
						id,
					);
				}
			}
		});
	},

	async delete(id: number): Promise<void> {
		const db = await getDatabase();
		await db.runAsync('DELETE FROM documents WHERE id = ?', id);
	},
};
