import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { BaseButton } from '@/components/base/display/BaseButton';
import { Card } from '@/components/base/display/Card';
import { ChipGroup } from '@/components/base/inputs/ChipGroup';
import { RatingStepper } from '@/components/base/inputs/RatingStepper';
import { TextAreaInput } from '@/components/base/inputs/TextAreaInput';
import type { BacklogStatusEnum } from '@/shared/enums/BacklogStatus.enum';
import { colors, spacing, typography } from '@/shared/theme/tokens';
import { formatDate } from '@/shared/utils/date';

type StatusOption = {
 label: string;
 value: BacklogStatusEnum;
 icon?: React.ComponentProps<typeof import('@expo/vector-icons').FontAwesome5>['name'];
 color?: string;
};

type GameBacklogPanelProps = {
 isInBacklog: boolean;
 isBacklogLoading: boolean;
 isMutating: boolean;
 isCreateMutating: boolean;
 isUpdateMutating: boolean;
 isDeleteMutating: boolean;
 selectedStatus: BacklogStatusEnum;
 selectedRating: number;
 localNotes?: string;
 showNotes?: boolean;
 hasPendingChanges: boolean;
 statusOptions: readonly StatusOption[];
 onStatusChange: (value: string) => void;
 onRatingChange: (rating: number) => void;
 onChangeNotes?: (value: string) => void;
 onNotesFocus?: () => void;
 onAdd: () => void;
 onUpdate: () => void;
 onRemove: () => void;
 addedAt?: string | null;
};

function SectionLabel({ children }: { children: string }) {
 return (
  <Text
   style={{
    color: colors.text.tertiary,
    fontSize: typography.size.caption,
    fontFamily: typography.font.semibold,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wide,
    marginBottom: spacing.sm,
   }}
  >
   {children}
  </Text>
 );
}

export function GameBacklogPanel({
 isInBacklog,
 isBacklogLoading,
 isMutating,
 isCreateMutating,
 isUpdateMutating,
 isDeleteMutating,
 selectedStatus,
 selectedRating,
 localNotes = '',
 showNotes = false,
 hasPendingChanges,
 statusOptions,
 onStatusChange,
 onRatingChange,
 onChangeNotes,
 onNotesFocus,
 onAdd,
 onUpdate,
 onRemove,
 addedAt,
}: GameBacklogPanelProps) {
 const { t, i18n } = useTranslation();

 return (
  <Card
   variant="outlined"
   style={{
    padding: spacing.md,
   }}
  >
   <View style={{ gap: spacing.md }}>
    <View>
     <SectionLabel>{t('gameDetail.yourStatus')}</SectionLabel>
     <ChipGroup
      options={[...statusOptions]}
      value={selectedStatus}
      onChange={onStatusChange}
      isDisabled={isBacklogLoading || isMutating}
     />
    </View>

    {isInBacklog && addedAt ? (
     <Text
      style={{
       color: colors.text.tertiary,
       fontSize: typography.size.xs,
       fontFamily: typography.font.regular,
      }}
     >
      {t('backlog.addedOn', {
       date: formatDate(addedAt, i18n.language, { day: 'numeric', month: 'long', year: 'numeric' }),
      })}
     </Text>
    ) : null}

    {isInBacklog ? (
     <View>
      <SectionLabel>{t('gameDetail.yourRating')}</SectionLabel>
      <RatingStepper
       value={selectedRating}
       onChange={onRatingChange}
       isDisabled={isBacklogLoading || isMutating}
       size="md"
      />
     </View>
    ) : null}

    {isInBacklog && showNotes && onChangeNotes ? (
     <View>
      <SectionLabel>{t('gameDetail.yourNotes')}</SectionLabel>
      <TextAreaInput
       value={localNotes}
       onChangeText={onChangeNotes}
       placeholder={t('gameDetail.notesPlaceholder')}
       minRows={2}
       maxRows={5}
       autoResize={false}
       editable={!isBacklogLoading && !isMutating}
       onFocus={onNotesFocus}
       accessibilityLabel={t('gameDetail.yourNotes')}
      />
     </View>
    ) : null}

    {isInBacklog ? (
     <View style={{ gap: spacing.sm }}>
      <BaseButton
       label={t('gameDetail.updateButton')}
       variant="filled"
       onPress={onUpdate}
       isLoading={isUpdateMutating}
       isDisabled={isBacklogLoading || isMutating || !hasPendingChanges}
       fullWidth
      />
      <BaseButton
       label={t('gameDetail.removeFromBacklog')}
       variant="outlined"
       color={colors.error}
       onPress={onRemove}
       isLoading={isDeleteMutating}
       isDisabled={isBacklogLoading || isMutating}
       fullWidth
      />
     </View>
    ) : (
     <BaseButton
      label={t('gameDetail.addToBacklog')}
      variant="filled"
      onPress={onAdd}
      isLoading={isCreateMutating}
      isDisabled={isBacklogLoading || isMutating}
      fullWidth
     />
    )}
   </View>
  </Card>
 );
}
