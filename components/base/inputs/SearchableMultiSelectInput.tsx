import { FontAwesome5 } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
 type ListRenderItemInfo,
 Modal,
 Pressable,
 SectionList,
 type SectionListData,
 Text,
 TouchableOpacity,
 View,
 type ViewStyle,
} from 'react-native';
import { ModalCloseButton } from '@/components/base/feedback/ModalCloseButton';
import type { SearchableSelectOption } from '@/components/base/inputs/SearchableSelectInput';
import { SearchBar } from '@/components/base/inputs/SearchBar';
import { useInputStyles } from '@/components/base/inputs/useInputStyles';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';

type SearchableSelectSection = {
 title?: string;
 data: SearchableSelectOption[];
 order: number;
};

type SearchableMultiSelectInputProps = {
 options: SearchableSelectOption[];
 suggestedOptions?: SearchableSelectOption[];
 value?: string[];
 onChange: (value: string[]) => void;
 placeholder?: string;
 title?: string;
 searchPlaceholder?: string;
 accessibilityLabel?: string;
 isError?: boolean;
 isDisabled?: boolean;
 backgroundColor?: string;
 borderColor?: string;
 activeBorderColor?: string;
 errorColor?: string;
 emptyLabel?: string;
 emptySearchLabel?: string;
 suggestedTitle?: string;
 allOptionsTitle?: string;
 doneLabel?: string;
 maxPreviewItems?: number;
};

