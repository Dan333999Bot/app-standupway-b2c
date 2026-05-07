import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { HeaderActions } from "@/components/HeaderActions";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Gift, Copy, Check, Share2, Users, ArrowRight, Ticket, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

const Servizi = () => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [inviteSent, setInviteSent] = useState(false);
  const referralCode = "STANDUP-TU2025";
  const discount = "20%";

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast({ title: "Codice copiato! 📋", description: "Condividilo con chi vuoi aiutare." });
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = async () => {
    const text = `Ciao! Ti consiglio StandUp, un'app di supporto per le dipendenze. Usa il mio codice ${referralCode} per avere uno sconto ${discount} sui corsi Academy. Scaricala qui: https://standup.app`;
    if (navigator.share) {
      try { await navigator.share({ title: "StandUp - Invita un amico", text }); } catch {}
    } else {
      navigator.clipboard.writeText(text);
      toast({ title: "Link copiato! 📋", description: "Incollalo dove vuoi per condividerlo." });
    }
  };

  const sendInvite = () => {
    if (!email.trim()) return;
    setInviteSent(true);
    toast({ title: "Invito inviato! ✅", description: `Abbiamo inviato un invito a ${email}` });
    setTimeout(() => { setInviteSent(false); setEmail(""); }, 3000);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="glass border-b border-border/50 px-4 py-4 safe-area-top">
        <div className="flex items-center gap-3">
          <BackButton />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">Invita</h1>
            <p className="text-sm text-muted-foreground mt-1">Aiuta qualcuno, risparmia sui corsi</p>
          </div>
          <HeaderActions />
        </div>
      </header>

      <div className="px-4 py-6 space-y-5">
        {/* Hero card */}
        <div className="glass-card rounded-2xl p-5 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
            <Gift className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">Regala supporto, ottieni uno sconto</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Per ogni amico che si iscrive all'app con il tuo codice, riceve un <span className="font-semibold text-primary">codice sconto del {discount}</span> da usare per acquistare <span className="font-semibold text-foreground">corsi Academy</span> o prodotti dallo <a href="https://rulez.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline underline-offset-2">shop StandUp Rulez</a>.
            </p>
          </div>
        </div>

        {/* Referral code */}
        <div className="glass-card rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Ticket className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Il tuo codice invito</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 px-4 py-3 rounded-xl bg-secondary/50 border border-border/50 text-center">
              <span className="text-lg font-bold tracking-wider text-foreground">{referralCode}</span>
            </div>
            <Button variant="outline" size="icon" onClick={copyCode} className="h-12 w-12 flex-shrink-0">
              {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
            </Button>
          </div>
          <Button onClick={shareLink} className="w-full" variant="default">
            <Share2 className="w-4 h-4 mr-2" />
            Condividi con un amico
          </Button>
        </div>

        {/* Send invite by email */}
        <div className="glass-card rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Invita via email</h3>
          </div>
          <p className="text-xs text-muted-foreground">Inserisci l'email di un amico e gli invieremo un invito con il tuo codice sconto.</p>
          <div className="flex gap-2">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="amico@email.com"
              type="email"
              className="flex-1"
            />
            <Button onClick={sendInvite} disabled={!email.trim() || inviteSent} size="sm" className="px-4">
              {inviteSent ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* How it works */}
        <div className="glass-card rounded-2xl p-4 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Come funziona</h3>
          <div className="space-y-3">
            {[
              { step: "1", text: "Condividi il tuo codice con un amico" },
              { step: "2", text: "Il tuo amico si iscrive a StandUp con il codice" },
              { step: "3", text: `Riceve uno sconto del ${discount} su corsi Academy o shop Rulez` },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">{item.step}</span>
                </div>
                <p className="text-sm text-foreground/80">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Shop link */}
        <a href="https://rulez.com" target="_blank" rel="noopener noreferrer" className="glass-card rounded-2xl p-4 flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <ShoppingBag className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Shop StandUp Rulez</p>
            <p className="text-[11px] text-muted-foreground">Usa il tuo codice sconto anche sullo shop!</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </a>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary">0</p>
            <p className="text-[11px] text-muted-foreground mt-1">Amici invitati</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary">0%</p>
            <p className="text-[11px] text-muted-foreground mt-1">Sconto accumulato</p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Servizi;
