import { FontAwesome5 } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';
import { borderRadius, colors, spacing } from '@/shared/theme/tokens';
import { StarRatingInput } from './StarRatingInput';

type RatingStepperProps = {
 value: number;
 onChange: (rating: number) => void;
 isDisabled?: boolean;
 size?: 'sm' | 'md' | 'lg';
 min?: number;
 max?: number;
 step?: number;
};

function clampToStep(value: number, min: number, max: number, step: number): number {
 const rounded = Math.round(value / step) * step;
 return Math.max(min, Math.min(max, rounded));
}

export function RatingStepper({
 value,
 onChange,
 isDisabled = false,
 size = 'md',
 min = 0,
 max = 5,
 step = 0.5,
}: RatingStepperProps) {
 const canDecrease = value > min;
 const canIncrease = value < max;

 function handleDecrease() {
  if (isDisabled) return;
  onChange(clampToStep(value - step, min, max, step));
 }

 function handleIncrease() {
  if (isDisabled) return;
  onChange(clampToStep(value + step, min, max, step));
 }

 return (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
   <Pressable
    onPress={handleDecrease}
    disabled={!canDecrease || isDisabled}
    hitSlop={8}
    style={{
     width: 32,
     height: 32,
     borderRadius: borderRadius.full,
     borderWidth: 1,
     borderColor: canDecrease ? colors.border.strong : colors.border.DEFAULT,
     alignItems: 'center',
     justifyContent: 'center',
     opacity: !canDecrease || isDisabled ? 0.45 : 1,
    }}
   >
    <FontAwesome5 name="minus" size={12} color={colors.text.secondary} solid />
   </Pressable>

   <StarRatingInput value={value} onChange={onChange} isDisabled={isDisabled} size={size} />

   <Pressable
    onPress={handleIncrease}
    disabled={!canIncrease || isDisabled}
    hitSlop={8}
    style={{
     width: 32,
     height: 32,
     borderRadius: borderRadius.full,
     borderWidth: 1,
     borderColor: canIncrease ? colors.border.strong : colors.border.DEFAULT,
     alignItems: 'center',
     justifyContent: 'center',
     opacity: !canIncrease || isDisabled ? 0.45 : 1,
    }}
   >
    <FontAwesome5 name="plus" size={12} color={colors.text.secondary} solid />
   </Pressable>
  </View>
 );
}
