import { FontAwesome5 } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Card } from '@/components/base/display/Card';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';

type ExternalLinkCardAction = {
 label: string;
 onPress: () => void;
 iconName?: React.ComponentProps<typeof FontAwesome5>['name'];
};

type ExternalLinkCardProps = {
 title: string;
 subtitle: string;
 mark: ReactNode;
 accentColor: string;
 primaryAction: ExternalLinkCardAction;
 secondaryAction?: ExternalLinkCardAction | null;
};

export function ExternalLinkCard({
 title,
 subtitle,
 mark,
 accentColor,
 primaryAction,
 secondaryAction = null,
}: ExternalLinkCardProps) {
 const primaryActionIconName = primaryAction.iconName ?? 'external-link-alt';

 return (
  <Card
   variant="outlined"
   style={{
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    backgroundColor: colors.background.elevated,
   }}
  >
   <View style={{ gap: spacing.sm }}>
    <View
     style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
     }}
    >
     {mark}

     <View style={{ flex: 1, gap: 2 }}>
      <Text
       numberOfLines={1}
       style={{
        color: colors.text.primary,
        fontSize: typography.size.base,
        fontFamily: typography.font.semibold,
       }}
      >
       {title}
      </Text>
      <Text
       numberOfLines={1}
       style={{
        color: colors.text.secondary,
        fontSize: typography.size.caption,
        fontFamily: typography.font.regular,
       }}
      >
       {subtitle}
      </Text>
     </View>

      <View
       style={{
        width: 34,
        height: 34,
        borderRadius: borderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background.surface,
        borderWidth: 1,
        borderColor: `${accentColor}33`,
       }}
      >
       <FontAwesome5 name={primaryActionIconName} size={13} color={accentColor} solid />
      </View>
    </View>

    <View style={{ flexDirection: 'row', gap: spacing.sm }}>
     {secondaryAction ? (
      <Pressable
       onPress={secondaryAction.onPress}
       style={{
        flex: 1,
        minHeight: 36,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.primary.DEFAULT,
        backgroundColor: colors.background.surface,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.md,
       }}
      >
       <Text
        style={{
         color: colors.primary['200'],
         fontSize: typography.size.sm,
         fontFamily: typography.font.semibold,
        }}
       >
        {secondaryAction.label}
       </Text>
      </Pressable>
     ) : null}

     <Pressable
      onPress={primaryAction.onPress}
      style={{
       flex: 1,
       minHeight: 36,
       borderRadius: borderRadius.full,
       backgroundColor: accentColor,
       alignItems: 'center',
       justifyContent: 'center',
       paddingHorizontal: spacing.md,
      }}
     >
      <Text
       style={{
        color: colors.text.inverse,
        fontSize: typography.size.sm,
        fontFamily: typography.font.semibold,
       }}
      >
         <FontAwesome5 name={primaryActionIconName} size={12} color={colors.text.inverse} solid />{' '}
         {primaryAction.label}
        </Text>
      </Pressable>
    </View>
   </View>
  </Card>
 );
}
