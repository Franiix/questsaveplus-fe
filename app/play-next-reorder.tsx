import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BaseButton } from '@/components/base/display/BaseButton';
import { GradientUnderline } from '@/components/base/display/GradientUnderline';
import {
 SearchableSelectInput,
 type SearchableSelectOption,
} from '@/components/base/inputs/SearchableSelectInput';
import { AppBackground } from '@/components/base/layout/AppBackground';
import { ScreenHeader } from '@/components/base/layout/ScreenHeader';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import type { BacklogItemEntity } from '@/shared/entities/BacklogItem.entity';
import { borderRadius, colors, layout, spacing, typography } from '@/shared/theme/tokens';
import { getPlayNextItems } from '@/shared/utils/backlogScreen';
import { useBacklogStore } from '@/stores/backlog.store';
import { useToastStore } from '@/stores/toast.store';

type ReorderEntry = {
 key: string;
 position: number;
 gameId: number | null;
};

function createEntries(items: BacklogItemEntity[]): ReorderEntry[] {
 return items.map((item, index) => ({
  key: String(index + 1),
  position: index + 1,
  gameId: item.game_id,
 }));
}

const HORIZONTAL_PADDING = spacing.md;

export default function PlayNextReorderScreen() {
 const { t } = useTranslation();
 const router = useSafeRouter();
 const showToast = useToastStore((state) => state.showToast);
 const backlogItems = useBacklogStore((state) => state.backlogItems);
 const isMutating = useBacklogStore((state) => state.isMutating);
 const update = useBacklogStore((state) => state.update);
 const clearError = useBacklogStore((state) => state.clearError);
 const playNextItems = useMemo(() => getPlayNextItems(backlogItems), [backlogItems]);
 const [entries, setEntries] = useState<ReorderEntry[]>(() => createEntries(playNextItems));
 const [isApplying, setIsApplying] = useState(false);

 useEffect(() => {
  setEntries(createEntries(playNextItems));
 }, [playNextItems]);

 const gameOptions = useMemo<SearchableSelectOption[]>(
  () =>
   playNextItems.map((item, i) => ({
    label: `${i + 1} — ${item.game_name}`,
    value: String(item.game_id),
    searchText: `${item.game_name} ${i + 1}`,
   })),
  [playNextItems],
 );

 const handleSelectGame = useCallback((entryKey: string, value: string) => {
  const nextGameId = Number(value);
  if (!Number.isFinite(nextGameId)) return;

  setEntries((current) => {
   const targetEntry = current.find((entry) => entry.key === entryKey);
   if (!targetEntry || targetEntry.gameId === nextGameId) return current;

   const currentGameId = targetEntry.gameId;
   return current.map((entry) => {
    if (entry.key === entryKey) {
     return { ...entry, gameId: nextGameId };
    }

    if (entry.gameId === nextGameId) {
     return { ...entry, gameId: currentGameId };
    }

    return entry;
   });
  });
 }, []);

 const handleApply = useCallback(async () => {
  if (entries.some((entry) => entry.gameId === null)) {
   router.back();
   return;
  }

  const orderedItems = entries.flatMap((entry) => {
   const item = playNextItems.find((candidate) => candidate.game_id === entry.gameId);
   return item ? [item] : [];
  });

  if (orderedItems.length !== playNextItems.length) {
   router.back();
   return;
  }

  const changedItems = orderedItems
   .map((item, index) => ({ item, priority: index + 1 }))
   .filter(({ item, priority }) => item.play_next_priority !== priority);

  if (changedItems.length === 0) {
   router.back();
   return;
  }

  setIsApplying(true);
  clearError();

  for (const { item, priority } of changedItems) {
   await update(item.id, { play_next_priority: priority });
   if (useBacklogStore.getState().error) break;
  }

  const updateError = useBacklogStore.getState().error;
  showToast(updateError ?? t('playNext.reorderSuccess'), updateError ? 'error' : 'success');
  setIsApplying(false);

  if (!updateError) {
   void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
   router.back();
  }
 }, [clearError, entries, playNextItems, router, showToast, t, update]);

 return (
  <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
   <AppBackground />
   <ScreenHeader title={t('playNext.manualReorder.title')} onBack={() => router.back()} />
   <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
   >
    <ScrollView
     keyboardShouldPersistTaps="handled"
     showsVerticalScrollIndicator={false}
     contentContainerStyle={{
      paddingTop: layout.screenContentTopPadding,
      paddingHorizontal: HORIZONTAL_PADDING,
      paddingBottom: spacing['2xl'],
     }}
    >
     <View style={{ marginBottom: spacing.md, gap: spacing.xs }}>
      <Text
       style={{
        color: colors.text.primary,
        fontSize: typography.size['2xl'],
        fontFamily: typography.font.bold,
        letterSpacing: typography.letterSpacing.tight,
       }}
      >
       {t('playNext.manualReorder.title')}
      </Text>
      <GradientUnderline />
      <Text
       style={{
        color: colors.text.secondary,
        fontSize: typography.size.sm,
        lineHeight: Math.ceil(typography.size.sm * typography.lineHeight.normal),
       }}
      >
       {t('playNext.manualReorder.screenHint')}
      </Text>
     </View>

     <View style={{ gap: spacing.md, marginBottom: spacing.xl }}>
      {entries.map((entry) => (
       <View
        key={entry.key}
        style={{
         backgroundColor: colors.background.elevated,
         borderRadius: borderRadius.lg,
         borderWidth: 1,
         borderColor: colors.border.DEFAULT,
         padding: spacing.md,
         flexDirection: 'row',
         alignItems: 'center',
         gap: spacing.md,
        }}
       >
        <View
         style={{
          minWidth: 44,
          height: 44,
          borderRadius: borderRadius.full,
          borderWidth: 1,
          borderColor: `${colors.primary['200']}55`,
          backgroundColor: `${colors.primary.DEFAULT}18`,
          alignItems: 'center',
          justifyContent: 'center',
         }}
        >
         <Text
          style={{
           color: colors.primary['100'],
           fontSize: typography.size.sm,
           fontFamily: typography.font.bold,
          }}
         >
          #{entry.position}
         </Text>
        </View>
        <View style={{ flex: 1 }}>
         <SearchableSelectInput
          options={gameOptions}
          value={entry.gameId !== null ? String(entry.gameId) : undefined}
          onChange={(value) => handleSelectGame(entry.key, value)}
          placeholder={t('playNext.manualReorder.toPositionPlaceholder')}
          title={t('playNext.manualReorder.toPositionPlaceholder')}
          searchPlaceholder={t('playNext.manualReorder.gamePlaceholder')}
          emptyLabel={t('playNext.manualReorder.noGamesFound')}
          emptySearchLabel={t('playNext.manualReorder.noGamesFound')}
          backgroundColor={colors.background.primary}
         />
        </View>
       </View>
      ))}
     </View>

     <BaseButton
      label={t('playNext.manualReorder.save')}
      onPress={() => void handleApply()}
      isLoading={isApplying || isMutating}
      fullWidth
     />
     <View style={{ marginTop: spacing.sm }}>
      <BaseButton
       label={t('common.cancel')}
       variant="outlined"
       onPress={() => router.back()}
       isDisabled={isApplying || isMutating}
       fullWidth
      />
     </View>
    </ScrollView>
   </KeyboardAvoidingView>
  </SafeAreaView>
 );
}
