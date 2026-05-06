import { useEffect, useMemo, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { trackFunnel, trackCta, trackEvent } from "@/lib/analytics";
import { ArrowLeft, ArrowRight, Heart, Phone, Sparkles, Wind, BookOpen, Users, Home as HomeIcon, Clock, ShieldCheck, Lock, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PreferenzeProfessionista, type Preferenze } from "@/components/PreferenzeProfessionista";
import { cn } from "@/lib/utils";

type Step =
  | { kind: "question"; id: string; title: string; subtitle?: string; options: { label: string; weight: number }[] }
  | { kind: "feedback"; title: string; body: string; emoji: string };

const COMMON_TAIL: Step[] = [
  { kind: "feedback", emoji: "🔒", title: "Privacy al primo posto, sempre.",
    body: "Quello che condividi è coperto da segreto professionale. Nessuna informazione viene venduta, condivisa o associata al tuo nome. Nessuna vergogna qui — solo cura." },
  { kind: "feedback", emoji: "🤝", title: "Sei in un posto sicuro", body: "Quello che hai condiviso resta tra te e noi. Nessun giudizio, solo ascolto." },
  { kind: "question", id: "support", title: "Hai qualcuno con cui ne parli apertamente?", options: [
    { label: "Sì, una persona di fiducia", weight: 0 },
    { label: "Solo a tratti", weight: 1 },
    { label: "No, lo tengo per me", weight: 2 },
  ]},
  { kind: "question", id: "moments", title: "Quando senti di perdere il controllo più spesso?", options: [
    { label: "La sera o di notte", weight: 1 },
    { label: "Nei momenti di stress", weight: 2 },
    { label: "Quando sono solo/a", weight: 2 },
    { label: "In modo casuale, senza schema", weight: 3 },
  ]},
  { kind: "question", id: "sleep", title: "Come stai dormendo nelle ultime settimane?", options: [
    { label: "Bene, dormo regolarmente", weight: 0 },
    { label: "Faccio fatica ad addormentarmi", weight: 2 },
    { label: "Mi sveglio spesso o dormo pochissimo", weight: 3 },
  ]},
  { kind: "question", id: "mood", title: "Negli ultimi 15 giorni, come ti sei sentito/a dentro?", options: [
    { label: "Sostanzialmente bene", weight: 0 },
    { label: "Spesso giù, ma riesco a reagire", weight: 2 },
    { label: "Vuoto/a, demotivato/a o in ansia costante", weight: 3 },
  ]},
  { kind: "question", id: "health", title: "Stai prendendo farmaci o hai diagnosi mediche in corso?", options: [
    { label: "No, niente di rilevante", weight: 0 },
    { label: "Sì, condizioni gestite", weight: 1 },
    { label: "Sì, situazione complessa", weight: 2 },
  ]},
  { kind: "feedback", emoji: "💛", title: "Stai facendo qualcosa di importante", body: "Rispondere a queste domande con onestà richiede coraggio. È già un primo passo concreto." },
  { kind: "question", id: "tried", title: "Hai già provato a fermarti da solo/a?", options: [
    { label: "No, è la prima volta che ci penso", weight: 1 },
    { label: "Sì, qualche volta senza riuscirci", weight: 2 },
    { label: "Tante volte, ma ricado sempre", weight: 3 },
  ]},
  { kind: "question", id: "trigger_env", title: "Nel tuo ambiente attuale (casa, lavoro, amici) ti senti supportato/a?", options: [
    { label: "Sì, ho persone vicine", weight: 0 },
    { label: "In parte, ma è complicato", weight: 2 },
    { label: "No, è proprio l'ambiente il problema", weight: 3 },
  ]},
  { kind: "question", id: "ready", title: "Quanto ti senti pronto/a a ricevere supporto adesso?", options: [
    { label: "Voglio iniziare subito", weight: 3 },
    { label: "Vorrei capire meglio prima", weight: 2 },
    { label: "Mi sto solo informando", weight: 1 },
  ]},
];

const SPECIFIC: Record<string, Step[]> = {
  "crack-cocaina": [
    { kind: "feedback", emoji: "🌬️", title: "Respira. Sei qui ed è già tanto.", body: "La dipendenza da crack e cocaina ha effetti potenti sul cervello. Capirla è il primo modo per riprendersi il controllo." },
    { kind: "question", id: "frequency", title: "Da quanto tempo usi con regolarità?", options: [
      { label: "Da poche settimane", weight: 1 },
      { label: "Da qualche mese", weight: 2 },
      { label: "Da più di un anno", weight: 3 },
    ]},
    { kind: "question", id: "amount", title: "Quanto incide sul tuo budget settimanale?", options: [
      { label: "Poco, occasionale", weight: 1 },
      { label: "In modo significativo", weight: 2 },
      { label: "Sto facendo debiti per usare", weight: 3 },
    ]},
    { kind: "question", id: "body", title: "Hai notato sintomi fisici quando smetti?", options: [
      { label: "No, niente di rilevante", weight: 1 },
      { label: "Insonnia, ansia, irritabilità", weight: 2 },
      { label: "Forte craving e malessere", weight: 3 },
    ]},
  ],
  "alcol": [
    { kind: "feedback", emoji: "🌿", title: "L'alcol è subdolo: sei nel posto giusto.", body: "È la dipendenza più normalizzata, e proprio per questo la più difficile da riconoscere. Bravo/a a esserti fermato/a a guardare." },
    { kind: "question", id: "frequency", title: "Quanto bevi in una settimana tipo?", options: [
      { label: "Solo nei weekend", weight: 1 },
      { label: "Quasi tutti i giorni", weight: 2 },
      { label: "Più volte al giorno", weight: 3 },
    ]},
    { kind: "question", id: "trigger", title: "Bevi anche da solo/a?", options: [
      { label: "No, solo in compagnia", weight: 0 },
      { label: "A volte", weight: 2 },
      { label: "Sì, è la mia normalità", weight: 3 },
    ]},
    { kind: "question", id: "memory", title: "Ti capita di non ricordare cose successe?", options: [
      { label: "Mai", weight: 0 },
      { label: "Qualche volta", weight: 2 },
      { label: "Spesso", weight: 3 },
    ]},
  ],
  "ludopatia": [
    { kind: "feedback", emoji: "🎯", title: "Il gioco mente. Tu no.", body: "La ludopatia non si vede sul corpo, ma erode tutto: soldi, fiducia, relazioni. Riconoscerla è già metà del lavoro." },
    { kind: "question", id: "frequency", title: "Quante volte giochi in una settimana?", options: [
      { label: "Una o due", weight: 1 },
      { label: "Quasi tutti i giorni", weight: 2 },
      { label: "Più volte al giorno", weight: 3 },
    ]},
    { kind: "question", id: "money", title: "Hai chiesto soldi in prestito per giocare?", options: [
      { label: "Mai", weight: 0 },
      { label: "Una o due volte", weight: 2 },
      { label: "Sì, ho debiti", weight: 3 },
    ]},
    { kind: "question", id: "lies", title: "Nascondi alle persone care quanto giochi?", options: [
      { label: "No", weight: 0 },
      { label: "In parte", weight: 2 },
      { label: "Sempre", weight: 3 },
    ]},
  ],
  "oppiacei": [
    { kind: "feedback", emoji: "💊", title: "Non sei solo/a in questo.", body: "Gli oppiacei creano una dipendenza fisica reale. Smettere richiede supporto medico — è normale, non una sconfitta." },
    { kind: "question", id: "type", title: "Cosa stai usando principalmente?", options: [
      { label: "Antidolorifici prescritti", weight: 1 },
      { label: "Metadone / buprenorfina", weight: 2 },
      { label: "Eroina / fentanyl / da strada", weight: 3 },
    ]},
    { kind: "question", id: "body", title: "Hai sintomi di astinenza quando salti una dose?", options: [
      { label: "Lievi", weight: 1 },
      { label: "Forti, mi bloccano", weight: 3 },
    ]},
    { kind: "question", id: "duration", title: "Da quanto duri questa situazione?", options: [
      { label: "Meno di 6 mesi", weight: 1 },
      { label: "1-3 anni", weight: 2 },
      { label: "Più di 3 anni", weight: 3 },
    ]},
  ],
  "famiglie": [
    { kind: "feedback", emoji: "🤲", title: "Vedere chi ami soffrire è una ferita propria.", body: "Spesso chi sta accanto a una persona con dipendenza si dimentica di sé. Qui pensiamo anche a te." },
    { kind: "question", id: "rel", title: "Chi è la persona di cui ti preoccupi?", options: [
      { label: "Un figlio/a", weight: 2 },
      { label: "Partner o coniuge", weight: 2 },
      { label: "Genitore o fratello", weight: 1 },
    ]},
    { kind: "question", id: "duration", title: "Da quanto tempo va avanti?", options: [
      { label: "Mesi", weight: 1 },
      { label: "Anni", weight: 2 },
      { label: "Tutta la vita che ricordo", weight: 3 },
    ]},
    { kind: "question", id: "you", title: "Come stai tu in questo momento?", options: [
      { label: "Stanco/a ma reggo", weight: 1 },
      { label: "Sopraffatto/a", weight: 2 },
      { label: "Non dormo, ho perso me stesso/a", weight: 3 },
    ]},
  ],
  "cannabis": [
    { kind: "feedback", emoji: "🌱", title: "Anche se 'sembra niente', conta come ti senti tu.", body: "La cannabis viene minimizzata, ma può togliere energia, motivazione e presenza. Se ti pesa, è abbastanza per parlarne." },
    { kind: "question", id: "frequency", title: "Quanto spesso fumi?", options: [
      { label: "Saltuariamente", weight: 1 },
      { label: "Tutte le sere", weight: 2 },
      { label: "Tutto il giorno", weight: 3 },
    ]},
    { kind: "question", id: "morning", title: "Fumi appena sveglio/a?", options: [
      { label: "Mai", weight: 0 },
      { label: "Spesso", weight: 2 },
      { label: "Sempre", weight: 3 },
    ]},
    { kind: "question", id: "impact", title: "Sta influenzando studio, lavoro o relazioni?", options: [
      { label: "Per niente", weight: 0 },
      { label: "Un po'", weight: 2 },
      { label: "Molto", weight: 3 },
    ]},
  ],
  "sesso-pornografia": [
    { kind: "feedback", emoji: "🫂", title: "Spazio sicuro, zero giudizio.", body: "Parlarne è già rivoluzionario. Quello che condividi qui resta riservato." },
    { kind: "question", id: "frequency", title: "Quanto tempo al giorno ci dedichi?", options: [
      { label: "Meno di 30 minuti", weight: 1 },
      { label: "1-3 ore", weight: 2 },
      { label: "Più di 3 ore", weight: 3 },
    ]},
    { kind: "question", id: "control", title: "Hai provato a smettere senza riuscirci?", options: [
      { label: "Mai provato", weight: 1 },
      { label: "Sì, qualche volta", weight: 2 },
      { label: "Molte volte", weight: 3 },
    ]},
    { kind: "question", id: "impact", title: "Sta condizionando la tua vita reale?", options: [
      { label: "No", weight: 0 },
      { label: "Sì, le relazioni", weight: 2 },
      { label: "Sì, anche lavoro/studio", weight: 3 },
    ]},
  ],
};

const TITLES: Record<string, string> = {
  "crack-cocaina": "Crack / Cocaina",
  "alcol": "Alcool",
  "ludopatia": "Gioco d'azzardo",
  "oppiacei": "Oppiacei",
  "famiglie": "Familiari",
  "cannabis": "Cannabis",
  "sesso-pornografia": "Sesso e pornografia",
};

const PercorsoQuestionario = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const steps = useMemo<Step[]>(() => {
    const intro: Step = {
      kind: "feedback",
      emoji: "👋",
      title: "Ciao, grazie per esserti fermato/a.",
      body: "Faremo un breve percorso insieme di poche domande. Non c'è una risposta giusta — vogliamo solo capirti meglio per consigliarti la cosa più utile. Tutto è coperto da segreto professionale.",
    };
    return [intro, ...(SPECIFIC[id || ""] || []), ...COMMON_TAIL];
  }, [id]);

  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [pref, setPref] = useState<Preferenze | null>(null);
  const [phase, setPhase] = useState<"questions" | "result">("questions");
  const startTimeRef = useRef(Date.now());
  const isEnd = phase === "result";
  const progress = Math.round(((i + (isEnd ? 0 : 1)) / (steps.length + 1)) * 100);

  // Track start
  useEffect(() => {
    trackFunnel("questionario", "start", { percorso: id, total_steps: steps.length });
    const handleLeave = () => {
      if (phase !== "result") {
        trackEvent("questionario_abandon", "questionario", {
          percorso: id, step: i, total: steps.length,
          time_s: Math.round((Date.now() - startTimeRef.current) / 1000),
        });
      }
    };
    window.addEventListener("beforeunload", handleLeave);
    return () => window.removeEventListener("beforeunload", handleLeave);
  }, []);

  // Track completion
  useEffect(() => {
    if (phase === "questions" && i >= steps.length) {
      setPhase("result");
    }
  }, [phase, i, steps.length]);

  const step = steps[i];

  if (isEnd) {
    const level = score >= 12 ? "alto" : score >= 6 ? "medio" : "basso";
    const config = {
      alto: {
        badge: "Supporto immediato consigliato",
        title: "Sei in un momento delicato — non affrontarlo da solo/a",
        body: "Le tue risposte ci dicono che adesso è importante avere accanto un professionista. Il primo colloquio è gratuito, senza impegno.",
        plan: "Percorso intensivo con presa in carico completa",
        duration: "12+ mesi con supporto continuo",
      },
      medio: {
        badge: "C'è una direzione chiara",
        title: "Possiamo costruire un percorso su misura per te",
        body: "Quello che hai condiviso ci dà già una buona idea. Un colloquio gratuito ci serve a capire insieme da dove partire.",
        plan: "Percorso personalizzato online + sede",
        duration: "3-6 mesi modulari",
      },
      basso: {
        badge: "Stai facendo prevenzione, ottimo",
        title: "Hai già gli strumenti per iniziare da solo/a",
        body: "La situazione è gestibile e dentro l'app trovi tutto quello che serve. Se in futuro vorrai parlare con un professionista, siamo qui.",
        plan: "Strumenti gratuiti + check-up periodici",
        duration: "Ritmo libero",
      },
    }[level];

    return (
      <div className="min-h-screen bg-surface-0 px-5 py-10 safe-area-top safe-area-bottom">
        <div className="max-w-md mx-auto space-y-6 text-center">
          <div className="text-6xl">❤️</div>
          <span className="inline-block text-xs font-bold px-3 py-1.5 rounded-full bg-primary/10 text-primary">
            {config.badge}
          </span>
          <h1 className="text-3xl font-bold text-foreground leading-tight">{config.title}</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">{config.body}</p>

          <div className="rounded-2xl border-2 border-primary/40 p-5 text-left space-y-2 bg-primary/5">
            <p className="text-[10px] font-bold tracking-wider text-primary">IL TUO PERCORSO STIMATO</p>
            <p className="text-base font-bold text-foreground">{config.plan}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Durata indicativa: {config.duration}
            </p>
            <p className="text-[11px] italic text-muted-foreground pt-1">
              * Una stima. Il colloquio gratuito serve proprio a definire il piano su misura per te.
            </p>
          </div>

          <div className="space-y-2.5">
            <Button asChild size="lg" className="w-full h-14 text-base font-semibold">
              <Link to={`/percorso/visite?type=colloquio-gratuito`} onClick={() => trackCta("questionario_book_colloquio", "questionario", { percorso: id, level })}>
                <CalendarCheck className="w-5 h-5 mr-2" /> Fai il colloquio gratuito di 30 min
              </Link>
            </Button>
            <p className="text-[11px] text-muted-foreground -mt-1">
              Scegli giorno, orario e caratteristiche del professionista.
            </p>
          </div>

          {pref && (
            <div className="rounded-xl bg-surface-1 border border-border/40 p-3 text-left space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Le tue preferenze salvate
              </p>
              <p className="text-xs text-foreground">
                Genere: <strong>{pref.genere}</strong> · Esperienza: <strong>{pref.esperienza}</strong> · Stile: <strong>{pref.approccio}</strong>
              </p>
            </div>
          )}

          <div className="rounded-xl bg-primary/5 border border-primary/20 p-3 text-left flex gap-2">
            <Lock className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-foreground/80 leading-relaxed">
              <strong>Privacy garantita.</strong> Le tue risposte sono criptate e accessibili solo a te e al professionista che ti seguirà. Segreto professionale e GDPR.
            </p>
          </div>

          <div className="pt-4 space-y-3 text-left">
            <p className="text-[10px] font-bold tracking-wider text-muted-foreground">DISPONIBILI SUBITO, GRATIS</p>
            {[
              { icon: BookOpen, title: "Corsi e lezioni", desc: "Video educativi sul tuo percorso", to: "/corsi", color: "bg-blue-500/10 text-blue-500" },
              { icon: Sparkles, title: "Chat con il coach AI", desc: "Supporto immediato 24/7", to: "/supporto", color: "bg-purple-500/10 text-purple-500" },
              { icon: Users, title: "Community", desc: "Persone che capiscono cosa stai vivendo", to: "/community", color: "bg-emerald-500/10 text-emerald-500" },
              { icon: Wind, title: "Esercizi di respirazione", desc: "Per i momenti di craving", to: "/strumenti#respira", color: "bg-amber-500/10 text-amber-500" },
            ].map((s) => (
              <Link key={s.title} to={s.to} className="glass-card rounded-xl p-3.5 flex items-center gap-3 hover:border-primary/30 transition-all">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", s.color)}>
                  <s.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{s.title}</p>
                  <p className="text-[11px] text-muted-foreground">{s.desc}</p>
                </div>
                <Sparkles className="w-4 h-4 text-primary/50" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const next = (weight = 0) => {
    const newI = i + 1;
    const newScore = score + weight;
    trackFunnel("questionario", `step_${i}`, { percorso: id, step_index: i, weight, score_so_far: newScore });
    if (newI >= steps.length) {
      const level = newScore >= 12 ? "alto" : newScore >= 6 ? "medio" : "basso";
      trackFunnel("questionario", "complete", {
        percorso: id, final_score: newScore, level,
        time_s: Math.round((Date.now() - startTimeRef.current) / 1000),
      });
    }
    setScore(newScore);
    setI(newI);
  };

  if (!step) return null;

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col safe-area-top safe-area-bottom">
      <header className="px-4 py-3 flex items-center gap-3 border-b border-border/40">
        <button
          onClick={() => (i === 0 ? navigate(-1) : setI(i - 1))}
          className="w-9 h-9 rounded-full hover:bg-secondary/60 flex items-center justify-center"
          aria-label="Indietro"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <p className="text-[10px] text-muted-foreground">Percorso · {TITLES[id || ""] || "Valutazione"}</p>
          <Progress value={progress} className="h-1.5 mt-1" />
        </div>
        <span className="text-[10px] font-semibold text-muted-foreground tabular-nums">{progress}%</span>
      </header>

      <main className="flex-1 px-5 py-8 max-w-md mx-auto w-full flex flex-col">
        {step.kind === "feedback" ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-5 py-8">
            <div className="text-6xl">{step.emoji}</div>
            <h2 className="text-2xl font-bold text-foreground leading-tight">{step.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">{step.body}</p>
            <Button onClick={() => next(0)} size="lg" className="mt-4 w-full max-w-xs">
              Continua <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary" />
              <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">Domanda</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground leading-tight">{step.title}</h2>
            {step.subtitle && <p className="text-sm text-muted-foreground">{step.subtitle}</p>}
            <div className="space-y-2.5 pt-2">
              {step.options.map((o) => (
                <button
                  key={o.label}
                  onClick={() => next(o.weight)}
                  className="w-full text-left p-4 rounded-xl border border-border bg-surface-1 hover:border-primary hover:bg-primary/5 transition-all font-medium text-sm text-foreground"
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PercorsoQuestionario;
