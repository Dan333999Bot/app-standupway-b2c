import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft, ArrowRight, ClipboardCheck, Check, Heart, BookOpen, MessageCircle, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Question {
  id: number;
  text: string;
  options: { label: string; value: number }[];
}

const questions: Question[] = [
  {
    id: 1,
    text: "Quanto spesso pensi alla sostanza o al comportamento che vuoi cambiare?",
    options: [
      { label: "Raramente", value: 1 },
      { label: "Qualche volta a settimana", value: 2 },
      { label: "Ogni giorno", value: 3 },
      { label: "Continuamente", value: 4 },
    ],
  },
  {
    id: 2,
    text: "Hai persone intorno a te che ti supportano in questo percorso?",
    options: [
      { label: "Sì, ho un buon supporto", value: 1 },
      { label: "Qualcuno, ma non abbastanza", value: 2 },
      { label: "Pochissime persone", value: 3 },
      { label: "Mi sento solo/a", value: 4 },
    ],
  },
  {
    id: 3,
    text: "Come descriveresti il tuo livello di motivazione oggi?",
    options: [
      { label: "Molto motivato/a", value: 1 },
      { label: "Abbastanza motivato/a", value: 2 },
      { label: "Altalenante", value: 3 },
      { label: "Faccio fatica", value: 4 },
    ],
  },
  {
    id: 4,
    text: "Hai già provato a smettere o cambiare in passato?",
    options: [
      { label: "È la prima volta", value: 1 },
      { label: "Una volta", value: 2 },
      { label: "Diverse volte", value: 3 },
      { label: "Molte volte", value: 4 },
    ],
  },
  {
    id: 5,
    text: "Quanto impatta sulla tua vita quotidiana (lavoro, relazioni, salute)?",
    options: [
      { label: "Poco", value: 1 },
      { label: "In parte", value: 2 },
      { label: "Molto", value: 3 },
      { label: "Completamente", value: 4 },
    ],
  },
];

type ResultLevel = "lieve" | "moderato" | "significativo";

const getResult = (score: number): { level: ResultLevel; title: string; description: string; recommendations: { icon: React.ElementType; title: string; desc: string; to: string; cta: string; highlight?: boolean }[] } => {
  if (score <= 10) {
    return {
      level: "lieve",
      title: "Hai buone risorse",
      description: "I tuoi risultati suggeriscono che hai una buona consapevolezza e risorse intorno a te. Gli strumenti gratuiti di StandUp possono aiutarti a mantenere e rafforzare il tuo percorso.",
      recommendations: [
        { icon: BookOpen, title: "Corsi gratuiti", desc: "Rafforza la tua consapevolezza con i nostri corsi base", to: "/corsi", cta: "Esplora i corsi" },
        { icon: Heart, title: "Community", desc: "Connettiti con persone che capiscono", to: "/community", cta: "Entra" },
        { icon: MessageCircle, title: "Assistente AI", desc: "Hai domande? Parla con il nostro assistente", to: "/supporto", cta: "Chatta ora" },
      ],
    };
  }
  if (score <= 15) {
    return {
      level: "moderato",
      title: "Potresti beneficiare di supporto",
      description: "I tuoi risultati suggeriscono che un po' di supporto strutturato potrebbe fare una grande differenza. Inizia con gli strumenti gratuiti e valuta un colloquio.",
      recommendations: [
        { icon: MessageCircle, title: "Colloquio gratuito", desc: "Parla con un professionista, senza impegno", to: "/supporto", cta: "Prenota gratis", highlight: true },
        { icon: BookOpen, title: "Corso: Gestire i Trigger", desc: "Tecniche pratiche per situazioni difficili", to: "/corsi", cta: "Inizia ora" },
        { icon: Route, title: "Esplora i percorsi", desc: "Scopri il percorso adatto a te", to: "/percorsi", cta: "Scopri" },
      ],
    };
  }
  return {
    level: "significativo",
    title: "Ti consigliamo supporto professionale",
    description: "I tuoi risultati suggeriscono che un percorso strutturato con un coach dedicato potrebbe aiutarti molto. Il primo colloquio è gratuito e senza impegno.",
    recommendations: [
      { icon: Route, title: "Percorso personalizzato", desc: "Con coach dedicato e supporto quotidiano", to: "/percorsi", cta: "Scopri il percorso", highlight: true },
      { icon: MessageCircle, title: "Primo colloquio gratuito", desc: "Parla con un professionista oggi", to: "/supporto", cta: "Prenota gratis", highlight: true },
      { icon: BookOpen, title: "Inizia dai corsi gratuiti", desc: "Nel frattempo, esplora i nostri contenuti", to: "/corsi", cta: "Vai ai corsi" },
    ],
  };
};

