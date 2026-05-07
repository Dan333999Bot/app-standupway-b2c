import { useState, useRef, useEffect, useCallback } from "react";
import { usePageTracking } from "@/hooks/usePageTracking";
import { useUserState } from "@/hooks/useUserState";
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

function getTimeStr() {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
}

function renderMarkdown(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br/>");
}

// Welcome message and quick chips adapt to user state
function getInitialMessage(userState: ReturnType<typeof useUserState>["userState"]): string {
  if (userState?.percorso_active) {
    return "Ciao! 👋 Sono qui con te ogni giorno nel tuo percorso. Come stai oggi? Cosa ti passa per la testa?";
  }
  if (userState?.first_colloquio_done) {
    return "Ciao! 👋 Il tuo **preventivo personalizzato** è pronto nella sezione \"Il mio percorso\". Sono qui se hai domande, vuoi capire i prossimi passi o hai bisogno di supporto. Come posso aiutarti?";
  }
  return "Ciao! 👋 Sono l'assistente AI di StandUp Way. Posso ascoltarti, rispondere alle tue domande e aiutarti a fare il primo passo. Come posso aiutarti oggi?";
}

function getQuickChips(userState: ReturnType<typeof useUserState>["userState"]): string[] {
  if (userState?.percorso_active) {
    return ["Come gestisco il craving?", "Ho avuto una ricaduta", "Voglio usare il diario", "Come sto andando?"];
  }
  if (userState?.first_colloquio_done) {
    return ["Cos'è il preventivo?", "Quando posso iniziare?", "Ci sono eventi dal vivo?", "Ho bisogno di supporto"];
  }
  return ["Quali percorsi avete?", "Quanto costa?", "Ho bisogno di aiuto", "Come funziona?"];
}

const Supporto = () => {
  usePageTracking("supporto");
  const { userState, loading: stateLoading } = useUserState();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Set initial message once userState loads
  useEffect(() => {
    if (stateLoading) return;
    setMessages([{
      id: 1,
      role: "assistant",
      content: getInitialMessage(userState),
      time: "Ora",
    }]);
  }, [stateLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isStreaming]);

  const sendMessage = useCallback(async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || isStreaming) return;

    const timeStr = getTimeStr();
    const userMsg: Message = { id: Date.now(), role: "user", content, time: timeStr };

    trackEvent("chat_message_sent", "supporto", { message_count: messages.length + 1 });
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsStreaming(true);

    // Placeholder assistant message that will be filled by stream
    const assistantId = Date.now() + 1;
    setMessages(prev => [...prev, { id: assistantId, role: "assistant", content: "", time: timeStr }]);

    const abortController = new AbortController();
    abortRef.current = abortController;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortController.signal,
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          userState,
        }),
      });

      if (!response.ok || !response.body) throw new Error("API error");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
        const snapshot = fullText;
        setMessages(prev =>
          prev.map(m => m.id === assistantId ? { ...m, content: snapshot } : m)
        );
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        setMessages(prev =>
          prev.map(m => m.id === assistantId
            ? { ...m, content: "Mi dispiace, si è verificato un errore. Riprova tra poco." }
            : m
          )
        );
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, [input, isStreaming, messages, userState]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const chips = getQuickChips(userState);
  const showChips = messages.length <= 2 && !isStreaming;

  if (stateLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

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

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
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
              {msg.content ? (
                <div
                  className="whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                />
              ) : (
                <div className="flex items-center gap-1.5">
                  <Loader2 className="w-3 h-3 text-muted-foreground animate-spin" />
                  <span className="text-xs text-muted-foreground">Sto scrivendo...</span>
                </div>
              )}
              {msg.content && (
                <p className={cn("text-[10px] mt-1", msg.role === "user" ? "text-primary-foreground/60" : "text-muted-foreground")}>
                  {msg.time}
                </p>
              )}
            </div>
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
      </div>

      {showChips && (
        <div className="px-4 pb-2 flex gap-2 flex-wrap">
          {chips.map(q => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
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
          <Button
            size="icon"
            onClick={() => sendMessage()}
            disabled={!input.trim() || isStreaming}
            className="rounded-xl h-10 w-10 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Supporto;
