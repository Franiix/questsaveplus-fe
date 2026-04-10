export type LinkCategory = 'official' | 'store' | 'community' | 'video' | 'social';

export type GameCatalogLinkItem = {
 title: string;
 subtitle: string;
 url: string;
 sourceKey?: string | null;
 category?: LinkCategory | null;
};
