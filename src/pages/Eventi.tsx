import { BottomNav } from "@/components/BottomNav";
import { HeaderActions } from "@/components/HeaderActions";
import { Calendar, MapPin, Users, Video, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const eventiAperti = [
  {
    id: 1,
    title: "Webinar: Gestire le Ricadute",
    date: "18 Dic 2025",
    time: "20:00",
    type: "webinar",
    attendees: 45,
  },
  {
    id: 2,
    title: "Incontro in Presenza - Milano",
    date: "22 Dic 2025",
    time: "15:00",
    type: "presenza",
    location: "Milano, Via Roma 15",
    attendees: 20,
  },
  {
    id: 3,
    title: "Workshop One-Day: Mindfulness",
    date: "28 Dic 2025",
    time: "09:00 - 18:00",
    type: "one-day",
    location: "Roma, Centro Congressi",
    attendees: 30,
  },
  {
    id: 4,
    title: "Ritiro StandUp Weekend",
    date: "10-12 Gen 2026",
    time: "Check-in 14:00",
    type: "multi-day",
    location: "Toscana, Villa Serenità",
    attendees: 15,
  },
];

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

const Eventi = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="glass border-b border-border/50 px-4 py-4 safe-area-top">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Eventi</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Webinar, workshop e ritiri
            </p>
          </div>
          <HeaderActions />
        </div>
      </header>

      <div className="px-4 py-6 space-y-4">
        {/* Info message */}
        <div className="rounded-lg p-3 border-l-2 border-primary/50 bg-secondary/30">
          <p className="text-xs text-muted-foreground">
            Scopri gli eventi aperti a tutti e iscriviti per partecipare.
          </p>
        </div>

        {eventiAperti.map((evento) => {
          const config = getTypeConfig(evento.type);
          const IconComponent = config.icon;
          return (
            <div key={evento.id} className="glass-card rounded-xl p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${config.color}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full ${config.color}`}>
                    {config.label}
                  </span>
                  <h3 className="font-semibold text-foreground mt-1">{evento.title}</h3>
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
                  {evento.location && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {evento.location}
                    </p>
                  )}
                </div>
              </div>
              <Button variant="secondary" size="sm" className="w-full font-medium" asChild>
                <Link to={`/eventi/${evento.id}`}>Scopri e iscriviti</Link>
              </Button>
            </div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
};

export default Eventi;
