import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { HeaderActions } from "@/components/HeaderActions";
import { Calendar, Users, Clock, Play, BookOpen, MapPin, Video, Globe, X, Check, CreditCard, Building2, Wifi, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import italiaMappa from "@/assets/italia-mappa.png";

const corsiOnDemand = [
  { id: 1, title: "Fondamenti del Recupero", description: "Le basi per iniziare il tuo percorso di cambiamento", duration: "2h 30min", lessons: 8, price: "Gratuito", free: true, image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop" },
  { id: 2, title: "Capire la Dipendenza", description: "Cos'è la dipendenza e come funziona il cervello", duration: "1h 20min", lessons: 5, price: "Gratuito", free: true, image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=300&fit=crop" },
  { id: 3, title: "Gestire i Trigger", description: "Tecniche pratiche per riconoscere e gestire i trigger quotidiani", duration: "1h 45min", lessons: 6, price: "29€", free: false, image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&h=300&fit=crop" },
  { id: 4, title: "Mindfulness per il Recupero", description: "Pratiche di consapevolezza per la vita quotidiana", duration: "3h 15min", lessons: 12, price: "39€", free: false, image: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=300&fit=crop" },
  { id: 5, title: "Ricostruire le Relazioni", description: "Come riparare e costruire relazioni sane dopo la dipendenza", duration: "2h 00min", lessons: 7, price: "35€", free: false, image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop" },
  { id: 6, title: "Prevenzione delle Ricadute", description: "Strategie concrete per prevenire le ricadute nel lungo termine", duration: "2h 30min", lessons: 9, price: "39€", free: false, image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop" },
  { id: 7, title: "Gestione dello Stress", description: "Tecniche di rilassamento e gestione dello stress quotidiano", duration: "1h 50min", lessons: 7, price: "29€", free: false, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop" },
  { id: 8, title: "Nutrizione e Recupero", description: "L'importanza dell'alimentazione nel percorso di recupero", duration: "1h 30min", lessons: 6, price: "29€", free: false, image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop" },
  { id: 9, title: "Sonno e Benessere", description: "Migliorare la qualità del sonno durante il recupero", duration: "1h 15min", lessons: 5, price: "29€", free: false, image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=300&fit=crop" },
  { id: 10, title: "Costruire una Nuova Identità", description: "Riscoprire chi sei al di là della dipendenza", duration: "3h 00min", lessons: 10, price: "49€", free: false, image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=300&fit=crop" },
];

interface SedeEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  type: string;
  attendees: number;
}

interface Sede {
  id: string;
  city: string;
  region: string;
  coords: { top: string; left: string };
  events: SedeEvent[];
}

const sedi: Sede[] = [
  {
    id: "milano", city: "Milano", region: "Lombardia",
    coords: { top: "22%", left: "38%" },
    events: [
      { id: 201, title: "Basement Talk: Storie di Rinascita", date: "20 Mar 2026", time: "19:00", type: "talk", attendees: 25 },
      { id: 202, title: "Workshop Intensivo Mindfulness", date: "27 Mar 2026", time: "10:00 - 17:00", type: "workshop", attendees: 18 },
      { id: 203, title: "Gruppo Aperto Serale", date: "3 Apr 2026", time: "20:30", type: "gruppo", attendees: 12 },
    ],
  },
  {
    id: "torino", city: "Torino", region: "Piemonte",
    coords: { top: "24%", left: "26%" },
    events: [
      { id: 204, title: "Basement Talk: La Forza del Gruppo", date: "22 Mar 2026", time: "18:30", type: "talk", attendees: 20 },
      { id: 205, title: "Incontro Famiglie", date: "5 Apr 2026", time: "15:00", type: "gruppo", attendees: 15 },
    ],
  },
  {
    id: "bologna", city: "Bologna", region: "Emilia-Romagna",
    coords: { top: "36%", left: "45%" },
    events: [
      { id: 206, title: "Basement Open Mic: Raccontati", date: "25 Mar 2026", time: "20:00", type: "talk", attendees: 30 },
      { id: 207, title: "Workshop Arte-Terapia", date: "1 Apr 2026", time: "14:00 - 18:00", type: "workshop", attendees: 16 },
    ],
  },
  {
    id: "roma", city: "Roma", region: "Lazio",
    coords: { top: "52%", left: "46%" },
    events: [
      { id: 208, title: "Basement Night: Cinema e Dibattito", date: "21 Mar 2026", time: "20:30", type: "talk", attendees: 35 },
      { id: 209, title: "Gruppo Supporto Weekend", date: "29 Mar 2026", time: "11:00", type: "gruppo", attendees: 22 },
      { id: 210, title: "Workshop Scrittura Terapeutica", date: "8 Apr 2026", time: "15:00 - 19:00", type: "workshop", attendees: 14 },
    ],
  },
  {
    id: "napoli", city: "Napoli", region: "Campania",
    coords: { top: "62%", left: "52%" },
    events: [
      { id: 211, title: "Basement Talk: Ricominciare dal Sud", date: "24 Mar 2026", time: "19:00", type: "talk", attendees: 28 },
      { id: 212, title: "Camminata di Gruppo sul Lungomare", date: "30 Mar 2026", time: "09:00", type: "gruppo", attendees: 20 },
    ],
  },
  {
    id: "catania", city: "Catania", region: "Sicilia",
    coords: { top: "82%", left: "62%" },
    events: [
      { id: 213, title: "Basement Talk: Oltre la Dipendenza", date: "26 Mar 2026", time: "18:00", type: "talk", attendees: 18 },
    ],
  },
];

const getEventTypeConfig = (type: string) => {
  switch (type) {
    case "talk": return { label: "Basement Talk", color: "text-primary bg-primary/10" };
    case "workshop": return { label: "Workshop", color: "text-amber-500 bg-amber-500/10" };
    case "gruppo": return { label: "Gruppo", color: "text-emerald-500 bg-emerald-500/10" };
    default: return { label: type, color: "text-muted-foreground bg-muted" };
  }
};

const corsoLezioni = [
  { id: 1, title: "Introduzione al corso", duration: "15 min", free: true },
  { id: 2, title: "Cos'è il recupero", duration: "20 min", free: true },
  { id: 3, title: "I primi passi", duration: "18 min" },
  { id: 4, title: "Costruire le fondamenta", duration: "22 min" },
  { id: 5, title: "La routine quotidiana", duration: "19 min" },
];

const Attivita = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCorso, setSelectedCorso] = useState<typeof corsiOnDemand[0] | null>(null);
  const [showPurchase, setShowPurchase] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"carta" | "bonifico" | null>(null);
  const [selectedSede, setSelectedSede] = useState<string | null>(null);

  const activeSede = sedi.find(s => s.id === selectedSede);

  const handleCorsoClick = (corso: typeof corsiOnDemand[0]) => {
    if (corso.free) {
      navigate(`/corso/${corso.id}`);
    } else {
      setSelectedCorso(corso);
      setShowPurchase(true);
      setShowPayment(false);
      setPaymentMethod(null);
    }
  };

  const handleStartPayment = () => {
    setShowPayment(true);
  };

  const handleConfirmPayment = () => {
    toast({
      title: "Acquisto completato! ✅",
      description: `${selectedCorso?.title} - Buono studio!`,
    });
    setShowPurchase(false);
    setShowPayment(false);
    setPaymentMethod(null);
  };

  return (
    <div className="min-h-screen bg-surface-0 pb-24">
      <header className="bg-surface-1 border-b border-border/40 px-4 py-4 safe-area-top shadow-[var(--shadow-sm)]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Attività</h1>
            <p className="text-sm text-muted-foreground mt-1">Corsi online ed eventi in sede</p>
          </div>
          <HeaderActions />
        </div>
      </header>

      <div className="px-4 py-6 bg-surface-inset min-h-[calc(100vh-80px)]">
        <Tabs defaultValue="online" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="online" className="gap-1.5">
              <Wifi className="w-3.5 h-3.5" />
              Online
            </TabsTrigger>
            <TabsTrigger value="insede" className="gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              In Sede
            </TabsTrigger>
          </TabsList>

          {/* ONLINE - Corsi On Demand */}
          <TabsContent value="online" className="space-y-3">
            <div className="rounded-lg p-3 border-l-2 border-primary/50 bg-surface-2">
              <p className="text-xs text-muted-foreground">
                Corsi video da seguire quando vuoi, al tuo ritmo. Inizia dai corsi gratuiti!
              </p>
            </div>

            <div className="grid gap-3">
              {corsiOnDemand.map((corso) => (
                <button
                  key={corso.id}
                  onClick={() => handleCorsoClick(corso)}
                  className="glass-card rounded-xl overflow-hidden text-left w-full"
                >
                  <div className="relative h-28">
                    <img src={corso.image} alt={corso.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                    <div className="absolute bottom-2 left-3 right-3">
                      <h3 className="font-semibold text-foreground text-sm">{corso.title}</h3>
                    </div>
                    <div className="absolute top-2 right-2 flex items-center gap-1.5">
                      {corso.free ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/90 text-white">
                          GRATIS
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/90 text-primary-foreground">
                          {corso.price}
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
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${corso.free ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'}`}>
                        {corso.free ? "Inizia gratis" : "Acquista"}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </TabsContent>

          {/* IN SEDE - Mappa + Eventi */}
          <TabsContent value="insede" className="space-y-4">
            <div className="rounded-lg p-3 border-l-2 border-primary/50 bg-surface-2">
              <p className="text-xs text-muted-foreground">
                Tocca una città sulla mappa o selezionala sotto per vedere gli eventi in programma.
              </p>
            </div>

            {/* Mappa Italia */}
            <div className="glass-card rounded-2xl p-4 bg-surface-1">
              <div className="relative w-full max-w-[240px] mx-auto">
                <img
                  src={italiaMappa}
                  alt="Mappa sedi StandUp Italia"
                  className="w-full h-auto opacity-25"
                />
                {sedi.map((sede) => (
                  <button
                    key={sede.id}
                    onClick={() => setSelectedSede(selectedSede === sede.id ? null : sede.id)}
                    className={`absolute flex flex-col items-center transition-all duration-200 cursor-pointer ${
                      selectedSede === sede.id ? "scale-125 z-10" : "hover:scale-110"
                    }`}
                    style={{ top: sede.coords.top, left: sede.coords.left, transform: "translate(-50%, -50%)" }}
                  >
                    <div className={`relative w-3.5 h-3.5 rounded-full border-2 transition-all ${
                      selectedSede === sede.id
                        ? "bg-primary border-primary shadow-lg shadow-primary/40"
                        : "bg-primary/50 border-primary/30"
                    }`}>
                      {selectedSede === sede.id && (
                        <div className="w-full h-full rounded-full animate-ping bg-primary/40 absolute inset-0" />
                      )}
                    </div>
                    <span className={`text-[8px] font-bold whitespace-nowrap mt-0.5 transition-colors ${
                      selectedSede === sede.id ? "text-primary" : "text-foreground/60"
                    }`}>
                      {sede.city}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* City selector chips */}
            <div className="flex gap-2 flex-wrap">
              {sedi.map((sede) => (
                <button
                  key={sede.id}
                  onClick={() => setSelectedSede(selectedSede === sede.id ? null : sede.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedSede === sede.id
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  <MapPin className="w-3 h-3" />
                  {sede.city}
                  <span className="text-[10px] opacity-70">({sede.events.length})</span>
                </button>
              ))}
            </div>

            {/* Events dropdown for selected city */}
            {activeSede && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold text-foreground text-sm">
                      Eventi a {activeSede.city}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedSede(null)}
                    className="text-muted-foreground hover:text-foreground p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {activeSede.events.map((evento) => {
                  const config = getEventTypeConfig(evento.type);
                  return (
                    <div key={evento.id} className="glass-card rounded-xl p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${config.color}`}>
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={`inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full ${config.color}`}>
                            {config.label}
                          </span>
                          <h3 className="font-semibold text-foreground mt-1 text-sm">{evento.title}</h3>
                          <div className="flex flex-wrap gap-2 mt-2 text-xs text-muted-foreground">
                            <span>{evento.date}</span>
                            <span>·</span>
                            <span>{evento.time}</span>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {evento.attendees} iscritti
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button variant="secondary" size="sm" className="w-full font-medium" asChild>
                        <Link to={`/eventi/${evento.id}`}>Scopri e iscriviti</Link>
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Eventi per tutti */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-foreground text-sm">Eventi per tutti</h3>
              </div>
              {[
                { id: 301, title: "TOGETHER", subtitle: "Ritiro esperienziale di gruppo", days: "3 giorni", date: "15-17 Mag 2026", location: "Toscana", attendees: 40, color: "text-primary bg-primary/10" },
                { id: 302, title: "ARMONIA FAMILIARE", subtitle: "Percorso intensivo per famiglie", days: "4 giorni", date: "5-8 Giu 2026", location: "Umbria", attendees: 25, color: "text-pink-500 bg-pink-500/10" },
                { id: 303, title: "COMUNICAZIONE VINCENTE", subtitle: "Workshop su comunicazione e relazioni", days: "4 giorni", date: "19-22 Giu 2026", location: "Veneto", attendees: 30, color: "text-amber-500 bg-amber-500/10" },
              ].map((evento) => (
                <div key={evento.id} className="glass-card rounded-xl p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${evento.color}`}>
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full ${evento.color}`}>
                        {evento.days}
                      </span>
                      <h3 className="font-bold text-foreground mt-1 text-sm">{evento.title}</h3>
                      <p className="text-xs text-muted-foreground">{evento.subtitle}</p>
                      <div className="flex flex-wrap gap-2 mt-2 text-xs text-muted-foreground">
                        <span>{evento.date}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{evento.location}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{evento.attendees} iscritti</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" className="w-full font-medium" asChild>
                    <Link to={`/eventi/${evento.id}`}>Scopri e iscriviti</Link>
                  </Button>
                </div>
              ))}
            </div>

            {/* Nessuna sede hint */}
            {!activeSede && (
              <div className="text-center py-4">
                <p className="text-xs text-muted-foreground">
                  ☝️ Seleziona una città per vedere gli eventi locali
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Purchase popup */}
      <Dialog open={showPurchase} onOpenChange={(open) => { if (!open) { setShowPurchase(false); setShowPayment(false); setPaymentMethod(null); } }}>
        <DialogContent className="max-w-[360px] rounded-2xl">
          {selectedCorso && !showPayment && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedCorso.title}</DialogTitle>
                <DialogDescription>{selectedCorso.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <img src={selectedCorso.image} alt={selectedCorso.title} className="w-full h-36 object-cover rounded-xl" />
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{selectedCorso.duration}</span>
                    <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{selectedCorso.lessons} lezioni</span>
                  </div>
                  <h4 className="text-xs font-semibold text-foreground mt-3">Contenuto del corso:</h4>
                  <div className="space-y-1.5">
                    {corsoLezioni.map((lez) => (
                      <div key={lez.id} className="flex items-center gap-2 text-xs p-2 rounded-lg bg-secondary/30">
                        <Play className="w-3 h-3 text-primary flex-shrink-0" />
                        <span className="flex-1 text-foreground">{lez.title}</span>
                        <span className="text-muted-foreground">{lez.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border/30">
                  <span className="text-lg font-bold text-foreground">{selectedCorso.price}</span>
                  <Button onClick={handleStartPayment}>
                    Acquista ora
                  </Button>
                </div>
              </div>
            </>
          )}

          {selectedCorso && showPayment && (
            <>
              <DialogHeader>
                <DialogTitle>Pagamento</DialogTitle>
                <DialogDescription>{selectedCorso.title} — {selectedCorso.price}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground">Seleziona il metodo di pagamento:</p>
                
                <button
                  onClick={() => setPaymentMethod("carta")}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${paymentMethod === "carta" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Carta di credito/debito</p>
                    <p className="text-[10px] text-muted-foreground">Visa, Mastercard, Amex</p>
                  </div>
                  {paymentMethod === "carta" && <Check className="w-4 h-4 text-primary ml-auto" />}
                </button>

                <button
                  onClick={() => setPaymentMethod("bonifico")}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${paymentMethod === "bonifico" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Bonifico bancario</p>
                    <p className="text-[10px] text-muted-foreground">Riceverai le coordinate via email</p>
                  </div>
                  {paymentMethod === "bonifico" && <Check className="w-4 h-4 text-primary ml-auto" />}
                </button>

                {paymentMethod === "carta" && (
                  <div className="space-y-3 pt-2 border-t border-border/30">
                    <div>
                      <label className="text-xs font-medium text-foreground">Numero carta</label>
                      <input className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground" placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-medium text-foreground">Scadenza</label>
                        <input className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground" placeholder="MM/AA" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-foreground">CVV</label>
                        <input className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground" placeholder="123" />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "bonifico" && (
                  <div className="p-3 rounded-xl bg-secondary/30 space-y-1.5">
                    <p className="text-xs font-medium text-foreground">Coordinate bancarie:</p>
                    <p className="text-[11px] text-muted-foreground">IBAN: IT60 X054 2811 1010 0000 0123 456</p>
                    <p className="text-[11px] text-muted-foreground">Intestato a: StandUp Srl</p>
                    <p className="text-[11px] text-muted-foreground">Causale: Corso - {selectedCorso.title}</p>
                  </div>
                )}

                <Button onClick={handleConfirmPayment} disabled={!paymentMethod} className="w-full">
                  {paymentMethod === "bonifico" ? "Conferma ordine" : `Paga ${selectedCorso.price}`}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default Attivita;
