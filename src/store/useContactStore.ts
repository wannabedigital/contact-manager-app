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

export const useContactStore = create<State>((set) => ({
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

  addContact: async (contact) => {
    try {
      await contactRepo.create(contact);
      await useContactStore.getState().loadContacts();
    } catch (err) {
      console.error('[store] Ошибка в addContact:', err);
      set({ error: (err as Error).message });
    }
  },

  updateContact: async (id, contact) => {
    try {
      await contactRepo.update(id, contact);
      await useContactStore.getState().loadContacts();
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  deleteContact: async (id) => {
    try {
      await contactRepo.delete(id);
      await useContactStore.getState().loadContacts();
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  searchContacts: async (query) => {
    try {
      set({ isLoading: true, error: null });
      const results = await contactRepo.search(query);
      set({ contacts: results, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },
}));
