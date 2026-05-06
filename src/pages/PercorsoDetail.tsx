import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CalendarRange, RotateCcw, Clock, MapPin, Video, UserCheck, Users, Stethoscope, Shield, Check, CreditCard, Building2, Star, Heart, Brain, HandHeart, Sparkles, ShieldCheck, MessageCircleHeart, HeartHandshake, Activity, CalendarDays, ChevronLeft, ClipboardList, Globe, Building, RefreshCw } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { format, addDays, startOfWeek, endOfWeek } from "date-fns";
import { it } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import coachMarco from "@/assets/coach-marco.jpg";
import coachLucia from "@/assets/coach-lucia.jpg";
import coachAndrea from "@/assets/coach-andrea.jpg";
import coachSara from "@/assets/coach-sara.jpg";
import coachPaolo from "@/assets/coach-paolo.jpg";
import coachElena from "@/assets/coach-elena.jpg";
import italiaMappa from "@/assets/italia-mappa.png";

interface Servizio {
  title: string;
  shortDesc: string;
  details: string;
  price: string;
  priceValue: number;
  priceNote?: string;
  icon: React.ElementType;
  highlight?: boolean;
  modalità: "online" | "sede" | "entrambi";
  detraibile: boolean;
  onlyOnline?: boolean;
}

const sedi = [
  { name: "Milano", region: "Lombardia" },
  { name: "Torino", region: "Piemonte" },
  { name: "Roma", region: "Lazio" },
  { name: "Napoli", region: "Campania" },
  { name: "Bologna", region: "Emilia-Romagna" },
  { name: "Firenze", region: "Toscana" },
];

const serviziCards = [
  {
    title: "Percorso completo",
    icon: ShieldCheck,
    secondaryIcon: Sparkles,
    highlight: true,
    emoji: "🛡️",
    cardDesc: "È la soluzione più completa e quella che consigliamo.\n\nUn percorso intensivo e personalizzato, della durata da 3 a 12 mesi (o più), costruito su misura per te.\n\nHai tutto incluso: gruppi settimanali, un professionista dedicato, visite mediche e un'équipe specializzata in dipendenze.\n\n✅ Compila il questionario, scegli giorno e orario e prenota il tuo colloquio conoscitivo.",
  },
  {
    title: "Gruppi per una settimana",
    icon: HeartHandshake,
    secondaryIcon: Users,
    highlight: false,
    emoji: "👥",
    cardDesc: "Per una settimana partecipi a tutti i gruppi online insieme ad altre persone che stanno vivendo la tua stessa situazione.\n\nOgni gruppo è guidato da un professionista specializzato in dipendenze. Si parla di emozioni, di come affrontare i momenti difficili e ci si aiuta a vicenda.\n\n📅 Scegli tu la settimana che preferisci, in base ai tuoi impegni.",
  },
  {
    title: "Supporto individuale per una settimana",
    icon: MessageCircleHeart,
    secondaryIcon: Heart,
    highlight: false,
    emoji: "💬",
    cardDesc: "Per una settimana hai un professionista specializzato in dipendenze dedicato solo a te.\n\nTi scrive ogni giorno, ti chiama quando ne hai bisogno e ti aiuta a restare in carreggiata. È come avere qualcuno che cammina al tuo fianco, ogni giorno.\n\n📅 Scegli tu la settimana in cui iniziare, in base alle tue esigenze.",
  },
  {
    title: "Colloquio con terapeuta",
    icon: Brain,
    secondaryIcon: UserCheck,
    highlight: false,
    emoji: "🧠",
    cardDesc: "Prenoti un incontro di un'ora con un terapeuta specializzato in dipendenze che ti ascolta senza giudicarti.\n\nTi fa delle domande per capire come stai e insieme decidete cosa fare. Non sei obbligato a continuare: anche un solo incontro va benissimo.\n\n📅 Scegli tu giorno e orario, in base alla tua disponibilità.\n\n✅ Il primo colloquio è sempre gratuito.",
  },
  {
    title: "Visita con psichiatra",
    icon: Activity,
    secondaryIcon: Stethoscope,
    highlight: false,
    emoji: "⚕️",
    cardDesc: "Incontri uno psichiatra specializzato in dipendenze che valuta la tua situazione dal punto di vista medico.\n\nTi spiega con parole semplici cosa sta succedendo al tuo corpo e alla tua mente, e ti consiglia eventuali terapie farmacologiche di supporto.\n\n📅 Scegli tu giorno e orario, puoi farlo in videochiamata oppure di persona.",
  },
];

const servizi: Servizio[] = [
  {
    title: "Percorso completo di trattamento",
    shortDesc: "Programma personalizzato 3-12 mesi",
    details: "Include colloqui, gruppi, supporto quotidiano e visite mediche. Tutto è personalizzato in base alle tue esigenze.",
    price: "Personalizzato",
    priceValue: 0,
    priceNote: "Prima chiamata gratuita",
    icon: Shield,
    highlight: true,
    modalità: "online",
    detraibile: true,
  },
  {
    title: "Colloquio con professionista",
    shortDesc: "Sessione 1h con specialista",
    details: "Parli con un professionista che ti ascolta, capisce la tua situazione e ti aiuta a trovare la strada giusta. Nessun impegno: puoi prenotare anche un solo incontro.",
    price: "49€",
    priceValue: 49,
    priceNote: "Il primo colloquio è gratuito",
    icon: UserCheck,
    modalità: "entrambi",
    detraibile: true,
  },
  {
    title: "Attività di gruppo settimanali",
    shortDesc: "Tutte le sessioni di gruppo per una settimana",
    details: "Ogni settimana ci sono gruppi guidati da professionisti su temi come gestione delle emozioni, prevenzione delle ricadute e supporto tra pari.",
    price: "80€/sett.",
    priceValue: 80,
    icon: Users,
    modalità: "online",
    detraibile: true,
    onlyOnline: true,
  },
  {
    title: "Supporto individuale settimanale",
    shortDesc: "Un professionista dedicato per una settimana",
    details: "Hai una persona di riferimento che ti scrive, ti chiama e ti supporta quotidianamente.",
    price: "80€/sett.",
    priceValue: 80,
    icon: UserCheck,
    modalità: "online",
    detraibile: true,
    onlyOnline: true,
  },
  {
    title: "Visita medico/psichiatra",
    shortDesc: "Consulto 1h con medico specializzato",
    details: "Se hai bisogno di un parere medico o psichiatrico, puoi prenotare una visita. Il medico valuterà la tua situazione e ti consiglierà il percorso più adatto.",
    price: "120€/h",
    priceValue: 120,
    icon: Stethoscope,
    modalità: "entrambi",
    detraibile: true,
  },
];

