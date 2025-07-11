import { Player } from "@/types/player";

const guilds = [
  "Shadow Legion",
  "Crimson Vanguard",
  "Azure Phoenix",
  "Golden Dragons",
  "Iron Wolves",
  "Storm Riders",
  "Mystic Order",
  "Dark Covenant",
  "Silver Hawks",
  "Fire Serpents",
  "Frost Giants",
  "Thunder Clan",
  "Blood Ravens",
  "Crystal Guard",
  "Void Hunters",
  "Solar Knights",
  "Lunar Eclipse",
  "Chaos Reign",
  "Divine Light",
  "Eternal Flame",
  "Ghostly Phantoms",
  "Savage Beasts",
  "Royal Crown",
  "Elite Force",
  "Noble Hearts",
];

const unions = [
  "Northern Alliance",
  "Southern Coalition",
  "Eastern Empire",
  "Western Federation",
  "Central Union",
  "Mountain Lords",
  "Forest Keepers",
  "Desert Nomads",
  "Sea Raiders",
  "Sky Guardians",
  "Underground",
  "Borderlands",
  "Highlands",
  "Lowlands",
  "Riverside",
];

const realms = [
  "Shadowmere",
  "Brightlands",
  "Dragonspire",
  "Frostholm",
  "Sunwatch",
  "Moonhaven",
  "Stormkeep",
  "Goldenvale",
  "Darkwood",
  "Silvershore",
  "Ironforge",
  "Mysticfall",
  "Flamepeak",
  "Icewind",
  "Thornwood",
];

const classes = [
  "Warrior",
  "Mage",
  "Archer",
  "Assassin",
  "Paladin",
  "Warlock",
  "Ranger",
  "Berserker",
  "Sorcerer",
  "Monk",
  "Necromancer",
  "Bard",
  "Druid",
  "Shaman",
];

const firstNames = [
  "Aiden",
  "Aria",
  "Blaze",
  "Cipher",
  "Drake",
  "Echo",
  "Frost",
  "Grimm",
  "Hunter",
  "Ivy",
  "Jax",
  "Kira",
  "Luna",
  "Magnus",
  "Nova",
  "Orion",
  "Phoenix",
  "Quinn",
  "Raven",
  "Storm",
  "Titan",
  "Vex",
  "Wolf",
  "Xander",
  "Zara",
  "Sage",
  "Blade",
  "Shadow",
  "Ember",
  "Thorn",
  "Mystic",
  "Azure",
  "Crimson",
  "Void",
  "Steel",
  "Silver",
  "Golden",
  "Dark",
  "Light",
  "Fire",
];

const lastNames = [
  "Shadowbane",
  "Stormwright",
  "Ironheart",
  "Goldleaf",
  "Nightfall",
  "Moonbeam",
  "Fireforge",
  "Frostborn",
  "Windwalker",
  "Earthshaker",
  "Voidcaller",
  "Lightbringer",
  "Darkslayer",
  "Bloodmoon",
  "Starweaver",
  "Thornwick",
  "Ravencrest",
  "Dragonbane",
  "Wolfhunter",
  "Swiftstrike",
  "Grimward",
  "Brightblade",
  "Shadowmend",
  "Flameheart",
  "Icevein",
  "Stormcrow",
  "Goldmane",
  "Silverbolt",
  "Darkthorn",
  "Lightward",
  "Emberfall",
  "Frostguard",
  "Windbreaker",
  "Earthbound",
];

function getRandomName(): string {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName}${lastName}`;
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomLevel(): number {
  // Weighted towards higher levels for top players
  const weights = [0.1, 0.2, 0.3, 0.4]; // 10% level 90-99, 20% level 80-89, etc.
  const ranges = [
    [90, 99],
    [80, 89],
    [70, 79],
    [60, 69],
  ];

  const random = Math.random();
  let cumulative = 0;

  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (random <= cumulative) {
      const [min, max] = ranges[i];
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }

  return Math.floor(Math.random() * 40) + 20; // Fallback: level 20-59
}

function generatePowerScore(level: number): number {
  const baseScore = level * 1000;
  const variance = baseScore * 0.3;
  return Math.floor(baseScore + (Math.random() - 0.5) * variance);
}

function generateGrowthRate(): number {
  // Most players have moderate growth, few have exceptional growth
  const random = Math.random();
  if (random < 0.05) return Math.floor(Math.random() * 10) + 20; // 5% have 20-30%
  if (random < 0.15) return Math.floor(Math.random() * 5) + 15; // 10% have 15-20%
  if (random < 0.35) return Math.floor(Math.random() * 5) + 10; // 20% have 10-15%
  return Math.floor(Math.random() * 10) + 1; // 65% have 1-10%
}

export function generateMockPlayers(count: number): Player[] {
  const players: Player[] = [];

  for (let i = 0; i < count; i++) {
    const level = generateRandomLevel();
    const powerScore = generatePowerScore(level);

    const player: Player = {
      rank: i + 1,
      CharacterName: getRandomName(),
      score: generateGrowthRate(),
      GuildName: getRandomElement(guilds),
      GuildUnionName: getRandomElement(unions),
      RealmGroupName: getRandomElement(realms),
      pcWeaponType: Number(getRandomElement(classes)),
      RegionID: Math.floor(Math.random() * 10) + 1, // Random region ID between 1 and 10
      RegionName: "North America", // Default region name
      RealmName: getRandomElement(realms),
      recordTime: new Date().toISOString(),
      MaxRankDate: new Date().toISOString(),
      TotalCount: 1000, // Placeholder for total count
      deltaRank: 0, // Placeholder for rank change
    };

    players.push(player);
  }

  // Sort by power score to ensure proper ranking
  players.sort((a, b) => b.score - a.score);

  // Update ranks after sorting
  players.forEach((player, index) => {
    player.rank = index + 1;
  });

  return players;
}
