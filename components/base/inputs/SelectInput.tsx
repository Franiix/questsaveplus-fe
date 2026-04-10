import { FontAwesome5 } from '@expo/vector-icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
 FlatList,
 Modal,
 Pressable,
 Text,
 TouchableOpacity,
 View,
 useWindowDimensions,
} from 'react-native';
import type { ListRenderItemInfo } from 'react-native';
import { ModalCloseButton } from '@/components/base/feedback/ModalCloseButton';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';
import { useInputStyles } from './useInputStyles';

export type SelectOption = { label: string; value: string };

type SelectInputProps = {
 options: SelectOption[];
 value?: string;
 onChange: (value: string) => void;
 placeholder?: string;
 isError?: boolean;
 isDisabled?: boolean;
 accessibilityLabel?: string;
 backgroundColor?: string;
 borderColor?: string;
 activeBorderColor?: string;
 errorColor?: string;
 allowClear?: boolean;
 clearLabel?: string;
};

const ROW_HEIGHT = 52;
const VISIBLE_ROWS = 5;
const PICKER_HEIGHT = ROW_HEIGHT * VISIBLE_ROWS;
const CENTER_INDEX_OFFSET = Math.floor(VISIBLE_ROWS / 2);

type PickerOption = SelectOption & {
 isClear?: boolean;
};

