import { getDatabase } from '@/src/database/database';
import {
  Address,
  Contact,
  ContactInput,
  Email,
  Phone,
} from '@/src/types/contact';

export const contactRepo = {
  async getAll(): Promise<Contact[]> {
    const db = await getDatabase();
    const contacts = (await db.getAllAsync(
      'SELECT * FROM contacts ORDER BY first_name, last_name',
    )) as Contact[];

    if (contacts.length === 0) return [];

    const contactIds = contacts.map((c) => c.id);

    const phones = (await db.getAllAsync(
      `SELECT * FROM contact_phones WHERE contact_id IN (${contactIds.map(() => '?').join(',')})`,
      ...contactIds,
    )) as Phone[];

    const emails = (await db.getAllAsync(
      `SELECT * FROM contact_emails WHERE contact_id IN (${contactIds.map(() => '?').join(',')})`,
      ...contactIds,
    )) as Email[];

    const addresses = (await db.getAllAsync(
      `SELECT * FROM contact_addresses WHERE contact_id IN (${contactIds.map(() => '?').join(',')})`,
      ...contactIds,
    )) as Address[];

    const phonesMap = new Map<number, Phone[]>();
    phones.forEach((p) => {
      if (!phonesMap.has(p.contact_id)) phonesMap.set(p.contact_id, []);
      phonesMap.get(p.contact_id)!.push(p);
    });

    const emailsMap = new Map<number, Email[]>();
    emails.forEach((e) => {
      if (!emailsMap.has(e.contact_id)) emailsMap.set(e.contact_id, []);
      emailsMap.get(e.contact_id)!.push(e);
    });

    const addressesMap = new Map<number, Address[]>();
    addresses.forEach((a) => {
      if (!addressesMap.has(a.contact_id)) addressesMap.set(a.contact_id, []);
      addressesMap.get(a.contact_id)!.push(a);
    });

    return contacts.map((c) => ({
      ...c,
      phones: phonesMap.get(c.id) || [],
      emails: emailsMap.get(c.id) || [],
      addresses: addressesMap.get(c.id) || [],
    }));
  },

  async getById(id: number): Promise<Contact | null> {
    const db = await getDatabase();
    const contact = (await db.getFirstAsync(
      'SELECT * FROM contacts WHERE id = ?',
      id,
    )) as Contact | null;
    if (!contact) return null;

    contact.phones = (await db.getAllAsync(
      'SELECT * FROM contact_phones WHERE contact_id = ?',
      contact.id,
    )) as Phone[];
    contact.emails = (await db.getAllAsync(
      'SELECT * FROM contact_emails WHERE contact_id = ?',
      contact.id,
    )) as Email[];
    contact.addresses = (await db.getAllAsync(
      'SELECT * FROM contact_addresses WHERE contact_id = ?',
      contact.id,
    )) as Address[];
    return contact;
  },

  async create(contact: ContactInput): Promise<number> {
    const db = await getDatabase();
    const { phones, emails, addresses, ...core } = contact;

    const result = await db.runAsync(
      'INSERT INTO contacts (first_name, last_name, patronymic, company, position, date_of_birth, notes, photo_uri) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      core.first_name,
      core.last_name ?? null,
      core.patronymic ?? null,
      core.company ?? null,
      core.position ?? null,
      core.date_of_birth ?? null,
      core.notes ?? null,
      core.photo_uri ?? null,
    );

    const contactId = result.lastInsertRowId as number;

    if (phones?.length) {
      for (const p of phones) {
        await db.runAsync(
          'INSERT INTO contact_phones (contact_id, phone_number, type) VALUES (?, ?, ?)',
          contactId,
          p.phone_number,
          p.type,
        );
      }
    }
    if (emails?.length) {
      for (const e of emails) {
        await db.runAsync(
          'INSERT INTO contact_emails (contact_id, email_address, type) VALUES (?, ?, ?)',
          contactId,
          e.email_address,
          e.type,
        );
      }
    }
    if (addresses?.length) {
      for (const a of addresses) {
        await db.runAsync(
          'INSERT INTO contact_addresses (contact_id, address, type) VALUES (?, ?, ?)',
          contactId,
          a.address,
          a.type,
        );
      }
    }

    return contactId;
  },

  async update(id: number, contact: Partial<ContactInput>): Promise<void> {
    const db = await getDatabase();
    const { phones, emails, addresses, ...core } = contact;

    if (Object.keys(core).length > 0) {
      const sets: string[] = [];
      const values: (string | null)[] = [];
      if (core.first_name !== undefined) {
        sets.push('first_name = ?');
        values.push(core.first_name);
      }
      if (core.last_name !== undefined) {
        sets.push('last_name = ?');
        values.push(core.last_name ?? null);
      }
      if (core.patronymic !== undefined) {
        sets.push('patronymic = ?');
        values.push(core.patronymic ?? null);
      }
      if (core.company !== undefined) {
        sets.push('company = ?');
        values.push(core.company ?? null);
      }
      if (core.position !== undefined) {
        sets.push('position = ?');
        values.push(core.position ?? null);
      }
      if (core.date_of_birth !== undefined) {
        sets.push('date_of_birth = ?');
        values.push(core.date_of_birth ?? null);
      }
      if (core.notes !== undefined) {
        sets.push('notes = ?');
        values.push(core.notes ?? null);
      }
      if (core.photo_uri !== undefined) {
        sets.push('photo_uri = ?');
        values.push(core.photo_uri ?? null);
      }
      sets.push('updated_at = CURRENT_TIMESTAMP');

      await db.runAsync(
        `UPDATE contacts SET ${sets.join(', ')} WHERE id = ?`,
        ...values,
        id,
      );
    }

    if (phones) {
      await db.runAsync('DELETE FROM contact_phones WHERE contact_id = ?', id);
      for (const p of phones) {
        await db.runAsync(
          'INSERT INTO contact_phones (contact_id, phone_number, type) VALUES (?, ?, ?)',
          id,
          p.phone_number,
          p.type,
        );
      }
    }
    if (emails) {
      await db.runAsync('DELETE FROM contact_emails WHERE contact_id = ?', id);
      for (const e of emails) {
        await db.runAsync(
          'INSERT INTO contact_emails (contact_id, email_address, type) VALUES (?, ?, ?)',
          id,
          e.email_address,
          e.type,
        );
      }
    }
    if (addresses) {
      await db.runAsync(
        'DELETE FROM contact_addresses WHERE contact_id = ?',
        id,
      );
      for (const a of addresses) {
        await db.runAsync(
          'INSERT INTO contact_addresses (contact_id, address, type) VALUES (?, ?, ?)',
          id,
          a.address,
          a.type,
        );
      }
    }
  },

  async delete(id: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM contacts WHERE id = ?', id);
  },

  async search(query: string): Promise<Contact[]> {
    const db = await getDatabase();
    const searchTerm = `%${query}%`;

    const contacts = (await db.getAllAsync(
      `
      SELECT DISTINCT c.* FROM contacts c
      LEFT JOIN contact_phones p ON c.id = p.contact_id
      LEFT JOIN contact_emails e ON c.id = e.contact_id
      WHERE c.first_name LIKE ? OR c.last_name LIKE ? OR c.company LIKE ? OR p.phone_number LIKE ? OR e.email_address LIKE ?
      ORDER BY c.first_name, c.last_name
      `,
      searchTerm,
      searchTerm,
      searchTerm,
      searchTerm,
      searchTerm,
    )) as Contact[];

    if (contacts.length === 0) return [];

    const contactIds = contacts.map((c) => c.id);

    const phones = (await db.getAllAsync(
      `SELECT * FROM contact_phones WHERE contact_id IN (${contactIds.map(() => '?').join(',')})`,
      ...contactIds,
    )) as Phone[];

    const emails = (await db.getAllAsync(
      `SELECT * FROM contact_emails WHERE contact_id IN (${contactIds.map(() => '?').join(',')})`,
      ...contactIds,
    )) as Email[];

    const addresses = (await db.getAllAsync(
      `SELECT * FROM contact_addresses WHERE contact_id IN (${contactIds.map(() => '?').join(',')})`,
      ...contactIds,
    )) as Address[];

    const phonesMap = new Map<number, Phone[]>();
    phones.forEach((p) => {
      if (!phonesMap.has(p.contact_id)) phonesMap.set(p.contact_id, []);
      phonesMap.get(p.contact_id)!.push(p);
    });

    const emailsMap = new Map<number, Email[]>();
    emails.forEach((e) => {
      if (!emailsMap.has(e.contact_id)) emailsMap.set(e.contact_id, []);
      emailsMap.get(e.contact_id)!.push(e);
    });

    const addressesMap = new Map<number, Address[]>();
    addresses.forEach((a) => {
      if (!addressesMap.has(a.contact_id)) addressesMap.set(a.contact_id, []);
      addressesMap.get(a.contact_id)!.push(a);
    });

    return contacts.map((c) => ({
      ...c,
      phones: phonesMap.get(c.id) || [],
      emails: emailsMap.get(c.id) || [],
      addresses: addressesMap.get(c.id) || [],
    }));
  },
};
