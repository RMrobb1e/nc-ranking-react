import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Search,
  Filter,
  Crown,
  Users,
  Globe,
  Check,
  ChevronDown,
} from "lucide-react";
import { Player, Region } from "@/types/player";
import { cn } from "@/lib/utils";

interface SearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedGuild: string;
  setSelectedGuild: (guild: string) => void;
  selectedUnion: string;
  setSelectedUnion: (union: string) => void;
  selectedRealm: string;
  setSelectedRealm: (realm: string) => void;
  selectedRegion: number;
  setSelectedRegion: (region: number) => void;
  players: Player[];
  regions: Region[];
}

const SearchableSelect = ({
  value,
  onValueChange,
  options,
  placeholder,
  icon: Icon,
  iconColor,
}: {
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
  placeholder: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const displayValue = value || `All ${placeholder}s`;

  return (
    <div className="relative">
      <Icon className={`absolute left-3 top-3 w-4 h-4 ${iconColor} z-10`} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between pl-10 bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600/50"
          >
            {displayValue}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-slate-800 border-slate-600">
          <div className="p-2">
            <Input
              placeholder={`Search ${placeholder.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
            />
          </div>
          <div className="max-h-60 overflow-auto">
            <div
              className={cn(
                "flex cursor-pointer items-center px-3 py-2 text-sm text-white hover:bg-slate-700",
                !value && "bg-slate-700",
              )}
              onClick={() => {
                onValueChange("");
                setOpen(false);
                setSearchTerm("");
              }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  !value ? "opacity-100" : "opacity-0",
                )}
              />
              All {placeholder}s
            </div>
            {filteredOptions.map((option) => (
              <div
                key={option}
                className={cn(
                  "flex cursor-pointer items-center px-3 py-2 text-sm text-white hover:bg-slate-700",
                  value === option && "bg-slate-700",
                )}
                onClick={() => {
                  onValueChange(option);
                  setOpen(false);
                  setSearchTerm("");
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option ? "opacity-100" : "opacity-0",
                  )}
                />
                {option}
              </div>
            ))}
            {filteredOptions.length === 0 && searchTerm && (
              <div className="px-3 py-2 text-sm text-gray-400">
                No {placeholder.toLowerCase()} found.
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

const RealmSelect = ({
  selectedRealm,
  setSelectedRealm,
  players,
}: {
  selectedRealm: string;
  setSelectedRealm: (realm: string) => void;
  players: Player[];
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const allRealmGroups = Array.from(
    new Set(players.map((p) => p.RealmGroupName)),
  );

  const allRealmNames = Array.from(
    new Set(players.map((p) => `${p.RealmGroupName}/${p.RealmName}`)),
  );

  const realmOptions = [...allRealmGroups, ...allRealmNames].sort();

  const filteredOptions = realmOptions
    .filter((option) => {
      if (!searchTerm) return true;

      const searchLower = searchTerm.toLowerCase();
      const [realmGroup, realmName] = option.split("/");

      // If search term matches the beginning of RealmGroupName (e.g., "SEA201" matches "SEA201/Knight")
      // or if it's contained within RealmGroupName, RealmName, or the full string
      return (
        realmGroup.toLowerCase().startsWith(searchLower) ||
        realmGroup.toLowerCase().includes(searchLower) ||
        realmName?.toLowerCase().includes(searchLower) ||
        option.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      // Sort results to prioritize RealmGroupName matches at the beginning
      const searchLower = searchTerm.toLowerCase();
      const [aRealmGroup] = a.split("/");
      const [bRealmGroup] = b.split("/");

      const aStartsWith = aRealmGroup.toLowerCase().startsWith(searchLower);
      const bStartsWith = bRealmGroup.toLowerCase().startsWith(searchLower);

      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;

      return a.localeCompare(b);
    });

  const displayValue = selectedRealm || "All Realms";

  return (
    <div className="relative">
      <Globe className="absolute left-3 top-3 w-4 h-4 text-green-400 z-10" />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between pl-10 bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600/50"
          >
            {displayValue}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-slate-800 border-slate-600">
          <div className="p-2">
            <Input
              placeholder="Search realm (e.g., SEA201 to see all SEA201/* realms)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
            />
          </div>
          <div className="max-h-60 overflow-auto">
            <div
              className={cn(
                "flex cursor-pointer items-center px-3 py-2 text-sm text-white hover:bg-slate-700",
                !selectedRealm && "bg-slate-700",
              )}
              onClick={() => {
                setSelectedRealm("");
                setOpen(false);
                setSearchTerm("");
              }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  !selectedRealm ? "opacity-100" : "opacity-0",
                )}
              />
              All Realms
            </div>
            {filteredOptions.map((option) => (
              <div
                key={option}
                className={cn(
                  "flex cursor-pointer items-center px-3 py-2 text-sm text-white hover:bg-slate-700",
                  selectedRealm === option && "bg-slate-700",
                )}
                onClick={() => {
                  setSelectedRealm(option);
                  setOpen(false);
                  setSearchTerm("");
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedRealm === option ? "opacity-100" : "opacity-0",
                  )}
                />
                {option}
              </div>
            ))}
            {filteredOptions.length === 0 && searchTerm && (
              <div className="px-3 py-2 text-sm text-gray-400">
                No realm found.
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

const RegionSelect = ({
  selectedRegion,
  setSelectedRegion,
  regions,
}: {
  selectedRegion: number;
  setSelectedRegion: (region: number) => void;
  regions: Region[];
}) => {
  const [open, setOpen] = useState(false);

  const selectedRegionName =
    regions.find((r) => r.code === selectedRegion)?.name || "Select Region";

  return (
    <div className="relative">
      <Globe className="absolute left-3 top-3 w-4 h-4 text-purple-400 z-10" />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between pl-10 bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600/50"
          >
            {selectedRegionName}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-slate-800 border-slate-600">
          <div className="max-h-60 overflow-auto">
            {regions.map((region) => (
              <div
                key={region.code}
                className={cn(
                  "flex cursor-pointer items-center px-3 py-2 text-sm text-white hover:bg-slate-700",
                  selectedRegion === region.code && "bg-slate-700",
                )}
                onClick={() => {
                  setSelectedRegion(region.code);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedRegion === region.code
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
                {region.name}
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedGuild,
  setSelectedGuild,
  selectedUnion,
  setSelectedUnion,
  selectedRealm,
  setSelectedRealm,
  selectedRegion,
  setSelectedRegion,
  players,
  regions,
}) => {
  const guilds = Array.from(new Set(players.map((p) => p.GuildName))).sort();
  const unions = Array.from(
    new Set(players.map((p) => p.GuildUnionName)),
  ).sort();

  return (
    <div className="bg-gradient-to-r from-slate-800/50 to-purple-800/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6 mb-8">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-purple-200">
          Search & Filter
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Region Filter */}
        <RegionSelect
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          regions={regions}
        />

        {/* Search by Name */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search player name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 focus:border-purple-500"
          />
        </div>

        {/* Guild Filter */}
        <SearchableSelect
          value={selectedGuild}
          onValueChange={setSelectedGuild}
          options={guilds}
          placeholder="Guild"
          icon={Crown}
          iconColor="text-yellow-400"
        />

        {/* Union Filter */}
        <SearchableSelect
          value={selectedUnion}
          onValueChange={setSelectedUnion}
          options={unions}
          placeholder="Union"
          icon={Users}
          iconColor="text-blue-400"
        />

        {/* Realm Filter */}
        <RealmSelect
          selectedRealm={selectedRealm}
          setSelectedRealm={setSelectedRealm}
          players={players}
        />
      </div>
    </div>
  );
};

export default SearchFilters;
