import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { format, parseISO, isToday, isYesterday } from "date-fns";
import { it } from "date-fns/locale";
import { Smile, Meh, Frown, ChevronRight } from "lucide-react";

interface JournalEntry {
  id: string;
  date: string;
  mood: string;
  stressLevel: number;
  anxietyLevel: number;
  location: string;
  motivationLevel: number;
  note: string;
}

const moods = [
  { emoji: "😁", label: "Felice" },
  { emoji: "🧘", label: "Calmo" },
  { emoji: "⚡", label: "Energico" },
  { emoji: "🌈", label: "Speranzoso" },
  { emoji: "😠", label: "Arrabbiato" },
  { emoji: "😟", label: "Preoccupato" },
  { emoji: "😞", label: "Sfiduciato" },
  { emoji: "😩", label: "Senza energie" },
  { emoji: "😐", label: "Vuoto" },
  { emoji: "😢", label: "Solo" },
];

const locations = [
  { emoji: "🏠", label: "A casa" },
  { emoji: "🚗", label: "Fuori casa, da solo" },
  { emoji: "👥", label: "Con amici o famiglia" },
  { emoji: "📍", label: "In un posto che sento 'a rischio'" },
  { emoji: "❓", label: "Altro" },
];

const JOURNAL_STORAGE_KEY = "standupway_journal_entries";

const getMoodEmoji = (moodLabel: string) => {
  const mood = moods.find(m => m.label === moodLabel);
  return mood?.emoji || "😐";
};

const getMoodType = (moodLabel: string): "positive" | "neutral" | "negative" => {
  const positives = ["Felice", "Calmo", "Energico", "Speranzoso"];
  const negatives = ["Arrabbiato", "Preoccupato", "Sfiduciato", "Senza energie", "Solo"];
  if (positives.includes(moodLabel)) return "positive";
  if (negatives.includes(moodLabel)) return "negative";
  return "neutral";
};

const formatEntryDate = (dateStr: string) => {
  const date = parseISO(dateStr);
  if (isToday(date)) return "Oggi";
  if (isYesterday(date)) return "Ieri";
  return format(date, "d MMM", { locale: it });
};

