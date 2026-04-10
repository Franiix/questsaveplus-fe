import { FontAwesome5 } from '@expo/vector-icons';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Platform, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { ModalCloseButton } from '@/components/base/feedback/ModalCloseButton';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';
import { useInputStyles } from './useInputStyles';

type DatePickerMode = 'date' | 'time' | 'datetime';

type DatePickerInputProps = {
 value?: Date;
 onChange: (date: Date) => void;
 mode?: DatePickerMode;
 placeholder?: string;
 minimumDate?: Date;
 maximumDate?: Date;
 isError?: boolean;
 isDisabled?: boolean;
 accessibilityLabel?: string;
 backgroundColor?: string;
 borderColor?: string;
 activeBorderColor?: string;
 errorColor?: string;
};

function resolveDatePickerLocale(language: string | undefined): string {
 if (!language) return 'en-US';
 if (language.startsWith('it')) return 'it-IT';
 if (language.startsWith('en')) return 'en-US';
 return language;
}

function formatDate(date: Date, mode: DatePickerMode, locale: string): string {
 if (mode === 'time') {
  return date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
 }
 if (mode === 'date') {
  return date.toLocaleDateString(locale);
 }
 return `${date.toLocaleDateString(locale)} ${date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}`;
}

/**
 * Atom: selettore data/ora stilato con design token QuestSave+.
 *
 * Trigger button identico a SelectInput.
 * iOS: mostra spinner in modal con bottone "Conferma".
 * Android: apre il picker nativo di sistema.
 */
export function DatePickerInput({
 value,
 onChange,
 mode = 'date',
 placeholder = 'Seleziona data...',
 minimumDate,
 maximumDate,
 isError = false,
 isDisabled = false,
 accessibilityLabel,
 backgroundColor,
 borderColor,
 activeBorderColor,
 errorColor,
}: DatePickerInputProps) {
 const { t, i18n } = useTranslation();
 const [isOpen, setIsOpen] = useState(false);
 // Tiene la data temporanea su iOS fino alla conferma
 const [tempDate, setTempDate] = useState<Date>(value ?? new Date());
 const pickerLocale = resolveDatePickerLocale(i18n.resolvedLanguage ?? i18n.language);

 const { inputStyle } = useInputStyles({
  isError,
  isDisabled,
  isFocused: isOpen,
  backgroundColor,
  borderColor,
  activeBorderColor,
  errorColor,
 });

 function handleOpen() {
  if (!isDisabled) {
   setTempDate(value ?? new Date());
   setIsOpen(true);
  }
 }

 function handleChange(_event: DateTimePickerEvent, selectedDate?: Date) {
  if (Platform.OS === 'android') {
   setIsOpen(false);
   if (_event.type === 'set' && selectedDate) {
    onChange(selectedDate);
   }
  } else {
   // iOS: aggiorna solo la data temporanea
   if (selectedDate) setTempDate(selectedDate);
  }
 }

 function handleConfirm() {
  onChange(tempDate);
  setIsOpen(false);
 }

 const displayLabel = value ? formatDate(value, mode, pickerLocale) : null;

 return (
  <>
   <TouchableOpacity
    onPress={handleOpen}
    activeOpacity={0.75}
    accessibilityLabel={accessibilityLabel}
    accessibilityRole="button"
    accessibilityState={{ disabled: isDisabled }}
    style={[
     inputStyle,
     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    ]}
   >
    <Text
     style={{
      color: displayLabel ? colors.text.primary : colors.text.disabled,
      fontSize: typography.size.md,
      flex: 1,
     }}
     numberOfLines={1}
    >
     {displayLabel ?? placeholder}
    </Text>
    <FontAwesome5
     name={mode === 'time' ? 'clock' : 'calendar-alt'}
     size={16}
     color={colors.text.secondary}
    />
   </TouchableOpacity>

   {/* Android: picker nativo diretto */}
   {Platform.OS === 'android' && isOpen ? (
   <DateTimePicker
     value={value ?? new Date()}
     mode={mode === 'datetime' ? 'date' : mode}
     locale={pickerLocale}
     minimumDate={minimumDate}
     maximumDate={maximumDate}
     onChange={handleChange}
    />
   ) : null}

   {/* iOS: picker in modal con bottone Conferma */}
   {Platform.OS === 'ios' ? (
    <Modal
     visible={isOpen}
     transparent
     animationType="slide"
     onRequestClose={() => setIsOpen(false)}
     statusBarTranslucent
    >
     <Pressable
      style={{
       flex: 1,
       backgroundColor: 'rgba(0,0,0,0.6)',
       justifyContent: 'flex-end',
      }}
      onPress={() => setIsOpen(false)}
     >
      <Pressable
       style={{
        backgroundColor: colors.background.surface,
        borderTopLeftRadius: borderRadius.lg,
        borderTopRightRadius: borderRadius.lg,
        paddingBottom: spacing.xl,
       }}
       onPress={() => {}}
      >
       {/* Header modal */}
       <View
        style={{
         flexDirection: 'row',
         alignItems: 'center',
         justifyContent: 'space-between',
         paddingHorizontal: spacing.md,
         paddingVertical: spacing.sm,
         borderBottomWidth: 1,
         borderBottomColor: colors.border.DEFAULT,
        }}
       >
        <ModalCloseButton label={t('common.close')} onPress={() => setIsOpen(false)} />

        <Text
         style={{
          color: colors.text.secondary,
          fontSize: typography.size.sm,
          fontWeight: typography.weight.medium as '500',
         }}
        >
         {accessibilityLabel ?? placeholder}
        </Text>

        <ModalCloseButton
         label={t('common.confirm')}
         onPress={handleConfirm}
         iconName="check"
        />
       </View>

       <DateTimePicker
        value={tempDate}
        mode={mode === 'datetime' ? 'date' : mode}
        display="spinner"
        locale={pickerLocale}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        onChange={handleChange}
        style={{ backgroundColor: colors.background.surface }}
       />
      </Pressable>
     </Pressable>
    </Modal>
   ) : null}
  </>
 );
}
