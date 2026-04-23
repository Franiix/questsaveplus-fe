import { FontAwesome5 } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';
import { borderRadius, colors } from '@/shared/theme/tokens';

const SIZE = 40;
const MIN_HEIGHT = 50;

type Props = {
 accessibilityLabel: string;
 color: string;
 iconName: React.ComponentProps<typeof FontAwesome5>['name'];
 isActive?: boolean;
 isDisabled?: boolean;
 onPress: (event: Parameters<NonNullable<React.ComponentProps<typeof Pressable>['onPress']>>[0]) => void;
};

export function ActionIconButton({
 accessibilityLabel,
 color,
 iconName,
 isActive = false,
 isDisabled = false,
 onPress,
}: Props) {
 const iconWrapperStyle = iconName === 'play' ? { marginLeft: 2, marginTop: 1 } : undefined;

 return (
  <View
   style={{
    width: SIZE,
    minHeight: MIN_HEIGHT,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: isActive ? `${color}80` : colors.border.subtle,
    backgroundColor: isActive ? `${color}26` : colors.background.elevated,
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
      color={isActive ? color : colors.text.secondary}
      solid={isActive}
     />
    </View>
   </Pressable>
  </View>
 );
}
