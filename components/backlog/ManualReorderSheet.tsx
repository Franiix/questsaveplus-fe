import { FontAwesome5 } from '@expo/vector-icons';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
 KeyboardAvoidingView,
 Modal,
 Platform,
 Pressable,
 ScrollView,
 Text,
 TextInput,
 View,
} from 'react-native';
import type { BacklogItemEntity } from '@/shared/entities/BacklogItem.entity';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';

type ReorderEntry = {
 key: string;
 gameId: number | null;
 gameName: string;
 searchText: string;
 targetPosition: string;
 isFocused: boolean;
};

function newEntry(key: string): ReorderEntry {
 return { key, gameId: null, gameName: '', searchText: '', targetPosition: '', isFocused: false };
}

let entryCounter = 0;
function nextKey() {
 entryCounter += 1;
 return String(entryCounter);
}

type ManualReorderSheetProps = {
 isVisible: boolean;
 onClose: () => void;
 playNextItems: BacklogItemEntity[];
 onApply: (items: BacklogItemEntity[]) => void;
};

export function ManualReorderSheet({
 isVisible,
 onClose,
 playNextItems,
 onApply,
}: ManualReorderSheetProps) {
 const { t } = useTranslation();
 const [entries, setEntries] = useState<ReorderEntry[]>(() => [newEntry(nextKey())]);
 const blurTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

 const updateEntry = useCallback((key: string, patch: Partial<ReorderEntry>) => {
  setEntries((prev) => prev.map((e) => (e.key === key ? { ...e, ...patch } : e)));
 }, []);

 const addEntry = useCallback(() => {
  setEntries((prev) => [...prev, newEntry(nextKey())]);
 }, []);

 const removeEntry = useCallback((key: string) => {
  setEntries((prev) => {
   const next = prev.filter((e) => e.key !== key);
   return next.length > 0 ? next : [newEntry(nextKey())];
  });
 }, []);

 const getSuggestions = useCallback(
  (entry: ReorderEntry): BacklogItemEntity[] => {
   if (!entry.isFocused || entry.searchText.trim().length === 0) return [];
   const selectedIds = new Set(
    entries.filter((e) => e.key !== entry.key && e.gameId !== null).map((e) => e.gameId),
   );
   return playNextItems
    .filter(
     (item) =>
      item.game_name.toLowerCase().includes(entry.searchText.toLowerCase()) &&
      !selectedIds.has(item.game_id),
    )
    .slice(0, 5);
  },
  [entries, playNextItems],
 );

 const getGameAtPosition = useCallback(
  (posStr: string): BacklogItemEntity | null => {
   const pos = parseInt(posStr, 10);
   if (!Number.isFinite(pos) || pos < 1) return null;
   return playNextItems[pos - 1] ?? null;
  },
  [playNextItems],
 );

 const handleApply = useCallback(() => {
  const valid = entries.filter((e) => e.gameId !== null && e.targetPosition.trim() !== '');
  if (valid.length === 0) {
   onClose();
   return;
  }

  const result = [...playNextItems];
  for (const entry of valid) {
   const fromIdx = result.findIndex((item) => item.game_id === entry.gameId);
   if (fromIdx === -1) continue;
   const [item] = result.splice(fromIdx, 1) as [BacklogItemEntity];
   const toIdx = Math.max(0, Math.min(parseInt(entry.targetPosition, 10) - 1, result.length));
   result.splice(toIdx, 0, item);
  }

  onApply(result);
  setEntries([newEntry(nextKey())]);
  onClose();
 }, [entries, onApply, onClose, playNextItems]);

 const handleClose = useCallback(() => {
  setEntries([newEntry(nextKey())]);
  onClose();
 }, [onClose]);

 return (
  <Modal
   visible={isVisible}
   transparent
   animationType="slide"
   onRequestClose={handleClose}
   statusBarTranslucent
  >
   <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
   >
    <Pressable
     style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}
     onPress={handleClose}
    >
     <Pressable
      style={{
       backgroundColor: colors.background.surface,
       borderTopLeftRadius: borderRadius.xl,
       borderTopRightRadius: borderRadius.xl,
       paddingTop: spacing.md,
       maxHeight: '85%',
      }}
      onPress={() => {}}
     >
      {/* Handle */}
      <View
       style={{
        width: 40,
        height: 4,
        borderRadius: borderRadius.full,
        backgroundColor: colors.border.DEFAULT,
        alignSelf: 'center',
        marginBottom: spacing.md,
       }}
      />

      {/* Header */}
      <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.sm }}>
       <Text
        style={{
         color: colors.text.primary,
         fontSize: typography.size.lg,
         fontFamily: typography.font.semibold,
        }}
       >
        {t('playNext.manualReorder.title')}
       </Text>
       <Text
        style={{
         color: colors.text.secondary,
         fontSize: typography.size.sm,
         marginTop: 2,
        }}
       >
        {t('playNext.manualReorder.subtitle')}
       </Text>
      </View>

      <ScrollView
       keyboardShouldPersistTaps="handled"
       contentContainerStyle={{
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xl,
        gap: spacing.sm,
       }}
      >
       {entries.map((entry, index) => {
        const suggestions = getSuggestions(entry);
        const positionOccupant = getGameAtPosition(entry.targetPosition);
        const posHintName = positionOccupant
         ? positionOccupant.game_id === entry.gameId
          ? null
          : positionOccupant.game_name
         : null;

        return (
         <View key={entry.key}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm }}>
           {/* Row number */}
           <View
            style={{
             width: 24,
             height: 40,
             alignItems: 'center',
             justifyContent: 'center',
            }}
           >
            <Text
             style={{
              color: colors.text.tertiary,
              fontSize: typography.size.xs,
              fontFamily: typography.font.semibold,
             }}
            >
             {index + 1}
            </Text>
           </View>

           {/* Game name input */}
           <View style={{ flex: 1 }}>
            <TextInput
             value={entry.searchText}
             onChangeText={(text) =>
              updateEntry(entry.key, { searchText: text, gameId: null, gameName: '' })
             }
             onFocus={() => updateEntry(entry.key, { isFocused: true })}
             onBlur={() => {
              if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
              blurTimerRef.current = setTimeout(
               () => updateEntry(entry.key, { isFocused: false }),
               200,
              );
             }}
             placeholder={t('playNext.manualReorder.gamePlaceholder')}
             placeholderTextColor={colors.text.tertiary}
             style={{
              height: 40,
              borderRadius: borderRadius.md,
              borderWidth: 1,
              borderColor: entry.isFocused ? colors.primary.DEFAULT : colors.border.DEFAULT,
              backgroundColor: colors.background.elevated,
              paddingHorizontal: spacing.sm,
              color: colors.text.primary,
              fontSize: typography.size.sm,
              fontFamily: entry.gameId ? typography.font.semibold : typography.font.regular,
             }}
            />

            {/* Suggestions */}
            {suggestions.length > 0 ? (
             <View
              style={{
               marginTop: 2,
               borderRadius: borderRadius.md,
               borderWidth: 1,
               borderColor: colors.border.DEFAULT,
               backgroundColor: colors.background.elevated,
               overflow: 'hidden',
              }}
             >
              {suggestions.map((suggestion, sIdx) => (
               <Pressable
                key={suggestion.game_id}
                onPress={() => {
                 if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
                 updateEntry(entry.key, {
                  gameId: suggestion.game_id,
                  gameName: suggestion.game_name,
                  searchText: suggestion.game_name,
                  isFocused: false,
                 });
                }}
                style={({ pressed }) => ({
                 flexDirection: 'row',
                 alignItems: 'center',
                 paddingHorizontal: spacing.sm,
                 paddingVertical: spacing.xs,
                 gap: spacing.xs,
                 backgroundColor: pressed ? `${colors.primary.DEFAULT}20` : 'transparent',
                 borderTopWidth: sIdx > 0 ? 1 : 0,
                 borderTopColor: colors.border.subtle,
                })}
               >
                <FontAwesome5 name="gamepad" size={10} color={colors.text.tertiary} />
                <Text
                 style={{
                  flex: 1,
                  color: colors.text.primary,
                  fontSize: typography.size.xs,
                  fontFamily: typography.font.medium,
                 }}
                 numberOfLines={1}
                >
                 {suggestion.game_name}
                </Text>
                <Text
                 style={{
                  color: colors.text.tertiary,
                  fontSize: typography.size['2xs'],
                  fontFamily: typography.font.regular,
                 }}
                >
                 #{playNextItems.findIndex((i) => i.game_id === suggestion.game_id) + 1}
                </Text>
               </Pressable>
              ))}
             </View>
            ) : null}
           </View>

           {/* Arrow */}
           <View style={{ height: 40, alignItems: 'center', justifyContent: 'center' }}>
            <FontAwesome5 name="arrow-right" size={12} color={colors.text.tertiary} />
           </View>

           {/* Position input */}
           <View style={{ width: 68 }}>
            <TextInput
             value={entry.targetPosition}
             onChangeText={(text) =>
              updateEntry(entry.key, { targetPosition: text.replace(/[^0-9]/g, '') })
             }
             keyboardType="number-pad"
             placeholder={t('playNext.manualReorder.positionPlaceholder')}
             placeholderTextColor={colors.text.tertiary}
             maxLength={3}
             style={{
              height: 40,
              borderRadius: borderRadius.md,
              borderWidth: 1,
              borderColor: colors.border.DEFAULT,
              backgroundColor: colors.background.elevated,
              paddingHorizontal: spacing.sm,
              color: colors.text.primary,
              fontSize: typography.size.sm,
              fontFamily: typography.font.semibold,
              textAlign: 'center',
             }}
            />
            {posHintName ? (
             <Text
              style={{
               color: colors.text.tertiary,
               fontSize: typography.size['2xs'],
               fontFamily: typography.font.regular,
               marginTop: 2,
               textAlign: 'center',
              }}
              numberOfLines={1}
             >
              {t('playNext.manualReorder.positionHint', { name: posHintName })}
             </Text>
            ) : null}
           </View>

           {/* Remove */}
           <Pressable
            onPress={() => removeEntry(entry.key)}
            style={{ height: 40, width: 32, alignItems: 'center', justifyContent: 'center' }}
            hitSlop={8}
           >
            <FontAwesome5 name="times" size={14} color={colors.text.tertiary} />
           </Pressable>
          </View>
         </View>
        );
       })}

       {/* Add row */}
       <Pressable
        onPress={addEntry}
        style={({ pressed }) => ({
         flexDirection: 'row',
         alignItems: 'center',
         justifyContent: 'center',
         gap: spacing.xs,
         paddingVertical: spacing.sm,
         borderRadius: borderRadius.md,
         borderWidth: 1,
         borderStyle: 'dashed',
         borderColor: `${colors.primary.DEFAULT}50`,
         backgroundColor: pressed ? `${colors.primary.DEFAULT}10` : 'transparent',
        })}
       >
        <FontAwesome5 name="plus" size={12} color={colors.primary['200']} />
        <Text
         style={{
          color: colors.primary['200'],
          fontSize: typography.size.sm,
          fontFamily: typography.font.medium,
         }}
        >
         {t('playNext.manualReorder.addRow')}
        </Text>
       </Pressable>

       {/* Actions */}
       <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm }}>
        <Pressable
         onPress={handleClose}
         style={({ pressed }) => ({
          flex: 1,
          height: 44,
          borderRadius: borderRadius.lg,
          borderWidth: 1,
          borderColor: colors.border.DEFAULT,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: pressed ? colors.background.elevated : 'transparent',
         })}
        >
         <Text
          style={{
           color: colors.text.secondary,
           fontSize: typography.size.sm,
           fontFamily: typography.font.medium,
          }}
         >
          {t('playNext.manualReorder.cancel')}
         </Text>
        </Pressable>
        <Pressable
         onPress={handleApply}
         style={({ pressed }) => ({
          flex: 2,
          height: 44,
          borderRadius: borderRadius.lg,
          backgroundColor: pressed ? colors.primary['500'] : colors.primary.DEFAULT,
          alignItems: 'center',
          justifyContent: 'center',
         })}
        >
         <Text
          style={{
           color: colors.text.primary,
           fontSize: typography.size.sm,
           fontFamily: typography.font.semibold,
          }}
         >
          {t('playNext.manualReorder.apply')}
         </Text>
        </Pressable>
       </View>
      </ScrollView>
     </Pressable>
    </Pressable>
   </KeyboardAvoidingView>
  </Modal>
 );
}
