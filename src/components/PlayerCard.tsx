import { weaponIcons, weaponTypeMap } from "@/lib/const";
import { Player } from "@/types/player";
import {
  BicepsFlexed,
  Crown,
  Gamepad,
  Globe,
  Trophy,
  Users,
} from "lucide-react";
import React from "react";
import top_1 from "@/assets/top-1.png";
import top_2 from "@/assets/top-2.png";
import top_3 from "@/assets/top-3.png";
import top_4 from "@/assets/top-4.png";
import top_5 from "@/assets/top-5.png";

const topImages = {
  1: top_1,
  2: top_2,
  3: top_3,
  4: top_4,
  5: top_5,
} as const;

interface PlayerCardProps {
  player: Player;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-yellow-400";
    if (rank === 2) return "text-gray-300";
    if (rank === 3) return "text-orange-600";
    if (rank <= 10) return "text-purple-400";
    if (rank <= 100) return "text-blue-400";
    return "text-gray-400";
  };

  const getGrowthRateColor = (rate: number) => {
    if (rate >= 15) return "text-green-400";
    if (rate >= 10) return "text-yellow-400";
    if (rate >= 5) return "text-orange-400";
    return "text-red-400";
  };

  return (
    <div className="bg-gradient-to-br from-slate-700/30 to-purple-700/30 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 hover:border-purple-400/50 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {player.rank <= 5 && (
              <img
                src={topImages[player.rank as keyof typeof topImages]}
                className={`w-8 h-8 ${getRankColor(player.rank)}`}
              />
            )}
            <span className={`text-xl font-bold ${getRankColor(player.rank)}`}>
              #{player.rank}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              {player.CharacterName}
            </h3>
            <div className="flex gap-1 items-center">
              {weaponIcons[player.pcWeaponType] ? (
                React.createElement(weaponIcons[player.pcWeaponType], {
                  className: "w-4 h-4 text-gray-400",
                })
              ) : (
                <Gamepad className="w-4 h-4 text-gray-400" />
              )}
              <p className="text-sm text-gray-400">
                {weaponTypeMap[player.pcWeaponType] || "Unknown"}
              </p>
            </div>
          </div>
        </div>
        {/* <div className="flex items-center gap-2">
          <span className={`font-semibold ${getGrowthRateColor(player.score)}`}>
            +{player.score}%
          </span>
          <TrendingUp
            className={`w-4 h-4 ${getGrowthRateColor(player.score)}`}
          />
        </div> */}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <BicepsFlexed className="w-4 h-4 text-red-400" />
          <div>
            <p className="text-xs text-gray-400">Growth Rate</p>
            <p
              className={`text-white font-medium ${getGrowthRateColor(
                player.score,
              )}`}
            >
              {player.score.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Organization Info */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Crown className="w-4 h-4 text-yellow-400" />
          <span className="text-sm text-gray-400">Guild:</span>
          <span className="text-sm text-yellow-300 font-medium">
            {player.GuildName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-gray-400">Union:</span>
          <span className="text-sm text-blue-300 font-medium">
            {player.GuildUnionName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-green-400" />
          <span className="text-sm text-gray-400">Realm:</span>
          <span className="text-sm text-green-300 font-medium">
            {[player.RealmGroupName, player.RealmName].join("/")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
