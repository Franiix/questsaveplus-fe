import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { SectionTitle } from '@/components/base/layout/SectionTitle';
import { colors, spacing, typography } from '@/shared/theme/tokens';

type GameDescriptionSectionProps = {
 title?: string;
 description: string;
 isExpanded: boolean;
 collapsedLines?: number;
 onToggle: () => void;
};

export function GameDescriptionSection({
 title,
 description,
 isExpanded,
 collapsedLines = 4,
 onToggle,
}: GameDescriptionSectionProps) {
 const { t } = useTranslation();

 if (!description.trim()) return null;

 return (
  <View style={{ marginBottom: spacing.lg }}>
   {title ? <SectionTitle title={title} /> : null}
   <Text
    style={{
     color: colors.text.secondary,
     fontSize: typography.size.base,
     lineHeight: typography.size.base * typography.lineHeight.relaxed,
     fontFamily: typography.font.regular,
     marginTop: title ? spacing.sm : 0,
    }}
    numberOfLines={isExpanded ? undefined : collapsedLines}
   >
    {description}
   </Text>
   <Pressable onPress={onToggle} style={{ marginTop: spacing.xs }}>
    <Text
     style={{
      color: colors.primary.DEFAULT,
      fontSize: typography.size.sm,
      fontFamily: typography.font.semibold,
     }}
    >
     {isExpanded ? t('gameDetail.readLess') : t('gameDetail.readMore')}
    </Text>
   </Pressable>
  </View>
 );
}
