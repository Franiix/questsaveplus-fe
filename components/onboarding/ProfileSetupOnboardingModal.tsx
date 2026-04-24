import { FontAwesome5 } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
 Modal,
 type NativeScrollEvent,
 type NativeSyntheticEvent,
 ScrollView,
 Text,
 useWindowDimensions,
 View,
 type ViewStyle,
} from 'react-native';
import Animated, {
 Easing,
 useAnimatedStyle,
 useSharedValue,
 withRepeat,
 withSpring,
 withTiming,
} from 'react-native-reanimated';
import { BaseButton } from '@/components/base/display/BaseButton';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type SlideDescriptor = {
 key: string;
 icon: React.ComponentProps<typeof FontAwesome5>['name'];
 iconColor: string;
 gradientColors: readonly [string, string];
 title: string;
 subtitle: string;
 eyebrow: string;
 chips: Array<{
  icon: React.ComponentProps<typeof FontAwesome5>['name'];
  label: string;
 }>;
};

type ProfileSetupOnboardingModalProps = {
 visible: boolean;
 onClose: () => void;
};

type OnboardingSlideCardProps = {
 cardWidth: number;
 isActive: boolean;
 slide: SlideDescriptor;
};

function BurstParticle({
 angle,
 distance,
 tintColor,
 trigger,
}: {
 angle: number;
 distance: number;
 tintColor: string;
 trigger: number;
}) {
 const progress = useSharedValue(0);

 useEffect(() => {
  if (trigger === 0) return;
  progress.value = 0;
  progress.value = withTiming(1, { duration: 520, easing: Easing.out(Easing.quad) });
 }, [progress, trigger]);

 const angleInRadians = (angle * Math.PI) / 180;
 const particleStyle = useAnimatedStyle<ViewStyle>(() => ({
  opacity: 1 - progress.value,
  transform: [
   { translateX: Math.cos(angleInRadians) * distance * progress.value },
   { translateY: Math.sin(angleInRadians) * distance * progress.value },
   { scale: 1 - progress.value * 0.5 },
  ] as ViewStyle['transform'],
 }));
 const particleBaseStyle: ViewStyle = {
  position: 'absolute',
  width: 12,
  height: 12,
  borderRadius: 999,
  backgroundColor: tintColor,
  shadowColor: tintColor,
  shadowOpacity: 0.45,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 0 },
 };

 return <Animated.View style={[particleBaseStyle, particleStyle]} />;
}

function ButtonBurstEffect({ tintColor, trigger }: { tintColor: string; trigger: number }) {
 const particles = [
  { angle: -90, distance: 72 },
  { angle: -50, distance: 88 },
  { angle: -18, distance: 76 },
  { angle: 18, distance: 76 },
  { angle: 50, distance: 88 },
  { angle: 90, distance: 72 },
 ] as const;
 return (
  <View
   pointerEvents="none"
   style={{
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 18,
    alignItems: 'center',
    justifyContent: 'center',
   }}
  >
   {particles.map((particle) => {
    return (
     <BurstParticle
      key={`${particle.angle}-${particle.distance}`}
      angle={particle.angle}
      distance={particle.distance}
      tintColor={tintColor}
      trigger={trigger}
     />
    );
   })}
  </View>
 );
}

function RocketLaunchEffect({ tintColor, trigger }: { tintColor: string; trigger: number }) {
 const progress = useSharedValue(0);

 useEffect(() => {
  if (trigger === 0) return;
  progress.value = 0;
  progress.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) });
 }, [progress, trigger]);

 const rocketStyle = useAnimatedStyle<ViewStyle>(() => ({
  opacity: progress.value === 0 ? 0 : progress.value < 0.9 ? 1 : 1 - (progress.value - 0.9) / 0.1,
  transform: [
   { translateX: 88 * progress.value },
   { translateY: -230 * progress.value },
   { rotate: '-18deg' },
   { scale: 1 + progress.value * 0.3 },
  ] as ViewStyle['transform'],
 }));

 const trailStyle = useAnimatedStyle<ViewStyle>(() => ({
  opacity: progress.value === 0 ? 0 : 0.7 - progress.value * 0.45,
  transform: [
   { translateX: 44 * progress.value },
   { translateY: -118 * progress.value },
   { scaleY: 1 + progress.value * 1.3 },
  ] as ViewStyle['transform'],
 }));
 const trailBaseStyle: ViewStyle = {
  position: 'absolute',
  right: 18,
  bottom: 42,
  width: 10,
  height: 62,
  borderRadius: 999,
  backgroundColor: `${tintColor}88`,
 };
 const rocketBaseStyle: ViewStyle = {
  position: 'absolute',
  right: 0,
  bottom: 0,
  shadowColor: tintColor,
  shadowOpacity: 0.4,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 0 },
 };

 if (trigger === 0) {
  return null;
 }

 return (
  <View
   pointerEvents="none"
   style={{
    position: 'absolute',
    right: spacing.xl,
    bottom: 10,
    width: 120,
    height: 260,
    overflow: 'visible',
   }}
  >
   <Animated.View style={[trailBaseStyle, trailStyle]} />
   <Animated.View style={[rocketBaseStyle, rocketStyle]}>
    <FontAwesome5 name="rocket" size={26} color={tintColor} solid />
   </Animated.View>
  </View>
 );
}

