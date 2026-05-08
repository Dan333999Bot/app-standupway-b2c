import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Loader2, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

const PrenotaVerifica = () => {
  const navigate = useNavigate();
  const email = sessionStorage.getItem("sw_verify_email") || "";

  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(true); // OTP in invio al mount
  const [error, setError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Se non c'è email in sessionStorage, torna indietro
  useEffect(() => {
    if (!email) {
      navigate("/prenota/registrazione", { replace: true });
      return;
    }
    // L'OTP è già stato inviato da PrenotaRegistrazione — focus sul primo campo
    setSending(false);
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  }, []);

  const handleChange = (idx: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[idx] = val;
    setDigits(next);
    setError(null);
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (paste.length === 6) {
      setDigits(paste.split(""));
      setTimeout(() => inputRefs.current[5]?.focus(), 0);
    }
  };

  const handleVerify = async () => {
    const token = digits.join("");
    if (token.length < 6) return;
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.verifyOtp({ email, token, type: "email" });
    setLoading(false);
    if (error) {
      setError("Codice non valido o scaduto. Riprova o clicca su \"Invia di nuovo\".");
      setDigits(["", "", "", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 0);
    } else {
      sessionStorage.removeItem("sw_verify_email");
      navigate("/riepilogo", { replace: true });
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError(null);
    await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false } });
    setResending(false);
    setResent(true);
    setDigits(["", "", "", "", "", ""]);
    setTimeout(() => {
      setResent(false);
      inputRefs.current[0]?.focus();
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col items-center justify-center px-5 safe-area-top safe-area-bottom">
      <div className="w-full max-w-sm space-y-6">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="w-4 h-4" /> Torna indietro
        </button>

        {/* Icona */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Mail className="w-8 h-8 text-primary" />
          </div>
        </div>

        {/* Testo */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Verifica la tua email</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Abbiamo inviato un codice a 6 cifre a
          </p>
          <p className="text-sm font-semibold text-foreground">{email}</p>
          <p className="text-xs text-muted-foreground">
            Controlla anche la cartella spam.
          </p>
        </div>

        {sending ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Input OTP */}
            <div className="flex gap-2.5 justify-center" onPaste={handlePaste}>
              {digits.map((d, idx) => (
                <input
                  key={idx}
                  ref={(el) => { inputRefs.current[idx] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-12 h-14 text-center text-2xl font-bold rounded-xl border border-border bg-surface-1 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                />
              ))}
            </div>

            {error && (
              <p className="text-xs text-red-500 text-center bg-red-500/10 rounded-xl px-3 py-2.5">
                {error}
              </p>
            )}

            {/* Bottone */}
            <Button
              onClick={handleVerify}
              disabled={digits.join("").length < 6 || loading}
              className="w-full"
              size="lg"
            >
              {loading
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifica in corso…</>
                : <><ShieldCheck className="w-4 h-4 mr-2" /> Conferma e prosegui</>
              }
            </Button>

            {/* Rinvia */}
            <div className="text-center">
              {resent ? (
                <p className="text-xs text-green-500 font-medium">✓ Nuovo codice inviato!</p>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="text-xs text-muted-foreground hover:text-primary underline-offset-2 hover:underline transition flex items-center gap-1.5 mx-auto"
                >
                  {resending
                    ? <Loader2 className="w-3 h-3 animate-spin" />
                    : <RefreshCw className="w-3 h-3" />
                  }
                  Non hai ricevuto il codice? Invialo di nuovo
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PrenotaVerifica;
