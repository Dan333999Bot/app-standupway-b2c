import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Home, CalendarDays, Loader2, ExternalLink } from "lucide-react";
import { usePageTracking } from "@/hooks/usePageTracking";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { trackEvent as trackEventV2 } from "@/lib/analyticsV2";

const APP_LOGIN = "https://app.metodostandup.it/login";

const Thankyou = () => {
  usePageTracking("thankyou");
  const [unlocked, setUnlocked] = useState(false);

  // Detect if user came from V2 funnel
  const checkoutSource = sessionStorage.getItem("sw_checkout_source");
  const checkoutPlan = sessionStorage.getItem("sw_checkout_plan");
  const isV2 = checkoutSource === "v2";

  useEffect(() => {
    localStorage.setItem("sw_first_colloquio_done", "true");
    setUnlocked(true);

    // V2: traccia conversione su funnel_v2_events e pulisci flag
    if (isV2) {
      trackEventV2("conversione_stripe", "thankyou", { plan: checkoutPlan || "unknown" });
      sessionStorage.removeItem("sw_checkout_source");
      sessionStorage.removeItem("sw_checkout_plan");
    }

    const eventId = `purchase_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    if (typeof window.fbq === "function") {
      window.fbq("track", "Purchase", {
        value: 49,
        currency: "EUR",
        content_name: "Colloquio 30min",
        content_type: "product",
      }, { eventID: eventId });
    }

    const email = sessionStorage.getItem("sw_verify_email") || "";
    const getCookie = (name: string) => {
      const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
      return match ? decodeURIComponent(match[1]) : "";
    };
    const fbp = getCookie("_fbp");
    const fbc = getCookie("_fbc");
    const userId = localStorage.getItem("sw_user_id");

    supabase.functions.invoke("meta-capi", {
      body: {
        event_name: "Purchase",
        event_id: eventId,
        email,
        fbp,
        fbc,
        external_id: userId || "",
        value: 49,
        currency: "EUR",
        event_source_url: window.location.href,
        client_user_agent: navigator.userAgent,
      },
    }).then(({ data, error }) => {
      if (error) console.error("[CAPI] error:", error);
      else console.log("[CAPI] ok:", JSON.stringify(data));
    });

    if (!userId) return;
    supabase
      .from("user_state")
      .upsert(
        { user_id: userId, first_colloquio_done: true, first_colloquio_date: new Date().toISOString() },
        { onConflict: "user_id" }
      );
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center gap-6">
      {!unlocked ? (
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      ) : (
        <>
          <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle2 className="w-11 h-11 text-green-500" />
          </div>

          <div className="space-y-2 max-w-xs">
            <h1 className="text-2xl font-bold text-foreground">Pagamento confermato!</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Il tuo percorso è attivo. Riceverai una conferma via email con tutti i dettagli.
            </p>
          </div>

          <div className="w-full max-w-xs rounded-2xl bg-primary/5 border border-primary/20 p-4 text-left space-y-1.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-primary">Cosa succede adesso</p>
            <p className="text-xs text-foreground/80 leading-relaxed">
              {isV2
                ? "Il tuo professionista ti contatterà entro 24h. Accedi all'app per iniziare il percorso."
                : "Il tuo professionista ti contatterà per confermare il giorno e l'orario. La sezione Agenda è ora sbloccata."}
            </p>
          </div>

          {isV2 ? (
            /* CTA per utenti V2 (non necessariamente loggati) */
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <Button asChild size="lg" className="w-full">
                <a href={APP_LOGIN}>
                  <ExternalLink className="w-4 h-4 mr-2" /> Entra nell'app
                </a>
              </Button>
            </div>
          ) : (
            /* CTA per utenti V1 (loggati) */
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <Button asChild size="lg" className="w-full">
                <Link to="/percorso/visite">
                  <CalendarDays className="w-4 h-4 mr-2" /> Vai all'agenda
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full">
                <Link to="/home">
                  <Home className="w-4 h-4 mr-2" /> Torna alla home
                </Link>
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Thankyou;
