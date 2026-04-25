import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { Avatar } from '@/components/base/display/Avatar';
import { useSingleAction } from '@/hooks/useSingleAction';
import type { FriendshipModel } from '@/shared/models/Social.model';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';

type Props = {
 friendship: FriendshipModel;
 onAccept: (friendshipId: string) => void;
 onReject: (friendshipId: string) => void;
};

function ActionButton({
 label,
 borderColor,
 textColor,
 onPress,
}: {
 label: string;
 borderColor: string;
 textColor: string;
 onPress: () => void;
}) {
 const { isLocked, run } = useSingleAction(onPress, { cooldownMs: 1000 });
 return (
  <Pressable
   onPress={run}
   disabled={isLocked}
   style={({ pressed }) => ({
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor,
    backgroundColor: pressed ? `${borderColor}22` : 'transparent',
    opacity: isLocked ? 0.5 : 1,
   })}
  >
   <Text
    style={{
     color: textColor,
     fontSize: typography.size.sm,
     fontFamily: typography.font.semibold,
    }}
   >
    {label}
   </Text>
  </Pressable>
 );
}

export function FriendRequestCard({ friendship, onAccept, onReject }: Props) {
 const { t } = useTranslation();

 return (
  <View
   style={{
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: `${colors.info}30`,
    padding: spacing.sm,
   }}
  >
   <Avatar
    uri={friendship.friend.avatar_url ?? undefined}
    name={friendship.friend.full_name}
    size={44}
   />

   <View style={{ flex: 1, gap: 2 }}>
    <Text
     style={{
      color: colors.text.primary,
      fontSize: typography.size.md,
      fontFamily: typography.font.semibold,
     }}
     numberOfLines={1}
    >
     {friendship.friend.username}
    </Text>
    <Text
     style={{
      color: colors.text.tertiary,
      fontSize: typography.size.xs,
     }}
     numberOfLines={1}
    >
     {friendship.friend.full_name}
    </Text>
   </View>

   <View style={{ flexDirection: 'row', gap: spacing.sm }}>
    <ActionButton
     label={t('social.reject')}
     borderColor={colors.error}
     textColor={colors.error}
     onPress={() => onReject(friendship.id)}
    />
    <ActionButton
     label={t('social.accept')}
     borderColor={colors.success}
     textColor={colors.success}
     onPress={() => onAccept(friendship.id)}
    />
   </View>
  </View>
 );
}
