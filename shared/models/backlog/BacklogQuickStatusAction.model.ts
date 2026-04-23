import type { BacklogStatusEnum } from '@/shared/enums/BacklogStatus.enum';

export type BacklogQuickStatusAction = {
 status: BacklogStatusEnum;
 isPrimary?: boolean;
};
