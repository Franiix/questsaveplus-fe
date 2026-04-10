import { FontAwesome5 } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { Card } from '@/components/base/display/Card';
import { colors, spacing, typography } from '@/shared/theme/tokens';

type GameReleaseReadinessRow = {
 key: string;
 label: string;
 value: string;
};

type GameReleaseReadinessCardProps = {
 title: string;
 subtitle?: string | null;
 statusLabel?: string | null;
 rows: GameReleaseReadinessRow[];
};

export function GameReleaseReadinessCard({
 title,
 subtitle = null,
 statusLabel = null,
 rows,
}: GameReleaseReadinessCardProps) {
 if (rows.length === 0) return null;

 return (
  <Card
   variant="outlined"
   style={{
    marginTop: spacing.lg,
    padding: spacing.md,
    gap: spacing.md,
    backgroundColor: 'rgba(255, 180, 0, 0.08)',
    borderColor: 'rgba(255, 180, 0, 0.24)',
   }}
  >
   <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md }}>
    <View
     style={{
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 180, 0, 0.14)',
      borderWidth: 1,
      borderColor: 'rgba(255, 180, 0, 0.28)',
     }}
    >
     <FontAwesome5 name="calendar-alt" size={16} color="#FFB400" solid />
    </View>

    <View style={{ flex: 1, gap: spacing.xs }}>
     <View
      style={{
       flexDirection: 'row',
       alignItems: 'center',
       justifyContent: 'space-between',
       gap: spacing.sm,
      }}
     >
      <Text
       style={{
        color: colors.text.primary,
        fontSize: typography.size.lg,
        fontFamily: typography.font.bold,
        flex: 1,
       }}
      >
       {title}
      </Text>

      {statusLabel ? (
       <View
        style={{
         borderRadius: 9999,
         backgroundColor: 'rgba(255, 180, 0, 0.12)',
         borderWidth: 1,
         borderColor: 'rgba(255, 180, 0, 0.35)',
         paddingHorizontal: spacing.sm,
         paddingVertical: spacing.xs,
        }}
       >
        <Text
         style={{
          color: '#FFB400',
          fontSize: typography.size.xs,
          fontFamily: typography.font.semibold,
         }}
        >
         {statusLabel}
        </Text>
       </View>
      ) : null}
     </View>

     {subtitle ? (
      <Text
       style={{
        color: colors.text.secondary,
        fontSize: typography.size.sm,
        fontFamily: typography.font.medium,
        lineHeight: 18,
       }}
      >
       {subtitle}
      </Text>
     ) : null}
    </View>
   </View>

   <View style={{ gap: spacing.sm }}>
    {rows.map((row) => (
     <View
      key={row.key}
      style={{
       gap: spacing.xs,
       paddingBottom: spacing.sm,
       borderBottomWidth: 1,
       borderBottomColor: 'rgba(255, 180, 0, 0.12)',
      }}
     >
      <Text
       style={{
        color: colors.text.tertiary,
        fontSize: typography.size.xs,
        fontFamily: typography.font.semibold,
        letterSpacing: typography.letterSpacing.wide,
        textTransform: 'uppercase',
       }}
      >
       {row.label}
      </Text>
      <Text
       style={{
        color: colors.text.primary,
        fontSize: typography.size.md,
        fontFamily: typography.font.semibold,
       }}
      >
       {row.value}
      </Text>
     </View>
    ))}
   </View>
  </Card>
 );
}
