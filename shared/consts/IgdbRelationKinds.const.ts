export const IGDB_RELATION_KINDS = {
 DlcAddon: 'dlc_addon',
 Expansion: 'expansion',
 StandaloneExpansion: 'standalone_expansion',
 Bundle: 'bundle',
 ExpandedGame: 'expanded_game',
 Remake: 'remake',
 Remaster: 'remaster',
 Port: 'port',
 Fork: 'fork',
} as const;

export type IgdbRelationKind = (typeof IGDB_RELATION_KINDS)[keyof typeof IGDB_RELATION_KINDS];
