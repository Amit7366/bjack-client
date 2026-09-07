"use client";

import { formatWalletBalance, refreshWalletBalance } from "@/lib/auth/api";
import { readAuthSession, saveAuthSession } from "@/lib/auth/session";

export const WALLET_LOCAL_CHANGE_EVENT = "banglajackpot-wallet-local-change";
export const ANCHOR_TTL_MS = 2 * 60 * 60 * 1000;
const DRIFT_TOLERANCE = 0.01;

export type LocalWalletState = {
  memberId: string;
  balance: number;
  anchoredAt: number;
  anchorBalance: number;
  revision: number;
  pendingPersist: boolean;
  lastPreviewAt?: number;
  lastPreviewToken?: string;
  deviceId: string;
  serverWalletRevision?: number;
  gameSession?: {
    launchedAt: number;
    balanceAtLaunch: number;
    gameCode?: string;
    transferId?: string;
  };
};

function storageKey(memberId: string): string {
  return `walletLocal:${memberId.trim().toLowerCase()}`;
}

function generateDeviceId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `dev_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function parseWallet(raw: string | null): LocalWalletState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as LocalWalletState;
    if (!parsed?.memberId || !Number.isFinite(parsed.balance)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function readLocalWallet(memberId: string): LocalWalletState | null {
  if (typeof window === "undefined" || !memberId) return null;
  return parseWallet(localStorage.getItem(storageKey(memberId)));
}

export function writeLocalWallet(state: LocalWalletState, notify = true): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(state.memberId), JSON.stringify(state));
  if (notify) {
    window.dispatchEvent(new Event(WALLET_LOCAL_CHANGE_EVENT));
  }
}

export function clearLocalWallet(memberId: string): void {
  if (typeof window === "undefined" || !memberId) return;
  localStorage.removeItem(storageKey(memberId));
  window.dispatchEvent(new Event(WALLET_LOCAL_CHANGE_EVENT));
}

export function needsReanchor(state: LocalWalletState | null): boolean {
  if (!state) return true;
  return Date.now() - state.anchoredAt >= ANCHOR_TTL_MS;
}

function syncAuthSessionBalance(balance: number): void {
  const session = readAuthSession();
  if (!session) return;
  const formatted = formatWalletBalance(balance);
  if (formatted) {
    saveAuthSession({ ...session, balance: formatted });
  }
}

export async function initWalletFromDb(memberId: string): Promise<number> {
  const normalized = memberId.trim().toLowerCase();
  clearLocalWallet(normalized);

  const dbBalanceStr = await refreshWalletBalance();
  const balance = Number.parseFloat(dbBalanceStr ?? "0");
  const safeBalance = Number.isFinite(balance) ? balance : 0;

  const state: LocalWalletState = {
    memberId: normalized,
    balance: safeBalance,
    anchoredAt: Date.now(),
    anchorBalance: safeBalance,
    revision: 1,
    pendingPersist: false,
    deviceId: generateDeviceId(),
  };

  writeLocalWallet(state);
  syncAuthSessionBalance(safeBalance);
  return safeBalance;
}

export async function reanchorWalletFromDb(memberId: string): Promise<number> {
  const normalized = memberId.trim().toLowerCase();
  const existing = readLocalWallet(normalized);

  const dbBalanceStr = await refreshWalletBalance();
  const balance = Number.parseFloat(dbBalanceStr ?? "0");
  const safeBalance = Number.isFinite(balance) ? balance : 0;

  const state: LocalWalletState = {
    memberId: normalized,
    balance: safeBalance,
    anchoredAt: Date.now(),
    anchorBalance: safeBalance,
    revision: (existing?.revision ?? 0) + 1,
    pendingPersist: false,
    deviceId: existing?.deviceId ?? generateDeviceId(),
    serverWalletRevision: existing?.serverWalletRevision,
  };

  writeLocalWallet(state);
  syncAuthSessionBalance(safeBalance);
  return safeBalance;
}

export function applyPreviewBalance(
  memberId: string,
  estimatedBalance: number,
  syncToken: string,
): void {
  const normalized = memberId.trim().toLowerCase();
  const existing = readLocalWallet(normalized);
  const base = existing ?? {
    memberId: normalized,
    balance: estimatedBalance,
    anchoredAt: Date.now(),
    anchorBalance: estimatedBalance,
    revision: 0,
    pendingPersist: false,
    deviceId: generateDeviceId(),
  };

  const state: LocalWalletState = {
    ...base,
    balance: estimatedBalance,
    revision: base.revision + 1,
    pendingPersist: true,
    lastPreviewAt: Date.now(),
    lastPreviewToken: syncToken,
    gameSession: undefined,
  };

  writeLocalWallet(state);
  syncAuthSessionBalance(estimatedBalance);
}

export function markPersistComplete(memberId: string, dbBalance?: number): void {
  const normalized = memberId.trim().toLowerCase();
  const existing = readLocalWallet(normalized);
  if (!existing) return;

  const state: LocalWalletState = { ...existing, pendingPersist: false };

  if (dbBalance != null && Number.isFinite(dbBalance)) {
    const drift = Math.abs(dbBalance - existing.balance);
    const inGame = Boolean(existing.gameSession);
    if (!inGame && drift > DRIFT_TOLERANCE) {
      state.balance = dbBalance;
      state.revision = existing.revision + 1;
      syncAuthSessionBalance(dbBalance);
    }
  }

  writeLocalWallet(state);
}

export function saveGameSessionSnapshot(params: {
  memberId: string;
  gameCode?: string;
  transferId?: string;
}): void {
  const normalized = params.memberId.trim().toLowerCase();
  const existing = readLocalWallet(normalized);
  const balanceAtLaunch = existing?.balance ?? Number.parseFloat(readAuthSession()?.balance ?? "0");

  const state: LocalWalletState = {
    memberId: normalized,
    balance: balanceAtLaunch,
    anchoredAt: existing?.anchoredAt ?? Date.now(),
    anchorBalance: existing?.anchorBalance ?? balanceAtLaunch,
    revision: (existing?.revision ?? 0) + 1,
    pendingPersist: existing?.pendingPersist ?? false,
    deviceId: existing?.deviceId ?? generateDeviceId(),
    lastPreviewAt: existing?.lastPreviewAt,
    lastPreviewToken: existing?.lastPreviewToken,
    serverWalletRevision: existing?.serverWalletRevision,
    gameSession: {
      launchedAt: Date.now(),
      balanceAtLaunch,
      gameCode: params.gameCode,
      transferId: params.transferId,
    },
  };

  writeLocalWallet(state, false);
}

export function clearGameSession(memberId: string): void {
  const normalized = memberId.trim().toLowerCase();
  const existing = readLocalWallet(normalized);
  if (!existing?.gameSession) return;
  const { gameSession: _, ...rest } = existing;
  writeLocalWallet(rest as LocalWalletState, false);
}

export function getLocalBalance(memberId: string): number | null {
  const state = readLocalWallet(memberId);
  return state ? state.balance : null;
}

export function resolveDisplayBalance(memberId: string, sessionBalance?: string): number {
  const local = readLocalWallet(memberId);
  if (local && !needsReanchor(local)) return local.balance;
  const parsed = Number.parseFloat(sessionBalance ?? "0");
  return Number.isFinite(parsed) ? parsed : 0;
}

export function mergeFromStorageEvent(memberId: string): boolean {
  const normalized = memberId.trim().toLowerCase();
  const incoming = readLocalWallet(normalized);
  if (!incoming) return false;

  const current = parseWallet(localStorage.getItem(storageKey(normalized)));
  if (!current || incoming.revision > current.revision) {
    syncAuthSessionBalance(incoming.balance);
    window.dispatchEvent(new Event(WALLET_LOCAL_CHANGE_EVENT));
    return true;
  }
  return false;
}

export function subscribeWalletLocalChange(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener(WALLET_LOCAL_CHANGE_EVENT, onChange);
  return () => window.removeEventListener(WALLET_LOCAL_CHANGE_EVENT, onChange);
}

export async function reanchorIfServerAhead(
  memberId: string,
  serverRevision?: number,
): Promise<boolean> {
  if (serverRevision == null || !Number.isFinite(serverRevision)) return false;
  const local = readLocalWallet(memberId);
  if (!local) return false;
  if (local.pendingPersist) return false;
  if (serverRevision <= (local.serverWalletRevision ?? local.revision)) return false;
  await reanchorWalletFromDb(memberId);
  const updated = readLocalWallet(memberId);
  if (updated) {
    writeLocalWallet({ ...updated, serverWalletRevision: serverRevision });
  }
  return true;
}

export async function ensureWalletReady(memberId: string): Promise<number> {
  const normalized = memberId.trim().toLowerCase();
  const local = readLocalWallet(normalized);
  if (!local || local.memberId !== normalized) return initWalletFromDb(memberId);
  if (needsReanchor(local)) return reanchorWalletFromDb(memberId);
  syncAuthSessionBalance(local.balance);
  return local.balance;
}
