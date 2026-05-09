import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Home, CalendarDays, Loader2 } from "lucide-react";
import { usePageTracking } from "@/hooks/usePageTracking";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

const Thankyou = () => {
  usePageTracking("thankyou");
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    localStorage.setItem("sw_first_colloquio_done", "true");
    setUnlocked(true);

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
              Il tuo primo colloquio è prenotato. Riceverai una conferma via email con tutti i dettagli.
            </p>
          </div>

          <div className="w-full max-w-xs rounded-2xl bg-primary/5 border border-primary/20 p-4 text-left space-y-1.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-primary">Cosa succede adesso</p>
            <p className="text-xs text-foreground/80 leading-relaxed">
              Il tuo professionista ti contatterà per confermare il giorno e l'orario. La sezione <strong>Agenda</strong> è ora sbloccata — trovi tutto in "Il mio percorso".
            </p>
          </div>

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
        </>
      )}
    </div>
  );
};

export default Thankyou;
