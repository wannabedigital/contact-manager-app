export const PHONE_TYPES = [
	'Мобильный',
	'Рабочий',
	'Домашний',
	'Другой',
] as const;
export const EMAIL_TYPES = ['Личный', 'Рабочий', 'Другой'] as const;
export const ADDRESS_TYPES = ['Домашний', 'Рабочий', 'Другой'] as const;

export const DOCUMENT_STATUSES = [
	'Действующий',
	'Завершен',
	'Приостановлен',
	'Расторгнут',
] as const;

export type PhoneType = (typeof PHONE_TYPES)[number];
export type EmailType = (typeof EMAIL_TYPES)[number];
export type AddressType = (typeof ADDRESS_TYPES)[number];
export type DocumentStatus = (typeof DOCUMENT_STATUSES)[number];

export interface Phone {
	id: number;
	contact_id: number;
	phone_number: string;
	type: PhoneType;
}

export interface Email {
	id: number;
	contact_id: number;
	email_address: string;
	type: EmailType;
}

export interface Address {
	id: number;
	contact_id: number;
	address: string;
	type: AddressType;
}

export interface Group {
	id: number;
	name: string;
	sort_order: number;
	created_at: string;
}

export interface Contact {
	id: number;
	first_name: string;
	last_name?: string;
	patronymic?: string;
	company?: string;
	position?: string;
	date_of_birth?: string;
	notes?: string;
	photo_uri?: string;
	created_at: string;
	updated_at: string;
	phones?: Phone[];
	emails?: Email[];
	addresses?: Address[];
	groups?: Group[];
	documents?: Document[];
}

export type ContactInput = {
	first_name: string;
	last_name?: string;
	patronymic?: string;
	company?: string;
	position?: string;
	date_of_birth?: string;
	notes?: string;
	photo_uri?: string;
	phones?: (Omit<Phone, 'contact_id'> & { id?: number })[];
	emails?: (Omit<Email, 'contact_id'> & { id?: number })[];
	addresses?: (Omit<Address, 'contact_id'> & { id?: number })[];
	groupIds?: number[];
	documentIds?: number[];
};

export interface Document {
	id: number;
	document_number: string;
	start_date: string;
	end_date?: string | null;
	subject?: string | null;
	amount?: number | null;
	status: DocumentStatus;
	file_uri?: string | null;
	notes?: string | null;
	created_at: string;
	updated_at: string;
}

export type DocumentInput = {
	document_number: string;
	start_date: string;
	end_date?: string | null;
	subject?: string | null;
	amount?: number | null;
	status?: DocumentStatus;
	file_uri?: string | null;
	notes?: string | null;
	contactIds?: number[];
};
