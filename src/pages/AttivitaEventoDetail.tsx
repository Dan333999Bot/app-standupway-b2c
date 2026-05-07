import { useParams } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { HeaderActions } from "@/components/HeaderActions";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, MapPin, Users, Ticket, ExternalLink, Heart } from "lucide-react";
import { toast } from "sonner";

interface EventoFull {
  id: string;
  tipo: "basement" | "standlab";
  title: string;
  city: string;
  address: string;
  data: string;
  ora: string;
  durata: string;
  posti: number;
  prezzo: number;          // 0 = gratis (con prenotazione obbligatoria) per utenti del percorso
  prezzoNonIscritti?: number;
  stripeUrl: string;
  descrizione: string;
  cosaInclude: string[];
}

const EVENTI: Record<string, EventoFull> = {
  "bm-mi-16": {
    id: "bm-mi-16", tipo: "basement", title: "Basement Milano",
    city: "Milano", address: "Via Tortona 15, Milano",
    data: "Sabato 16 Maggio", ora: "14:30 – 17:30", durata: "3 ore", posti: 25,
    prezzo: 0, prezzoNonIscritti: 25,
    stripeUrl: "https://buy.stripe.com/test_PLACEHOLDER_BM_MI",
    descrizione: "Pomeriggio Basement della community di Milano. Tre ore di condivisione, ascolto, esercizi pratici e un momento conviviale finale.",
    cosaInclude: ["3 ore con coach e community", "Esercizi pratici di gruppo", "Aperitivo analcolico", "Spazio sicuro e riservato"],
  },
  "bm-rm-17": {
    id: "bm-rm-17", tipo: "basement", title: "Basement Roma",
    city: "Roma", address: "Via dei Volsci 22, Roma",
    data: "Domenica 17 Maggio", ora: "15:00 – 18:00", durata: "3 ore", posti: 25,
    prezzo: 0, prezzoNonIscritti: 25,
    stripeUrl: "https://buy.stripe.com/test_PLACEHOLDER_BM_RM",
    descrizione: "Basement Roma. Pomeriggio di community, dialogo guidato e supporto reciproco.",
    cosaInclude: ["3 ore con coach e community", "Cerchio di condivisione", "Aperitivo analcolico"],
  },
  "bm-bo-23": {
    id: "bm-bo-23", tipo: "basement", title: "Basement Bologna",
    city: "Bologna", address: "Via Mascarella 7, Bologna",
    data: "Sabato 23 Maggio", ora: "15:00 – 18:00", durata: "3 ore", posti: 20,
    prezzo: 0, prezzoNonIscritti: 25,
    stripeUrl: "https://buy.stripe.com/test_PLACEHOLDER_BM_BO",
    descrizione: "Basement Bologna. Spazio della community per ritrovarsi e fare rete.",
    cosaInclude: ["3 ore con coach e community", "Cerchio di condivisione", "Aperitivo analcolico"],
  },
  "sl-mi-24": {
    id: "sl-mi-24", tipo: "standlab", title: "StandLab Milano",
    city: "Milano", address: "Spazio MIL · Via Granelli 1",
    data: "Sabato 24 Maggio", ora: "10:00 – 19:00", durata: "Giornata intera", posti: 40,
    prezzo: 39,
    stripeUrl: "https://buy.stripe.com/test_PLACEHOLDER_SL_MI",
    descrizione: "Una giornata immersiva con workshop, laboratori esperienziali e talk di professionisti del settore. Pranzo incluso.",
    cosaInclude: ["8 ore di programma", "3 workshop esperienziali", "Talk con esperti", "Pranzo leggero incluso", "Kit StandLab in omaggio"],
  },
  "sl-rm-31": {
    id: "sl-rm-31", tipo: "standlab", title: "StandLab Roma",
    city: "Roma", address: "Officine Farneto · Via dei Monti della Farnesina 77",
    data: "Sabato 31 Maggio", ora: "10:00 – 19:00", durata: "Giornata intera", posti: 40,
    prezzo: 39,
    stripeUrl: "https://buy.stripe.com/test_PLACEHOLDER_SL_RM",
    descrizione: "StandLab arriva a Roma. Una giornata di laboratori e ispirazione per chi è in cammino.",
    cosaInclude: ["8 ore di programma", "Workshop esperienziali", "Talk con esperti", "Pranzo leggero incluso"],
  },
};

