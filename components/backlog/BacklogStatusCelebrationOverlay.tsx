import { FontAwesome5 } from '@expo/vector-icons';
import { memo, useEffect } from 'react';
import { View, useWindowDimensions, type ViewStyle } from 'react-native';
import Animated, {
 Easing,
 Extrapolation,
 interpolate,
 type SharedValue,
 useAnimatedStyle,
 useSharedValue,
 withTiming,
} from 'react-native-reanimated';
import type { BacklogStatusEnum } from '@/shared/enums/BacklogStatus.enum';
import { borderRadius, colors } from '@/shared/theme/tokens';

type StatusParticle = {
 xStart: number;
 yStart: number;
 xEnd: number;
 yEnd: number;
 size: number;
 rotate: number;
 delay: number;
 duration: number;
 shape: 'dot' | 'bar';
 opacityPeak?: number;
};

type StatusAnimationProps = {
 colorMap: Record<BacklogStatusEnum, string>;
 iconMap: Record<BacklogStatusEnum, React.ComponentProps<typeof FontAwesome5>['name']>;
 status: BacklogStatusEnum | null;
 trigger: number;
};

function buildParticles(status: BacklogStatusEnum, width: number, height: number): StatusParticle[] {
 switch (status) {
  case 'COMPLETED':
   return Array.from({ length: 18 }, (_, index) => {
    const xStart = 20 + (width - 40) * (index / 17);
    const direction = index % 2 === 0 ? -1 : 1;

    return {
     xStart,
     yStart: height * 0.18 + (index % 4) * 10,
     xEnd: xStart + direction * (24 + (index % 3) * 14),
     yEnd: height * 0.9 - (index % 5) * 24,
     size: index % 3 === 0 ? 12 : 9,
     rotate: direction * (50 + index * 8),
     delay: (index % 6) * 0.03,
     duration: 0.7,
     shape: 'bar',
     opacityPeak: 0.95,
    };
   });
  case 'PLAYING':
   return [
    {
     xStart: width * 0.24,
     yStart: height * 0.72,
     xEnd: width * 0.38,
     yEnd: height * 0.56,
     size: 16,
     rotate: -18,
     delay: 0.04,
     duration: 0.56,
     shape: 'bar',
    },
    {
     xStart: width * 0.26,
     yStart: height * 0.75,
     xEnd: width * 0.44,
     yEnd: height * 0.6,
     size: 12,
     rotate: -10,
     delay: 0.08,
     duration: 0.58,
     shape: 'bar',
    },
    {
     xStart: width * 0.29,
     yStart: height * 0.78,
     xEnd: width * 0.48,
     yEnd: height * 0.63,
     size: 9,
     rotate: -4,
     delay: 0.12,
     duration: 0.6,
     shape: 'bar',
    },
   ];
  case 'ONGOING':
   return [
    {
     xStart: width * 0.5,
     yStart: height * 0.42,
     xEnd: width * 0.62,
     yEnd: height * 0.42,
     size: 10,
     rotate: 0,
     delay: 0.03,
     duration: 0.72,
     shape: 'dot',
    },
    {
     xStart: width * 0.5,
     yStart: height * 0.42,
     xEnd: width * 0.38,
     yEnd: height * 0.42,
     size: 10,
     rotate: 0,
     delay: 0.08,
     duration: 0.72,
     shape: 'dot',
    },
    {
     xStart: width * 0.5,
     yStart: height * 0.42,
     xEnd: width * 0.5,
     yEnd: height * 0.3,
     size: 10,
     rotate: 0,
     delay: 0.13,
     duration: 0.72,
     shape: 'dot',
    },
   ];
  case 'WISHLIST':
   return [
    {
     xStart: width * 0.38,
     yStart: height * 0.72,
     xEnd: width * 0.34,
     yEnd: height * 0.38,
     size: 10,
     rotate: -22,
     delay: 0.04,
     duration: 0.68,
     shape: 'dot',
    },
    {
     xStart: width * 0.5,
     yStart: height * 0.75,
     xEnd: width * 0.5,
     yEnd: height * 0.32,
     size: 13,
     rotate: 0,
     delay: 0.09,
     duration: 0.74,
     shape: 'dot',
    },
    {
     xStart: width * 0.62,
     yStart: height * 0.72,
     xEnd: width * 0.66,
     yEnd: height * 0.4,
     size: 10,
     rotate: 22,
     delay: 0.14,
     duration: 0.68,
     shape: 'dot',
    },
   ];
  case 'ABANDONED':
   return [
    {
     xStart: width * 0.5,
     yStart: height * 0.42,
     xEnd: width * 0.36,
     yEnd: height * 0.56,
     size: 10,
     rotate: -42,
     delay: 0.02,
     duration: 0.52,
     shape: 'bar',
    },
    {
     xStart: width * 0.5,
     yStart: height * 0.42,
     xEnd: width * 0.64,
     yEnd: height * 0.54,
     size: 10,
     rotate: 38,
     delay: 0.06,
     duration: 0.52,
     shape: 'bar',
    },
    {
     xStart: width * 0.5,
     yStart: height * 0.42,
     xEnd: width * 0.48,
     yEnd: height * 0.62,
     size: 8,
     rotate: 8,
     delay: 0.1,
     duration: 0.55,
     shape: 'bar',
    },
   ];
  default:
   return [
    {
     xStart: width * 0.42,
     yStart: height * 0.68,
     xEnd: width * 0.42,
     yEnd: height * 0.4,
     size: 12,
     rotate: -8,
     delay: 0.04,
     duration: 0.68,
     shape: 'bar',
    },
    {
     xStart: width * 0.5,
     yStart: height * 0.72,
     xEnd: width * 0.5,
     yEnd: height * 0.34,
     size: 15,
     rotate: 0,
     delay: 0.09,
     duration: 0.74,
     shape: 'bar',
    },
    {
     xStart: width * 0.58,
     yStart: height * 0.68,
     xEnd: width * 0.58,
     yEnd: height * 0.4,
     size: 12,
     rotate: 8,
     delay: 0.14,
     duration: 0.68,
     shape: 'bar',
    },
   ];
 }
}

