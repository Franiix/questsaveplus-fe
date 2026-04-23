import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { BacklogSortEnum } from '@/shared/enums/BacklogSort.enum';

const DEFAULT_SORT = BacklogSortEnum.NEWEST;

export function useBacklogSortPreference(storageKey = 'backlog_sort_order') {
 const [sortOrder, setSortOrderState] = useState<BacklogSortEnum>(DEFAULT_SORT);

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
