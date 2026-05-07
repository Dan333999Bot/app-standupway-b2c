import { useState, useEffect } from "react";
import { BottomNav } from "@/components/BottomNav";
import { HeaderActions } from "@/components/HeaderActions";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import {
  FileText, Download, Phone, CheckCircle2, Calendar,
} from "lucide-react";

/**
 * Pagina del preventivo dopo il primo colloquio.
 * Tipologia (6 vs 12 mesi) determinata dal questionario pre-colloquio:
 * salvata in localStorage come "standup_preventivo_tipo" = "6" | "12".
 * Default: "6".
 */
const SEGRETERIA_PHONE = "+39 351 123 4567";

const PIANI = {
  "6": {
    label: "Percorso 6 mesi",
    pdf: "/preventivi/StandUpWay_6_mesi.pdf",
    durata: "6 mesi",
    sessioni: "Colloqui settimanali individuali + sessioni di gruppo",
    highlights: [
      "Coach dedicato per tutta la durata",
      "Sessioni individuali settimanali",
      "Accesso completo alla community e agli incontri dal vivo",
      "Strumenti digitali: diario, obiettivi, contagiorni",
      "Report mensile di avanzamento",
    ],
  },
  "12": {
    label: "Percorso 12 mesi",
    pdf: "/preventivi/StandUpWay_12_mesi.pdf",
    durata: "12 mesi",
    sessioni: "Colloqui settimanali individuali + sessioni di gruppo + follow-up mensili",
    highlights: [
      "Coach dedicato per 12 mesi",
      "Sessioni individuali settimanali",
      "Accompagnamento esteso con follow-up nei mesi finali",
      "Accesso completo alla community e agli incontri dal vivo",
      "Strumenti digitali: diario, obiettivi, contagiorni",
      "Report mensile di avanzamento",
    ],
  },
} as const;

type PianoKey = keyof typeof PIANI;

const PercorsoPreventivo = () => {
  const [tipo, setTipo] = useState<PianoKey>("6");
  const [showCall, setShowCall] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("standup_preventivo_tipo");
    if (t === "6" || t === "12") setTipo(t);
  }, []);

  const piano = PIANI[tipo];

  return (
    <div className="min-h-screen bg-surface-0 pb-32">
      <header className="bg-surface-1 border-b border-border/40 px-4 py-3 safe-area-top shadow-[var(--shadow-sm)]">
        <div className="flex items-center gap-3">
          <BackButton fallback="/percorsi" />
          <div className="flex-1">
            <h1 className="text-base font-semibold text-foreground">Il tuo preventivo</h1>
            <p className="text-[10px] text-muted-foreground">Personalizzato dopo il primo colloquio</p>
          </div>
          <HeaderActions />
        </div>
      </header>

      <div className="px-4 py-5 space-y-5">
        {/* Hero */}
        <div className="rounded-2xl p-5 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border border-primary/30 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Proposta personalizzata</p>
              <h2 className="text-lg font-bold text-foreground">{piano.label}</h2>
              <p className="text-xs text-muted-foreground">Durata: {piano.durata}</p>
            </div>
          </div>
        </div>

        {/* Cosa include */}
        <section className="glass-card rounded-2xl p-4 space-y-3">
          <h3 className="text-sm font-bold text-foreground">Cosa include il tuo percorso</h3>
          <p className="text-xs text-muted-foreground">{piano.sessioni}</p>
          <ul className="space-y-2 pt-1">
            {piano.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-xs text-foreground/90">
                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* PDF */}
        <section className="glass-card rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Documento di preventivo</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Apri o scarica il PDF dettagliato con costi, modalità di pagamento e condizioni.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href={piano.pdf} target="_blank" rel="noopener noreferrer">
                <FileText className="w-3.5 h-3.5 mr-1" /> Apri PDF
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={piano.pdf} download>
                <Download className="w-3.5 h-3.5 mr-1" /> Scarica
              </a>
            </Button>
          </div>
        </section>

        {/* Cambia tipologia (demo) */}
        <section className="rounded-xl p-3 border border-dashed border-border/60 bg-secondary/30">
          <p className="text-[10px] uppercase font-bold text-muted-foreground mb-2">Demo · scegli tipologia</p>
          <div className="flex gap-2">
            {(["6", "12"] as PianoKey[]).map((k) => (
              <button
                key={k}
                onClick={() => { setTipo(k); localStorage.setItem("standup_preventivo_tipo", k); }}
                className={`flex-1 h-9 rounded-lg text-xs font-semibold border transition-all ${tipo === k ? "border-primary bg-primary/10 text-primary" : "border-border bg-surface-1 text-foreground"}`}
              >
                {PIANI[k].label}
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* CTA fissa in fondo */}
      <div className="fixed bottom-16 left-0 right-0 px-4 py-3 bg-surface-1/95 backdrop-blur border-t border-border/40 z-40">
        <Button variant="cta" size="lg" className="w-full" onClick={() => setShowCall(true)}>
          <Phone className="w-4 h-4 mr-1" />
          Contatta la segreteria e inizia il percorso
        </Button>
      </div>

      {/* Dialog numero segreteria */}
      {showCall && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setShowCall(false)}>
          <div className="w-full sm:max-w-sm bg-card border border-border rounded-t-2xl sm:rounded-2xl p-5 space-y-4 m-0 sm:m-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Segreteria StandUpWay</h3>
                <p className="text-xs text-muted-foreground">Risponde dal lunedì al venerdì, 9–19</p>
              </div>
            </div>
            <a
              href={`tel:${SEGRETERIA_PHONE.replace(/\s/g, "")}`}
              className="block text-center text-2xl font-bold text-primary tracking-wide py-3 rounded-xl bg-primary/10 hover:bg-primary/15 transition-colors"
            >
              {SEGRETERIA_PHONE}
            </a>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              Riferisci il tuo nome e che hai ricevuto il preventivo {piano.label.toLowerCase()}.
            </div>
            <Button variant="outline" className="w-full" onClick={() => setShowCall(false)}>Chiudi</Button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default PercorsoPreventivo;
