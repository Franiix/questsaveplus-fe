import { Text, View } from 'react-native';
import { Avatar } from '@/components/base/display/Avatar';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';

const AVATAR_SIZE = 96;
const AVATAR_GLOW_SIZE = 144;

type ProfileHeroProps = {
 topInset: number;
 fullName: string;
 username: string;
 avatarUrl?: string | null;
 subtitle: string;
};

export function ProfileHero({
 topInset,
 fullName,
 username,
 avatarUrl,
 subtitle,
}: ProfileHeroProps) {
 return (
  <View
   style={{
    paddingTop: topInset + 10,
    paddingBottom: spacing.xl,
    alignItems: 'center',
   }}
  >
   <View
    style={{
     position: 'relative',
     width: AVATAR_GLOW_SIZE,
     height: AVATAR_GLOW_SIZE,
     alignItems: 'center',
     justifyContent: 'center',
     marginBottom: spacing.md,
    }}
   >
    <View
     style={{
      position: 'absolute',
      width: AVATAR_GLOW_SIZE,
      height: AVATAR_GLOW_SIZE,
      borderRadius: AVATAR_GLOW_SIZE / 2,
      backgroundColor: colors.primary.glowSoft,
      opacity: 0.92,
     }}
    />

    <View
     style={{
      borderWidth: 2,
      borderColor: 'rgba(255,255,255,0.14)',
      borderRadius: borderRadius.full,
      padding: 3,
      backgroundColor: 'rgba(14,15,28,0.34)',
      shadowColor: colors.primary.DEFAULT,
      shadowOpacity: 0.24,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 6 },
      elevation: 8,
     }}
    >
     <Avatar uri={avatarUrl ?? undefined} name={fullName} size={AVATAR_SIZE} />
    </View>
   </View>

   <Text
    style={{
     color: colors.text.primary,
     fontSize: typography.size.xl,
     fontWeight: typography.weight.bold,
     marginBottom: 2,
     textAlign: 'center',
    }}
   >
    {fullName}
   </Text>

   <Text
    style={{
     color: colors.primary['300'],
     fontSize: typography.size.sm,
     fontFamily: typography.font.mono,
     letterSpacing: typography.letterSpacing.wide,
     marginBottom: spacing.md,
    }}
   >
    @{username}
   </Text>

   <View
    style={{
     flexDirection: 'row',
     alignItems: 'center',
     gap: spacing.sm,
     borderRadius: 999,
     borderWidth: 1,
     borderColor: 'rgba(255,255,255,0.08)',
     backgroundColor: 'rgba(255,255,255,0.04)',
     paddingHorizontal: spacing.md,
     paddingVertical: spacing.xs + 2,
    }}
   >
    <View
     style={{
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.primary['300'],
      shadowColor: colors.primary['300'],
      shadowOpacity: 0.65,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 0 },
     }}
    />
    <Text
     style={{
      color: colors.text.secondary,
      fontSize: typography.size.sm,
      fontFamily: typography.font.medium,
     }}
    >
     {subtitle}
    </Text>
   </View>
  </View>
 );
}
