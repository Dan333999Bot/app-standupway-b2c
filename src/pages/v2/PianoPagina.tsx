/**
 * Pagina singolo piano — /v2/piano/:slug
 *
 * Slug disponibili:
 *   gruppi              → Solo Gruppi 97€/mese (utente)
 *   gruppi-colloquio    → Gruppi + Colloquio 297€/mese (utente)
 *   completo            → Completo 597€/mese (utente)
 *   colloquio           → Colloquio Singolo 49€ (utente)
 *   famiglie-colloquio  → Colloquio Singolo 49€ (famiglia)
 *   famiglie-gruppi     → Gruppi Famiglie 97€/mese (famiglia)
 *   famiglie-completo   → Colloquio + Gruppi 297€/mese (famiglia)
 */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Check, ArrowRight, ShieldCheck, Clock, Zap, Heart, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackPage, trackEvent } from "@/lib/analyticsV2";
import { useAppConfig } from "@/hooks/useAppConfig";

type PlanConfig = {
  name: string;
  tagline: string;
  priceLabel: string;
  period: string;
  annualLabel: string | null;
  features: string[];
  configMonthly: string;
  configAnnual?: string;
  color: string;
  badgeBg: string;
  headerBg: string;
  trackingKey: string;
};

const REGISTRY: Record<string, PlanConfig> = {
  "gruppi": {
    name: "Solo Gruppi",
    tagline: "Gruppi terapeutici online illimitati con la community",
    priceLabel: "97€",
    period: "/ mese",
    annualLabel: "oppure 970€/anno (risparmia 194€)",
    features: [
      "Gruppi terapeutici online (illimitati)",
      "Accesso all'app StandUpWay",
      "Community 20.000+ persone",
      "Educatori e coach pari certificati",
      "Segreto professionale garantito",
    ],
    configMonthly: "stripe_v2_gruppi_solo_mensile_url",
    configAnnual:  "stripe_v2_gruppi_solo_annuale_url",
    color:    "border-emerald-500/40",
    badgeBg:  "bg-emerald-500/10 text-emerald-600",
    headerBg: "bg-emerald-500/8",
    trackingKey: "gruppi_solo",
  },
  "gruppi-colloquio": {
    name: "Gruppi + Colloquio",
    tagline: "Il percorso più scelto — comunità e supporto individuale",
    priceLabel: "297€",
    period: "/ mese",
    annualLabel: "oppure 2.970€/anno (risparmia 594€)",
    features: [
      "Gruppi terapeutici online (illimitati)",
      "1 colloquio individuale al mese",
      "Accesso all'app StandUpWay",
      "Community 20.000+ persone",
      "Educatori e coach pari certificati",
      "Segreto professionale garantito",
    ],
    configMonthly: "stripe_v2_gruppi_mensile_url",
    configAnnual:  "stripe_v2_gruppi_annuale_url",
    color:    "border-amber-500/40",
    badgeBg:  "bg-amber-500/10 text-amber-600",
    headerBg: "bg-amber-500/8",
    trackingKey: "gruppi",
  },
  "completo": {
    name: "Completo",
    tagline: "Supporto totale — sempre raggiungibile, 7 giorni su 7",
    priceLabel: "597€",
    period: "/ mese",
    annualLabel: "oppure 5.970€/anno (risparmia 1.194€)",
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
    color:    "border-red-500/40",
    badgeBg:  "bg-red-500/10 text-red-600",
    headerBg: "bg-red-500/8",
    trackingKey: "completo",
  },
  "colloquio": {
    name: "Colloquio Singolo",
    tagline: "30 minuti con uno specialista — strumenti concreti per iniziare",
    priceLabel: "49€",
    period: "una tantum",
    annualLabel: null,
    features: [
      "Colloquio 1:1 di 30 min con uno specialista",
      "Piano personalizzato per te",
      "Accesso all'app StandUpWay",
      "Materiali di supporto tra le sessioni",
      "Segreto professionale garantito",
    ],
    configMonthly: "stripe_colloquio_url",
    color:    "border-primary/40",
    badgeBg:  "bg-primary/10 text-primary",
    headerBg: "bg-primary/8",
    trackingKey: "colloquio",
  },
  "famiglie-colloquio": {
    name: "Colloquio Singolo",
    tagline: "Parla con uno specialista e ottieni subito strumenti pratici per aiutare il tuo familiare",
    priceLabel: "49€",
    period: "una tantum",
    annualLabel: null,
    features: [
      "Colloquio 1:1 di 30 min con uno specialista in dipendenze",
      "Strumenti di comunicazione motivazionale",
      "Come rispondere senza alimentare conflitti",
      "Indicazioni pratiche per il passo successivo",
      "Segreto professionale garantito",
    ],
    configMonthly: "stripe_colloquio_url",
    color:    "border-primary/40",
    badgeBg:  "bg-primary/10 text-primary",
    headerBg: "bg-primary/8",
    trackingKey: "famiglie_colloquio",
  },
  "famiglie-gruppi": {
    name: "Gruppi Famiglie",
    tagline: "Supporto continuo con chi vive la tua stessa situazione",
    priceLabel: "97€",
    period: "/ mese",
    annualLabel: "oppure 970€/anno (risparmia 194€)",
    features: [
      "Gruppi di supporto riservati ai familiari (illimitati)",
      "Metodo CRAFT: come motivare chi non vuole aiuto",
      "Tecniche di comunicazione non conflittuale",
      "Community riservata famiglie",
      "Segreto professionale garantito",
    ],
    configMonthly: "stripe_v2_gruppi_solo_mensile_url",
    configAnnual:  "stripe_v2_gruppi_solo_annuale_url",
    color:    "border-emerald-500/40",
    badgeBg:  "bg-emerald-500/10 text-emerald-600",
    headerBg: "bg-emerald-500/8",
    trackingKey: "famiglie_gruppi",
  },
  "famiglie-completo": {
    name: "Colloquio + Gruppi",
    tagline: "Supporto intensivo — un professionista dedicato e i gruppi familiari",
    priceLabel: "297€",
    period: "/ mese",
    annualLabel: "oppure 2.970€/anno (risparmia 594€)",
    features: [
      "Colloqui settimanali 1:1 con uno specialista",
      "Gruppi di supporto per familiari (illimitati)",
      "Piano personalizzato per la tua situazione",
      "Strategie per avvicinare il familiare al cambiamento",
      "Community riservata famiglie",
      "Segreto professionale garantito",
    ],
    configMonthly: "stripe_v2_gruppi_mensile_url",
    configAnnual:  "stripe_v2_gruppi_annuale_url",
    color:    "border-amber-500/40",
    badgeBg:  "bg-amber-500/10 text-amber-600",
    headerBg: "bg-amber-500/8",
    trackingKey: "famiglie_completo",
  },
};

