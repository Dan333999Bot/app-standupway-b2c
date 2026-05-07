import { usePageTracking } from "@/hooks/usePageTracking";
import { trackEvent } from "@/lib/analytics";
import { BottomNav } from "@/components/BottomNav";
import { HeaderActions } from "@/components/HeaderActions";
import {
  Wine, Pill, Dices, Heart, ChevronRight, Syringe, Users, Leaf,
} from "lucide-react";
import { Link } from "react-router-dom";

const percorsi = [
  { id: "crack-cocaina", title: "Dipendenza Crack/Cocaina", description: "Percorso intensivo per uscire dalla dipendenza da crack e cocaina", icon: Pill, color: "from-red-500/30 to-red-600/20" },
  { id: "alcol", title: "Dipendenza da Alcool", description: "Supporto completo per liberarsi dalla dipendenza alcolica", icon: Wine, color: "from-purple-500/30 to-purple-600/20" },
  { id: "ludopatia", title: "Ludopatia", description: "Percorso dedicato a chi vuole uscire dal gioco d'azzardo", icon: Dices, color: "from-amber-500/30 to-amber-600/20" },
  { id: "oppiacei", title: "Oppiacei, Metadone, Fentanyl", description: "Supporto specializzato per dipendenze da oppioidi", icon: Syringe, color: "from-blue-500/30 to-blue-600/20" },
  { id: "famiglie", title: "Supporto Famiglie", description: "Per chi ha un familiare con dipendenza e vuole aiutarlo", icon: Users, color: "from-green-500/30 to-green-600/20" },
  { id: "cannabis", title: "Cannabis", description: "Percorso per liberarsi dalla dipendenza da cannabis", icon: Leaf, color: "from-emerald-500/30 to-emerald-600/20" },
  { id: "sesso-pornografia", title: "Sesso e Pornografia", description: "Percorso per liberarsi dalla dipendenza sessuale e pornografica", icon: Heart, color: "from-pink-500/30 to-pink-600/20" },
];

const Percorsi = () => {
  usePageTracking("percorsi");
  return (

    <div className="min-h-screen bg-surface-0 pb-24">
      <header className="bg-surface-1 border-b border-border/40 px-4 py-4 safe-area-top shadow-[var(--shadow-sm)]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Percorsi</h1>
            <p className="text-sm text-muted-foreground mt-1">Il tuo percorso e tutti i percorsi disponibili</p>
          </div>
          <HeaderActions />
        </div>
      </header>

      <div className="px-4 py-6 space-y-6 bg-surface-inset">
        {/* === Tutti i percorsi === */}
        <div className="space-y-3">
          <div>
            <h2 className="text-base font-semibold text-foreground">Tutti i percorsi</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Scopri i percorsi disponibili</p>
          </div>

          {percorsi.map((percorso) => (
            <Link
              key={percorso.id}
              to={`/percorsi/${percorso.id}/questionario`}
              className="glass-card rounded-xl p-4 flex items-center gap-4 group hover:border-primary/30 transition-colors block"
              onClick={() => trackEvent("percorso_click", "percorsi", { percorso: percorso.id, title: percorso.title })}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${percorso.color} flex items-center justify-center`}>
                <percorso.icon className="w-6 h-6 text-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{percorso.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{percorso.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
          ))}
        </div>
      </div>


      <BottomNav />
    </div>
  );
};

export default Percorsi;
