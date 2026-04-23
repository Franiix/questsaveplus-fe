import { FontAwesome5 } from '@expo/vector-icons';
import { FlatList, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ModalCloseButton } from '@/components/base/feedback/ModalCloseButton';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';

export type PickerOption = {
 label: string;
 value: string;
};

type PickerModalProps = {
 isVisible: boolean;
 onClose: () => void;
 title: string;
 options: PickerOption[];
 value?: string;
 onChange: (value: string) => void;
};

export function PickerModal({ isVisible, onClose, title, options, value, onChange }: PickerModalProps) {
 const { t } = useTranslation();

 function handleSelect(nextValue: string) {
  onChange(nextValue);
  onClose();
 }

 return (
  <Modal
   visible={isVisible}
   transparent
   animationType="slide"
   onRequestClose={onClose}
   statusBarTranslucent
  >
   <View style={{ flex: 1, backgroundColor: 'rgba(7,8,16,0.54)', justifyContent: 'flex-end' }}>
    <Pressable style={{ flex: 1 }} onPress={onClose} />
    <View
     style={{
      backgroundColor: 'rgba(14,16,28,0.98)',
      maxHeight: '70%',
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
       {title}
      </Text>
      <ModalCloseButton label={t('common.close')} onPress={onClose} />
     </View>

     <FlatList
      data={options}
      keyExtractor={(item) => item.value}
      contentContainerStyle={{
       paddingHorizontal: spacing.lg,
       paddingTop: spacing.md,
       paddingBottom: spacing.xl,
       gap: spacing.xs,
      }}
      renderItem={({ item }) => {
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
          }}
          numberOfLines={1}
         >
          {item.label}
         </Text>
         {isSelected ? (
          <FontAwesome5 name="check" size={14} color={colors.primary.DEFAULT} solid />
         ) : null}
        </TouchableOpacity>
       );
      }}
     />
    </View>
   </View>
  </Modal>
 );
}