export default function PianoPagina() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const config = useAppConfig();
  const [isAnnual, setIsAnnual] = useState(false);

  const plan = slug ? REGISTRY[slug] : null;

  useEffect(() => {
    if (plan) trackPage("piano_pagina", { slug, plan: plan.trackingKey });
  }, [slug]);

  const handleStripe = () => {
    if (!plan) return;
    const urlKey = isAnnual && plan.configAnnual ? plan.configAnnual : plan.configMonthly;
    const url = config[urlKey];
    if (!url) return;
    trackEvent("piano_pagina_stripe_click", "piano_pagina", {
      slug, plan: plan.trackingKey, billing: isAnnual ? "annuale" : "mensile",
    });
    sessionStorage.setItem("sw_checkout_source", "v2");
    sessionStorage.setItem("sw_checkout_plan", plan.trackingKey);
    window.location.href = url;
  };

  const handleAppLogin = () => {
    trackEvent("piano_pagina_app_click", "piano_pagina", { slug });
    navigate("/login");
  };

  /* ── Piano non trovato ── */
  if (!plan) {
    return (
      <div className="min-h-screen bg-surface-0 flex flex-col items-center justify-center px-4 gap-4 text-center">
        <AlertCircle className="w-10 h-10 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Piano non trovato.</p>
        <button onClick={() => navigate("/v2/piano")} className="text-sm font-semibold text-primary underline">
          Vedi tutti i piani →
        </button>
      </div>
    );
  }

  const stripeUrl = config[isAnnual && plan.configAnnual ? plan.configAnnual : plan.configMonthly];

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col safe-area-top safe-area-bottom">
      {/* Header */}
      <header className="bg-surface-1 border-b border-border/40 px-4 py-5 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Heart className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground leading-tight">StandUpWay</h1>
            <p className="text-[11px] text-muted-foreground">Puoi disdire in qualsiasi momento</p>
          </div>
        </div>
      </header>

      <div className="flex-1 px-4 py-8 pb-10 max-w-lg mx-auto w-full space-y-5">

        {/* Piano card */}
        <div className={cn("rounded-2xl border-2 p-6 space-y-5", plan.color, "bg-surface-1")}>

          {/* Badge + prezzo */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1.5">
              <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-full", plan.badgeBg)}>
                {plan.name}
              </span>
              <p className="text-xs text-muted-foreground leading-snug pt-1">{plan.tagline}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-3xl font-black text-foreground">{plan.priceLabel}</p>
              <p className="text-xs text-muted-foreground">{plan.period}</p>
            </div>
          </div>

          {/* Annual toggle */}
          {plan.annualLabel && (
            <button
              onClick={() => setIsAnnual(v => !v)}
              className={cn(
                "w-full text-[11px] text-left px-3 py-2.5 rounded-lg border transition-colors",
                isAnnual
                  ? "border-primary/40 bg-primary/5 text-primary font-semibold"
                  : "border-border/40 text-muted-foreground hover:border-primary/30"
              )}
            >
              {isAnnual ? "✓ " : ""}{plan.annualLabel}
            </button>
          )}

          {/* Features */}
          <ul className="space-y-2.5">
            {plan.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-foreground/85 leading-relaxed">{f}</span>
              </li>
            ))}
          </ul>

          {/* CTA Stripe */}
          <button
            onClick={handleStripe}
            disabled={!stripeUrl}
            className="w-full py-4 rounded-xl font-bold text-base bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Inizia ora <ArrowRight className="w-5 h-5" />
          </button>

          {!stripeUrl && (
            <p className="text-center text-[11px] text-muted-foreground">Link di pagamento non ancora configurato</p>
          )}
        </div>

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
        <div className="text-center space-y-1.5 pb-4">
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
