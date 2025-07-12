import { ApiMetadata, ApiResponse } from "@/types/player";

const API_BASE = import.meta.env.VITE_API_BASE;

export const apiService = {
  async getMetadata(): Promise<ApiMetadata> {
    const response = await fetch(`${API_BASE}/metadata`);
    if (!response.ok) {
      throw new Error("Failed to fetch metadata");
    }
    return response.json();
  },

  async getGrowthTopPlayers(regionCode: number): Promise<ApiResponse> {
    const response = await fetch(
      `${API_BASE}/growth-top-players?regionCode=${regionCode}`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch players");
    }
    return response.json();
  },
};
