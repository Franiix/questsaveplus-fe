import type { FieldValues, Path } from 'react-hook-form';
import { RhfTextInput, type RhfTextInputProps } from './RhfTextInput';

type RhfNumberInputProps<
 TFieldValues extends FieldValues,
 TFieldName extends Path<TFieldValues>,
> = {
 min?: number;
 max?: number;
} & RhfTextInputProps<TFieldValues, TFieldName>;

type NumericInputValue = string | number | null | undefined;

export function RhfNumberInput<
 TFieldValues extends FieldValues,
 TFieldName extends Path<TFieldValues>,
>({ min, max, rules, ...props }: RhfNumberInputProps<TFieldValues, TFieldName>) {
 const hasExtra = min !== undefined || max !== undefined;

 const mergedRules = hasExtra
  ? {
     ...rules,
     validate: {
      ...(typeof rules?.validate === 'function' ? { _: rules.validate } : (rules?.validate ?? {})),
      ...(min !== undefined && {
       min: (v: NumericInputValue) => !v || Number(v) >= min || `Valore minimo: ${min}`,
      }),
      ...(max !== undefined && {
       max: (v: NumericInputValue) => !v || Number(v) <= max || `Valore massimo: ${max}`,
      }),
     },
    }
  : rules;

 return <RhfTextInput {...props} rules={mergedRules} keyboardType="numeric" />;
}
