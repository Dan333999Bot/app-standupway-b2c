import { useParams, Link } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { HeaderActions } from "@/components/HeaderActions";
import { ArrowLeft, Clock, Calendar, User, Users, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

const attivitaDetails: Record<string, {
  title: string;
  type: "individuale" | "gruppo";
  description: string;
  duration: string;
  frequency: string;
}> = {
  "1": {
    title: "Attività individuale con psicologo",
    type: "individuale",
    description: "Sessione privata con uno psicologo specializzato in dipendenze. Durante l'incontro lavorerai su obiettivi personali, gestione delle emozioni e strategie di coping personalizzate.",
    duration: "50 min",
    frequency: "Settimanale"
  },
  "2": {
    title: "Gruppo Routine",
    type: "gruppo",
    description: "Inizia ogni giornata con energia positiva. Questo gruppo mattutino ti aiuta a costruire una routine solida, condividere obiettivi giornalieri e ricevere motivazione dal gruppo.",
    duration: "30 min",
    frequency: "Ogni giorno"
  },
  "3": {
    title: "Gruppo DBT",
    type: "gruppo",
    description: "La Dialectical Behavior Therapy ti insegna tecniche pratiche per gestire emozioni intense, migliorare le relazioni e sviluppare la tolleranza allo stress.",
    duration: "90 min",
    frequency: "Bisettimanale"
  },
  "4": {
    title: "Gruppo Coaching",
    type: "gruppo",
    description: "Sessioni di coaching focalizzate su obiettivi concreti e azione. Lavora su pianificazione della vita, carriera, relazioni e crescita personale.",
    duration: "60 min",
    frequency: "Settimanale"
  },
  "5": {
    title: "Gruppo Supporto Famiglie",
    type: "gruppo",
    description: "Spazio sicuro per familiari e persone care. Condividi esperienze, ricevi supporto da chi vive situazioni simili e impara strategie per supportare il tuo caro.",
    duration: "75 min",
    frequency: "Settimanale"
  },
  "6": {
    title: "Attività individuale con psicologo",
    type: "individuale",
    description: "Sessione privata con uno psicologo specializzato in dipendenze. Durante l'incontro lavorerai su obiettivi personali, gestione delle emozioni e strategie di coping personalizzate.",
    duration: "50 min",
    frequency: "Settimanale"
  }
};

const AttivitaDetail = () => {
  const { id } = useParams();
  const attivita = attivitaDetails[id || "1"];

  if (!attivita) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Attività non trovata</p>
      </div>
    );
  }

  const isGruppo = attivita.type === "gruppo";

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="glass border-b border-border/50 px-4 py-4 safe-area-top">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/eventi"
              className="w-9 h-9 rounded-lg bg-secondary/50 flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-muted-foreground" />
            </Link>
            <h1 className="text-lg font-bold text-foreground">{attivita.title}</h1>
          </div>
          <HeaderActions />
        </div>
      </header>

      <div className="px-4 py-5 space-y-4">
        {/* Info rapide */}
        <div className="flex items-center gap-3">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
            isGruppo ? "text-purple-400 bg-purple-400/10" : "text-blue-400 bg-blue-400/10"
          }`}>
            {isGruppo ? <Users className="w-3 h-3" /> : <User className="w-3 h-3" />}
            {isGruppo ? "Gruppo" : "Individuale"}
          </div>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" /> {attivita.duration}
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {attivita.frequency}
          </span>
        </div>

        {/* Descrizione */}
        <p className="text-sm text-muted-foreground">{attivita.description}</p>

        {/* Badge percorso privato */}
        <div className="rounded-lg p-3 border-l-2 border-primary bg-secondary/30">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" />
            <p className="text-xs text-muted-foreground">
              Attività riservata agli iscritti al <span className="text-primary font-medium">Percorso StandUp</span>
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="glass-card rounded-xl p-4 space-y-3 mt-4">
          <p className="text-sm text-center text-muted-foreground">
            Vuoi saperne di più?
          </p>
          <Button variant="cta" className="w-full" asChild>
            <Link to="/supporto">Parla con il Supporto</Link>
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default AttivitaDetail;
