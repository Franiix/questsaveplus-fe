import { FontAwesome5 } from '@expo/vector-icons';
import { memo } from 'react';
import { Pressable, View } from 'react-native';
import { PlayNextOrdinalBadge } from '@/components/backlog/PlayNextOrdinalBadge';
import { borderRadius, colors, spacing } from '@/shared/theme/tokens';

type Props = {
 mode: 'play-only' | 'default';
 ordinal: number | undefined;
 dragHintLabel?: string;
 canTogglePlayNext: boolean;
 isPlayNext: boolean;
 isUpdatingPlayNext: boolean;
 playNextPinLabel: string;
 playNextUnpinLabel: string;
 onTogglePlayNext?: () => void;
};

export const CardLeadingControl = memo(function CardLeadingControl({
 mode,
 ordinal,
 dragHintLabel,
 canTogglePlayNext,
 isPlayNext,
 isUpdatingPlayNext,
 playNextPinLabel,
 playNextUnpinLabel,
 onTogglePlayNext,
}: Props) {
 if (mode === 'default') {
  return (
   <View
    style={{
     width: 40,
     alignItems: 'center',
     justifyContent: 'center',
     paddingLeft: spacing.sm,
     paddingRight: spacing.xs,
    }}
   >
    {ordinal !== undefined ? <PlayNextOrdinalBadge ordinal={ordinal} size="md" /> : null}
   </View>
  );
 }

 return (
  <View
   style={{
    width: 58,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingLeft: spacing.sm,
    paddingRight: spacing.xs,
   }}
  >
   {dragHintLabel ? (
    <View
     style={{
      paddingHorizontal: spacing.xs,
      paddingVertical: 3,
      borderRadius: borderRadius.sm,
      backgroundColor: `${colors.primary.DEFAULT}24`,
      borderWidth: 1,
      borderColor: `${colors.primary['200']}55`,
      alignItems: 'center',
      justifyContent: 'center',
     }}
    >
     <FontAwesome5 name="grip-lines" size={13} color={colors.primary['100']} solid />
    </View>
   ) : null}
   {canTogglePlayNext ? (
    <Pressable
     accessibilityRole="button"
     accessibilityLabel={isPlayNext ? playNextUnpinLabel : playNextPinLabel}
     disabled={isUpdatingPlayNext}
     onPress={(event) => {
      event.stopPropagation();
      onTogglePlayNext?.();
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
   {ordinal !== undefined ? <PlayNextOrdinalBadge ordinal={ordinal} size="sm" /> : null}
  </View>
 );
});
