import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft, Target, CheckCircle2, Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const obiettivi = [
  { text: "Completare la prima settimana di pulizia", done: true },
  { text: "Partecipare a 3 sessioni di gruppo", done: true },
  { text: "Scrivere nel diario per 7 giorni consecutivi", done: true },
  { text: "Raggiungere 30 giorni di pulizia", done: true },
  { text: "Completare il corso Fondamenti del Recupero", done: true },
  { text: "Partecipare alla sessione famiglie", done: false },
  { text: "Raggiungere 60 giorni di pulizia", done: false },
  { text: "Completare il corso Gestire i Trigger", done: false },
];

const PercorsoObiettivi = () => {
  const navigate = useNavigate();
  const completed = obiettivi.filter(o => o.done).length;

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="glass border-b border-border/50 px-4 py-4 safe-area-top">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Indietro</span>
        </button>
      </header>

      <div className="px-4 py-6 space-y-5">
        <div>
          <h1 className="text-xl font-bold text-foreground">Obiettivi</h1>
          <p className="text-sm text-muted-foreground mt-1">{completed}/{obiettivi.length} completati</p>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(completed / obiettivi.length) * 100}%` }} />
        </div>

        <div className="space-y-2">
          {obiettivi.map((obj, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${obj.done ? "bg-primary/5" : "glass-card"}`}>
              {obj.done ? (
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground/40 flex-shrink-0" />
              )}
              <span className={`text-sm ${obj.done ? "text-foreground" : "text-muted-foreground"}`}>{obj.text}</span>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default PercorsoObiettivi;
