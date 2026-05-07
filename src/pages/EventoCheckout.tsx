import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Ticket, CreditCard, ExternalLink, Sparkles } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { PreferenzeProfessionista, type Preferenze } from "@/components/PreferenzeProfessionista";

const eventiData: Record<string, { id: number; title: string; price: string; stripeUrl: string; richiedeProf?: boolean }> = {
  "1": { id: 1, title: "Webinar: Gestire le Ricadute", price: "9€", stripeUrl: "https://buy.stripe.com/test_PLACEHOLDER_WEBINAR", richiedeProf: true },
  "2": { id: 2, title: "Incontro in Presenza - Milano", price: "Gratis", stripeUrl: "" },
  "3": { id: 3, title: "Workshop One-Day: Mindfulness", price: "25€", stripeUrl: "https://buy.stripe.com/test_PLACEHOLDER_MINDFUL" },
  "4": { id: 4, title: "Ritiro StandUp Weekend", price: "90€", stripeUrl: "https://buy.stripe.com/test_PLACEHOLDER_RITIRO" },
};

const EventoCheckout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const evento = id ? eventiData[id] : null;
  const [step, setStep] = useState<"intro" | "preferenze">("intro");
  const [pref, setPref] = useState<Preferenze | null>(null);

  if (!evento) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <header className="glass border-b border-border/50 px-4 py-4 safe-area-top">
          <Link to="/community" className="flex items-center gap-2 text-muted-foreground">
            <ArrowLeft className="w-5 h-5" /><span>Indietro</span>
          </Link>
        </header>
        <div className="px-4 py-12 text-center"><p className="text-muted-foreground">Evento non trovato</p></div>
        <BottomNav />
      </div>
    );
  }

  const proceed = () => {
    if (evento.richiedeProf && step !== "preferenze") return setStep("preferenze");
    if (evento.price === "Gratis") {
      navigate("/percorso/visite");
    } else {
      window.open(evento.stripeUrl, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 pb-24">
      <header className="glass border-b border-border/50 px-4 py-4 safe-area-top">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground">
          <ArrowLeft className="w-5 h-5" /><span>Indietro</span>
        </button>
      </header>

      <div className="px-4 py-8 max-w-lg mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Ticket className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Iscriviti all'attività</h1>
          <p className="text-muted-foreground text-sm">Pagamento sicuro con carta</p>
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
              <span className="text-2xl font-bold text-primary">{evento.price}</span>
            </div>
          </div>
        </div>

        {step === "preferenze" ? (
          <div className="glass-card rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold">Le tue preferenze sul professionista</h3>
            </div>
            <PreferenzeProfessionista compact onConfirm={(p) => { setPref(p); proceed(); }} />
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>Pagamento sicuro · privacy garantita</span>
              </div>
            </div>
            <Button size="lg" className="w-full" onClick={proceed}>
              {evento.price === "Gratis" ? "Iscriviti gratis" : (
                <span className="flex items-center"><CreditCard className="w-4 h-4 mr-1.5" /> Paga {evento.price} con carta <ExternalLink className="w-3.5 h-3.5 ml-1.5" /></span>
              )}
            </Button>
          </>
        )}

        {pref && <p className="text-[11px] text-center text-muted-foreground">Preferenze: {pref.genere} · {pref.esperienza} · {pref.approccio}</p>}
      </div>

      <BottomNav />
    </div>
  );
};

export default EventoCheckout;
