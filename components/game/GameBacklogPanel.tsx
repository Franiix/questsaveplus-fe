import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { BaseButton } from '@/components/base/display/BaseButton';
import { Card } from '@/components/base/display/Card';
import { LoadingSpinner } from '@/components/base/feedback/LoadingSpinner';
import { ChipGroup } from '@/components/base/inputs/ChipGroup';
import { DatePickerInput } from '@/components/base/inputs/DatePickerInput';
import { RatingStepper } from '@/components/base/inputs/RatingStepper';
import { SearchableMultiSelectInput } from '@/components/base/inputs/SearchableMultiSelectInput';
import type { SearchableSelectOption } from '@/components/base/inputs/SearchableSelectInput';
import { TextAreaInput } from '@/components/base/inputs/TextAreaInput';
import { BacklogStatusEnum } from '@/shared/enums/BacklogStatus.enum';
import { colors, spacing, typography } from '@/shared/theme/tokens';
import { isBacklogStatusRateable } from '@/shared/utils/backlogRating';
import { formatDate } from '@/shared/utils/date';

type StatusOption = {
 label: string;
 value: BacklogStatusEnum;
 icon?: React.ComponentProps<typeof import('@expo/vector-icons').FontAwesome5>['name'];
 color?: string;
};

type GameBacklogPanelProps = {
 isInBacklog: boolean;
 isArchived?: boolean;
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
 localPlatformPlayed?: string[] | null;
 showNotes?: boolean;
 hasPendingChanges: boolean;
 availablePlatformValues?: string[];
 platformOptions?: SearchableSelectOption[];
 statusOptions: readonly StatusOption[];
 onStatusChange: (value: string) => void;
 onRatingChange: (rating: number) => void;
 onChangeNotes?: (value: string) => void;
 onNotesFocus?: () => void;
 onStartedAtChange?: (value: string | null) => void;
 onCompletedAtChange?: (value: string | null) => void;
 onAbandonedAtChange?: (value: string | null) => void;
 onResumedAtChange?: (value: string | null) => void;
 onPlatformPlayedChange?: (value: string[] | null) => void;
 onAdd: () => void;
 onUpdate: () => void;
 onRemove: () => void;
 onRestoreFromArchive?: () => void;
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
 isArchived = false,
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
 localPlatformPlayed,
 showNotes = false,
 hasPendingChanges,
 availablePlatformValues = [],
 platformOptions = [],
 statusOptions,
 onStatusChange,
 onRatingChange,
 onChangeNotes,
 onNotesFocus,
 onStartedAtChange,
 onCompletedAtChange,
 onAbandonedAtChange,
 onResumedAtChange,
 onPlatformPlayedChange,
 onAdd,
 onUpdate,
 onRemove,
 onRestoreFromArchive,
 addedAt,
 updatedAt,
}: GameBacklogPanelProps) {
 const { t, i18n } = useTranslation();

 if (isBacklogLoading) {
  return (
   <Card
    variant="outlined"
    style={{
     padding: spacing.md,
     minHeight: 164,
     alignItems: 'center',
     justifyContent: 'center',
    }}
   >
    <View style={{ gap: spacing.sm, alignItems: 'center' }}>
     <LoadingSpinner />
     <Text
      style={{
       color: colors.text.secondary,
       fontSize: typography.size.sm,
       textAlign: 'center',
      }}
     >
      {t('backlog.panelLoading')}
     </Text>
    </View>
   </Card>
  );
 }

 const showStartedAt = SHOW_STARTED_AT_STATUSES.has(selectedStatus) || Boolean(localStartedAt);
 const showCompletedAt =
  selectedStatus === BacklogStatusEnum.COMPLETED || Boolean(localCompletedAt);
 const showAbandonedAt =
  selectedStatus === BacklogStatusEnum.ABANDONED || Boolean(localAbandonedAt);
 const showResumedAt =
  SHOW_RESUMED_AT_STATUSES.has(selectedStatus) &&
  (Boolean(localResumedAt) || Boolean(localAbandonedAt));
 const showPlatformPlayed = Boolean(localPlatformPlayed?.length) || platformOptions.length > 0;
 const unavailablePlatforms =
  localPlatformPlayed?.filter(
   (selectedValue) => !availablePlatformValues.includes(selectedValue),
  ) ?? [];
 const isPlatformPlayedUnavailable = unavailablePlatforms.length > 0;
 const isDisabled = isBacklogLoading || isMutating;
 const canRateGame = isBacklogStatusRateable(selectedStatus);

 if (isInBacklog && isArchived) {
  return (
   <Card
    variant="outlined"
    style={{
     padding: spacing.md,
    }}
   >
    <View style={{ gap: spacing.md }}>
     <View style={{ gap: spacing.xs }}>
      <SectionLabel>{t('backlog.archive.title')}</SectionLabel>
      <Text
       style={{
        color: colors.text.secondary,
        fontSize: typography.size.sm,
        lineHeight: Math.ceil(typography.size.sm * typography.lineHeight.relaxed),
       }}
      >
       {t('backlog.archive.readOnlyDescription')}
      </Text>
     </View>

     <BaseButton
      label={t('backlog.archive.restoreAction')}
      variant="outlined"
      onPress={onRestoreFromArchive}
      isLoading={isUpdateMutating}
      isDisabled={isDisabled || !onRestoreFromArchive}
      fullWidth
     />
    </View>
   </Card>
  );
 }

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

    {isInBacklog && showPlatformPlayed && onPlatformPlayedChange ? (
     <View>
      <SectionLabel>{t('backlog.platformPlayedLabel')}</SectionLabel>
      <SearchableMultiSelectInput
       options={platformOptions}
       value={localPlatformPlayed ?? []}
       onChange={(value) => onPlatformPlayedChange(value.length > 0 ? value : null)}
       placeholder={t('backlog.platformSelection.placeholder')}
       title={t('backlog.platformSelection.title')}
       searchPlaceholder={t('backlog.platformSelection.placeholder')}
       accessibilityLabel={t('backlog.platformPlayedLabel')}
       emptyLabel={t('backlog.platformSelection.unavailable')}
       isDisabled={isDisabled || platformOptions.length === 0}
      />
      {isPlatformPlayedUnavailable ? (
       <Text
        style={{
         marginTop: spacing.xs,
         color: colors.error,
         fontSize: typography.size.xs,
         lineHeight: Math.ceil(typography.size.xs * typography.lineHeight.normal),
        }}
       >
        {t('backlog.platformSelection.noLongerAvailable', {
         platforms: unavailablePlatforms.join(', '),
        })}
       </Text>
      ) : null}
     </View>
    ) : null}

    {isInBacklog && canRateGame ? (
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
