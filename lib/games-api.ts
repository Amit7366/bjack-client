import type { ApiResponse } from "@/lib/api/types";
import type { GameTile } from "@/lib/game-tile";
import type { CarouselSlide } from "@/lib/home-carousel-data";

const SERVER_API = (process.env.API_URL ?? "http://localhost:8000").replace(/\/$/, "");

async function fetchFromServer<T>(path: string): Promise<T> {
  const res = await fetch(`${SERVER_API}/api/v1/${path}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${path}: ${res.status}`);
  }
  const body = (await res.json()) as ApiResponse<T>;
  if (!body.success) {
    throw new Error(body.message ?? `Failed to fetch ${path}`);
  }
  return body.data;
}

export async function fetchPopularGames(): Promise<GameTile[]> {
  return fetchFromServer<GameTile[]>("home-games");
}

export async function fetchExclusiveSlides(): Promise<CarouselSlide[]> {
  return fetchFromServer<CarouselSlide[]>("exclusive-games");
}

export type FetchVendorGamesOptions = {
  vendorCodes?: string[];
  category: string;
};

export async function fetchVendorGames({
  vendorCodes = [],
  category,
}: FetchVendorGamesOptions): Promise<GameTile[]> {
  const params = new URLSearchParams();
  if (vendorCodes.length > 0) {
    params.set("vendor", vendorCodes.join(","));
  }
  if (category.trim()) {
    params.set("category", category.trim());
  }
  const query = params.toString();
  const path = query ? `allgames/vendor?${query}` : "allgames/vendor";
  return fetchFromServer<GameTile[]>(path);
}
