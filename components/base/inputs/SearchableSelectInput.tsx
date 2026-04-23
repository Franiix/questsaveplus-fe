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
import { SearchBar } from '@/components/base/inputs/SearchBar';
import { useInputStyles } from '@/components/base/inputs/useInputStyles';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';

export type SearchableSelectOption = {
 label: string;
 value: string;
 searchText?: string;
 groupLabel?: string;
 groupOrder?: number;
};

type SearchableSelectSection = {
 title?: string;
 data: SearchableSelectOption[];
 order: number;
};

type SearchableSelectInputProps = {
 options: SearchableSelectOption[];
 suggestedOptions?: SearchableSelectOption[];
 value?: string;
 onChange: (value: string) => void;
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
 allowClear?: boolean;
 clearLabel?: string;
 emptyLabel?: string;
 emptySearchLabel?: string;
 suggestedTitle?: string;
 allOptionsTitle?: string;
};

export function SearchableSelectInput({
 options,
 suggestedOptions = [],
 value,
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
 allowClear = false,
 clearLabel = 'Clear',
 emptyLabel = 'No options available',
 emptySearchLabel = 'No matching options',
 suggestedTitle,
 allOptionsTitle,
}: SearchableSelectInputProps) {
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

 const selectedOption = options.find((option) => option.value === value);
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
    .map(([title, data]) => ({
     title: title || undefined,
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
 const triggerStyle: ViewStyle = {
  ...(inputStyle as ViewStyle),
  minHeight: 54,
  borderRadius: borderRadius.lg + 2,
  paddingVertical: spacing.sm + 3,
  paddingRight: spacing.sm,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
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

 function handleSelect(nextValue: string) {
  onChange(nextValue);
  handleClose();
 }

 function handleClear() {
  onChange('');
  handleClose();
 }

 function renderItem({ item }: ListRenderItemInfo<SearchableSelectOption>) {
  const isSelected = item.value === value;

  return (
   <TouchableOpacity
    activeOpacity={0.85}
    onPress={() => handleSelect(item.value)}
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

    {isSelected ? (
     <FontAwesome5 name="check" size={14} color={colors.primary.DEFAULT} solid />
    ) : null}
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
      shadowColor: colors.primary.DEFAULT,
      shadowOpacity: 0.12,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
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
    <View style={{ flex: 1, paddingRight: spacing.sm }}>
     <Text
      style={{
       color: selectedOption ? colors.text.primary : colors.text.disabled,
       fontSize: typography.size.base,
       fontFamily: selectedOption ? typography.font.medium : typography.font.regular,
      }}
      numberOfLines={1}
     >
      {selectedOption?.label ?? placeholder}
     </Text>
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

        <ModalCloseButton label={t('common.close')} onPress={handleClose} />
       </View>

       <SearchBar
        value={search}
        onChangeText={setSearch}
        onClear={() => setSearch('')}
        placeholder={searchPlaceholder ?? placeholder}
        accessibilityLabel={searchPlaceholder ?? placeholder}
       />
      </View>

      {allowClear && value ? (
       <View
        style={{
         paddingHorizontal: spacing.lg,
         paddingTop: spacing.md,
         paddingBottom: spacing.sm,
        }}
       >
        <TouchableOpacity
         activeOpacity={0.85}
         onPress={handleClear}
         style={{
          alignSelf: 'flex-start',
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
          {clearLabel}
         </Text>
        </TouchableOpacity>
       </View>
      ) : null}

      {sections.some((section) => section.data.length > 0) ? (
       <SectionList
        sections={sections.filter((section) => section.data.length > 0)}
        keyExtractor={(item) => item.value}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled
        contentContainerStyle={{
         paddingHorizontal: spacing.lg,
         paddingTop: allowClear && value ? spacing.xs : spacing.md,
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
