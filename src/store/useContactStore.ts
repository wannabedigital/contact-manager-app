import { create } from 'zustand';
import { contactRepo } from '../repositories/contactRepo';
import { Contact, ContactInput } from '../types/contact';

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
    console.log('🗄️ [store] addContact вызван с данными:', contact);
    try {
      console.log('🗄️ [store] Вызов contactRepo.create...');
      await contactRepo.create(contact);
      console.log(
        '🗄️ [store] contactRepo.create завершён, обновляем список...',
      );
      await useContactStore.getState().loadContacts();
      console.log('🗄️ [store] Список контактов обновлён');
    } catch (err) {
      console.error('🗄️ [store] Ошибка в addContact:', err);
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