const percorsiData: Record<string, {
  title: string;
  subtitle: string;
  description: string;
  approach: string;
  coachName: string;
  coachImage: string;
}> = {
  "crack-cocaina": {
    title: "Dipendenza Crack/Cocaina",
    subtitle: "Parla con un esperto specializzato in dipendenza da crack e cocaina",
    description: "La dipendenza da crack e cocaina è tra le più devastanti: agisce rapidamente sul cervello creando una dipendenza fisica e psicologica intensa.",
    approach: "Il nostro percorso Crack/Cocaina prevede supporto online quotidiano tramite chat, videochiamate e gruppi virtuali, integrato da visite in sede presso i nostri studi convenzionati per le fasi che richiedono presenza fisica.",
    coachName: "Marco",
    coachImage: coachMarco,
  },
  "alcol": {
    title: "Dipendenza da Alcool",
    subtitle: "Parla con un esperto specializzato in dipendenza da alcool",
    description: "La dipendenza da alcool è forse la più sottovalutata ma anche la più pericolosa.",
    approach: "Il percorso Alcool combina sessioni online giornaliere con visite mediche in sede per il monitoraggio fisico. Offriamo gruppi di auto-mutuo aiuto virtuali, colloqui individuali in videochiamata e visite specialistiche nei nostri studi convenzionati.",
    coachName: "Lucia",
    coachImage: coachLucia,
  },
  "ludopatia": {
    title: "Ludopatia",
    subtitle: "Parla con un esperto specializzato in gioco d'azzardo patologico",
    description: "Il gioco d'azzardo può distruggere famiglie, relazioni e patrimoni interi. La ludopatia è una dipendenza comportamentale che richiede un intervento specifico.",
    approach: "Il percorso Ludopatia include consulenza finanziaria online, terapia cognitivo-comportamentale in videochiamata e sessioni in sede per interventi più strutturati.",
    coachName: "Andrea",
    coachImage: coachAndrea,
  },
  "oppiacei": {
    title: "Oppiacei, Metadone, Fentanyl",
    subtitle: "Parla con un esperto specializzato in dipendenza da oppioidi",
    description: "La dipendenza da oppiacei è una delle più difficili da superare per la forte componente fisica.",
    approach: "Il percorso Oppiacei richiede un monitoraggio medico costante: le visite in sede sono fondamentali per il protocollo di riduzione scalare, mentre il supporto psicologico quotidiano avviene online.",
    coachName: "Paolo",
    coachImage: coachPaolo,
  },
  "famiglie": {
    title: "Supporto Famiglie",
    subtitle: "Parla con un esperto per supportare un familiare con dipendenza",
    description: "Avere un familiare con dipendenza è devastante. Ti aiutiamo a capire come supportare il tuo caro senza perdere te stesso.",
    approach: "Il percorso Famiglie è prevalentemente online: sessioni di family coaching in videochiamata, gruppi di supporto virtuali e un piano di intervento strutturato.",
    coachName: "Elena",
    coachImage: coachElena,
  },
  "cannabis": {
    title: "Cannabis",
    subtitle: "Parla con un esperto specializzato in dipendenza da cannabis",
    description: "La dipendenza da cannabis è spesso minimizzata ma può avere un impatto significativo sulla motivazione, la memoria e le relazioni.",
    approach: "Il percorso Cannabis si svolge principalmente online con sessioni di motivational interviewing, gruppi di supporto e coaching quotidiano. Per chi preferisce, sono disponibili colloqui in sede.",
    coachName: "Marco",
    coachImage: coachMarco,
  },
  "sesso-pornografia": {
    title: "Sesso e Pornografia",
    subtitle: "Parla con un esperto specializzato in dipendenza sessuale",
    description: "La dipendenza da sesso e pornografia può distruggere relazioni e autostima. Ti offriamo uno spazio sicuro e non giudicante.",
    approach: "Il percorso prevede terapia online specializzata per garantire massima riservatezza, con strumenti di digital detox e sessioni individuali in videochiamata.",
    coachName: "Sara",
    coachImage: coachSara,
  },
};

const PercorsoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const percorso = id ? percorsiData[id] : null;

  // Service dialog state
  const [selectedService, setSelectedService] = useState<Servizio | null>(null);
  const [dialogStep, setDialogStep] = useState<"modalita" | "sede" | "date" | "payment">("modalita");
  const [selectedModalita, setSelectedModalita] = useState<"online" | "sede" | null>(null);
  const [selectedSede, setSelectedSede] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedWeeks, setSelectedWeeks] = useState<Date[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isRecurring, setIsRecurring] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"carta" | "bonifico" | null>(null);

  // Percorso completo dialog state
  const [showPercorsoForm, setShowPercorsoForm] = useState(false);
  const [percorsoStep, setPercorsoStep] = useState<"modalita" | "sede" | "datetime" | "payment" | "questionnaire" | "confirmed">("modalita");
  const [percorsoModalita, setPercorsoModalita] = useState<"online" | "sede" | null>(null);
  const [percorsoSede, setPercorsoSede] = useState<string | null>(null);
  const [percorsoDate, setPercorsoDate] = useState<Date | undefined>(undefined);
  const [percorsoTime, setPercorsoTime] = useState<string | null>(null);
  const [percorsoPaymentMethod, setPercorsoPaymentMethod] = useState<"carta" | "bonifico" | null>(null);
  const [questionnaireData, setQuestionnaireData] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    dipendenza: "", durata: "", speso: "", percorsiPassati: "",
    percorsiDettagli: "", curaFarmacologica: "", farmaci: "",
    condizionamento: "", residenza: "", conChiVivi: "", supporto: "",
    familiare: "", cittaVicina: "", situazioneLavorativa: "",
    orariEsigenze: "", mettersiInGioco: "", motivazione: "", rischio: "",
  });

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center', containScroll: false, dragFree: false });
  const [activeSlide, setActiveSlide] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveSlide(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi, onSelect]);

  const isWeeklyService = (service: Servizio | null) => {
    if (!service) return false;
    return service.title.includes("gruppo") || service.title.includes("Supporto individuale");
  };

  const getWeeklyTotal = () => {
    if (!selectedService) return 0;
    return selectedWeeks.length * selectedService.priceValue;
  };

  const toggleWeek = (date: Date) => {
    const monday = startOfWeek(date, { weekStartsOn: 1 });
    const exists = selectedWeeks.find(w => w.getTime() === monday.getTime());
    if (exists) {
      setSelectedWeeks(prev => prev.filter(w => w.getTime() !== monday.getTime()));
    } else {
      setSelectedWeeks(prev => [...prev, monday]);
    }
  };

  const getWeekDays = (mondays: Date[]) => {
    const days: Date[] = [];
    mondays.forEach(monday => {
      for (let i = 0; i < 7; i++) {
        days.push(addDays(monday, i));
      }
    });
    return days;
  };

  const handleServiceClick = (servizio: Servizio) => {
    if (servizio.highlight) {
      setShowPercorsoForm(true);
      setPercorsoStep("modalita");
      setPercorsoModalita(null);
      setPercorsoSede(null);
      setPercorsoDate(undefined);
      setPercorsoTime(null);
      setPercorsoPaymentMethod(null);
    } else {
      setSelectedService(servizio);
      setSelectedModalita(null);
      setSelectedSede(null);
      setSelectedDate(undefined);
      setSelectedWeeks([]);
      setSelectedTime(null);
      setIsRecurring(false);
      setPaymentMethod(null);
      // Weekly services are online-only, skip modalita
      if (servizio.onlyOnline) {
        setSelectedModalita("online");
        setDialogStep("date");
      } else {
        setDialogStep("modalita");
      }
    }
  };

  const handleConfirmPayment = () => {
    const timeInfo = selectedTime ? ` alle ${selectedTime}` : "";
    const weekInfo = selectedWeeks.length > 1 ? ` (${selectedWeeks.length} settimane)` : "";
    toast({ title: "Prenotazione confermata! ✅", description: `${selectedService?.title}${weekInfo} — ${isWeeklyService(selectedService) ? selectedWeeks.map(w => format(w, "d MMM", { locale: it })).join(", ") : format(selectedDate!, "d MMMM yyyy", { locale: it })}${timeInfo}` });
    setSelectedService(null);
  };

  const handlePercorsoPayment = () => {
    if (!percorsoPaymentMethod) return;
    setPercorsoStep("questionnaire");
  };

  const handlePercorsoBooking = () => {
    if (!questionnaireData.firstName || !questionnaireData.lastName || !questionnaireData.phone || !questionnaireData.email || !questionnaireData.dipendenza) return;
    setPercorsoStep("confirmed");
    setTimeout(() => {
      setShowPercorsoForm(false);
      setPercorsoStep("modalita");
      setQuestionnaireData({
        firstName: "", lastName: "", email: "", phone: "",
        dipendenza: "", durata: "", speso: "", percorsiPassati: "",
        percorsiDettagli: "", curaFarmacologica: "", farmaci: "",
        condizionamento: "", residenza: "", conChiVivi: "", supporto: "",
        familiare: "", cittaVicina: "", situazioneLavorativa: "",
        orariEsigenze: "", mettersiInGioco: "", motivazione: "", rischio: "",
      });
      toast({ title: "Colloquio prenotato! ✅", description: `Il tuo colloquio è confermato per ${format(percorsoDate!, "EEEE d MMMM yyyy", { locale: it })} alle ore ${percorsoTime}${percorsoModalita === "sede" ? ` — sede di ${percorsoSede}` : " — online"}` });
    }, 2500);
  };

  // Shared components
  const ModalitaSelector = ({ value, onChange }: { value: "online" | "sede" | null; onChange: (v: "online" | "sede") => void }) => (
    <div className="space-y-3">
      <button
        onClick={() => onChange("online")}
        className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${value === "online" ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/30"}`}
      >
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Video className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">Online</p>
          <p className="text-[11px] text-muted-foreground">In videochiamata, comodamente da casa tua</p>
        </div>
        {value === "online" && <Check className="w-5 h-5 text-primary" />}
      </button>
      <button
        onClick={() => onChange("sede")}
        className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${value === "sede" ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/30"}`}
      >
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Building className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">In sede</p>
          <p className="text-[11px] text-muted-foreground">Di persona, presso una delle nostre sedi in Italia</p>
        </div>
        {value === "sede" && <Check className="w-5 h-5 text-primary" />}
      </button>
    </div>
  );

  const SedeSelector = ({ value, onChange }: { value: string | null; onChange: (v: string) => void }) => (
    <div className="space-y-4">
      <div className="flex justify-center">
        <img src={italiaMappa} alt="Mappa sedi Italia" className="w-32 h-auto opacity-80" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {sedi.map((sede) => (
          <button
            key={sede.name}
            onClick={() => onChange(sede.name)}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${value === sede.name ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/30"}`}
          >
            <MapPin className={`w-4 h-4 ${value === sede.name ? "text-primary" : "text-muted-foreground"}`} />
            <span className="text-sm font-medium text-foreground">{sede.name}</span>
            <span className="text-[10px] text-muted-foreground">{sede.region}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const TimeSlotGrid = ({ selectedTime: time, onSelect }: { selectedTime: string | null; onSelect: (t: string) => void }) => (
    <div className="space-y-2">
      <p className="text-xs font-medium text-foreground">Scegli l'orario:</p>
      <div className="grid grid-cols-3 gap-2">
        {["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"].map((t) => (
          <button
            key={t}
            onClick={() => onSelect(t)}
            className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${time === t ? 'bg-primary text-primary-foreground border-primary shadow-md' : 'border-border bg-card text-foreground hover:border-primary/30'}`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );

  if (!percorso) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-foreground mb-4">Percorso non trovato</h1>
          <Button onClick={() => navigate("/percorsi")} variant="outline">Torna ai percorsi</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="glass border-b border-border/50 px-4 py-4 safe-area-top">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Indietro</span>
        </button>
      </header>

      <div className="px-5 py-8 space-y-6 max-w-lg mx-auto">
        <div className="space-y-3">
          <h1 className="text-xl font-bold text-foreground leading-tight">{percorso.title}</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Scegli tu come ricevere aiuto. Puoi iniziare con il supporto che senti più adatto a te — un colloquio, un gruppo, o una visita medica — senza nessun obbligo.
          </p>
        </div>

        {/* Carousel servizi */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-foreground">Scegli il supporto per te</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Scorri per vedere tutte le opzioni</p>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground animate-pulse">
              <span className="text-[10px]">Scorri</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
          <div className="overflow-hidden -mx-5 cursor-grab active:cursor-grabbing" ref={emblaRef}>
            <div className="flex">
              {serviziCards.map((card, idx) => {
                const Icon = card.icon;
                const SecondaryIcon = card.secondaryIcon;
                const isHighlight = card.highlight;
                const isActive = activeSlide === idx;
                return (
                  <div key={idx} className="flex-[0_0_75%] min-w-0 px-2">
                    <button
                      onClick={() => {
                        if (isHighlight) {
                          setShowPercorsoForm(true);
                          setPercorsoStep("modalita");
                          setPercorsoModalita(null);
                          setPercorsoSede(null);
                          setPercorsoDate(undefined);
                          setPercorsoTime(null);
                          setPercorsoPaymentMethod(null);
                        } else {
                          const matchTitle = card.title === "Colloquio con terapeuta" ? "Colloquio con professionista"
                            : card.title === "Visita con psichiatra" ? "Visita medico/psichiatra"
                            : card.title === "Gruppi per una settimana" ? "Attività di gruppo settimanali"
                            : card.title === "Supporto individuale per una settimana" ? "Supporto individuale settimanale"
                            : card.title;
                          const match = servizi.find(s => s.title === matchTitle);
                          if (match) handleServiceClick(match);
                        }
                      }}
                      className={`w-full h-[420px] rounded-2xl p-5 text-left transition-all duration-300 flex flex-col justify-between border ${isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-60'} ${isHighlight ? 'border-primary/40 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent shadow-lg shadow-primary/10' : 'border-border/60 bg-gradient-to-br from-card via-card to-secondary/20'}`}
                    >
                      <div className="space-y-3 overflow-hidden">
                        <div className="flex items-start justify-between">
                          <div className="relative">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${isHighlight ? 'bg-primary/20' : 'bg-secondary/60'}`}>
                              {card.emoji}
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${isHighlight ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                              <SecondaryIcon className="w-2.5 h-2.5" />
                            </div>
                          </div>
                          {isHighlight && (
                            <span className="inline-flex items-center gap-1 text-[9px] px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground font-bold animate-pulse-subtle">
                              <Star className="w-2.5 h-2.5" /> CONSIGLIATO
                            </span>
                          )}
                        </div>

                        <h3 className={`text-base font-bold leading-tight ${isHighlight ? 'text-primary' : 'text-foreground'}`}>{card.title}</h3>

                        <div className={`h-0.5 w-10 rounded-full ${isHighlight ? 'bg-primary/40' : 'bg-border'}`} />

                        <p className="text-[11px] text-muted-foreground leading-relaxed whitespace-pre-line line-clamp-[10]">{card.cardDesc}</p>
                      </div>

                      <div className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-xs transition-all ${isHighlight ? 'bg-primary text-primary-foreground shadow-md' : 'bg-secondary/80 text-foreground'}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {isHighlight ? 'Richiedi info' : 'Scopri di più'}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center gap-1.5 pt-2">
            {serviziCards.map((_, idx) => (
              <button
                key={idx}
                onClick={() => emblaApi?.scrollTo(idx)}
                className={`w-2 h-2 rounded-full transition-all ${activeSlide === idx ? 'bg-primary w-5' : 'bg-border'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ============ SERVICE DIALOG ============ */}
      <Dialog open={!!selectedService} onOpenChange={(open) => { if (!open) setSelectedService(null); }}>
        <DialogContent className="max-w-[380px] rounded-2xl max-h-[90vh] overflow-y-auto">
          {selectedService && (
            <>
              {/* ---- Step: Modalità ---- */}
              {dialogStep === "modalita" && (
                <>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-base">
                      <Globe className="w-5 h-5 text-primary" />
                      Come preferisci?
                    </DialogTitle>
                    <DialogDescription className="text-left">
                      Scegli se vuoi fare {selectedService.title.toLowerCase()} online in videochiamata oppure di persona in una delle nostre sedi.
                    </DialogDescription>
                  </DialogHeader>
                  <ModalitaSelector value={selectedModalita} onChange={(v) => setSelectedModalita(v)} />
                  <Button
                    onClick={() => {
                      if (selectedModalita === "sede") {
                        setDialogStep("sede");
                      } else {
                        setDialogStep("date");
                      }
                    }}
                    disabled={!selectedModalita}
                    className="w-full"
                  >
                    Continua <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </>
              )}

              {/* ---- Step: Sede ---- */}
              {dialogStep === "sede" && (
                <>
                  <DialogHeader>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setDialogStep("modalita")} className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
                        <ChevronLeft className="w-4 h-4 text-foreground" />
                      </button>
                      <div>
                        <DialogTitle className="text-base">Scegli la sede</DialogTitle>
                        <DialogDescription>Seleziona la sede più vicina a te</DialogDescription>
                      </div>
                    </div>
                  </DialogHeader>
                  <SedeSelector value={selectedSede} onChange={(v) => setSelectedSede(v)} />
                  <Button
                    onClick={() => setDialogStep("date")}
                    disabled={!selectedSede}
                    className="w-full"
                  >
                    Continua <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </>
              )}

              {/* ---- Step: Date ---- */}
              {dialogStep === "date" && (
                <>
                  <DialogHeader>
                    <div className="flex items-center gap-2">
                      <button onClick={() => {
                        if (selectedModalita === "sede") setDialogStep("sede");
                        else if (selectedService.onlyOnline) { /* can't go back */ }
                        else setDialogStep("modalita");
                      }} className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
                        <ChevronLeft className="w-4 h-4 text-foreground" />
                      </button>
                      <div>
                        <DialogTitle className="flex items-center gap-2 text-base">
                          <CalendarDays className="w-5 h-5 text-primary" />
                          {isWeeklyService(selectedService) ? "Scegli le settimane" : "Scegli giorno e orario"}
                        </DialogTitle>
                        <DialogDescription className="text-left text-xs">
                          {isWeeklyService(selectedService)
                            ? "Seleziona una o più settimane. Puoi anche attivare il rinnovo automatico."
                            : `Scegli giorno e orario per il tuo appuntamento${selectedSede ? ` a ${selectedSede}` : " online"}.`}
                        </DialogDescription>
                      </div>
                    </div>
                  </DialogHeader>

                  <div className="space-y-4">
                    {/* Service summary */}
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                      <selectedService.icon className="w-5 h-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">{selectedService.title}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {selectedModalita === "sede" && selectedSede ? `📍 Sede di ${selectedSede}` : "💻 Online"}
                        </p>
                      </div>
                      <span className="ml-auto text-sm font-bold text-foreground">
                        {isWeeklyService(selectedService) && selectedWeeks.length > 0
                          ? `${getWeeklyTotal()}€`
                          : selectedService.price}
                      </span>
                    </div>

                    {/* Calendar */}
                    {isWeeklyService(selectedService) ? (
                      <>
                        <Calendar
                          mode="single"
                          selected={undefined}
                          onSelect={(date) => {
                            if (date) toggleWeek(date);
                          }}
                          locale={it}
                          disabled={(date) => date < addDays(new Date(), 1)}
                          modifiers={{
                            weekRange: getWeekDays(selectedWeeks),
                          }}
                          modifiersClassNames={{
                            weekRange: "!bg-destructive/20 !text-destructive font-semibold rounded-none first:rounded-l-md last:rounded-r-md",
                          }}
                          className="rounded-xl border border-border pointer-events-auto mx-auto"
                        />

                        {/* Week count + price */}
                        {selectedWeeks.length > 0 && (
                          <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 space-y-1.5">
                            <p className="text-[11px] text-muted-foreground font-medium">Hai selezionato:</p>
                            <div className="space-y-1">
                              {selectedWeeks.sort((a, b) => a.getTime() - b.getTime()).map((w, i) => (
                                <p key={i} className="text-xs text-foreground">
                                  📅 {format(w, "d MMM", { locale: it })} — {format(endOfWeek(w, { weekStartsOn: 1 }), "d MMM yyyy", { locale: it })}
                                </p>
                              ))}
                            </div>
                            <div className="flex items-center justify-between pt-1 border-t border-border/30">
                              <span className="text-xs text-muted-foreground">{selectedWeeks.length} settiman{selectedWeeks.length === 1 ? "a" : "e"} × {selectedService.priceValue}€</span>
                              <span className="text-sm font-bold text-foreground">{getWeeklyTotal()}€</span>
                            </div>
                          </div>
                        )}

                        {/* Recurring toggle */}
                        <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-secondary/20">
                          <div className="flex items-center gap-2">
                            <RefreshCw className="w-4 h-4 text-primary" />
                            <div>
                              <p className="text-sm font-medium text-foreground">Rinnovo automatico</p>
                              <p className="text-[10px] text-muted-foreground">Si rinnova ogni settimana automaticamente</p>
                            </div>
                          </div>
                          <Switch checked={isRecurring} onCheckedChange={setIsRecurring} />
                        </div>
                      </>
                    ) : (
                      <>
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            setSelectedDate(date);
                            setSelectedTime(null);
                          }}
                          locale={it}
                          disabled={(date) => date < addDays(new Date(), 1)}
                          className="rounded-xl border border-border pointer-events-auto mx-auto"
                        />
                        {selectedDate && (
                          <TimeSlotGrid selectedTime={selectedTime} onSelect={setSelectedTime} />
                        )}
                        {selectedDate && selectedTime && (
                          <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 space-y-1">
                            <p className="text-[11px] text-muted-foreground font-medium">Hai scelto:</p>
                            <p className="text-sm font-semibold text-foreground capitalize">
                              {format(selectedDate, "EEEE d MMMM yyyy", { locale: it })} — ore {selectedTime}
                            </p>
                            {selectedService.priceNote && (
                              <p className="text-[10px] text-primary font-medium">✅ {selectedService.priceNote}</p>
                            )}
                          </div>
                        )}
                      </>
                    )}

                    <Button
                      onClick={() => setDialogStep("payment")}
                      disabled={isWeeklyService(selectedService) ? selectedWeeks.length === 0 : (!selectedDate || !selectedTime)}
                      className="w-full"
                    >
                      Continua al pagamento <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </>
              )}

              {/* ---- Step: Payment ---- */}
              {dialogStep === "payment" && (
                <>
                  <DialogHeader>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setDialogStep("date")} className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
                        <ChevronLeft className="w-4 h-4 text-foreground" />
                      </button>
                      <div>
                        <DialogTitle className="text-base">Pagamento</DialogTitle>
                        <DialogDescription>{selectedService.title}</DialogDescription>
                      </div>
                    </div>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div className="p-3 rounded-xl bg-secondary/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <selectedService.icon className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-foreground">{selectedService.title}</span>
                        </div>
                        <span className="text-sm font-bold text-foreground">
                          {isWeeklyService(selectedService) ? `${getWeeklyTotal()}€` : selectedService.price}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <CalendarDays className="w-3.5 h-3.5" />
                        <span className="capitalize">
                          {isWeeklyService(selectedService)
                            ? `${selectedWeeks.length} settiman${selectedWeeks.length === 1 ? "a" : "e"}`
                            : `${format(selectedDate!, "d MMM yyyy", { locale: it })} — ore ${selectedTime}`}
                        </span>
                      </div>
                      {selectedModalita === "sede" && selectedSede && (
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Sede di {selectedSede}</span>
                        </div>
                      )}
                      {isRecurring && (
                        <div className="flex items-center gap-1.5 text-[10px] text-primary">
                          <RefreshCw className="w-3 h-3" /> Rinnovo automatico attivo
                        </div>
                      )}
                      {selectedService.detraibile && (
                        <div className="flex items-center gap-1.5 text-[10px] text-primary">
                          <Check className="w-3 h-3" /> Spesa sanitaria detraibile
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-medium text-foreground">Come vuoi pagare?</p>
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
                          <p className="text-[10px] text-muted-foreground">Riceverai coordinate via email</p>
                        </div>
                        {paymentMethod === "bonifico" && <Check className="w-4 h-4 text-primary ml-auto" />}
                      </button>
                    </div>

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
                      <div className="p-3 rounded-xl bg-secondary/30 space-y-1">
                        <p className="text-xs font-medium text-foreground">Coordinate bancarie:</p>
                        <p className="text-[11px] text-muted-foreground">IBAN: IT60 X054 2811 1010 0000 0123 456</p>
                        <p className="text-[11px] text-muted-foreground">Intestato a: StandUp Srl</p>
                        <p className="text-[11px] text-muted-foreground">Causale: {selectedService.title}</p>
                      </div>
                    )}

                    <Button onClick={handleConfirmPayment} disabled={!paymentMethod} className="w-full">
                      {paymentMethod === "bonifico" ? "Conferma ordine" : `Paga ${isWeeklyService(selectedService) ? getWeeklyTotal() + "€" : selectedService.price}`}
                    </Button>
                  </div>
                </>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ============ PERCORSO COMPLETO DIALOG ============ */}
      <Dialog open={showPercorsoForm} onOpenChange={(open) => { if (!open) setShowPercorsoForm(false); }}>
        <DialogContent className="max-w-[400px] rounded-2xl max-h-[90vh] overflow-y-auto">

          {/* Step indicator */}
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground flex-wrap">
            {[
              { key: "modalita", label: "Modalità" },
              { key: "datetime", label: "Data" },
              { key: "payment", label: "Pagamento" },
              { key: "questionnaire", label: "Questionario" },
            ].map((step, i, arr) => {
              const steps = ["modalita", "sede", "datetime", "payment", "questionnaire", "confirmed"];
              const currentIdx = steps.indexOf(percorsoStep);
              const stepIdx = steps.indexOf(step.key);
              const isDone = currentIdx > stepIdx || percorsoStep === "confirmed";
              const isCurrent = percorsoStep === step.key || (step.key === "modalita" && percorsoStep === "sede");
              return (
                <span key={step.key} className="flex items-center gap-1">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${isCurrent ? "bg-primary text-primary-foreground" : isDone ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {isDone ? "✓" : i + 1}
                  </span>
                  <span className={isCurrent ? "text-primary font-semibold" : ""}>{step.label}</span>
                  {i < arr.length - 1 && <div className="w-4 h-px bg-border mx-0.5" />}
                </span>
              );
            })}
          </div>

          {/* ---- Confirmed ---- */}
          {percorsoStep === "confirmed" && (
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
                <Check className="w-7 h-7 text-primary" />
              </div>
              <p className="text-sm font-semibold text-foreground">Colloquio prenotato!</p>
              <p className="text-xs text-muted-foreground">Riceverai una conferma via email e un promemoria prima dell'appuntamento.</p>
            </div>
          )}

          {/* ---- Step 1: Modalità ---- */}
          {percorsoStep === "modalita" && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-base">
                  <Globe className="w-5 h-5 text-primary" />
                  Come preferisci il colloquio?
                </DialogTitle>
                <DialogDescription className="text-left text-xs">
                  Scegli se vuoi fare il colloquio conoscitivo online oppure di persona in una delle nostre sedi.
                </DialogDescription>
              </DialogHeader>

              <div className="p-3 rounded-xl bg-secondary/30 border border-border/50 space-y-1.5 text-[11px] text-muted-foreground">
                <p><span className="font-medium text-foreground">Percorso intensivo personalizzato</span> — durata da 3 a 12+ mesi</p>
                <div className="flex items-center gap-1.5 pt-1">
                  <Check className="w-3 h-3 text-primary flex-shrink-0" />
                  <span>Spesa sanitaria <span className="font-medium text-foreground">detraibile al 100%</span></span>
                </div>
              </div>

              <ModalitaSelector value={percorsoModalita} onChange={(v) => setPercorsoModalita(v)} />
              <Button
                onClick={() => {
                  if (percorsoModalita === "sede") setPercorsoStep("sede");
                  else setPercorsoStep("datetime");
                }}
                disabled={!percorsoModalita}
                className="w-full"
              >
                Continua <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </>
          )}

          {/* ---- Step 1b: Sede ---- */}
          {percorsoStep === "sede" && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPercorsoStep("modalita")} className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
                    <ChevronLeft className="w-4 h-4 text-foreground" />
                  </button>
                  <div>
                    <DialogTitle className="text-base">Scegli la sede</DialogTitle>
                    <DialogDescription>Seleziona la sede più vicina a te</DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <SedeSelector value={percorsoSede} onChange={(v) => setPercorsoSede(v)} />
              <Button
                onClick={() => setPercorsoStep("datetime")}
                disabled={!percorsoSede}
                className="w-full"
              >
                Continua <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </>
          )}

          {/* ---- Step 2: Date/Time ---- */}
          {percorsoStep === "datetime" && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <button onClick={() => {
                    if (percorsoModalita === "sede") setPercorsoStep("sede");
                    else setPercorsoStep("modalita");
                  }} className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
                    <ChevronLeft className="w-4 h-4 text-foreground" />
                  </button>
                  <div>
                    <DialogTitle className="text-base flex items-center gap-2">
                      <CalendarDays className="w-5 h-5 text-primary" />
                      Scegli giorno e orario
                    </DialogTitle>
                    <DialogDescription className="text-left text-xs">
                      Seleziona quando vuoi fare il colloquio conoscitivo{percorsoSede ? ` a ${percorsoSede}` : " online"}.
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4">
                <Calendar
                  mode="single"
                  selected={percorsoDate}
                  onSelect={(date) => {
                    setPercorsoDate(date);
                    setPercorsoTime(null);
                  }}
                  locale={it}
                  disabled={(date) => date < addDays(new Date(), 1) || date.getDay() === 0}
                  className="rounded-xl border border-border pointer-events-auto mx-auto"
                />

                {percorsoDate && (
                  <TimeSlotGrid selectedTime={percorsoTime} onSelect={setPercorsoTime} />
                )}

                {percorsoDate && percorsoTime && (
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 space-y-1">
                    <p className="text-[11px] text-muted-foreground font-medium">Hai scelto:</p>
                    <p className="text-sm font-semibold text-foreground capitalize">
                      {format(percorsoDate, "EEEE d MMMM yyyy", { locale: it })} — ore {percorsoTime}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {percorsoModalita === "sede" ? `📍 Sede di ${percorsoSede}` : "💻 Online in videochiamata"}
                    </p>
                  </div>
                )}

                <Button
                  onClick={() => setPercorsoStep("payment")}
                  disabled={!percorsoDate || !percorsoTime}
                  className="w-full"
                >
                  Continua al pagamento <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </>
          )}

          {/* ---- Step 3: Payment ---- */}
          {percorsoStep === "payment" && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPercorsoStep("datetime")} className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
                    <ChevronLeft className="w-4 h-4 text-foreground" />
                  </button>
                  <div>
                    <DialogTitle className="text-base">Pagamento colloquio</DialogTitle>
                    <DialogDescription>Paga il colloquio conoscitivo per confermare la prenotazione</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-secondary/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Colloquio conoscitivo</span>
                    <span className="text-sm font-bold text-foreground">49€</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <CalendarDays className="w-3.5 h-3.5" />
                    <span className="capitalize">{percorsoDate && format(percorsoDate, "d MMM yyyy", { locale: it })} — ore {percorsoTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    {percorsoModalita === "sede" ? <MapPin className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
                    <span>{percorsoModalita === "sede" ? `Sede di ${percorsoSede}` : "Online"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-primary">
                    <Check className="w-3 h-3" /> Spesa sanitaria detraibile
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-foreground">Come vuoi pagare?</p>
                  <button
                    onClick={() => setPercorsoPaymentMethod("carta")}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${percorsoPaymentMethod === "carta" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Carta di credito/debito</p>
                      <p className="text-[10px] text-muted-foreground">Visa, Mastercard, Amex</p>
                    </div>
                    {percorsoPaymentMethod === "carta" && <Check className="w-4 h-4 text-primary ml-auto" />}
                  </button>
                  <button
                    onClick={() => setPercorsoPaymentMethod("bonifico")}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${percorsoPaymentMethod === "bonifico" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Bonifico bancario</p>
                      <p className="text-[10px] text-muted-foreground">Riceverai coordinate via email</p>
                    </div>
                    {percorsoPaymentMethod === "bonifico" && <Check className="w-4 h-4 text-primary ml-auto" />}
                  </button>
                </div>

                {percorsoPaymentMethod === "carta" && (
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

                {percorsoPaymentMethod === "bonifico" && (
                  <div className="p-3 rounded-xl bg-secondary/30 space-y-1">
                    <p className="text-xs font-medium text-foreground">Coordinate bancarie:</p>
                    <p className="text-[11px] text-muted-foreground">IBAN: IT60 X054 2811 1010 0000 0123 456</p>
                    <p className="text-[11px] text-muted-foreground">Intestato a: StandUp Srl</p>
                    <p className="text-[11px] text-muted-foreground">Causale: Colloquio conoscitivo</p>
                  </div>
                )}

                <Button onClick={handlePercorsoPayment} disabled={!percorsoPaymentMethod} className="w-full">
                  {percorsoPaymentMethod === "bonifico" ? "Conferma e compila questionario" : "Paga 49€ e compila questionario"}
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </>
          )}

          {/* ---- Step 4: Questionnaire ---- */}
          {percorsoStep === "questionnaire" && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <div>
                    <DialogTitle className="flex items-center gap-2 text-base">
                      <ClipboardList className="w-5 h-5 text-primary" />
                      Questionario conoscitivo
                    </DialogTitle>
                    <DialogDescription className="text-left text-xs">
                      Pagamento completato! Compila il questionario per permetterci di preparare il tuo piano personalizzato.
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4">
                {/* Personal info */}
                <div className="space-y-3 pt-1">
                  <p className="text-xs font-semibold text-foreground">Dati personali</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-medium text-foreground">Nome *</label>
                      <Input value={questionnaireData.firstName} onChange={(e) => setQuestionnaireData(prev => ({ ...prev, firstName: e.target.value }))} placeholder="Mario" className="mt-1 h-9 text-sm" />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-foreground">Cognome *</label>
                      <Input value={questionnaireData.lastName} onChange={(e) => setQuestionnaireData(prev => ({ ...prev, lastName: e.target.value }))} placeholder="Rossi" className="mt-1 h-9 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-foreground">Email *</label>
                    <Input type="email" value={questionnaireData.email} onChange={(e) => setQuestionnaireData(prev => ({ ...prev, email: e.target.value }))} placeholder="mario@email.com" className="mt-1 h-9 text-sm" />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-foreground">Telefono *</label>
                    <Input value={questionnaireData.phone} onChange={(e) => setQuestionnaireData(prev => ({ ...prev, phone: e.target.value }))} placeholder="+39 333 1234567" className="mt-1 h-9 text-sm" />
                  </div>
                </div>

                {/* Questionnaire */}
                <div className="space-y-4 pt-2 border-t border-border/30">
                  <p className="text-xs font-semibold text-foreground">La tua situazione</p>

                  <div>
                    <label className="text-[11px] font-medium text-foreground">Qual è oggi la dipendenza che vuoi affrontare? *</label>
                    <Textarea value={questionnaireData.dipendenza} onChange={(e) => setQuestionnaireData(prev => ({ ...prev, dipendenza: e.target.value }))} placeholder="Es. alcol, cocaina, gioco d'azzardo..." className="mt-1 min-h-[50px] text-sm" />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-foreground">Da quanto tempo questa situazione è diventata un problema?</label>
                    <Input value={questionnaireData.durata} onChange={(e) => setQuestionnaireData(prev => ({ ...prev, durata: e.target.value }))} placeholder="Es. 6 mesi, 2 anni..." className="mt-1 h-9 text-sm" />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-foreground">Ti sei fatto un conto di quanto hai speso su per giù?</label>
                    <Input value={questionnaireData.speso} onChange={(e) => setQuestionnaireData(prev => ({ ...prev, speso: e.target.value }))} placeholder="Es. circa 5.000€, non saprei..." className="mt-1 h-9 text-sm" />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-foreground">Hai già svolto percorsi di cura in passato?</label>
                    <Input value={questionnaireData.percorsiPassati} onChange={(e) => setQuestionnaireData(prev => ({ ...prev, percorsiPassati: e.target.value }))} placeholder="Sì / No" className="mt-1 h-9 text-sm" />
                  </div>

                  {(questionnaireData.percorsiPassati.toLowerCase().includes("sì") || questionnaireData.percorsiPassati.toLowerCase().includes("si")) && (
                    <div>
                      <label className="text-[11px] font-medium text-foreground">Quali percorsi e cosa non ha funzionato / perché si è interrotto?</label>
                      <Textarea value={questionnaireData.percorsiDettagli} onChange={(e) => setQuestionnaireData(prev => ({ ...prev, percorsiDettagli: e.target.value }))} placeholder="Raccontaci brevemente..." className="mt-1 min-h-[50px] text-sm" />
                    </div>
                  )}

                  <div>
                    <label className="text-[11px] font-medium text-foreground">Attualmente stai seguendo una cura farmacologica?</label>
                    <Input value={questionnaireData.curaFarmacologica} onChange={(e) => setQuestionnaireData(prev => ({ ...prev, curaFarmacologica: e.target.value }))} placeholder="Sì / No" className="mt-1 h-9 text-sm" />
                  </div>

                  {(questionnaireData.curaFarmacologica.toLowerCase().includes("sì") || questionnaireData.curaFarmacologica.toLowerCase().includes("si")) && (
                    <div>
                      <label className="text-[11px] font-medium text-foreground">Indica farmaci (nome e, se possibile, dose) e da chi sono prescritti</label>
                      <Textarea value={questionnaireData.farmaci} onChange={(e) => setQuestionnaireData(prev => ({ ...prev, farmaci: e.target.value }))} placeholder="Es. Naltrexone 50mg, prescritto dal Dr..." className="mt-1 min-h-[50px] text-sm" />
                    </div>
                  )}

                  <div>
                    <label className="text-[11px] font-medium text-foreground">Quanto senti che la dipendenza condiziona la tua vita quotidiana?</label>
                    <Textarea value={questionnaireData.condizionamento} onChange={(e) => setQuestionnaireData(prev => ({ ...prev, condizionamento: e.target.value }))} placeholder="Raccontaci come influenza il tuo quotidiano..." className="mt-1 min-h-[50px] text-sm" />
                  </div>
                </div>

                {/* Living situation */}
                <div className="space-y-4 pt-2 border-t border-border/30">
                  <p className="text-xs font-semibold text-foreground">La tua vita quotidiana</p>

                  <div>
                    <label className="text-[11px] font-medium text-foreground">Dove vivi attualmente? *</label>
                    <Input value={questionnaireData.residenza} onChange={(e) => setQuestionnaireData(prev => ({ ...prev, residenza: e.target.value }))} placeholder="Es. Milano, Roma..." className="mt-1 h-9 text-sm" />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-foreground">Con chi vivi attualmente?</label>
                    <Input value={questionnaireData.conChiVivi} onChange={(e) => setQuestionnaireData(prev => ({ ...prev, conChiVivi: e.target.value }))} placeholder="Es. da solo, con la famiglia, con coinquilini..." className="mt-1 h-9 text-sm" />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-foreground">Hai persone che ti supportano o conoscono la tua situazione?</label>
                    <Input value={questionnaireData.supporto} onChange={(e) => setQuestionnaireData(prev => ({ ...prev, supporto: e.target.value }))} placeholder="Sì / No" className="mt-1 h-9 text-sm" />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-foreground">Un familiare che conosce la situazione? Scrivi nome, numero e ruolo in famiglia</label>
                    <Textarea value={questionnaireData.familiare} onChange={(e) => setQuestionnaireData(prev => ({ ...prev, familiare: e.target.value }))} placeholder="Es. Maria Rossi, +39 333..., madre" className="mt-1 min-h-[50px] text-sm" />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-foreground">Tra queste qual è la città più vicina a te?</label>
                    <Input value={questionnaireData.cittaVicina} onChange={(e) => setQuestionnaireData(prev => ({ ...prev, cittaVicina: e.target.value }))} placeholder="Es. Milano, Torino, Roma, Napoli..." className="mt-1 h-9 text-sm" />
                  </div>
                </div>

                {/* Work & motivation */}
                <div className="space-y-4 pt-2 border-t border-border/30">
                  <p className="text-xs font-semibold text-foreground">Lavoro e motivazione</p>

                  <div>
                    <label className="text-[11px] font-medium text-foreground">Qual è oggi la tua situazione lavorativa?</label>
                    <Input value={questionnaireData.situazioneLavorativa} onChange={(e) => setQuestionnaireData(prev => ({ ...prev, situazioneLavorativa: e.target.value }))} placeholder="Es. impiegato, libero professionista, disoccupato..." className="mt-1 h-9 text-sm" />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-foreground">I tuoi orari di lavoro o vita presentano esigenze particolari?</label>
                    <Textarea value={questionnaireData.orariEsigenze} onChange={(e) => setQuestionnaireData(prev => ({ ...prev, orariEsigenze: e.target.value }))} placeholder="Es. turni, notti, trasferte, reperibilità..." className="mt-1 min-h-[50px] text-sm" />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-foreground">Quanto sei disposto a metterti in gioco e lavorare su te stesso?</label>
                    <Textarea value={questionnaireData.mettersiInGioco} onChange={(e) => setQuestionnaireData(prev => ({ ...prev, mettersiInGioco: e.target.value }))} placeholder="Raccontaci..." className="mt-1 min-h-[50px] text-sm" />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-foreground">Per uscire da questa situazione?</label>
                    <Textarea value={questionnaireData.motivazione} onChange={(e) => setQuestionnaireData(prev => ({ ...prev, motivazione: e.target.value }))} placeholder="Cosa ti spinge a voler cambiare..." className="mt-1 min-h-[50px] text-sm" />
                  </div>
                </div>

                {/* Safety */}
                <div className="space-y-4 pt-2 border-t border-border/30">
                  <p className="text-xs font-semibold text-foreground">Sicurezza</p>

                  <div>
                    <label className="text-[11px] font-medium text-foreground">Nelle ultime 4 settimane ti è capitato di temere seriamente per la tua vita o per la tua salute?</label>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Esempi: intossicazione, mancamenti, incidenti, blackout, overdose, perdita di coscienza.</p>
                    <Textarea value={questionnaireData.rischio} onChange={(e) => setQuestionnaireData(prev => ({ ...prev, rischio: e.target.value }))} placeholder="Racconta quello che ti senti di condividere..." className="mt-1 min-h-[50px] text-sm" />
                  </div>
                </div>

                <Button
                  onClick={handlePercorsoBooking}
                  disabled={!questionnaireData.firstName || !questionnaireData.lastName || !questionnaireData.phone || !questionnaireData.email || !questionnaireData.dipendenza}
                  className="w-full"
                >
                  Conferma prenotazione <Check className="w-4 h-4 ml-1.5" />
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

export default PercorsoDetail;
