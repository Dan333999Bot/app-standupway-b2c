import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trackPage, trackEvent } from "@/lib/analytics";

const GENERE = [
  { value: "donna", label: "Donna" },
  { value: "uomo", label: "Uomo" },
  { value: "nessuna", label: "Non ho preferenze" },
];

const FIGURE = [
  {
    value: "psicologo",
    label: "Psicologo/a",
    desc: "Specializzato in dipendenze, lavora sulla componente emotiva e cognitiva",
  },
  {
    value: "educatore",
    label: "Educatore",
    desc: "Supporto pratico nel quotidiano, ricostruzione di abitudini e routine sane",
  },
  {
    value: "coach-pari",
    label: "Coach Pari",
    desc: "Ha superato una dipendenza in prima persona — capisce davvero da dentro",
  },
];

export default function PrenotaProfessionista() {
  const navigate = useNavigate();
  const [genere, setGenere] = useState<string | null>(null);
  const [figura, setFigura] = useState<string | null>(null);

  useEffect(() => { trackPage("prenota_professionista"); }, []);

  const handleConfirm = () => {
    if (!genere || !figura) return;
    trackEvent("prenota_professionista_confermato", "prenota_professionista", { genere, figura });
    const existing = JSON.parse(sessionStorage.getItem("sw_funnel") || "{}");
    sessionStorage.setItem("sw_funnel", JSON.stringify({
      ...existing,
      professionista_genere: genere,
      professionista_figura: figura,
    }));
    navigate("/prenota/calendario");
  };

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col safe-area-top safe-area-bottom">
      {/* Header */}
      <header className="bg-surface-1 border-b border-border/40 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full hover:bg-secondary/60 flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-foreground">Scegli il tuo professionista</h1>
            <p className="text-[11px] text-muted-foreground">Con chi preferisci parlare?</p>
          </div>
        </div>
        {/* Step indicator */}
        <div className="flex items-center gap-1.5 mt-3 max-w-lg mx-auto">
          {["Questionario", "Risultato", "Professionista", "Calendario", "Pagamento"].map((s, idx) => (
            <div key={s} className="flex items-center gap-1 flex-1">
              <div className={cn("w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0",
                idx < 2 ? "bg-primary/20 text-primary" :
                idx === 2 ? "bg-primary text-primary-foreground" :
                "bg-border text-muted-foreground")}>
                {idx < 2 ? "✓" : idx + 1}
              </div>
              {idx < 4 && <div className="flex-1 h-px bg-border/60" />}
            </div>
          ))}
        </div>
      </header>

      <div className="flex-1 px-4 py-6 pb-36 max-w-lg mx-auto w-full space-y-6">

        {/* Genere */}
        <div className="space-y-3">
          <p className="text-sm font-bold text-foreground">Preferenza di genere</p>
          <div className="grid grid-cols-3 gap-2">
            {GENERE.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setGenere(value)}
                className={cn(
                  "py-3 px-2 rounded-xl border text-sm font-semibold transition-all text-center",
                  genere === value
                    ? "bg-primary border-primary text-primary-foreground shadow-md"
                    : "bg-surface-1 border-border/50 text-foreground hover:border-primary/40"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Figura professionale */}
        <div className="space-y-3">
          <p className="text-sm font-bold text-foreground">Figura professionale</p>
          <div className="space-y-2">
            {FIGURE.map(({ value, label, desc }) => (
              <button
                key={value}
                onClick={() => setFigura(value)}
                className={cn(
                  "w-full text-left p-4 rounded-2xl border transition-all space-y-1",
                  figura === value
                    ? "bg-primary/5 border-primary shadow-sm"
                    : "bg-surface-1 border-border/50 hover:border-primary/40"
                )}
              >
                <div className="flex items-center justify-between">
                  <p className={cn("text-sm font-bold", figura === value ? "text-primary" : "text-foreground")}>
                    {label}
                  </p>
                  {figura === value && <UserCheck className="w-4 h-4 text-primary" />}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="rounded-2xl bg-primary/5 border border-primary/20 p-4">
          <p className="text-xs text-foreground/70 leading-relaxed">
            La scelta è una preferenza, non una garanzia assoluta di disponibilità. Ti abbineremo al professionista più adatto in base alle tue indicazioni.
          </p>
        </div>

      </div>

      {/* CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface-1/95 backdrop-blur border-t border-border/40 px-4 py-4 safe-area-bottom z-20">
        <div className="max-w-lg mx-auto space-y-2">
          {(!genere || !figura) && (
            <p className="text-center text-xs text-amber-500 font-medium">
              👆 Seleziona genere e figura professionale
            </p>
          )}
          <Button onClick={handleConfirm} disabled={!genere || !figura} className="w-full text-base font-semibold" size="lg">
            Scegli data e orario <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
