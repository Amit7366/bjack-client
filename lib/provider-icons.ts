import type { StaticImageData } from "next/image";

import cmdIcon from "@/assets/provider-icon/icon-cmd.svg";
import sbov2Icon from "@/assets/provider-icon/icon-sbov2.svg";
import sbtechIcon from "@/assets/provider-icon/icon-sbtech.svg";
import sportbookIcon from "@/assets/provider-icon/icon-sportbook.svg";
import ugv3Icon from "@/assets/provider-icon/icon-ugv3.svg";
import fachaiIcon from "@/assets/provider-icon/vendor-awcmfc.png";
import evolutionIcon from "@/assets/provider-icon/vendor-evo.png";
import jiliIcon from "@/assets/provider-icon/vendor-awcmjili.png";
import kmIcon from "@/assets/provider-icon/vendor-awcmkm.png";
import pragmaticIcon from "@/assets/provider-icon/vendor-awcmpp.png";
import playtechIcon from "@/assets/provider-icon/vendor-awcmpt.png";
import relaxgamingIcon from "@/assets/provider-icon/vendor-awcmrt.png";
import yellowBatIcon from "@/assets/provider-icon/vendor-awcmyesbingo.png";
import jdbIcon from "@/assets/provider-icon/vendor-jdb.png";
import spribeIcon from "@/assets/provider-icon/vendor-jdbaspribe.png";
import pgIcon from "@/assets/provider-icon/vendor-pg.png";
import playngoIcon from "@/assets/provider-icon/vendor-playngo.png";
import rich88Icon from "@/assets/provider-icon/vendor-rich88.png";

type ProviderIcon = StaticImageData | string;

function iconSrc(icon: ProviderIcon): string {
  return typeof icon === "string" ? icon : icon.src;
}

/** providerKey → uploaded icon in `assets/provider-icon`. Unmapped keys use initials fallback. */
const PROVIDER_ICONS: Record<string, ProviderIcon> = {
  pg: pgIcon,
  jili: jiliIcon,
  evolution: evolutionIcon,
  pragmatic: pragmaticIcon,
  playngo: playngoIcon,
  fachai: fachaiIcon,
  km: kmIcon,
  relaxgaming: relaxgamingIcon,
  playtech: playtechIcon,
  jdb: jdbIcon,
  spribe: spribeIcon,
  rich88: rich88Icon,
  yellowBat: yellowBatIcon,
  bti: sbtechIcon,
  cmd: cmdIcon,
  unitedgaming: ugv3Icon,
  sbosportsbook: sbov2Icon,
  sbovirtualsports: sbov2Icon,
  sabasport: sportbookIcon,
  sabasportsphp: sportbookIcon,
  "9wicket": sportbookIcon,
  betby: sportbookIcon,
  tfgaming: sportbookIcon,
  "568winsportsbook": sportbookIcon,
  lucksport: sportbookIcon,
};

const PROVIDER_ICON_ALIASES: Record<string, string> = {
  pp: "pragmatic",
  pragmaticplay: "pragmatic",
  btiSports: "bti",
  sboSports: "sbosportsbook",
};

export function providerIconSrc(providerKey: string): string | undefined {
  const key = PROVIDER_ICON_ALIASES[providerKey] ?? providerKey;
  const icon = PROVIDER_ICONS[key];
  return icon ? iconSrc(icon) : undefined;
}
