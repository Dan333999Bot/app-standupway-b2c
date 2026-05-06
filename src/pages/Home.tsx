import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { HeaderActions } from "@/components/HeaderActions";
import { QuickAccessBar } from "@/components/QuickAccessBar";
import { Link } from "react-router-dom";
import {
  Flame, BookOpen, Brain, Wind, Target, ArrowRight,
  Heart, Users, Star, ChevronRight, Sparkles, Shield,
  MessageCircle, GraduationCap, MapPin, ClipboardCheck,
  Video, CalendarDays, Clock, Coins, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TokenPaywall } from "@/components/TokenPaywall";
import { toast } from "sonner";

interface Attivita {
  id: string; icon: any; tag: string; tagClass: string;
  title: string; when: string; durationMin: number; location: string; description: string;
}

const ATTIVITA_IMMINENTI: Attivita[] = [
  { id: "webinar-comunita", icon: Video, tag: "Webinar · Online", tagClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    title: "Come smettere senza andare in comunità", when: "Giovedì · 21:00", durationMin: 60, location: "Videochiamata Zoom",
    description: "Un incontro live con il dott. Marco per esplorare alternative concrete al ricovero in comunità: percorsi ambulatoriali, supporto domiciliare e il ruolo della rete familiare." },
  { id: "webinar-familiari", icon: Video, tag: "Webinar · Online", tagClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    title: "Come gestire una persona con dipendenze in casa", when: "Martedì prossimo · 20:30", durationMin: 75, location: "Videochiamata Zoom",
    description: "Strumenti pratici per familiari: come comunicare senza giudicare e prendersi cura di sé." },
  { id: "basement-milano", icon: MapPin, tag: "Basement · Dal vivo", tagClass: "bg-primary/10 text-primary",
    title: "Incontro Basement · Milano", when: "Sab 16 Mag · 18:30", durationMin: 90, location: "Via Tortona 15, Milano",
    description: "Incontro mensile dal vivo con il gruppo di Milano. Condivisione, ascolto e aperitivo analcolico." },
];

export const AGENDA_KEY = "standup_agenda_extra";

