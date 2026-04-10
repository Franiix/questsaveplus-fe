import { Text, View } from 'react-native';
import { Card } from '@/components/base/display/Card';
import { StatCounter } from '@/components/base/display/StatCounter';
import { colors, spacing, typography } from '@/shared/theme/tokens';

type ProfileStats = {
  total: number;
  wishlist: number;
  playing: number;
  ongoing: number;
  completed: number;
  abandoned: number;
};

type ProfileStatsCardProps = {
  stats: ProfileStats;
  labels: {
    total: string;
    wishlist: string;
    playing: string;
    ongoing: string;
    completed: string;
    abandoned: string;
    title: string;
    subtitle: string;
  };
};

export function ProfileStatsCard({ stats, labels }: ProfileStatsCardProps) {
  return (
    <Card
      variant="outlined"
      style={{
        padding: spacing.md,
        backgroundColor: 'rgba(16,18,30,0.9)',
        borderColor: 'rgba(255,255,255,0.08)',
        borderRadius: 24,
        shadowColor: '#000',
        shadowOpacity: 0.18,
        shadowRadius: 22,
        shadowOffset: { width: 0, height: 12 },
        elevation: 10,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: spacing.xs + 2,
        }}
      >
        <Text
          style={{
            color: colors.text.primary,
            fontSize: typography.size.lg,
            fontFamily: typography.font.bold,
          }}
        >
          {labels.title}
        </Text>
        <Text
          style={{
            color: colors.text.tertiary,
            fontSize: typography.size.sm,
            fontFamily: typography.font.medium,
          }}
        >
          {stats.total}
        </Text>
      </View>

      <Text
        style={{
          color: colors.text.secondary,
          fontSize: typography.size.sm,
          marginBottom: spacing.md + 2,
        }}
      >
        {labels.subtitle}
      </Text>

      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        <StatCounter
          label={labels.total}
          value={stats.total}
          color={colors.primary.DEFAULT}
          icon="layer-group"
          variant="card"
        />
        <StatCounter
          label={labels.wishlist}
          value={stats.wishlist}
          color={colors.status.wishlist}
          icon="shopping-bag"
          variant="card"
        />
      </View>

      <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm }}>
        <StatCounter
          label={labels.playing}
          value={stats.playing}
          color={colors.status.playing}
          icon="play"
          variant="card"
        />
        <StatCounter
          label={labels.ongoing}
          value={stats.ongoing}
          color={colors.status.ongoing}
          icon="sync-alt"
          variant="card"
        />
      </View>

      <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm }}>
        <StatCounter
          label={labels.completed}
          value={stats.completed}
          color={colors.status.completed}
          icon="check"
          variant="card"
        />
        <StatCounter
          label={labels.abandoned}
          value={stats.abandoned}
          color={colors.status.abandoned}
          icon="times"
          variant="card"
        />
      </View>
    </Card>
  );
}
