import { useEffect, useState } from "react";
import { usePageTracking } from "@/hooks/usePageTracking";
import { useUserState } from "@/hooks/useUserState";
import { useAppConfig } from "@/hooks/useAppConfig";
import { BottomNav } from "@/components/BottomNav";
import { HeaderActions } from "@/components/HeaderActions";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart, ArrowRight, PlayCircle, Sparkles, Target, Flame,
  ClipboardList, Calendar as CalendarIcon, BookOpen, FileText,
  CheckCircle2, Smartphone, Search, MessageSquare, Rocket, Users, Lock,
  CalendarDays, Clock, UserCheck, RefreshCcw, MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const FIGURA_LABEL: Record<string, string> = {
  psicologo: "Psicologo/a",
  educatore: "Educatore",
  "coach-pari": "Coach Pari",
};
const GENERE_LABEL: Record<string, string> = {
  donna: "Donna",
  uomo: "Uomo",
  nessuna: "Nessuna preferenza",
};

const quickLinks = [
  { icon: ClipboardList, label: "Report", to: "/percorso/report" },
  { icon: CalendarIcon, label: "Agenda", to: "/percorso/visite" },
  { icon: Target, label: "Obiettivi", to: "/percorso/obiettivi" },
  { icon: BookOpen, label: "Diario", to: "/percorso/diario" },
];

function getSteps(userState: import("@/hooks/useUserState").UserState | null) {
  const c = !!userState?.first_colloquio_done;
  const p = !!userState?.percorso_active;
  return [
    { n: 1, icon: Smartphone,    title: "Entra in app",           desc: "Hai già fatto il primo passo.",                    done: true },
    { n: 2, icon: Search,        title: "Esplora gli strumenti",  desc: "Corsi, community, incontri dal vivo.",             done: c || p },
    { n: 3, icon: MessageSquare, title: "Primo colloquio",        desc: "30 minuti con un professionista (49€).",           done: c || p },
    { n: 4, icon: FileText,      title: "Ricevi il preventivo",   desc: "Un percorso personalizzato per te.",               done: p },
    { n: 5, icon: Rocket,        title: "Inizia il percorso",     desc: "Quando ti senti pronto/a.",                        done: p },
    { n: 6, icon: Users,         title: "Sfrutta la community",   desc: "Ogni giorno, insieme a chi ti capisce.",           done: p },
  ];
}

/* ─── Percorso states ─────────────────────────────────────────────────── */

