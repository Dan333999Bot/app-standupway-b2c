import { useState } from "react";
import { Calendar, Users, MapPin, Globe, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import italiaMappa from "@/assets/italia-mappa.png";

interface SedeEvent {
  id: number; title: string; date: string; time: string; type: string; attendees: number;
}
interface Sede {
  id: string; city: string; region: string;
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

export const InSedeEventi = () => {
  const [selectedSede, setSelectedSede] = useState<string | null>(null);
  const activeSede = sedi.find(s => s.id === selectedSede);

  return (
    <div className="py-4 space-y-4">
      <div className="rounded-lg p-3 border-l-2 border-primary/50 bg-surface-2">
        <p className="text-xs text-muted-foreground">
          Tocca una città sulla mappa o selezionala sotto per vedere gli eventi in programma.
        </p>
      </div>

      {/* Mappa Italia */}
      <div className="glass-card rounded-2xl p-4 bg-surface-1">
        <div className="relative w-full max-w-[240px] mx-auto">
          <img src={italiaMappa} alt="Mappa sedi StandUp Italia" className="w-full h-auto opacity-25" />
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

      {/* Events for selected city */}
      {activeSede && (
        <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-foreground text-sm">Eventi a {activeSede.city}</h3>
            </div>
            <button onClick={() => setSelectedSede(null)} className="text-muted-foreground hover:text-foreground p-1">
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
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{evento.attendees} iscritti</span>
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

      {!activeSede && (
        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground">☝️ Seleziona una città per vedere gli eventi locali</p>
        </div>
      )}
    </div>
  );
};