export const JournalingSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [step, setStep] = useState(0);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  
  // Form state
  const [selectedMood, setSelectedMood] = useState("");
  const [stressLevel, setStressLevel] = useState<number | null>(null);
  const [anxietyLevel, setAnxietyLevel] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [motivationLevel, setMotivationLevel] = useState<number | null>(null);
  const [note, setNote] = useState("");

  const today = format(new Date(), "yyyy-MM-dd");
  const todayFormatted = format(new Date(), "EEEE d MMMM yyyy", { locale: it });

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = () => {
    const stored = localStorage.getItem(JOURNAL_STORAGE_KEY);
    let parsed: JournalEntry[] = stored ? JSON.parse(stored) : [];
    
    // Check if sample entries exist
    const hasSampleEntries = parsed.some(e => e.id.startsWith('sample-'));
    
    // Add sample data if no sample entries exist
    if (!hasSampleEntries) {
      const samples = generateSampleEntries();
      parsed = [...parsed, ...samples];
      localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(parsed));
    }
    
    // Sort by date descending
    parsed.sort((a, b) => b.date.localeCompare(a.date));
    setEntries(parsed);
  };

  const generateSampleEntries = (): JournalEntry[] => {
    const sampleData = [
      { daysAgo: 1, mood: "Calmo", stress: 2, anxiety: 1, motivation: 4, location: "A casa", note: "Giornata tranquilla, ho fatto meditazione" },
      { daysAgo: 2, mood: "Energico", stress: 1, anxiety: 1, motivation: 5, location: "A casa", note: "Mi sono svegliato presto e ho fatto esercizio" },
      { daysAgo: 3, mood: "Preoccupato", stress: 4, anxiety: 3, location: "Fuori casa, da solo", note: "Momento difficile ma ho resistito" },
      { daysAgo: 4, mood: "Felice", stress: 1, anxiety: 0, motivation: 5, location: "Con amici o famiglia", note: "Bellissima giornata con la famiglia" },
      { daysAgo: 5, mood: "Sfiduciato", stress: 3, anxiety: 4, motivation: 2, location: "A casa", note: "Giornata pesante, ho chiamato il supporto" },
      { daysAgo: 6, mood: "Speranzoso", stress: 2, anxiety: 2, motivation: 4, location: "A casa", note: "Sto vedendo i progressi del mio percorso" },
      { daysAgo: 7, mood: "Calmo", stress: 2, anxiety: 2, motivation: 3, location: "Con amici o famiglia", note: "Domenica rilassante" },
      { daysAgo: 8, mood: "Arrabbiato", stress: 4, anxiety: 3, motivation: 3, location: "Fuori casa, da solo", note: "Situazione stressante al lavoro" },
      { daysAgo: 9, mood: "Felice", stress: 1, anxiety: 1, motivation: 5, location: "A casa", note: "Ho raggiunto un obiettivo importante" },
      { daysAgo: 10, mood: "Vuoto", stress: 3, anxiety: 2, motivation: 2, location: "A casa", note: "" },
    ];

    return sampleData.map((data, index) => {
      const entryDate = new Date();
      entryDate.setDate(entryDate.getDate() - data.daysAgo);
      return {
        id: `sample-${index}`,
        date: format(entryDate, "yyyy-MM-dd"),
        mood: data.mood,
        stressLevel: data.stress,
        anxietyLevel: data.anxiety,
        location: data.location,
        motivationLevel: data.motivation ?? 3,
        note: data.note,
      };
    });
  };

  const todayEntry = entries.find(e => e.date === today);

  const saveEntry = () => {
    const newEntry: JournalEntry = {
      id: crypto.randomUUID(),
      date: today,
      mood: selectedMood,
      stressLevel: stressLevel ?? 0,
      anxietyLevel: anxietyLevel ?? 0,
      location: selectedLocation,
      motivationLevel: motivationLevel ?? 0,
      note,
    };
    
    const filtered = entries.filter(e => e.date !== today);
    filtered.unshift(newEntry);
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(filtered));
    setEntries(filtered);
  };

  const resetForm = () => {
    setStep(0);
    setSelectedMood("");
    setStressLevel(null);
    setAnxietyLevel(null);
    setSelectedLocation("");
    setMotivationLevel(null);
    setNote("");
  };

  const handleOpen = () => {
    if (todayEntry) {
      setStep(6); // Show completion
    } else {
      resetForm();
    }
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };

  const canProceed = () => {
    switch (step) {
      case 0: return selectedMood !== "";
      case 1: return stressLevel !== null;
      case 2: return anxietyLevel !== null;
      case 3: return selectedLocation !== "";
      case 4: return motivationLevel !== null;
      case 5: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step === 5) {
      saveEntry();
      setStep(6);
    } else {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const LevelSelector = ({ 
    value, 
    onChange, 
    color = "primary" 
  }: { 
    value: number | null; 
    onChange: (v: number) => void;
    color?: "primary" | "success";
  }) => {
    const heights = [40, 60, 80, 100, 120, 140];
    
    return (
      <div className="flex items-end justify-center gap-3 h-40 mt-8">
        {[0, 1, 2, 3, 4, 5].map((level) => (
          <button
            key={level}
            onClick={() => onChange(level)}
            className={`w-12 rounded-t-lg transition-all ${
              value !== null && level <= value
                ? color === "success" 
                  ? "bg-green-500" 
                  : "bg-primary"
                : "bg-muted-foreground/30"
            }`}
            style={{ height: heights[level] }}
          >
            <span className="sr-only">Livello {level}</span>
          </button>
        ))}
      </div>
    );
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Come ti senti oggi?</h3>
            <div className="flex flex-wrap gap-2">
              {moods.map((mood) => (
                <button
                  key={mood.label}
                  onClick={() => setSelectedMood(mood.label)}
                  className={`px-4 py-2 rounded-full border transition-all ${
                    selectedMood === mood.label
                      ? "bg-primary/20 border-primary"
                      : "bg-secondary/50 border-border hover:bg-secondary"
                  }`}
                >
                  <span className="mr-2">{mood.emoji}</span>
                  {mood.label}
                </button>
              ))}
            </div>
            <div className="space-y-2 pt-4">
              <h4 className="font-medium">Cosa vuoi aggiungere?</h4>
              <Textarea
                placeholder="Scrivi qui..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="min-h-[100px] bg-secondary/30"
              />
            </div>
          </div>
        );
      
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Qual è il tuo livello di stress?</h3>
            <LevelSelector value={stressLevel} onChange={setStressLevel} />
            <div className="flex justify-between text-sm text-muted-foreground px-2 pt-4">
              {[0, 1, 2, 3, 4, 5].map(n => (
                <span key={n} className="w-12 text-center">{n}</span>
              ))}
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Qual è il tuo livello di ansia?</h3>
            <LevelSelector value={anxietyLevel} onChange={setAnxietyLevel} />
            <div className="flex justify-between text-sm text-muted-foreground px-2 pt-4">
              {[0, 1, 2, 3, 4, 5].map(n => (
                <span key={n} className="w-12 text-center">{n}</span>
              ))}
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Dove ti trovi in questo momento?</h3>
            <div className="flex flex-wrap gap-2">
              {locations.map((loc) => (
                <button
                  key={loc.label}
                  onClick={() => setSelectedLocation(loc.label)}
                  className={`px-4 py-2 rounded-full border transition-all ${
                    selectedLocation === loc.label
                      ? "bg-primary/20 border-primary"
                      : "bg-secondary/50 border-border hover:bg-secondary"
                  }`}
                >
                  <span className="mr-2">{loc.emoji}</span>
                  {loc.label}
                </button>
              ))}
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quanto sei motivato alla sobrietà?</h3>
            <LevelSelector value={motivationLevel} onChange={setMotivationLevel} color="success" />
            <div className="flex justify-between text-sm text-muted-foreground px-2 pt-4">
              {[0, 1, 2, 3, 4, 5].map(n => (
                <span key={n} className="w-12 text-center">{n}</span>
              ))}
            </div>
          </div>
        );
      
      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Vuoi aggiungere una nota?</h3>
            <Textarea
              placeholder="Scrivi qui i tuoi pensieri..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[150px] bg-secondary/30"
            />
          </div>
        );
      
      case 6:
        return (
          <div className="text-center py-8 space-y-6">
            <div className="text-6xl">🎊</div>
            <h3 className="text-2xl font-bold">
              Ogni giornata è importante,<br />continua così!
            </h3>
            <p className="text-primary font-semibold">
              Hai completato la riflessione giornaliera!
            </p>
            <div className="space-y-3 pt-4">
              <Button 
                variant="cta" 
                className="w-full"
                onClick={handleClose}
              >
                Chiudi
              </Button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const totalSteps = 6;
  const progress = step < 6 ? ((step + 1) / totalSteps) * 100 : 100;
  
  const recentEntries = entries.slice(0, 3); // Show only 3 recent in card

  return (
    <>
      {/* Unified Journaling section */}
      <div className="glass-card rounded-xl overflow-hidden">
        {/* Header with title */}
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">📔</span>
              <h2 className="font-semibold text-foreground">Diario di Bordo</h2>
            </div>
            <button 
              onClick={() => setIsHistoryOpen(true)}
              className="text-xs text-primary flex items-center gap-1 hover:underline"
            >
              Sfoglia diario <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Today's entry - clickable */}
        <button
          onClick={handleOpen}
          className="w-full p-4 text-left hover:bg-secondary/30 transition-all group border-b border-border/30"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl">{todayEntry ? getMoodEmoji(todayEntry.mood) : "📝"}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">Oggi</span>
                  {todayEntry && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      getMoodType(todayEntry.mood) === "positive" ? "bg-green-500/20 text-green-500" :
                      getMoodType(todayEntry.mood) === "negative" ? "bg-primary/20 text-primary" :
                      "bg-yellow-500/20 text-yellow-500"
                    }`}>
                      {todayEntry.mood}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-foreground mt-1">
                  {todayEntry ? "Riflessione completata ✓" : "Come ti senti oggi?"}
                </h3>
                {todayEntry ? (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Stress: {todayEntry.stressLevel} · Ansia: {todayEntry.anxietyLevel} · Motivazione: {todayEntry.motivationLevel}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-0.5">Tocca per registrare il tuo stato d'animo</p>
                )}
              </div>
            </div>
            <div className="flex gap-1">
              {!todayEntry && moods.slice(0, 3).map((m, i) => (
                <span key={i} className="text-lg opacity-40 group-hover:opacity-100 transition-opacity">
                  {m.emoji}
                </span>
              ))}
              {todayEntry && <ChevronRight className="w-5 h-5 text-muted-foreground" />}
            </div>
          </div>
        </button>

        {/* Recent past entries (max 2) */}
        {recentEntries.filter(e => e.date !== today).length > 0 && (
          <div className="divide-y divide-border/30">
            {recentEntries.filter(e => e.date !== today).map((entry) => {
              const moodType = getMoodType(entry.mood);
              return (
                <div key={entry.id} className="p-4 hover:bg-secondary/20 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">{getMoodEmoji(entry.mood)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-muted-foreground">{formatEntryDate(entry.date)}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          moodType === "positive" ? "bg-green-500/20 text-green-500" :
                          moodType === "negative" ? "bg-primary/20 text-primary" :
                          "bg-yellow-500/20 text-yellow-500"
                        }`}>
                          {entry.mood}
                        </span>
                      </div>
                      {entry.note && (
                        <p className="text-sm text-foreground mt-1 line-clamp-1">{entry.note}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {entries.length === 0 && (
          <div className="p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Nessuna registrazione ancora. Inizia il tuo percorso di journaling!
            </p>
          </div>
        )}
      </div>

      {/* Full journaling drawer */}
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className="max-h-[90vh]">
          <div className="overflow-y-auto px-4 pb-8">
            <DrawerHeader className="text-center pt-2 pb-4">
              <DrawerTitle>
                <p className="text-sm font-normal text-muted-foreground mb-1">
                  Fermati un attimo:
                </p>
                <p className="text-sm font-normal text-muted-foreground">
                  il resto della giornata ti ringrazierà.
                </p>
                <p className="text-base font-semibold mt-2 capitalize">{todayFormatted}</p>
              </DrawerTitle>
            </DrawerHeader>

            {/* Progress bar */}
            {step < 6 && (
              <div className="w-full bg-muted h-1 rounded-full mb-4">
                <div 
                  className="bg-primary h-1 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            <div className="py-4">
              {renderStep()}
            </div>

            {/* Navigation */}
            {step < 6 && (
              <div className="flex justify-between pt-4 border-t border-border">
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  disabled={step === 0}
                  className={step === 0 ? "opacity-50" : ""}
                >
                  Precedente
                </Button>
                <Button
                  variant={canProceed() ? "cta" : "secondary"}
                  onClick={handleNext}
                  disabled={!canProceed()}
                >
                  {step === 5 ? "Completa" : "Prosegui"}
                </Button>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>

      {/* History drawer */}
      <Drawer open={isHistoryOpen} onOpenChange={(open) => {
        setIsHistoryOpen(open);
        if (!open) {
          setShowAllHistory(false);
          setSelectedEntry(null);
        }
      }}>
        <DrawerContent className={showAllHistory && !selectedEntry ? "max-h-[80vh]" : ""}>
          <div className="px-4 pb-6 overflow-y-auto">
            {selectedEntry ? (
              // Single entry detail view
              <>
                <DrawerHeader className="pt-2 pb-3">
                  <button 
                    onClick={() => setSelectedEntry(null)}
                    className="text-sm text-primary flex items-center gap-1 mb-2"
                  >
                    ← Torna allo storico
                  </button>
                  <DrawerTitle className="text-center">
                    <p className="text-lg font-semibold capitalize">
                      {format(parseISO(selectedEntry.date), "EEEE d MMMM yyyy", { locale: it })}
                    </p>
                  </DrawerTitle>
                </DrawerHeader>

                <div className="space-y-4">
                  {/* Mood */}
                  <div className="text-center py-4">
                    <span className="text-5xl">{getMoodEmoji(selectedEntry.mood)}</span>
                    <p className={`text-lg font-semibold mt-2 ${
                      getMoodType(selectedEntry.mood) === "positive" ? "text-green-500" :
                      getMoodType(selectedEntry.mood) === "negative" ? "text-primary" :
                      "text-yellow-500"
                    }`}>
                      {selectedEntry.mood}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-secondary/30 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-primary">{selectedEntry.stressLevel}</p>
                      <p className="text-xs text-muted-foreground">Stress</p>
                    </div>
                    <div className="bg-secondary/30 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-primary">{selectedEntry.anxietyLevel}</p>
                      <p className="text-xs text-muted-foreground">Ansia</p>
                    </div>
                    <div className="bg-secondary/30 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-green-500">{selectedEntry.motivationLevel}</p>
                      <p className="text-xs text-muted-foreground">Motivazione</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="bg-secondary/30 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">📍 Dove eri</p>
                    <p className="text-sm font-medium">{selectedEntry.location}</p>
                  </div>

                  {/* Note */}
                  {selectedEntry.note && (
                    <div className="bg-secondary/30 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">📝 Note</p>
                      <p className="text-sm">{selectedEntry.note}</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // List view
              <>
                <DrawerHeader className="text-center pt-2 pb-3">
                  <DrawerTitle>
                    <p className="text-lg font-semibold">📔 Storico Diario di Bordo</p>
                  </DrawerTitle>
                </DrawerHeader>

                <div className="divide-y divide-border/30">
                  {entries.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Nessuna registrazione ancora.
                    </p>
                  ) : (
                    (showAllHistory ? entries : entries.slice(0, 4)).map((entry) => {
                      const moodType = getMoodType(entry.mood);
                      const isEntryToday = entry.date === today;
                      return (
                        <button 
                          key={entry.id}
                          onClick={() => setSelectedEntry(entry)}
                          className={`w-full py-3 flex items-center gap-3 text-left hover:bg-secondary/30 transition-colors ${isEntryToday ? 'bg-primary/5' : ''}`}
                        >
                          <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              {isEntryToday && (
                                <span className="text-[10px] font-medium text-primary bg-primary/20 px-1.5 py-0.5 rounded">Oggi</span>
                              )}
                              <span className="text-xs text-muted-foreground">{formatEntryDate(entry.date)}</span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                                moodType === "positive" ? "bg-green-500/20 text-green-500" :
                                moodType === "negative" ? "bg-primary/20 text-primary" :
                                "bg-yellow-500/20 text-yellow-500"
                              }`}>
                                {entry.mood}
                              </span>
                            </div>
                            {entry.note && (
                              <p className="text-xs text-foreground mt-0.5 line-clamp-1">{entry.note}</p>
                            )}
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        </button>
                      );
                    })
                  )}
                </div>

                {entries.length > 4 && !showAllHistory && (
                  <button
                    onClick={() => setShowAllHistory(true)}
                    className="w-full text-center text-sm text-primary py-3 hover:underline"
                  >
                    Mostra tutti ({entries.length})
                  </button>
                )}
              </>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};
