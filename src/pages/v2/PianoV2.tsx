import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Check, ArrowRight, ShieldCheck, Users, Clock, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trackPage, trackEvent } from "@/lib/analyticsV2";

/* ─── Stripe links (sostituisci con i link reali) ─────────────────── */
const STRIPE = {
  individuale_mensile: "https://buy.stripe.com/INDIVIDUALE",
  gruppi_mensile:      "https://buy.stripe.com/GRUPPI_MENSILE",
  gruppi_annuale:      "https://buy.stripe.com/GRUPPI_ANNUALE",
  completo_mensile:    "https://buy.stripe.com/COMPLETO_MENSILE",
  completo_annuale:    "https://buy.stripe.com/COMPLETO_ANNUALE",
};

const APP_LOGIN = "https://app.metodostandup.it/login";

/* ─── Piani ──────────────────────────────────────────────────────── */
const PLANS = [
  {
    key: "individuale",
    level: "basso",
    badge: "Lieve",
    name: "Individuale",
    tagline: "Il primo passo, guidato da un professionista",
    priceLabel: "49€",
    period: "/ settimana",
    annualLabel: null,
    color: "border-emerald-500/40",
    badgeBg: "bg-emerald-500/10 text-emerald-600",
    ctaColor: "bg-red-600 hover:bg-red-700 text-white",
    features: [
      "Sessioni individuali con psicologo specializzato",
      "Piano personalizzato settimana per settimana",
      "Accesso all'app StandUpWay",
      "Materiali di supporto tra le sessioni",
      "Segreto professionale garantito",
    ],
    stripeMonthly: STRIPE.individuale_mensile,
  },
  {
    key: "gruppi",
    level: "medio",
    badge: "Moderato",
    name: "Gruppi + Colloquio",
    tagline: "Il percorso più scelto. Comunità + supporto individuale",
    priceLabel: "297€",
    period: "/ mese",
    annualLabel: "oppure 2.970€/anno (risparmia 594€)",
    color: "border-amber-500/40",
    badgeBg: "bg-amber-500/10 text-amber-600",
    ctaColor: "bg-red-600 hover:bg-red-700 text-white",
    features: [
      "Gruppi terapeutici online (illimitati)",
      "1 colloquio individuale al mese",
      "Accesso all'app StandUpWay",
      "Community 20.000+ persone",
      "Educatori e coach pari certificati",
      "Segreto professionale garantito",
    ],
    stripeMonthly: STRIPE.gruppi_mensile,
    stripeAnnual: STRIPE.gruppi_annuale,
  },
  {
    key: "completo",
    level: "alto",
    badge: "Grave",
    name: "Completo",
    tagline: "Supporto totale: sempre raggiungibile, 7 giorni su 7",
    priceLabel: "597€",
    period: "/ mese",
    annualLabel: "oppure 5.970€/anno (risparmia 1.194€)",
    color: "border-red-500/40",
    badgeBg: "bg-red-500/10 text-red-600",
    ctaColor: "bg-red-600 hover:bg-red-700 text-white",
    features: [
      "Gruppi terapeutici online (illimitati)",
      "Colloqui individuali illimitati",
      "Supporto via chat 7 giorni su 7",
      "Accesso all'app StandUpWay",
      "Community 20.000+ persone",
      "Case manager dedicato",
      "Segreto professionale garantito",
    ],
    stripeMonthly: STRIPE.completo_mensile,
    stripeAnnual: STRIPE.completo_annuale,
  },
];

