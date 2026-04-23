import { FontAwesome5 } from '@expo/vector-icons';
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
import { BacklogStatusQuickActions } from '@/components/backlog/BacklogStatusQuickActions';
import { ImageWithFallback } from '@/components/base/display/ImageWithFallback';
import { StatusBadge } from '@/components/base/display/StatusBadge';
import { StarRatingInput } from '@/components/base/inputs/StarRatingInput';
import { useSingleAction } from '@/hooks/useSingleAction';
import { getBacklogQuickStatusGroups } from '@/shared/consts/BacklogQuickStatusActions.const';
import type { BacklogItemEntity } from '@/shared/entities/BacklogItem.entity';
import type { BacklogStatusEnum } from '@/shared/enums/BacklogStatus.enum';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';

const SWIPE_ACTION_WIDTH = 104;
const SWIPE_STATUS_WIDTH = 88;
const AnimatedText = Animated.createAnimatedComponent(Text);
const TITLE_TEXT_STYLE = {
 color: colors.text.primary,
 fontSize: typography.size.md,
 fontFamily: typography.font.semibold,
} as const;

type BacklogListItemProps = {
  item: BacklogItemEntity;
  onPress: (item: BacklogItemEntity) => void;
  onPressIn?: (item: BacklogItemEntity) => void;
  onRequestRemove: (item: BacklogItemEntity) => void;
  onQuickStatusChange: (item: BacklogItemEntity, status: BacklogStatusEnum) => void;
  removeLabel: string;
  labelMap: Record<BacklogItemEntity['status'], string>;
  colorMap: Record<BacklogItemEntity['status'], string>;
  iconMap: Record<BacklogItemEntity['status'], React.ComponentProps<typeof FontAwesome5>['name']>;
  isUpdatingStatus?: boolean;
};

type BacklogCardTitleProps = {
 title: string;
};

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
  onRequestRemove,
  onQuickStatusChange,
  removeLabel,
  labelMap,
  colorMap,
  iconMap,
  isUpdatingStatus = false,
}: BacklogListItemProps) {
  const { isLocked, run } = useSingleAction(() => onPress(item));
  const { secondaryActions } = getBacklogQuickStatusGroups(item.status);
  const swipeableRef = useRef<Swipeable | null>(null);

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
      <Pressable
        onPress={run}
        onPressIn={() => onPressIn?.(item)}
        disabled={isLocked}
        style={{
          backgroundColor: colors.background.surface,
          borderRadius: borderRadius.lg,
          borderWidth: 1,
          borderColor: colors.border.DEFAULT,
          overflow: 'hidden',
          opacity: isLocked ? 0.72 : 1,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'stretch' }}>
          <ImageWithFallback uri={item.game_cover_url} width={60} height={96} radius={0} />
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
              <StatusBadge
                value={item.status}
                colorMap={colorMap}
                labelMap={labelMap}
                iconMap={iconMap}
              />
              {item.personal_rating !== null ? (
                <StarRatingInput value={item.personal_rating} onChange={() => {}} readOnly size="sm" />
              ) : null}
            </View>
          </View>
          <BacklogStatusQuickActions
            currentStatus={item.status}
            colorMap={colorMap}
            iconMap={iconMap}
            labelMap={labelMap}
            isDisabled={isUpdatingStatus}
            onStatusChange={(status) => onQuickStatusChange(item, status)}
          />
        </View>
      </Pressable>
    </Swipeable>
  );
});
