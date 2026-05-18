import { useContactStore } from '@/src/store/useContactStore';
import { Group } from '@/src/types';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

export const useGroupList = () => {
	const { showActionSheetWithOptions } = useActionSheet();
	const router = useRouter();

	const groups = useContactStore((state) => state.groups);
	const loadGroups = useContactStore((state) => state.loadGroups);
	const updateGroupsOrder = useContactStore((state) => state.updateGroupsOrder);
	const deleteGroup = useContactStore((state) => state.deleteGroup);

	const [localGroups, setLocalGroups] = useState<Group[]>([]);

	useEffect(() => {
		loadGroups();
	}, [loadGroups]);

	useEffect(() => {
		setLocalGroups(groups);
	}, [groups]);

	const handleReorder = useCallback(
		(fromIndex: number, toIndex: number) => {
			setLocalGroups((prev) => {
				const newList = [...prev];
				const [movedItem] = newList.splice(fromIndex, 1);
				newList.splice(toIndex, 0, movedItem);

				updateGroupsOrder(newList);

				return newList;
			});
		},
		[updateGroupsOrder],
	);

	const handleOptions = useCallback(
		(id: number, name: string) => {
			showActionSheetWithOptions(
				{
					options: ['Настроить группу', 'Удалить', 'Отмена'],
					destructiveButtonIndex: 1,
					cancelButtonIndex: 2,
					title: `Управление: ${name}`,
				},
				(buttonIndex) => {
					if (buttonIndex === 0) {
						router.push(`/groups/${id}`);
					} else if (buttonIndex === 1) {
						Alert.alert(
							'Удаление',
							`Вы уверены, что хотите удалить группу "${name}"?\nКонтакты при этом не удалятся.`,
							[
								{ text: 'Отмена', style: 'cancel' },
								{
									text: 'Удалить',
									style: 'destructive',
									onPress: () => deleteGroup(id),
								},
							],
						);
					}
				},
			);
		},
		[deleteGroup, router, showActionSheetWithOptions],
	);

	return {
		localGroups,
		handleReorder,
		handleOptions,
	};
};
