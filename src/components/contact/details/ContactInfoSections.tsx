import { InfoSection } from '@/src/components/contact/details/InfoSection';
import { Contact } from '@/src/types/contact';

interface ContactInfoSectionsProps {
	contact: Contact;
	onCall: (phones: any[]) => void;
	onSms: (phones: any[]) => void;
	onEmail: (emails: any[]) => void;
}

export const ContactInfoSections = ({
	contact,
	onCall,
	onSms,
	onEmail,
}: ContactInfoSectionsProps) => {
	const hasPhones = !!(contact.phones && contact.phones.length > 0);
	const hasEmails = !!(contact.emails && contact.emails.length > 0);
	const hasAddresses = !!(contact.addresses && contact.addresses.length > 0);

	const phoneItems =
		contact.phones?.map((p) => ({
			id: p.id,
			text: p.phone_number,
			subText: p.type,
			actions: [
				{ icon: 'chatbubble-outline' as const, onPress: () => onSms([p]) },
				{ icon: 'call-outline' as const, onPress: () => onCall([p]) },
			],
		})) || [];

	const emailItems =
		contact.emails?.map((e) => ({
			id: e.id,
			text: e.email_address,
			subText: e.type,
			actions: [{ icon: 'mail-outline' as const, onPress: () => onEmail([e]) }],
		})) || [];

	const addressItems =
		contact.addresses?.map((a) => ({
			id: a.id,
			text: a.address,
			subText: a.type,
		})) || [];

	return (
		<>
			{contact.company && (
				<InfoSection
					title='Организация'
					items={[{ text: contact.company }]}
					isSimpleText
				/>
			)}
			{contact.position && (
				<InfoSection
					title='Должность'
					items={[{ text: contact.position }]}
					isSimpleText
				/>
			)}
			{contact.date_of_birth && (
				<InfoSection
					title='Дата рождения'
					items={[{ text: contact.date_of_birth }]}
					isSimpleText
				/>
			)}
			{hasPhones && <InfoSection title='Телефоны' items={phoneItems} />}
			{hasEmails && (
				<InfoSection title='Электронная почта' items={emailItems} />
			)}
			{hasAddresses && <InfoSection title='Адреса' items={addressItems} />}
			{contact.notes && (
				<InfoSection
					title='Примечание'
					items={[{ text: contact.notes }]}
					isSimpleText
				/>
			)}
		</>
	);
};
