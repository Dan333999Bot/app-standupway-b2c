import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ShieldCheck, Mail, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  email: string;
  onVerified: () => void;
}

const EmailVerifyModal = ({ email, onVerified }: Props) => {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
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
      setError("Codice non valido o scaduto. Riprova o richiedi un nuovo codice.");
      setDigits(["", "", "", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 0);
    } else {
      onVerified();
    }
  };

  const handleResend = async () => {
    setResending(true);
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-4 pb-0 sm:pb-4">
      <div className="bg-surface-1 rounded-t-3xl sm:rounded-3xl border border-border/40 p-6 w-full max-w-sm shadow-xl space-y-5 pb-10 sm:pb-6">

        {/* Icona */}
        <div className="flex justify-center pt-1">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Mail className="w-7 h-7 text-primary" />
          </div>
        </div>

        {/* Titolo */}
        <div className="text-center space-y-1.5">
          <h2 className="text-lg font-bold text-foreground">Verifica la tua email</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Abbiamo inviato un codice a 6 cifre a<br />
            <span className="font-semibold text-foreground">{email}</span>
          </p>
        </div>

        {/* Input OTP */}
        <div className="flex gap-2 justify-center" onPaste={handlePaste}>
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
              className="w-11 h-14 text-center text-2xl font-bold rounded-xl border border-border bg-surface-0 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            />
          ))}
        </div>

        {error && (
          <p className="text-xs text-red-500 text-center bg-red-500/10 rounded-xl px-3 py-2">
            {error}
          </p>
        )}

        {/* Bottone verifica */}
        <Button
          onClick={handleVerify}
          disabled={digits.join("").length < 6 || loading}
          className="w-full"
          size="lg"
        >
          {loading
            ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifica in corso…</>
            : <><ShieldCheck className="w-4 h-4 mr-2" /> Conferma codice</>
          }
        </Button>

        {/* Rinvia */}
        <div className="text-center">
          {resent
            ? <p className="text-xs text-green-500 font-medium">✓ Nuovo codice inviato!</p>
            : (
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
            )
          }
        </div>
      </div>
    </div>
  );
};

export default EmailVerifyModal;
