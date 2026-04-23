import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { memo, useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Animated, {
 Easing,
 cancelAnimation,
 useAnimatedStyle,
 useSharedValue,
 withSequence,
 withTiming,
} from 'react-native-reanimated';
import { BacklogQuickActions } from '@/components/backlog/BacklogQuickActions';
import { ImageWithFallback } from '@/components/base/display/ImageWithFallback';
import { StatusBadge } from '@/components/base/display/StatusBadge';
import { StarRatingInput } from '@/components/base/inputs/StarRatingInput';
import { useSingleAction } from '@/hooks/useSingleAction';
import { getBacklogQuickStatusGroups } from '@/shared/consts/BacklogQuickStatusActions.const';
import type { BacklogItemEntity } from '@/shared/entities/BacklogItem.entity';
import { BacklogStatusEnum } from '@/shared/enums/BacklogStatus.enum';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';

const SWIPE_ACTION_WIDTH = 104;
const SWIPE_STATUS_WIDTH = 88;
const ACTION_BUTTON_SIZE = 40;
const ACTION_BUTTON_HEIGHT = 50;
const AnimatedText = Animated.createAnimatedComponent(Text);
const TITLE_TEXT_STYLE = {
 color: colors.text.primary,
 fontSize: typography.size.md,
 fontFamily: typography.font.semibold,
} as const;

type ActionButtonTone = {
 backgroundColor: string;
 borderColor: string;
 iconColor: string;
};

type BacklogListItemProps = {
  item: BacklogItemEntity;
  onPress: (item: BacklogItemEntity) => void;
  onPressIn?: (item: BacklogItemEntity) => void;
  onLongPress?: (item: BacklogItemEntity) => void;
  onRequestRemove: (item: BacklogItemEntity) => void;
  onQuickStatusChange: (item: BacklogItemEntity, status: BacklogStatusEnum) => void;
  onTogglePlayNext?: (item: BacklogItemEntity) => void;
  onPrimaryAction?: (item: BacklogItemEntity) => void;
  removeLabel: string;
  labelMap: Record<BacklogItemEntity['status'], string>;
  colorMap: Record<BacklogItemEntity['status'], string>;
  iconMap: Record<BacklogItemEntity['status'], React.ComponentProps<typeof FontAwesome5>['name']>;
  isUpdatingStatus?: boolean;
  isUpdatingPlayNext?: boolean;
  playNextPinLabel?: string;
  playNextUnpinLabel?: string;
  dragHintLabel?: string;
  isDragActive?: boolean;
  primaryActionLabel?: string;
  playNextOrdinal?: number;
  quickActionsMode?: 'default' | 'play-only' | 'hidden';
  showPlayNextRank?: boolean;
};

type BacklogCardTitleProps = {
 title: string;
};

function getActionButtonTone(color: string, isActive = false): ActionButtonTone {
 return {
  backgroundColor: isActive ? `${color}26` : colors.background.elevated,
  borderColor: isActive ? `${color}80` : colors.border.subtle,
  iconColor: isActive ? color : colors.text.secondary,
 };
}

function ActionIconButton({
 accessibilityLabel,
 color,
 iconName,
 isActive = false,
 isDisabled = false,
 onPress,
}: {
 accessibilityLabel: string;
 color: string;
 iconName: React.ComponentProps<typeof FontAwesome5>['name'];
 isActive?: boolean;
 isDisabled?: boolean;
 onPress: (event: Parameters<NonNullable<React.ComponentProps<typeof Pressable>['onPress']>>[0]) => void;
}) {
 const tone = getActionButtonTone(color, isActive);
 const iconWrapperStyle =
  iconName === 'play'
   ? { marginLeft: 2, marginTop: 1 }
   : undefined;

 return (
  <View
   style={{
    width: ACTION_BUTTON_SIZE,
    minHeight: ACTION_BUTTON_HEIGHT,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: tone.borderColor,
    backgroundColor: tone.backgroundColor,
    overflow: 'hidden',
   }}
  >
   <Pressable
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel}
    disabled={isDisabled}
    onPress={onPress}
   style={({ pressed }) => ({
     flex: 1,
     alignItems: 'center',
     justifyContent: 'center',
     opacity: isDisabled ? 0.56 : pressed ? 0.78 : 1,
    })}
   >
    <View style={iconWrapperStyle}>
     <FontAwesome5
      name={iconName}
      size={14}
      color={tone.iconColor}
      solid={isActive}
     />
    </View>
   </Pressable>
  </View>
 );
}

