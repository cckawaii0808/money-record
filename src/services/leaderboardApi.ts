import { apiGet, apiPut } from "./apiClient";

export interface LeaderboardEntry {
  rank: number;
  publicId: string;
  displayName: string;
  netWorthTwd: number;
  updatedAt: string | null;
  isCurrentUser: boolean;
}

export interface LeaderboardData {
  entries: LeaderboardEntry[];
  totalUsers: number;
  myRank: number | null;
  balanceMonth: string;
  generatedAt: string;
  fx: { USD: number; JPY: number; updatedAt: string | null; isStale: boolean };
}

export interface LeaderboardResponse {
  message: string;
  data: LeaderboardData;
}

export interface ProfileResponse {
  message: string;
  data: { displayName: string };
}

export async function getLeaderboard(limit = 20, offset = 0): Promise<LeaderboardData> {
  const response = await apiGet<LeaderboardResponse>(`/api/leaderboard?limit=${limit}&offset=${offset}`);
  return response.data;
}

export async function updateMyProfile(displayName: string): Promise<ProfileResponse> {
  return apiPut<ProfileResponse>("/api/me/profile", { displayName });
}
