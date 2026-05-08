import { useState } from "react";
import { usePageTracking } from "@/hooks/usePageTracking";
import { trackEvent } from "@/lib/analytics";
import { BottomNav } from "@/components/BottomNav";
import { HeaderActions } from "@/components/HeaderActions";
import { BackButton } from "@/components/BackButton";
import { Clock, Play, BookOpen, Loader2, ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface Corso {
  id: number;
  title: string;
  description: string;
  duration: string;
  lessons: number;
  price: string;
  free: boolean;
  image_url: string;
}

const CORSI: Corso[] = [
  {
    id: 1,
    title: "SPEZZA LA ROUTINE",
    description: "Tecniche pratiche per interrompere i pattern automatici che alimentano la dipendenza e costruire nuove abitudini quotidiane.",
    duration: "1h 30min",
    lessons: 6,
    price: "Gratuito",
    free: true,
    image_url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    title: "TORNA AL COMANDO",
    description: "Riprendi il controllo della tua vita attraverso esercizi pratici di consapevolezza, gestione delle emozioni e rinforzo della motivazione.",
    duration: "1h 45min",
    lessons: 7,
    price: "Gratuito",
    free: true,
    image_url: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    title: "Gestire i Trigger",
    description: "Tecniche pratiche per riconoscere e gestire i trigger quotidiani che scatenano il craving.",
    duration: "1h 45min",
    lessons: 6,
    price: "29€",
    free: false,
    image_url: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=300&fit=crop",
  },
  {
    id: 4,
    title: "Mindfulness per il Recupero",
    description: "Pratiche di consapevolezza per vivere il momento presente e ridurre l'ansia nei momenti difficili.",
    duration: "3h 15min",
    lessons: 12,
    price: "39€",
    free: false,
    image_url: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=300&fit=crop",
  },
  {
    id: 5,
    title: "Ricostruire le Relazioni",
    description: "Come riparare e costruire relazioni sane dopo la dipendenza. Comunicazione, fiducia e confini.",
    duration: "2h 00min",
    lessons: 7,
    price: "35€",
    free: false,
    image_url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop",
  },
  {
    id: 6,
    title: "Prevenzione delle Ricadute",
    description: "Strategie concrete per riconoscere i segnali di rischio e prevenire le ricadute nel lungo termine.",
    duration: "2h 30min",
    lessons: 9,
    price: "39€",
    free: false,
    image_url: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop",
  },
  {
    id: 7,
    title: "Gestione dello Stress",
    description: "Tecniche di rilassamento e gestione dello stress quotidiano senza ricorrere a sostanze.",
    duration: "1h 50min",
    lessons: 7,
    price: "29€",
    free: false,
    image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
  },
];

const Corsi = () => {
  usePageTracking("corsi");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCorso, setSelectedCorso] = useState<Corso | null>(null);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [requested, setRequested] = useState(false);

  const handleCorsoClick = (corso: Corso) => {
    if (corso.free) {
      navigate(`/corso/${corso.id}`);
    } else {
      trackEvent("corso_access_intent", "corsi", { id: corso.id, title: corso.title });
      setSelectedCorso(corso);
      setEmail("");
      setRequested(false);
    }
  };

  const handleRichiediAccesso = async () => {
    if (!email.trim()) return;
    setSubmitting(true);
    await supabase.from("course_access_requests").insert({
      corso_id: selectedCorso?.id,
      corso_title: selectedCorso?.title,
      user_id: localStorage.getItem("sw_user_id"),
      email: email.trim(),
    });
    setSubmitting(false);
    setRequested(true);
    trackEvent("corso_access_requested", "corsi", { id: selectedCorso?.id, title: selectedCorso?.title });
  };

  const closeDialog = () => {
    setSelectedCorso(null);
    setEmail("");
    setRequested(false);
  };

  return (
    <div className="min-h-screen bg-surface-0 pb-24">
      <header className="bg-surface-1 border-b border-border/40 px-4 py-4 safe-area-top shadow-[var(--shadow-sm)]">
        <div className="flex items-center gap-3">
          <BackButton />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">Corsi</h1>
            <p className="text-sm text-muted-foreground mt-1">Corsi online da seguire al tuo ritmo</p>
          </div>
          <HeaderActions />
        </div>
      </header>

      <div className="px-4 py-6 bg-surface-inset min-h-[calc(100vh-80px)] space-y-3">
        <div className="rounded-lg p-3 border-l-2 border-primary/50 bg-surface-2">
          <p className="text-xs text-muted-foreground">
            Inizia dai corsi gratuiti — i corsi a pagamento sono in arrivo presto.
          </p>
        </div>

        <div className="grid gap-3">
          {CORSI.map((corso) => (
            <button
              key={corso.id}
              onClick={() => handleCorsoClick(corso)}
              className="glass-card rounded-xl overflow-hidden text-left w-full"
            >
              <div className="relative h-28">
                <img src={corso.image_url} alt={corso.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                <div className="absolute bottom-2 left-3 right-3">
                  <h3 className="font-semibold text-foreground text-sm">{corso.title}</h3>
                </div>
                <div className="absolute top-2 right-2 flex items-center gap-1.5">
                  {corso.free ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/90 text-white">GRATIS</span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary/90 text-muted-foreground flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> In arrivo
                    </span>
                  )}
                </div>
                <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm rounded-full p-1.5">
                  <Play className="w-3.5 h-3.5 text-primary" />
                </div>
              </div>
              <div className="p-3 space-y-1.5">
                <p className="text-xs text-muted-foreground">{corso.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{corso.duration}</span>
                    <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{corso.lessons} lezioni</span>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${corso.free ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                    {corso.free ? "Inizia gratis" : "Richiedi accesso"}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Modal "Richiedi accesso" per corsi a pagamento */}
      <Dialog open={!!selectedCorso && !selectedCorso.free} onOpenChange={(open) => { if (!open) closeDialog(); }}>
        <DialogContent className="max-w-[360px] rounded-2xl">
          {selectedCorso && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base">{selectedCorso.title}</DialogTitle>
                <DialogDescription>{selectedCorso.description}</DialogDescription>
              </DialogHeader>

              {!requested ? (
                <div className="space-y-4">
                  <img src={selectedCorso.image_url} alt={selectedCorso.title} className="w-full h-36 object-cover rounded-xl" />

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{selectedCorso.duration}</span>
                    <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{selectedCorso.lessons} lezioni</span>
                    <span className="ml-auto font-semibold text-foreground">{selectedCorso.price}</span>
                  </div>

                  <div className="rounded-xl bg-primary/5 border border-primary/20 p-3 text-xs text-foreground/80 leading-relaxed">
                    Questo corso è <strong>in uscita a breve</strong>. Lascia la tua email e ti contatteremo non appena sarà disponibile.
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5">La tua email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nome@email.com"
                      className="w-full bg-secondary/50 border border-border/50 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                    />
                  </div>

                  <Button
                    onClick={handleRichiediAccesso}
                    disabled={!email.trim() || submitting}
                    className="w-full"
                  >
                    {submitting
                      ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Invio…</>
                      : <>Richiedi accesso <ArrowRight className="w-4 h-4 ml-1" /></>
                    }
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                    <span className="text-2xl">✅</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">Richiesta inviata!</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Ti contatteremo a <strong>{email}</strong> non appena il corso sarà disponibile.
                  </p>
                  <Button variant="outline" onClick={closeDialog} className="w-full mt-2">Chiudi</Button>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default Corsi;