export function SelectInput({
 options,
 value,
 onChange,
 placeholder = 'Seleziona...',
 isError = false,
 isDisabled = false,
 accessibilityLabel,
 backgroundColor,
 borderColor,
 activeBorderColor,
 errorColor,
 allowClear = false,
 clearLabel,
}: SelectInputProps) {
 const { t } = useTranslation();
 const { height: screenHeight } = useWindowDimensions();
 const listRef = useRef<FlatList<PickerOption>>(null);
 const [isOpen, setIsOpen] = useState(false);
 const [draftValue, setDraftValue] = useState<string | undefined>(value);

 const { inputStyle } = useInputStyles({
  isError,
  isDisabled,
  isFocused: isOpen,
  backgroundColor,
  borderColor,
  activeBorderColor,
  errorColor,
 });

 const resolvedClearLabel = clearLabel ?? t('common.none');
 const modalOptions = useMemo<PickerOption[]>(
  () =>
   allowClear
    ? [{ label: resolvedClearLabel, value: '__clear__', isClear: true }, ...options]
    : options,
  [allowClear, options, resolvedClearLabel],
 );

 const selectedLabel = options.find((option) => option.value === value)?.label;
 const effectiveDraftValue = draftValue ?? (allowClear ? '__clear__' : modalOptions[0]?.value);
 const selectedIndex = Math.max(
  0,
  modalOptions.findIndex((option) => option.value === effectiveDraftValue),
 );

 useEffect(() => {
  if (!isOpen) {
   return;
  }

  setDraftValue(value ?? (allowClear ? '__clear__' : modalOptions[0]?.value));
 }, [allowClear, isOpen, modalOptions, value]);

 useEffect(() => {
  if (!isOpen) {
   return;
  }

  const timeout = setTimeout(() => {
   listRef.current?.scrollToOffset({
    offset: selectedIndex * ROW_HEIGHT,
    animated: false,
   });
  }, 10);

  return () => clearTimeout(timeout);
 }, [isOpen, selectedIndex]);

 function handleOpen() {
  if (isDisabled) return;
  setIsOpen(true);
 }

 function handleClose() {
  setIsOpen(false);
  setDraftValue(value);
 }

 function commitValue() {
  onChange(draftValue === '__clear__' ? '' : (draftValue ?? ''));
  setIsOpen(false);
 }

 function updateDraftFromOffset(offsetY: number) {
  const rawIndex = Math.round(offsetY / ROW_HEIGHT);
  const clampedIndex = Math.max(0, Math.min(rawIndex, modalOptions.length - 1));
  const nextValue = modalOptions[clampedIndex]?.value;
  if (nextValue) {
   setDraftValue(nextValue);
  }
 }

 function scrollToIndex(index: number) {
  listRef.current?.scrollToOffset({
   offset: index * ROW_HEIGHT,
   animated: true,
  });
  const nextValue = modalOptions[index]?.value;
  if (nextValue) {
   setDraftValue(nextValue);
  }
 }

  function renderItem({ item, index }: ListRenderItemInfo<PickerOption>) {
   const distance = Math.abs(index - selectedIndex);
   const isSelected = item.value === effectiveDraftValue;
  const textColor = isSelected
   ? colors.text.primary
   : distance === 1
    ? colors.text.secondary
    : colors.text.tertiary;
  const fontSize = isSelected ? 18 : distance === 1 ? 16 : 15;

  return (
    <Pressable
     onPress={() => scrollToIndex(index)}
     accessibilityRole="button"
     accessibilityState={{ selected: isSelected }}
    style={{
     height: ROW_HEIGHT,
     alignItems: 'center',
     justifyContent: 'center',
    }}
   >
    <Text
     style={{
      color: item.isClear && !isSelected ? '#8F96A3' : textColor,
      fontSize,
      fontFamily: isSelected ? typography.font.medium : typography.font.regular,
      letterSpacing: typography.letterSpacing.normal,
     }}
     numberOfLines={1}
    >
     {item.label}
    </Text>
   </Pressable>
  );
 }

 return (
  <>
   <TouchableOpacity
    onPress={handleOpen}
    activeOpacity={0.82}
    accessibilityLabel={accessibilityLabel}
    accessibilityRole="combobox"
    accessibilityState={{ disabled: isDisabled, expanded: isOpen }}
    style={[
     inputStyle,
     {
      minHeight: 54,
      borderRadius: borderRadius.lg + 2,
      paddingVertical: spacing.sm + 3,
      paddingRight: spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
     },
    ]}
   >
    <View style={{ flex: 1, paddingRight: spacing.sm }}>
     <Text
      style={{
       color: selectedLabel ? colors.text.primary : colors.text.disabled,
       fontSize: typography.size.base,
       fontFamily: selectedLabel ? typography.font.medium : typography.font.regular,
      }}
      numberOfLines={1}
     >
      {selectedLabel ?? placeholder}
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
      name="chevron-down"
      size={12}
      color={isOpen ? colors.primary.DEFAULT : colors.text.secondary}
      solid
     />
    </View>
   </TouchableOpacity>

   <Modal
    visible={isOpen}
    transparent
    animationType="fade"
    onRequestClose={handleClose}
    statusBarTranslucent
   >
    <View
     style={{
      flex: 1,
      backgroundColor: 'rgba(7,8,16,0.48)',
      justifyContent: 'flex-end',
     }}
    >
     <Pressable style={{ flex: 1 }} onPress={handleClose} />

     <View
      style={{
       backgroundColor: 'rgba(14,16,28,0.98)',
       minHeight: Math.min(420, screenHeight * 0.48),
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
        paddingVertical: spacing.md,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.06)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.md,
       }}
      >
       <View style={{ flex: 1, paddingRight: spacing.md }}>
        <Text
         style={{
          color: colors.text.primary,
          fontSize: typography.size.lg,
          fontFamily: typography.font.bold,
         }}
         numberOfLines={1}
        >
         {accessibilityLabel ?? placeholder}
        </Text>
       </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
         <ModalCloseButton label={t('common.close')} onPress={handleClose} />
         <ModalCloseButton
          label={t('common.confirm')}
          onPress={commitValue}
          iconName="check"
         />
        </View>
      </View>

      <View
       style={{
        height: PICKER_HEIGHT,
        justifyContent: 'center',
        backgroundColor: 'transparent',
      }}
      >
       <View
        pointerEvents="none"
        style={{
         position: 'absolute',
         left: 0,
         right: 0,
         top: ROW_HEIGHT * CENTER_INDEX_OFFSET,
         height: ROW_HEIGHT,
         borderTopWidth: 1,
         borderBottomWidth: 1,
         borderColor: 'rgba(255,255,255,0.08)',
         backgroundColor: 'rgba(108,99,255,0.12)',
        }}
       />

       <FlatList
        ref={listRef}
        data={modalOptions}
        keyExtractor={(item) => item.value}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        bounces={false}
        snapToInterval={ROW_HEIGHT}
        decelerationRate="fast"
        getItemLayout={(_, index) => ({
         length: ROW_HEIGHT,
         offset: ROW_HEIGHT * index,
         index,
        })}
        contentContainerStyle={{
         paddingVertical: ROW_HEIGHT * CENTER_INDEX_OFFSET,
        }}
        onMomentumScrollEnd={(event) =>
         updateDraftFromOffset(event.nativeEvent.contentOffset.y)
        }
        onScrollEndDrag={(event) =>
         updateDraftFromOffset(event.nativeEvent.contentOffset.y)
        }
      />
      </View>
     </View>
    </View>
   </Modal>
  </>
 );
}
