import { FontAwesome5 } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, View } from 'react-native';
import { colors, opacity as opacityTokens, spacing } from '@/shared/theme/tokens';

const STAR_COUNT = 5;

const STAR_SIZE_MAP = {
 sm: 14,
 md: 20,
 lg: 28,
} as const;

type StarRatingInputProps = {
 /** Valore 0-5 con step da 0.5. */
 value?: number;
 onChange: (rating: number) => void;
 isDisabled?: boolean;
 readOnly?: boolean;
 size?: keyof typeof STAR_SIZE_MAP;
};

function clampToHalfStep(value: number): number {
 return Math.max(0, Math.min(STAR_COUNT, Math.round(value * 2) / 2));
}

function getStarIcon(fillAmount: number): ComponentProps<typeof FontAwesome5>['name'] {
 if (fillAmount >= 1) return 'star';
 if (fillAmount >= 0.5) return 'star-half-alt';
 return 'star';
}

export function StarRatingInput({
 value,
 onChange,
 isDisabled = false,
 readOnly = false,
 size = 'lg',
}: StarRatingInputProps) {
 const normalizedValue = value ? clampToHalfStep(value) : 0;
 const isInteractive = !isDisabled && !readOnly;
 const starSize = STAR_SIZE_MAP[size];

 function handlePress(nextValue: number) {
  if (!isInteractive) return;

  if (nextValue === normalizedValue) {
   onChange(0);
   return;
  }

  onChange(nextValue);
 }

 return (
  <View
   style={{
    flexDirection: 'row',
    gap: spacing.xs,
    opacity: isDisabled && !readOnly ? opacityTokens.disabled : 1,
   }}
   accessibilityRole={readOnly ? 'image' : 'adjustable'}
   accessibilityLabel={`Valutazione: ${normalizedValue} su 5`}
  >
   {Array.from({ length: STAR_COUNT }, (_, i) => {
    const starNumber = i + 1;
    const starBase = starNumber - 1;
    const fillAmount = Math.max(0, Math.min(1, normalizedValue - starBase));
    const iconName = getStarIcon(fillAmount);
    const isHalfFilled = fillAmount === 0.5;
    const leftValue = starBase + 0.5;
    const rightValue = starNumber;

    return (
     <View
      key={starNumber}
      style={{
       width: starSize,
       height: starSize,
       alignItems: 'center',
       justifyContent: 'center',
       position: 'relative',
      }}
     >
      <FontAwesome5
       name={iconName}
       size={starSize}
       color={fillAmount > 0 ? colors.warning : colors.border.DEFAULT}
       solid={!isHalfFilled && fillAmount > 0}
      />

      {isInteractive ? (
       <View
        pointerEvents="box-none"
        style={{
         position: 'absolute',
         inset: 0,
         flexDirection: 'row',
        }}
       >
        <Pressable
         onPress={() => handlePress(leftValue)}
         accessibilityRole="button"
         accessibilityLabel={`${leftValue} su 5`}
         accessibilityState={{ selected: normalizedValue === leftValue }}
         hitSlop={4}
         style={{ flex: 1 }}
        />
        <Pressable
         onPress={() => handlePress(rightValue)}
         accessibilityRole="button"
         accessibilityLabel={`${rightValue} su 5`}
         accessibilityState={{ selected: normalizedValue === rightValue }}
         hitSlop={4}
         style={{ flex: 1 }}
        />
       </View>
      ) : null}
     </View>
    );
   })}
  </View>
 );
}
