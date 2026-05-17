import { useActionSheet } from '@expo/react-native-action-sheet';
import * as Linking from 'expo-linking';
import { sanitizePhone } from '@/src/utils/formatters';

export const useContactActions = () => {
	const { showActionSheetWithOptions } = useActionSheet();

	const handleCall = (phones: any[]) => {
		if (phones.length === 1) {
			Linking.openURL(`tel:${sanitizePhone(phones[0].phone_number)}`);
		} else {
			const options = [
				...phones.map((p) => `${p.phone_number} (${p.type})`),
				'Отмена',
			];
			showActionSheetWithOptions(
				{
					options,
					cancelButtonIndex: options.length - 1,
					title: 'Выберите номер',
				},
				(idx) => {
					if (idx !== undefined && idx !== options.length - 1) {
						Linking.openURL(`tel:${sanitizePhone(phones[idx].phone_number)}`);
					}
				},
			);
		}
	};

	const handleSms = (phones: any[]) => {
		if (phones.length === 1) {
			Linking.openURL(`sms:${sanitizePhone(phones[0].phone_number)}`);
		} else {
			const options = [
				...phones.map((p) => `${p.phone_number} (${p.type})`),
				'Отмена',
			];
			showActionSheetWithOptions(
				{
					options,
					cancelButtonIndex: options.length - 1,
					title: 'Выберите номер для SMS',
				},
				(idx) => {
					if (idx !== undefined && idx !== options.length - 1) {
						Linking.openURL(`sms:${sanitizePhone(phones[idx].phone_number)}`);
					}
				},
			);
		}
	};

	const handleEmail = (emails: any[]) => {
		if (emails.length === 1) {
			Linking.openURL(`mailto:${emails[0].email_address}`);
		} else {
			const options = [
				...emails.map((e) => `${e.email_address} (${e.type})`),
				'Отмена',
			];
			showActionSheetWithOptions(
				{
					options,
					cancelButtonIndex: options.length - 1,
					title: 'Выберите email',
				},
				(idx) => {
					if (idx !== undefined && idx !== options.length - 1) {
						Linking.openURL(`mailto:${emails[idx].email_address}`);
					}
				},
			);
		}
	};

	return { handleCall, handleSms, handleEmail };
};
