import { useEffect, useState } from "react";
import { usePageTracking } from "@/hooks/usePageTracking";
import { BottomNav } from "@/components/BottomNav";
import { HeaderActions } from "@/components/HeaderActions";
import { Link } from "react-router-dom";
import {
  Heart, ArrowRight, PlayCircle, Sparkles, Target, Flame,
  ClipboardList, Calendar as CalendarIcon, BookOpen, FileText,
  CheckCircle2, Smartphone, Search, MessageSquare, Rocket, Users, Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const quickLinks = [
  { icon: ClipboardList, label: "Report", to: "/percorso/report" },
  { icon: CalendarIcon, label: "Agenda", to: "/percorso/visite" },
  { icon: Target, label: "Obiettivi", to: "/percorso/obiettivi" },
  { icon: BookOpen, label: "Diario", to: "/percorso/diario" },
];

const steps = [
  { n: 1, icon: Smartphone, title: "Entra in app", desc: "Hai già fatto il primo passo.", done: true },
  { n: 2, icon: Search, title: "Esplora gli strumenti", desc: "Corsi, community, incontri dal vivo." },
  { n: 3, icon: MessageSquare, title: "Primo colloquio", desc: "30 minuti con un professionista (49€)." },
  { n: 4, icon: FileText, title: "Ricevi il preventivo", desc: "Un percorso personalizzato per te." },
  { n: 5, icon: Rocket, title: "Inizia il percorso", desc: "Quando ti senti pronto/a." },
  { n: 6, icon: Users, title: "Sfrutta la community", desc: "Ogni giorno, insieme a chi ti capisce." },
];

const PercorsoShowcase = ({ cleanDays }: { cleanDays: number }) => {
  const [state, setState] = useState<1 | 2 | 3>(3);

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          <h2 className="text-base font-bold text-foreground">Il mio percorso</h2>
        </div>
        <div className="flex items-center gap-1 bg-secondary/60 rounded-full p-0.5">
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              onClick={() => setState(n as 1 | 2 | 3)}
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-colors ${
                state === n ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {state === 1 && (
        <div className="glass-card rounded-2xl p-4 border border-border/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-secondary text-muted-foreground font-bold uppercase tracking-wider">Senza percorso</span>
            <span className="text-[10px] text-muted-foreground">Stato 1 di 3</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-secondary/60 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Nessuno strumento attivo</p>
              <p className="text-[11px] text-muted-foreground leading-snug">Inizia con il primo colloquio di 30 minuti (49€).</p>
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
        </div>
      )}

      {state === 2 && (
        <div className="glass-card rounded-2xl p-4 border border-amber-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">Dopo il colloquio</span>
            <span className="text-[10px] text-muted-foreground">Stato 2 di 3</span>
          </div>
          <div className="flex items-center gap-3 pb-3 border-b border-border/30">
            <div className="w-11 h-11 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Preventivo pronto</p>
              <p className="text-[11px] text-muted-foreground leading-snug">Inizia il percorso per sbloccare gli strumenti.</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <Link to="/percorso/preventivo" className="relative rounded-xl p-2.5 text-center bg-amber-500/10 border border-amber-500/40">
              <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400 mx-auto" />
              <p className="text-[10px] text-foreground font-semibold mt-1">Preventivo</p>
            </Link>
            {quickLinks.slice(1).map((l) => (
              <div key={l.label} className="relative rounded-xl p-2.5 text-center bg-secondary/40 border border-border/40">
                <l.icon className="w-4 h-4 text-muted-foreground/60 mx-auto" />
                <p className="text-[10px] text-muted-foreground/70 font-medium mt-1">{l.label}</p>
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-foreground/80 flex items-center justify-center">
                  <Lock className="w-2.5 h-2.5 text-background" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {state === 3 && (
        <div className="glass-card rounded-2xl p-4 border border-primary/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold uppercase tracking-wider">Percorso attivo</span>
            <span className="text-[10px] text-muted-foreground">Stato 3 di 3</span>
          </div>
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
      )}

      {/* CTA rosso sempre visibile */}
      <Link to="/percorsi" className="block">
        <Button variant="cta" size="lg" className="w-full">
          Prenota il primo colloquio
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </Link>
    </section>
  );
};

const Home = () => {
  usePageTracking("home");
  const [cleanDate] = useState<Date | undefined>(() => {
    const s = localStorage.getItem("standup_clean_date");
    return s ? new Date(s) : undefined;
  });

  const cleanDays = cleanDate
    ? Math.max(0, Math.floor((Date.now() - cleanDate.getTime()) / (1000 * 60 * 60 * 24)))
    : 12;

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
        {/* === IL MIO PERCORSO — Showcase compatto 3 stati === */}
        <PercorsoShowcase cleanDays={cleanDays} />

        {/* Due video affiancati: 1 → 2 */}
        <section className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Guarda in ordine</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { n: 1, title: "Cos'è StandUpWay" },
              { n: 2, title: "Come iniziare un percorso" },
            ].map((v) => (
              <div key={v.n} className="rounded-xl overflow-hidden border border-border/40 bg-surface-1">
                <div className="relative aspect-video bg-secondary/40 flex items-center justify-center">
                  <iframe title={v.title} src="about:blank" className="absolute inset-0 w-full h-full" allowFullScreen />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground bg-secondary/40 pointer-events-none">
                    <PlayCircle className="w-7 h-7 mb-1" />
                    <span className="text-[9px] font-bold">VIDEO {v.n}</span>
                  </div>
                </div>
                <div className="px-2 py-2">
                  <p className="text-[11px] font-semibold text-foreground leading-tight">{v.title}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

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
