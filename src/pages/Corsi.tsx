import { useState } from "react";
import { usePageTracking } from "@/hooks/usePageTracking";
import { trackEvent } from "@/lib/analytics";
import { BottomNav } from "@/components/BottomNav";
import { HeaderActions } from "@/components/HeaderActions";
import { BackButton } from "@/components/BackButton";
import { Clock, Play, BookOpen, Check, CreditCard, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

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

const corsoLezioni = [
  { id: 1, title: "Introduzione al corso", duration: "15 min", free: true },
  { id: 2, title: "Cos'è il recupero", duration: "20 min", free: true },
  { id: 3, title: "I primi passi", duration: "18 min" },
  { id: 4, title: "Costruire le fondamenta", duration: "22 min" },
  { id: 5, title: "La routine quotidiana", duration: "19 min" },
];

const Corsi = () => {
  usePageTracking("corsi");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCorso, setSelectedCorso] = useState<typeof corsiOnDemand[0] | null>(null);
  const [showPurchase, setShowPurchase] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"carta" | "bonifico" | null>(null);

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

  const handleStartPayment = () => setShowPayment(true);

  const handleConfirmPayment = () => {
    toast({ title: "Acquisto completato! ✅", description: `${selectedCorso?.title} - Buono studio!` });
    setShowPurchase(false);
    setShowPayment(false);
    setPaymentMethod(null);
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
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/90 text-white">GRATIS</span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/90 text-primary-foreground">{corso.price}</span>
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
                  <Button onClick={handleStartPayment}>Acquista ora</Button>
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

export default Corsi;