function SlideVisualChip({
 delayMs,
 icon,
 isActive,
 label,
 tintColor,
}: {
 delayMs: number;
 icon: React.ComponentProps<typeof FontAwesome5>['name'];
 isActive: boolean;
 label: string;
 tintColor: string;
}) {
 const floatY = useSharedValue(isActive ? 0 : 8);
 const glowOpacity = useSharedValue(isActive ? 1 : 0.45);

 useEffect(() => {
  if (!isActive) {
   floatY.value = withTiming(8, { duration: 180 });
   glowOpacity.value = withTiming(0.45, { duration: 180 });
   return;
  }

  floatY.value = withRepeat(
   withTiming(-8, {
    duration: 1800 + delayMs,
    easing: Easing.inOut(Easing.sin),
   }),
   -1,
   true,
  );
  glowOpacity.value = withRepeat(
   withTiming(1, {
    duration: 1400 + delayMs,
    easing: Easing.inOut(Easing.quad),
   }),
   -1,
   true,
  );
 }, [delayMs, floatY, glowOpacity, isActive]);

 const chipStyle = useAnimatedStyle(() => ({
  opacity: glowOpacity.value,
  transform: [{ translateY: floatY.value }],
 }));

 return (
  <Animated.View
   style={[
    {
     flexDirection: 'row',
     alignItems: 'center',
     gap: spacing.sm,
     paddingHorizontal: spacing.md,
     paddingVertical: spacing.sm,
     borderRadius: borderRadius.full,
     borderWidth: 1,
     borderColor: `${tintColor}44`,
     backgroundColor: `${tintColor}16`,
    },
    chipStyle,
   ]}
  >
   <View
    style={{
     width: 26,
     height: 26,
     borderRadius: 13,
     alignItems: 'center',
     justifyContent: 'center',
     backgroundColor: `${tintColor}20`,
    }}
   >
    <FontAwesome5 name={icon} size={11} color={tintColor} solid />
   </View>
   <Text
    style={{
     color: colors.text.primary,
     fontFamily: typography.font.medium,
     fontSize: typography.size.sm,
    }}
   >
    {label}
   </Text>
  </Animated.View>
 );
}

function IndicatorDot({ color, isActive }: { color: string; isActive: boolean }) {
 const width = useSharedValue(isActive ? 26 : 8);
 const opacity = useSharedValue(isActive ? 1 : 0.5);
 const scale = useSharedValue(isActive ? 1 : 0.92);

 useEffect(() => {
  width.value = withTiming(isActive ? 26 : 8, { duration: 180 });
  opacity.value = withTiming(isActive ? 1 : 0.5, { duration: 180 });
  scale.value = withSpring(isActive ? 1 : 0.92, {
   damping: 16,
   stiffness: 190,
  });
 }, [isActive, opacity, scale, width]);

 const style = useAnimatedStyle(() => ({
  width: width.value,
  opacity: opacity.value,
  transform: [{ scale: scale.value }],
 }));

 return (
  <Animated.View
   style={[
    {
     height: 8,
     borderRadius: 999,
     backgroundColor: color,
    },
    style,
   ]}
  />
 );
}

