import { contactRepo } from '@/src/repositories/contactRepo';
import { groupRepo } from '@/src/repositories/groupRepo';
import { Contact, ContactInput, Group } from '@/src/types/contact';
import { create } from 'zustand';

type State = {
	contacts: Contact[];
	groups: Group[];
	selectedGroupId: number | null;
	isLoading: boolean;
	error: string | null;

	loadContacts: () => Promise<void>;
	addContact: (contact: ContactInput) => Promise<void>;
	updateContact: (id: number, contact: Partial<ContactInput>) => Promise<void>;
	deleteContact: (id: number) => Promise<void>;

	loadGroups: () => Promise<void>;
	setSelectedGroupId: (id: number | null) => void;
	addGroup: (name: string) => Promise<void>;
	deleteGroup: (id: number) => Promise<void>;

	tempSelectedIds: number[];
	setTempSelectedIds: (ids: number[]) => void;
	updateGroupsOrder: (groups: Group[]) => Promise<void>;

	createGroupWithMembers: (name: string, contactIds: number[]) => Promise<void>;
	updateGroupDetails: (
		id: number,
		name: string,
		contactIds: number[],
	) => Promise<void>;
};

export const useContactStore = create<State>((set, get) => ({
	contacts: [],
	groups: [],
	selectedGroupId: null,
	isLoading: false,
	error: null,
	tempSelectedIds: [],

	loadContacts: async () => {
		try {
			set({ isLoading: true, error: null });
			const data = await contactRepo.getAll();
			set({ contacts: data, isLoading: false });
		} catch (err) {
			set({ error: (err as Error).message, isLoading: false });
			console.error('[STORE] Ошибка при загрузке контактов:', err);
		}
	},

	addContact: async (contactInput) => {
		try {
			const newId = await contactRepo.create(contactInput);
			const fullContact = await contactRepo.getById(newId);
			if (fullContact) {
				set((state) => ({
					contacts: [fullContact, ...state.contacts],
					error: null,
				}));
			}
		} catch (err) {
			set({ error: (err as Error).message });
			console.error('[STORE] Ошибка при добавлении контакта:', err);
		}
	},

	updateContact: async (id, contactInput) => {
		try {
			await contactRepo.update(id, contactInput);
			const updatedContact = await contactRepo.getById(id);
			if (updatedContact) {
				set((state) => ({
					contacts: state.contacts.map((c) =>
						c.id === id ? updatedContact : c,
					),
					error: null,
				}));
			}
		} catch (err) {
			set({ error: (err as Error).message });
			console.error('[STORE] Ошибка при обновлении контакта:', err);
		}
	},

	deleteContact: async (id) => {
		{
			const previousContacts = get().contacts;
			set({
				contacts: previousContacts.filter((c) => c.id !== id),
				error: null,
			});

			try {
				await contactRepo.delete(id);
			} catch (err) {
				set({ contacts: previousContacts, error: (err as Error).message });
				console.error('[STORE] Ошибка при удалении контакта:', err);
			}
		}
	},

	loadGroups: async () => {
		try {
			const groups = await groupRepo.getAll();
			set({ groups });
		} catch (err) {
			set({ error: (err as Error).message });
			console.error('[STORE] Ошибка при загрузке групп:', err);
		}
	},

	setSelectedGroupId: (id) => set({ selectedGroupId: id }),

	addGroup: async (name) => {
		try {
			await groupRepo.create(name);
			await get().loadGroups();
		} catch (err) {
			set({ error: (err as Error).message });
			console.error('[STORE] Ошибка при добавлении группы:', err);
		}
	},

	deleteGroup: async (id) => {
		const previousGroups = get().groups;
		const previousSelectedGroupId = get().selectedGroupId;
		set({
			groups: previousGroups.filter((g) => g.id !== id),
			selectedGroupId:
				previousSelectedGroupId === id ? null : previousSelectedGroupId,
			error: null,
		});

		try {
			await groupRepo.delete(id);

			await get().loadContacts();
		} catch (err) {
			set({
				groups: previousGroups,
				selectedGroupId: previousSelectedGroupId,
				error: (err as Error).message,
			});
			console.error('[STORE] Ошибка при удалении группы:', err);
		}
	},

	setTempSelectedIds: (ids) => set({ tempSelectedIds: ids }),

	updateGroupsOrder: async (newGroups) => {
		const previousGroups = get().groups;

		set({ groups: [...newGroups], error: null });

		try {
			await groupRepo.updateOrder(newGroups);
		} catch (err) {
			set({ groups: previousGroups, error: (err as Error).message });
			console.error('[STORE] Ошибка при сохранении порядка групп:', err);
		}
	},

	createGroupWithMembers: async (name, contactIds) => {
		try {
			const newId = await groupRepo.create(name);
			await groupRepo.update(newId, name, contactIds);
			await get().loadGroups();
			await get().loadContacts();
		} catch (err) {
			set({ error: (err as Error).message });
			console.error('[STORE] ОШИБКА при создании группы с контактами:', err);
		}
	},

	updateGroupDetails: async (id, name, contactIds) => {
		try {
			await groupRepo.update(id, name, contactIds);
			await get().loadGroups();
			await get().loadContacts();
		} catch (err) {
			set({ error: (err as Error).message });
			console.error('[STORE] ОШИБКА при обновлении группы:', err);
		}
	},
}));
