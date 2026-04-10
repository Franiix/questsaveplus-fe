import { FontAwesome5 } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { borderRadius, colors, typography } from '@/shared/theme/tokens';

type FilterIconButtonProps = {
 onPress: () => void;
 accessibilityLabel: string;
 isActive?: boolean;
 badgeCount?: number;
};

export function FilterIconButton({
 onPress,
 accessibilityLabel,
 isActive = false,
 badgeCount = 0,
}: FilterIconButtonProps) {
 return (
  <Pressable
   onPress={onPress}
   accessibilityRole="button"
   accessibilityLabel={accessibilityLabel}
  style={({ pressed }) => ({
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg + 2,
    borderWidth: 1,
    borderColor: isActive || pressed ? colors.primary.DEFAULT : colors.border.strong,
    backgroundColor:
      isActive || pressed ? `${colors.primary.DEFAULT}18` : colors.background.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  })}
 >
   <FontAwesome5
    name="sliders-h"
    size={18}
    color={isActive ? colors.primary.DEFAULT : colors.text.secondary}
    solid
   />
   {badgeCount > 0 ? (
    <View
     style={{
      position: 'absolute',
      top: 6,
      right: 6,
      minWidth: 18,
      height: 18,
      borderRadius: 9,
      paddingHorizontal: 4,
      backgroundColor: colors.primary.DEFAULT,
      alignItems: 'center',
      justifyContent: 'center',
     }}
    >
     <Text
      style={{
       color: colors.text.primary,
       fontFamily: typography.font.bold,
       fontSize: typography.size['2xs'],
      }}
     >
      {badgeCount}
     </Text>
    </View>
   ) : null}
  </Pressable>
 );
}
