import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CalendarDays, Clock, ShieldCheck, Heart, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Genera i prossimi 21 giorni lavorativi (no domenica)
const buildDays = () => {
  const days: Date[] = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 1); // parte da domani
  while (days.length < 21) {
    if (d.getDay() !== 0) days.push(new Date(d)); // salta domenica
    d.setDate(d.getDate() + 1);
  }
  return days;
};

const SLOTS = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];
const DAYS_IT = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];
const MONTHS_IT = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];

const fmt = (d: Date) => `${d.getDate()} ${MONTHS_IT[d.getMonth()]}`;
const fmtFull = (d: Date) => `${DAYS_IT[d.getDay()]} ${d.getDate()} ${MONTHS_IT[d.getMonth()]} ${d.getFullYear()}`;

const DAYS = buildDays();

const PrenotaCalendario = () => {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const handleConfirm = () => {
    if (!selectedDay || !selectedSlot) return;
    // Aggiunge data/ora ai dati funnel già in sessionStorage
    const existing = JSON.parse(sessionStorage.getItem("sw_funnel") || "{}");
    sessionStorage.setItem("sw_funnel", JSON.stringify({
      ...existing,
      data: fmtFull(selectedDay),
      ora: selectedSlot,
    }));
    navigate("/prenota/registrazione");
  };

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col safe-area-top safe-area-bottom">
      {/* Header */}
      <header className="bg-surface-1 border-b border-border/40 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full hover:bg-secondary/60 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-foreground">Scegli data e orario</h1>
            <p className="text-[11px] text-muted-foreground">Colloquio con il tuo professionista · 30 min</p>
          </div>
        </div>
        {/* Step indicator */}
        <div className="flex items-center gap-2 mt-3 max-w-lg mx-auto">
          {["Questionario", "Calendario", "Registrazione"].map((s, idx) => (
            <div key={s} className="flex items-center gap-1.5 flex-1">
              <div className={cn("w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0",
                idx === 0 ? "bg-primary/20 text-primary" :
                idx === 1 ? "bg-primary text-primary-foreground" :
                "bg-border text-muted-foreground")}>
                {idx === 0 ? "✓" : idx + 1}
              </div>
              <span className={cn("text-[10px] font-medium hidden sm:block",
                idx === 1 ? "text-primary" : "text-muted-foreground")}>{s}</span>
              {idx < 2 && <div className="flex-1 h-px bg-border/60" />}
            </div>
          ))}
        </div>
      </header>

      <div className="flex-1 px-4 py-6 pb-32 max-w-lg mx-auto w-full space-y-6">

        {/* Intro empatica */}
        <div className="rounded-2xl bg-surface-1 border border-border/40 p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Heart className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Un primo passo concreto.</p>
              <p className="text-xs text-muted-foreground">30 minuti che possono cambiare tutto.</p>
            </div>
          </div>

          <p className="text-sm text-foreground/80 leading-relaxed">
            Quello che hai condiviso nel questionario ci dà già un quadro chiaro. I nostri professionisti lavorano ogni giorno con persone che affrontano esattamente quello che stai vivendo tu — senza giudizi, con metodo clinico e piena riservatezza.
          </p>

          <p className="text-sm text-foreground/80 leading-relaxed">
            Il colloquio iniziale dura 30 minuti ed è il momento in cui costruiamo insieme una prima lettura della tua situazione. Non è un impegno definitivo: è uno spazio riservato, sicuro, in cui puoi finalmente parlare apertamente.
          </p>

          <div className="space-y-2 pt-1">
            {[
              { icon: ShieldCheck, text: "Segreto professionale garantito — quello che dici resta tra te e il professionista" },
              { icon: Video, text: "Online via video call — dal tuo spazio, quando ti senti pronto/a" },
              { icon: Heart, text: "Equipe specializzata in dipendenze da oltre 10 anni" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-2.5">
                <Icon className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          <div className="pt-1 border-t border-border/30">
            <p className="text-xs text-foreground/70 leading-relaxed">
              <span className="font-semibold text-foreground">Scegli quando.</span> Seleziona il giorno e l'orario che preferisci — ti aspettiamo.
            </p>
          </div>
        </div>

        {/* Selezione giorno */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CalendarDays className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground">Seleziona il giorno</h2>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {DAYS.map((d) => {
              const active = selectedDay?.toDateString() === d.toDateString();
              return (
                <button
                  key={d.toISOString()}
                  onClick={() => { setSelectedDay(d); setSelectedSlot(null); }}
                  className={cn(
                    "flex-shrink-0 flex flex-col items-center justify-center w-16 h-18 rounded-2xl border py-3 transition-all",
                    active
                      ? "bg-primary border-primary text-primary-foreground shadow-md"
                      : "bg-surface-1 border-border/50 text-foreground hover:border-primary/40"
                  )}
                >
                  <span className={cn("text-[10px] font-semibold", active ? "text-primary-foreground/80" : "text-muted-foreground")}>
                    {DAYS_IT[d.getDay()]}
                  </span>
                  <span className="text-lg font-bold leading-tight">{d.getDate()}</span>
                  <span className={cn("text-[10px]", active ? "text-primary-foreground/80" : "text-muted-foreground")}>
                    {MONTHS_IT[d.getMonth()]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selezione orario */}
        {selectedDay && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold text-foreground">
                Orari disponibili · {fmt(selectedDay)}
              </h2>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {SLOTS.map((slot) => {
                const active = selectedSlot === slot;
                return (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={cn(
                      "rounded-xl border py-3 text-sm font-semibold transition-all",
                      active
                        ? "bg-primary border-primary text-primary-foreground shadow-md"
                        : "bg-surface-1 border-border/50 text-foreground hover:border-primary/40"
                    )}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Riepilogo selezione */}
        {selectedDay && selectedSlot && (
          <div className="rounded-2xl bg-primary/5 border border-primary/20 p-4 space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-primary">Appuntamento selezionato</p>
            <p className="text-sm font-semibold text-foreground">
              {fmtFull(selectedDay)} alle {selectedSlot}
            </p>
            <p className="text-xs text-muted-foreground">Durata: 30 minuti · Online via video call</p>
          </div>
        )}
      </div>

      {/* CTA fissa in basso */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface-1/95 backdrop-blur border-t border-border/40 px-4 py-4 safe-area-bottom z-20">
        <div className="max-w-lg mx-auto space-y-2">
          {!selectedDay && (
            <p className="text-center text-xs text-amber-500 font-medium">
              👆 Seleziona prima un giorno
            </p>
          )}
          {selectedDay && !selectedSlot && (
            <p className="text-center text-xs text-amber-500 font-medium">
              👆 Ora scegli un orario disponibile
            </p>
          )}
          <Button
            onClick={handleConfirm}
            disabled={!selectedDay || !selectedSlot}
            className="w-full text-base font-semibold"
            size="lg"
          >
            Conferma orario <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
          <p className="text-center text-[10px] text-muted-foreground">
            Potrai modificare o cancellare gratuitamente fino a 24h prima
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrenotaCalendario;
