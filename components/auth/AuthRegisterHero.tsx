import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { REGISTER_HERO_HIGHLIGHTS } from '@/shared/consts/AuthRegisterHero.const';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';

type AuthRegisterHeroProps = {
 title: string;
 subtitle: string;
};

export function AuthRegisterHero({ title, subtitle }: AuthRegisterHeroProps) {
 const { t } = useTranslation();

 return (
  <View
   style={{
    position: 'relative',
    borderRadius: borderRadius.xl,
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.border.glow,
    padding: spacing.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    gap: spacing.lg,
   }}
  >
   <View
    style={{
     position: 'absolute',
     top: -26,
     right: -18,
     width: 116,
     height: 116,
     borderRadius: 58,
     backgroundColor: colors.primary.glowSoft,
     opacity: 0.9,
    }}
   />
   <View
    style={{
     position: 'absolute',
     bottom: -34,
     left: -24,
     width: 92,
     height: 92,
     borderRadius: 46,
     backgroundColor: colors.accent.glow,
     opacity: 0.6,
    }}
   />

   <View
    style={{
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'flex-start',
     gap: spacing.md,
    }}
   >
    <View style={{ flex: 1, gap: spacing.md }}>
     <View
      style={{
       alignSelf: 'flex-start',
       flexDirection: 'row',
       alignItems: 'center',
       gap: spacing.sm,
       paddingHorizontal: spacing.md,
       paddingVertical: spacing.sm,
       borderRadius: borderRadius.full,
       backgroundColor: colors.background.elevated,
       borderWidth: 1,
       borderColor: colors.border.DEFAULT,
      }}
     >
      <View
       style={{
        width: 30,
        height: 30,
        borderRadius: borderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary.glowSoft,
       }}
      >
       <FontAwesome5 name="gamepad" size={14} color={colors.accent.DEFAULT} solid />
      </View>
      <Text
       style={{
        color: colors.text.primary,
        fontSize: typography.size.sm,
        fontFamily: typography.font.medium,
       }}
      >
       QuestSave+
      </Text>
     </View>

     <View style={{ gap: spacing.sm }}>
      <Text
       style={{
        color: colors.text.primary,
        fontSize: typography.size['2xl'],
        fontFamily: typography.font.bold,
       }}
      >
       {title}
      </Text>
      <Text
       style={{
        color: colors.text.secondary,
        fontSize: typography.size.md,
        lineHeight: 22,
       }}
      >
       {subtitle}
      </Text>
     </View>
    </View>

    <View
     style={{
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background.elevated,
      borderWidth: 1,
      borderColor: colors.border.DEFAULT,
     }}
    >
     <FontAwesome5 name="dice-d20" size={24} color={colors.accent.DEFAULT} solid />
    </View>
   </View>

   <View
    style={{
     flexDirection: 'row',
     flexWrap: 'wrap',
     gap: spacing.sm,
    }}
   >
    {REGISTER_HERO_HIGHLIGHTS.map(({ icon, labelKey, accentColor }) => (
     <View
      key={`${icon}-${labelKey}`}
      style={{
       flexDirection: 'row',
       alignItems: 'center',
       gap: spacing.sm,
       paddingHorizontal: spacing.md,
       paddingVertical: spacing.sm,
       borderRadius: borderRadius.lg,
       backgroundColor: colors.background.elevated,
       borderWidth: 1,
       borderColor: colors.border.DEFAULT,
      }}
     >
      <FontAwesome5 name={icon} size={13} color={accentColor} solid />
      <Text
       style={{
        color: colors.text.secondary,
        fontSize: typography.size.sm,
        fontFamily: typography.font.medium,
       }}
      >
       {t(labelKey)}
      </Text>
     </View>
    ))}
   </View>
  </View>
 );
}
