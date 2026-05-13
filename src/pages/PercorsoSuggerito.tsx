import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, ChevronRight, Wine, Pill, Dices, Heart, Syringe, Users, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trackPage, trackEvent } from "@/lib/analyticsV2";

const LEVEL_CONFIG = {
  basso: { label: "Lieve",    color: "#10b981", bg: "bg-emerald-500/10", border: "border-emerald-500/30", pct: 25 },
  medio: { label: "Moderato", color: "#f59e0b", bg: "bg-amber-500/10",   border: "border-amber-500/30",   pct: 60 },
  alto:  { label: "Elevato",  color: "#ef4444", bg: "bg-red-500/10",     border: "border-red-500/30",     pct: 88 },
};

const ADDICTION_LABEL: Record<string, string> = {
  alcol: "Alcol", "crack-cocaina": "Crack / Cocaina", ludopatia: "Ludopatia",
  oppiacei: "Oppiacei / Metadone", cannabis: "Cannabis",
  "sesso-pornografia": "Sesso e Pornografia", famiglie: "Supporto Famiglie",
};

const PERCORSI = [
  { id: "crack-cocaina",    title: "Crack / Cocaina",            icon: Pill,    color: "from-red-500/30 to-red-600/20" },
  { id: "alcol",            title: "Alcol",                      icon: Wine,    color: "from-purple-500/30 to-purple-600/20" },
  { id: "ludopatia",        title: "Ludopatia",                  icon: Dices,   color: "from-amber-500/30 to-amber-600/20" },
  { id: "oppiacei",         title: "Oppiacei / Metadone",        icon: Syringe, color: "from-blue-500/30 to-blue-600/20" },
  { id: "famiglie",         title: "Supporto Famiglie",          icon: Users,   color: "from-green-500/30 to-green-600/20" },
  { id: "cannabis",         title: "Cannabis",                   icon: Leaf,    color: "from-emerald-500/30 to-emerald-600/20" },
  { id: "sesso-pornografia",title: "Sesso e Pornografia",        icon: Heart,   color: "from-pink-500/30 to-pink-600/20" },
];

export default function PercorsoSuggerito() {
  const navigate = useNavigate();

  const v2Result = (() => {
    try { return JSON.parse(localStorage.getItem("sw_v2_result") || "null"); }
    catch { return null; }
  })();

  const dipendenza: string = v2Result?.dipendenza || "";
  const score: number = v2Result?.score ?? 0;
  const level: "basso" | "medio" | "alto" = v2Result?.level || "medio";
  const lvl = LEVEL_CONFIG[level];

  useEffect(() => {
    trackPage("percorso_suggerito", { dipendenza, level });
  }, []);

  const handlePercorso = (percorsoId: string, isSuggested: boolean) => {
    trackEvent("suggerito_percorso_click", "percorso_suggerito", { percorso: percorsoId, suggested: isSuggested });
    navigate(`/v2/${percorsoId}/questionario`);
  };

  if (!v2Result) {
    return (
      <div className="min-h-screen bg-surface-0 flex flex-col items-center justify-center px-4 text-center gap-4 pb-24">
        <p className="text-sm text-muted-foreground">Nessun percorso suggerito disponibile.</p>
        <Button onClick={() => navigate("/v2")}>Fai il test</Button>
      </div>
    );
  }

  const others = PERCORSI.filter((p) => p.id !== dipendenza);
  const suggested = PERCORSI.find((p) => p.id === dipendenza);

  return (
    <div className="min-h-screen bg-surface-0 pb-24">
      {/* Header */}
      <header className="bg-surface-1 border-b border-border/40 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-lg mx-auto">
          <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-0.5">Il tuo percorso</p>
          <h1 className="text-base font-bold text-foreground">Percorso Suggerito</h1>
        </div>
      </header>

      <div className="px-4 py-5 max-w-lg mx-auto space-y-5">

        {/* Result card */}
        <div className={cn("rounded-2xl border-2 p-5 space-y-4", lvl.bg, lvl.border)}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Risultato del tuo test</p>
              <p className="text-2xl font-black" style={{ color: lvl.color }}>{lvl.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {ADDICTION_LABEL[dipendenza] || dipendenza}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-foreground">{score}</p>
              <p className="text-[10px] text-muted-foreground">punti</p>
            </div>
          </div>
          <div className="w-full h-2.5 bg-border/40 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${lvl.pct}%`, background: lvl.color }} />
          </div>
          <div className="flex items-start gap-2 bg-background/60 rounded-xl p-3">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Analisi basata sulle tue risposte. Non sostituisce una diagnosi clinica.
            </p>
          </div>
        </div>

        {/* Suggested percorso CTA */}
        {suggested && (
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">Percorso consigliato</p>
            <button
              onClick={() => handlePercorso(suggested.id, true)}
              className="w-full glass-card rounded-xl p-4 flex items-center gap-4 group hover:border-primary/40 transition-colors text-left border-2 border-primary/20"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${suggested.color} flex items-center justify-center flex-shrink-0`}>
                <suggested.icon className="w-6 h-6 text-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-foreground">{suggested.title}</p>
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">Consigliato per te</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Inizia il questionario per questo percorso</p>
              </div>
              <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
            </button>
          </div>
        )}

        {/* Altri percorsi */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">Altri percorsi disponibili</p>
          <div className="space-y-2">
            {others.map((p) => (
              <button
                key={p.id}
                onClick={() => handlePercorso(p.id, false)}
                className="w-full glass-card rounded-xl p-3.5 flex items-center gap-3 group hover:border-primary/30 transition-colors text-left"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center flex-shrink-0`}>
                  <p.icon className="w-5 h-5 text-foreground" />
                </div>
                <p className="flex-1 text-sm font-medium text-foreground">{p.title}</p>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
