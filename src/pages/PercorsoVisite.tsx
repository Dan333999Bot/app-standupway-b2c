import { useState, useEffect } from "react";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft, Calendar, Video, MapPin, Clock, Users, User, Lock, Check } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { PreferenzeProfessionista, type Preferenze } from "@/components/PreferenzeProfessionista";
import { CreditCard, ExternalLink } from "lucide-react";

const visitePassate = [
  { tipo: "online", titolo: "Colloquio con psicologo", data: "10 Mar 2026", ora: "10:00" },
  { tipo: "sede", titolo: "Visita medica", data: "5 Mar 2026", ora: "15:00", sede: "Milano" },
  { tipo: "online", titolo: "Colloquio con psicologo", data: "3 Mar 2026", ora: "10:00" },
];

const prossimeVisite = [
  { tipo: "online", titolo: "Colloquio con psicologo", data: "17 Mar 2026", ora: "10:00" },
  { tipo: "sede", titolo: "Visita psichiatrica", data: "22 Mar 2026", ora: "14:30", sede: "Milano" },
];

const attivitaPercorso = [
  { tipo: "gruppo", titolo: "Gruppo Routine", data: "Domani", ora: "08:00", icon: Users, color: "bg-purple-400/10 text-purple-400" },
  { tipo: "gruppo", titolo: "Gruppo di Coaching", data: "Mercoledì", ora: "20:00", icon: Users, color: "bg-blue-400/10 text-blue-400" },
];

const orariDisponibili = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];
const tipiVisita: { id: string; label: string; tipo: string; icon: typeof Video; price: string; stripeUrl: string; free?: boolean }[] = [
  { id: "colloquio-gratuito", label: "Primo colloquio (30 min)", tipo: "online", icon: Video, price: "49€", stripeUrl: "https://buy.stripe.com/test_PLACEHOLDER_COLLOQUIO" },
  { id: "psicologo", label: "Colloquio con psicologo (60 min)", tipo: "online", icon: Video, price: "60€", stripeUrl: "https://buy.stripe.com/test_PLACEHOLDER_PSI" },
  { id: "psichiatra", label: "Visita psichiatrica", tipo: "sede", icon: MapPin, price: "120€", stripeUrl: "https://buy.stripe.com/test_PLACEHOLDER_PSY" },
  { id: "medica", label: "Visita medica", tipo: "sede", icon: MapPin, price: "100€", stripeUrl: "https://buy.stripe.com/test_PLACEHOLDER_MED" },
];