const Autovalutazione = () => {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);

  const progress = ((currentQ + (showResult ? 1 : 0)) / questions.length) * 100;
  const totalScore = Object.values(answers).reduce((sum, v) => sum + v, 0);
  const result = getResult(totalScore);

  const selectAnswer = (questionId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const goNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const goBack = () => {
    if (showResult) {
      setShowResult(false);
    } else if (currentQ > 0) {
      setCurrentQ(prev => prev - 1);
    } else {
      navigate(-1);
    }
  };

  const currentQuestion = questions[currentQ];
  const hasAnswer = answers[currentQuestion?.id] !== undefined;

  if (showResult) {
    const levelColors = {
      lieve: "text-emerald-500 bg-emerald-500/10",
      moderato: "text-amber-500 bg-amber-500/10",
      significativo: "text-primary bg-primary/10",
    };

    return (
      <div className="min-h-screen bg-surface-0 pb-24">
        <header className="bg-surface-1 border-b border-border/40 px-4 py-3 safe-area-top shadow-[var(--shadow-sm)]">
          <div className="flex items-center gap-3">
            <button onClick={goBack} className="w-9 h-9 rounded-lg bg-secondary/50 flex items-center justify-center">
              <ArrowLeft className="w-4 h-4 text-foreground" />
            </button>
            <h1 className="text-base font-semibold text-foreground">Il tuo risultato</h1>
          </div>
        </header>

        <div className="px-4 py-6 space-y-5">
          <div className="glass-card rounded-2xl p-5 text-center space-y-4">
            <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${levelColors[result.level]}`}>
              <ClipboardCheck className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">{result.title}</h2>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{result.description}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Ti consigliamo</h3>
            {result.recommendations.map((rec) => (
              <Link
                key={rec.title}
                to={rec.to}
                className={cn(
                  "glass-card rounded-xl p-4 flex items-center gap-3 transition-all",
                  rec.highlight ? "border-primary/30 bg-primary/5" : "hover:border-primary/30"
                )}
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <rec.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-foreground">{rec.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{rec.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-primary flex-shrink-0" />
              </Link>
            ))}
          </div>

          <p className="text-[10px] text-muted-foreground text-center leading-relaxed px-4">
            Questo test non sostituisce una diagnosi professionale. È uno strumento di orientamento per aiutarti a trovare le risorse più adatte a te.
          </p>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-0 pb-24 flex flex-col">
      {/* Header */}
      <header className="bg-surface-1 border-b border-border/40 px-4 py-3 safe-area-top shadow-[var(--shadow-sm)]">
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="w-9 h-9 rounded-lg bg-secondary/50 flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-base font-semibold text-foreground">Autovalutazione</h1>
            <p className="text-[10px] text-muted-foreground">Domanda {currentQ + 1} di {questions.length}</p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/15 text-green-600 dark:text-green-400">GRATUITO</span>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-surface-2">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question */}
      <div className="flex-1 px-4 py-8 flex flex-col">
        <h2 className="text-lg font-bold text-foreground leading-snug">{currentQuestion.text}</h2>

        <div className="mt-6 space-y-3 flex-1">
          {currentQuestion.options.map((option) => {
            const isSelected = answers[currentQuestion.id] === option.value;
            return (
              <button
                key={option.value}
                onClick={() => selectAnswer(currentQuestion.id, option.value)}
                className={cn(
                  "w-full text-left p-4 rounded-xl border-2 transition-all",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-[var(--shadow-sm)]"
                    : "border-border/40 bg-surface-1 hover:border-border"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0",
                    isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
                  )}>
                    {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                  </div>
                  <span className={cn(
                    "text-sm font-medium",
                    isSelected ? "text-foreground" : "text-foreground/70"
                  )}>
                    {option.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <Button
          onClick={goNext}
          disabled={!hasAnswer}
          className="w-full mt-4"
          size="lg"
        >
          {currentQ === questions.length - 1 ? "Vedi risultato" : "Avanti"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Autovalutazione;
