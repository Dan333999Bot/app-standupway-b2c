import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft, Clock, BookOpen, Play, Lock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const corsiOnDemand: Record<string, { title: string; description: string; duration: string; lessons: number; image: string; free: boolean }> = {
  "1": { title: "Fondamenti del Recupero", description: "Le basi per iniziare il tuo percorso di cambiamento", duration: "2h 30min", lessons: 8, free: true, image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=400&fit=crop" },
  "2": { title: "Capire la Dipendenza", description: "Cos'è la dipendenza e come funziona il cervello", duration: "1h 20min", lessons: 5, free: true, image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=400&fit=crop" },
};

const lezioniCorso = [
  { id: 1, title: "Benvenuto al corso", duration: "5 min", completed: true },
  { id: 2, title: "Cos'è il recupero?", duration: "15 min", completed: true },
  { id: 3, title: "Il primo passo: accettare", duration: "20 min", completed: false },
  { id: 4, title: "Costruire una routine", duration: "18 min", completed: false },
  { id: 5, title: "I tuoi alleati nel percorso", duration: "22 min", completed: false },
  { id: 6, title: "Gestire i momenti difficili", duration: "25 min", completed: false },
  { id: 7, title: "La forza del gruppo", duration: "15 min", completed: false },
  { id: 8, title: "Conclusioni e prossimi passi", duration: "10 min", completed: false },
];

const CorsoDetail = () => {
  const { id } = useParams();
  const corso = corsiOnDemand[id || "1"];
  const [playingLesson, setPlayingLesson] = useState<number | null>(null);

  if (!corso) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Corso non trovato</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="glass border-b border-border/50 px-4 py-4 safe-area-top">
        <div className="flex items-center gap-3">
          <Link to="/attivita" className="w-9 h-9 rounded-lg bg-secondary/50 flex items-center justify-center hover:bg-secondary transition-colors">
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          </Link>
          <h1 className="text-lg font-bold text-foreground truncate">{corso.title}</h1>
        </div>
      </header>

      <div className="space-y-4">
        {/* Video player area */}
        <div className="relative w-full aspect-video bg-black">
          <img src={corso.image} alt={corso.title} className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 flex items-center justify-center">
            {playingLesson ? (
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center animate-pulse">
                  <Play className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs text-white/80">In riproduzione...</p>
                <p className="text-sm font-medium text-white">{lezioniCorso.find(l => l.id === playingLesson)?.title}</p>
              </div>
            ) : (
              <button
                onClick={() => setPlayingLesson(1)}
                className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center hover:bg-primary transition-colors shadow-lg"
              >
                <Play className="w-7 h-7 text-primary-foreground ml-1" />
              </button>
            )}
          </div>
        </div>

        <div className="px-4 space-y-4">
          {/* Info */}
          <div>
            <h2 className="text-base font-bold text-foreground">{corso.title}</h2>
            <p className="text-xs text-muted-foreground mt-1">{corso.description}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{corso.duration}</span>
              <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{corso.lessons} lezioni</span>
            </div>
          </div>

          {/* Lesson list */}
          <div className="space-y-1.5">
            <h3 className="text-sm font-semibold text-foreground">Lezioni</h3>
            {lezioniCorso.slice(0, corso.lessons).map((lez) => (
              <button
                key={lez.id}
                onClick={() => setPlayingLesson(lez.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                  playingLesson === lez.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  lez.completed ? "bg-green-400/10" : playingLesson === lez.id ? "bg-primary/10" : "bg-secondary/50"
                }`}>
                  {lez.completed ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Play className="w-3.5 h-3.5 text-primary ml-0.5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${playingLesson === lez.id ? "font-semibold text-primary" : "text-foreground"}`}>{lez.title}</p>
                  <p className="text-[10px] text-muted-foreground">{lez.duration}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default CorsoDetail;
