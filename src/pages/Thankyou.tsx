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
    const userId = localStorage.getItem("sw_user_id");
    if (!userId) { setUnlocked(true); return; }

    supabase
      .from("user_state")
      .upsert(
        {
          user_id: userId,
          first_colloquio_done: true,
          first_colloquio_date: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )
      .then(() => setUnlocked(true));
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
