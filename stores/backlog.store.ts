import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { CreateBacklogItemDto, UpdateBacklogItemDto } from '@/shared/dto/BacklogItem.dto';
import type { BacklogItemEntity } from '@/shared/entities/BacklogItem.entity';
import { type BacklogItemModel, toBacklogItemModel } from '@/shared/models/BacklogItem.model';

type BacklogListTarget = 'backlogItems' | 'recentBacklogItems' | 'archivedBacklogItems';
type BacklogMutationKind = 'create' | 'update' | 'delete' | null;

type ReadAllBacklogOptions = {
 orderBy?: 'updated_at' | 'added_at';
 ascending?: boolean;
 limit?: number;
 target?: BacklogListTarget;
 includeArchived?: boolean;
};

interface BacklogState {
 backlog: BacklogItemModel | null;
 backlogItems: BacklogItemModel[];
 recentBacklogItems: BacklogItemModel[];
 archivedBacklogItems: BacklogItemModel[];
 isFetching: boolean;
 isReadingCurrent: boolean;
 isReadingList: boolean;
 isReadingRecent: boolean;
 isMutating: boolean;
 activeMutation: BacklogMutationKind;
 error: string | null;
 read: (userId: string, gameId: number) => Promise<BacklogItemModel | null>;
 readAll: (userId: string, options?: ReadAllBacklogOptions) => Promise<BacklogItemModel[]>;
 create: (dto: CreateBacklogItemDto) => Promise<BacklogItemModel | null>;
 update: (id: string, dto: Omit<UpdateBacklogItemDto, 'id'>) => Promise<BacklogItemModel | null>;
 delete: (id: string) => Promise<void>;
 clearCurrentBacklog: () => void;
 clearBacklog: () => void;
 clearError: () => void;
}

function mapBacklogItems(items: BacklogItemEntity[] | null): BacklogItemModel[] {
 return (items ?? []).map((item) => toBacklogItemModel(item));
}

