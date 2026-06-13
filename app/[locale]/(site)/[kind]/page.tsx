import { notFound } from "next/navigation";
import VendorGamesLobby from "@/components/VendorGamesLobby";
import { fetchVendorGames } from "@/lib/games-api";
import { filterGamesByLobbyTypes, inferLobbyGameTypes } from "@/lib/lobby-game-types";
import { allLobbyVendorCodes } from "@/lib/lobby-filter-providers";
import {
  defaultLobbyVendorParam,
  isAllLobbyVendors,
  isLobbyKind,
  LOBBY_VENDOR_ALL,
  type LobbyKind,
} from "@/lib/vendor-routes";
import { mergeGamesFromVendors, normalizeGameImage } from "@/lib/vendor-games-data";

type PageProps = {
  params: Promise<{ locale: string; kind: string }>;
  searchParams: Promise<{ vendor?: string | string[]; type?: string | string[] }>;
};

function splitCsv(param: string | string[] | undefined): string[] {
  if (typeof param !== "string" || !param.trim()) return [];
  return [...new Set(param.split(",").map((s) => s.trim()).filter(Boolean))];
}

async function loadVendorGames(vendorCodes: string[]) {
  try {
    const games = await fetchVendorGames(vendorCodes);
    return games.map((g) => ({
      ...g,
      image: normalizeGameImage(g.image),
      types: g.types?.length ? g.types : inferLobbyGameTypes(g.title),
    }));
  } catch (error) {
    console.error("Failed to load vendor games from API, using fallback:", error);
    return mergeGamesFromVendors(vendorCodes);
  }
}

export default async function LobbyByKindPage({ params, searchParams }: PageProps) {
  const { locale, kind: kindParam } = await params;
  if (!isLobbyKind(kindParam)) {
    notFound();
  }
  const kind = kindParam as LobbyKind;
  const sp = await searchParams;
  const vendorParts = splitCsv(sp.vendor);
  const vendorsResolved =
    vendorParts.length > 0 ? vendorParts : [defaultLobbyVendorParam()];
  const typeParts = splitCsv(sp.type);

  const vendorCodesForMerge = isAllLobbyVendors(vendorsResolved)
    ? allLobbyVendorCodes(kind)
    : vendorsResolved.filter((v) => v !== LOBBY_VENDOR_ALL);

  let merged = await loadVendorGames(vendorCodesForMerge);
  const games = filterGamesByLobbyTypes(merged, typeParts);

  return (
    <VendorGamesLobby
      key={`${kind}-${vendorsResolved.join(",")}-${typeParts.join(",")}`}
      locale={locale}
      kind={kind}
      vendors={vendorsResolved}
      activeTypes={typeParts}
      games={games}
    />
  );
}