export default function PianoV2() {
  const { id } = useParams<{ id: string }>();
  const funnel = (() => { try { return JSON.parse(sessionStorage.getItem("sw_funnel") || "{}"); } catch { return {}; } })();
  const level: "basso" | "medio" | "alto" = funnel.level || "medio";

  // Annual toggle (only for plans that have it)
  const [annualMode, setAnnualMode] = useState<Record<string, boolean>>({});

  useEffect(() => {
    trackPage("piano_v2", { dipendenza: id, level });
  }, []);

  const handleStripe = (planKey: string, billing: "mensile" | "annuale", url: string) => {
    trackEvent("piano_v2_stripe_click", "piano_v2", { plan: planKey, billing, dipendenza: id, level });
    // Flag per Thankyou.tsx: sa che viene da V2 e traccia su funnel_v2_events
    sessionStorage.setItem("sw_checkout_source", "v2");
    sessionStorage.setItem("sw_checkout_plan", planKey);
    window.location.href = url;
  };

  const handleAppLogin = () => {
    trackEvent("piano_v2_app_click", "piano_v2", { dipendenza: id, level });
    window.open(APP_LOGIN, "_blank");
  };

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col safe-area-top safe-area-bottom">
      {/* Header */}
      <header className="bg-surface-1 border-b border-border/40 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-lg mx-auto">
          <h1 className="text-base font-bold text-foreground">Scegli il tuo piano</h1>
          <p className="text-[11px] text-muted-foreground">Basato sul tuo livello · puoi cambiare in qualsiasi momento</p>
        </div>
        {/* Step indicator */}
        <div className="flex items-center gap-1.5 mt-3 max-w-lg mx-auto">
          {["Questionario", "Risultato", "Piano"].map((s, idx) => (
            <div key={s} className="flex items-center gap-1 flex-1">
              <div className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0",
                idx < 2 ? "bg-primary/20 text-primary" :
                idx === 2 ? "bg-primary text-primary-foreground" :
                "bg-border text-muted-foreground"
              )}>
                {idx < 2 ? "✓" : idx + 1}
              </div>
              {idx < 2 && <div className="flex-1 h-px bg-border/60" />}
            </div>
          ))}
        </div>
      </header>

      <div className="flex-1 px-4 py-6 pb-10 max-w-lg mx-auto w-full space-y-4">

        {/* Intro copy */}
        <div className="text-center space-y-1 pb-2">
          <p className="text-xs text-muted-foreground">Il piano consigliato per il tuo profilo è evidenziato</p>
        </div>

        {/* Cards */}
        {PLANS.map((plan) => {
          const isRecommended = plan.level === level;
          const isAnnual = annualMode[plan.key] ?? false;

          return (
            <div
              key={plan.key}
              className={cn(
                "rounded-2xl border-2 p-5 space-y-4 transition-all",
                plan.color,
                isRecommended ? "ring-2 ring-primary/40 bg-primary/5" : "bg-surface-1"
              )}
            >
              {/* Plan header */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", plan.badgeBg)}>
                      {plan.badge}
                    </span>
                    {isRecommended && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary flex items-center gap-1">
                        <Star className="w-2.5 h-2.5" /> Consigliato per te
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-black text-foreground">{plan.name}</h2>
                  <p className="text-xs text-muted-foreground leading-snug">{plan.tagline}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-2xl font-black text-foreground">{plan.priceLabel}</span>
                  <span className="text-xs text-muted-foreground">{plan.period}</span>
                </div>
              </div>

              {/* Annual toggle */}
              {plan.annualLabel && (
                <button
                  onClick={() => setAnnualMode(prev => ({ ...prev, [plan.key]: !prev[plan.key] }))}
                  className={cn(
                    "w-full text-[11px] text-left px-3 py-2 rounded-lg border transition-colors",
                    isAnnual
                      ? "border-primary/40 bg-primary/5 text-primary font-semibold"
                      : "border-border/40 text-muted-foreground hover:border-primary/30"
                  )}
                >
                  {isAnnual ? "✓ " : ""}{plan.annualLabel}
                </button>
              )}

              {/* Features */}
              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground/80">{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Stripe */}
              <button
                onClick={() => handleStripe(
                  plan.key,
                  isAnnual ? "annuale" : "mensile",
                  (isAnnual && plan.stripeAnnual) ? plan.stripeAnnual : plan.stripeMonthly
                )}
                className={cn(
                  "w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors",
                  plan.ctaColor
                )}
              >
                Inizia ora <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}

        {/* Trust bar */}
        <div className="rounded-2xl border border-border/40 bg-surface-1 p-4 space-y-3">
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { icon: ShieldCheck, text: "Segreto professionale" },
              { icon: Clock, text: "Disdici quando vuoi" },
              { icon: Zap, text: "Inizia oggi" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <p className="text-[10px] text-muted-foreground font-medium leading-tight">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Già utente */}
        <div className="text-center pt-2 pb-6">
          <p className="text-xs text-muted-foreground mb-2">Hai già un account StandUpWay?</p>
          <button
            onClick={handleAppLogin}
            className="text-sm font-semibold text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            Entra nell'app →
          </button>
        </div>

      </div>
    </div>
  );
}