const TIPO_META = {
  basement: { label: "Basement", color: "bg-primary/10 text-primary" },
  standlab: { label: "StandLab", color: "bg-amber-500/15 text-amber-700 dark:text-amber-400" },
} as const;

const AttivitaEventoDetail = () => {
  const { id } = useParams();
  const evento = id ? EVENTI[id] : null;

  if (!evento) {
    return (
      <div className="min-h-screen bg-surface-0 pb-24">
        <header className="bg-surface-1 border-b border-border/40 px-4 py-3 safe-area-top">
          <div className="flex items-center gap-3">
            <BackButton fallback="/attivita" />
            <h1 className="text-base font-semibold text-foreground">Evento non trovato</h1>
          </div>
        </header>
        <BottomNav />
      </div>
    );
  }

  const meta = TIPO_META[evento.tipo];

  return (
    <div className="min-h-screen bg-surface-0 pb-32">
      <header className="bg-surface-1 border-b border-border/40 px-4 py-3 safe-area-top shadow-[var(--shadow-sm)]">
        <div className="flex items-center gap-3">
          <BackButton fallback="/attivita" />
          <h1 className="text-base font-semibold text-foreground flex-1 truncate">{evento.title}</h1>
          <HeaderActions />
        </div>
      </header>

      <div className="px-4 py-5 space-y-5">
        <div>
          <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${meta.color}`}>{meta.label}</span>
          <h2 className="text-2xl font-bold text-foreground mt-2">{evento.title}</h2>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{evento.descrizione}</p>
        </div>

        <div className="glass-card rounded-2xl p-4 space-y-3">
          <Info icon={CalendarDays} text={evento.data} />
          <Info icon={Clock} text={`${evento.ora} · ${evento.durata}`} />
          <Info icon={MapPin} text={evento.address} />
          <Info icon={Users} text={`${evento.posti} posti totali`} />
        </div>

        <section className="space-y-2">
          <h3 className="text-sm font-bold text-foreground">Cosa include</h3>
          <ul className="space-y-1.5">
            {evento.cosaInclude.map((c) => (
              <li key={c} className="flex items-start gap-2 text-sm text-foreground/90">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Pricing */}
        <section className="glass-card rounded-2xl p-4 space-y-3">
          {evento.tipo === "basement" ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Utenti del percorso</p>
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">Gratis</p>
                </div>
                <Heart className="w-6 h-6 text-emerald-500" />
              </div>
              <p className="text-[11px] text-muted-foreground">Prenotazione obbligatoria.</p>
              <Button variant="outline" className="w-full" onClick={() => toast.success("Posto prenotato!", { description: evento.title })}>
                <Ticket className="w-4 h-4 mr-1" /> Prenota gratis (utente percorso)
              </Button>

              {evento.prezzoNonIscritti && (
                <>
                  <div className="border-t border-border/40 pt-3 flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">Non iscritti</p>
                    <p className="text-lg font-bold text-foreground">€{evento.prezzoNonIscritti}</p>
                  </div>
                  <a href={evento.stripeUrl} target="_blank" rel="noopener noreferrer"
                     className="inline-flex items-center justify-center gap-1.5 w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90">
                    Acquista ingresso <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Quota di iscrizione</p>
                <p className="text-2xl font-bold text-foreground">€{evento.prezzo}</p>
              </div>
              <a href={evento.stripeUrl} target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center justify-center gap-1.5 w-full h-11 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90">
                <Ticket className="w-4 h-4" /> Acquista biglietto
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <p className="text-[10px] text-muted-foreground text-center">Pagamento sicuro tramite Stripe</p>
            </>
          )}
        </section>
      </div>

      <BottomNav />
    </div>
  );
};

const Info = ({ icon: Icon, text }: { icon: any; text: string }) => (
  <div className="flex items-center gap-3 text-sm text-foreground">
    <Icon className="w-4 h-4 text-primary flex-shrink-0" />
    <span>{text}</span>
  </div>
);

export default AttivitaEventoDetail;
