import { FontAwesome5 } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';

type AuthMessageAccentProps = {
 icon: React.ComponentProps<typeof FontAwesome5>['name'];
 label: string;
 iconColor?: string;
 iconBackgroundColor?: string;
 containerStyle?: React.ComponentProps<typeof View>['style'];
};

export function AuthMessageAccent({
 icon,
 label,
 iconColor = colors.accent.DEFAULT,
 iconBackgroundColor = colors.primary.glowSoft,
 containerStyle,
}: AuthMessageAccentProps) {
 return (
  <View
   style={[
    {
     flexDirection: 'row',
     alignItems: 'center',
     alignSelf: 'center',
     gap: spacing.sm,
     paddingHorizontal: spacing.md,
     paddingVertical: spacing.sm,
     borderRadius: borderRadius.full,
     backgroundColor: colors.background.elevated,
     borderWidth: 1,
     borderColor: colors.border.DEFAULT,
    },
    containerStyle,
   ]}
  >
   <View
    style={{
     width: 28,
     height: 28,
     borderRadius: 14,
     alignItems: 'center',
     justifyContent: 'center',
     backgroundColor: iconBackgroundColor,
    }}
   >
    <FontAwesome5 name={icon} size={12} color={iconColor} solid />
   </View>
   <Text
    style={{
     color: colors.text.primary,
     fontSize: typography.size.sm,
     fontFamily: typography.font.medium,
    }}
   >
    {label}
   </Text>
  </View>
 );
}
