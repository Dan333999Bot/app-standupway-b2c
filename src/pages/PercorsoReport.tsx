import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft, TrendingUp, Calendar, BarChart3, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PercorsoReport = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="glass border-b border-border/50 px-4 py-4 safe-area-top">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Indietro</span>
        </button>
      </header>

      <div className="px-4 py-6 space-y-4">
        <h1 className="text-xl font-bold text-foreground">Report del percorso</h1>
        <p className="text-sm text-muted-foreground">Riepilogo del tuo andamento</p>

        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card rounded-xl p-4">
            <TrendingUp className="w-5 h-5 text-primary mb-2" />
            <p className="text-2xl font-bold text-foreground">78%</p>
            <p className="text-xs text-muted-foreground">Partecipazione</p>
          </div>
          <div className="glass-card rounded-xl p-4">
            <Calendar className="w-5 h-5 text-primary mb-2" />
            <p className="text-2xl font-bold text-foreground">47</p>
            <p className="text-xs text-muted-foreground">Giorni attivi</p>
          </div>
          <div className="glass-card rounded-xl p-4">
            <BarChart3 className="w-5 h-5 text-green-500 mb-2" />
            <p className="text-2xl font-bold text-foreground">12</p>
            <p className="text-xs text-muted-foreground">Sessioni completate</p>
          </div>
          <div className="glass-card rounded-xl p-4">
            <CheckCircle2 className="w-5 h-5 text-green-500 mb-2" />
            <p className="text-2xl font-bold text-foreground">5/8</p>
            <p className="text-xs text-muted-foreground">Obiettivi raggiunti</p>
          </div>
        </div>

        <div className="glass-card rounded-xl p-4 space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Andamento settimanale</h2>
          <div className="flex items-end gap-1.5 h-24">
            {[60, 75, 80, 70, 90, 85, 78].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-primary/20 rounded-t" style={{ height: `${val}%` }}>
                  <div className="w-full h-full bg-primary rounded-t" style={{ height: `${val}%` }} />
                </div>
                <span className="text-[9px] text-muted-foreground">{["L", "M", "M", "G", "V", "S", "D"][i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-xl p-4 space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Ultime attività</h2>
          {[
            { name: "Gruppo DBT", date: "12 Mar", done: true },
            { name: "Colloquio individuale", date: "11 Mar", done: true },
            { name: "Gruppo Routine", date: "10 Mar", done: true },
            { name: "Sessione Mindfulness", date: "9 Mar", done: false },
          ].map((a, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 border-b border-border/20 last:border-0">
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`w-3.5 h-3.5 ${a.done ? "text-green-500" : "text-muted-foreground/30"}`} />
                <span className="text-sm text-foreground">{a.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">{a.date}</span>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default PercorsoReport;