// Stato 0: appuntamento prenotato ma non ancora pagato
const StateAppuntamentoPendente = ({ appt }: { appt: { data?: string; ora?: string; professionista_figura?: string; professionista_genere?: string } }) => {
  const navigate = useNavigate();
  return (
    <div className="glass-card rounded-2xl p-4 border border-primary/40 space-y-3">
      <span className="text-[10px] px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold uppercase tracking-wider">
        Appuntamento da confermare
      </span>
      <div className="space-y-2 pb-3 border-b border-border/30">
        {appt.data && (
          <div className="flex items-center gap-2.5">
            <CalendarDays className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-sm font-semibold text-foreground">{appt.data}</span>
          </div>
        )}
        {appt.ora && (
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-sm text-foreground">Ore {appt.ora} · 30 minuti</span>
          </div>
        )}
        {appt.professionista_figura && (
          <div className="flex items-center gap-2.5">
            <UserCheck className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-sm text-foreground">
              {FIGURA_LABEL[appt.professionista_figura] || appt.professionista_figura}
              {appt.professionista_genere && appt.professionista_genere !== "nessuna" && ` · ${GENERE_LABEL[appt.professionista_genere]}`}
            </span>
          </div>
        )}
      </div>
      <div className="grid grid-cols-4 gap-2">
        <Link to="/percorso/visite" className="rounded-xl p-2.5 text-center bg-primary/10 border border-primary/30">
          <CalendarIcon className="w-4 h-4 text-primary mx-auto" />
          <p className="text-[10px] text-foreground font-semibold mt-1">Agenda</p>
        </Link>
        {[
          { icon: FileText, label: "Preventivo" },
          { icon: Target,   label: "Obiettivi" },
          { icon: BookOpen, label: "Diario" },
        ].map((l) => (
          <div key={l.label} className="relative rounded-xl p-2.5 text-center bg-secondary/40 border border-border/40">
            <l.icon className="w-4 h-4 text-muted-foreground/60 mx-auto" />
            <p className="text-[10px] text-muted-foreground/70 font-medium mt-1">{l.label}</p>
            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-foreground/80 flex items-center justify-center">
              <Lock className="w-2.5 h-2.5 text-background" />
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-3 flex items-center gap-2">
        <RefreshCcw className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
        <p className="text-[11px] text-emerald-600 leading-snug">Rimborso garantito entro 24h se non sei soddisfatto</p>
      </div>
      <Button onClick={() => navigate("/prenota/benvenuto")} variant="cta" size="lg" className="w-full">
        Conferma e paga · 49€ <ArrowRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
};

// Stato 1: nessun colloquio
const StateSenzaPercorso = ({ stripeUrl }: { stripeUrl?: string }) => (
  <div className="glass-card rounded-2xl p-4 border border-border/40 space-y-3">
    <span className="text-[10px] px-2.5 py-1 rounded-full bg-secondary text-muted-foreground font-bold uppercase tracking-wider">
      Prima del colloquio
    </span>
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-2xl bg-secondary/60 flex items-center justify-center flex-shrink-0">
        <Sparkles className="w-6 h-6 text-muted-foreground" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-foreground">Nessuno strumento attivo</p>
        <p className="text-[11px] text-muted-foreground leading-snug">
          Inizia con il primo colloquio di 30 minuti (49€).
        </p>
      </div>
    </div>
    <div className="grid grid-cols-4 gap-2">
      {quickLinks.map((l) => (
        <div key={l.label} className="relative rounded-xl p-2.5 text-center bg-secondary/40 border border-border/40">
          <l.icon className="w-4 h-4 text-muted-foreground/60 mx-auto" />
          <p className="text-[10px] text-muted-foreground/70 font-medium mt-1">{l.label}</p>
          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-foreground/80 flex items-center justify-center">
            <Lock className="w-2.5 h-2.5 text-background" />
          </div>
        </div>
      ))}
    </div>
    <Link to="/percorsi" className="block">
      <Button variant="cta" size="lg" className="w-full">
        Prenota un colloquio <ArrowRight className="w-4 h-4 ml-1" />
      </Button>
    </Link>
  </div>
);

// Stato 1b: utente arrivato da Funnel V2 — mostra percorso suggerito
const LEVEL_LABEL: Record<string, string> = { basso: "Lieve", medio: "Moderato", alto: "Elevato" };
const LEVEL_COLOR: Record<string, string> = { basso: "text-emerald-600", medio: "text-amber-600", alto: "text-red-600" };
const ADDICTION_SHORT: Record<string, string> = {
  alcol: "Alcol", "crack-cocaina": "Crack/Cocaina", ludopatia: "Ludopatia",
  oppiacei: "Oppiacei", cannabis: "Cannabis", "sesso-pornografia": "Sesso/Porno",
  famiglie: "Supporto Famiglie",
};

const StatePercorsoSuggerito = ({ result }: { result: { dipendenza: string; score: number; level: string } }) => (
  <div className="glass-card rounded-2xl p-4 border border-primary/20 bg-primary/5 space-y-3">
    <span className="text-[10px] px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold uppercase tracking-wider">
      Percorso suggerito
    </span>
    <div className="flex items-center gap-3 pb-3 border-b border-border/30">
      <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
        <MapPin className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-foreground">
          {ADDICTION_SHORT[result.dipendenza] || result.dipendenza}
        </p>
        <p className="text-[11px] text-muted-foreground">
          Livello: <span className={`font-bold ${LEVEL_COLOR[result.level] || ""}`}>
            {LEVEL_LABEL[result.level] || result.level}
          </span>
          {" "}· Score {result.score}
        </p>
      </div>
    </div>
    <div className="grid grid-cols-4 gap-2">
      <Link to={`/v2/${result.dipendenza}/piano`} className="rounded-xl p-2.5 text-center bg-primary/10 border border-primary/30">
        <MapPin className="w-4 h-4 text-primary mx-auto" />
        <p className="text-[10px] text-foreground font-semibold mt-1 leading-tight">Suggerito</p>
      </Link>
      {[
        { icon: CalendarIcon, label: "Agenda" },
        { icon: Target,       label: "Obiettivi" },
        { icon: BookOpen,     label: "Diario" },
      ].map((l) => (
        <div key={l.label} className="relative rounded-xl p-2.5 text-center bg-secondary/40 border border-border/40">
          <l.icon className="w-4 h-4 text-muted-foreground/60 mx-auto" />
          <p className="text-[10px] text-muted-foreground/70 font-medium mt-1">{l.label}</p>
          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-foreground/80 flex items-center justify-center">
            <Lock className="w-2.5 h-2.5 text-background" />
          </div>
        </div>
      ))}
    </div>
    <Link to="/percorsi" className="block">
      <Button variant="cta" size="lg" className="w-full">
        Prenota un colloquio <ArrowRight className="w-4 h-4 ml-1" />
      </Button>
    </Link>
  </div>
);

// Stato 2: colloquio fatto, preventivo pronto
const StateDopoColloquio = ({
  level, duration, percorsoType, stripeUrl,
}: { level: string | null; duration: string | null; percorsoType: string | null; stripeUrl?: string }) => {
  const planLabel = duration === '12m' ? 'Percorso 12 mesi' : 'Percorso 6 mesi';
  const planDesc = level === 'alto'
    ? 'Percorso intensivo con presa in carico completa (12 mesi)'
    : 'Percorso personalizzato online + sede (6 mesi)';
  const stripeTarget = duration === '12m' ? stripeUrl : stripeUrl;

  return (
    <div className="glass-card rounded-2xl p-4 border border-amber-500/30 space-y-3">
      <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">
        Preventivo pronto
      </span>
      <div className="flex items-center gap-3 pb-3 border-b border-border/30">
        <div className="w-11 h-11 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
          <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">{planLabel}</p>
          <p className="text-[11px] text-muted-foreground leading-snug">{planDesc}</p>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <Link to="/percorso/preventivo" className="relative rounded-xl p-2.5 text-center bg-amber-500/10 border border-amber-500/40">
          <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400 mx-auto" />
          <p className="text-[10px] text-foreground font-semibold mt-1">Preventivo</p>
        </Link>
        <Link to="/percorso/visite" className="rounded-xl p-2.5 text-center bg-primary/10 border border-primary/30">
          <CalendarIcon className="w-4 h-4 text-primary mx-auto" />
          <p className="text-[10px] text-foreground font-semibold mt-1">Agenda</p>
        </Link>
        {[quickLinks[2], quickLinks[3]].map((l) => (
          <div key={l.label} className="relative rounded-xl p-2.5 text-center bg-secondary/40 border border-border/40">
            <l.icon className="w-4 h-4 text-muted-foreground/60 mx-auto" />
            <p className="text-[10px] text-muted-foreground/70 font-medium mt-1">{l.label}</p>
            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-foreground/80 flex items-center justify-center">
              <Lock className="w-2.5 h-2.5 text-background" />
            </div>
          </div>
        ))}
      </div>
      <Link to="/percorsi" className="block">
        <Button variant="cta" size="lg" className="w-full">
          Prenota un colloquio <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </Link>
    </div>
  );
};

// Stato 3: percorso attivo
const StatePercorsoAttivo = ({ cleanDays }: { cleanDays: number }) => (
  <div className="glass-card rounded-2xl p-4 border border-primary/30 space-y-3">
    <span className="text-[10px] px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold uppercase tracking-wider">
      Percorso attivo
    </span>
    <div className="flex items-center gap-3 pb-3 border-b border-border/30">
      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500/30 to-red-600/20 flex items-center justify-center">
        <Heart className="w-5 h-5 text-foreground" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-foreground">Cammino di libertà</p>
        <p className="text-[10px] text-muted-foreground">Il tuo percorso è attivo</p>
      </div>
      <div className="flex flex-col items-center px-2.5 py-1 rounded-xl bg-primary/10">
        <div className="flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 text-primary" />
          <span className="text-base font-bold text-primary leading-none">{cleanDays}</span>
        </div>
        <span className="text-[9px] text-primary/70 font-medium">giorni</span>
      </div>
    </div>
    <div className="grid grid-cols-4 gap-2">
      {quickLinks.map((link) => (
        <Link key={link.label} to={link.to}
          className="glass-card rounded-xl p-2.5 text-center space-y-1 hover:border-primary/30 transition-colors">
          <link.icon className="w-4 h-4 text-primary mx-auto" />
          <p className="text-[10px] text-muted-foreground font-medium">{link.label}</p>
        </Link>
      ))}
    </div>
  </div>
);

/* ─── Main Showcase ────────────────────────────────────────────────────── */

const PercorsoShowcase = ({ cleanDays, config }: {
  cleanDays: number;
  config: Record<string, string>;
}) => {
  const { userState, loading } = useUserState();

  if (loading) {
    return (
      <section className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Target className="w-4 h-4 text-primary" />
          <h2 className="text-base font-bold text-foreground">Il mio percorso</h2>
        </div>
        <div className="glass-card rounded-2xl p-6 border border-border/40 flex items-center justify-center">
          <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      </section>
    );
  }

  const stripeColloquio = config['stripe_colloquio_url'];
  const stripe6m = config['stripe_percorso_6m_url'];
  const stripe12m = config['stripe_percorso_12m_url'];

  const stripePercorso = userState?.percorso_duration === '12m' ? stripe12m : stripe6m;

  const pendingAppt = (() => {
    try { return JSON.parse(localStorage.getItem("sw_pending_appointment") || "null"); }
    catch { return null; }
  })();

  const v2Result = (() => {
    try { return JSON.parse(localStorage.getItem("sw_v2_result") || "null"); }
    catch { return null; }
  })();

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <Target className="w-4 h-4 text-primary" />
        <h2 className="text-base font-bold text-foreground">Il mio percorso</h2>
      </div>

      {pendingAppt ? (
        <StateAppuntamentoPendente appt={pendingAppt} />
      ) : userState?.percorso_active ? (
        <StatePercorsoAttivo cleanDays={cleanDays} />
      ) : userState?.first_colloquio_done ? (
        <StateDopoColloquio
          level={userState.percorso_level}
          duration={userState.percorso_duration}
          percorsoType={userState.percorso_type}
          stripeUrl={stripePercorso}
        />
      ) : v2Result ? (
        <StatePercorsoSuggerito result={v2Result} />
      ) : (
        <StateSenzaPercorso stripeUrl={stripeColloquio} />
      )}
    </section>
  );
};

const Home = () => {
  usePageTracking("home");
  const config = useAppConfig();
  const { userState } = useUserState();
  const steps = getSteps(userState);
  const [cleanDate] = useState<Date | undefined>(() => {
    const s = localStorage.getItem("standup_clean_date");
    return s ? new Date(s) : undefined;
  });

  const cleanDays = cleanDate
    ? Math.max(0, Math.floor((Date.now() - cleanDate.getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="min-h-screen bg-surface-0 pb-24">
      <header className="bg-surface-1 border-b border-border/40 px-4 py-3 safe-area-top shadow-[var(--shadow-sm)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Heart className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-bold text-foreground">StandUp</h1>
          </div>
          <HeaderActions />
        </div>
      </header>

      <div className="px-4 py-5 space-y-6">
        {/* === IL MIO PERCORSO ═══ */}
        <PercorsoShowcase cleanDays={cleanDays} config={config} />

        {/* Due video affiancati ════ */}
        {(config['home_video_1_url'] || config['home_video_2_url']) && (
          <section className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Guarda in ordine</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'home_video_1', n: 1 },
                { key: 'home_video_2', n: 2 },
              ].map(({ key, n }) => {
                const raw = config[`${key}_url`];
                const title = config[`${key}_title`] || `Video ${n}`;
                if (!raw) return null;
                // Normalize Vimeo and YouTube watch URLs to embed URLs
                let url = raw;
                const vimeoMatch = raw.match(/vimeo\.com\/(\d+)/);
                const ytMatch = raw.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
                if (vimeoMatch) url = `https://player.vimeo.com/video/${vimeoMatch[1]}`;
                else if (ytMatch) url = `https://www.youtube.com/embed/${ytMatch[1]}`;
                return (
                  <div key={n} className="rounded-xl overflow-hidden border border-border/40 bg-surface-1">
                    <div className="relative aspect-video bg-secondary/40">
                      <iframe
                        title={title}
                        src={url}
                        className="absolute inset-0 w-full h-full"
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                        allowFullScreen
                      />
                    </div>
                    <div className="px-2 py-2">
                      <p className="text-[11px] font-semibold text-foreground leading-tight">{title}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* === Step di rinascita === */}
        <section className="space-y-3">
          <div className="px-1">
            <div className="flex items-center gap-2">
              <Rocket className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Il tuo percorso di rinascita</h3>
            </div>
            <p className="text-xs text-muted-foreground mt-1 ml-6">6 step semplici per ricominciare con StandUpWay</p>
          </div>

          <div className="relative pl-2">
            {/* linea verticale */}
            <div className="absolute left-[26px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary/60 via-primary/30 to-primary/10" />
            <div className="space-y-3">
              {steps.map((s) => (
                <div key={s.n} className="relative flex items-start gap-3">
                  <div className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border-2 ${
                    s.done
                      ? "bg-primary border-primary text-primary-foreground shadow-[0_0_0_4px_hsl(var(--primary)/0.15)]"
                      : "bg-surface-1 border-border text-muted-foreground"
                  }`}>
                    {s.done ? <CheckCircle2 className="w-6 h-6" /> : <s.icon className="w-5 h-5" />}
                  </div>
                  <div className={`flex-1 glass-card rounded-xl p-3 ${s.done ? "border-primary/30" : "border-border/40"}`}>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-foreground">
                        <span className={`mr-1.5 text-xs font-bold ${s.done ? "text-primary" : "text-muted-foreground"}`}>
                          {String(s.n).padStart(2, "0")}
                        </span>
                        {s.title}
                      </p>
                      {s.done && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold uppercase">Fatto</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;
