import { FontAwesome5 } from '@expo/vector-icons';
import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { useSingleAction } from '@/hooks/useSingleAction';
import { getBacklogQuickStatusGroups } from '@/shared/consts/BacklogQuickStatusActions.const';
import type { BacklogStatusEnum } from '@/shared/enums/BacklogStatus.enum';
import type { BacklogQuickStatusAction } from '@/shared/models/backlog/BacklogQuickStatusAction.model';
import { borderRadius, colors, opacity, spacing, typography } from '@/shared/theme/tokens';

type AuxiliaryAction = {
 accessibilityLabel: string;
 color: string;
 iconName: React.ComponentProps<typeof FontAwesome5>['name'];
 isActive?: boolean;
 isDisabled?: boolean;
 rank?: number;
 onPress: () => void;
};

type BacklogQuickActionsProps = {
 currentStatus: BacklogStatusEnum;
 colorMap: Record<BacklogStatusEnum, string>;
 iconMap: Record<BacklogStatusEnum, React.ComponentProps<typeof FontAwesome5>['name']>;
 labelMap: Record<BacklogStatusEnum, string>;
 isDisabled?: boolean;
 primaryCount?: number;
 auxiliaryAction?: AuxiliaryAction;
 customActions?: readonly Omit<QuickActionButtonProps, 'index'>[];
 onStatusChange: (status: BacklogStatusEnum) => void;
};

type QuickActionButtonProps = {
 accessibilityLabel: string;
 color: string;
 iconName: React.ComponentProps<typeof FontAwesome5>['name'];
 index: number;
 isActive?: boolean;
 isDisabled?: boolean;
 rank?: number;
 onPress: () => void;
};

const ACTION_BUTTON_SIZE = 40;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const QuickActionButton = memo(function QuickActionButton({
 accessibilityLabel,
 color,
 iconName,
 index,
 isActive = false,
 isDisabled = false,
 rank,
 onPress,
}: QuickActionButtonProps) {
 const { isLocked, run } = useSingleAction(onPress, { cooldownMs: 700 });
 const isInactive = isDisabled || isLocked;
 const backgroundColor = isActive ? `${color}26` : colors.background.elevated;
 const borderColor = isActive ? `${color}80` : colors.border.subtle;

 return (
  <Animated.View entering={FadeInRight.delay(index * 45).duration(180)}>
   <View style={{ alignItems: 'center', justifyContent: 'center', gap: 2 }}>
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
      width: ACTION_BUTTON_SIZE,
      height: ACTION_BUTTON_SIZE,
      opacity: isInactive ? opacity.disabled : 1,
     }}
     accessibilityRole="button"
     accessibilityLabel={accessibilityLabel}
    >
     <FontAwesome5
      name={iconName}
      size={isActive ? 14 : 13}
      color={color}
      solid={isActive}
     />
    </AnimatedPressable>
    {typeof rank === 'number' ? (
     <Text
      style={{
       color,
       fontSize: 9,
       lineHeight: 10,
       fontFamily: typography.font.semibold,
      }}
     >
      #{rank}
     </Text>
    ) : null}
   </View>
  </Animated.View>
 );
});

function mapStatusActionToQuickActionProps(
 action: BacklogQuickStatusAction,
 colorMap: Record<BacklogStatusEnum, string>,
 iconMap: Record<BacklogStatusEnum, React.ComponentProps<typeof FontAwesome5>['name']>,
 labelMap: Record<BacklogStatusEnum, string>,
 onStatusChange: (status: BacklogStatusEnum) => void,
) {
 return {
  accessibilityLabel: labelMap[action.status],
  color: colorMap[action.status],
  iconName: iconMap[action.status],
  isActive: action.isPrimary,
  onPress: () => onStatusChange(action.status),
 } as const;
}

export const BacklogQuickActions = memo(function BacklogQuickActions({
 currentStatus,
 colorMap,
 iconMap,
 labelMap,
 isDisabled = false,
 primaryCount = 3,
 auxiliaryAction,
 customActions,
 onStatusChange,
}: BacklogQuickActionsProps) {
 const { primaryActions } = getBacklogQuickStatusGroups(currentStatus, primaryCount);
 const resolvedActions =
  customActions ??
  primaryActions.map((action) =>
   mapStatusActionToQuickActionProps(action, colorMap, iconMap, labelMap, onStatusChange),
  );
 const actionCount = resolvedActions.length + (auxiliaryAction ? 1 : 0);
 const actionTrackWidth =
  actionCount * ACTION_BUTTON_SIZE + Math.max(0, actionCount - 1) * spacing.xs;

 return (
  <View
   style={{
    width: actionTrackWidth + spacing.sm,
    paddingRight: spacing.sm,
    paddingVertical: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
   }}
  >
   <View
    style={{
     width: actionTrackWidth,
     flexDirection: 'row',
     alignItems: 'flex-start',
     justifyContent: 'flex-end',
     gap: spacing.xs,
    }}
   >
    {auxiliaryAction ? (
     <QuickActionButton
      accessibilityLabel={auxiliaryAction.accessibilityLabel}
      color={auxiliaryAction.color}
      iconName={auxiliaryAction.iconName}
      index={0}
      isActive={auxiliaryAction.isActive}
      isDisabled={auxiliaryAction.isDisabled}
      rank={auxiliaryAction.rank}
      onPress={auxiliaryAction.onPress}
     />
    ) : null}
    {resolvedActions.map((quickActionProps, index) => {
      return (
       <QuickActionButton
       key={`${currentStatus}-${quickActionProps.iconName}-${quickActionProps.accessibilityLabel}`}
        accessibilityLabel={quickActionProps.accessibilityLabel}
        color={quickActionProps.color}
        iconName={quickActionProps.iconName}
       index={index + (auxiliaryAction ? 1 : 0)}
       isActive={quickActionProps.isActive}
       isDisabled={quickActionProps.isDisabled ?? isDisabled}
       rank={quickActionProps.rank}
       onPress={quickActionProps.onPress}
      />
     );
    })}
   </View>
  </View>
 );
});
