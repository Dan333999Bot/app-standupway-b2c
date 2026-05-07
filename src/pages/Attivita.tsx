import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { HeaderActions } from "@/components/HeaderActions";
import { BackButton } from "@/components/BackButton";
import {
  Play, Clock, BookOpen, Users, HeartHandshake, ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

type CorsoTarget = "utenti" | "familiari";

interface Corso {
  id: string; title: string; target: CorsoTarget; problema: string; descrizione: string;
  duration: string; lessons: number; price: string; stripeUrl: string; image: string;
}

const CORSI: Corso[] = [
  { id: "fondamenti-recupero", title: "Fondamenti del Recupero", target: "utenti",
    problema: "Non sai da dove iniziare e ti senti sopraffatto.",
    descrizione: "Le basi per costruire il tuo percorso: come funziona la dipendenza, cosa aspettarti nei primi 90 giorni, e come prepararti mentalmente al cambiamento.",
    duration: "2h 30min", lessons: 8, price: "39€",
    stripeUrl: "https://buy.stripe.com/test_PLACEHOLDER_FONDAMENTI",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=70" },
  { id: "gestire-trigger", title: "Gestire i Trigger", target: "utenti",
    problema: "Le ricadute arrivano nei momenti meno attesi.",
    descrizione: "Riconoscere i trigger emotivi, situazionali e ambientali. Tecniche pratiche di interruzione e sostituzione del comportamento.",
    duration: "1h 45min", lessons: 6, price: "29€",
    stripeUrl: "https://buy.stripe.com/test_PLACEHOLDER_TRIGGER",
    image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=70" },
  { id: "prevenzione-ricadute", title: "Prevenzione delle Ricadute", target: "utenti",
    problema: "Hai paura di tornare indietro dopo un periodo di pulizia.",
    descrizione: "Mappa dei segnali precoci, piano d'emergenza personale e rete di supporto: tutto ciò che serve per consolidare il cambiamento.",
    duration: "2h 30min", lessons: 9, price: "39€",
    stripeUrl: "https://buy.stripe.com/test_PLACEHOLDER_RICADUTE",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=70" },
  { id: "familiari-comunicazione", title: "Comunicare con chi soffre di dipendenza", target: "familiari",
    problema: "Ogni conversazione finisce in un litigio.",
    descrizione: "Come parlare senza giudicare, porre limiti sani e creare uno spazio di ascolto che apra (invece di chiudere) il dialogo.",
    duration: "2h 00min", lessons: 7, price: "35€",
    stripeUrl: "https://buy.stripe.com/test_PLACEHOLDER_FAM_COM",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=70" },
  { id: "familiari-codipendenza", title: "Riconoscere la codipendenza", target: "familiari",
    problema: "Senti di vivere la dipendenza al posto suo, e ti stai esaurendo.",
    descrizione: "Come distinguere amore, controllo e codipendenza. Strumenti per prendersi cura di sé senza sentirsi in colpa.",
    duration: "1h 50min", lessons: 7, price: "35€",
    stripeUrl: "https://buy.stripe.com/test_PLACEHOLDER_FAM_CODIP",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=70" },
  { id: "familiari-supporto", title: "Sostenere chi inizia un percorso", target: "familiari",
    problema: "Tuo figlio/partner ha iniziato il percorso e tu non sai cosa fare.",
    descrizione: "Cosa serve davvero a chi inizia (e cosa no). Come accompagnare senza sostituirsi, come gestire le ricadute.",
    duration: "1h 30min", lessons: 6, price: "29€",
    stripeUrl: "https://buy.stripe.com/test_PLACEHOLDER_FAM_SUPP",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=70" },
];

const Attivita = () => {
  const [target, setTarget] = useState<"tutti" | CorsoTarget>("tutti");
  const corsi = CORSI.filter((c) => target === "tutti" || c.target === target);

  return (
    <div className="min-h-screen bg-surface-0 pb-24">
      <header className="sticky top-0 z-30 bg-surface-1/95 backdrop-blur border-b border-border/40 safe-area-top shadow-[var(--shadow-sm)]">
        <div className="px-4 py-3 flex items-center gap-3">
          <BackButton />
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground leading-none">Corsi on-demand</h1>
            <p className="text-[10px] text-muted-foreground mt-0.5">Per utenti e familiari</p>
          </div>
          <HeaderActions />
        </div>
      </header>

      <div className="px-4 py-4 space-y-4">
        <div className="rounded-xl p-3 border-l-2 border-primary/50 bg-surface-2">
          <p className="text-xs text-muted-foreground">
            Corsi video da seguire al tuo ritmo. Pagamento sicuro con carta.
          </p>
        </div>

        <div className="flex gap-2">
          {([
            { key: "tutti", label: "Tutti", icon: BookOpen },
            { key: "utenti", label: "Per utenti", icon: Users },
            { key: "familiari", label: "Per familiari", icon: HeartHandshake },
          ] as const).map((t) => {
            const Icon = t.icon;
            const active = target === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTarget(t.key as any)}
                className={cn(
                  "flex items-center gap-1.5 h-8 px-3 rounded-full border text-xs font-semibold transition-all",
                  active ? "bg-foreground text-background border-foreground" : "bg-surface-1 text-foreground border-border hover:border-foreground/30"
                )}
              >
                <Icon className="w-3.5 h-3.5" /> {t.label}
              </button>
            );
          })}
        </div>

        <div className="grid gap-3">
          {corsi.map((corso) => (
            <article key={corso.id} className="glass-card rounded-2xl overflow-hidden">
              <div className="relative h-32">
                <img src={corso.image} alt={corso.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />
                <div className="absolute top-2 left-2">
                  <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full",
                    corso.target === "utenti" ? "bg-primary/90 text-primary-foreground" : "bg-amber-500/90 text-white")}>
                    {corso.target === "utenti" ? "Per utenti" : "Per familiari"}
                  </span>
                </div>
                <div className="absolute top-2 right-2 bg-background/85 rounded-full p-1.5">
                  <Play className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="absolute bottom-2 left-3 right-3">
                  <h3 className="font-bold text-foreground text-sm leading-tight">{corso.title}</h3>
                </div>
              </div>
              <div className="p-3 space-y-2.5">
                <p className="text-[11px] uppercase tracking-wider font-bold text-primary">Risolve: <span className="normal-case font-medium text-foreground/80 tracking-normal">{corso.problema}</span></p>
                <p className="text-xs text-muted-foreground leading-relaxed">{corso.descrizione}</p>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-border/30">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{corso.duration}</span>
                    <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{corso.lessons} lezioni</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">{corso.price}</span>
                </div>
                <a
                  href={corso.stripeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  Acquista ora <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Attivita;
