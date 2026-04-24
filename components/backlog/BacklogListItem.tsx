import { FontAwesome5 } from '@expo/vector-icons';
import { memo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { BacklogCardTitle } from '@/components/backlog/BacklogCardTitle';
import { BacklogQuickActions } from '@/components/backlog/BacklogQuickActions';
import { CardCoverWithScrim } from '@/components/backlog/CardCoverWithScrim';
import { CardLeadingControl } from '@/components/backlog/CardLeadingControl';
import { PlatformIcon, platformNameToKey } from '@/components/base/display/PlatformIcon';
import { StatusBadge } from '@/components/base/display/StatusBadge';
import { BottomSheet } from '@/components/base/feedback/BottomSheet';
import { ActionIconButton } from '@/components/base/inputs/ActionIconButton';
import { StarRatingInput } from '@/components/base/inputs/StarRatingInput';
import { useSingleAction } from '@/hooks/useSingleAction';
import { getBacklogQuickStatusGroups } from '@/shared/consts/BacklogQuickStatusActions.const';
import type { BacklogItemEntity } from '@/shared/entities/BacklogItem.entity';
import { BacklogStatusEnum } from '@/shared/enums/BacklogStatus.enum';
import type {
 BacklogStatusColorMap,
 BacklogStatusIconMap,
 BacklogStatusLabelMap,
} from '@/shared/models/backlog/BacklogScreenContent.model';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';
import { formatDate } from '@/shared/utils/date';

const SWIPE_ACTION_WIDTH = 104;
const SWIPE_STATUS_WIDTH = 88;

export type BacklogListItemProps = {
 item: BacklogItemEntity;
 onPress: (item: BacklogItemEntity) => void;
 onPressIn?: (item: BacklogItemEntity) => void;
 onLongPress?: (item: BacklogItemEntity) => void;
 onRequestRemove: (item: BacklogItemEntity) => void;
 onQuickStatusChange: (item: BacklogItemEntity, status: BacklogStatusEnum) => void;
 onTogglePlayNext?: (item: BacklogItemEntity) => void;
 onToggleArchive?: (item: BacklogItemEntity) => void;
 onPrimaryAction?: (item: BacklogItemEntity) => void;
 removeLabel: string;
 labelMap: BacklogStatusLabelMap;
 colorMap: BacklogStatusColorMap;
 iconMap: BacklogStatusIconMap;
 isUpdatingStatus?: boolean;
 isUpdatingPlayNext?: boolean;
 isUpdatingArchive?: boolean;
 playNextPinLabel?: string;
 playNextUnpinLabel?: string;
 archiveLabel?: string;
 restoreArchiveLabel?: string;
 dragHintLabel?: string;
 isDragActive?: boolean;
 primaryActionLabel?: string;
 playNextOrdinal?: number;
 quickActionsMode?: 'default' | 'play-only' | 'hidden';
 showAddedDate?: boolean;
 onRatingChange?: (item: BacklogItemEntity, rating: number) => void;
 reasonToPlay?: string;
};

export const BacklogListItem = memo(function BacklogListItem({
 item,
 onPress,
 onPressIn,
 onLongPress,
 onRequestRemove,
 onQuickStatusChange,
 onTogglePlayNext,
 onToggleArchive,
 onPrimaryAction,
 removeLabel,
 labelMap,
 colorMap,
 iconMap,
 isUpdatingStatus = false,
 isUpdatingPlayNext = false,
 isUpdatingArchive = false,
 playNextPinLabel = 'Add to Play Next',
 playNextUnpinLabel = 'Remove from Play Next',
 archiveLabel = 'Archive',
 restoreArchiveLabel = 'Restore',
 dragHintLabel,
 isDragActive = false,
 primaryActionLabel,
 playNextOrdinal,
 quickActionsMode = 'default',
 showAddedDate = false,
 onRatingChange,
 reasonToPlay,
}: BacklogListItemProps) {
 const { t, i18n } = useTranslation();
 const [isRatingSheetOpen, setIsRatingSheetOpen] = useState(false);
 const { isLocked, run } = useSingleAction(() => onPress(item));
 const swipeableRef = useRef<Swipeable | null>(null);
 const isPlayNext = item.is_play_next === true;
 const effectiveOrdinal = playNextOrdinal ?? item.play_next_priority ?? undefined;
 const canTogglePlayNext =
  Boolean(onTogglePlayNext) && (item.status === BacklogStatusEnum.WANT_TO_PLAY || isPlayNext);
 const showPinInQuickActions = quickActionsMode === 'default' && canTogglePlayNext;
 const quickPrimaryCount = showPinInQuickActions ? 2 : 3;
 const { secondaryActions } = getBacklogQuickStatusGroups(item.status, quickPrimaryCount);
 const isSwipeEnabled = quickActionsMode !== 'play-only';

 const showLeadingControl =
  (quickActionsMode === 'play-only' && typeof effectiveOrdinal === 'number') ||
  (quickActionsMode === 'default' && isPlayNext && typeof effectiveOrdinal === 'number');

 const showTrailingPinButton = quickActionsMode === 'hidden' && canTogglePlayNext;
 const canToggleArchive = Boolean(onToggleArchive);

 const pinAuxiliaryAction = showPinInQuickActions
  ? {
     accessibilityLabel: isPlayNext ? playNextUnpinLabel : playNextPinLabel,
     color: colors.primary['200'],
     iconName: 'thumbtack' as React.ComponentProps<typeof FontAwesome5>['name'],
     isActive: isPlayNext,
     isDisabled: isUpdatingPlayNext,
     onPress: () => onTogglePlayNext?.(item),
    }
  : undefined;

 const pinnedCustomActions =
  isPlayNext && quickActionsMode === 'default'
   ? ([
      {
       accessibilityLabel: playNextUnpinLabel,
       color: colors.primary['200'],
       iconName: 'thumbtack' as React.ComponentProps<typeof FontAwesome5>['name'],
       isActive: true,
       isDisabled: isUpdatingPlayNext,
       onPress: () => onTogglePlayNext?.(item),
      },
      {
       accessibilityLabel: labelMap[BacklogStatusEnum.PLAYING],
       color: colorMap[BacklogStatusEnum.PLAYING],
       iconName: iconMap[BacklogStatusEnum.PLAYING],
       isActive: item.status === BacklogStatusEnum.PLAYING,
       isDisabled: isUpdatingStatus,
       onPress: () => onQuickStatusChange(item, BacklogStatusEnum.PLAYING),
      },
     ] as const)
   : undefined;

 function renderRightActions() {
  return (
   <View
    style={{ flexDirection: 'row', alignItems: 'stretch', gap: spacing.sm, marginLeft: spacing.sm }}
   >
    {onRatingChange ? (
     <Pressable
      onPress={() => setIsRatingSheetOpen(true)}
      style={{
       width: SWIPE_STATUS_WIDTH,
       borderRadius: borderRadius.lg,
       borderWidth: 1,
       borderColor: `${colors.warning}66`,
       backgroundColor: `${colors.warning}22`,
       alignItems: 'center',
       justifyContent: 'center',
       gap: spacing.xs,
      }}
     >
      <FontAwesome5
       name={item.personal_rating !== null ? 'star' : 'star'}
       size={16}
       color={colors.warning}
       solid={item.personal_rating !== null}
      />
      <Text
       style={{
        color: colors.text.primary,
        fontSize: typography.size.xs,
        fontFamily: typography.font.semibold,
        textAlign: 'center',
       }}
      >
       {item.personal_rating !== null ? t('backlog.editRating') : t('backlog.rateGame')}
      </Text>
     </Pressable>
    ) : null}
    {canToggleArchive ? (
     <Pressable
      onPress={() => onToggleArchive?.(item)}
      style={{
       width: SWIPE_ACTION_WIDTH,
       borderRadius: borderRadius.lg,
       borderWidth: 1,
       borderColor: `${colors.primary['200']}55`,
       backgroundColor: `${colors.primary.DEFAULT}1e`,
       alignItems: 'center',
       justifyContent: 'center',
       gap: spacing.xs,
       opacity: isUpdatingArchive ? 0.7 : 1,
      }}
      disabled={isUpdatingArchive}
     >
      <FontAwesome5
       name={item.is_archived ? 'box-open' : 'archive'}
       size={16}
       color={colors.primary['200']}
       solid
      />
      <Text
       style={{
        color: colors.text.primary,
        fontSize: typography.size.sm,
        fontFamily: typography.font.semibold,
        textAlign: 'center',
       }}
      >
       {item.is_archived ? restoreArchiveLabel : archiveLabel}
      </Text>
     </Pressable>
    ) : null}
    <Pressable
     onPress={() => onRequestRemove(item)}
     style={{
      width: SWIPE_ACTION_WIDTH,
      borderRadius: borderRadius.lg,
      backgroundColor: colors.error,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
     }}
    >
     <FontAwesome5 name="trash-alt" size={16} color={colors.text.primary} solid />
     <Text
      style={{
       color: colors.text.primary,
       fontSize: typography.size.sm,
       fontFamily: typography.font.semibold,
      }}
     >
      {removeLabel}
     </Text>
    </Pressable>
   </View>
  );
 }

 function renderLeftActions() {
  if (quickActionsMode === 'hidden') return null;
  if (secondaryActions.length === 0) return null;

  return (
   <View style={{ flexDirection: 'row', gap: spacing.sm, marginRight: spacing.sm }}>
    {secondaryActions.map((action) => {
     const actionColor = colorMap[action.status];

     return (
      <Pressable
       key={`${item.id}-${action.status}`}
       onPress={() => {
        swipeableRef.current?.close();
        onQuickStatusChange(item, action.status);
       }}
       style={{
        width: SWIPE_STATUS_WIDTH,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: `${actionColor}66`,
        backgroundColor: `${actionColor}22`,
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
       }}
      >
       <FontAwesome5 name={iconMap[action.status]} size={16} color={actionColor} solid />
       <Text
        style={{
         color: colors.text.primary,
         fontSize: typography.size.xs,
         fontFamily: typography.font.semibold,
         textAlign: 'center',
        }}
       >
        {labelMap[action.status]}
       </Text>
      </Pressable>
     );
    })}
   </View>
  );
 }

 const cardContent = (
  <View
   style={{
    backgroundColor: colors.background.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderLeftWidth: 3,
    borderColor: isDragActive
     ? colors.primary.DEFAULT
     : isPlayNext
       ? `${colors.primary['200']}40`
       : colors.border.DEFAULT,
    borderLeftColor: isDragActive ? colors.primary.DEFAULT : `${colorMap[item.status]}90`,
    overflow: 'hidden',
    opacity: isLocked ? 0.72 : 1,
    transform: [{ scale: isDragActive ? 1.025 : 1 }],
    shadowColor: isDragActive ? colors.primary.DEFAULT : colors.background.overlay,
    shadowOffset: { width: 0, height: isDragActive ? 16 : 0 },
    shadowOpacity: isDragActive ? 0.34 : 0,
    shadowRadius: isDragActive ? 24 : 0,
    elevation: isDragActive ? 18 : 0,
   }}
  >
   {isDragActive ? (
    <View
     pointerEvents="none"
     style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(108,99,255,0.12)',
      borderRadius: borderRadius.lg,
      zIndex: 1,
     }}
    />
   ) : null}
   <Pressable
    onPress={run}
    onPressIn={() => onPressIn?.(item)}
    onLongPress={() => onLongPress?.(item)}
    delayLongPress={260}
    disabled={isLocked}
    style={({ pressed }) => ({
     transform: [{ scale: pressed && !isLocked ? 0.985 : 1 }],
    })}
   >
    <View style={{ flexDirection: 'row', alignItems: 'stretch' }}>
     {showLeadingControl ? (
      <CardLeadingControl
       mode={quickActionsMode === 'play-only' ? 'play-only' : 'default'}
       ordinal={effectiveOrdinal}
       dragHintLabel={dragHintLabel}
       canTogglePlayNext={canTogglePlayNext}
       isPlayNext={isPlayNext}
       isUpdatingPlayNext={isUpdatingPlayNext}
       playNextPinLabel={playNextPinLabel}
       playNextUnpinLabel={playNextUnpinLabel}
       onTogglePlayNext={() => onTogglePlayNext?.(item)}
      />
     ) : null}
     <CardCoverWithScrim uri={item.game_cover_url} />
     <View
      style={{
       flex: 1,
       minWidth: 0,
       padding: spacing.sm,
       justifyContent: 'center',
       gap: spacing.xs,
      }}
     >
      <BacklogCardTitle title={item.game_name} />
      {reasonToPlay ? (
       <View
        style={{
         alignSelf: 'flex-start',
         paddingHorizontal: spacing.sm,
         paddingVertical: 2,
         borderRadius: borderRadius.full,
         backgroundColor: `${colors.primary.DEFAULT}20`,
         borderWidth: 1,
         borderColor: `${colors.primary['200']}40`,
        }}
       >
        <Text
         style={{
          color: colors.primary['200'],
          fontSize: typography.size['2xs'],
          fontFamily: typography.font.medium,
         }}
        >
         {reasonToPlay}
        </Text>
       </View>
      ) : null}
      {showAddedDate
       ? (() => {
          const isCompleted = item.status === BacklogStatusEnum.COMPLETED;
          const isAbandoned = item.status === BacklogStatusEnum.ABANDONED;
          const isActive =
           item.status === BacklogStatusEnum.PLAYING || item.status === BacklogStatusEnum.ONGOING;
          const relevantDate = isCompleted
           ? (item.completed_at ?? item.added_at)
           : isAbandoned
             ? (item.abandoned_at ?? item.added_at)
             : isActive
               ? (item.resumed_at ?? item.started_at ?? item.added_at)
               : item.added_at;
          const relevantKey =
           isCompleted && item.completed_at
            ? 'backlog.completedAt'
            : isAbandoned && item.abandoned_at
              ? 'backlog.abandonedAt'
              : isActive && item.resumed_at
                ? 'backlog.resumedAt'
                : isActive && item.started_at
                  ? 'backlog.startedAt'
                  : 'backlog.addedOn';
          return relevantDate ? (
           <Text
            style={{
             color: colors.text.tertiary,
             fontSize: typography.size['2xs'],
             fontFamily: typography.font.regular,
            }}
            numberOfLines={1}
           >
            {t(relevantKey, {
             date: formatDate(relevantDate, i18n.language, {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
             }),
            })}
           </Text>
          ) : null;
         })()
       : null}
      <View
       style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: spacing.sm,
       }}
      >
       <View style={{ flex: 1, minWidth: 0, gap: spacing.xs }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
         <StatusBadge
          value={item.status}
          colorMap={colorMap}
          labelMap={labelMap}
          iconMap={iconMap}
         />
         {item.notes ? (
          <FontAwesome5 name="sticky-note" size={10} color={colors.text.tertiary} solid />
         ) : null}
        </View>
        {item.platform_played?.length ? (
         <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
          {item.platform_played.slice(0, 3).map((platform) =>
           platformNameToKey(platform) ? (
            <View
             key={platform}
             style={{
              paddingHorizontal: spacing.xs,
              paddingVertical: 4,
              borderRadius: borderRadius.full,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.08)',
              backgroundColor: 'rgba(255,255,255,0.04)',
             }}
            >
             <PlatformIcon slug={platform} size={10} color={colors.text.tertiary} />
            </View>
           ) : (
            <Text
             key={platform}
             style={{
              color: colors.text.tertiary,
              fontSize: typography.size['2xs'],
              fontFamily: typography.font.medium,
             }}
             numberOfLines={1}
            >
             {platform}
            </Text>
           ),
          )}
          {item.platform_played.length > 3 ? (
           <Text
            style={{
             color: colors.text.tertiary,
             fontSize: typography.size['2xs'],
             fontFamily: typography.font.medium,
            }}
           >
            +{item.platform_played.length - 3}
           </Text>
          ) : null}
         </View>
        ) : null}
       </View>
       <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
        {showTrailingPinButton ? (
         <ActionIconButton
          accessibilityLabel={isPlayNext ? playNextUnpinLabel : playNextPinLabel}
          color={colors.primary['200']}
          iconName="thumbtack"
          isActive={isPlayNext}
          isDisabled={isUpdatingPlayNext}
          onPress={(event) => {
           event.stopPropagation();
           onTogglePlayNext?.(item);
          }}
         />
        ) : null}
        {item.personal_rating !== null ? (
         <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
          <Text
           style={{
            color: colors.warning,
            fontSize: typography.size.xs,
            fontFamily: typography.font.semibold,
           }}
          >
           {item.personal_rating % 1 === 0
            ? String(item.personal_rating)
            : item.personal_rating.toFixed(1)}
          </Text>
          <FontAwesome5 name="star" size={9} color={colors.warning} solid />
         </View>
        ) : null}
       </View>
      </View>
     </View>
     {quickActionsMode === 'default' ? (
      <View
       style={{
        paddingRight: spacing.sm,
        paddingVertical: spacing.xs,
        justifyContent: 'center',
        alignItems: 'flex-end',
       }}
      >
       <BacklogQuickActions
        currentStatus={item.status}
        colorMap={colorMap}
        iconMap={iconMap}
        labelMap={labelMap}
        primaryCount={quickPrimaryCount}
        auxiliaryAction={pinnedCustomActions ? undefined : pinAuxiliaryAction}
        customActions={pinnedCustomActions}
        isDisabled={isUpdatingStatus}
        onStatusChange={(status) => onQuickStatusChange(item, status)}
       />
      </View>
     ) : null}
     {quickActionsMode === 'play-only' && onPrimaryAction && primaryActionLabel ? (
      <View
       style={{
        paddingRight: spacing.sm,
        paddingVertical: spacing.xs,
        justifyContent: 'center',
        alignItems: 'flex-end',
       }}
      >
       <BacklogQuickActions
        currentStatus={item.status}
        colorMap={colorMap}
        iconMap={iconMap}
        labelMap={labelMap}
        isDisabled={isUpdatingStatus}
        customActions={[
         {
          accessibilityLabel: primaryActionLabel,
          color: colorMap[BacklogStatusEnum.PLAYING],
          iconName: 'play',
          isActive: true,
          onPress: () => onPrimaryAction(item),
         },
        ]}
        onStatusChange={(status) => onQuickStatusChange(item, status)}
       />
      </View>
     ) : null}
    </View>
   </Pressable>
  </View>
 );

 const ratingSheet = onRatingChange ? (
  <BottomSheet
   isVisible={isRatingSheetOpen}
   onClose={() => setIsRatingSheetOpen(false)}
   title={t('backlog.ratingSheetTitle')}
  >
   <View style={{ alignItems: 'center', paddingVertical: spacing.md }}>
    <StarRatingInput
     value={item.personal_rating ?? undefined}
     size="lg"
     onChange={(rating) => {
      onRatingChange(item, rating);
      setIsRatingSheetOpen(false);
     }}
    />
   </View>
  </BottomSheet>
 ) : null;

 if (!isSwipeEnabled) {
  return (
   <>
    {cardContent}
    {ratingSheet}
   </>
  );
 }

 return (
  <>
   <Swipeable
    ref={swipeableRef}
    overshootLeft={false}
    overshootRight={false}
    leftThreshold={40}
    rightThreshold={40}
    friction={2}
    renderLeftActions={renderLeftActions}
    renderRightActions={renderRightActions}
   >
    {cardContent}
   </Swipeable>
   {ratingSheet}
  </>
 );
});
