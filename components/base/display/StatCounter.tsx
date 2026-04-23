import { FontAwesome5 } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, {
 Easing,
 runOnJS,
 useAnimatedReaction,
 useSharedValue,
 withTiming,
} from 'react-native-reanimated';
import { colors, spacing, typography } from '@/shared/theme/tokens';

type StatCounterProps = {
 /** Valore numerico da animare */
 value: number;
 /** Label descrittiva (uppercase) sotto il numero */
 label: string;
 /** Colore del numero animato */
 color?: string;
 /** Icona opzionale */
 icon?: React.ComponentProps<typeof FontAwesome5>['name'];
 /** Variante visuale */
 variant?: 'inline' | 'card';
 /** Se true rimuove il bordo destro (ultimo elemento in una riga) */
 isLast?: boolean;
 /** Durata dell'animazione in ms (default 800) */
 duration?: number;
};

/**
 * Atom: contatore numerico animato con label uppercase.
 *
 * Anima il numero da 0 al valore reale al mount o quando `value` cambia.
 * Usato nella stat bar del profilo e ovunque serva mostrare metriche con impatto.
 */
export function StatCounter({
 value,
 label,
 color = colors.text.primary,
 icon,
 variant = 'inline',
 isLast = false,
 duration = 800,
}: StatCounterProps) {
 const animCount = useSharedValue(0);
 const [displayCount, setDisplayCount] = useState(0);

 useAnimatedReaction(
  () => Math.floor(animCount.value),
  (current, previous) => {
   if (current !== previous) {
    runOnJS(setDisplayCount)(current);
   }
  },
 );

 useEffect(() => {
  animCount.value = withTiming(value, {
   duration,
   easing: Easing.out(Easing.cubic),
  });
 }, [value, animCount, duration]);

 if (variant === 'card') {
  return (
   <View
    style={{
     flex: 1,
     minWidth: 0,
     backgroundColor: 'rgba(18,20,36,0.72)',
     borderRadius: 22,
     borderWidth: 1,
     borderColor: 'rgba(255,255,255,0.08)',
     paddingHorizontal: spacing.md,
     paddingVertical: spacing.md + 2,
     gap: spacing.sm,
     overflow: 'hidden',
     shadowColor: '#000',
     shadowOpacity: 0.18,
     shadowRadius: 18,
     shadowOffset: { width: 0, height: 8 },
     elevation: 8,
    }}
   >
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

    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
     <View style={{ gap: 2 }}>
      <Animated.Text
       style={{
        color,
        fontSize: typography.size.xl,
        fontWeight: typography.weight.black,
        lineHeight: typography.size.xl * 1.2,
        textShadowColor: `${color}44`,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 12,
       }}
      >
       {String(displayCount)}
      </Animated.Text>
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

     {icon ? (
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
     ) : null}
    </View>

    <Text
     numberOfLines={2}
     style={{
      color: colors.text.secondary,
      fontSize: typography.size.caption,
      fontWeight: typography.weight.semibold,
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

 return (
  <View
   style={{
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRightWidth: isLast ? 0 : 1,
    borderRightColor: colors.border.DEFAULT,
   }}
  >
   <Animated.Text
    style={{
     color,
     fontSize: typography.size['2xl'],
     fontWeight: typography.weight.black,
     lineHeight: typography.size['2xl'] * 1.2,
     marginBottom: 4,
    }}
   >
    {String(displayCount)}
   </Animated.Text>
   <Text
    numberOfLines={1}
    style={{
     color: colors.text.secondary,
     fontSize: typography.size.caption,
     fontWeight: typography.weight.semibold,
     letterSpacing: typography.letterSpacing.wide,
     textTransform: 'uppercase',
     textAlign: 'center',
    }}
   >
    {label}
   </Text>
  </View>
 );
}
