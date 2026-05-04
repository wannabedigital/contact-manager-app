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
};

export const useContactStore = create<State>((set, get) => ({
	contacts: [],
	groups: [],
	selectedGroupId: null,
	isLoading: false,
	error: null,

	loadContacts: async () => {
		try {
			set({ isLoading: true, error: null });
			const data = await contactRepo.getAll();
			set({ contacts: data, isLoading: false });
		} catch (err) {
			set({ error: (err as Error).message, isLoading: false });
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
		}
	},

	deleteContact: async (id) => {
		try {
			await contactRepo.delete(id);
			set((state) => ({
				contacts: state.contacts.filter((c) => c.id !== id),
				error: null,
			}));
		} catch (err) {
			set({ error: (err as Error).message });
		}
	},

	loadGroups: async () => {
		try {
			const groups = await groupRepo.getAll();
			set({ groups });
		} catch (err) {
			set({ error: (err as Error).message });
		}
	},

	setSelectedGroupId: (id) => set({ selectedGroupId: id }),

	addGroup: async (name) => {
		try {
			await groupRepo.create(name);
			await get().loadGroups();
		} catch (err) {
			set({ error: (err as Error).message });
		}
	},

	deleteGroup: async (id) => {
		try {
			await groupRepo.delete(id);
			if (get().selectedGroupId === id) set({ selectedGroupId: null });
			await get().loadGroups();
			await get().loadContacts();
		} catch (err) {
			set({ error: (err as Error).message });
		}
	},
}));