function CelebrationParticle({
 color,
 particle,
 progress,
}: {
 color: string;
 particle: StatusParticle;
 progress: SharedValue<number>;
}) {
 const style = useAnimatedStyle<ViewStyle>(() => {
  const start = particle.delay;
  const end = Math.min(1, particle.delay + particle.duration);
  const translateX = interpolate(
   progress.value,
   [start, end],
   [particle.xStart, particle.xEnd],
   Extrapolation.CLAMP,
  );
  const translateY = interpolate(
   progress.value,
   [start, end],
   [particle.yStart, particle.yEnd],
   Extrapolation.CLAMP,
  );
  const rotation = interpolate(
   progress.value,
   [start, end],
   [0, particle.rotate],
   Extrapolation.CLAMP,
  );
  const scale = interpolate(progress.value, [start, end], [0.4, 1], Extrapolation.CLAMP);
  const opacity = interpolate(
   progress.value,
   [start, Math.min(end, start + 0.15), end],
   [0, particle.opacityPeak ?? 0.88, 0],
   Extrapolation.CLAMP,
  );

  return {
   opacity,
   transform: [
    { translateX },
    { translateY },
    { rotate: `${rotation}deg` },
    { scale },
   ] as ViewStyle['transform'],
  };
 });

 const sizeStyle =
  particle.shape === 'dot'
   ? {
      width: particle.size,
      height: particle.size,
      borderRadius: borderRadius.full,
     }
   : {
      width: Math.max(6, particle.size * 0.42),
      height: particle.size,
      borderRadius: 3,
     };

 return (
  <Animated.View
   style={[
    {
     position: 'absolute',
     backgroundColor: color,
    },
    sizeStyle,
    style,
   ]}
  />
 );
}

