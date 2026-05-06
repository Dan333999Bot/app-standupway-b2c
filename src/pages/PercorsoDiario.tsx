import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft, BookOpen, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const entries = [
  { date: "14 Mar 2026", mood: "😊", text: "Giornata positiva. Ho gestito bene un momento di craving durante la pausa pranzo. La tecnica di respirazione funziona." },
  { date: "13 Mar 2026", mood: "😐", text: "Giornata nella media. Un po' di ansia al mattino ma la sessione di gruppo mi ha aiutato." },
  { date: "12 Mar 2026", mood: "😊", text: "Molto bene oggi! Ho parlato con mio fratello per la prima volta dopo settimane. Mi sono sentito supportato." },
  { date: "11 Mar 2026", mood: "😔", text: "Giornata difficile. Ho sentito forte il desiderio ma ho chiamato il supporto e mi hanno aiutato. Non ho ceduto." },
  { date: "10 Mar 2026", mood: "😊", text: "Completato il corso sulla mindfulness. Sento che sta facendo la differenza nella mia routine quotidiana." },
];

const PercorsoDiario = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="glass border-b border-border/50 px-4 py-4 safe-area-top">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Indietro</span>
          </button>
          <Button size="sm" className="h-8 text-xs">
            <Plus className="w-3 h-3 mr-1" />
            Nuova voce
          </Button>
        </div>
      </header>

      <div className="px-4 py-6 space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Il mio diario</h1>
        </div>

        {entries.map((entry, i) => (
          <div key={i} className="glass-card rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{entry.date}</span>
              <span className="text-lg">{entry.mood}</span>
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed">{entry.text}</p>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default PercorsoDiario;
