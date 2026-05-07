import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft, Calendar, Clock, Video, Plus, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

interface Appointment {
  id: number;
  name: string;
  surname: string;
  appointment_date: string;
  appointment_time: string;
}

function formatDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("it-IT", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

const PercorsoVisite = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("sw_user_id");
    if (!userId) { setLoading(false); return; }
    supabase
      .from("appointments")
      .select("id, name, surname, appointment_date, appointment_time")
      .eq("user_id", userId)
      .order("appointment_date", { ascending: true })
      .order("appointment_time", { ascending: true })
      .then(({ data }) => {
        setAppointments(data || []);
        setLoading(false);
      });
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const upcoming = appointments.filter(a => a.appointment_date >= today);
  const past = appointments.filter(a => a.appointment_date < today);

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
            <Link to="/prenota">
              <Plus className="w-4 h-4 mr-1" /> Prenota
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : (
          <>
            {/* Prossimi appuntamenti */}
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-foreground">Prossimi appuntamenti</h2>
              {upcoming.length === 0 ? (
                <div className="glass-card rounded-xl p-5 text-center space-y-3">
                  <CalendarCheck className="w-8 h-8 text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">Nessun appuntamento in programma.</p>
                  <Button asChild size="sm">
                    <Link to="/prenota">Prenota il colloquio</Link>
                  </Button>
                </div>
              ) : (
                upcoming.map(a => (
                  <div key={a.id} className="glass-card rounded-xl p-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-green-400/10 flex items-center justify-center">
                      <Video className="w-4 h-4 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Colloquio con professionista</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span className="capitalize">{formatDate(a.appointment_date)}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {a.appointment_time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Passati */}
            {past.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-border/30">
                <h2 className="text-sm font-semibold text-muted-foreground">Passati</h2>
                {past.map(a => (
                  <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                    <div className="w-8 h-8 rounded-lg bg-green-400/10 flex items-center justify-center">
                      <Video className="w-3.5 h-3.5 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">Colloquio con professionista</p>
                      <p className="text-xs text-muted-foreground">
                        <span className="capitalize">{formatDate(a.appointment_date)}</span> · {a.appointment_time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default PercorsoVisite;
