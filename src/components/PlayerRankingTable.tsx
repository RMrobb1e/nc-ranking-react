import React, { useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  Trophy,
  Sword,
  TrendingUp,
  Crown,
  Users,
  Globe,
  Activity,
} from "lucide-react";
import { Player } from "@/types/player";
import PlayerCard from "./PlayerCard";
import { weaponTypeMap } from "@/lib/const";
import top_1 from "@/assets/top-1.png";
import top_2 from "@/assets/top-2.png";
import top_3 from "@/assets/top-3.png";
import top_4 from "@/assets/top-4.png";
import top_5 from "@/assets/top-5.png";

interface PlayerRankingTableProps {
  players: Player[];
  onSort: (column: keyof Player) => void;
  sortBy: keyof Player;
  sortOrder: "asc" | "desc";
}

const topImages = {
  1: top_1,
  2: top_2,
  3: top_3,
  4: top_4,
  5: top_5,
} as const;

const PlayerRankingTable: React.FC<PlayerRankingTableProps> = ({
  players,
  onSort,
  sortBy,
  sortOrder,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const playersPerPage = 50;

  const totalPages = Math.ceil(players.length / playersPerPage);
  const startIndex = (currentPage - 1) * playersPerPage;
  const endIndex = startIndex + playersPerPage;
  const currentPlayers = players.slice(startIndex, endIndex);

  const SortButton = ({
    column,
    children,
    icon: Icon,
  }: {
    column: keyof Player;
    children: React.ReactNode;
    icon: React.ComponentType<any>;
  }) => (
    <button
      onClick={() => onSort(column)}
      className="flex items-center gap-2 hover:text-purple-300 transition-colors group"
    >
      <Icon className="w-4 h-4 text-purple-400 group-hover:text-purple-300" />
      {children}
      {sortBy === column &&
        (sortOrder === "asc" ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        ))}
    </button>
  );

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
    <div className="bg-gradient-to-br from-slate-800/30 to-purple-800/30 backdrop-blur-sm border border-purple-500/30 rounded-lg overflow-hidden">
      {/* Mobile Card View */}
      <div className="block lg:hidden">
        <div className="p-4 space-y-4">
          {currentPlayers.map((player) => (
            <PlayerCard key={player.CharacterName} player={player} />
          ))}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">
                  <SortButton column="rank" icon={Trophy}>
                    Rank
                  </SortButton>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">
                  <SortButton column="CharacterName" icon={Sword}>
                    Player
                  </SortButton>
                </th>
                {/* <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">
                  <SortButton column="score" icon={Activity}>
                    Level
                  </SortButton>
                </th> 
                <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">
                  <SortButton column="score" icon={Activity}>
                    Power
                  </SortButton>
                </th>*/}
                <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">
                  <SortButton column="score" icon={TrendingUp}>
                    Growth Rate
                  </SortButton>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">
                  <SortButton column="GuildName" icon={Crown}>
                    Guild
                  </SortButton>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">
                  <SortButton column="GuildUnionName" icon={Users}>
                    Union
                  </SortButton>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">
                  <SortButton column="RealmName" icon={Globe}>
                    Realm
                  </SortButton>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {currentPlayers.map((player, index) => (
                <tr
                  key={player.CharacterName}
                  className="hover:bg-purple-900/20 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {player.rank <= 5 && (
                        <img
                          src={topImages[player.rank as keyof typeof topImages]}
                          className={`w-8 h-8 ${getRankColor(player.rank)}`}
                        />
                      )}
                      <span
                        className={`text-lg font-bold ${getRankColor(
                          player.rank,
                        )}`}
                      >
                        #{player.rank}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                        {player.CharacterName}
                      </div>
                      <div className="text-sm text-gray-400">
                        {weaponTypeMap[player.pcWeaponType]}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white font-medium">
                    {player.score.toLocaleString()}
                  </td>
                  {/* <td className="px-6 py-4 text-white font-medium">
                    {player.score.toLocaleString()}
                  </td> 
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-semibold ${getGrowthRateColor(
                          player.score,
                        )}`}
                      >
                        +{player.score}%
                      </span>
                      <TrendingUp
                        className={`w-4 h-4 ${getGrowthRateColor(
                          player.score,
                        )}`}
                      />
                    </div>
                  </td>*/}
                  <td className="px-6 py-4 text-yellow-300 font-medium">
                    {player.GuildName}
                  </td>
                  <td className="px-6 py-4 text-blue-300 font-medium">
                    {player.GuildUnionName}
                  </td>
                  <td className="px-6 py-4 text-green-300 font-medium">
                    {[player.RealmGroupName, player.RealmName].join("/")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 bg-slate-900/30 border-t border-slate-700/50">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-400">
            Showing {startIndex + 1} to {Math.min(endIndex, players.length)} of{" "}
            {players.length} players
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="text-white px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerRankingTable;
