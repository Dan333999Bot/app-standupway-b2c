import { Link } from "react-router-dom";
import { Coins, ChevronRight } from "lucide-react";
import { useTokens } from "@/hooks/useTokens";

export const QuickAccessBar = () => {
  const { balance } = useTokens();

  return (
    <div className="px-4 pt-3 pb-1 bg-surface-1 border-b border-border/40">
      <Link
        to="/token"
        className="flex items-center justify-between h-10 px-3 rounded-lg bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/15 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Coins className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-semibold text-foreground">
            I miei token: <span className="tabular-nums">{balance}</span>
          </span>
          <span className="text-[10px] text-muted-foreground">· tocca per gestire</span>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </Link>
    </div>
  );
};