const PercorsoVisite = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [params] = useSearchParams();
  const [showBooking, setShowBooking] = useState(false);
  const [bookingStep, setBookingStep] = useState<"type" | "preferenze" | "date" | "time" | "confirm">("type");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [pref, setPref] = useState<Preferenze | null>(null);
  const [bookedVisits, setBookedVisits] = useState(() => {
    try {
      const extra = JSON.parse(localStorage.getItem("standup_agenda_extra") || "[]");
      const mapped = extra.map((e: any) => ({
        tipo: e.tipo, titolo: e.titolo, data: e.when, ora: "",
        sede: e.tipo === "sede" ? e.location : undefined,
      }));
      return [...prossimeVisite, ...mapped];
    } catch { return prossimeVisite; }
  });

  const openBookingWith = (typeId: string) => {
    setSelectedType(typeId);
    setSelectedDate(undefined);
    setSelectedTime(null);
    setPref(null);
    setBookingStep("preferenze");
    setShowBooking(true);
  };

  useEffect(() => {
    const t = params.get("type");
    if (t) navigate("/prenota", { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openBooking = () => {
    setBookingStep("type");
    setSelectedType(null);
    setSelectedDate(undefined);
    setSelectedTime(null);
    setPref(null);
    setShowBooking(true);
  };

  const startPayment = () => {
    if (!selectedType || !selectedDate || !selectedTime) return;
    const tipo = tipiVisita.find(t => t.id === selectedType);
    if (!tipo) return;
    if (tipo.free) {
      finalizeBooking();
    } else {
      window.open(tipo.stripeUrl, "_blank");
      finalizeBooking();
    }
  };

  const finalizeBooking = () => {
    if (!selectedType || !selectedDate || !selectedTime) return;
    const tipoVisita = tipiVisita.find(t => t.id === selectedType);
    const newVisit = {
      tipo: tipoVisita?.tipo || "online",
      titolo: tipoVisita?.label || "",
      data: selectedDate.toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" }),
      ora: selectedTime,
      sede: tipoVisita?.tipo === "sede" ? "Milano" : undefined,
    };
    setBookedVisits(prev => [...prev, newVisit]);
    setShowBooking(false);
    toast({ title: "Visita prenotata! ✅", description: `${newVisit.titolo} - ${newVisit.data} alle ${newVisit.ora}` });
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
        <h1 className="text-xl font-bold text-foreground">Agenda</h1>

        {/* Prossime visite */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Prossime visite</h2>
          {bookedVisits.map((v, i) => (
            <div key={i} className="glass-card rounded-xl p-3 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${v.tipo === "online" ? "bg-green-400/10" : "bg-orange-400/10"}`}>
                {v.tipo === "online" ? <Video className="w-4 h-4 text-green-400" /> : <MapPin className="w-4 h-4 text-orange-400" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{v.titolo}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{v.data}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{v.ora}</span>
                  {v.sede && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{v.sede}</span>}
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => navigate("/prenota")}>
            Prenota nuova visita
          </Button>
        </div>

        {/* Attività del percorso */}
        <div className="space-y-4 pt-2 border-t border-border/30">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Attività del percorso</h2>
          </div>
          
          {attivitaPercorso.map((att, i) => {
            const Icon = att.icon;
            return (
              <div key={i} className="glass-card rounded-xl p-3 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${att.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{att.titolo}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span>{att.data}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{att.ora}</span>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="flex gap-2">
            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-blue-400/10 text-blue-400 font-medium">
              <User className="w-3 h-3" /> Individuali
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-purple-400/10 text-purple-400 font-medium">
              <Users className="w-3 h-3" /> Di gruppo
            </span>
          </div>
        </div>

        {/* Visite passate - in fondo */}
        <div className="space-y-3 pt-2 border-t border-border/30">
          <h2 className="text-sm font-semibold text-muted-foreground">Visite passate</h2>
          {visitePassate.map((v, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${v.tipo === "online" ? "bg-green-400/10" : "bg-orange-400/10"}`}>
                {v.tipo === "online" ? <Video className="w-3.5 h-3.5 text-green-400" /> : <MapPin className="w-3.5 h-3.5 text-orange-400" />}
              </div>
              <div className="flex-1">
                <p className="text-sm text-foreground">{v.titolo}</p>
                <p className="text-xs text-muted-foreground">{v.data} · {v.ora}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking dialog */}
      <Dialog open={showBooking} onOpenChange={setShowBooking}>
        <DialogContent className="max-w-[360px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Prenota nuova visita</DialogTitle>
            <DialogDescription>
              {bookingStep === "type" && "Seleziona il tipo di visita"}
              {bookingStep === "preferenze" && "Le tue preferenze sul professionista"}
              {bookingStep === "date" && "Scegli una data disponibile"}
              {bookingStep === "time" && "Seleziona un orario"}
              {bookingStep === "confirm" && "Conferma la prenotazione"}
            </DialogDescription>
          </DialogHeader>

          {bookingStep === "type" && (
            <div className="space-y-2">
              {tipiVisita.map(tipo => {
                const Icon = tipo.icon;
                return (
                  <button
                    key={tipo.id}
                    onClick={() => { setSelectedType(tipo.id); setBookingStep("preferenze"); }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all text-left"
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${tipo.tipo === "online" ? "bg-green-400/10" : "bg-orange-400/10"}`}>
                      <Icon className={`w-4 h-4 ${tipo.tipo === "online" ? "text-green-400" : "text-orange-400"}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{tipo.label}</p>
                      <p className="text-[10px] text-muted-foreground">{tipo.tipo === "online" ? "Videochiamata" : "In sede"}</p>
                    </div>
                    {tipo.free ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                        GRATIS
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-primary">{tipo.price}</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {bookingStep === "preferenze" && (
            <div className="space-y-3">
              <PreferenzeProfessionista
                onConfirm={(p) => { setPref(p); setBookingStep("date"); }}
              />
              <Button variant="ghost" size="sm" onClick={() => setBookingStep("type")} className="text-xs w-full">
                ← Cambia tipo
              </Button>
            </div>
          )}

          {bookingStep === "date" && (
            <div className="space-y-3">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={(date) => { setSelectedDate(date); if (date) setBookingStep("time"); }}
                disabled={(date) => date < new Date() || date.getDay() === 0}
                className={cn("p-3 pointer-events-auto mx-auto")}
              />
              <Button variant="ghost" size="sm" onClick={() => setBookingStep("preferenze")} className="text-xs">
                ← Preferenze
              </Button>
            </div>
          )}

          {bookingStep === "time" && (
            <div className="space-y-3">
              <p className="text-sm text-foreground font-medium">
                {selectedDate?.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" })}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {orariDisponibili.map(ora => (
                  <button
                    key={ora}
                    onClick={() => { setSelectedTime(ora); setBookingStep("confirm"); }}
                    className="py-2 rounded-lg border border-border text-sm font-medium hover:border-primary hover:bg-primary/5 transition-all text-foreground"
                  >
                    {ora}
                  </button>
                ))}
              </div>
              <Button variant="ghost" size="sm" onClick={() => setBookingStep("date")} className="text-xs">
                ← Cambia data
              </Button>
            </div>
          )}

          {bookingStep === "confirm" && (
            <div className="space-y-4">
              <div className="glass-card rounded-xl p-4 space-y-2">
                <p className="text-sm font-semibold text-foreground">{tipiVisita.find(t => t.id === selectedType)?.label}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedDate?.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </p>
                <p className="text-xs text-muted-foreground">Ore {selectedTime}</p>
                <p className="text-[10px] text-muted-foreground">
                  {tipiVisita.find(t => t.id === selectedType)?.tipo === "online" ? "📹 Videochiamata" : "📍 In sede - Milano"}
                </p>
                {pref && (
                  <p className="text-[10px] text-muted-foreground border-t border-border/30 pt-2">
                    Preferenze: <strong>{pref.genere}</strong> · <strong>{pref.esperienza}</strong> · <strong>{pref.approccio}</strong>
                  </p>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-border/30">
                  <span className="text-xs text-muted-foreground">Costo</span>
                  {tipiVisita.find(t => t.id === selectedType)?.free ? (
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      🎁 GRATIS
                    </span>
                  ) : (
                    <span className="text-sm font-bold text-primary">{tipiVisita.find(t => t.id === selectedType)?.price}</span>
                  )}
                </div>
              </div>
              <Button onClick={startPayment} className="w-full">
                {tipiVisita.find(t => t.id === selectedType)?.free
                  ? "Conferma prenotazione gratuita"
                  : (<><CreditCard className="w-4 h-4 mr-1.5" /> Paga con carta · {tipiVisita.find(t => t.id === selectedType)?.price} <ExternalLink className="w-3.5 h-3.5 ml-1.5" /></>)}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setBookingStep("time")} className="w-full text-xs">
                ← Cambia orario
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default PercorsoVisite;