export const useBacklogStore = create<BacklogState>(
 (set, get): BacklogState => ({
  backlog: null,
  backlogItems: [],
  recentBacklogItems: [],
  archivedBacklogItems: [],
  isFetching: false,
  isReadingCurrent: false,
  isReadingList: false,
  isReadingRecent: false,
  isMutating: false,
  activeMutation: null,
  error: null,

  read: async (userId, gameId) => {
   set({ isFetching: true, isReadingCurrent: true, error: null });

   const { data, error } = await supabase
    .from('backlog_items')
    .select('*')
    .eq('game_id', gameId)
    .eq('user_id', userId)
    .maybeSingle();

   if (error) {
    set((state) => ({
     isFetching: state.isReadingList || state.isReadingRecent,
     isReadingCurrent: false,
     error: error.message,
    }));
    return null;
   }

   const backlog = data ? toBacklogItemModel(data) : null;
   set((state) => ({
    backlog,
    isFetching: state.isReadingList || state.isReadingRecent,
    isReadingCurrent: false,
   }));
   return backlog;
  },

  readAll: async (userId, options) => {
   const target = options?.target ?? 'backlogItems';
   const isRecentTarget = target === 'recentBacklogItems';
   const readFlag = isRecentTarget
    ? ({ isReadingRecent: true } as const)
    : ({ isReadingList: true } as const);

   set({ isFetching: true, error: null, ...readFlag });

   const orderBy = options?.orderBy ?? 'updated_at';
   const includeArchived = options?.includeArchived ?? false;

   let query = supabase
    .from('backlog_items')
    .select('*')
    .eq('user_id', userId)
    .eq('is_archived', includeArchived)
    .order(orderBy, { ascending: options?.ascending ?? false });

   if (options?.limit) {
    query = query.limit(options.limit);
   }

   let { data, error } = await query;

   if (error?.message?.includes('updated_at') && orderBy === 'updated_at') {
    let fallbackQuery = supabase
     .from('backlog_items')
     .select('*')
     .eq('user_id', userId)
     .eq('is_archived', includeArchived)
     .order('added_at', { ascending: options?.ascending ?? false });

    if (options?.limit) {
     fallbackQuery = fallbackQuery.limit(options.limit);
    }

    ({ data, error } = await fallbackQuery);
   }

   if (error) {
    set((state) => ({
     isFetching: isRecentTarget
      ? state.isReadingCurrent || state.isReadingList
      : state.isReadingCurrent || state.isReadingRecent,
     isReadingList: isRecentTarget ? state.isReadingList : false,
     isReadingRecent: isRecentTarget ? false : state.isReadingRecent,
     error: error.message,
    }));
    return [];
   }

   const items = mapBacklogItems(data);
   set((state) => ({
    [target]: items,
    isFetching: isRecentTarget
     ? state.isReadingCurrent || state.isReadingList
     : state.isReadingCurrent || state.isReadingRecent,
    isReadingList: isRecentTarget ? state.isReadingList : false,
    isReadingRecent: isRecentTarget ? false : state.isReadingRecent,
   }));
   return items;
  },

  create: async (dto) => {
   set({ isMutating: true, activeMutation: 'create', error: null });

   const { data, error } = await supabase.from('backlog_items').insert(dto).select('*').single();

   if (error) {
    set({ isMutating: false, activeMutation: null, error: error.message });
    return null;
   }

   const backlog = toBacklogItemModel(data);
   const backlogItems = [backlog, ...get().backlogItems.filter((item) => item.id !== backlog.id)];
   const recentBacklogItems = [
    backlog,
    ...get().recentBacklogItems.filter((item) => item.id !== backlog.id),
   ];

   set({
    backlog,
    backlogItems,
    recentBacklogItems,
    archivedBacklogItems: get().archivedBacklogItems.filter((item) => item.id !== backlog.id),
    isMutating: false,
    activeMutation: null,
   });

   return backlog;
  },

  update: async (id, dto) => {
   set({ isMutating: true, activeMutation: 'update', error: null });

   const { data, error } = await supabase
    .from('backlog_items')
    .update(dto)
    .eq('id', id)
    .select('*')
    .single();

   if (error) {
    set({ isMutating: false, activeMutation: null, error: error.message });
    return null;
   }

   const backlog = toBacklogItemModel(data);
   const removeById = (items: BacklogItemModel[]) => items.filter((item) => item.id !== backlog.id);
   const nextBacklogItems = backlog.is_archived
    ? removeById(get().backlogItems)
    : [backlog, ...removeById(get().backlogItems)];
   const nextArchivedBacklogItems = backlog.is_archived
    ? [backlog, ...removeById(get().archivedBacklogItems)]
    : removeById(get().archivedBacklogItems);
   const nextRecentBacklogItems = backlog.is_archived
    ? removeById(get().recentBacklogItems)
    : get().recentBacklogItems.map((item) => (item.id === backlog.id ? backlog : item));

   set({
    backlog: get().backlog?.id === backlog.id ? backlog : get().backlog,
    backlogItems: nextBacklogItems,
    archivedBacklogItems: nextArchivedBacklogItems,
    recentBacklogItems: nextRecentBacklogItems,
    isMutating: false,
    activeMutation: null,
   });

   return backlog;
  },

  delete: async (id) => {
   set({ isMutating: true, activeMutation: 'delete', error: null });

   const { error } = await supabase.from('backlog_items').delete().eq('id', id);

   if (error) {
    set({ isMutating: false, activeMutation: null, error: error.message });
    return;
   }

   set({
    backlog: get().backlog?.id === id ? null : get().backlog,
    backlogItems: get().backlogItems.filter((item) => item.id !== id),
    recentBacklogItems: get().recentBacklogItems.filter((item) => item.id !== id),
    archivedBacklogItems: get().archivedBacklogItems.filter((item) => item.id !== id),
    isMutating: false,
    activeMutation: null,
   });
  },

  clearCurrentBacklog: () =>
   set((state) => ({
    backlog: null,
    archivedBacklogItems: state.archivedBacklogItems,
    error: null,
    isFetching: state.isReadingList || state.isReadingRecent,
    isReadingCurrent: false,
    isMutating: false,
    activeMutation: null,
   })),

  clearBacklog: () =>
   set({
    backlog: null,
    backlogItems: [],
    recentBacklogItems: [],
    archivedBacklogItems: [],
    error: null,
    isFetching: false,
    isReadingCurrent: false,
    isReadingList: false,
    isReadingRecent: false,
    isMutating: false,
    activeMutation: null,
   }),
  clearError: () => set({ error: null }),
 }),
);
