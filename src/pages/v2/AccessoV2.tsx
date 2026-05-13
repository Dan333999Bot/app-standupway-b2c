import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Eye, EyeOff, Loader2, ShieldCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { trackPage, trackEvent } from "@/lib/analyticsV2";

type Mode = "register" | "login";
type Step = "form" | "otp";

const inputClass =
  "w-full bg-surface-0 border border-border/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition";

export default function AccessoV2() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [mode, setMode] = useState<Mode>("register");
  const [step, setStep] = useState<Step>("form");

  // Form fields
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in, go directly to home
  useEffect(() => {
    if (user) {
      navigate("/home", { replace: true });
    }
  }, [user]);

  useEffect(() => {
    trackPage("accesso_v2", { dipendenza: id });
  }, []);

  /* ─── Registration ─────────────────────────────────────────────── */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || password.length < 8) return;
    setError(null);
    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { nome: nome.trim() },
      },
    });

    if (signUpError) {
      setLoading(false);
      const msg = signUpError.message.toLowerCase();
      if (msg.includes("already") || msg.includes("registered")) {
        setError("Email già registrata. Usa \"Ho già un account\".");
      } else {
        setError(`Errore: ${signUpError.message}`);
      }
      return;
    }

    // Try immediate sign-in (works if auto-confirm is enabled)
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (!signInError) {
      // Signed in → save V2 result and go to home
      await finalize("registrazione_v2_completata");
      return;
    }

    // Email confirmation required → send OTP and show verification step
    await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: false },
    });
    sessionStorage.setItem("sw_verify_email", email.trim());
    setLoading(false);
    setStep("otp");
  };

  /* ─── OTP verification ─────────────────────────────────────────── */
  const handleOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) return;
    setError(null);
    setLoading(true);

    const verifyEmail = sessionStorage.getItem("sw_verify_email") || email.trim();
    const { error: otpError } = await supabase.auth.verifyOtp({
      email: verifyEmail,
      token: otp.trim(),
      type: "email",
    });

    if (otpError) {
      setLoading(false);
      setError("Codice non valido. Controlla la tua email e riprova.");
      return;
    }

    await finalize("registrazione_v2_completata");
  };

  /* ─── Login ────────────────────────────────────────────────────── */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setError(null);
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setLoading(false);
      setError("Email o password non corretti. Riprova.");
      return;
    }

    await finalize("login_v2_completato");
  };

  /* ─── Post-auth ────────────────────────────────────────────────── */
  const finalize = async (eventType: string) => {
    trackEvent(eventType, "accesso_v2", { dipendenza: id });
    // V2 result already in localStorage (set by PianoV2 before this page)
    setLoading(false);
    navigate("/home", { replace: true });
  };

  /* ─── Render ───────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-surface-0 flex flex-col safe-area-top">
      {/* Header */}
      <header className="bg-surface-1 border-b border-border/40 px-4 py-4">
        <div className="max-w-sm mx-auto flex items-center gap-3">
          <button
            onClick={() => step === "otp" ? setStep("form") : navigate(-1)}
            className="w-9 h-9 rounded-full hover:bg-secondary/60 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <p className="text-sm font-bold text-foreground">
              {step === "otp" ? "Conferma email" : "Inizia il percorso"}
            </p>
            <p className="text-[11px] text-muted-foreground">StandUpWay</p>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm space-y-6">

          {/* Brand */}
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-3">
              <span className="text-primary-foreground font-black text-2xl">S</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">
              {step === "otp" ? "Controlla la tua email" : "Sei a un passo dal tuo percorso"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {step === "otp"
                ? `Abbiamo inviato un codice a ${email}`
                : mode === "register"
                  ? "Crea il tuo account gratuito"
                  : "Accedi al tuo account"}
            </p>
          </div>

          {/* OTP step */}
          {step === "otp" ? (
            <form onSubmit={handleOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Codice ricevuto via email</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  className={inputClass + " text-center text-xl tracking-[0.5em] font-bold"}
                  autoFocus
                />
              </div>
              {error && <p className="text-xs text-red-500 text-center">{error}</p>}
              <Button type="submit" disabled={loading || otp.length < 6} className="w-full" size="lg">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Conferma e accedi"}
              </Button>
              <button
                type="button"
                onClick={async () => {
                  await supabase.auth.signInWithOtp({ email: email.trim(), options: { shouldCreateUser: false } });
                }}
                className="w-full text-xs text-muted-foreground hover:text-foreground transition text-center"
              >
                Non hai ricevuto il codice? Invia di nuovo
              </button>
            </form>
          ) : (
            <>
              {/* Mode tabs */}
              <div className="flex bg-secondary/60 rounded-xl p-1 gap-1">
                {(["register", "login"] as Mode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => { setMode(m); setError(null); }}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                      mode === m
                        ? "bg-surface-1 text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {m === "register" ? "Crea account" : "Ho già un account"}
                  </button>
                ))}
              </div>

              {/* Form */}
              <form onSubmit={mode === "register" ? handleRegister : handleLogin} className="space-y-4">
                {mode === "register" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Nome</label>
                    <input
                      type="text"
                      autoComplete="given-name"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Il tuo nome"
                      className={inputClass}
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Email</label>
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nome@email.com"
                    required
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Password</label>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      autoComplete={mode === "register" ? "new-password" : "current-password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={mode === "register" ? "Almeno 8 caratteri" : "La tua password"}
                      required
                      className={inputClass + " pr-11"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {mode === "register" && password.length > 0 && password.length < 8 && (
                    <p className="text-[11px] text-amber-500">Almeno 8 caratteri</p>
                  )}
                </div>

                {error && <p className="text-xs text-red-500">{error}</p>}

                <Button
                  type="submit"
                  disabled={loading || !email || !password || (mode === "register" && password.length < 8)}
                  className="w-full"
                  size="lg"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : mode === "register" ? (
                    "Crea account e inizia"
                  ) : (
                    "Accedi"
                  )}
                </Button>
              </form>

              {/* Trust */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                Segreto professionale garantito · Account gratuito
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
