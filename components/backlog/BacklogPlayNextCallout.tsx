import { FontAwesome5 } from '@expo/vector-icons';
import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';

type BacklogPlayNextCalloutProps = {
 playNextCount: number;
 onPress: () => void;
};

export const BacklogPlayNextCallout = memo(function BacklogPlayNextCallout({
 playNextCount,
 onPress,
}: BacklogPlayNextCalloutProps) {
 const { t } = useTranslation();

 return (
  <Pressable
   accessibilityRole="button"
   accessibilityLabel={t('backlog.playNextCta.accessibilityLabel')}
   onPress={onPress}
   style={({ pressed }) => ({
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: pressed ? `${colors.primary.DEFAULT}99` : 'rgba(255,255,255,0.08)',
    backgroundColor: pressed ? 'rgba(108, 99, 255, 0.2)' : 'rgba(18, 20, 34, 0.82)',
    transform: [{ scale: pressed ? 0.985 : 1 }],
    overflow: 'hidden',
   })}
  >
   <View
    pointerEvents="none"
    style={{
     position: 'absolute',
     inset: 0,
     backgroundColor: 'rgba(108, 99, 255, 0.08)',
    }}
   />
   <View
    style={{
     flexDirection: 'row',
     alignItems: 'center',
     gap: spacing.md,
     padding: spacing.md,
    }}
   >
    <View
     style={{
      width: 42,
      height: 42,
      borderRadius: 21,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(108, 99, 255, 0.2)',
      borderWidth: 1,
      borderColor: 'rgba(186, 179, 255, 0.18)',
     }}
    >
     <FontAwesome5 name="bolt" size={16} color={colors.primary['200']} solid />
    </View>
    <View style={{ flex: 1, minWidth: 0, gap: spacing.xs }}>
     <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
      <Text
       style={{
        color: colors.text.primary,
        fontSize: typography.size.md,
        fontFamily: typography.font.semibold,
       }}
      >
       {t('backlog.playNextCta.title')}
      </Text>
      {playNextCount > 0 ? (
       <View
        style={{
         paddingHorizontal: 8,
         paddingVertical: 2,
         borderRadius: borderRadius.full,
         backgroundColor: `${colors.primary.DEFAULT}28`,
         borderWidth: 1,
         borderColor: `${colors.primary['200']}50`,
        }}
       >
        <Text
         style={{
          color: colors.primary['200'],
          fontSize: typography.size.xs,
          fontFamily: typography.font.semibold,
         }}
        >
         {playNextCount}
        </Text>
       </View>
      ) : null}
     </View>
     <Text
      numberOfLines={1}
      style={{
       color: colors.text.secondary,
       fontSize: typography.size.sm,
       lineHeight: Math.ceil(typography.size.sm * typography.lineHeight.normal),
      }}
     >
      {t('backlog.playNextCta.subtitle', { count: playNextCount })}
     </Text>
    </View>
    <View
     style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      minHeight: 38,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.full,
      backgroundColor: 'rgba(255,255,255,0.06)',
     }}
    >
     <Text
      style={{
       color: colors.primary['100'],
       fontSize: typography.size.sm,
       fontFamily: typography.font.semibold,
      }}
     >
      {t('backlog.playNextCta.action')}
     </Text>
     <FontAwesome5 name="chevron-right" size={10} color={colors.primary['100']} solid />
    </View>
   </View>
  </Pressable>
 );
});
