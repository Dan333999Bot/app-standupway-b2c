import { useEffect, useState, useCallback } from "react";

const KEY = "standup_tokens";
const TX_KEY = "standup_tokens_tx";
const WEEK_KEY = "standup_tokens_week";

// 90 minuti settimanali gratis = 90 token (1 token = 1 minuto)
export const WEEKLY_FREE = 90;
export const DISCOUNT_THRESHOLD = 500; // token guadagnati per sbloccare 10%

export type TxType = "earn" | "spend" | "topup" | "refill";
export interface TokenTx {
  id: string;
  type: TxType;
  amount: number;
  reason: string;
  at: number;
}

function readBalance(): number {
  if (typeof window === "undefined") return WEEKLY_FREE;
  const v = localStorage.getItem(KEY);
  if (v === null) {
    localStorage.setItem(KEY, String(WEEKLY_FREE));
    return WEEKLY_FREE;
  }
  return parseInt(v, 10);
}

function readTx(): TokenTx[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(TX_KEY) || "[]"); } catch { return []; }
}

function readEarned(): number {
  return readTx().filter(t => t.type === "earn").reduce((a, t) => a + t.amount, 0);
}

export function useTokens() {
  const [balance, setBalance] = useState<number>(readBalance);
  const [tx, setTx] = useState<TokenTx[]>(readTx);

  useEffect(() => {
    const onChange = () => { setBalance(readBalance()); setTx(readTx()); };
    window.addEventListener("tokens-changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("tokens-changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const persist = (next: number, entry: TokenTx) => {
    localStorage.setItem(KEY, String(next));
    const allTx = [entry, ...readTx()].slice(0, 100);
    localStorage.setItem(TX_KEY, JSON.stringify(allTx));
    window.dispatchEvent(new Event("tokens-changed"));
  };

  const spend = useCallback((amount: number, reason: string): boolean => {
    const cur = readBalance();
    if (cur < amount) return false;
    const next = cur - amount;
    persist(next, { id: crypto.randomUUID(), type: "spend", amount, reason, at: Date.now() });
    return true;
  }, []);

  const earn = useCallback((amount: number, reason: string) => {
    const next = readBalance() + amount;
    persist(next, { id: crypto.randomUUID(), type: "earn", amount, reason, at: Date.now() });
  }, []);

  const topup = useCallback((amount: number, reason = "Ricarica token") => {
    const next = readBalance() + amount;
    persist(next, { id: crypto.randomUUID(), type: "topup", amount, reason, at: Date.now() });
  }, []);

  const refillWeekly = useCallback(() => {
    const lastWeek = localStorage.getItem(WEEK_KEY);
    const nowWeek = `${new Date().getFullYear()}-W${Math.ceil(((+new Date() - +new Date(new Date().getFullYear(),0,1)) / 86400000 + new Date(new Date().getFullYear(),0,1).getDay()+1) / 7)}`;
    if (lastWeek === nowWeek) return;
    localStorage.setItem(WEEK_KEY, nowWeek);
    const next = readBalance() + WEEKLY_FREE;
    persist(next, { id: crypto.randomUUID(), type: "refill", amount: WEEKLY_FREE, reason: "Ricarica settimanale gratuita", at: Date.now() });
  }, []);

  const earned = readEarned();
  const discountUnlocked = earned >= DISCOUNT_THRESHOLD;

  return { balance, tx, spend, earn, topup, refillWeekly, earned, discountUnlocked };
}
