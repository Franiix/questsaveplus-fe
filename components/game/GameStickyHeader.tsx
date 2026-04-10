import { FontAwesome5 } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { ImageWithFallback } from '@/components/base/display/ImageWithFallback';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';

type GameStickyHeaderProps = {
 title: string;
 subtitle?: string | null;
 imageUri?: string | null;
 topInset?: number;
 onBackPress: () => void;
};

export function GameStickyHeader({
 title,
 subtitle,
 imageUri,
 topInset = 0,
 onBackPress,
}: GameStickyHeaderProps) {
 return (
  <View
   style={{
    backgroundColor: colors.background.glass,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.DEFAULT,
    paddingTop: topInset + spacing.sm,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
   }}
  >
   <View
    style={{
     flexDirection: 'row',
     alignItems: 'center',
     gap: spacing.sm,
    }}
   >
    <Pressable
     onPress={onBackPress}
     hitSlop={12}
     style={{
      width: 36,
      height: 36,
      borderRadius: borderRadius.full,
      backgroundColor: colors.background.elevated,
      borderWidth: 1,
      borderColor: colors.border.strong,
      alignItems: 'center',
      justifyContent: 'center',
     }}
    >
     <FontAwesome5 name="chevron-left" size={14} color={colors.text.primary} />
    </Pressable>

    <ImageWithFallback uri={imageUri} width={40} height={40} radius={borderRadius.md} />

    <View style={{ flex: 1, gap: 2 }}>
     <Text
      numberOfLines={1}
      style={{
       color: colors.text.primary,
       fontSize: typography.size.md,
       fontFamily: typography.font.semibold,
      }}
     >
      {title}
     </Text>

     {subtitle ? (
      <Text
       numberOfLines={1}
       style={{
        color: colors.text.secondary,
        fontSize: typography.size.xs,
        fontFamily: typography.font.medium,
       }}
      >
       {subtitle}
      </Text>
     ) : null}
    </View>
   </View>
  </View>
 );
}
