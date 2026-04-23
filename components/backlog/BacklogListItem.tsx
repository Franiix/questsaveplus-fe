import { FontAwesome5 } from '@expo/vector-icons';
import { memo, useRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { BacklogCardTitle } from '@/components/backlog/BacklogCardTitle';
import { CardCoverWithScrim } from '@/components/backlog/CardCoverWithScrim';
import { CardLeadingControl } from '@/components/backlog/CardLeadingControl';
import { BacklogQuickActions } from '@/components/backlog/BacklogQuickActions';
import { StatusBadge } from '@/components/base/display/StatusBadge';
import { StarRatingInput } from '@/components/base/inputs/StarRatingInput';
import { ActionIconButton } from '@/components/base/inputs/ActionIconButton';
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
 onPrimaryAction?: (item: BacklogItemEntity) => void;
 removeLabel: string;
 labelMap: BacklogStatusLabelMap;
 colorMap: BacklogStatusColorMap;
 iconMap: BacklogStatusIconMap;
 isUpdatingStatus?: boolean;
 isUpdatingPlayNext?: boolean;
 playNextPinLabel?: string;
 playNextUnpinLabel?: string;
 dragHintLabel?: string;
 isDragActive?: boolean;
 primaryActionLabel?: string;
 playNextOrdinal?: number;
 quickActionsMode?: 'default' | 'play-only' | 'hidden';
};

export const BacklogListItem = memo(function BacklogListItem({
 item,
 onPress,
 onPressIn,
 onLongPress,
 onRequestRemove,
 onQuickStatusChange,
 onTogglePlayNext,
 onPrimaryAction,
 removeLabel,
 labelMap,
 colorMap,
 iconMap,
 isUpdatingStatus = false,
 isUpdatingPlayNext = false,
 playNextPinLabel = 'Add to Play Next',
 playNextUnpinLabel = 'Remove from Play Next',
 dragHintLabel,
 isDragActive = false,
 primaryActionLabel,
 playNextOrdinal,
 quickActionsMode = 'default',
}: BacklogListItemProps) {
 const { isLocked, run } = useSingleAction(() => onPress(item));
 const swipeableRef = useRef<Swipeable | null>(null);
 const isPlayNext = item.is_play_next === true;
 const effectiveOrdinal = playNextOrdinal ?? item.play_next_priority ?? undefined;
 const canTogglePlayNext =
  Boolean(onTogglePlayNext) &&
  (item.status === BacklogStatusEnum.WANT_TO_PLAY || isPlayNext);
 const showPinInQuickActions = quickActionsMode === 'default' && canTogglePlayNext;
 const quickPrimaryCount = showPinInQuickActions ? 2 : 3;
 const { secondaryActions } = getBacklogQuickStatusGroups(item.status, quickPrimaryCount);
 const isSwipeEnabled = quickActionsMode === 'default';

 const showLeadingControl =
  (quickActionsMode === 'play-only' && typeof effectiveOrdinal === 'number') ||
  (quickActionsMode === 'default' && isPlayNext && typeof effectiveOrdinal === 'number');

 const showTrailingPinButton = quickActionsMode === 'hidden' && canTogglePlayNext;

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

 function renderRightActions() {
  return (
   <Pressable
    onPress={() => onRequestRemove(item)}
    style={{
     width: SWIPE_ACTION_WIDTH,
     borderRadius: borderRadius.lg,
     backgroundColor: colors.error,
     alignItems: 'center',
     justifyContent: 'center',
     gap: spacing.xs,
     marginLeft: spacing.sm,
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
  );
 }

 function renderLeftActions() {
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
    opacity: isLocked ? 0.72 : isDragActive ? 0.92 : 1,
    transform: [{ scale: isDragActive ? 1.015 : 1 }],
   }}
  >
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
      <View
       style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.sm,
       }}
      >
       <StatusBadge value={item.status} colorMap={colorMap} labelMap={labelMap} iconMap={iconMap} />
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
         <StarRatingInput value={item.personal_rating} onChange={() => {}} readOnly size="sm" />
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
        auxiliaryAction={pinAuxiliaryAction}
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

 if (!isSwipeEnabled) {
  return cardContent;
 }

 return (
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
 );
});
