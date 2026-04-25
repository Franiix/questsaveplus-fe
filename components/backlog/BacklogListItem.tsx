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
import { RatingStepper } from '@/components/base/inputs/RatingStepper';
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
import {
 isBacklogStatusRateable,
 normalizeBacklogRatingForStatus,
} from '@/shared/utils/backlogRating';
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
 disabledStatuses?: readonly BacklogStatusEnum[];
 onDisabledStatusPress?: (item: BacklogItemEntity, status: BacklogStatusEnum) => void;
 isPrimaryActionDisabled?: boolean;
 isMetadataLoading?: boolean;
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
 disabledStatuses = [],
 onDisabledStatusPress,
 isPrimaryActionDisabled = false,
 isMetadataLoading = false,
}: BacklogListItemProps) {
 const { t, i18n } = useTranslation();
 const [isRatingSheetOpen, setIsRatingSheetOpen] = useState(false);
 const { isLocked, run } = useSingleAction(() => onPress(item));
 const swipeableRef = useRef<Swipeable | null>(null);
 const isPlayNext = item.is_play_next === true;
 const resolvedRating = normalizeBacklogRatingForStatus(item.status, item.personal_rating);
 const canEditRating = Boolean(onRatingChange) && isBacklogStatusRateable(item.status);
 const effectiveOrdinal = playNextOrdinal ?? item.play_next_priority ?? undefined;
 const canTogglePlayNext =
  Boolean(onTogglePlayNext) && (item.status === BacklogStatusEnum.WANT_TO_PLAY || isPlayNext);
 const showPinInQuickActions = quickActionsMode === 'default' && canTogglePlayNext;
 const quickPrimaryCount = showPinInQuickActions ? 2 : 3;
 const { primaryActions, secondaryActions } = getBacklogQuickStatusGroups(
  item.status,
  quickPrimaryCount,
 );
 const isSwipeEnabled = quickActionsMode !== 'play-only';

 const showLeadingControl =
  (quickActionsMode === 'play-only' && typeof effectiveOrdinal === 'number') ||
  (quickActionsMode === 'default' && isPlayNext && typeof effectiveOrdinal === 'number');

 const showTrailingPinButton = quickActionsMode === 'hidden' && canTogglePlayNext;
 const canToggleArchive = Boolean(onToggleArchive);
 const playNextToggleIconName = 'thumbtack' as React.ComponentProps<typeof FontAwesome5>['name'];
 const disabledStatusSet = new Set(disabledStatuses);

 const pinAuxiliaryAction = showPinInQuickActions
  ? {
     accessibilityLabel: isPlayNext ? playNextUnpinLabel : playNextPinLabel,
     color: colors.primary['200'],
     iconName: playNextToggleIconName,
     isActive: isPlayNext,
     isDisabled: isUpdatingPlayNext,
     showCloseBadge: isPlayNext,
     onPress: () => onTogglePlayNext?.(item),
    }
  : undefined;

 const pinnedCustomActions =
  isPlayNext && quickActionsMode === 'default'
   ? ([
      {
       accessibilityLabel: playNextUnpinLabel,
       color: colors.primary['200'],
       iconName: playNextToggleIconName,
       isActive: true,
       isDisabled: isUpdatingPlayNext,
       showCloseBadge: true,
       onPress: () => onTogglePlayNext?.(item),
      },
      {
       accessibilityLabel: labelMap[BacklogStatusEnum.PLAYING],
       color: colorMap[BacklogStatusEnum.PLAYING],
       iconName: iconMap[BacklogStatusEnum.PLAYING],
       isActive: item.status === BacklogStatusEnum.PLAYING,
       isDisabled: isUpdatingStatus || disabledStatusSet.has(BacklogStatusEnum.PLAYING),
       allowPressWhenDisabled: disabledStatusSet.has(BacklogStatusEnum.PLAYING),
       onPress: () =>
        disabledStatusSet.has(BacklogStatusEnum.PLAYING)
         ? onDisabledStatusPress?.(item, BacklogStatusEnum.PLAYING)
         : onQuickStatusChange(item, BacklogStatusEnum.PLAYING),
      },
     ] as const)
   : undefined;
 const defaultQuickActions = primaryActions.map((action) => ({
  accessibilityLabel: labelMap[action.status],
  color: colorMap[action.status],
  iconName: iconMap[action.status],
  isActive: action.isPrimary,
  isDisabled: isUpdatingStatus || disabledStatusSet.has(action.status),
  allowPressWhenDisabled: disabledStatusSet.has(action.status),
  onPress: () =>
   disabledStatusSet.has(action.status)
    ? onDisabledStatusPress?.(item, action.status)
    : onQuickStatusChange(item, action.status),
 }));

 function renderRightActions() {
  return (
   <View
    style={{ flexDirection: 'row', alignItems: 'stretch', gap: spacing.sm, marginLeft: spacing.sm }}
   >
    {canEditRating ? (
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
       name={resolvedRating !== null ? 'star' : 'star'}
       size={16}
       color={colors.warning}
       solid={resolvedRating !== null}
      />
      <Text
       style={{
        color: colors.text.primary,
        fontSize: typography.size.xs,
        fontFamily: typography.font.semibold,
        textAlign: 'center',
       }}
      >
       {resolvedRating !== null ? t('backlog.editRating') : t('backlog.rateGame')}
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
        if (disabledStatusSet.has(action.status)) {
         onDisabledStatusPress?.(item, action.status);
         return;
        }
        onQuickStatusChange(item, action.status);
       }}
       style={{
        width: SWIPE_STATUS_WIDTH,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: disabledStatusSet.has(action.status)
         ? colors.border.subtle
         : `${actionColor}66`,
        backgroundColor: disabledStatusSet.has(action.status)
         ? colors.background.surface
         : `${actionColor}22`,
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
       }}
      >
       <FontAwesome5
        name={iconMap[action.status]}
        size={16}
        color={disabledStatusSet.has(action.status) ? colors.text.disabled : actionColor}
        solid={!disabledStatusSet.has(action.status)}
       />
       <Text
        style={{
         color: disabledStatusSet.has(action.status) ? colors.text.disabled : colors.text.primary,
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
          iconName={playNextToggleIconName}
          isActive={isPlayNext}
          isDisabled={isUpdatingPlayNext}
          showCloseBadge={isPlayNext}
          onPress={(event) => {
           event.stopPropagation();
           onTogglePlayNext?.(item);
          }}
         />
        ) : null}
        {resolvedRating !== null ? (
         <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
          <Text
           style={{
            color: colors.warning,
            fontSize: typography.size.xs,
            fontFamily: typography.font.semibold,
           }}
          >
           {resolvedRating % 1 === 0 ? String(resolvedRating) : resolvedRating.toFixed(1)}
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
        customActions={pinnedCustomActions ?? defaultQuickActions}
        isDisabled={isUpdatingStatus}
        isLoading={isMetadataLoading}
        onStatusChange={(status) =>
         disabledStatusSet.has(status)
          ? onDisabledStatusPress?.(item, status)
          : onQuickStatusChange(item, status)
        }
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
        isLoading={isMetadataLoading}
        customActions={[
         {
          accessibilityLabel: primaryActionLabel,
          color: colorMap[BacklogStatusEnum.PLAYING],
          iconName: 'play',
          isActive: !isPrimaryActionDisabled,
          isDisabled: isPrimaryActionDisabled,
          allowPressWhenDisabled: isPrimaryActionDisabled,
          onPress: () =>
           isPrimaryActionDisabled
            ? onDisabledStatusPress?.(item, BacklogStatusEnum.PLAYING)
            : onPrimaryAction(item),
         },
        ]}
        onStatusChange={(status) =>
         disabledStatusSet.has(status)
          ? onDisabledStatusPress?.(item, status)
          : onQuickStatusChange(item, status)
        }
       />
      </View>
     ) : null}
    </View>
   </Pressable>
  </View>
 );

 const ratingSheet = canEditRating ? (
  <BottomSheet
   isVisible={isRatingSheetOpen}
   onClose={() => setIsRatingSheetOpen(false)}
   title={t('backlog.ratingSheetTitle')}
  >
   <View style={{ alignItems: 'center', paddingVertical: spacing.md, gap: spacing.md }}>
    <Text
     style={{
      color: colors.text.secondary,
      fontSize: typography.size.sm,
      lineHeight: Math.ceil(typography.size.sm * typography.lineHeight.normal),
      textAlign: 'center',
     }}
    >
     {t('backlog.ratingSheetDescription')}
    </Text>
    <View style={{ alignItems: 'center' }}>
     <RatingStepper
      value={resolvedRating ?? 0}
      size="md"
      onChange={(rating) => {
       onRatingChange?.(item, rating);
       setIsRatingSheetOpen(false);
      }}
     />
    </View>
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
