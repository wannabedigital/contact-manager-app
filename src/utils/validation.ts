export const validateEmail = (email: string): boolean => {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePhone = (phone: string): boolean => {
	return phone.length >= 10;
};

export const validateDate = (date: string): boolean => {
	const regex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
	if (!regex.test(date)) return false;

	const matches = date.match(regex);
	if (!matches) return false;

	const day = parseInt(matches[1], 10);
	const month = parseInt(matches[2], 10);
	const year = parseInt(matches[3], 10);

	if (month < 1 || month > 12 || year < 1900 || year > 2100) return false;

	const jsDate = new Date(year, month - 1, day);

	return (
		jsDate.getFullYear() === year &&
		jsDate.getMonth() === month - 1 &&
		jsDate.getDate() === day
	);
};
