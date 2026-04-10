import type { IgdbNamedItem } from './IgdbNamedItem.model';

export type IgdbReleaseDate = {
 human?: string;
 date?: number;
 region?: number;
 platform?: IgdbNamedItem | null;
};
