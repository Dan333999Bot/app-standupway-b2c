import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Plus, X, Target, CheckCircle2, Circle } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface ObjectiveItem {
  id: string;
  text: string;
  completed: boolean;
}

interface DailyObjectives {
  date: string;
  personal: ObjectiveItem[];
  professional: ObjectiveItem[];
  relational: ObjectiveItem[];
  wordOfDay: string;
}

const OBJECTIVES_STORAGE_KEY = "standupway_daily_objectives";

const inspirations = {
  personal: [
    { emoji: "🧘", text: "10 minuti di respirazione consapevole" },
    { emoji: "🚶", text: "Fare una passeggiata di 20 minuti" },
    { emoji: "✍️", text: "Scrivere 3 pensieri positivi" },
    { emoji: "💧", text: "Bere almeno 2 litri di acqua" },
    { emoji: "🚿", text: "Fare una doccia fredda" },
  ],
  professional: [
    { emoji: "✅", text: "Completare un piccolo task lavorativo" },
    { emoji: "📋", text: "Organizzare la mia giornata lavorativa" },
    { emoji: "🔕", text: "Ridurre le distrazioni per 30 minuti" },
    { emoji: "📝", text: "Rivedere la lista delle priorità" },
  ],
  relational: [
    { emoji: "📞", text: "Chiamare un familiare o un amico" },
    { emoji: "💌", text: "Mandare un messaggio di gratitudine" },
    { emoji: "👥", text: "Partecipare a un gruppo di supporto" },
    { emoji: "🤝", text: "Passare 15 minuti con una persona cara" },
  ],
};

