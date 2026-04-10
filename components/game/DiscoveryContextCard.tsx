import { FontAwesome5 } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { BaseButton } from '@/components/base/display/BaseButton';
import { Card } from '@/components/base/display/Card';
import { colors, spacing, typography } from '@/shared/theme/tokens';

type DiscoveryContextCardProps = {
 eyebrow?: string;
 title: string;
 subtitle: string;
 icon: React.ComponentProps<typeof FontAwesome5>['name'];
 clearLabel: string;
 onClear: () => void;
};

export function DiscoveryContextCard({
 eyebrow,
 title,
 subtitle,
 icon,
 clearLabel,
 onClear,
}: DiscoveryContextCardProps) {
 return (
  <Card
   variant="outlined"
   style={{
    padding: spacing.md,
    gap: spacing.md,
    backgroundColor: colors.background.surface,
    borderColor: colors.border.strong,
   }}
  >
   <View style={{ flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' }}>
    <View
     style={{
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: colors.primary.glowSoft,
      borderWidth: 1,
      borderColor: colors.border.glow,
      alignItems: 'center',
      justifyContent: 'center',
     }}
    >
     <FontAwesome5 name={icon} size={16} color={colors.primary['200']} solid />
    </View>

    <View style={{ flex: 1, gap: spacing.xs }}>
     {eyebrow ? (
      <Text
       style={{
        color: colors.primary['200'],
        fontSize: typography.size.xs,
        fontFamily: typography.font.semibold,
        textTransform: 'uppercase',
        letterSpacing: typography.letterSpacing.wide,
       }}
      >
       {eyebrow}
      </Text>
     ) : null}
     <Text
      style={{
       color: colors.text.primary,
       fontSize: typography.size.lg,
       fontFamily: typography.font.bold,
      }}
     >
      {title}
     </Text>
     <Text
      style={{
       color: colors.text.secondary,
       fontSize: typography.size.sm,
       fontFamily: typography.font.regular,
       lineHeight: 20,
      }}
     >
      {subtitle}
     </Text>
    </View>
   </View>

   <BaseButton label={clearLabel} onPress={onClear} variant="outlined" fullWidth />
  </Card>
 );
}
