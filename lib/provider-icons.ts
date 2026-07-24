import type { StaticImageData } from "next/image";

import cmdIcon from "@/assets/provider-icon/icon-cmd.svg";
import sbov2Icon from "@/assets/provider-icon/icon-sbov2.svg";
import sbtechIcon from "@/assets/provider-icon/icon-sbtech.svg";
import sportbookIcon from "@/assets/provider-icon/icon-sportbook.svg";
import ugv3Icon from "@/assets/provider-icon/icon-ugv3.svg";
import sevenfivenineIcon from "@/assets/provider-icon/vendor-awcm759gaming.png";
import amigoIcon from "@/assets/provider-icon/vendor-awcmamigogaming.svg";
import atgIcon from "@/assets/provider-icon/vendor-awcmatcgames.png";
import auragamingIcon from "@/assets/provider-icon/vendor-awcmauragaming.svg";
import cq9Icon from "@/assets/provider-icon/vendor-awcmcq9.webp";
import creedroomzIcon from "@/assets/provider-icon/vendor-awcmcreedroomz.svg";
import dreamgamingIcon from "@/assets/provider-icon/vendor-awcmdreamgaming.jpg";
import eazygamingIcon from "@/assets/provider-icon/vendor-awcmeazygaming.webp";
import eeaiIcon from "@/assets/provider-icon/vendor-awcmeeai.jpg";
import evoplayIcon from "@/assets/provider-icon/vendor-awcmevoplay.svg";
import ezugiIcon from "@/assets/provider-icon/vendor-awcmezugi.svg";
import fachaiIcon from "@/assets/provider-icon/vendor-awcmfc.png";
import fastspinIcon from "@/assets/provider-icon/vendor-awcmfastspin.png";
import funkygamesIcon from "@/assets/provider-icon/vendor-awcmfunkygame.webp";
import galaxsysIcon from "@/assets/provider-icon/vendor-awcmgalaxsys.webp";
import gamesoftIcon from "@/assets/provider-icon/vendor-awcmgamesoft.png";
import habaneroIcon from "@/assets/provider-icon/vendor-awcmhabanero.jpg";
import hacksawIcon from "@/assets/provider-icon/vendor-awcmhacksaw.png";
import inoutIcon from "@/assets/provider-icon/vendor-awcminout.svg";
import jiliIcon from "@/assets/provider-icon/vendor-awcmjili.png";
import kmIcon from "@/assets/provider-icon/vendor-awcmkm.png";
import koolbetIcon from "@/assets/provider-icon/vendor-awcmkoolbet.png";
import penguinkingIcon from "@/assets/provider-icon/vendor-awcmpenguinking.png";
import pragmaticIcon from "@/assets/provider-icon/vendor-awcmpp.png";
import playtechIcon from "@/assets/provider-icon/vendor-awcmpt.png";
import relaxgamingIcon from "@/assets/provider-icon/vendor-awcmrt.png";
import smartsoftIcon from "@/assets/provider-icon/vendor-awcmsmartsoft.webp";
import spadegamingIcon from "@/assets/provider-icon/vendor-awcmspadegaming.svg";
import topbetIcon from "@/assets/provider-icon/vendor-awcmtopbet.webp";
import turbogamesIcon from "@/assets/provider-icon/vendor-awcmturbogame.svg";
import twojIcon from "@/assets/provider-icon/vendor-awcmtwoj.png";
import veliplayIcon from "@/assets/provider-icon/vendor-awcmveliplay.jpeg";
import yellowBatIcon from "@/assets/provider-icon/vendor-awcmyesbingo.png";
import evolutionIcon from "@/assets/provider-icon/vendor-evo.png";
import jdbIcon from "@/assets/provider-icon/vendor-jdb.png";
import microgamingIcon from "@/assets/provider-icon/vendor-mg.png";
import nextspinIcon from "@/assets/provider-icon/vendor-nextspin.png";
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
  eazygaming: eazygamingIcon,
  km: kmIcon,
  relaxgaming: relaxgamingIcon,
  evoplay: evoplayIcon,
  ezugi: ezugiIcon,
  playtech: playtechIcon,
  jdb: jdbIcon,
  cq9: cq9Icon,
  spribe: spribeIcon,
  rich88: rich88Icon,
  inout: inoutIcon,
  fastspin: fastspinIcon,
  nextspin: nextspinIcon,
  microgaming: microgamingIcon,
  hacksaw: hacksawIcon,
  dreamgaming: dreamgamingIcon,
  eeai: eeaiIcon,
  penguinking: penguinkingIcon,
  topbet: topbetIcon,
  turbogames: turbogamesIcon,
  twoj: twojIcon,
  auragaming: auragamingIcon,
  funkygames: funkygamesIcon,
  spadegaming: spadegamingIcon,
  veliplay: veliplayIcon,
  creedroomz: creedroomzIcon,
  gamesoft: gamesoftIcon,
  atg: atgIcon,
  galaxsys: galaxsysIcon,
  smartsoft: smartsoftIcon,
  koolbet: koolbetIcon,
  habanero: habaneroIcon,
  amigo: amigoIcon,
  sevenfivenine: sevenfivenineIcon,
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
  dreamGaming: "dreamgaming",
  mg: "microgaming",
};

export function providerIconSrc(providerKey: string): string | undefined {
  const key = PROVIDER_ICON_ALIASES[providerKey] ?? providerKey;
  const icon = PROVIDER_ICONS[key];
  return icon ? iconSrc(icon) : undefined;
}
