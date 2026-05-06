import { Coins } from "lucide-react";
import { Link } from "react-router-dom";
import { useTokens, WEEKLY_FREE } from "@/hooks/useTokens";
import { cn } from "@/lib/utils";

interface Props { compact?: boolean; }

export const TokenBadge = ({ compact = false }: Props) => {
  const { balance } = useTokens();
  const low = balance < 30;

  return (
    <Link
      to="/token"
      className={cn(
        "flex items-center gap-1.5 px-2.5 h-9 rounded-lg border transition-colors",
        low
          ? "bg-primary/10 border-primary/30 text-primary"
          : "bg-secondary/50 border-border text-foreground hover:bg-secondary"
      )}
      aria-label={`${balance} token disponibili`}
    >
      <Coins className={cn("w-4 h-4", low ? "text-primary" : "text-amber-500")} />
      <span className="text-xs font-bold tabular-nums">{balance}</span>
      {!compact && <span className="text-[10px] text-muted-foreground hidden sm:inline">/{WEEKLY_FREE}</span>}
    </Link>
  );
};
