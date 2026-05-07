import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { HeaderActions } from "@/components/HeaderActions";
import { BackButton } from "@/components/BackButton";
import { Gift, Copy, Check, Share2, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Invita = () => {
  const [copied, setCopied] = useState(false);
  const [referralCode] = useState(() => {
    const saved = localStorage.getItem("standup_ref_code");
    if (saved) return saved;
    const code = "STAND-" + Math.random().toString(36).slice(2, 7).toUpperCase();
    localStorage.setItem("standup_ref_code", code);
    return code;
  });

  const inviteUrl = `${window.location.origin}/?ref=${referralCode}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    toast.success("Link copiato!");
    setTimeout(() => setCopied(false), 2000);
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Unisciti a StandUp",
          text: "Ti regalo uno sconto sul primo percorso StandUp. Usa il mio codice:",
          url: inviteUrl,
        });
      } catch {/* user cancelled */}
    } else {
      copyLink();
    }
  };

  return (
    <div className="min-h-screen bg-surface-0 pb-24">
      <header className="bg-surface-1 border-b border-border/40 px-4 py-3 safe-area-top shadow-[var(--shadow-sm)]">
        <div className="flex items-center gap-3">
          <BackButton />
          <div className="flex items-center gap-2.5 flex-1">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Gift className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-bold text-foreground">Invita</h1>
          </div>
          <HeaderActions />
        </div>
      </header>

      <div className="px-4 py-5 space-y-5">
        <div className="rounded-2xl p-5 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border border-primary/30 text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto">
            <Gift className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Invita un amico</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Chi si iscrive con il tuo codice riceve uno <strong>sconto sul primo percorso</strong>. Anche tu ottieni uno sconto sul prossimo rinnovo.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Il tuo codice</h3>
          </div>
          <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-xl border border-border">
            <span className="text-lg font-mono font-bold text-primary tracking-wider flex-1 text-center">
              {referralCode}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={copyLink} variant="outline" size="sm">
              {copied ? <Check className="w-3.5 h-3.5 mr-1.5" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
              {copied ? "Copiato" : "Copia link"}
            </Button>
            <Button onClick={share} size="sm">
              <Share2 className="w-3.5 h-3.5 mr-1.5" /> Condividi
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <Users className="w-3.5 h-3.5 text-muted-foreground" />
              <p className="text-[10px] text-muted-foreground uppercase">Amici invitati</p>
            </div>
            <p className="text-2xl font-bold text-foreground">0</p>
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <Gift className="w-3.5 h-3.5 text-primary" />
              <p className="text-[10px] text-muted-foreground uppercase">Sconti sbloccati</p>
            </div>
            <p className="text-2xl font-bold text-foreground">0</p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Invita;
