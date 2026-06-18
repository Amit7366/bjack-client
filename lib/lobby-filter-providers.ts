import { activeLobbyFilterRows } from "./catalog-providers";
import type { LobbyKind } from "./vendor-routes";

/** Vendor codes shown in filter sheet; labels come from `home.providers` keys. */
export type LobbyFilterProviderRow = {
  vendorCode: string;
  labelKey: string;
};

export function lobbyFilterProviderRows(kind: LobbyKind): LobbyFilterProviderRow[] {
  return activeLobbyFilterRows(kind);
}

export function providerLabelKeyForVendorCode(kind: LobbyKind, vendorCode: string): string | undefined {
  return lobbyFilterProviderRows(kind).find((r) => r.vendorCode === vendorCode)?.labelKey;
}

export function allLobbyVendorCodes(kind: LobbyKind): string[] {
  return lobbyFilterProviderRows(kind).map((r) => r.vendorCode);
}
