import { FontAwesome5 } from '@expo/vector-icons';
import { memo } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { getBacklogQuickStatusGroups } from '@/shared/consts/BacklogQuickStatusActions.const';
import type { BacklogStatusEnum } from '@/shared/enums/BacklogStatus.enum';
import type { BacklogQuickStatusAction } from '@/shared/models/backlog/BacklogQuickStatusAction.model';
import { useSingleAction } from '@/hooks/useSingleAction';
import { borderRadius, colors, opacity, spacing } from '@/shared/theme/tokens';

type BacklogStatusQuickActionsProps = {
 currentStatus: BacklogStatusEnum;
 colorMap: Record<BacklogStatusEnum, string>;
 iconMap: Record<BacklogStatusEnum, React.ComponentProps<typeof FontAwesome5>['name']>;
 labelMap: Record<BacklogStatusEnum, string>;
 isDisabled?: boolean;
 onStatusChange: (status: BacklogStatusEnum) => void;
};

type QuickStatusButtonProps = {
 action: BacklogQuickStatusAction;
 colorMap: Record<BacklogStatusEnum, string>;
 iconMap: Record<BacklogStatusEnum, React.ComponentProps<typeof FontAwesome5>['name']>;
 index: number;
 isDisabled?: boolean;
 labelMap: Record<BacklogStatusEnum, string>;
 onPress: (status: BacklogStatusEnum) => void;
};

const ACTION_TRACK_WIDTH = 132;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const QuickStatusButton = memo(function QuickStatusButton({
 action,
 colorMap,
 iconMap,
 index,
 isDisabled = false,
 labelMap,
 onPress,
}: QuickStatusButtonProps) {
 const { isLocked, run } = useSingleAction(() => onPress(action.status), { cooldownMs: 700 });
 const color = colorMap[action.status];
 const isInactive = isDisabled || isLocked;
 const backgroundColor = action.isPrimary ? `${color}26` : colors.background.elevated;
 const borderColor = action.isPrimary ? `${color}80` : colors.border.subtle;

 return (
  <Animated.View entering={FadeInRight.delay(index * 45).duration(180)}>
   <AnimatedPressable
    onPress={run}
    disabled={isInactive}
    style={{
     minHeight: 50,
     borderRadius: borderRadius.md,
     borderWidth: 1,
     borderColor,
     backgroundColor,
     alignItems: 'center',
     justifyContent: 'center',
     width: 40,
     height: 40,
     opacity: isInactive ? opacity.disabled : 1,
    }}
    accessibilityRole="button"
    accessibilityLabel={labelMap[action.status]}
   >
    <FontAwesome5
     name={iconMap[action.status]}
     size={action.isPrimary ? 14 : 13}
     color={color}
     solid={action.isPrimary}
    />
   </AnimatedPressable>
  </Animated.View>
 );
});

export const BacklogStatusQuickActions = memo(function BacklogStatusQuickActions({
 currentStatus,
 colorMap,
 iconMap,
 labelMap,
 isDisabled = false,
 onStatusChange,
}: BacklogStatusQuickActionsProps) {
 const { primaryActions } = getBacklogQuickStatusGroups(currentStatus);

 return (
  <View
   style={{
    width: ACTION_TRACK_WIDTH + spacing.sm,
    paddingRight: spacing.sm,
    paddingVertical: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
   }}
  >
   <View
    style={{
     width: ACTION_TRACK_WIDTH,
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'flex-end',
     gap: spacing.xs,
    }}
   >
    {primaryActions.map((action, index) => (
     <QuickStatusButton
      key={`${currentStatus}-${action.status}`}
      action={action}
      colorMap={colorMap}
      iconMap={iconMap}
      index={index}
      isDisabled={isDisabled}
      labelMap={labelMap}
      onPress={onStatusChange}
     />
    ))}
   </View>
  </View>
 );
});
