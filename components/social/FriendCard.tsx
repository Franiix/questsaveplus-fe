import { Pressable, Text, View } from 'react-native';
import { Avatar } from '@/components/base/display/Avatar';
import type { FriendshipModel } from '@/shared/models/Social.model';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';

const RING_COLORS = [
 colors.accent.DEFAULT,
 colors.success,
 colors.status.playing,
 colors.status.wishlist,
 colors.info,
 colors.status.abandoned,
];

const AVATAR_SIZE = 56;
const RING_WIDTH = 2;
const RING_GAP = 2;
const RING_TOTAL = AVATAR_SIZE + (RING_WIDTH + RING_GAP) * 2;

type Props = {
 friendship: FriendshipModel;
 colorIndex: number;
 onPress: (userId: string) => void;
};

export function FriendCard({ friendship, colorIndex, onPress }: Props) {
 const ringColor = RING_COLORS[colorIndex % RING_COLORS.length] as string;

 return (
  <Pressable
   onPress={() => onPress(friendship.friend.id)}
   style={({ pressed }) => ({
    alignItems: 'center',
    gap: spacing.sm,
    opacity: pressed ? 0.72 : 1,
   })}
  >
   <View
    style={{
     width: RING_TOTAL,
     height: RING_TOTAL,
     borderRadius: RING_TOTAL / 2,
     borderWidth: RING_WIDTH,
     borderColor: ringColor,
     padding: RING_GAP,
     shadowColor: ringColor,
     shadowOpacity: 0.4,
     shadowRadius: 8,
     shadowOffset: { width: 0, height: 0 },
    }}
   >
    <Avatar
     uri={friendship.friend.avatar_url ?? undefined}
     name={friendship.friend.full_name}
     size={AVATAR_SIZE}
    />
   </View>
   <Text
    numberOfLines={2}
    style={{
     color: colors.text.primary,
     fontSize: typography.size.sm,
     fontFamily: typography.font.medium,
     textAlign: 'center',
     maxWidth: RING_TOTAL + 8,
     lineHeight: Math.ceil(typography.size.sm * 1.3),
    }}
   >
    {friendship.friend.username}
   </Text>
  </Pressable>
 );
}