const BacklogCardTitle = memo(function BacklogCardTitle({ title }: BacklogCardTitleProps) {
 const translateX = useSharedValue(0);
 const [containerWidth, setContainerWidth] = useState(0);
 const [textWidth, setTextWidth] = useState(0);

 useEffect(() => {
  const overflow = Math.max(0, textWidth - containerWidth);

  cancelAnimation(translateX);

  if (overflow <= 0) {
   translateX.value = 0;
   return;
  }

  translateX.value = withSequence(
   withTiming(0, { duration: 800 }),
   withTiming(-overflow, {
    duration: Math.max(2400, overflow * 24),
    easing: Easing.inOut(Easing.quad),
   }),
   withTiming(0, {
    duration: Math.max(1800, overflow * 18),
    easing: Easing.inOut(Easing.quad),
   }),
  );
 }, [containerWidth, textWidth, translateX]);

 const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ translateX: translateX.value }],
 }));

  return (
  <View
   onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}
   style={{ overflow: 'hidden', minWidth: 0 }}
  >
   <Text
    onLayout={(event) => setTextWidth(event.nativeEvent.layout.width)}
    style={[
     TITLE_TEXT_STYLE,
     {
      position: 'absolute',
      opacity: 0,
      left: 0,
      top: 0,
     },
    ]}
    numberOfLines={1}
    pointerEvents="none"
   >
    {title}
   </Text>
   <AnimatedText
    numberOfLines={1}
    style={[
     animatedStyle,
     TITLE_TEXT_STYLE,
    ]}
   >
    {title}
   </AnimatedText>
  </View>
 );
});

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
  const effectivePlayNextOrdinal = playNextOrdinal ?? item.play_next_priority ?? undefined;
  const canTogglePlayNext =
    Boolean(onTogglePlayNext) &&
    (item.status === BacklogStatusEnum.WANT_TO_PLAY || isPlayNext);
  const showPinInQuickActions = quickActionsMode === 'default' && canTogglePlayNext;
  const quickPrimaryCount = showPinInQuickActions ? 2 : 3;
  const { secondaryActions } = getBacklogQuickStatusGroups(item.status, quickPrimaryCount);
  const isSwipeEnabled = quickActionsMode === 'default';
  const playActionColor = colorMap[BacklogStatusEnum.PLAYING];
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
  const shouldRenderLeadingPlayNextControl =
    (quickActionsMode === 'play-only' && typeof effectivePlayNextOrdinal === 'number') ||
    (quickActionsMode === 'default' && isPlayNext && typeof effectivePlayNextOrdinal === 'number');
  const shouldRenderTrailingPlayNextControl =
    quickActionsMode === 'hidden' && canTogglePlayNext;

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
      <View
        style={{
          flexDirection: 'row',
          gap: spacing.sm,
          marginRight: spacing.sm,
        }}
      >
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
        borderLeftColor: isDragActive
          ? colors.primary.DEFAULT
          : `${colorMap[item.status]}90`,
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
          {shouldRenderLeadingPlayNextControl ? (
            <View
              style={{
                width: quickActionsMode === 'default' ? 40 : 58,
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.xs,
                paddingLeft: spacing.sm,
                paddingRight: spacing.xs,
              }}
            >
              {quickActionsMode === 'play-only' ? (
                <>
                  {dragHintLabel ? (
                    <View
                      style={{
                        paddingHorizontal: spacing.xs,
                        paddingVertical: 3,
                        borderRadius: borderRadius.sm,
                        backgroundColor: `${colors.text.tertiary}18`,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <FontAwesome5 name="grip-lines" size={13} color={colors.text.secondary} solid />
                    </View>
                  ) : null}
                  {canTogglePlayNext ? (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={isPlayNext ? playNextUnpinLabel : playNextPinLabel}
                      disabled={isUpdatingPlayNext}
                      onPress={(event) => {
                        event.stopPropagation();
                        onTogglePlayNext?.(item);
                      }}
                      style={({ pressed }) => ({
                        opacity: isUpdatingPlayNext ? 0.56 : pressed ? 0.78 : 1,
                      })}
                    >
                      <FontAwesome5 name="thumbtack" size={15} color={colors.primary['200']} solid />
                    </Pressable>
                  ) : (
                    <FontAwesome5 name="thumbtack" size={15} color={colors.primary['200']} solid />
                  )}
                  {typeof effectivePlayNextOrdinal === 'number' ? (
                    <View
                      style={{
                        minWidth: 24,
                        height: 24,
                        paddingHorizontal: spacing.xs,
                        borderRadius: borderRadius.full,
                        borderWidth: 1,
                        borderColor: `${colors.primary['200']}80`,
                        backgroundColor: `${colors.primary['200']}26`,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text
                        style={{
                          color: colors.primary['200'],
                          fontSize: 10,
                          fontFamily: typography.font.semibold,
                        }}
                      >
                        #{effectivePlayNextOrdinal}
                      </Text>
                    </View>
                  ) : null}
                </>
              ) : (
                typeof effectivePlayNextOrdinal === 'number' ? (
                  <View
                    style={{
                      minWidth: 26,
                      height: 26,
                      paddingHorizontal: spacing.xs,
                      borderRadius: borderRadius.full,
                      borderWidth: 1,
                      borderColor: `${colors.primary['200']}66`,
                      backgroundColor: `${colors.primary['200']}18`,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: colors.primary['200'],
                        fontSize: 10,
                        fontFamily: typography.font.semibold,
                      }}
                    >
                      #{effectivePlayNextOrdinal}
                    </Text>
                  </View>
                ) : null
              )}
            </View>
          ) : null}
          <View style={{ width: 60, height: 96 }}>
            <ImageWithFallback uri={item.game_cover_url} width={60} height={96} radius={0} />
            <LinearGradient
              colors={['transparent', `${colors.background.surface}F0`]}
              start={{ x: 0, y: 0.3 }}
              end={{ x: 0, y: 1 }}
              style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
            />
          </View>
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
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
               <StatusBadge
                 value={item.status}
                 colorMap={colorMap}
                 labelMap={labelMap}
                 iconMap={iconMap}
               />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                {shouldRenderTrailingPlayNextControl ? (
                  <ActionIconButton
                    accessibilityLabel={isPlayNext ? playNextUnpinLabel : playNextPinLabel}
                    color={colors.primary['200']}
                    iconName="thumbtack"
                    isActive={isPlayNext}
                    isDisabled={isUpdatingPlayNext}
                    onPress={(event) => {
                      event.stopPropagation();
                      onTogglePlayNext(item);
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
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: spacing.xs,
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
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing.xs,
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
                      color: playActionColor,
                      iconName: 'play',
                      isActive: true,
                      onPress: () => onPrimaryAction(item),
                    },
                  ]}
                  onStatusChange={(status) => onQuickStatusChange(item, status)}
                />
              </View>
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
