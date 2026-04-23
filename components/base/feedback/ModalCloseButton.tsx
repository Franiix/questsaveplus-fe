import { FontAwesome5 } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';

type ModalCloseButtonProps = {
 label: string;
 onPress: () => void;
 iconName?: React.ComponentProps<typeof FontAwesome5>['name'];
};

export function ModalCloseButton({ label, onPress, iconName = 'times' }: ModalCloseButtonProps) {
 return (
  <Pressable
   onPress={onPress}
   style={{
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.035)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 1,
    minHeight: 38,
    justifyContent: 'center',
   }}
  >
   <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
    <FontAwesome5 name={iconName} size={12} color={colors.primary['200']} solid />
    <Text
     style={{
      color: colors.text.primary,
      fontFamily: typography.font.semibold,
      fontSize: typography.size.sm,
     }}
    >
     {label}
    </Text>
   </View>
  </Pressable>
 );
}
