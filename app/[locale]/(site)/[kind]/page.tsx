import { notFound } from "next/navigation";
import VendorGamesLobby from "@/components/VendorGamesLobby";
import { loadExclusiveLobbyGames } from "@/lib/exclusive-lobby-games";
import { fetchVendorGames } from "@/lib/games-api";
import type { GameTile } from "@/lib/game-tile";
import {
  filterGamesByLobbyKind,
  filterGamesByLobbyTypes,
  inferLobbyGameTypes,
} from "@/lib/lobby-game-types";
import {
  defaultLobbyVendorParam,
  isAllLobbyVendors,
  isLobbyKind,
  LOBBY_VENDOR_ALL,
  type LobbyKind,
} from "@/lib/vendor-routes";
import { mergeGamesFromVendors, resolveGameImage } from "@/lib/vendor-games-data";

type PageProps = {
  params: Promise<{ locale: string; kind: string }>;
  searchParams: Promise<{ vendor?: string | string[]; type?: string | string[] }>;
};

function splitCsv(param: string | string[] | undefined): string[] {
  if (typeof param !== "string" || !param.trim()) return [];
  return [...new Set(param.split(",").map((s) => s.trim()).filter(Boolean))];
}

async function loadVendorGames(kind: LobbyKind, vendorCodes: string[]) {
  try {
    const games = await fetchVendorGames({ vendorCodes, category: kind });
    return games.map((g) => ({
      ...g,
      image: resolveGameImage(
        (g as GameTile & { game_image?: string }).game_image,
        g.image,
      ),
      types: g.types?.length ? g.types : inferLobbyGameTypes(g.title),
    }));
  } catch (error) {
    console.error("Failed to load vendor games from API, using fallback:", error);
    const fallback = mergeGamesFromVendors(vendorCodes);
    return filterGamesByLobbyKind(fallback, kind);
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

  const vendorCodesForFetch = isAllLobbyVendors(vendorsResolved)
    ? []
    : vendorsResolved.filter((v) => v !== LOBBY_VENDOR_ALL);

  let merged =
    kind === "exclusive"
      ? await loadExclusiveLobbyGames(vendorCodesForFetch)
      : await loadVendorGames(kind, vendorCodesForFetch);

  if (kind !== "exclusive") {
    merged = filterGamesByLobbyKind(merged, kind);
  }
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
