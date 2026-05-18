import { create } from 'zustand';
import {
	documentRepo,
	DocumentWithContacts,
} from '@/src/repositories/documentRepo';
import { DocumentInput } from '@/src/types';

type DocumentState = {
	documents: DocumentWithContacts[];
	isLoading: boolean;
	error: string | null;

	loadDocuments: () => Promise<void>;
	addDocument: (input: DocumentInput) => Promise<void>;
	updateDocument: (id: number, input: Partial<DocumentInput>) => Promise<void>;
	deleteDocument: (id: number) => Promise<void>;
};

export const useDocumentStore = create<DocumentState>((set, get) => ({
	documents: [],
	isLoading: false,
	error: null,

	loadDocuments: async () => {
		try {
			set({ isLoading: true, error: null });
			const data = await documentRepo.getAll();
			set({ documents: data, isLoading: false });
		} catch (err) {
			set({ error: (err as Error).message, isLoading: false });
			console.error('[STORE] Ошибка при загрузке договоров:', err);
		}
	},

	addDocument: async (input) => {
		try {
			const newId = await documentRepo.create(input);
			const fullDocument = await documentRepo.getById(newId);

			if (fullDocument) {
				set((state) => ({
					documents: [fullDocument, ...state.documents],
					error: null,
				}));
			}
		} catch (err) {
			set({ error: (err as Error).message });
			console.error('[STORE] Ошибка при добавлении договора:', err);
		}
	},

	updateDocument: async (id, input) => {
		try {
			await documentRepo.update(id, input);
			const updatedDocument = await documentRepo.getById(id);

			if (updatedDocument) {
				set((state) => ({
					documents: state.documents.map((doc) =>
						doc.id === id ? updatedDocument : doc,
					),
					error: null,
				}));
			}
		} catch (err) {
			set({ error: (err as Error).message });
			console.error('[STORE] Ошибка при обновлении договора:', err);
		}
	},

	deleteDocument: async (id) => {
		const previousDocuments = get().documents;

		set({
			documents: previousDocuments.filter((doc) => doc.id !== id),
			error: null,
		});

		try {
			await documentRepo.delete(id);
		} catch (err) {
			set({ documents: previousDocuments, error: (err as Error).message });
			console.error('[STORE] Ошибка при удалении договора:', err);
		}
	},
}));
