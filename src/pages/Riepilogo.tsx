import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarCheck, Clock, Home, CreditCard, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import EmailVerifyModal from "@/components/EmailVerifyModal";

interface FunnelData {
  dipendenza?: string;
  score?: number;
  level?: "alto" | "medio" | "basso";
  data?: string;
  ora?: string;
  nome?: string;
}

const DIPENDENZA_LABELS: Record<string, string> = {
  "crack-cocaina": "Crack / Cocaina",
  "alcol": "Alcool",
  "ludopatia": "Gioco d'azzardo",
  "oppiacei": "Oppiacei",
  "famiglie": "Familiari",
  "cannabis": "Cannabis",
  "sesso-pornografia": "Sesso e pornografia",
};

const LEVEL_CONFIG = {
  alto: { label: "Supporto immediato consigliato", color: "text-red-500 bg-red-500/10" },
  medio: { label: "Percorso personalizzato", color: "text-amber-500 bg-amber-500/10" },
  basso: { label: "Prevenzione e strumenti", color: "text-green-500 bg-green-500/10" },
};

const Riepilogo = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [funnel, setFunnel] = useState<FunnelData>({});
  const [verifyEmail, setVerifyEmail] = useState<string | null>(null);

  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem("sw_funnel") || "{}");
    setFunnel(data);
    const pending = sessionStorage.getItem("sw_verify_email");
    if (pending) setVerifyEmail(pending);
  }, []);

  const handleVerified = () => {
    sessionStorage.removeItem("sw_verify_email");
    setVerifyEmail(null);
  };

  const level = funnel.level ?? "medio";
  const levelConfig = LEVEL_CONFIG[level];
  const nomeUtente = user?.user_metadata?.nome ?? funnel.nome ?? "Utente";

  // Placeholder Stripe — verrà sostituito con la vera Checkout Session
  const handlePagamento = () => {
    // TODO: navigate to Stripe Checkout
    // window.location.href = stripeCheckoutUrl;
    alert("Integrazione Stripe in arrivo — qui l'utente verrà reindirizzato al pagamento.");
  };

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col safe-area-top safe-area-bottom">
      {verifyEmail && (
        <EmailVerifyModal email={verifyEmail} onVerified={handleVerified} />
      )}
      {/* Header */}
      <header className="bg-surface-1 border-b border-border/40 px-4 py-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2 mb-0.5">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <h1 className="text-base font-bold text-foreground">Prenotazione confermata</h1>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Ciao {nomeUtente}, il tuo appuntamento è fissato. Completa il pagamento per confermarlo definitivamente.
          </p>
        </div>
      </header>

      <div className="flex-1 px-4 py-6 max-w-lg mx-auto w-full space-y-4">

        {/* Card riepilogo appuntamento */}
        <div className="rounded-2xl bg-surface-1 border border-border/40 overflow-hidden">
          <div className="bg-primary/5 border-b border-border/30 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Dettagli appuntamento</p>
          </div>
          <div className="p-4 space-y-3">
            {funnel.data && (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CalendarCheck className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-medium">Data</p>
                  <p className="text-sm font-semibold text-foreground">{funnel.data}</p>
                </div>
              </div>
            )}
            {funnel.ora && (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-medium">Orario</p>
                  <p className="text-sm font-semibold text-foreground">{funnel.ora} · Durata 30 min</p>
                </div>
              </div>
            )}
            {funnel.dipendenza && (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-base">🎯</span>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-medium">Tipologia</p>
                  <p className="text-sm font-semibold text-foreground">{DIPENDENZA_LABELS[funnel.dipendenza] ?? funnel.dipendenza}</p>
                </div>
              </div>
            )}
            {funnel.level && (
              <div className="flex items-start gap-3 pt-1 border-t border-border/30">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${levelConfig.color}`}>
                  {levelConfig.label}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Prezzo */}
        <div className="rounded-2xl bg-surface-1 border border-border/40 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Colloquio iniziale</p>
              <p className="text-xs text-muted-foreground">30 minuti · Online via video call</p>
            </div>
            <p className="text-2xl font-bold text-foreground">49€</p>
          </div>
          <div className="mt-3 pt-3 border-t border-border/30 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
            <p className="text-[11px] text-muted-foreground">
              Rimborso garantito entro 24h se l'appuntamento non rispetta le tue aspettative.
            </p>
          </div>
        </div>

        {/* Cosa aspettarsi */}
        <div className="rounded-2xl bg-surface-1 border border-border/40 p-4 space-y-2">
          <p className="text-xs font-bold text-foreground">Cosa succederà dopo il pagamento</p>
          {[
            "Riceverai una email di conferma con il link alla video call",
            "Il professionista studierà le tue risposte al questionario",
            "Durante il colloquio costruirete insieme il piano personalizzato",
          ].map((s, i) => (
            <div key={i} className="flex gap-2.5">
              <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                {i + 1}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{s}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA fissa in basso */}
      <div className="sticky bottom-0 bg-surface-1/95 backdrop-blur border-t border-border/40 px-4 py-4 safe-area-bottom space-y-2">
        <div className="max-w-lg mx-auto space-y-2">
          <Button
            onClick={handlePagamento}
            disabled={!!verifyEmail}
            className="w-full"
            size="lg"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            {verifyEmail ? "Verifica l'email per proseguire" : "Vai al pagamento · 49€"}
          </Button>
          <Button variant="ghost" onClick={() => navigate("/home")} className="w-full text-muted-foreground">
            <Home className="w-4 h-4 mr-1.5" /> Torna alla home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Riepilogo;
