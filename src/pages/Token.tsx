import { BottomNav } from "@/components/BottomNav";
import { HeaderActions } from "@/components/HeaderActions";
import { useTokens, WEEKLY_FREE, DISCOUNT_THRESHOLD } from "@/hooks/useTokens";
import { Coins, TrendingUp, Plus, Sparkles, ArrowDown, ArrowUp, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const Token = () => {
  const { balance, tx, topup, earned, discountUnlocked } = useTokens();

  const packs = [
    { qty: 60, price: "4,90 €" },
    { qty: 180, price: "12,90 €", popular: true },
    { qty: 500, price: "29,90 €" },
  ];

  const buy = (qty: number) => {
    topup(qty, `Ricarica pack ${qty}`);
    toast.success(`+${qty} token aggiunti!`);
  };

  return (
    <div className="min-h-screen bg-surface-0 pb-24">
      <header className="bg-surface-1 border-b border-border/40 px-4 py-3 safe-area-top shadow-[var(--shadow-sm)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Coins className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-bold text-foreground">Token</h1>
          </div>
          <HeaderActions />
        </div>
      </header>

      <div className="px-4 py-5 space-y-5">
        {/* Saldo */}
        <div className="rounded-2xl p-5 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border border-primary/30 text-center space-y-2">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Saldo disponibile</p>
          <div className="flex items-center justify-center gap-2">
            <Coins className="w-7 h-7 text-amber-500" />
            <p className="text-5xl font-bold text-foreground tabular-nums">{balance}</p>
          </div>
          <p className="text-xs text-muted-foreground">≈ {Math.floor(balance / 60)}h {balance % 60}min di attività</p>
        </div>

        {/* Free settimanale */}
        <div className="glass-card rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Free questa settimana</h3>
            </div>
            <span className="text-xs font-bold text-foreground">{Math.min(balance, WEEKLY_FREE)}/{WEEKLY_FREE}</span>
          </div>
          <Progress value={(Math.min(balance, WEEKLY_FREE) / WEEKLY_FREE) * 100} />
          <p className="text-[11px] text-muted-foreground">90 minuti gratis a settimana per tutte le attività del metodo StandUp.</p>
        </div>

        {/* Gamification */}
        <div className="glass-card rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Sconto fedeltà</h3>
            {discountUnlocked && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">SBLOCCATO</span>}
          </div>
          <Progress value={Math.min(100, (earned / DISCOUNT_THRESHOLD) * 100)} />
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{earned} / {DISCOUNT_THRESHOLD} token guadagnati</span>
            <span className="font-semibold text-primary">−10% sui percorsi</span>
          </div>
          <p className="text-[11px] text-muted-foreground">Più partecipi alle attività e inviti amici, più guadagni token.</p>
        </div>

        {/* Ricariche */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" />
            <h3 className="text-base font-semibold text-foreground">Ricarica</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {packs.map((p) => (
              <button
                key={p.qty}
                onClick={() => buy(p.qty)}
                className={`relative rounded-xl p-3 text-center border transition-all ${
                  p.popular
                    ? "bg-primary/10 border-primary/40 hover:bg-primary/15"
                    : "bg-surface-1 border-border hover:border-primary/30"
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground whitespace-nowrap">
                    POPOLARE
                  </span>
                )}
                <p className="text-lg font-bold text-foreground tabular-nums">{p.qty}</p>
                <p className="text-[10px] text-muted-foreground">token</p>
                <p className="text-xs font-semibold text-primary mt-1">{p.price}</p>
              </button>
            ))}
          </div>
          <Link to="/percorsi">
            <Button variant="outline" size="sm" className="w-full">
              <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
              Oppure prendi il percorso completo
            </Button>
          </Link>
        </div>

        {/* Storico */}
        <div className="space-y-2">
          <h3 className="text-base font-semibold text-foreground">Movimenti recenti</h3>
          {tx.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">Nessun movimento ancora</p>
          ) : (
            <div className="glass-card rounded-2xl divide-y divide-border/40">
              {tx.slice(0, 8).map((t) => {
                const positive = t.type !== "spend";
                return (
                  <div key={t.id} className="flex items-center gap-3 p-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${positive ? "bg-emerald-500/10" : "bg-primary/10"}`}>
                      {positive
                        ? <ArrowUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        : <ArrowDown className="w-4 h-4 text-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{t.reason}</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(t.at).toLocaleString("it-IT", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                    <span className={`text-sm font-bold tabular-nums ${positive ? "text-emerald-600 dark:text-emerald-400" : "text-primary"}`}>
                      {positive ? "+" : "−"}{t.amount}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Token;
