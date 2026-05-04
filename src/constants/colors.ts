export const colors = {
	primary: '#2B7FD4',
	primaryLight: '#EBF4FF',
	primaryDark: '#1A5FA8',
	background: '#F5F7FA',
	surface: '#FFFFFF',
	textPrimary: '#1A1A2E',
	textSecondary: '#6B7280',
	divider: '#E5E7EB',
	success: '#22C55E',
	warning: '#F59E0B',
	error: '#EF4444',
	neutral: '#9CA3AF',
} as const;

export type ColorKey = keyof typeof colors;
