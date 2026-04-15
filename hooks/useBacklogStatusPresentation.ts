import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BacklogStatusEnum } from '@/shared/enums/BacklogStatus.enum';
import { colors } from '@/shared/theme/tokens';
import type { FontAwesome5 } from '@expo/vector-icons';

export function useBacklogStatusPresentation() {
 const { t } = useTranslation();

 return useMemo(() => {
  const labelMap: Record<BacklogStatusEnum, string> = {
   [BacklogStatusEnum.WISHLIST]: t('backlog.status.WISHLIST'),
   [BacklogStatusEnum.WANT_TO_PLAY]: t('backlog.status.WANT_TO_PLAY'),
   [BacklogStatusEnum.PLAYING]: t('backlog.status.PLAYING'),
   [BacklogStatusEnum.ONGOING]: t('backlog.status.ONGOING'),
   [BacklogStatusEnum.COMPLETED]: t('backlog.status.COMPLETED'),
   [BacklogStatusEnum.ABANDONED]: t('backlog.status.ABANDONED'),
  };

  const colorMap: Record<BacklogStatusEnum, string> = {
   [BacklogStatusEnum.WISHLIST]: colors.status.wishlist,
   [BacklogStatusEnum.WANT_TO_PLAY]: colors.status.want_to_play,
   [BacklogStatusEnum.PLAYING]: colors.status.playing,
   [BacklogStatusEnum.ONGOING]: colors.status.ongoing,
   [BacklogStatusEnum.COMPLETED]: colors.status.completed,
   [BacklogStatusEnum.ABANDONED]: colors.status.abandoned,
  };

  const iconMap: Record<BacklogStatusEnum, React.ComponentProps<typeof FontAwesome5>['name']> = {
   [BacklogStatusEnum.WISHLIST]: 'shopping-bag',
   [BacklogStatusEnum.WANT_TO_PLAY]: 'bookmark',
   [BacklogStatusEnum.PLAYING]: 'play',
   [BacklogStatusEnum.ONGOING]: 'sync-alt',
   [BacklogStatusEnum.COMPLETED]: 'trophy',
   [BacklogStatusEnum.ABANDONED]: 'ban',
  };

  const statusOptions = [
   { label: labelMap[BacklogStatusEnum.WISHLIST], value: BacklogStatusEnum.WISHLIST },
   { label: labelMap[BacklogStatusEnum.WANT_TO_PLAY], value: BacklogStatusEnum.WANT_TO_PLAY },
   { label: labelMap[BacklogStatusEnum.PLAYING], value: BacklogStatusEnum.PLAYING },
   { label: labelMap[BacklogStatusEnum.ONGOING], value: BacklogStatusEnum.ONGOING },
   { label: labelMap[BacklogStatusEnum.COMPLETED], value: BacklogStatusEnum.COMPLETED },
   { label: labelMap[BacklogStatusEnum.ABANDONED], value: BacklogStatusEnum.ABANDONED },
  ] as const;

  return {
   labelMap,
   colorMap,
   iconMap,
   statusOptions,
  } as const;
 }, [t]);
}
