import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Ticket, Coins, Sparkles } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import { TokenPaywall } from "@/components/TokenPaywall";
import { PreferenzeProfessionista, type Preferenze } from "@/components/PreferenzeProfessionista";

// Mock con costo in token (≈ 1 token = 0,10€)
const eventiData: Record<string, { id: number; title: string; cost: number; richiedeProf?: boolean }> = {
  "1": { id: 1, title: "Webinar: Gestire le Ricadute", cost: 90, richiedeProf: true },
  "2": { id: 2, title: "Incontro in Presenza - Milano", cost: 0 },
  "3": { id: 3, title: "Workshop One-Day: Mindfulness", cost: 250 },
  "4": { id: 4, title: "Ritiro StandUp Weekend", cost: 900 },
};

const EventoCheckout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const evento = id ? eventiData[id] : null;
  const [step, setStep] = useState<"intro" | "preferenze">("intro");
  const [pref, setPref] = useState<Preferenze | null>(null);
  const [paywall, setPaywall] = useState(false);

  if (!evento) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <header className="glass border-b border-border/50 px-4 py-4 safe-area-top">
          <Link to="/eventi" className="flex items-center gap-2 text-muted-foreground">
            <ArrowLeft className="w-5 h-5" /><span>Torna agli eventi</span>
          </Link>
        </header>
        <div className="px-4 py-12 text-center"><p className="text-muted-foreground">Evento non trovato</p></div>
        <BottomNav />
      </div>
    );
  }

  const proceed = () => {
    if (evento.richiedeProf) setStep("preferenze");
    else setPaywall(true);
  };

  const completed = () => {
    toast.success("Iscrizione confermata!", { description: evento.title });
    setTimeout(() => navigate("/percorso/visite"), 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 pb-24">
      <header className="glass border-b border-border/50 px-4 py-4 safe-area-top">
        <Link to={`/eventi/${id}`} className="flex items-center gap-2 text-muted-foreground">
          <ArrowLeft className="w-5 h-5" /><span>Torna all'evento</span>
        </Link>
      </header>

      <div className="px-4 py-8 max-w-lg mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Ticket className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Iscriviti all'attività</h1>
          <p className="text-muted-foreground text-sm">Pagamento esclusivo in token StandUp</p>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="h-24 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center">
            <span className="text-4xl font-black text-primary/20 tracking-wider">STANDUP</span>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <h2 className="font-semibold text-foreground text-lg">{evento.title}</h2>
              <p className="text-muted-foreground text-sm mt-1">Iscrizione singola</p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-border/50">
              <span className="text-muted-foreground text-sm">Totale</span>
              <span className="text-2xl font-bold text-primary flex items-center gap-1.5">
                <Coins className="w-5 h-5" /> {evento.cost === 0 ? "Gratis" : `${evento.cost} token`}
              </span>
            </div>
          </div>
        </div>

        {step === "preferenze" ? (
          <div className="glass-card rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold">Le tue preferenze sul professionista</h3>
            </div>
            <PreferenzeProfessionista compact onConfirm={(p) => { setPref(p); setPaywall(true); }} />
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>Privacy garantita · segreto professionale</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Coins className="w-4 h-4 text-primary" />
                <span>I token si scalano dal tuo saldo. Saldo basso? Ricarica subito.</span>
              </div>
            </div>
            <Button size="lg" className="w-full" onClick={proceed}>
              {evento.cost === 0 ? "Iscriviti gratis" : (
                <span className="flex items-center"><Coins className="w-4 h-4 mr-1.5" /> Continua · {evento.cost} token</span>
              )}
            </Button>
          </>
        )}

        {pref && step === "preferenze" && (
          <p className="text-[11px] text-center text-muted-foreground">
            Preferenze salvate: {pref.genere} · {pref.esperienza} · {pref.approccio}
          </p>
        )}
      </div>

      <TokenPaywall
        open={paywall}
        onOpenChange={setPaywall}
        cost={evento.cost}
        reason={`Iscrizione ${evento.title}`}
        itemLabel={evento.title}
        onConfirm={completed}
      />

      <BottomNav />
    </div>
  );
};

export default EventoCheckout;
