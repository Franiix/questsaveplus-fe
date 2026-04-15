import { FontAwesome5 } from '@expo/vector-icons';
import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { ImageWithFallback } from '@/components/base/display/ImageWithFallback';
import { StatusBadge } from '@/components/base/display/StatusBadge';
import { StarRatingInput } from '@/components/base/inputs/StarRatingInput';
import type { BacklogItemEntity } from '@/shared/entities/BacklogItem.entity';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';

const SWIPE_ACTION_WIDTH = 104;

type BacklogListItemProps = {
  item: BacklogItemEntity;
  onPress: (item: BacklogItemEntity) => void;
  onRequestRemove: (item: BacklogItemEntity) => void;
  removeLabel: string;
  labelMap: Record<BacklogItemEntity['status'], string>;
  colorMap: Record<BacklogItemEntity['status'], string>;
  iconMap: Record<BacklogItemEntity['status'], React.ComponentProps<typeof FontAwesome5>['name']>;
};

export const BacklogListItem = memo(function BacklogListItem({
  item,
  onPress,
  onRequestRemove,
  removeLabel,
  labelMap,
  colorMap,
  iconMap,
}: BacklogListItemProps) {
  function renderRightActions() {
    return (
      <Pressable
        onPress={() => onRequestRemove(item)}
        style={{
          width: SWIPE_ACTION_WIDTH,
          borderRadius: borderRadius.lg,
          backgroundColor: colors.error,
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing.xs,
          marginLeft: spacing.sm,
        }}
      >
        <FontAwesome5 name="trash-alt" size={16} color={colors.text.primary} solid />
        <Text
          style={{
            color: colors.text.primary,
            fontSize: typography.size.sm,
            fontFamily: typography.font.semibold,
          }}
        >
          {removeLabel}
        </Text>
      </Pressable>
    );
  }

  return (
    <Swipeable
      overshootRight={false}
      rightThreshold={40}
      friction={2}
      renderRightActions={renderRightActions}
    >
      <Pressable
        onPress={() => onPress(item)}
        style={{
          flexDirection: 'row',
          backgroundColor: colors.background.surface,
          borderRadius: borderRadius.lg,
          borderWidth: 1,
          borderColor: colors.border.DEFAULT,
          overflow: 'hidden',
        }}
      >
        <ImageWithFallback uri={item.game_cover_url} width={60} height={80} radius={0} />
        <View style={{ flex: 1, padding: spacing.sm, justifyContent: 'center', gap: spacing.xs }}>
          <Text
            numberOfLines={2}
            style={{
              color: colors.text.primary,
              fontSize: typography.size.md,
              fontFamily: typography.font.semibold,
            }}
          >
            {item.game_name}
          </Text>
          <StatusBadge
            value={item.status}
            colorMap={colorMap}
            labelMap={labelMap}
            iconMap={iconMap}
          />
        </View>
        {item.personal_rating !== null ? (
          <View style={{ justifyContent: 'center', paddingRight: spacing.sm }}>
            <StarRatingInput value={item.personal_rating} onChange={() => {}} readOnly size="sm" />
          </View>
        ) : null}
      </Pressable>
    </Swipeable>
  );
});
