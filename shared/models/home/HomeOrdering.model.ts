import type { BacklogSortEnum } from '@/shared/enums/BacklogSort.enum';

export type HomeOrdering =
 | BacklogSortEnum.NEWEST
 | BacklogSortEnum.OLDEST
 | BacklogSortEnum.TITLE_ASC
 | BacklogSortEnum.TITLE_DESC
 | BacklogSortEnum.RATING_DESC;
