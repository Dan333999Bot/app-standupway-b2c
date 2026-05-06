import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Calendar, Clock, MapPin, Users, Video, Globe, Tag } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

// Mock data - in produzione verrebbe da un database
const eventiData: Record<string, {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  type: string;
  location?: string;
  attendees: number;
  price: number;
  maxAttendees: number;
  details: string[];
}> = {
  "1": {
    id: 1,
    title: "Webinar: Gestire le Ricadute",
    description: "Un webinar interattivo per imparare strategie concrete su come affrontare e prevenire le ricadute nel percorso di recupero.",
    date: "18 Dic 2025",
    time: "20:00",
    type: "webinar",
    attendees: 45,
    price: 29,
    maxAttendees: 100,
    details: [
      "Durata: 90 minuti",
      "Q&A con gli esperti",
      "Materiale scaricabile incluso",
      "Registrazione disponibile per 30 giorni"
    ]
  },
  "2": {
    id: 2,
    title: "Incontro in Presenza - Milano",
    description: "Un'occasione unica per incontrare la community StandUpWay dal vivo e condividere esperienze in un ambiente sicuro e accogliente.",
    date: "22 Dic 2025",
    time: "15:00",
    type: "presenza",
    location: "Milano, Via Roma 15",
    attendees: 20,
    price: 0,
    maxAttendees: 30,
    details: [
      "Durata: 2 ore",
      "Coffee break incluso",
      "Networking con la community",
      "Supporto facilitatori presenti"
    ]
  },
  "3": {
    id: 3,
    title: "Workshop One-Day: Mindfulness",
    description: "Una giornata intensiva dedicata alle tecniche di mindfulness applicate al recupero dalle dipendenze.",
    date: "28 Dic 2025",
    time: "09:00 - 18:00",
    type: "one-day",
    location: "Roma, Centro Congressi",
    attendees: 30,
    price: 89,
    maxAttendees: 40,
    details: [
      "8 ore di formazione",
      "Pranzo incluso",
      "Kit mindfulness in omaggio",
      "Certificato di partecipazione"
    ]
  },
  "4": {
    id: 4,
    title: "Ritiro StandUp Weekend",
    description: "Un weekend immersivo in Toscana per rigenerarsi e rafforzare il proprio percorso di recupero lontano dalla routine quotidiana.",
    date: "10-12 Gen 2026",
    time: "Check-in 14:00",
    type: "multi-day",
    location: "Toscana, Villa Serenità",
    attendees: 15,
    price: 349,
    maxAttendees: 20,
    details: [
      "2 notti in camera doppia",
      "Pensione completa",
      "Sessioni di gruppo e individuali",
      "Attività outdoor e relax"
    ]
  }
};

const getTypeConfig = (type: string) => {
  switch (type) {
    case "webinar":
      return { label: "Webinar", icon: Video, color: "text-green-400 bg-green-400/10" };
    case "presenza":
      return { label: "In presenza", icon: MapPin, color: "text-orange-400 bg-orange-400/10" };
    case "one-day":
      return { label: "One-Day", icon: Calendar, color: "text-primary bg-primary/10" };
    case "multi-day":
      return { label: "Multi-Day", icon: Globe, color: "text-pink-400 bg-pink-400/10" };
    default:
      return { label: type, icon: Calendar, color: "text-muted-foreground bg-muted" };
  }
};

const EventoDetail = () => {
  const { id } = useParams();
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const evento = id ? eventiData[id] : null;

  if (!evento) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <header className="glass border-b border-border/50 px-4 py-4 safe-area-top">
          <Link to="/eventi" className="flex items-center gap-2 text-muted-foreground">
            <ArrowLeft className="w-5 h-5" />
            <span>Torna agli eventi</span>
          </Link>
        </header>
        <div className="px-4 py-12 text-center">
          <p className="text-muted-foreground">Evento non trovato</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  const config = getTypeConfig(evento.type);
  const IconComponent = config.icon;
  const spotsLeft = evento.maxAttendees - evento.attendees;

  const handleApplyDiscount = () => {
    if (discountCode.trim()) {
      setDiscountApplied(true);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="glass border-b border-border/50 px-4 py-4 safe-area-top">
        <Link to="/eventi" className="flex items-center gap-2 text-muted-foreground">
          <ArrowLeft className="w-5 h-5" />
          <span>Torna agli eventi</span>
        </Link>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Badge tipo evento */}
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${config.color}`}>
          <IconComponent className="w-4 h-4" />
          {config.label}
        </span>

        {/* Titolo e descrizione */}
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-foreground">{evento.title}</h1>
          <p className="text-muted-foreground leading-relaxed">{evento.description}</p>
        </div>

        {/* Info evento */}
        <div className="glass-card rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-foreground">{evento.date}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-foreground">{evento.time}</span>
          </div>
          {evento.location && (
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-foreground">{evento.location}</span>
            </div>
          )}
          <div className="flex items-center gap-3 text-sm">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-foreground">{evento.attendees} iscritti · {spotsLeft} posti disponibili</span>
          </div>
        </div>

        {/* Dettagli inclusi */}
        <div className="space-y-3">
          <h2 className="font-semibold text-foreground">Cosa include</h2>
          <div className="space-y-2">
            {evento.details.map((detail, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {detail}
              </div>
            ))}
          </div>
        </div>

        {/* Prezzo e acquisto */}
        <div className="glass-card rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Prezzo</span>
            <div className="text-right">
              {evento.price === 0 ? (
                <span className="text-xl font-bold text-green-500">Gratuito</span>
              ) : (
                <>
                  <span className="text-2xl font-bold text-foreground">€{evento.price}</span>
                  {discountApplied && (
                    <span className="block text-xs text-green-500">Sconto applicato!</span>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Campo codice sconto */}
          {evento.price > 0 && (
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                Hai un codice sconto?
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="Inserisci codice"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  size="default"
                  onClick={handleApplyDiscount}
                  disabled={!discountCode.trim() || discountApplied}
                >
                  Applica
                </Button>
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Button 
              variant="cta" 
              size="lg" 
              className="w-full"
              onClick={() => evento.price === 0 ? toast.success("Iscrizione completata!") : setShowCheckout(true)}
            >
              {evento.price === 0 ? "Iscriviti gratuitamente" : "Conferma partecipazione"}
            </Button>
            
            {evento.price > 0 && (
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full"
                asChild
              >
                <Link to={`/eventi/${evento.id}/checkout`}>Acquista biglietto</Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Conferma Registrazione Alert */}
      <AlertDialog open={showCheckout} onOpenChange={setShowCheckout}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Vuoi confermare la tua partecipazione?</AlertDialogTitle>
            <AlertDialogDescription>
              Stai per registrarti all'evento "{evento.title}"
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                toast.success("Registrazione confermata!");
                setShowCheckout(false);
              }}
            >
              Conferma
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BottomNav />
    </div>
  );
};

export default EventoDetail;
