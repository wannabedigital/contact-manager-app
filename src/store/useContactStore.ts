import { contactRepo } from '@/src/repositories/contactRepo';
import { Contact, ContactInput } from '@/src/types/contact';
import { create } from 'zustand';

type State = {
  contacts: Contact[];
  isLoading: boolean;
  error: string | null;
  loadContacts: () => Promise<void>;
  addContact: (contact: ContactInput) => Promise<void>;
  updateContact: (id: number, contact: Partial<ContactInput>) => Promise<void>;
  deleteContact: (id: number) => Promise<void>;
  searchContacts: (query: string) => Promise<void>;
};

export const useContactStore = create<State>((set, get) => ({
  contacts: [],
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

  searchContacts: async (query) => {
    try {
      if (!query.trim()) {
        await get().loadContacts();
        return;
      }
      set({ isLoading: true, error: null });
      const results = await contactRepo.search(query);
      set({ contacts: results, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },
}));
