import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { BacklogSortEnum } from '@/shared/enums/BacklogSort.enum';

export function useBacklogSortPreference(
 storageKey = 'backlog_sort_order',
 defaultSort = BacklogSortEnum.NEWEST,
) {
 const [sortOrder, setSortOrderState] = useState<BacklogSortEnum>(defaultSort);

 useEffect(() => {
  SecureStore.getItemAsync(storageKey).then((stored) => {
   if (stored && Object.values(BacklogSortEnum).includes(stored as BacklogSortEnum)) {
    setSortOrderState(stored as BacklogSortEnum);
   }
  });
 }, [storageKey]);

 function setSortOrder(value: BacklogSortEnum) {
  setSortOrderState(value);
  void SecureStore.setItemAsync(storageKey, value);
 }

 return { sortOrder, setSortOrder };
}
