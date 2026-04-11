import { ScrollView, Text, View } from 'react-native';
import { FilterChip } from '@/components/base/inputs/FilterChip';
import { colors, spacing, typography } from '@/shared/theme/tokens';
import type { HomeQuickPresetAction } from '@/shared/models/home/HomeQuickPresetAction.model';

type QuickDiscoveryPresetsRowProps = {
 title: string;
 presets: HomeQuickPresetAction[];
};

export function QuickDiscoveryPresetsRow({ title, presets }: QuickDiscoveryPresetsRowProps) {
 if (presets.length === 0) {
  return null;
 }

 return (
  <View style={{ gap: spacing.sm }}>
   <Text
    style={{
     color: colors.text.secondary,
     fontSize: typography.size.xs,
     fontFamily: typography.font.semibold,
     letterSpacing: typography.letterSpacing.wide,
     textTransform: 'uppercase',
    }}
   >
    {title}
   </Text>

   <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    keyboardShouldPersistTaps="handled"
    contentContainerStyle={{ gap: spacing.sm, paddingRight: spacing.md }}
   >
    {presets.map((preset) => (
     <FilterChip
      key={preset.key}
      label={preset.label}
      isSelected={false}
      onPress={preset.onPress}
     />
    ))}
   </ScrollView>
  </View>
 );
}