export const ObjectivesSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [todayObjectives, setTodayObjectives] = useState<DailyObjectives | null>(null);

  // Form state
  const [personalObjectives, setPersonalObjectives] = useState<ObjectiveItem[]>([
    { id: crypto.randomUUID(), text: "", completed: false }
  ]);
  const [professionalObjectives, setProfessionalObjectives] = useState<ObjectiveItem[]>([
    { id: crypto.randomUUID(), text: "", completed: false }
  ]);
  const [relationalObjectives, setRelationalObjectives] = useState<ObjectiveItem[]>([
    { id: crypto.randomUUID(), text: "", completed: false }
  ]);
  const [wordOfDay, setWordOfDay] = useState("");

  const today = format(new Date(), "yyyy-MM-dd");
  const todayFormatted = format(new Date(), "EEEE d MMMM yyyy", { locale: it });

  useEffect(() => {
    loadTodayObjectives();
  }, []);

  const loadTodayObjectives = () => {
    const stored = localStorage.getItem(OBJECTIVES_STORAGE_KEY);
    if (stored) {
      const all: DailyObjectives[] = JSON.parse(stored);
      const todayData = all.find(o => o.date === today);
      if (todayData) {
        setTodayObjectives(todayData);
        setPersonalObjectives(todayData.personal.length > 0 ? todayData.personal : [{ id: crypto.randomUUID(), text: "", completed: false }]);
        setProfessionalObjectives(todayData.professional.length > 0 ? todayData.professional : [{ id: crypto.randomUUID(), text: "", completed: false }]);
        setRelationalObjectives(todayData.relational.length > 0 ? todayData.relational : [{ id: crypto.randomUUID(), text: "", completed: false }]);
        setWordOfDay(todayData.wordOfDay);
      }
    }
  };

  const saveObjectives = () => {
    const stored = localStorage.getItem(OBJECTIVES_STORAGE_KEY);
    const all: DailyObjectives[] = stored ? JSON.parse(stored) : [];
    
    const newEntry: DailyObjectives = {
      date: today,
      personal: personalObjectives.filter(o => o.text.trim() !== ""),
      professional: professionalObjectives.filter(o => o.text.trim() !== ""),
      relational: relationalObjectives.filter(o => o.text.trim() !== ""),
      wordOfDay,
    };

    const filtered = all.filter(o => o.date !== today);
    filtered.push(newEntry);
    localStorage.setItem(OBJECTIVES_STORAGE_KEY, JSON.stringify(filtered));
    setTodayObjectives(newEntry);
    setIsOpen(false);
    setStep(0);
  };

  const toggleObjectiveCompletion = (type: "personal" | "professional" | "relational", id: string) => {
    if (!todayObjectives) return;
    
    const stored = localStorage.getItem(OBJECTIVES_STORAGE_KEY);
    const all: DailyObjectives[] = stored ? JSON.parse(stored) : [];
    const todayIndex = all.findIndex(o => o.date === today);
    
    if (todayIndex !== -1) {
      all[todayIndex][type] = all[todayIndex][type].map(obj =>
        obj.id === id ? { ...obj, completed: !obj.completed } : obj
      );
      localStorage.setItem(OBJECTIVES_STORAGE_KEY, JSON.stringify(all));
      setTodayObjectives(all[todayIndex]);
    }
  };

  const addObjective = (type: "personal" | "professional" | "relational") => {
    const newObj = { id: crypto.randomUUID(), text: "", completed: false };
    if (type === "personal") setPersonalObjectives([...personalObjectives, newObj]);
    else if (type === "professional") setProfessionalObjectives([...professionalObjectives, newObj]);
    else setRelationalObjectives([...relationalObjectives, newObj]);
  };

  const removeObjective = (type: "personal" | "professional" | "relational", id: string) => {
    if (type === "personal") setPersonalObjectives(personalObjectives.filter(o => o.id !== id));
    else if (type === "professional") setProfessionalObjectives(professionalObjectives.filter(o => o.id !== id));
    else setRelationalObjectives(relationalObjectives.filter(o => o.id !== id));
  };

  const updateObjective = (type: "personal" | "professional" | "relational", id: string, text: string) => {
    if (type === "personal") {
      setPersonalObjectives(personalObjectives.map(o => o.id === id ? { ...o, text } : o));
    } else if (type === "professional") {
      setProfessionalObjectives(professionalObjectives.map(o => o.id === id ? { ...o, text } : o));
    } else {
      setRelationalObjectives(relationalObjectives.map(o => o.id === id ? { ...o, text } : o));
    }
  };

  const addInspiration = (type: "personal" | "professional" | "relational", text: string) => {
    const newObj = { id: crypto.randomUUID(), text, completed: false };
    if (type === "personal") setPersonalObjectives([...personalObjectives.filter(o => o.text.trim() !== ""), newObj]);
    else if (type === "professional") setProfessionalObjectives([...professionalObjectives.filter(o => o.text.trim() !== ""), newObj]);
    else setRelationalObjectives([...relationalObjectives.filter(o => o.text.trim() !== ""), newObj]);
  };

  const handleOpen = () => {
    if (!todayObjectives) {
      setStep(0);
    }
    setIsOpen(true);
  };

  const allObjectives = todayObjectives ? [
    ...todayObjectives.personal,
    ...todayObjectives.professional,
    ...todayObjectives.relational,
  ] : [];
  const completedCount = allObjectives.filter(o => o.completed).length;
  const totalCount = allObjectives.length;

  const ObjectiveInputList = ({ 
    type, 
    objectives, 
    title,
    subtitle,
  }: { 
    type: "personal" | "professional" | "relational";
    objectives: ObjectiveItem[];
    title: string;
    subtitle: string;
  }) => (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      
      <div className="space-y-3">
        {objectives.map((obj, index) => (
          <div key={obj.id} className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground w-6">{index + 1}.</span>
            <Input
              placeholder="Obiettivo"
              value={obj.text}
              onChange={(e) => updateObjective(type, obj.id, e.target.value)}
              className="flex-1 bg-secondary/50"
            />
            {objectives.length > 1 && (
              <button onClick={() => removeObjective(type, obj.id)} className="p-1 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => addObjective(type)}
        className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
      >
        <Plus className="w-4 h-4" />
      </button>

      <div className="bg-secondary/30 rounded-xl p-4 space-y-3 mt-6">
        <div>
          <h4 className="font-semibold">Hai bisogno di ispirazione?</h4>
          <p className="text-sm text-muted-foreground">Scegli uno di questi obiettivi per iniziare bene la giornata.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {inspirations[type].map((insp, i) => (
            <button
              key={i}
              onClick={() => addInspiration(type, insp.text)}
              className="px-3 py-2 rounded-full bg-background border border-border text-sm hover:bg-secondary transition-colors"
            >
              <span className="mr-1">{insp.emoji}</span> {insp.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <ObjectiveInputList 
            type="personal" 
            objectives={personalObjectives}
            title="Obiettivi personali"
            subtitle="Quali sono i tuoi obiettivi personali di oggi:"
          />
        );
      case 1:
        return (
          <ObjectiveInputList 
            type="professional" 
            objectives={professionalObjectives}
            title="Obiettivi professionali"
            subtitle="Quali sono i tuoi obiettivi professionali di oggi:"
          />
        );
      case 2:
        return (
          <ObjectiveInputList 
            type="relational" 
            objectives={relationalObjectives}
            title="Obiettivi relazionali"
            subtitle="Quali sono i tuoi obiettivi relazionali di oggi:"
          />
        );
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Parola del giorno</h3>
              <p className="text-sm text-muted-foreground">Scegli una parola che ti guiderà oggi:</p>
            </div>
            <Input
              placeholder="Es: Coraggio, Pazienza, Gratitudine..."
              value={wordOfDay}
              onChange={(e) => setWordOfDay(e.target.value)}
              className="bg-secondary/50 text-center text-lg"
            />
            <div className="flex flex-wrap gap-2 justify-center">
              {["Coraggio", "Pazienza", "Gratitudine", "Serenità", "Forza", "Speranza"].map(word => (
                <button
                  key={word}
                  onClick={() => setWordOfDay(word)}
                  className={`px-4 py-2 rounded-full border transition-all ${
                    wordOfDay === word 
                      ? "bg-primary/20 border-primary text-foreground" 
                      : "bg-secondary/50 border-border hover:bg-secondary"
                  }`}
                >
                  {word}
                </button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const totalSteps = 4;
  const progress = ((step + 1) / totalSteps) * 100;

  return (
    <>
      {/* Main card showing today's objectives */}
      <div className="glass-card rounded-xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Obiettivi di oggi</h2>
          </div>
          {todayObjectives && totalCount > 0 && (
            <span className="text-sm font-medium text-primary">{completedCount}/{totalCount}</span>
          )}
        </div>

        {todayObjectives && allObjectives.length > 0 ? (
          <>
            <div className="space-y-2">
              {todayObjectives.personal.map(obj => (
                <button
                  key={obj.id}
                  onClick={() => toggleObjectiveCompletion("personal", obj.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all active:scale-[0.98] ${
                    obj.completed ? 'bg-green-500/10' : 'bg-secondary/50 hover:bg-secondary'
                  }`}
                >
                  {obj.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  )}
                  <span className={`text-sm text-left flex-1 ${obj.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {obj.text}
                  </span>
                  <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded">Personale</span>
                </button>
              ))}
              {todayObjectives.professional.map(obj => (
                <button
                  key={obj.id}
                  onClick={() => toggleObjectiveCompletion("professional", obj.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all active:scale-[0.98] ${
                    obj.completed ? 'bg-green-500/10' : 'bg-secondary/50 hover:bg-secondary'
                  }`}
                >
                  {obj.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  )}
                  <span className={`text-sm text-left flex-1 ${obj.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {obj.text}
                  </span>
                  <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded">Professionale</span>
                </button>
              ))}
              {todayObjectives.relational.map(obj => (
                <button
                  key={obj.id}
                  onClick={() => toggleObjectiveCompletion("relational", obj.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all active:scale-[0.98] ${
                    obj.completed ? 'bg-green-500/10' : 'bg-secondary/50 hover:bg-secondary'
                  }`}
                >
                  {obj.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  )}
                  <span className={`text-sm text-left flex-1 ${obj.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {obj.text}
                  </span>
                  <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded">Relazionale</span>
                </button>
              ))}
            </div>
            
            {todayObjectives.wordOfDay && (
              <div className="text-center py-2 border-t border-border">
                <p className="text-xs text-muted-foreground">Parola del giorno</p>
                <p className="text-lg font-semibold text-primary">{todayObjectives.wordOfDay}</p>
              </div>
            )}

            <div className="pt-2">
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
                />
              </div>
            </div>

            <button
              onClick={handleOpen}
              className="w-full text-center text-sm text-primary hover:underline"
            >
              Modifica obiettivi
            </button>
          </>
        ) : (
          <button
            onClick={handleOpen}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-lg border border-dashed border-border hover:bg-secondary/50 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Imposta i tuoi obiettivi di oggi</span>
          </button>
        )}
      </div>

      {/* Objectives drawer */}
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className="max-h-[90vh]">
          <div className="overflow-y-auto px-4 pb-8">
            <DrawerHeader className="text-center pt-2 pb-4">
              <DrawerTitle>
                <p className="text-lg font-semibold">Obiettivi di oggi</p>
                <p className="text-sm font-normal text-muted-foreground capitalize">{todayFormatted}</p>
              </DrawerTitle>
            </DrawerHeader>

            {/* Progress bar */}
            <div className="w-full bg-muted h-1 rounded-full mb-6">
              <div 
                className="bg-primary h-1 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="py-4">
              {renderStep()}
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                disabled={step === 0}
                className={step === 0 ? "opacity-50" : ""}
              >
                Precedente
              </Button>
              <Button
                variant="cta"
                onClick={() => {
                  if (step === 3) {
                    saveObjectives();
                  } else {
                    setStep(step + 1);
                  }
                }}
              >
                {step === 3 ? "Salva obiettivi" : "Prosegui"}
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};
