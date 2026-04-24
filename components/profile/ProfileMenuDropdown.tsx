import { FontAwesome5 } from '@expo/vector-icons';
import { type ComponentProps, Fragment, memo, useMemo } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { Avatar } from '@/components/base/display/Avatar';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';

const MENU_WIDTH = 286;

export type MenuAction = {
 icon: ComponentProps<typeof FontAwesome5>['name'];
 label: string;
 onPress: () => void;
 isDestructive?: boolean;
};

type ProfileMenuDropdownProps = {
 animation: Animated.Value;
 isOpen: boolean;
 displayName: string;
 usernameLabel: string;
 avatarUri?: string;
 menuActions: MenuAction[];
 onActionPress: (action: MenuAction) => void;
};

function RowSeparator() {
 return (
  <View
   style={{
    height: 1,
    marginHorizontal: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.05)',
   }}
  />
 );
}

const MenuRow = memo(function MenuRow({ icon, label, onPress, isDestructive = false }: MenuAction) {
 return (
  <Pressable
   onPress={onPress}
   style={({ pressed }) => ({
    minHeight: 52,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: pressed ? 'rgba(255,255,255,0.06)' : 'transparent',
   })}
  >
   <View
    style={{
     flexDirection: 'row',
     alignItems: 'center',
     gap: spacing.md,
     minHeight: 34,
    }}
   >
    <View
     style={{
      width: 30,
      height: 30,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDestructive ? 'rgba(248,113,113,0.12)' : 'rgba(108,99,255,0.14)',
     }}
    >
     <FontAwesome5
      name={icon}
      size={13}
      color={isDestructive ? colors.error : colors.primary['200']}
      solid
     />
    </View>
    <Text
     numberOfLines={1}
     style={{
      flex: 1,
      color: isDestructive ? colors.error : colors.text.primary,
      fontSize: typography.size.md,
      fontFamily: typography.font.semibold,
      lineHeight: Math.ceil(typography.size.md * typography.lineHeight.snug),
     }}
    >
     {label}
    </Text>
   </View>
  </Pressable>
 );
});

export const ProfileMenuDropdown = memo(function ProfileMenuDropdown({
 animation,
 isOpen,
 displayName,
 usernameLabel,
 avatarUri,
 menuActions,
 onActionPress,
}: ProfileMenuDropdownProps) {
 const normalActions = useMemo(() => menuActions.filter((a) => !a.isDestructive), [menuActions]);
 const destructiveActions = useMemo(
  () => menuActions.filter((a) => a.isDestructive),
  [menuActions],
 );

 return (
  <View
   pointerEvents={isOpen ? 'auto' : 'none'}
   style={{
    width: MENU_WIDTH,
    marginTop: spacing.sm,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(10, 11, 20, 0.97)',
    shadowColor: colors.background.overlay,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.35,
    shadowRadius: 32,
    elevation: 20,
    overflow: 'hidden',
   }}
  >
   <Animated.View
    style={
     {
      opacity: animation,
      transform: [
       {
        translateY: animation.interpolate({
         inputRange: [0, 1],
         outputRange: [-12, 0],
        }),
       },
       {
        scale: animation.interpolate({
         inputRange: [0, 1],
         outputRange: [0.95, 1],
        }),
       },
      ],
     } as never
    }
   >
    {/* User info header */}
    <View
     style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingHorizontal: spacing.md,
      paddingTop: spacing.md,
      paddingBottom: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.06)',
      backgroundColor: 'rgba(255,255,255,0.02)',
     }}
    >
     <Avatar uri={avatarUri} name={displayName} size={46} />
     <View style={{ flex: 1, gap: 2 }}>
      <Text
       numberOfLines={1}
       style={{
        color: colors.text.primary,
        fontSize: typography.size.lg,
        fontFamily: typography.font.bold,
       }}
      >
       {displayName}
      </Text>
      <Text
       numberOfLines={1}
       style={{
        color: colors.text.secondary,
        fontSize: typography.size.sm,
        fontFamily: typography.font.mono,
       }}
      >
       {usernameLabel}
      </Text>
     </View>
    </View>

    {/* Navigation actions */}
    <View
     style={{
      paddingHorizontal: spacing.sm,
      paddingTop: spacing.sm,
      paddingBottom: destructiveActions.length > 0 ? spacing.xs : spacing.sm,
     }}
    >
     {normalActions.map((action, index) => (
      <Fragment key={action.label}>
       <MenuRow {...action} onPress={() => onActionPress(action)} />
       {index < normalActions.length - 1 ? <RowSeparator /> : null}
      </Fragment>
     ))}
    </View>

    {/* Destructive actions — separated by a tinted divider */}
    {destructiveActions.length > 0 ? (
     <>
      <View
       style={{
        height: 1,
        marginHorizontal: spacing.md,
        backgroundColor: 'rgba(248,113,113,0.1)',
       }}
      />
      <View
       style={{
        paddingHorizontal: spacing.sm,
        paddingTop: spacing.xs,
        paddingBottom: spacing.sm,
       }}
      >
       {destructiveActions.map((action, index) => (
        <Fragment key={action.label}>
         <MenuRow {...action} onPress={() => onActionPress(action)} />
         {index < destructiveActions.length - 1 ? <RowSeparator /> : null}
        </Fragment>
       ))}
      </View>
     </>
    ) : null}
   </Animated.View>
  </View>
 );
});
