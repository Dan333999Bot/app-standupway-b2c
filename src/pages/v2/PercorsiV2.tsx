import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { trackPage, trackEvent } from "@/lib/analyticsV2";
import { Wine, Pill, Dices, Heart, ChevronRight, Syringe, Users, Leaf, ShieldCheck, Star } from "lucide-react";

const percorsi = [
  { id: "crack-cocaina",    title: "Crack / Cocaina",              description: "Percorso intensivo per uscire dalla dipendenza da crack e cocaina", icon: Pill,   color: "from-red-500/30 to-red-600/20" },
  { id: "alcol",            title: "Alcol",                        description: "Supporto completo per liberarsi dalla dipendenza alcolica",          icon: Wine,   color: "from-purple-500/30 to-purple-600/20" },
  { id: "ludopatia",        title: "Ludopatia",                    description: "Percorso dedicato a chi vuole uscire dal gioco d'azzardo",           icon: Dices,  color: "from-amber-500/30 to-amber-600/20" },
  { id: "oppiacei",         title: "Oppiacei / Metadone / Fentanyl", description: "Supporto specializzato per dipendenze da oppioidi",                icon: Syringe,color: "from-blue-500/30 to-blue-600/20" },
  { id: "famiglie",         title: "Supporto Famiglie",            description: "Per chi ha un familiare con dipendenza e vuole aiutarlo",            icon: Users,  color: "from-green-500/30 to-green-600/20" },
  { id: "cannabis",         title: "Cannabis",                     description: "Percorso per liberarsi dalla dipendenza da cannabis",                icon: Leaf,   color: "from-emerald-500/30 to-emerald-600/20" },
  { id: "sesso-pornografia",title: "Sesso e Pornografia",          description: "Percorso per liberarsi dalla dipendenza sessuale e pornografica",    icon: Heart,  color: "from-pink-500/30 to-pink-600/20" },
];

export default function PercorsiV2() {
  const navigate = useNavigate();

  useEffect(() => {
    trackPage("percorsi_v2");
  }, []);

  const handlePercorso = (id: string, title: string) => {
    trackEvent("percorso_v2_click", "percorsi_v2", { percorso: id, title });
    navigate(`/v2/${id}/questionario`);
  };

  return (
    <div className="min-h-screen bg-surface-0">
      {/* Header */}
      <header className="bg-surface-1 border-b border-border/40 px-4 py-5 sticky top-0 z-10">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <span className="text-white font-black text-sm">S</span>
            </div>
            <span className="text-sm font-bold text-foreground">StandUpWay</span>
          </div>
          <h1 className="text-2xl font-black text-foreground mt-3">Da dove vuoi partire?</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Scegli il percorso più vicino alla tua situazione. Faremo un test gratuito di 3 minuti.
          </p>
        </div>
      </header>

      {/* Trust strip */}
      <div className="bg-primary/5 border-b border-border/40 px-4 py-2.5">
        <div className="max-w-lg mx-auto flex items-center justify-center gap-5 flex-wrap">
          {[
            { icon: ShieldCheck, text: "100% riservato" },
            { icon: Star, text: "1.500+ persone aiutate" },
            { icon: Users, text: "Professionisti certificati" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
              <Icon className="w-3.5 h-3.5 text-primary" />
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* Percorsi list */}
      <div className="px-4 py-6 max-w-lg mx-auto space-y-3 pb-12">
        {percorsi.map((p) => (
          <button
            key={p.id}
            onClick={() => handlePercorso(p.id, p.title)}
            className="w-full glass-card rounded-xl p-4 flex items-center gap-4 group hover:border-primary/30 transition-colors text-left"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center flex-shrink-0`}>
              <p.icon className="w-6 h-6 text-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground">{p.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{p.description}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