function OnboardingSlideVisual({ isActive, slide }: { isActive: boolean; slide: SlideDescriptor }) {
 const orbScale = useSharedValue(isActive ? 1 : 0.92);
 const orbGlow = useSharedValue(isActive ? 0.24 : 0.12);

 useEffect(() => {
  if (!isActive) {
   orbScale.value = withTiming(0.92, { duration: 180 });
   orbGlow.value = withTiming(0.12, { duration: 180 });
   return;
  }

  orbScale.value = withRepeat(
   withTiming(1.05, {
    duration: 2200,
    easing: Easing.inOut(Easing.sin),
   }),
   -1,
   true,
  );
  orbGlow.value = withRepeat(
   withTiming(0.3, {
    duration: 1800,
    easing: Easing.inOut(Easing.quad),
   }),
   -1,
   true,
  );
 }, [isActive, orbGlow, orbScale]);

 const orbStyle = useAnimatedStyle(() => ({
  transform: [{ scale: orbScale.value }],
  opacity: withTiming(isActive ? 1 : 0.78, { duration: 180 }),
 }));

 const glowStyle = useAnimatedStyle(() => ({
  opacity: orbGlow.value,
 }));

 return (
  <View
   style={{
    minHeight: 160,
    marginTop: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
   }}
  >
   <Animated.View
    style={[
     {
      position: 'absolute',
      width: 180,
      height: 180,
      borderRadius: 90,
      backgroundColor: slide.iconColor,
     },
     glowStyle,
    ]}
   />

   <Animated.View
    style={[
     {
      width: 116,
      height: 116,
      borderRadius: 58,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: `${slide.iconColor}55`,
      backgroundColor: `${slide.iconColor}14`,
      shadowColor: slide.iconColor,
      shadowOpacity: 0.28,
      shadowRadius: 22,
      shadowOffset: { width: 0, height: 12 },
      elevation: 12,
     },
     orbStyle,
    ]}
   >
    <LinearGradient
     colors={[slide.gradientColors[0], slide.gradientColors[1]]}
     style={{
      position: 'absolute',
      inset: 0,
      borderRadius: 58,
     }}
    />
    <FontAwesome5 name={slide.icon} size={34} color={slide.iconColor} solid />
   </Animated.View>

   <View style={{ width: '100%', gap: spacing.sm }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm }}>
     <SlideVisualChip
      delayMs={0}
      icon={slide.chips[0].icon}
      isActive={isActive}
      label={slide.chips[0].label}
      tintColor={slide.iconColor}
     />
     <SlideVisualChip
      delayMs={180}
      icon={slide.chips[1].icon}
      isActive={isActive}
      label={slide.chips[1].label}
      tintColor={slide.iconColor}
     />
    </View>
    <View style={{ alignItems: 'center' }}>
     <SlideVisualChip
      delayMs={360}
      icon={slide.chips[2].icon}
      isActive={isActive}
      label={slide.chips[2].label}
      tintColor={slide.iconColor}
     />
    </View>
   </View>
  </View>
 );
}

function OnboardingSlideCard({ cardWidth, isActive, slide }: OnboardingSlideCardProps) {
 const cardScale = useSharedValue(isActive ? 1 : 0.97);
 const cardOpacity = useSharedValue(isActive ? 1 : 0.72);
 const contentOffset = useSharedValue(isActive ? 0 : 18);
 const iconScale = useSharedValue(isActive ? 1 : 0.88);

 useEffect(() => {
  cardScale.value = withSpring(isActive ? 1 : 0.97, {
   damping: 18,
   stiffness: 180,
  });
  cardOpacity.value = withTiming(isActive ? 1 : 0.72, { duration: 220 });
  contentOffset.value = withSpring(isActive ? 0 : 18, {
   damping: 20,
   stiffness: 170,
  });
  iconScale.value = withSpring(isActive ? 1 : 0.88, {
   damping: 14,
   stiffness: 220,
  });
 }, [cardOpacity, cardScale, contentOffset, iconScale, isActive]);

 const cardStyle = useAnimatedStyle(() => ({
  opacity: cardOpacity.value,
  transform: [{ scale: cardScale.value }],
 }));

 const iconStyle = useAnimatedStyle(() => ({
  transform: [{ scale: iconScale.value }],
 }));

 const contentStyle = useAnimatedStyle(() => ({
  opacity: withTiming(isActive ? 1 : 0.8, { duration: 220 }),
  transform: [{ translateY: contentOffset.value }],
 }));

 return (
  <View
   style={{
    width: cardWidth,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
   }}
  >
   <Animated.View
    style={[
     {
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: isActive ? `${slide.iconColor}44` : 'rgba(255,255,255,0.08)',
      backgroundColor: 'rgba(17,19,34,0.86)',
      padding: spacing.lg,
      minHeight: 380,
      justifyContent: 'space-between',
      shadowColor: slide.iconColor,
      shadowOpacity: isActive ? 0.18 : 0.08,
      shadowRadius: isActive ? 24 : 10,
      shadowOffset: { width: 0, height: isActive ? 14 : 6 },
      elevation: isActive ? 14 : 6,
     },
     cardStyle,
    ]}
   >
    <LinearGradient
     colors={[slide.gradientColors[0], slide.gradientColors[1], 'rgba(255,255,255,0.02)']}
     style={{
      position: 'absolute',
      inset: 0,
      borderRadius: borderRadius.lg,
     }}
    />
    <Animated.View style={iconStyle}>
     <OnboardingSlideVisual isActive={isActive} slide={slide} />
    </Animated.View>

    <Animated.View style={[{ gap: spacing.sm, marginTop: spacing.lg }, contentStyle]}>
     <Text
      style={{
       color: slide.iconColor,
       fontFamily: typography.font.semibold,
       fontSize: typography.size.xs,
       textTransform: 'uppercase',
       letterSpacing: typography.letterSpacing.wide,
      }}
     >
      {slide.eyebrow}
     </Text>
     <Text
      style={{
       color: colors.text.primary,
       fontFamily: typography.font.bold,
       fontSize: typography.size['2xl'],
       lineHeight: Math.ceil(typography.size['2xl'] * typography.lineHeight.snug),
      }}
     >
      {slide.title}
     </Text>
     <Text
      style={{
       color: colors.text.secondary,
       fontFamily: typography.font.regular,
       fontSize: typography.size.md,
       lineHeight: Math.ceil(typography.size.md * typography.lineHeight.relaxed),
      }}
     >
      {slide.subtitle}
     </Text>
    </Animated.View>
   </Animated.View>
  </View>
 );
}

