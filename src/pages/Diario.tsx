import { BottomNav } from "@/components/BottomNav";
import { HeaderActions } from "@/components/HeaderActions";
import { JournalingSection } from "@/components/JournalingSection";
import { ObjectivesSection } from "@/components/ObjectivesSection";
import { 
  Flame, 
  Activity,
  Sparkles,
} from "lucide-react";

const Diario = () => {
  const cleanDays = 47;
  const tpaPercentage = 78;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="glass border-b border-border/50 px-4 py-4 safe-area-top">
        <div className="flex items-center justify-between relative">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Il tuo Diario</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Traccia il tuo percorso giorno per giorno
            </p>
          </div>
          <HeaderActions />
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Main Stats - Clean Days & TPA */}
        <div className="grid grid-cols-2 gap-3">
          {/* Giorni di Pulizia */}
          <div className="glass-card rounded-xl p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full -mr-10 -mt-10" />
            <Sparkles className="w-5 h-5 text-primary mb-2" />
            <p className="text-3xl font-bold text-foreground">{cleanDays}</p>
            <p className="text-xs text-muted-foreground">Giorni di pulizia</p>
            <div className="mt-2 flex items-center gap-1">
              <Flame className="w-3 h-3 text-primary" />
              <span className="text-[10px] text-primary font-medium">Record: 52 giorni</span>
            </div>
          </div>

          {/* TPA - Tasso Partecipazione Attività */}
          <div className="glass-card rounded-xl p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -mr-10 -mt-10" />
            <Activity className="w-5 h-5 text-green-500 mb-2" />
            <p className="text-3xl font-bold text-foreground">{tpaPercentage}%</p>
            <p className="text-xs text-muted-foreground">TPA Settimanale</p>
            <div className="mt-2">
              <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${tpaPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Journaling Section with History */}
        <JournalingSection />

        {/* Objectives Section */}
        <ObjectivesSection />
      </div>

      <BottomNav />
    </div>
  );
};

export default Diario;
