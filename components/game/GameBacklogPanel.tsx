import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { BaseButton } from '@/components/base/display/BaseButton';
import { Card } from '@/components/base/display/Card';
import { ChipGroup } from '@/components/base/inputs/ChipGroup';
import { DatePickerInput } from '@/components/base/inputs/DatePickerInput';
import { RatingStepper } from '@/components/base/inputs/RatingStepper';
import { TextAreaInput } from '@/components/base/inputs/TextAreaInput';
import { BacklogStatusEnum } from '@/shared/enums/BacklogStatus.enum';
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
 localStartedAt?: string | null;
 localCompletedAt?: string | null;
 localAbandonedAt?: string | null;
 localResumedAt?: string | null;
 showNotes?: boolean;
 hasPendingChanges: boolean;
 statusOptions: readonly StatusOption[];
 onStatusChange: (value: string) => void;
 onRatingChange: (rating: number) => void;
 onChangeNotes?: (value: string) => void;
 onNotesFocus?: () => void;
 onStartedAtChange?: (value: string | null) => void;
 onCompletedAtChange?: (value: string | null) => void;
 onAbandonedAtChange?: (value: string | null) => void;
 onResumedAtChange?: (value: string | null) => void;
 onAdd: () => void;
 onUpdate: () => void;
 onRemove: () => void;
 addedAt?: string | null;
 updatedAt?: string | null;
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

const SHOW_STARTED_AT_STATUSES = new Set<BacklogStatusEnum>([
 BacklogStatusEnum.PLAYING,
 BacklogStatusEnum.ONGOING,
 BacklogStatusEnum.COMPLETED,
 BacklogStatusEnum.ABANDONED,
]);

const SHOW_RESUMED_AT_STATUSES = new Set<BacklogStatusEnum>([
 BacklogStatusEnum.PLAYING,
 BacklogStatusEnum.ONGOING,
 BacklogStatusEnum.COMPLETED,
]);

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
 localStartedAt,
 localCompletedAt,
 localAbandonedAt,
 localResumedAt,
 showNotes = false,
 hasPendingChanges,
 statusOptions,
 onStatusChange,
 onRatingChange,
 onChangeNotes,
 onNotesFocus,
 onStartedAtChange,
 onCompletedAtChange,
 onAbandonedAtChange,
 onResumedAtChange,
 onAdd,
 onUpdate,
 onRemove,
 addedAt,
 updatedAt,
}: GameBacklogPanelProps) {
 const { t, i18n } = useTranslation();

 const showStartedAt = SHOW_STARTED_AT_STATUSES.has(selectedStatus) || Boolean(localStartedAt);
 const showCompletedAt =
  selectedStatus === BacklogStatusEnum.COMPLETED || Boolean(localCompletedAt);
 const showAbandonedAt =
  selectedStatus === BacklogStatusEnum.ABANDONED || Boolean(localAbandonedAt);
 const showResumedAt =
  SHOW_RESUMED_AT_STATUSES.has(selectedStatus) &&
  (Boolean(localResumedAt) || Boolean(localAbandonedAt));
 const isDisabled = isBacklogLoading || isMutating;

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
      isDisabled={isDisabled}
     />
    </View>

    {isInBacklog && addedAt ? (
     <View>
      <SectionLabel>{t('backlog.addedAtLabel')}</SectionLabel>
      <DatePickerInput
       value={new Date(addedAt)}
       onChange={() => {}}
       isDisabled
       accessibilityLabel={t('backlog.addedAtLabel')}
      />
     </View>
    ) : null}

    {isInBacklog && showStartedAt && onStartedAtChange ? (
     <View>
      <SectionLabel>{t('backlog.startedAtLabel')}</SectionLabel>
      <DatePickerInput
       value={localStartedAt ? new Date(localStartedAt) : undefined}
       onChange={(date) => onStartedAtChange(date.toISOString())}
       placeholder={t('gameDetail.datePlaceholder')}
       maximumDate={new Date()}
       isDisabled={isDisabled}
       accessibilityLabel={t('backlog.startedAtLabel')}
      />
     </View>
    ) : null}

    {isInBacklog && showCompletedAt && onCompletedAtChange ? (
     <View>
      <SectionLabel>{t('backlog.completedAtLabel')}</SectionLabel>
      <DatePickerInput
       value={localCompletedAt ? new Date(localCompletedAt) : undefined}
       onChange={(date) => onCompletedAtChange(date.toISOString())}
       placeholder={t('gameDetail.datePlaceholder')}
       maximumDate={new Date()}
       isDisabled={isDisabled}
       accessibilityLabel={t('backlog.completedAtLabel')}
      />
     </View>
    ) : null}

    {isInBacklog && showAbandonedAt && onAbandonedAtChange ? (
     <View>
      <SectionLabel>{t('backlog.abandonedAtLabel')}</SectionLabel>
      <DatePickerInput
       value={localAbandonedAt ? new Date(localAbandonedAt) : undefined}
       onChange={(date) => onAbandonedAtChange(date.toISOString())}
       placeholder={t('gameDetail.datePlaceholder')}
       maximumDate={new Date()}
       isDisabled={isDisabled}
       accessibilityLabel={t('backlog.abandonedAtLabel')}
      />
     </View>
    ) : null}

    {isInBacklog && showResumedAt && onResumedAtChange ? (
     <View>
      <SectionLabel>{t('backlog.resumedAtLabel')}</SectionLabel>
      <DatePickerInput
       value={localResumedAt ? new Date(localResumedAt) : undefined}
       onChange={(date) => onResumedAtChange(date.toISOString())}
       placeholder={t('gameDetail.datePlaceholder')}
       maximumDate={new Date()}
       isDisabled={isDisabled}
       accessibilityLabel={t('backlog.resumedAtLabel')}
      />
     </View>
    ) : null}

    {isInBacklog ? (
     <View>
      <SectionLabel>{t('gameDetail.yourRating')}</SectionLabel>
      <RatingStepper
       value={selectedRating}
       onChange={onRatingChange}
       isDisabled={isDisabled}
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
       editable={!isDisabled}
       onFocus={onNotesFocus}
       accessibilityLabel={t('gameDetail.yourNotes')}
      />
     </View>
    ) : null}

    {isInBacklog && updatedAt ? (
     <Text
      style={{
       color: colors.text.tertiary,
       fontSize: typography.size.xs,
       fontFamily: typography.font.regular,
       textAlign: 'right',
      }}
     >
      {t('gameDetail.lastModified', {
       date: formatDate(updatedAt, i18n.language, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
       }),
      })}
     </Text>
    ) : null}

    {isInBacklog ? (
     <View style={{ gap: spacing.sm }}>
      <BaseButton
       label={t('gameDetail.updateButton')}
       variant="filled"
       onPress={onUpdate}
       isLoading={isUpdateMutating}
       isDisabled={isDisabled || !hasPendingChanges}
       fullWidth
      />
      <BaseButton
       label={t('gameDetail.removeFromBacklog')}
       variant="outlined"
       color={colors.error}
       onPress={onRemove}
       isLoading={isDeleteMutating}
       isDisabled={isDisabled}
       fullWidth
      />
     </View>
    ) : (
     <BaseButton
      label={t('gameDetail.addToBacklog')}
      variant="filled"
      onPress={onAdd}
      isLoading={isCreateMutating}
      isDisabled={isDisabled}
      fullWidth
     />
    )}
   </View>
  </Card>
 );
}
