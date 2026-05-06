import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Coins, AlertTriangle, Check } from "lucide-react";
import { useTokens } from "@/hooks/useTokens";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  cost: number;
  reason: string;
  itemLabel: string;
  onConfirm: () => void;
  free?: boolean;
}

export const TokenPaywall = ({ open, onOpenChange, cost, reason, itemLabel, onConfirm, free }: Props) => {
  const { balance, spend } = useTokens();
  const effectiveCost = free ? 0 : cost;
  const insufficient = balance < effectiveCost;
  const after = balance - effectiveCost;

  const handle = () => {
    if (insufficient) return;
    if (free) {
      toast.success("Prenotazione gratuita confermata", { description: `0 token utilizzati · Saldo: ${balance}` });
      onConfirm();
      onOpenChange(false);
      return;
    }
    if (spend(effectiveCost, reason)) {
      toast.success(`${effectiveCost} token utilizzati`, { description: `Saldo: ${after} token` });
      onConfirm();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[360px] rounded-2xl">
        <DialogHeader>
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
            <Coins className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-center">{free ? "Conferma con i tuoi token" : "Conferma pagamento in token"}</DialogTitle>
          <DialogDescription className="text-center">{itemLabel}</DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          {free && (
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3">
              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">🎁 Questo servizio è GRATIS</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Ti mostriamo comunque il flusso token: i tuoi {balance} token rimarranno intatti. Servono per prenotare gli altri servizi.
              </p>
            </div>
          )}
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-1 border border-border/40">
            <span className="text-sm text-muted-foreground">Saldo attuale</span>
            <span className="text-sm font-semibold text-foreground">{balance} token</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/30">
            <span className="text-sm font-medium text-primary">Costo servizio</span>
            <span className="text-base font-bold text-primary">
              {free ? <><span className="line-through opacity-50 mr-1.5 text-xs">{cost}</span> 0 token</> : <>− {cost} token</>}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-1 border border-border/40">
            <span className="text-sm text-muted-foreground">Saldo dopo l'acquisto</span>
            <span className={`text-sm font-semibold ${insufficient ? "text-destructive" : "text-emerald-600 dark:text-emerald-400"}`}>
              {Math.max(0, after)} token
            </span>
          </div>
        </div>

        {insufficient ? (
          <div className="space-y-2">
            <div className="flex items-start gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/30">
              <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-destructive">Token insufficienti</p>
                <p className="text-[11px] text-muted-foreground">Ti mancano {effectiveCost - balance} token per completare l'acquisto.</p>
              </div>
            </div>
            <Button asChild className="w-full">
              <Link to="/token" onClick={() => onOpenChange(false)}>
                <Coins className="w-4 h-4 mr-1.5" /> Ricarica token
              </Link>
            </Button>
          </div>
        ) : (
          <Button onClick={handle} className="w-full">
            <Check className="w-4 h-4 mr-1.5" /> {free ? "Conferma prenotazione gratuita" : `Conferma e usa ${cost} token`}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};
