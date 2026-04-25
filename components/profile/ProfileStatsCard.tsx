import { FontAwesome5 } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { Card } from '@/components/base/display/Card';
import { StatCounter } from '@/components/base/display/StatCounter';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';

type ProfileStats = {
 total: number;
 wishlist: number;
 wantToPlay: number;
 playing: number;
 ongoing: number;
 completed: number;
 abandoned: number;
 completionRate: number | null;
 avgRating: number | null;
};

type ProfileStatsCardProps = {
 stats: ProfileStats;
 labels: {
  total: string;
  wishlist: string;
  wantToPlay: string;
  playing: string;
  ongoing: string;
  completed: string;
  abandoned: string;
  completionRate: string;
  avgRating: string;
  title: string;
  subtitle: string;
 };
};

function StatInfoCard({
 value,
 label,
 color,
 icon,
}: {
 value: string;
 label: string;
 color: string;
 icon: React.ComponentProps<typeof FontAwesome5>['name'];
}) {
 return (
  <View
   style={{
    flex: 1,
    minWidth: 0,
    backgroundColor: colors.surface.statCard,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.surface.subtle,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md + 2,
    gap: spacing.sm,
    overflow: 'hidden',
   }}
  >
   <View
    style={{
     position: 'absolute',
     top: 0,
     left: 0,
     right: 0,
     height: 3,
     backgroundColor: color,
     opacity: 0.78,
    }}
   />
   <View
    style={{
     position: 'absolute',
     top: -26,
     right: -18,
     width: 74,
     height: 74,
     borderRadius: 37,
     backgroundColor: `${color}22`,
     opacity: 0.75,
    }}
   />
   <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
    <View style={{ gap: 2 }}>
     <Text
      style={{
       color,
       fontSize: typography.size.xl,
       fontFamily: typography.font.black,
       lineHeight: typography.size.xl * 1.2,
       textShadowColor: `${color}44`,
       textShadowOffset: { width: 0, height: 0 },
       textShadowRadius: 12,
      }}
     >
      {value}
     </Text>
     <View
      style={{
       width: 26,
       height: 3,
       borderRadius: 999,
       backgroundColor: color,
       opacity: 0.72,
      }}
     />
    </View>
    <View
     style={{
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: `${color}18`,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: `${color}28`,
     }}
    >
     <FontAwesome5 name={icon} size={12} color={color} solid />
    </View>
   </View>
   <Text
    numberOfLines={2}
    style={{
     color: colors.text.secondary,
     fontSize: typography.size.caption,
     fontFamily: typography.font.semibold,
     letterSpacing: typography.letterSpacing.wide,
     textTransform: 'uppercase',
     lineHeight: typography.size.caption * 1.4,
     maxWidth: '86%',
    }}
   >
    {label}
   </Text>
  </View>
 );
}

export function ProfileStatsCard({ stats, labels }: ProfileStatsCardProps) {
 const showInsights = stats.completionRate !== null || stats.avgRating !== null;

 return (
  <Card
   variant="outlined"
   style={{
    padding: spacing.md,
    backgroundColor: colors.surface.card,
    borderColor: colors.surface.subtle,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
   }}
  >
   <Text
    style={{
     color: colors.text.primary,
     fontSize: typography.size.lg,
     fontFamily: typography.font.bold,
     marginBottom: spacing.xs + 2,
    }}
   >
    {labels.title}
   </Text>

   <Text
    style={{
     color: colors.text.secondary,
     fontSize: typography.size.sm,
     marginBottom: spacing.md + 2,
    }}
   >
    {labels.subtitle}
   </Text>

   <View style={{ marginBottom: spacing.sm }}>
    <StatCounter
     label={labels.total}
     value={stats.total}
     color={colors.primary.DEFAULT}
     icon="layer-group"
     variant="card"
    />
   </View>

   <View style={{ flexDirection: 'row', gap: spacing.sm }}>
    <StatCounter
     label={labels.wishlist}
     value={stats.wishlist}
     color={colors.status.wishlist}
     icon="shopping-bag"
     variant="card"
    />
    <StatCounter
     label={labels.wantToPlay}
     value={stats.wantToPlay}
     color={colors.status.want_to_play}
     icon="bookmark"
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
     icon="trophy"
     variant="card"
    />
    <StatCounter
     label={labels.abandoned}
     value={stats.abandoned}
     color={colors.status.abandoned}
     icon="ban"
     variant="card"
    />
   </View>

   {showInsights ? (
    <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm }}>
     {stats.completionRate !== null ? (
      <StatInfoCard
       value={`${stats.completionRate}%`}
       label={labels.completionRate}
       color={colors.status.completed}
       icon="check-circle"
      />
     ) : null}
     {stats.avgRating !== null ? (
      <StatInfoCard
       value={`★ ${stats.avgRating}`}
       label={labels.avgRating}
       color={colors.warning}
       icon="star"
      />
     ) : null}
     {stats.completionRate !== null && stats.avgRating === null ? (
      <View style={{ flex: 1 }} />
     ) : null}
     {stats.avgRating !== null && stats.completionRate === null ? (
      <View style={{ flex: 1 }} />
     ) : null}
    </View>
   ) : null}
  </Card>
 );
}
