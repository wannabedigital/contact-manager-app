export const PHONE_TYPES = [
	'Мобильный',
	'Рабочий',
	'Домашний',
	'Другой',
] as const;
export const EMAIL_TYPES = ['Личный', 'Рабочий', 'Другой'] as const;
export const ADDRESS_TYPES = ['Домашний', 'Рабочий', 'Другой'] as const;

export type PhoneType = (typeof PHONE_TYPES)[number];
export type EmailType = (typeof EMAIL_TYPES)[number];
export type AddressType = (typeof ADDRESS_TYPES)[number];

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
	phones?: Omit<Phone, 'id' | 'contact_id'>[];
	emails?: Omit<Email, 'id' | 'contact_id'>[];
	addresses?: Omit<Address, 'id' | 'contact_id'>[];
	groupIds?: number[];
};
