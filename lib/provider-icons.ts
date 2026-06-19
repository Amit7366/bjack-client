import type { StaticImageData } from "next/image";

import fachaiIcon from "@/assets/provider-icon/vendor-awcmfc.png";
import jiliIcon from "@/assets/provider-icon/vendor-awcmjili.png";
import kmIcon from "@/assets/provider-icon/vendor-awcmkm.png";
import pragmaticIcon from "@/assets/provider-icon/vendor-awcmpp.png";
import playtechIcon from "@/assets/provider-icon/vendor-awcmpt.png";
import relaxgamingIcon from "@/assets/provider-icon/vendor-awcmrt.png";
import yellowBatIcon from "@/assets/provider-icon/vendor-awcmyesbingo.png";
import jdbIcon from "@/assets/provider-icon/vendor-jdb.png";
import pgIcon from "@/assets/provider-icon/vendor-pg.png";
import playngoIcon from "@/assets/provider-icon/vendor-playngo.png";
import rich88Icon from "@/assets/provider-icon/vendor-rich88.png";

/** providerKey → uploaded icon in `assets/provider-icon`. Unmapped keys use initials fallback. */
const PROVIDER_ICONS: Record<string, StaticImageData> = {
  pg: pgIcon,
  jili: jiliIcon,
  pragmatic: pragmaticIcon,
  playngo: playngoIcon,
  fachai: fachaiIcon,
  km: kmIcon,
  relaxgaming: relaxgamingIcon,
  playtech: playtechIcon,
  jdb: jdbIcon,
  rich88: rich88Icon,
  yellowBat: yellowBatIcon,
};

const PROVIDER_ICON_ALIASES: Record<string, string> = {
  pp: "pragmatic",
  pragmaticplay: "pragmatic",
};

export function providerIconSrc(providerKey: string): string | undefined {
  const key = PROVIDER_ICON_ALIASES[providerKey] ?? providerKey;
  return PROVIDER_ICONS[key]?.src;
}
