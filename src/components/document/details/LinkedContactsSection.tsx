import { colors } from '@/src/constants/colors';
import { Contact } from '@/src/types';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ContactCard } from '@/src/components/contact/ContactCard';

interface Props {
	contactIds: number[];
	allContacts: Contact[];
}

export const LinkedContactsSection = ({ contactIds, allContacts }: Props) => {
	const linkedContacts = allContacts.filter((c) => contactIds.includes(c.id));

	if (linkedContacts.length === 0) return null;

	return (
		<View style={styles.container}>
			<Text style={styles.sectionTitle}>Привязанные контакты</Text>

			<View style={styles.listContainer}>
				{linkedContacts.map((contact) => (
					<ContactCard key={contact.id} contact={contact} />
				))}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.surface,
		paddingVertical: 16,
		marginBottom: 8,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: colors.textPrimary,
		marginBottom: 12,
		paddingHorizontal: 16,
	},
	listContainer: {
		gap: 4,
	},
});
