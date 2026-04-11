import { FontAwesome5 } from '@expo/vector-icons';
import { View } from 'react-native';
import { colors, spacing } from '@/shared/theme/tokens';

type AuthStatusIconProps = {
 name: React.ComponentProps<typeof FontAwesome5>['name'];
 color?: string;
 backgroundColor?: string;
 size?: number;
 containerSize?: number;
 solid?: boolean;
};

export function AuthStatusIcon({
 name,
 color = colors.primary['200'],
 backgroundColor = `${colors.primary.DEFAULT}22`,
 size = 28,
 containerSize = 72,
 solid = true,
}: AuthStatusIconProps) {
 return (
  <View
   style={{
    width: containerSize,
    height: containerSize,
    borderRadius: containerSize / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor,
    marginBottom: spacing.lg,
   }}
  >
   <FontAwesome5 name={name} size={size} color={color} solid={solid} />
  </View>
 );
}