function StatusIcon({
 color,
 iconName,
 progress,
 status,
 width,
 height,
}: {
 color: string;
 iconName: React.ComponentProps<typeof FontAwesome5>['name'];
 progress: SharedValue<number>;
 status: BacklogStatusEnum;
 width: number;
 height: number;
}) {
 const style = useAnimatedStyle<ViewStyle>(() => {
  switch (status) {
   case 'PLAYING':
    return {
     opacity: interpolate(progress.value, [0, 0.08, 0.72, 1], [0, 1, 1, 0], Extrapolation.CLAMP),
     transform: [
      {
       translateX: interpolate(
        progress.value,
        [0, 0.78],
        [width * 0.22, width * 0.72],
        Extrapolation.CLAMP,
       ),
      },
      {
       translateY: interpolate(
        progress.value,
        [0, 0.78],
        [height * 0.74, height * 0.2],
        Extrapolation.CLAMP,
       ),
      },
      { rotate: '-18deg' },
      {
       scale: interpolate(progress.value, [0, 0.18, 0.78], [0.7, 1.08, 1.26], Extrapolation.CLAMP),
      },
     ] as ViewStyle['transform'],
    };
   case 'COMPLETED':
    return {
     opacity: interpolate(progress.value, [0, 0.05, 0.84, 1], [0, 1, 1, 0], Extrapolation.CLAMP),
     transform: [
      { translateX: width * 0.5 },
      {
       translateY: interpolate(
        progress.value,
        [0, 0.35, 1],
        [height * 0.52, height * 0.44, height * 0.4],
        Extrapolation.CLAMP,
       ),
      },
      {
       scale: interpolate(progress.value, [0, 0.18, 0.42, 1], [0.35, 1.32, 1.04, 0.92], Extrapolation.CLAMP),
      },
     ] as ViewStyle['transform'],
    };
   case 'ONGOING':
    return {
     opacity: interpolate(progress.value, [0, 0.08, 0.88, 1], [0, 1, 1, 0], Extrapolation.CLAMP),
     transform: [
      { translateX: width * 0.5 },
      { translateY: height * 0.42 },
      { rotate: `${interpolate(progress.value, [0, 1], [0, 540])}deg` },
      {
       scale: interpolate(progress.value, [0, 0.2, 1], [0.6, 1.08, 0.92], Extrapolation.CLAMP),
      },
     ] as ViewStyle['transform'],
    };
   case 'WISHLIST':
    return {
     opacity: interpolate(progress.value, [0, 0.06, 0.88, 1], [0, 1, 1, 0], Extrapolation.CLAMP),
     transform: [
      { translateX: width * 0.5 },
      {
       translateY: interpolate(
        progress.value,
        [0, 0.55, 1],
        [height * 0.72, height * 0.38, height * 0.28],
        Extrapolation.CLAMP,
       ),
      },
      {
       scale: interpolate(progress.value, [0, 0.24, 1], [0.72, 1.12, 0.96], Extrapolation.CLAMP),
      },
     ] as ViewStyle['transform'],
    };
   case 'ABANDONED':
    return {
     opacity: interpolate(progress.value, [0, 0.06, 0.62, 1], [0, 1, 0.92, 0], Extrapolation.CLAMP),
     transform: [
      { translateX: width * 0.5 + Math.sin(progress.value * Math.PI * 10) * 18 },
      {
       translateY: interpolate(
        progress.value,
        [0, 0.6, 1],
        [height * 0.42, height * 0.42, height * 0.48],
        Extrapolation.CLAMP,
       ),
      },
      {
       scale: interpolate(progress.value, [0, 0.28, 1], [0.72, 1.14, 0.84], Extrapolation.CLAMP),
      },
     ] as ViewStyle['transform'],
    };
   default:
    return {
     opacity: interpolate(progress.value, [0, 0.08, 0.88, 1], [0, 1, 1, 0], Extrapolation.CLAMP),
     transform: [
      { translateX: width * 0.5 },
      {
       translateY: interpolate(
        progress.value,
        [0, 0.5, 1],
        [height * 0.7, height * 0.4, height * 0.34],
        Extrapolation.CLAMP,
       ),
      },
      {
       scale: interpolate(progress.value, [0, 0.2, 0.44, 1], [0.56, 1.18, 0.98, 0.9], Extrapolation.CLAMP),
      },
     ] as ViewStyle['transform'],
    };
  }
 });

 return (
  <Animated.View
   style={[
    {
     position: 'absolute',
     marginLeft: -24,
     marginTop: -24,
     shadowColor: color,
     shadowOpacity: 0.34,
     shadowRadius: 18,
     shadowOffset: { width: 0, height: 0 },
    },
    style,
   ]}
  >
   <FontAwesome5 name={iconName} size={48} color={color} solid />
  </Animated.View>
 );
}

export const BacklogStatusCelebrationOverlay = memo(function BacklogStatusCelebrationOverlay({
 colorMap,
 iconMap,
 status,
 trigger,
}: StatusAnimationProps) {
 const progress = useSharedValue(0);
 const { width, height } = useWindowDimensions();
 const backdropStyle = useAnimatedStyle<ViewStyle>(() => ({
  position: 'absolute',
  inset: 0,
  opacity: interpolate(progress.value, [0, 0.08, 0.9, 1], [0, 0.18, 0.08, 0], Extrapolation.CLAMP),
  backgroundColor:
   status === 'ABANDONED' ? `${colors.error}18` : status ? `${colorMap[status]}14` : 'transparent',
 }));

 useEffect(() => {
  if (!status || trigger === 0) return;

  progress.value = 0;
  progress.value = withTiming(1, {
   duration: status === 'COMPLETED' ? 1600 : 1250,
   easing: Easing.out(Easing.cubic),
  });
 }, [progress, status, trigger]);

 if (!status || trigger === 0) {
  return null;
 }

 const color = colorMap[status];
 const particles = buildParticles(status, width, height);

 return (
  <View
   pointerEvents="none"
   style={{
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
   }}
  >
   <Animated.View style={backdropStyle} />
   {particles.map((particle) => (
    <CelebrationParticle
     key={`${status}-${particle.xStart}-${particle.yStart}-${particle.xEnd}-${particle.yEnd}`}
     color={color}
     particle={particle}
     progress={progress}
    />
   ))}
   <StatusIcon
    color={color}
    iconName={iconMap[status]}
    progress={progress}
    status={status}
    width={width}
    height={height}
   />
  </View>
 );
});