const Home = () => {
  const [cleanDate] = useState<Date | undefined>(() => {
    const saved = localStorage.getItem("standup_clean_date");
    return saved ? new Date(saved) : undefined;
  });
  const [active, setActive] = useState<Attivita | null>(null);
  const [paywallOpen, setPaywallOpen] = useState(false);

  const cleanDays = cleanDate
    ? Math.max(0, Math.floor((Date.now() - cleanDate.getTime()) / (1000 * 60 * 60 * 24)))
    : null;

  const confirmBooking = () => {
    if (!active) return;
    try {
      const cur = JSON.parse(localStorage.getItem(AGENDA_KEY) || "[]");
      cur.push({ id: active.id, titolo: active.title, when: active.when, location: active.location,
        durationMin: active.durationMin, tipo: active.location.toLowerCase().includes("zoom") ? "online" : "sede", at: Date.now() });
      localStorage.setItem(AGENDA_KEY, JSON.stringify(cur));
    } catch {}
    toast.success("Prenotato! Lo trovi in agenda.", { description: active.title });
    setActive(null);
  };

  return (
    <div className="min-h-screen bg-surface-0 pb-24">
      <header className="bg-surface-1 border-b border-border/40 px-4 py-3 safe-area-top shadow-[var(--shadow-sm)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Heart className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-bold text-foreground">StandUp</h1>
          </div>
          <HeaderActions />
        </div>
      </header>
      <QuickAccessBar />

      <div className="px-4 py-5 space-y-5">
        {/* Welcome + Day Counter */}
        <div className="glass-card rounded-2xl p-5 space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <h2 className="text-xl font-bold text-foreground">
                {cleanDays !== null ? "Continua così! 💪" : "Bentornato 👋"}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {cleanDays !== null
                  ? "Ogni giorno conta. Sei più forte di ieri."
                  : "Il primo passo è il più coraggioso. Siamo qui con te."}
              </p>
            </div>
            {cleanDays !== null && (
              <Link
                to="/percorsi"
                className="flex flex-col items-center px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/15 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <Flame className="w-4 h-4 text-primary" />
                  <span className="text-2xl font-bold text-primary leading-none">{cleanDays}</span>
                </div>
                <span className="text-[10px] text-primary/70 font-medium">giorni</span>
              </Link>
            )}
          </div>
          {cleanDays === null && (
            <Link to="/percorsi">
              <Button variant="default" size="sm" className="w-full">
                <Flame className="w-4 h-4 mr-2" />
                Inizia il tuo contagiorni
              </Button>
            </Link>
          )}
        </div>

        {/* Free Self-Assessment CTA */}
        <Link to="/autovalutazione" className="block">
          <div className="rounded-2xl p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                <ClipboardCheck className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">GRATUITO</span>
                </div>
                <h3 className="font-semibold text-foreground text-sm mt-1">Test di autovalutazione</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Scopri dove sei e cosa può aiutarti · 3 min</p>
              </div>
              <ArrowRight className="w-5 h-5 text-primary flex-shrink-0" />
            </div>
          </div>
        </Link>

        {/* Attività imminenti — promemoria */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-foreground">Attività imminenti</h3>
              <p className="text-[11px] text-muted-foreground">Tap per dettagli · 1 min = 1 token</p>
            </div>
            <Link to="/percorso/visite" className="text-xs text-primary font-medium flex items-center gap-1">
              Agenda <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2.5">
            {ATTIVITA_IMMINENTI.map((att) => {
              const Icon = att.icon;
              return (
                <button
                  key={att.id}
                  onClick={() => setActive(att)}
                  className="w-full text-left glass-card rounded-xl p-3.5 flex items-center gap-3 hover:border-primary/30 transition-all group"
                >
                  <div className="w-11 h-11 rounded-xl bg-secondary/60 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-full ${att.tagClass}`}>
                      {att.tag}
                    </span>
                    <p className="text-sm font-semibold text-foreground mt-0.5 leading-tight">{att.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-2">
                      <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />{att.when}</span>
                      <span className="flex items-center gap-1 text-primary"><Coins className="w-3 h-3" />{att.durationMin}</span>
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary flex-shrink-0" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Access - paid services */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-foreground">Supporto professionale</h3>
          {[
            { icon: MapPin, title: "Incontri dal vivo", desc: "Nella tua città con il tuo gruppo", to: "/insede" },
          ].map((service) => (
            <Link
              key={service.title}
              to={service.to}
              className="glass-card rounded-xl p-4 flex items-center gap-3 hover:border-primary/30 transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <service.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{service.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{service.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>


        {/* Trust badges */}
        <div className="flex items-center justify-center gap-4 py-2">
          {["Detraibile", "Anonimato", "No impegno"].map((badge) => (
            <div key={badge} className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Star className="w-3 h-3 text-primary/50" />
              <span>{badge}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dialog dettaglio attività */}
      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-[360px] rounded-2xl">
          {active && (
            <>
              <DialogHeader>
                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full self-start w-fit ${active.tagClass}`}>
                  {active.tag}
                </span>
                <DialogTitle className="text-left text-base">{active.title}</DialogTitle>
                <DialogDescription className="text-left">{active.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-2 py-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarDays className="w-3.5 h-3.5" /> {active.when}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" /> {active.durationMin} minuti
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5" /> {active.location}
                </div>
                <div className="flex items-center justify-between p-3 mt-2 rounded-xl bg-primary/5 border border-primary/30">
                  <span className="text-xs font-medium text-primary">Costo (1 min = 1 token)</span>
                  <span className="text-sm font-bold text-primary flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5" /> {active.durationMin} token
                  </span>
                </div>
              </div>
              <Button onClick={() => setPaywallOpen(true)} className="w-full">
                <Check className="w-4 h-4 mr-1.5" /> Prenota con i token
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>

      {active && (
        <TokenPaywall
          open={paywallOpen}
          onOpenChange={setPaywallOpen}
          cost={active.durationMin}
          reason={`Prenotazione: ${active.title}`}
          itemLabel={`${active.title} · ${active.when}`}
          onConfirm={confirmBooking}
        />
      )}

      <BottomNav />
    </div>
  );
};

export default Home;
