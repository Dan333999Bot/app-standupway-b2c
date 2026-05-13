import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, ShieldCheck, Smartphone, Users, GraduationCap, AlertTriangle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trackPage, trackEvent } from "@/lib/analyticsV2";

const ADDICTION_LABEL: Record<string, string> = {
  alcol: "alcol", "crack-cocaina": "crack e cocaina", ludopatia: "gioco d'azzardo",
  oppiacei: "oppiacei", cannabis: "cannabis", "sesso-pornografia": "sesso e pornografia",
  famiglie: "un familiare con dipendenza",
};

const LEVEL_CONFIG = {
  basso: { label: "Basso",    color: "#10b981", bg: "bg-emerald-500/10", border: "border-emerald-500/30", pct: 25 },
  medio: { label: "Moderato", color: "#f59e0b", bg: "bg-amber-500/10",   border: "border-amber-500/30",   pct: 60 },
  alto:  { label: "Elevato",  color: "#ef4444", bg: "bg-red-500/10",     border: "border-red-500/30",     pct: 88 },
};

const ADVICE: Record<string, Record<string, string[]>> = {
  alcol: {
    basso: ["Monitora la frequenza e le quantità nel tempo", "Riconosci i contesti che aumentano il consumo", "Un confronto con un professionista può darti strumenti pratici"],
    medio: ["Il consumo che descrivi può interferire con il tuo benessere quotidiano", "Ridurre da soli è possibile ma difficile senza un supporto strutturato", "Un percorso mirato può aiutarti a capire da dove partire"],
    alto:  ["Quello che descrivi indica una dipendenza che difficilmente si risolve con la sola forza di volontà", "Il corpo può avere bisogno di un supporto anche medico nella fase iniziale", "Iniziare con un piano su misura è il passo più concreto che puoi fare oggi"],
  },
  "crack-cocaina": {
    basso: ["Anche un uso occasionale può accelerare rapidamente", "Osserva se stai usando come risposta a stress o emozioni difficili", "Parlarne presto è sempre meglio che aspettare"],
    medio: ["Il pattern che descrivi suggerisce un'abitudine consolidata", "Spesso si smette di accorgersene finché non impatta il lavoro o le relazioni", "Un supporto professionale specifico fa la differenza"],
    alto:  ["La dipendenza da cocaina/crack richiede un approccio mirato", "Non aspettare che tocchi il fondo: il momento giusto è adesso", "I nostri professionisti hanno esperienza specifica su questo percorso"],
  },
  ludopatia: {
    basso: ["Il gioco d'azzardo può diventare problematico gradualmente", "Fissa limiti di tempo e denaro prima di ogni sessione", "Se noti che pensi spesso al gioco, è un segnale da non ignorare"],
    medio: ["Il gioco sta influenzando le tue scelte e forse le tue finanze", "La dipendenza da gioco ha spesso una forte componente emotiva", "Un professionista può aiutarti a capire il meccanismo che si è creato"],
    alto:  ["Le conseguenze finanziarie e relazionali spesso sono già presenti", "Un percorso strutturato con un professionista specializzato è la strada più efficace", "Puoi uscirne: con il supporto giusto"],
  },
  oppiacei: {
    basso: ["Anche l'uso occasionale di oppiacei presenta rischi elevati", "Se stai usando farmaci oppiacei oltre la prescrizione, parlane subito", "Non aspettare che diventi ingestibile"],
    medio: ["La dipendenza è in fase attiva e richiede attenzione professionale", "Spesso richiede un supporto anche medico oltre che psicologico", "Contattare subito un professionista è la scelta più sicura"],
    alto:  ["Quello che descrivi richiede un intervento professionale", "La dipendenza da oppiacei ha caratteristiche fisiche che non si gestiscono da soli", "Il nostro team ti supporta in ogni fase, in totale riservatezza"],
  },
  cannabis: {
    basso: ["Un uso frequente può impattare motivazione e memoria nel tempo", "Osserva se l'uso è diventato una risposta automatica allo stress", "Un piccolo supporto all'inizio può fare la differenza"],
    medio: ["Il pattern suggerisce una dipendenza psicologica consolidata", "Smettere da soli è difficile perché il cervello ha riorganizzato le abitudini", "Un percorso breve con il supporto giusto è spesso sufficiente"],
    alto:  ["La cannabis è diventata centrale nella tua vita quotidiana", "Le conseguenze su motivazione e relazioni sono spesso sottovalutate", "Un professionista specializzato può aiutarti a uscire da questo schema"],
  },
  "sesso-pornografia": {
    basso: ["Distinguere tra uso normale e uso compulsivo è il primo passo", "Osserva se il comportamento interferisce con relazioni o impegni", "Parlarne con un professionista è un atto di cura, non una debolezza"],
    medio: ["Il comportamento ha assunto caratteristiche compulsive", "Questo tipo di dipendenza ha un impatto reale su autostima e relazioni", "Un professionista può aiutarti a capire le radici e costruire un percorso"],
    alto:  ["Queste dinamiche raramente si risolvono con la sola forza di volontà", "I nostri professionisti trattano questo con un approccio specifico e riservato", "Il momento di agire è adesso"],
  },
  famiglie: {
    basso: ["Vivere vicino a una persona con dipendenza è logorante", "Prendersi cura di sé non è egoismo — è necessario per aiutare davvero", "Un confronto con un professionista può darti strumenti concreti"],
    medio: ["C'è un impatto significativo sulla tua vita quotidiana e sulle relazioni", "I familiari spesso sviluppano dinamiche di codipendenza senza rendersene conto", "Un supporto specializzato per i familiari è diverso ed altrettanto necessario"],
    alto:  ["La situazione che descrivi è seria e richiede un supporto professionale", "Non devi gestire questo da solo/a", "I nostri professionisti lavorano specificamente con i familiari"],
  },
};

