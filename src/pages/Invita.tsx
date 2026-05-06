import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { HeaderActions } from "@/components/HeaderActions";
import { Gift, Copy, Check, Share2, Users, Sparkles, Tag, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTokens } from "@/hooks/useTokens";
import { toast } from "sonner";

const Invita = () => {
  const { topup, balance } = useTokens();
  const [copied, setCopied] = useState(false);
  const [coupon, setCoupon] = useState("");
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
          text: "Ti regalo 30 token gratis su StandUp, ti aiuta davvero. Usa il mio codice:",
          url: inviteUrl,
        });
      } catch {/* user cancelled */}
    } else {
      copyLink();
    }
  };

  const redeemCoupon = () => {
    if (!coupon.trim()) return;
    const c = coupon.trim().toUpperCase();
    const validCoupons: Record<string, number> = {
      WELCOME50: 50,
      STANDUP100: 100,
      AMICO30: 30,
    };
    const amount = validCoupons[c];
    if (amount) {
      topup(amount, `Coupon ${c}`);
      toast.success(`+${amount} token aggiunti!`);
      setCoupon("");
    } else {
      toast.error("Codice non valido");
    }
  };

  return (
    <div className="min-h-screen bg-surface-0 pb-24">
      <header className="bg-surface-1 border-b border-border/40 px-4 py-3 safe-area-top shadow-[var(--shadow-sm)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Gift className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-bold text-foreground">Invita</h1>
          </div>
          <HeaderActions />
        </div>
      </header>

      <div className="px-4 py-5 space-y-5">
        {/* Hero */}
        <div className="rounded-2xl p-5 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border border-primary/30 text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto">
            <Gift className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Regala 30 token, ricevi 30</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Ogni amico che attiva l'app con il tuo codice riceve <strong>30 token gratis</strong> (≈30 minuti di attività). Anche tu ne ricevi 30.
          </p>
        </div>

        {/* Codice referral */}
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
              <Share2 className="w-3.5 h-3.5 mr-1.5" />
              Condividi
            </Button>
          </div>
        </div>

        {/* Stato */}
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
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              <p className="text-[10px] text-muted-foreground uppercase">Token guadagnati</p>
            </div>
            <p className="text-2xl font-bold text-foreground">0</p>
          </div>
        </div>

        {/* Coupon */}
        <div className="glass-card rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Hai un codice coupon?</h3>
          </div>
          <p className="text-xs text-muted-foreground">Inserisci il codice ricevuto da campagne, medico o azienda.</p>
          <div className="flex gap-2">
            <Input
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="es. WELCOME50"
              className="uppercase"
            />
            <Button onClick={redeemCoupon} size="sm">Riscatta</Button>
          </div>
          <p className="text-[10px] text-muted-foreground">Saldo attuale: <strong>{balance} token</strong></p>
        </div>

        {/* Come funziona */}
        <div className="glass-card rounded-2xl p-4 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Come funziona</h3>
          <ol className="space-y-2 text-xs text-muted-foreground">
            <li className="flex gap-2"><span className="font-bold text-primary">1.</span> Condividi il tuo codice con chi può averne bisogno.</li>
            <li className="flex gap-2"><span className="font-bold text-primary">2.</span> Quando si registra, riceve 30 token gratis.</li>
            <li className="flex gap-2"><span className="font-bold text-primary">3.</span> Anche tu ricevi 30 token. Senza limiti.</li>
            <li className="flex gap-2"><span className="font-bold text-primary">4.</span> Accumula 500 token guadagnati e sblocca <strong>10% di sconto</strong> su tutti i percorsi.</li>
          </ol>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Invita;
