import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { trackPage, trackEvent } from "@/lib/analytics";
import { CalendarDays, Clock, UserCheck, ShieldCheck, ArrowRight, RefreshCcw, Loader2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAppConfig } from "@/hooks/useAppConfig";
import { useAuth } from "@/contexts/AuthContext";

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

export default function PrenotaBenvenuto() {
  const navigate = useNavigate();
  const config = useAppConfig();
  const { user } = useAuth();
  const stripeUrl = config["stripe_colloquio_url"];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { trackPage("prenota_benvenuto"); }, []);

  const funnel = (() => { try { return JSON.parse(sessionStorage.getItem("sw_funnel") || "{}"); } catch { return {}; } })();
  const { data, ora, professionista_genere, professionista_figura } = funnel;

  const handlePay = async () => {
    setLoading(true);
    setError("");
    try {
      await supabase.from("appointments").insert({
        user_id: user?.id || localStorage.getItem("sw_user_id"),
        appointment_date: data || null,
        appointment_time: ora || null,
        professionista_genere: professionista_genere || null,
        professionista_figura: professionista_figura || null,
      });
    } catch {}

    if (stripeUrl) {
      trackEvent("prenota_paga_click", "prenota_benvenuto");
      window.location.href = stripeUrl;
    } else {
      setError("Errore: URL pagamento non disponibile. Riprova.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col items-center justify-center px-6 safe-area-top safe-area-bottom">
      <div className="w-full max-w-sm space-y-6 py-8">

        {/* Welcome */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <span className="text-3xl">👋</span>
          </div>
          <h1 className="text-2xl font-black text-foreground">Benvenuto in StandUpWay</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Il tuo profilo è stato creato. Sei a un passo dal tuo primo colloquio.
          </p>
        </div>

        {/* Riepilogo appuntamento */}
        <div className="rounded-2xl border border-border/40 bg-surface-1 p-5 space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-primary">Il tuo appuntamento</p>
          <div className="space-y-2.5">
            {data && (
              <div className="flex items-center gap-3">
                <CalendarDays className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm font-semibold text-foreground">{data}</span>
              </div>
            )}
            {ora && (
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm text-foreground">Ore {ora} · 30 minuti</span>
              </div>
            )}
            {professionista_figura && (
              <div className="flex items-center gap-3">
                <UserCheck className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm text-foreground">
                  {FIGURA_LABEL[professionista_figura] || professionista_figura}
                  {professionista_genere && professionista_genere !== "nessuna" && ` · ${GENERE_LABEL[professionista_genere]}`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Garanzia */}
        <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/20 p-4 space-y-1.5">
          <div className="flex items-center gap-2">
            <RefreshCcw className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <p className="text-sm font-bold text-emerald-600">Rimborso garantito entro 24 ore</p>
          </div>
          <p className="text-xs text-foreground/70 leading-relaxed pl-6">
            Se dopo il colloquio non ti sei sentito capito o non sei soddisfatto, ti rimborsiamo integralmente. Nessuna domanda.
          </p>
        </div>

        {/* Privacy */}
        <div className="flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Il colloquio avviene in app, in totale riservatezza. Se avessi bisogno di supporto prima o dopo, la nostra chat è attiva 24/7. Troverai anche strumenti gratuiti per affrontare ogni giorno.
          </p>
        </div>

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        {/* CTA */}
        <Button onClick={handlePay} disabled={loading} className="w-full text-base font-semibold" size="lg">
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ArrowRight className="w-4 h-4 mr-2" />}
          {loading ? "Reindirizzamento..." : "Conferma e procedi al pagamento"}
        </Button>

        <p className="text-center text-[10px] text-muted-foreground">
          Colloquio 30 min · 49€ · Pagamento sicuro via Stripe
        </p>

        {/* Ghost CTA — home */}
        <button
          onClick={() => {
            trackEvent("prenota_home_click", "prenota_benvenuto");
            localStorage.setItem("sw_pending_appointment", JSON.stringify({ data, ora, professionista_genere, professionista_figura }));
            navigate("/home");
          }}
          className="w-full flex flex-col items-center justify-center gap-1 py-3.5 transition rounded-xl border-2 border-border hover:border-primary/40 hover:text-foreground"
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            <Home className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs font-black tracking-widest uppercase">Home</span>
          </div>
          <span className="text-[11px] text-muted-foreground/70 leading-snug text-center px-4">
            Se non sei ancora pront*, non ti preoccupare — naviga nell'app
          </span>
        </button>

      </div>
    </div>
  );
}
