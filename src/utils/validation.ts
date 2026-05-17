export const validateEmail = (email: string): boolean => {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePhone = (phone: string): boolean => {
	return phone.length >= 10;
};

export const validateDate = (date: string): boolean => {
	return !isNaN(Date.parse(date));
};
