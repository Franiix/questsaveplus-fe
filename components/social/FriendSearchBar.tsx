import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { Avatar } from '@/components/base/display/Avatar';
import { SearchBar } from '@/components/base/inputs/SearchBar';
import { useSingleAction } from '@/hooks/useSingleAction';
import type { SearchResultModel } from '@/shared/models/Social.model';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';
import { Pressable } from 'react-native';

type Props = {
 results: SearchResultModel[];
 isSearching: boolean;
 onSearch: (query: string) => void;
 onSendRequest: (userId: string) => void;
 onAcceptRequest: (friendshipId: string) => void;
 onRevokeRequest: (friendshipId: string) => void;
};

function SearchResultRow({
 result,
 onSendRequest,
 onAcceptRequest,
 onRevokeRequest,
}: {
 result: SearchResultModel;
 onSendRequest: (userId: string) => void;
 onAcceptRequest: (friendshipId: string) => void;
 onRevokeRequest: (friendshipId: string) => void;
}) {
 const { t } = useTranslation();
 const { isLocked: isSendLocked, run: runSend } = useSingleAction(
  () => onSendRequest(result.id),
  { cooldownMs: 1500 },
 );
 const { run: runAccept } = useSingleAction(
  () => onAcceptRequest(result.friendshipId!),
  { cooldownMs: 1500 },
 );
 const { isLocked: isRevokeLocked, run: runRevoke } = useSingleAction(
  () => onRevokeRequest(result.friendshipId!),
  { cooldownMs: 1500 },
 );

 const isPendingIncoming = result.friendshipStatus === 'pending_incoming';
 const isPendingOutgoing = result.friendshipStatus === 'pending_outgoing';
 const isFriend = result.friendshipStatus === 'friend';
 const isNone = result.friendshipStatus === 'none';

 const isActionable = isNone || isPendingIncoming || isPendingOutgoing;

 const buttonLabel = isPendingIncoming
  ? t('social.accept')
  : isPendingOutgoing
   ? t('social.revokeRequest')
   : isFriend
    ? t('social.alreadyFriend')
    : t('social.addFriend');

 const buttonColor = isPendingIncoming
  ? colors.success
  : isPendingOutgoing
   ? colors.error
   : isNone
    ? colors.primary.DEFAULT
    : colors.text.disabled;

 const isLocked = (isNone && isSendLocked) || (isPendingOutgoing && isRevokeLocked);

 const handlePress = () => {
  if (isPendingIncoming) runAccept();
  else if (isPendingOutgoing) runRevoke();
  else if (isNone) runSend();
 };

 return (
  <View
   style={{
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.sm,
   }}
  >
   <Avatar uri={result.avatar_url ?? undefined} name={result.full_name} size={38} />

   <View style={{ flex: 1 }}>
    <Text
     style={{
      color: colors.text.primary,
      fontSize: typography.size.md,
      fontFamily: typography.font.medium,
     }}
     numberOfLines={1}
    >
     {result.username}
    </Text>
   </View>

   <Pressable
    onPress={handlePress}
    disabled={!isActionable || isLocked || isFriend}
    style={({ pressed }) => ({
     paddingHorizontal: spacing.sm,
     paddingVertical: 6,
     borderRadius: borderRadius.full,
     borderWidth: 1,
     borderColor: isActionable ? buttonColor : colors.border.DEFAULT,
     backgroundColor: pressed && isActionable ? `${buttonColor}22` : 'transparent',
     opacity: !isActionable || isLocked ? 0.55 : 1,
    })}
   >
    <Text
     style={{
      color: isActionable ? buttonColor : colors.text.disabled,
      fontSize: typography.size.xs,
      fontFamily: typography.font.semibold,
     }}
    >
     {buttonLabel}
    </Text>
   </Pressable>
  </View>
 );
}

export function FriendSearchBar({
 results,
 isSearching,
 onSearch,
 onSendRequest,
 onAcceptRequest,
 onRevokeRequest,
}: Props) {
 const { t } = useTranslation();
 const [query, setQuery] = useState('');
 const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

 useEffect(() => {
  if (debounceRef.current) clearTimeout(debounceRef.current);
  debounceRef.current = setTimeout(() => {
   onSearch(query);
  }, 350);
  return () => {
   if (debounceRef.current) clearTimeout(debounceRef.current);
  };
 }, [query, onSearch]);

 const showResults = query.trim().length >= 2;

 return (
  <View style={{ gap: spacing.sm }}>
   <SearchBar
    value={query}
    onChangeText={setQuery}
    onClear={() => setQuery('')}
    placeholder={t('social.searchPlaceholder')}
    isLoading={isSearching}
   />

   {showResults ? (
    <View
     style={{
      backgroundColor: colors.background.surface,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: colors.border.DEFAULT,
      overflow: 'hidden',
     }}
    >
     {results.length === 0 && !isSearching ? (
      <View style={{ padding: spacing.md, alignItems: 'center' }}>
       <Text style={{ color: colors.text.secondary, fontSize: typography.size.sm }}>
        {t('social.searchEmpty')}
       </Text>
      </View>
     ) : (
      results.map((result, index) => (
       <View key={result.id}>
        {index > 0 ? (
         <View
          style={{
           height: 1,
           backgroundColor: colors.border.subtle,
           marginHorizontal: spacing.sm,
          }}
         />
        ) : null}
        <SearchResultRow
         result={result}
         onSendRequest={onSendRequest}
         onAcceptRequest={onAcceptRequest}
         onRevokeRequest={onRevokeRequest}
        />
       </View>
      ))
     )}
    </View>
   ) : null}
  </View>
 );
}
