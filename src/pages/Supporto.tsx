import { useState, useRef, useEffect } from "react";
import { usePageTracking } from "@/hooks/usePageTracking";
import { trackEvent } from "@/lib/analytics";
import { BottomNav } from "@/components/BottomNav";
import { HeaderActions } from "@/components/HeaderActions";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  time: string;
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content: "Ciao! 👋 Sono l'assistente AI di StandUp Way. Posso aiutarti a navigare l'app, rispondere alle tue domande sui percorsi, prenotare visite o semplicemente ascoltarti. Come posso aiutarti oggi?",
    time: "Ora",
  },
];

const getAIResponse = (userMessage: string, history: Message[]): string => {
  const msg = userMessage.toLowerCase();
  
  if (msg.includes("percors") || msg.includes("dipendenz")) {
    return "Abbiamo diversi percorsi disponibili: **Crack/Cocaina**, **Alcol**, **Ludopatia**, **Oppiacei**, **Cannabis**, **Sesso e pornografia** e anche un percorso per le **famiglie**. Ogni percorso è personalizzato e prevede supporto online quotidiano con possibilità di visite in sede.\n\nVuoi sapere di più su un percorso specifico? 🤔";
  }
  if (msg.includes("prezz") || msg.includes("cost") || msg.includes("quant")) {
    return "Ecco i nostri prezzi:\n\n• **Colloquio singolo**: 49€ (il primo è gratuito!)\n• **Attività di gruppo settimanali**: 80€/settimana\n• **Supporto individuale settimanale**: 80€/settimana\n• **Visita medico/psichiatra**: 120€/h\n• **Percorso completo**: personalizzato\n\nTutte le spese sono **detraibili fiscalmente** come spese sanitarie. Vuoi prenotare qualcosa?";
  }
  if (msg.includes("prenot") || msg.includes("visita") || msg.includes("appuntament")) {
    return "Puoi prenotare una visita dalla sezione **Percorsi > Visite**. Abbiamo disponibilità per:\n\n• Colloqui con psicologo (online)\n• Visite psichiatriche (in sede)\n• Visite mediche (in sede)\n\nIl primo colloquio è **gratuito** e senza impegno. Vuoi che ti guidi nella prenotazione? 📅";
  }
  if (msg.includes("contagiorni") || msg.includes("giorni") || msg.includes("counter")) {
    return "Puoi impostare il tuo contagiorni dalla sezione **Percorsi > Il mio percorso**. Clicca sul contatore 🔥 per selezionare la data in cui hai iniziato il tuo percorso di pulizia. Il contatore si aggiornerà automaticamente ogni giorno!";
  }
  if (msg.includes("community") || msg.includes("gruppo") || msg.includes("chat")) {
    return "La nostra community è divisa in gruppi tematici:\n\n• **Alcol** - 342 membri\n• **Sostanze** - 218 membri\n• **Gioco d'azzardo** - 156 membri\n• **Familiari** - 189 membri\n• **La tua zona** - incontra persone nella tua città\n\nPuoi condividere la tua esperienza, leggere quelle degli altri e commentare. Tutto in anonimato e con rispetto. ❤️";
  }
  if (msg.includes("grazie") || msg.includes("ok") || msg.includes("perfett")) {
    return "Di niente! 😊 Sono qui per te, quando vuoi. Ricorda: **chiedere aiuto è un atto di coraggio**, non di debolezza. Se hai altre domande, scrivi pure!";
  }
  if (msg.includes("come stai") || msg.includes("ciao") || msg.includes("buongiorno") || msg.includes("salut")) {
    return "Ciao! 😊 Sto bene, grazie! Sono qui per aiutarti con qualsiasi cosa legata al tuo percorso StandUp. Puoi chiedermi informazioni su:\n\n• I **percorsi** disponibili\n• I **prezzi** dei servizi\n• Come **prenotare** una visita\n• Come funziona la **community**\n\nDimmi come posso esserti utile!";
  }
  if (msg.includes("aiut") || msg.includes("bisogno") || msg.includes("difficil") || msg.includes("male") || msg.includes("crisi")) {
    return "Ti capisco, e sei nel posto giusto. 💚 Non sei solo/a in questo.\n\nEcco cosa puoi fare subito:\n\n1. **Scrivi nella community** - ci sono persone che capiscono esattamente come ti senti\n2. **Prenota un colloquio gratuito** - parla con un professionista, il primo incontro è gratis\n3. **Contatta il tuo coach di zona** - se sei in una delle nostre città, può organizzare un incontro dal vivo\n\nVuoi che ti aiuti a fare uno di questi passi?";
  }
  if (msg.includes("sede") || msg.includes("città") || msg.includes("dove")) {
    return "Siamo presenti in **8 città italiane**:\n\n📍 Milano, Roma, Torino, Napoli, Bologna, Padova, Palermo e Cagliari\n\nOgni sede ha un coach dedicato che coordina la community locale e organizza incontri dal vivo. Puoi trovare la tua zona nella sezione **Community > La tua zona**.\n\nIn quale città ti trovi?";
  }
  
  // Default contextual responses
  const defaults = [
    "Interessante! Dimmi di più, sono qui per ascoltarti e aiutarti. Se hai una domanda specifica sui nostri servizi, percorsi o sulla community, chiedimi pure. 💚",
    "Capisco. Ogni percorso è diverso e personale. Se vuoi, posso darti informazioni sui nostri **percorsi**, sui **prezzi**, o aiutarti a **prenotare** un colloquio gratuito. Cosa preferisci?",
    "Sono qui per te! Posso aiutarti con informazioni sui servizi, sulla community, o semplicemente ascoltarti. Non c'è fretta, prenditi il tempo che ti serve. 😊",
  ];
  
  const idx = history.filter(m => m.role === "assistant").length % defaults.length;
  return defaults[idx];
};

