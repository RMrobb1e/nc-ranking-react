export interface Player {
  rank: number;
  deltaRank: number;
  RegionID: number;
  RealmGroupName: string;
  RealmName: string;
  CharacterName: string;
  pcWeaponType: number;
  recordTime: string;
  GuildName: string;
  GuildUnionName: string;
  MaxRankDate: string;
  TotalCount: number;
  score: number;
  RegionName: string;
}

export interface Region {
  name: string;
  code: number;
}

export interface ApiMetadata {
  regions: Region[];
  weaponTypes: Record<string, number>;
  rankingTypes: Record<string, string>;
  lastUpdated: string;
}

export interface ApiResponse {
  items: Player[];
  totalUnique: number;
  totalFetched: number;
  regionCode: string;
  timestamp: string;
}