export function ProfileSetupOnboardingModal({
 visible,
 onClose,
}: ProfileSetupOnboardingModalProps) {
 const { t } = useTranslation();
 const { width: screenWidth } = useWindowDimensions();
 const scrollRef = useRef<ScrollView | null>(null);
 const [currentIndex, setCurrentIndex] = useState(0);
 const [buttonBurstTrigger, setButtonBurstTrigger] = useState(0);
 const [rocketLaunchTrigger, setRocketLaunchTrigger] = useState(0);
 const [isAdvancing, setIsAdvancing] = useState(false);
 const cardWidth = Math.max(280, screenWidth - spacing.lg * 2);

 const slides = useMemo<SlideDescriptor[]>(
  () => [
   {
    key: 'backlog',
    icon: 'bookmark',
    iconColor: colors.primary['200'],
    gradientColors: ['rgba(108,99,255,0.22)', 'rgba(0,212,255,0.08)'],
    eyebrow: t('home.firstRunOnboarding.slides.backlog.eyebrow'),
    title: t('home.firstRunOnboarding.slides.backlog.title'),
    subtitle: t('home.firstRunOnboarding.slides.backlog.subtitle'),
    chips: [
     {
      icon: 'tasks',
      label: t('home.firstRunOnboarding.slides.backlog.chips.0'),
     },
     {
      icon: 'star',
      label: t('home.firstRunOnboarding.slides.backlog.chips.1'),
     },
     {
      icon: 'sticky-note',
      label: t('home.firstRunOnboarding.slides.backlog.chips.2'),
     },
    ],
   },
   {
    key: 'play-next',
    icon: 'bolt',
    iconColor: colors.warning,
    gradientColors: ['rgba(251,146,60,0.22)', 'rgba(248,113,113,0.08)'],
    eyebrow: t('home.firstRunOnboarding.slides.playNext.eyebrow'),
    title: t('home.firstRunOnboarding.slides.playNext.title'),
    subtitle: t('home.firstRunOnboarding.slides.playNext.subtitle'),
    chips: [
     {
      icon: 'thumbtack',
      label: t('home.firstRunOnboarding.slides.playNext.chips.0'),
     },
     {
      icon: 'sort-amount-down',
      label: t('home.firstRunOnboarding.slides.playNext.chips.1'),
     },
     {
      icon: 'crosshairs',
      label: t('home.firstRunOnboarding.slides.playNext.chips.2'),
     },
    ],
   },
   {
    key: 'archive',
    icon: 'archive',
    iconColor: colors.accent.light,
    gradientColors: ['rgba(0,212,255,0.18)', 'rgba(108,99,255,0.08)'],
    eyebrow: t('home.firstRunOnboarding.slides.archive.eyebrow'),
    title: t('home.firstRunOnboarding.slides.archive.title'),
    subtitle: t('home.firstRunOnboarding.slides.archive.subtitle'),
    chips: [
     {
      icon: 'eye-slash',
      label: t('home.firstRunOnboarding.slides.archive.chips.0'),
     },
     {
      icon: 'archive',
      label: t('home.firstRunOnboarding.slides.archive.chips.1'),
     },
     {
      icon: 'undo-alt',
      label: t('home.firstRunOnboarding.slides.archive.chips.2'),
     },
    ],
   },
  ],
  [t],
 );

 useEffect(() => {
  if (!visible) return;
  setCurrentIndex(0);
  scrollRef.current?.scrollTo({ x: 0, y: 0, animated: false });
 }, [visible]);

 function handleMomentumEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
  const nextIndex = Math.round(event.nativeEvent.contentOffset.x / cardWidth);
  setCurrentIndex(Math.max(0, Math.min(nextIndex, slides.length - 1)));
 }

 async function handleNext() {
  if (isAdvancing) return;

  setIsAdvancing(true);

  if (currentIndex >= slides.length - 1) {
   setRocketLaunchTrigger((value) => value + 1);
   await wait(820);
   setIsAdvancing(false);
   onClose();
   return;
  }

  setButtonBurstTrigger((value) => value + 1);
  await wait(220);
  const nextIndex = currentIndex + 1;
  scrollRef.current?.scrollTo({ x: nextIndex * cardWidth, animated: true });
  setCurrentIndex(nextIndex);
  setIsAdvancing(false);
 }

 return (
  <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
   <View style={{ flex: 1 }}>
    <BlurView intensity={72} tint="dark" style={{ position: 'absolute', inset: 0 }} />
    <LinearGradient
     colors={['rgba(7,8,18,0.84)', 'rgba(9,10,22,0.92)', 'rgba(10,10,20,0.96)']}
     style={{ position: 'absolute', inset: 0 }}
    />

    <View
     style={{
      flex: 1,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing['3xl'],
      paddingBottom: spacing['2xl'],
      justifyContent: 'center',
     }}
    >
     <View
      style={{
       borderRadius: borderRadius.xl,
       overflow: 'hidden',
       borderWidth: 1,
       borderColor: 'rgba(255,255,255,0.10)',
       backgroundColor: 'rgba(14,16,28,0.82)',
      }}
     >
      <LinearGradient
       colors={['rgba(108,99,255,0.10)', 'rgba(0,212,255,0.06)', 'rgba(255,255,255,0.02)']}
       style={{ position: 'absolute', inset: 0 }}
      />

      <View
       style={{
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
       }}
      >
       <View style={{ gap: spacing.xs }}>
        <Text
         style={{
          color: colors.text.secondary,
          fontFamily: typography.font.semibold,
          fontSize: typography.size.xs,
          textTransform: 'uppercase',
          letterSpacing: typography.letterSpacing.wide,
         }}
        >
         {t('home.firstRunOnboarding.eyebrow')}
        </Text>
        <Text
         style={{
          color: colors.text.primary,
          fontFamily: typography.font.bold,
          fontSize: typography.size.xl,
         }}
        >
         {t('home.firstRunOnboarding.title')}
        </Text>
       </View>
      </View>

      <Text
       style={{
        color: colors.text.secondary,
        fontFamily: typography.font.regular,
        fontSize: typography.size.sm,
        lineHeight: Math.ceil(typography.size.sm * typography.lineHeight.relaxed),
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.sm,
       }}
      >
       {t('home.firstRunOnboarding.subtitle')}
      </Text>

      <ScrollView
       ref={scrollRef}
       horizontal
       pagingEnabled
       showsHorizontalScrollIndicator={false}
       bounces={false}
       onMomentumScrollEnd={handleMomentumEnd}
       style={{ marginTop: spacing.lg }}
      >
       {slides.map((slide, index) => (
        <OnboardingSlideCard
         key={slide.key}
         cardWidth={cardWidth}
         isActive={index === currentIndex}
         slide={slide}
        />
       ))}
      </ScrollView>

      <View
       style={{
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.lg,
        gap: spacing.md,
       }}
      >
       <View
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
       >
        {slides.map((slide, index) => (
         <IndicatorDot
          key={slide.key}
          color={index === currentIndex ? slide.iconColor : 'rgba(255,255,255,0.16)'}
          isActive={index === currentIndex}
         />
        ))}
       </View>

       <View style={{ flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
        <ButtonBurstEffect
         tintColor={slides[currentIndex]?.iconColor ?? colors.primary.DEFAULT}
         trigger={buttonBurstTrigger}
        />
        <RocketLaunchEffect
         tintColor={slides[currentIndex]?.iconColor ?? colors.primary.DEFAULT}
         trigger={rocketLaunchTrigger}
        />
        <View style={{ flex: 1 }}>
         <BaseButton
          label={
           currentIndex === slides.length - 1
            ? t('home.firstRunOnboarding.finish')
            : t('home.firstRunOnboarding.next')
          }
          iconRight={currentIndex === slides.length - 1 ? 'rocket' : undefined}
          onPress={() => void handleNext()}
          isDisabled={isAdvancing}
          fullWidth
         />
        </View>
       </View>
      </View>
     </View>
    </View>
   </View>
  </Modal>
 );
}