export function SearchableMultiSelectInput({
 options,
 suggestedOptions = [],
 value = [],
 onChange,
 placeholder = 'Select...',
 title,
 searchPlaceholder,
 accessibilityLabel,
 isError = false,
 isDisabled = false,
 backgroundColor,
 borderColor,
 activeBorderColor,
 errorColor,
 emptyLabel = 'No options available',
 emptySearchLabel = 'No matching options',
 suggestedTitle,
 allOptionsTitle,
 doneLabel,
 maxPreviewItems = 2,
}: SearchableMultiSelectInputProps) {
 const { t } = useTranslation();
 const [isOpen, setIsOpen] = useState(false);
 const [search, setSearch] = useState('');
 const { inputStyle } = useInputStyles({
  isError,
  isDisabled,
  isFocused: isOpen,
  backgroundColor,
  borderColor,
  activeBorderColor,
  errorColor,
 });

 const selectedOptions = useMemo(
  () => options.filter((option) => value.includes(option.value)),
  [options, value],
 );
 const filteredOptions = useMemo(() => {
  const normalizedSearch = search.trim().toLowerCase();
  if (!normalizedSearch) return options;

  return options.filter((option) => {
   const haystack = `${option.label} ${option.searchText ?? ''}`.trim().toLowerCase();
   return haystack.includes(normalizedSearch);
  });
 }, [options, search]);
 const sections = useMemo<SearchableSelectSection[]>(() => {
  const normalizedSearch = search.trim().toLowerCase();
  const hasSearch = normalizedSearch.length > 0;

  const buildGroupedSections = (items: SearchableSelectOption[]) => {
   const groups = new Map<string, SearchableSelectOption[]>();

   items.forEach((item) => {
    const groupKey = item.groupLabel?.trim() || allOptionsTitle || '';
    const existing = groups.get(groupKey) ?? [];
    existing.push(item);
    groups.set(groupKey, existing);
   });

   return Array.from(groups.entries())
    .map(([sectionTitle, data]) => ({
     title: sectionTitle || undefined,
     data,
     order: Math.min(...data.map((item) => item.groupOrder ?? Number.MAX_SAFE_INTEGER)),
    }))
    .sort((left, right) => {
     const orderDiff = left.order - right.order;
     if (orderDiff !== 0) return orderDiff;
     return (left.title ?? '').localeCompare(right.title ?? '');
    });
  };

  if (hasSearch) {
   return buildGroupedSections(filteredOptions);
  }

  const suggestedMap = new Map(
   suggestedOptions
    .filter((option) => options.some((item) => item.value === option.value))
    .map((option) => [option.value, option]),
  );

  const nextSections: SearchableSelectSection[] = [];
  if (suggestedMap.size > 0) {
   nextSections.push({
    title: suggestedTitle ?? t('common.suggestedOptions'),
    data: Array.from(suggestedMap.values()),
    order: -1,
   });
  }

  const remainingOptions = options.filter((option) => !suggestedMap.has(option.value));
  return [...nextSections, ...buildGroupedSections(remainingOptions)];
 }, [allOptionsTitle, filteredOptions, options, search, suggestedOptions, suggestedTitle, t]);

 const previewLabels = selectedOptions.slice(0, maxPreviewItems).map((option) => option.label);
 const remainingCount = selectedOptions.length - previewLabels.length;
 const triggerLabel =
  selectedOptions.length === 0
   ? placeholder
   : remainingCount > 0
     ? `${previewLabels.join(', ')} +${remainingCount}`
     : previewLabels.join(', ');

 const triggerStyle: ViewStyle = {
  ...(inputStyle as ViewStyle),
  minHeight: 54,
  borderRadius: borderRadius.lg + 2,
  paddingVertical: spacing.sm + 3,
  paddingHorizontal: spacing.sm,
  flexDirection: 'row',
  alignItems: 'center',
  gap: spacing.sm,
 };

 function handleOpen() {
  if (isDisabled) return;
  setSearch('');
  setIsOpen(true);
 }

 function handleClose() {
  setIsOpen(false);
  setSearch('');
 }

 function handleToggle(nextValue: string) {
  const current = new Set(value);
  if (current.has(nextValue)) {
   current.delete(nextValue);
  } else {
   current.add(nextValue);
  }
  onChange(Array.from(current));
 }

 function renderItem({ item }: ListRenderItemInfo<SearchableSelectOption>) {
  const isSelected = value.includes(item.value);

  return (
   <TouchableOpacity
    activeOpacity={0.85}
    onPress={() => handleToggle(item.value)}
    style={{
     paddingHorizontal: spacing.md,
     paddingVertical: spacing.md,
     borderRadius: borderRadius.md,
     backgroundColor: isSelected ? 'rgba(108,99,255,0.14)' : 'transparent',
     borderWidth: 1,
     borderColor: isSelected ? 'rgba(186,179,255,0.28)' : 'transparent',
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'space-between',
     gap: spacing.md,
    }}
   >
    <Text
     style={{
      flex: 1,
      color: isSelected ? colors.text.primary : colors.text.secondary,
      fontSize: typography.size.base,
      fontFamily: isSelected ? typography.font.semibold : typography.font.medium,
      lineHeight: typography.size.base * 1.35,
     }}
     numberOfLines={2}
    >
     {item.label}
    </Text>

    <View
     style={{
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 1,
      borderColor: isSelected ? colors.primary.DEFAULT : colors.border.DEFAULT,
      backgroundColor: isSelected ? 'rgba(108,99,255,0.18)' : 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
     }}
    >
     {isSelected ? (
      <FontAwesome5 name="check" size={11} color={colors.primary.DEFAULT} solid />
     ) : null}
    </View>
   </TouchableOpacity>
  );
 }

 function renderSectionHeader({
  section,
 }: {
  section: SectionListData<SearchableSelectOption, SearchableSelectSection>;
 }) {
  if (!section.title) return null;

  return (
   <View style={{ paddingTop: spacing.sm, paddingBottom: spacing.xs }}>
    <View
     style={{
      alignSelf: 'flex-start',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.full,
      backgroundColor: 'rgba(17,24,39,0.72)',
      borderWidth: 1,
      borderColor: 'rgba(168,85,247,0.44)',
     }}
    >
     <Text
      style={{
       color: colors.text.primary,
       fontSize: typography.size.sm,
       fontFamily: typography.font.semibold,
       textTransform: 'uppercase',
       letterSpacing: 0.8,
      }}
     >
      {section.title}
     </Text>
    </View>
   </View>
  );
 }

 return (
  <>
   <TouchableOpacity
    onPress={handleOpen}
    activeOpacity={0.82}
    accessibilityLabel={accessibilityLabel ?? title ?? placeholder}
    accessibilityRole="button"
    accessibilityState={{ disabled: isDisabled, expanded: isOpen }}
    style={triggerStyle}
   >
    <View style={{ flex: 1, minHeight: 28, justifyContent: 'center' }}>
     {selectedOptions.length > 0 ? (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs }}>
       {selectedOptions.slice(0, maxPreviewItems).map((option) => (
        <View
         key={option.value}
         style={{
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.xs,
          borderRadius: borderRadius.full,
          backgroundColor: 'rgba(108,99,255,0.16)',
          borderWidth: 1,
          borderColor: 'rgba(186,179,255,0.26)',
         }}
        >
         <Text
          style={{
           color: colors.text.primary,
           fontSize: typography.size.sm,
           fontFamily: typography.font.medium,
          }}
         >
          {option.label}
         </Text>
        </View>
       ))}
       {remainingCount > 0 ? (
        <View
         style={{
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.xs,
          borderRadius: borderRadius.full,
          backgroundColor: colors.background.elevated,
          borderWidth: 1,
          borderColor: colors.border.DEFAULT,
         }}
        >
         <Text
          style={{
           color: colors.text.secondary,
           fontSize: typography.size.sm,
           fontFamily: typography.font.medium,
          }}
         >
          +{remainingCount}
         </Text>
        </View>
       ) : null}
      </View>
     ) : (
      <Text
       style={{
        color: colors.text.disabled,
        fontSize: typography.size.base,
        fontFamily: typography.font.regular,
       }}
       numberOfLines={1}
      >
       {triggerLabel}
      </Text>
     )}
    </View>

    <View
     style={{
      width: 30,
      height: 30,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isOpen ? 'rgba(108,99,255,0.18)' : colors.background.elevated,
      borderWidth: 1,
      borderColor: isOpen ? 'rgba(186,179,255,0.34)' : colors.border.DEFAULT,
     }}
    >
     <FontAwesome5
      name="search"
      size={12}
      color={isOpen ? colors.primary.DEFAULT : colors.text.secondary}
      solid
     />
    </View>
   </TouchableOpacity>

   <Modal
    visible={isOpen}
    transparent
    animationType="slide"
    onRequestClose={handleClose}
    statusBarTranslucent
   >
    <View
     style={{
      flex: 1,
      backgroundColor: 'rgba(7,8,16,0.54)',
      justifyContent: 'flex-end',
     }}
    >
     <Pressable style={{ flex: 1 }} onPress={handleClose} />

     <View
      style={{
       backgroundColor: 'rgba(14,16,28,0.98)',
       minHeight: 420,
       maxHeight: '86%',
       borderTopLeftRadius: borderRadius.xl,
       borderTopRightRadius: borderRadius.xl,
       overflow: 'hidden',
       borderWidth: 1,
       borderColor: 'rgba(255,255,255,0.08)',
      }}
     >
      <View
       style={{
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.06)',
        backgroundColor: 'rgba(255,255,255,0.03)',
        gap: spacing.md,
       }}
      >
       <View
        style={{
         flexDirection: 'row',
         alignItems: 'center',
         justifyContent: 'space-between',
         gap: spacing.md,
        }}
       >
        <Text
         style={{
          flex: 1,
          color: colors.text.primary,
          fontSize: typography.size.lg,
          fontFamily: typography.font.bold,
         }}
         numberOfLines={1}
        >
         {title ?? accessibilityLabel ?? placeholder}
        </Text>

        <ModalCloseButton label={doneLabel ?? t('common.close')} onPress={handleClose} />
       </View>

       <SearchBar
        value={search}
        onChangeText={setSearch}
        onClear={() => setSearch('')}
        placeholder={searchPlaceholder ?? placeholder}
        accessibilityLabel={searchPlaceholder ?? placeholder}
       />
      </View>

      {sections.some((section) => section.data.length > 0) ? (
       <SectionList
        sections={sections.filter((section) => section.data.length > 0)}
        keyExtractor={(item) => item.value}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled
        contentContainerStyle={{
         paddingHorizontal: spacing.lg,
         paddingTop: spacing.md,
         paddingBottom: spacing.xl,
        }}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        SectionSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        keyboardShouldPersistTaps="handled"
       />
      ) : (
       <View
        style={{
         paddingHorizontal: spacing.xl,
         paddingVertical: spacing.xl,
         alignItems: 'center',
         justifyContent: 'center',
         gap: spacing.xs,
        }}
       >
        <Text
         style={{
          color: colors.text.primary,
          fontSize: typography.size.base,
          fontFamily: typography.font.semibold,
          textAlign: 'center',
         }}
        >
         {search.trim().length > 0 ? emptySearchLabel : emptyLabel}
        </Text>
       </View>
      )}
     </View>
    </View>
   </Modal>
  </>
 );
}
