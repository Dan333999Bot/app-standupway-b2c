import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft, Calendar, Clock, Video, Plus, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface Booking {
  id: number;
  data_appuntamento: string;
  ora_appuntamento: string;
  dipendenza: string;
  status: string;
}

const DIPENDENZA_LABELS: Record<string, string> = {
  "crack-cocaina": "Crack / Cocaina",
  "alcol": "Alcool",
  "ludopatia": "Gioco d'azzardo",
  "oppiacei": "Oppiacei",
  "famiglie": "Familiari",
  "cannabis": "Cannabis",
  "sesso-pornografia": "Sesso e pornografia",
};

const PercorsoVisite = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    supabase
      .from("bookings")
      .select("id, data_appuntamento, ora_appuntamento, dipendenza, status")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setBookings(data || []);
        setLoading(false);
      });
  }, [user]);

  const STATUS_LABEL: Record<string, { label: string; color: string }> = {
    pending:   { label: "In attesa di pagamento", color: "text-amber-500 bg-amber-500/10" },
    paid:      { label: "Confermato ✓", color: "text-green-500 bg-green-500/10" },
    completed: { label: "Completato", color: "text-muted-foreground bg-secondary/50" },
    cancelled: { label: "Annullato", color: "text-red-500 bg-red-500/10" },
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="glass border-b border-border/50 px-4 py-4 safe-area-top">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Indietro</span>
        </button>
      </header>

      <div className="px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Agenda</h1>
          <Button size="sm" variant="outline" asChild>
            <Link to="/percorsi">
              <Plus className="w-4 h-4 mr-1" /> Prenota
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="glass-card rounded-xl p-5 text-center space-y-3">
            <CalendarCheck className="w-8 h-8 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">Nessun appuntamento in programma.</p>
            <Button asChild size="sm">
              <Link to="/percorsi">Prenota il colloquio</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map(b => {
              const st = STATUS_LABEL[b.status] ?? STATUS_LABEL.pending;
              return (
                <div key={b.id} className="glass-card rounded-xl p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Video className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">Colloquio con professionista</p>
                      {b.dipendenza && (
                        <p className="text-xs text-muted-foreground">{DIPENDENZA_LABELS[b.dipendenza] ?? b.dipendenza}</p>
                      )}
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0 ${st.color}`}>
                      {st.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground pl-12">
                    {b.data_appuntamento && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {b.data_appuntamento}
                      </span>
                    )}
                    {b.ora_appuntamento && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {b.ora_appuntamento}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default PercorsoVisite;
