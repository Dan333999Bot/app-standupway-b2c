import { useState } from "react";
import { usePageTracking } from "@/hooks/usePageTracking";
import { trackEvent, trackCta } from "@/lib/analytics";
import { BottomNav } from "@/components/BottomNav";
import { HeaderActions } from "@/components/HeaderActions";
import {
  Wine, Pill, Dices, Heart, ChevronRight, Syringe, Users, Leaf,
  Target, ClipboardList, Calendar, BookOpen, Flame, Settings,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const percorsi = [
  { id: "crack-cocaina", title: "Dipendenza Crack/Cocaina", description: "Percorso intensivo per uscire dalla dipendenza da crack e cocaina", icon: Pill, color: "from-red-500/30 to-red-600/20" },
  { id: "alcol", title: "Dipendenza da Alcool", description: "Supporto completo per liberarsi dalla dipendenza alcolica", icon: Wine, color: "from-purple-500/30 to-purple-600/20" },
  { id: "ludopatia", title: "Ludopatia", description: "Percorso dedicato a chi vuole uscire dal gioco d'azzardo", icon: Dices, color: "from-amber-500/30 to-amber-600/20" },
  { id: "oppiacei", title: "Oppiacei, Metadone, Fentanyl", description: "Supporto specializzato per dipendenze da oppioidi", icon: Syringe, color: "from-blue-500/30 to-blue-600/20" },
  { id: "famiglie", title: "Supporto Famiglie", description: "Per chi ha un familiare con dipendenza e vuole aiutarlo", icon: Users, color: "from-green-500/30 to-green-600/20" },
  { id: "cannabis", title: "Cannabis", description: "Percorso per liberarsi dalla dipendenza da cannabis", icon: Leaf, color: "from-emerald-500/30 to-emerald-600/20" },
  { id: "sesso-pornografia", title: "Sesso e Pornografia", description: "Percorso per liberarsi dalla dipendenza sessuale e pornografica", icon: Heart, color: "from-pink-500/30 to-pink-600/20" },
];

const quickLinks = [
  { icon: ClipboardList, label: "Report", to: "/percorso/report" },
  { icon: Calendar, label: "Agenda", to: "/percorso/visite" },
  { icon: Target, label: "Obiettivi", to: "/percorso/obiettivi" },
  { icon: BookOpen, label: "Diario", to: "/percorso/diario" },
];

const Percorsi = () => {
  usePageTracking("percorsi");
  const hasActivePercorso = true;

  const [cleanDate, setCleanDate] = useState<Date | undefined>(() => {
    const saved = localStorage.getItem("standup_clean_date");
    return saved ? new Date(saved) : undefined;
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date | undefined>(cleanDate);

  const cleanDays = cleanDate
    ? Math.max(0, Math.floor((Date.now() - cleanDate.getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  const saveCleanDate = () => {
    if (tempDate) {
      setCleanDate(tempDate);
      localStorage.setItem("standup_clean_date", tempDate.toISOString());
    }
    setShowDatePicker(false);
  };

  return (
    <div className="min-h-screen bg-surface-0 pb-24">
      <header className="bg-surface-1 border-b border-border/40 px-4 py-4 safe-area-top shadow-[var(--shadow-sm)]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Percorsi</h1>
            <p className="text-sm text-muted-foreground mt-1">Il tuo percorso e tutti i percorsi disponibili</p>
          </div>
          <HeaderActions />
        </div>
      </header>

      <div className="px-4 py-6 space-y-6 bg-surface-inset">
        {hasActivePercorso && (
          <div className="glass-card rounded-2xl p-4 border border-primary/20 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                <h2 className="text-base font-bold text-foreground">Il mio percorso</h2>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold">Attivo</span>
            </div>

            <div className="flex items-center gap-3 pb-3 border-b border-border/30">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500/30 to-red-600/20 flex items-center justify-center">
                <Heart className="w-5 h-5 text-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Cammino di libertà</p>
                <p className="text-[10px] text-muted-foreground">Iniziato il 28 Ottobre 2025</p>
              </div>
              {/* Day counter - clickable */}
              <button
                onClick={() => { setTempDate(cleanDate); setShowDatePicker(true); }}
                className="flex flex-col items-center px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/15 transition-colors relative group"
              >
                <div className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-primary" />
                  <span className="text-lg font-bold text-primary leading-none">{cleanDays}</span>
                </div>
                <span className="text-[9px] text-primary/70 font-medium">giorni</span>
                {!cleanDate && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                    <Settings className="w-2.5 h-2.5 text-primary-foreground" />
                  </div>
                )}
              </button>
            </div>

            {/* Set counter prompt if not set */}
            {!cleanDate && (
              <button
                onClick={() => { setTempDate(undefined); setShowDatePicker(true); }}
                className="w-full text-center py-2 rounded-lg border border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors"
              >
                <p className="text-xs font-medium text-primary">🔥 Imposta il tuo contagiorni</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Seleziona il giorno in cui hai iniziato il tuo percorso di pulizia</p>
              </button>
            )}

            <div className="grid grid-cols-4 gap-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="glass-card rounded-xl p-3 text-center space-y-1.5 hover:border-primary/30 transition-colors"
                >
                  <link.icon className="w-5 h-5 text-primary mx-auto" />
                  <p className="text-[10px] text-muted-foreground font-medium">{link.label}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div>
            <h2 className="text-base font-semibold text-foreground">Tutti i percorsi</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Scopri i percorsi disponibili</p>
          </div>

          {percorsi.map((percorso) => (
            <Link
              key={percorso.id}
              to={`/percorsi/${percorso.id}/questionario`}
              className="glass-card rounded-xl p-4 flex items-center gap-4 group hover:border-primary/30 transition-colors block"
              onClick={() => trackEvent("percorso_click", "percorsi", { percorso: percorso.id, title: percorso.title })}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${percorso.color} flex items-center justify-center`}>
                <percorso.icon className="w-6 h-6 text-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{percorso.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{percorso.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      {/* Day counter date picker dialog */}
      <Dialog open={showDatePicker} onOpenChange={setShowDatePicker}>
        <DialogContent className="max-w-[340px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-primary" />
              Imposta contagiorni
            </DialogTitle>
            <DialogDescription>
              Seleziona il giorno in cui hai smesso. Il contatore calcolerà i giorni da quella data.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            <CalendarComponent
              mode="single"
              selected={tempDate}
              onSelect={setTempDate}
              disabled={(date) => date > new Date()}
              className={cn("p-3 pointer-events-auto")}
            />
          </div>
          {tempDate && (
            <p className="text-center text-sm text-muted-foreground">
              Da <span className="font-medium text-foreground">{tempDate.toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}</span> sono <span className="font-bold text-primary">{Math.max(0, Math.floor((Date.now() - tempDate.getTime()) / (1000 * 60 * 60 * 24)))}</span> giorni
            </p>
          )}
          <Button onClick={saveCleanDate} disabled={!tempDate} className="w-full">
            Salva
          </Button>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default Percorsi;
