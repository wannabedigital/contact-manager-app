import { colors } from '@/src/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface SearchBarProps {
	isActive: boolean;
	onSearch: (query: string) => void;
}

export const SearchBar = ({ isActive, onSearch }: SearchBarProps) => {
	const [query, setQuery] = useState('');
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		if (!isActive) {
			setQuery('');
			onSearch('');
		}
	}, [isActive, onSearch]);

	const handleChange = useCallback(
		(text: string) => {
			setQuery(text);
			if (timeoutRef.current) clearTimeout(timeoutRef.current);

			timeoutRef.current = setTimeout(() => {
				onSearch(text);
			}, 300);
		},
		[onSearch],
	);

	const handleClear = () => {
		setQuery('');
		onSearch('');
	};

	if (!isActive) return null;

	return (
		<View style={styles.container}>
			<TextInput
				style={styles.input}
				placeholder='Поиск...'
				placeholderTextColor={colors.textSecondary}
				value={query}
				onChangeText={handleChange}
				autoFocus
				returnKeyType='search'
			/>
			{query.length > 0 && (
				<TouchableOpacity onPress={handleClear} style={styles.clearButton}>
					<Ionicons
						name='close-circle'
						size={20}
						color={colors.textSecondary}
					/>
				</TouchableOpacity>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		marginHorizontal: 8,
		marginTop: 6,
		marginBottom: 8,
		paddingHorizontal: 12,
		backgroundColor: colors.surface,
		borderRadius: 8,
		borderWidth: 2,
		borderColor: colors.divider,
		shadowColor: colors.primaryDark,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	input: {
		flex: 1,
		paddingVertical: 10,
		fontSize: 16,
		color: colors.textPrimary,
	},
	clearButton: {
		padding: 4,
	},
});
