import { useState, useEffect, useRef } from "react";
import { usePageTracking } from "@/hooks/usePageTracking";
import { trackEvent, trackCta } from "@/lib/analytics";
import { BottomNav } from "@/components/BottomNav";
import { HeaderActions } from "@/components/HeaderActions";
import { Link } from "react-router-dom";
import {
  BookOpen, Brain, Wind, Target, Flame, ClipboardCheck,
  Play, ChevronRight, Heart, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ─── Breathing Exercise ─── */
const BreathingExercise = () => {
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState<"inspira" | "trattieni" | "espira">("inspira");
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const phases = { inspira: 4, trattieni: 4, espira: 6 };
  const phaseOrder: ("inspira" | "trattieni" | "espira")[] = ["inspira", "trattieni", "espira"];

  useEffect(() => {
    if (!active) return;
    intervalRef.current = setInterval(() => {
      setSeconds(prev => {
        const max = phases[phase];
        if (prev >= max - 1) {
          const idx = phaseOrder.indexOf(phase);
          setPhase(phaseOrder[(idx + 1) % 3]);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [active, phase]);

  const stop = () => {
    trackEvent("breathing_completed", "strumenti", { seconds_active: seconds });
    setActive(false);
    setPhase("inspira");
    setSeconds(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const circleScale = phase === "inspira" ? 1 + (seconds / phases.inspira) * 0.4
    : phase === "espira" ? 1.4 - (seconds / phases.espira) * 0.4
    : 1.4;

  const phaseLabels = { inspira: "Inspira", trattieni: "Trattieni", espira: "Espira" };
  const phaseColors = { inspira: "text-emerald-500", trattieni: "text-amber-500", espira: "text-blue-500" };

  return (
    <div id="respira" className="glass-card rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Wind className="w-5 h-5 text-emerald-500" />
        <h3 className="font-semibold text-foreground">Esercizio di respirazione</h3>
      </div>
      <p className="text-xs text-muted-foreground">Tecnica 4-4-6 per calmare ansia e stress. Segui il cerchio.</p>

      <div className="flex flex-col items-center py-4">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <div
            className={cn(
              "absolute inset-0 rounded-full bg-primary/10 border-2 border-primary/30 transition-transform duration-1000 ease-in-out",
              active && "animate-pulse-subtle"
            )}
            style={{ transform: `scale(${active ? circleScale : 1})` }}
          />
          <div className="relative text-center z-10">
            {active ? (
              <>
                <p className={cn("text-lg font-bold", phaseColors[phase])}>{phaseLabels[phase]}</p>
                <p className="text-2xl font-bold text-foreground">{phases[phase] - seconds}</p>
              </>
            ) : (
              <Wind className="w-8 h-8 text-primary/40 mx-auto" />
            )}
          </div>
        </div>
      </div>

      <Button
        onClick={active ? stop : () => { setActive(true); trackEvent("breathing_started", "strumenti"); }}
        variant={active ? "secondary" : "default"}
        className="w-full"
      >
        {active ? "Stop" : "Inizia esercizio"}
      </Button>
    </div>
  );
};

/* ─── Strumenti Page ─── */
const Strumenti = () => {
  usePageTracking("strumenti");
  const [cleanDate] = useState<Date | undefined>(() => {
    const saved = localStorage.getItem("standup_clean_date");
    return saved ? new Date(saved) : undefined;
  });

  const cleanDays = cleanDate
    ? Math.max(0, Math.floor((Date.now() - cleanDate.getTime()) / (1000 * 60 * 60 * 24)))
    : null;

  const freeTools = [
    { icon: ClipboardCheck, title: "Test di autovalutazione", desc: "Scopri dove sei e cosa può aiutarti", to: "/autovalutazione", time: "3 min", highlight: true },
    { icon: BookOpen, title: "Corsi gratuiti", desc: "Video lezioni base sul recupero", to: "/corsi", time: "2+ ore" },
    { icon: Brain, title: "Diario personale", desc: "Scrivi e rifletti ogni giorno", to: "/percorso/diario" },
    { icon: Target, title: "Obiettivi", desc: "Imposta e traccia i tuoi progressi", to: "/percorso/obiettivi" },
  ];

  return (
    <div className="min-h-screen bg-surface-0 pb-24">
      <header className="bg-surface-1 border-b border-border/40 px-4 py-3 safe-area-top shadow-[var(--shadow-sm)]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Strumenti</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Risorse gratuite per il tuo benessere</p>
          </div>
          <HeaderActions />
        </div>
      </header>

      <div className="px-4 py-5 space-y-5">
        {/* Day counter card */}
        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Flame className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Contagiorni</p>
                <p className="text-xs text-muted-foreground">
                  {cleanDays !== null ? "Continua così!" : "Imposta la tua data di inizio"}
                </p>
              </div>
            </div>
            <Link to="/percorsi" className="flex flex-col items-center px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/15 transition-colors">
              <span className="text-2xl font-bold text-primary leading-none">{cleanDays ?? "—"}</span>
              <span className="text-[10px] text-primary/70 font-medium">giorni</span>
            </Link>
          </div>
        </div>

        {/* Free tools list */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Strumenti gratuiti</h3>
          {freeTools.map((tool) => (
            <Link
              key={tool.title}
              to={tool.to}
              className={cn(
                "glass-card rounded-xl p-4 flex items-center gap-3 transition-all group",
                tool.highlight ? "border-primary/20 bg-primary/5" : "hover:border-primary/30"
              )}
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <tool.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{tool.title}</h4>
                  {tool.highlight && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-green-500/15 text-green-600 dark:text-green-400">CONSIGLIATO</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{tool.desc}</p>
                {tool.time && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground mt-1">
                    <Clock className="w-2.5 h-2.5" /> {tool.time}
                  </span>
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>

        {/* Breathing exercise */}
        <BreathingExercise />

        {/* Upgrade CTA */}
        <div className="rounded-2xl p-5 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 space-y-3 text-center">
          <Heart className="w-8 h-8 text-primary mx-auto" />
          <h3 className="font-bold text-foreground">Vuoi un supporto più strutturato?</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Esplora i percorsi intensivi con coach dedicato. Il primo colloquio è sempre gratuito.
          </p>
          <Link to="/percorsi">
            <Button className="w-full mt-2">
              Scopri i percorsi
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Strumenti;
