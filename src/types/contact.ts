export type PhoneType = 'Мобильный' | 'Рабочий' | 'Домашний' | 'другой';
export type EmailType = 'Личный' | 'Рабочий' | 'Другой';
export type AddressType = 'Домашний' | 'Рабочий' | 'Другой';

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
};
