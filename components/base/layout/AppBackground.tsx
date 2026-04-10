import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/shared/theme/tokens';

const HERO_GRADIENT = ['#1E1736', '#120E24', '#090A12'] as const;

/**
 * AppBackground — sfondo globale decorativo per tutte le schermate.
 *
 * Renderizza un LinearGradient scuro con blob di luce ambientale sparsi.
 * I blob centrali e medio-alti sono offsettati lateralmente per non
 * sovrapporsi all'avatar nella schermata profilo (centrato in alto).
 */
export function AppBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient colors={[...HERO_GRADIENT]} style={StyleSheet.absoluteFill} />

      {/* Blob — cerchio viola medio-alto a sinistra */}
      <View
        style={{
          position: 'absolute',
          top: '18%',
          left: -40,
          width: 180,
          height: 180,
          borderRadius: 90,
          backgroundColor: `${colors.primary.DEFAULT}18`,
          opacity: 0.7,
        }}
      />

      {/* Blob — ellisse viola-300 medio-alto a destra */}
      <View
        style={{
          position: 'absolute',
          top: '22%',
          right: -30,
          width: 160,
          height: 100,
          borderRadius: 999,
          backgroundColor: `${colors.primary['300']}12`,
          transform: [{ rotate: '12deg' }],
        }}
      />

      {/* Blob — cerchio piccolo accent centro-sinistra */}
      <View
        style={{
          position: 'absolute',
          top: '42%',
          left: '8%',
          width: 90,
          height: 90,
          borderRadius: 45,
          backgroundColor: `${colors.primary.DEFAULT}10`,
          opacity: 0.6,
        }}
      />

      {/* Blob — ellisse bianca centro leggermente a destra */}
      <View
        style={{
          position: 'absolute',
          top: '48%',
          right: '12%',
          width: 130,
          height: 70,
          borderRadius: 999,
          backgroundColor: 'rgba(255,255,255,0.025)',
          transform: [{ rotate: '-15deg' }],
        }}
      />

      {/* Blob — cerchio viola-300 centro-basso a sinistra */}
      <View
        style={{
          position: 'absolute',
          bottom: -34,
          left: -28,
          width: 140,
          height: 140,
          borderRadius: 70,
          backgroundColor: `${colors.primary['300']}16`,
        }}
      />

      {/* Blob — ellisse bianca in basso-destra */}
      <View
        style={{
          position: 'absolute',
          bottom: -70,
          right: -10,
          width: 210,
          height: 120,
          borderRadius: 999,
          backgroundColor: 'rgba(255,255,255,0.03)',
          transform: [{ rotate: '-8deg' }],
        }}
      />

      {/* Blob — cerchio piccolo viola centro-basso a destra */}
      <View
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '6%',
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: `${colors.primary.DEFAULT}0E`,
          opacity: 0.8,
        }}
      />
    </View>
  );
}
