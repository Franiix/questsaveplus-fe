import { Pressable, type StyleProp, Text, View, type ViewStyle } from 'react-native';
import { colors, spacing, typography } from '@/shared/theme/tokens';

type SectionHeaderProps = {
 title: string;
 subtitle?: string;
 action?: { label: string; onPress: () => void };
 style?: StyleProp<ViewStyle>;
};

/**
 * Molecule: intestazione di sezione con titolo bold a sinistra,
 * sottotitolo opzionale e link/azione a destra.
 *
 * @example
 * <SectionHeader
 *   title="I tuoi giochi recenti"
 *   subtitle="Continua da dove hai lasciato"
 *   action={{ label: 'Vedi tutti', onPress: () => router.push('/backlog') }}
 * />
 */
export function SectionHeader({ title, subtitle, action, style }: SectionHeaderProps) {
 return (
  <View
   style={[
    {
     paddingHorizontal: spacing.md,
     paddingTop: spacing.lg,
     paddingBottom: spacing.sm,
     flexDirection: 'row',
     alignItems: subtitle ? 'flex-start' : 'center',
     justifyContent: 'space-between',
     gap: spacing.sm,
    },
    style,
   ]}
  >
   {/* Left: title + optional subtitle */}
   <View style={{ flex: 1 }}>
    <Text
     style={{
      color: colors.text.primary,
      fontFamily: typography.font.bold,
      fontSize: typography.size.lg,
      letterSpacing: typography.letterSpacing.tight,
     }}
     numberOfLines={1}
    >
     {title}
    </Text>
    {subtitle ? (
     <Text
      style={{
       color: colors.text.secondary,
       fontFamily: typography.font.regular,
       fontSize: typography.size.sm,
       marginTop: 2,
      }}
      numberOfLines={1}
     >
      {subtitle}
     </Text>
    ) : null}
   </View>

   {/* Right: action link */}
   {action ? (
    <Pressable
     onPress={action.onPress}
     accessibilityRole="button"
     accessibilityLabel={action.label}
     hitSlop={8}
     style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
    >
     <Text
      style={{
       color: colors.primary.DEFAULT,
       fontFamily: typography.font.medium,
       fontSize: typography.size.sm,
      }}
     >
      {action.label}
     </Text>
    </Pressable>
   ) : null}
  </View>
 );
}
