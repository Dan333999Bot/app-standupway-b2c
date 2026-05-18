import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ArrowRight, ShieldCheck, Clock, Zap, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackPage, trackEvent } from "@/lib/analyticsV2";
import { useAppConfig } from "@/hooks/useAppConfig";

const PLANS = [
  {
    key: "gruppi_solo",
    badge: "Base",
    name: "Solo Gruppi",
    tagline: "Gruppi terapeutici illimitati online con la community",
    priceLabel: "97€",
    period: "/ mese",
    annualLabel: "oppure 970€/anno (risparmia 194€)",
    color: "border-emerald-500/40",
    badgeBg: "bg-emerald-500/10 text-emerald-600",
    ctaColor: "bg-red-600 hover:bg-red-700 text-white",
    features: [
      "Gruppi terapeutici online (illimitati)",
      "Accesso all'app StandUpWay",
      "Community 20.000+ persone",
      "Educatori e coach pari certificati",
      "Segreto professionale garantito",
    ],
    configMonthly: "stripe_v2_gruppi_solo_mensile_url",
    configAnnual:  "stripe_v2_gruppi_solo_annuale_url",
  },
  {
    key: "gruppi",
    badge: "Più scelto",
    name: "Gruppi + Colloquio",
    tagline: "Il percorso più scelto. Comunità + supporto individuale",
    priceLabel: "297€",
    period: "/ mese",
    annualLabel: "oppure 2.970€/anno (risparmia 594€)",
    color: "border-amber-500/40",
    badgeBg: "bg-amber-500/10 text-amber-600",
    ctaColor: "bg-red-600 hover:bg-red-700 text-white",
    highlight: true,
    features: [
      "Gruppi terapeutici online (illimitati)",
      "1 colloquio individuale a settimana",
      "Accesso all'app StandUpWay",
      "Community 20.000+ persone",
      "Educatori e coach pari certificati",
      "Segreto professionale garantito",
    ],
    configMonthly: "stripe_v2_gruppi_mensile_url",
    configAnnual:  "stripe_v2_gruppi_annuale_url",
  },
  {
    key: "completo",
    badge: "Intensivo",
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
    configMonthly: "stripe_v2_completo_mensile_url",
    configAnnual:  "stripe_v2_completo_annuale_url",
  },
];

export default function PianoStandalone() {
  const navigate = useNavigate();
  const config = useAppConfig();
  const [annualMode, setAnnualMode] = useState<Record<string, boolean>>({});

  useEffect(() => {
    trackPage("piano_standalone", {});
  }, []);

  const handleStripe = (plan: typeof PLANS[number], isAnnual: boolean) => {
    const urlKey = isAnnual ? plan.configAnnual : plan.configMonthly;
    const url = config[urlKey];
    if (!url) return;
    trackEvent("piano_standalone_stripe_click", "piano_standalone", {
      plan: plan.key, billing: isAnnual ? "annuale" : "mensile",
    });
    sessionStorage.setItem("sw_checkout_source", "v2");
    sessionStorage.setItem("sw_checkout_plan", plan.key);
    window.location.href = url;
  };

  const handleAppLogin = () => {
    trackEvent("piano_standalone_app_click", "piano_standalone", {});
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col safe-area-top safe-area-bottom">
      {/* Header */}
      <header className="bg-surface-1 border-b border-border/40 px-4 py-5 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Heart className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground leading-tight">I nostri percorsi</h1>
            <p className="text-[11px] text-muted-foreground">Puoi cambiare o disdire in qualsiasi momento</p>
          </div>
        </div>
      </header>

      <div className="flex-1 px-4 py-6 pb-10 max-w-lg mx-auto w-full space-y-4">

        {/* Cards */}
        {PLANS.map((plan) => {
          const isAnnual = annualMode[plan.key] ?? false;

          return (
            <div
              key={plan.key}
              className={cn(
                "rounded-2xl border-2 p-5 space-y-4 transition-all",
                plan.color,
                plan.highlight ? "ring-2 ring-primary/40 bg-primary/5" : "bg-surface-1"
              )}
            >
              {/* Plan header */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", plan.badgeBg)}>
                      {plan.badge}
                    </span>
                    {plan.highlight && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        ★ Il più scelto
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
                onClick={() => handleStripe(plan, isAnnual)}
                disabled={!config[isAnnual ? plan.configAnnual : plan.configMonthly]}
                className={cn(
                  "w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
                  plan.ctaColor
                )}
              >
                Inizia ora <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}

        {/* Trust bar */}
        <div className="rounded-2xl border border-border/40 bg-surface-1 p-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { icon: ShieldCheck, text: "Segreto professionale" },
              { icon: Clock,       text: "Disdici quando vuoi" },
              { icon: Zap,         text: "Inizia oggi" },
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

        {/* Entra senza pagare */}
        <div className="rounded-2xl border border-border/40 bg-surface-1 p-4 text-center space-y-2 pb-6">
          <p className="text-xs text-muted-foreground">Vuoi prima esplorare l'app gratuitamente?</p>
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