const Supporto = () => {
  usePageTracking("supporto");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

    const userMsg: Message = { id: Date.now(), role: "user", content: input.trim(), time: timeStr };
    const currentInput = input.trim();
    trackEvent("chat_message_sent", "supporto", { message_count: messages.length + 1, has_prenota: currentInput.toLowerCase().includes("prenot") });
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking delay
    const delay = 800 + Math.random() * 1200;
    setTimeout(() => {
      setIsTyping(false);
      const reply: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: getAIResponse(currentInput, [...messages, userMsg]),
        time: timeStr,
      };
      setMessages((prev) => [...prev, reply]);
    }, delay);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="glass border-b border-border/50 px-4 py-4 safe-area-top">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground text-base">Assistente StandUp</h1>
              <p className="text-[10px] text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                Online · AI Assistant
              </p>
            </div>
          </div>
          <HeaderActions />
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 pb-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex gap-2", msg.role === "user" ? "justify-end" : "justify-start")}>
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-3.5 h-3.5 text-primary" />
              </div>
            )}
            <div className={cn(
              "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
              msg.role === "user"
                ? "bg-primary text-primary-foreground rounded-br-md"
                : "bg-secondary/60 text-foreground rounded-bl-md"
            )}>
              <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{
                __html: msg.content
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\n/g, '<br/>')
              }} />
              <p className={cn("text-[10px] mt-1", msg.role === "user" ? "text-primary-foreground/60" : "text-muted-foreground")}>{msg.time}</p>
            </div>
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-2 justify-start">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
              <Bot className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="bg-secondary/60 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 text-muted-foreground animate-spin" />
              <span className="text-xs text-muted-foreground">Sta scrivendo...</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick actions */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2 flex gap-2 flex-wrap">
          {["Quali percorsi avete?", "Quanto costa?", "Ho bisogno di aiuto", "Come prenoto?"].map(q => (
            <button
              key={q}
              onClick={() => { setInput(q); }}
              className="text-[11px] px-3 py-1.5 rounded-full bg-secondary border border-border text-foreground hover:bg-primary/10 hover:border-primary/30 transition-all"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <div className="border-t border-border/50 bg-card/80 backdrop-blur-xl px-4 py-3 pb-20">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Scrivi un messaggio..."
            rows={1}
            className="flex-1 bg-secondary/50 border border-border/50 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary/50 max-h-24"
          />
          <Button size="icon" onClick={sendMessage} disabled={!input.trim() || isTyping} className="rounded-xl h-10 w-10 flex-shrink-0">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Supporto;