const PARTNERS = ["CDP Venture Capital", "Intesa Innovation Center", "Wylab", "Vital Match", "La Repubblica"];

export default function RisultatoV2() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const funnel = (() => { try { return JSON.parse(sessionStorage.getItem("sw_funnel") || "{}"); } catch { return {}; } })();
  const level: "basso" | "medio" | "alto" = funnel.level || "medio";
  const score: number = funnel.score ?? 0;
  const dipendenza = id || funnel.dipendenza || "dipendenza";
  const lvl = LEVEL_CONFIG[level];
  const advice = ADVICE[dipendenza]?.[level] || ADVICE["alcol"][level];
  const addLabel = ADDICTION_LABEL[dipendenza] || dipendenza;

  useEffect(() => {
    trackPage("risultato_v2", { dipendenza, level });
  }, []);

  const handleCTA = () => {
    trackEvent("risultato_v2_piano_click", "risultato_v2", { dipendenza, level });
    navigate(`/v2/${id}/piano`);
  };

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col safe-area-top safe-area-bottom">
      {/* Header */}
      <header className="bg-surface-1 border-b border-border/40 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-lg mx-auto">
          <h1 className="text-base font-bold text-foreground">Il tuo risultato</h1>
          <p className="text-[11px] text-muted-foreground">Analisi basata sulle tue risposte</p>
        </div>
        {/* Step indicator V2 */}
        <div className="flex items-center gap-1.5 mt-3 max-w-lg mx-auto">
          {["Questionario", "Risultato", "Piano"].map((s, idx) => (
            <div key={s} className="flex items-center gap-1 flex-1">
              <div className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0",
                idx === 0 ? "bg-primary/20 text-primary" :
                idx === 1 ? "bg-primary text-primary-foreground" :
                "bg-border text-muted-foreground"
              )}>
                {idx === 0 ? "✓" : idx + 1}
              </div>
              {idx < 2 && <div className="flex-1 h-px bg-border/60" />}
            </div>
          ))}
        </div>
      </header>

      <div className="flex-1 px-4 py-6 pb-36 max-w-lg mx-auto w-full space-y-5">

        {/* Score card */}
        <div className={cn("rounded-2xl border p-5 space-y-4", lvl.bg, lvl.border)}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Livello di rischio rilevato</p>
              <p className="text-2xl font-black" style={{ color: lvl.color }}>{lvl.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Dipendenza da {addLabel}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-foreground">{score}</p>
              <p className="text-[10px] text-muted-foreground">punti</p>
            </div>
          </div>
          <div className="w-full h-2.5 bg-border/40 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${lvl.pct}%`, background: lvl.color }} />
          </div>
          <div className="flex items-start gap-2 bg-background/60 rounded-xl p-3">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Questa è un'analisi <strong>approssimativa</strong> basata sulle tue risposte. Non sostituisce una diagnosi clinica.
            </p>
          </div>
        </div>

        {/* Consigli */}
        <div className="rounded-2xl border border-border/40 bg-surface-1 p-5 space-y-3">
          <p className="text-sm font-bold text-foreground">Cosa emerge dalla tua situazione</p>
          <div className="space-y-2.5">
            {advice.map((tip, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold text-primary">{i + 1}</span>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Approccio */}
        <div className="rounded-2xl border border-border/40 bg-surface-1 p-5 space-y-4">
          <p className="text-sm font-bold text-foreground">Come lavoriamo con te</p>
          <div className="space-y-3">
            {[
              { icon: Smartphone, text: "100% online via app — segui il percorso dal tuo telefono, dove e quando vuoi" },
              { icon: Users, text: "Professionisti multidisciplinari: psicologi, educatori, coach pari che hanno vissuto la dipendenza in prima persona" },
              { icon: ShieldCheck, text: "Segreto professionale garantito — quello che condividi non esce dal percorso" },
            ].map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed pt-1">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Social proof */}
        <div className="rounded-2xl border border-border/40 bg-surface-1 p-5 space-y-4">
          <p className="text-sm font-bold text-foreground">StandUpWay in numeri</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { n: "1.500+", label: "persone assistite" },
              { n: "20.000+", label: "community e famiglie" },
              { n: "#1", label: "App in Italia per dipendenze" },
              { n: "UniPA", label: "Università di Palermo" },
            ].map(({ n, label }) => (
              <div key={label} className="bg-primary/5 rounded-xl p-3 text-center">
                <p className="text-xl font-black text-primary">{n}</p>
                <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">{label}</p>
              </div>
            ))}
          </div>
          <div className="space-y-1.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Partner e riconoscimenti</p>
            <div className="flex flex-wrap gap-2">
              {PARTNERS.map((p) => (
                <span key={p} className="text-[11px] bg-border/40 text-foreground/70 px-2.5 py-1 rounded-full">{p}</span>
              ))}
              <span className="text-[11px] bg-border/40 text-foreground/70 px-2.5 py-1 rounded-full flex items-center gap-1">
                <GraduationCap className="w-3 h-3" /> Università di Palermo
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* CTA fissa */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface-1/95 backdrop-blur border-t border-border/40 px-4 py-4 safe-area-bottom z-20">
        <div className="max-w-lg mx-auto space-y-2">
          <Button onClick={handleCTA} className="w-full text-base font-semibold" size="lg">
            Vedi il tuo piano <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
          <p className="text-center text-[10px] text-muted-foreground">Scegli il piano più adatto a te — da 49€/settimana</p>
        </div>
      </div>
    </div>
  );
}
