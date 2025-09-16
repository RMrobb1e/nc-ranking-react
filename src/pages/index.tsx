import { useState, useMemo, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import PlayerRankingTable from "@/components/PlayerRankingTable";
import SearchFilters from "@/components/SearchFilters";
import { Player, ApiMetadata } from "@/types/player";
import { apiService } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Trophy, Camera } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import PasswordProtection from "@/components/PasswordProtection";

const Index = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(2020); // Default to ASIA II
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGuild, setSelectedGuild] = useState("");
  const [selectedUnion, setSelectedUnion] = useState("");
  const [selectedRealm, setSelectedRealm] = useState("");
  const [sortBy, setSortBy] = useState<keyof Player>("rank");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showTop20, setShowTop20] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  // Fetch metadata
  const { data: metadata } = useQuery({
    queryKey: ["metadata"],
    queryFn: apiService.getMetadata,
  });

  // Fetch players data
  const {
    data: playersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["players", selectedRegion],
    queryFn: () => apiService.getGrowthTopPlayers(selectedRegion),
    enabled: !!selectedRegion,
  });

  const players = useMemo(() => {
    return playersData?.items || [];
  }, [playersData]);

  const filteredPlayers = useMemo(() => {
    let filtered = players.filter((player) => {
      const matchesSearch = player.CharacterName.toLowerCase().includes(
        searchTerm.toLowerCase(),
      );
      const matchesGuild = !selectedGuild || player.GuildName === selectedGuild;
      const matchesUnion =
        !selectedUnion || player.GuildUnionName === selectedUnion;

      // Updated realm filtering logic
      const matchesRealm =
        !selectedRealm ||
        `${player.RealmGroupName}/${player.RealmName}` === selectedRealm ||
        player.RealmGroupName.toLowerCase().includes(
          selectedRealm.toLowerCase(),
        );

      return matchesSearch && matchesGuild && matchesUnion && matchesRealm;
    });

    filtered.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      return sortOrder === "asc"
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });

    // If showTop20 is true, limit to top 20 players
    if (showTop20) {
      filtered = filtered.slice(0, 20);
    }

    return filtered;
  }, [
    players,
    showTop20,
    searchTerm,
    selectedGuild,
    selectedUnion,
    selectedRealm,
    sortBy,
    sortOrder,
  ]);

  const handleSort = (column: keyof Player) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleScreenshot = async () => {
    if (!tableRef.current) {
      toast.error("Table not found for screenshot");
      return;
    }

    try {
      toast.info("Capturing screenshot...");
      const canvas = await html2canvas(tableRef.current, {
        backgroundColor: "#1e293b",
        scale: 2,
        useCORS: true,
        allowTaint: false,
      });

      const link = document.createElement("a");
      link.download = `night-crows-rankings-${
        new Date().toISOString().split("T")[0]
      }.png`;
      link.href = canvas.toDataURL();
      link.click();

      toast.success("Screenshot captured and downloaded!");
    } catch (error) {
      console.error("Screenshot failed:", error);
      toast.error("Failed to capture screenshot");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Error Loading Data</h2>
          <p className="text-gray-400">
            Failed to fetch player rankings. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  if (!isUnlocked) {
    return <PasswordProtection onUnlock={() => setIsUnlocked(true)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-sm border-b border-purple-500/30">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-4">
              Night Crows
            </h1>
            <h2 className="text-2xl text-purple-200 font-semibold mb-2">
              Player Rankings
            </h2>
            <p className="text-gray-400">
              Track the mightiest warriors across all realms
            </p>
            {metadata?.lastUpdated && (
              <p className="text-gray-500 text-sm mt-2">
                Last updated: {new Date(metadata.lastUpdated).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Search and Filters */}
        <SearchFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedGuild={selectedGuild}
          setSelectedGuild={setSelectedGuild}
          selectedUnion={selectedUnion}
          setSelectedUnion={setSelectedUnion}
          selectedRealm={selectedRealm}
          setSelectedRealm={setSelectedRealm}
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          players={players}
          regions={
            metadata?.regions
              .map((r) => {
                if (r.code === 0) return;
                return r;
              })
              .filter(Boolean) || []
          }
        />
        <div className="mb-6 flex gap-4">
          <Button
            onClick={() => setShowTop20(!showTop20)}
            variant={showTop20 ? "default" : "outline"}
            className={`${
              showTop20
                ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0"
                : "bg-slate-700/50 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 hover:text-yellow-300"
            } transition-all duration-200`}
          >
            <Trophy className="w-4 h-4 mr-2" />
            {showTop20 ? "Show All Players" : "Show Top 20"}
          </Button>
          <Button
            onClick={handleScreenshot}
            variant="outline"
            className="bg-slate-700/50 border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 transition-all duration-200"
          >
            <Camera className="w-4 h-4 mr-2" />
            Take Screenshot
          </Button>
        </div>

        {/* Stats Summary */}
        <div
          className={`grid grid-cols-1 ${
            showTop20 ? "md:grid-cols-5" : "md:grid-cols-4"
          } gap-6 mb-8`}
        >
          <div className="bg-gradient-to-br from-purple-800/30 to-purple-900/30 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6">
            <h3 className="text-purple-200 text-sm font-medium">
              Total Players
            </h3>
            <p className="text-3xl font-bold text-white">
              {isLoading
                ? "..."
                : (playersData?.totalUnique || 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-800/30 to-blue-900/30 backdrop-blur-sm border border-blue-500/30 rounded-lg p-6">
            <h3 className="text-blue-200 text-sm font-medium">
              Active Search Results
            </h3>
            <p className="text-3xl font-bold text-white">
              {filteredPlayers.length.toLocaleString()}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-800/30 to-green-900/30 backdrop-blur-sm border border-green-500/30 rounded-lg p-6">
            <h3 className="text-green-200 text-sm font-medium">Total Guilds</h3>
            <p className="text-3xl font-bold text-white">
              {new Set(players.map((p) => p.GuildName)).size}
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-800/30 to-orange-900/30 backdrop-blur-sm border border-orange-500/30 rounded-lg p-6">
            <h3 className="text-orange-200 text-sm font-medium">
              Total Realms
            </h3>
            <p className="text-3xl font-bold text-white">
              {
                new Set(
                  players.map((p) => `${p.RealmGroupName}/${p.RealmName}`),
                ).size
              }
            </p>
          </div>
          {showTop20 && (
            <div className="bg-gradient-to-br from-yellow-800/30 to-yellow-900/30 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-6">
              <h3 className="text-yellow-200 text-sm font-medium">
                Avg Growth Rate (Top 20)
              </h3>
              <p className="text-3xl font-bold text-white">
                {filteredPlayers.length > 0
                  ? (
                      filteredPlayers.reduce((sum, p) => sum + p.score, 0) /
                      filteredPlayers.length
                    ).toFixed(2)
                  : "0.00"}
                %
              </p>
            </div>
          )}
        </div>

        {/* Player Rankings Table */}
        {isLoading ? (
          <div className="bg-gradient-to-r from-slate-800/50 to-purple-800/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
              <p className="text-purple-200">Loading player rankings...</p>
            </div>
          </div>
        ) : (
          <div ref={tableRef}>
            <PlayerRankingTable
              players={filteredPlayers}
              onSort={handleSort}
              sortBy={sortBy}
              sortOrder={sortOrder}
              showLinearRanking={showTop20}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
