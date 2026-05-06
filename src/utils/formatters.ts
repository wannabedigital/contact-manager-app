export const sanitizePhone = (phone: string): string => {
	return phone.replace(/[^\d+]/g, '');
};

export const formatDate = (value: string): string => {
	const digits = value.replace(/\D/g, '');
	let formatted = '';
	if (digits.length > 0) formatted += digits.slice(0, 2);
	if (digits.length >= 3) formatted += '.' + digits.slice(2, 4);
	if (digits.length >= 5) formatted += '.' + digits.slice(4, 8);
	return formatted;
};
