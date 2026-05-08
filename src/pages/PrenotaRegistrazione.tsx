import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const PrenotaRegistrazione = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "", cognome: "", telefono: "", email: "", password: "", confirmPassword: "",
  });
  const [privacy, setPrivacy] = useState(false);
  const [termini, setTermini] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const canSubmit =
    form.nome && form.cognome && form.telefono && form.email &&
    form.password.length >= 8 && form.password === form.confirmPassword &&
    privacy && termini;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setLoading(true);

    // 1. Crea account Supabase
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        data: {
          nome: form.nome.trim(),
          cognome: form.cognome.trim(),
          telefono: form.telefono.trim(),
          marketing_consent: marketing,
        },
      },
    });

    if (signUpError) {
      setLoading(false);
      if (signUpError.message.includes("already registered")) {
        setError("Questa email è già registrata. Accedi dalla pagina di login.");
      } else {
        setError("Errore durante la registrazione. Riprova tra qualche secondo.");
      }
      return;
    }

    // 2. Login immediato per creare la sessione (bypassa la conferma email se disabilitata)
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: form.email.trim(),
      password: form.password,
    });

    if (signInError) {
      setLoading(false);
      // Probabile email confirmation abilitata su Supabase — vai comunque al riepilogo
      // ma salva i dati in sessionStorage per recuperarli dopo il login
      setError("Account creato! Controlla la tua email per confermare, poi accedi.");
      return;
    }

    const userId = signInData.user?.id ?? data.user?.id;

    // 3. Salva prenotazione su Supabase
    const funnel = JSON.parse(sessionStorage.getItem("sw_funnel") || "{}");
    await supabase.from("bookings").insert({
      user_id: userId,
      dipendenza: funnel.dipendenza,
      score: funnel.score,
      level: funnel.level,
      data_appuntamento: funnel.data,
      ora_appuntamento: funnel.ora,
      nome: form.nome.trim(),
      cognome: form.cognome.trim(),
      telefono: form.telefono.trim(),
      email: form.email.trim(),
      marketing_consent: marketing,
      status: "pending",
    });

    // 4. Invia OTP per verifica email in-app
    await supabase.auth.signInWithOtp({
      email: form.email.trim(),
      options: { shouldCreateUser: false },
    });
    sessionStorage.setItem("sw_verify_email", form.email.trim());

    setLoading(false);
    // 5. Vai al riepilogo — la sessione è già attiva, ProtectedRoute non blocca
    navigate("/riepilogo", { replace: true });
  };

  const inputClass = "w-full bg-surface-0 border border-border/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition";

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col safe-area-top safe-area-bottom">
      {/* Header */}
      <header className="bg-surface-1 border-b border-border/40 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full hover:bg-secondary/60 flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-foreground">I tuoi dati</h1>
            <p className="text-[11px] text-muted-foreground">Crea il tuo account per completare la prenotazione</p>
          </div>
        </div>
        {/* Step indicator */}
        <div className="flex items-center gap-2 mt-3 max-w-lg mx-auto">
          {["Questionario", "Calendario", "Registrazione"].map((s, idx) => (
            <div key={s} className="flex items-center gap-1.5 flex-1">
              <div className={cn("w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0",
                idx < 2 ? "bg-primary/20 text-primary" : "bg-primary text-primary-foreground")}>
                {idx < 2 ? "✓" : idx + 1}
              </div>
              <span className={cn("text-[10px] font-medium hidden sm:block",
                idx === 2 ? "text-primary" : "text-muted-foreground")}>{s}</span>
              {idx < 2 && <div className="flex-1 h-px bg-primary/30" />}
            </div>
          ))}
        </div>
      </header>

      <form onSubmit={handleSubmit} className="flex-1 px-4 py-6 max-w-lg mx-auto w-full space-y-5">

        {/* Dati personali */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-foreground">Dati personali</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Nome *</label>
              <input type="text" value={form.nome} onChange={set("nome")} placeholder="Marco" required className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Cognome *</label>
              <input type="text" value={form.cognome} onChange={set("cognome")} placeholder="Rossi" required className={inputClass} />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Numero di telefono *</label>
            <input type="tel" value={form.telefono} onChange={set("telefono")} placeholder="+39 333 000 0000" required className={inputClass} />
          </div>
        </div>

        {/* Credenziali account */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-foreground">Crea il tuo account</h2>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Email *</label>
            <input type="email" autoComplete="email" value={form.email} onChange={set("email")} placeholder="nome@email.com" required className={inputClass} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Password * <span className="font-normal">(min. 8 caratteri)</span></label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} autoComplete="new-password" value={form.password} onChange={set("password")} placeholder="••••••••" required className={cn(inputClass, "pr-11")} />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Conferma password *</label>
            <input type={showPw ? "text" : "password"} autoComplete="new-password" value={form.confirmPassword} onChange={set("confirmPassword")} placeholder="••••••••" required className={cn(inputClass, form.confirmPassword && form.confirmPassword !== form.password ? "ring-2 ring-red-400/50 border-red-400/50" : "")} />
            {form.confirmPassword && form.confirmPassword !== form.password && (
              <p className="text-xs text-red-500">Le password non coincidono</p>
            )}
          </div>
        </div>

        {/* Consensi */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-foreground">Consensi richiesti</h2>

          {[
            {
              id: "termini", checked: termini, onChange: setTermini, required: true,
              label: <>Ho letto e accetto i <Link to="/termini" target="_blank" className="text-primary underline">Termini e Condizioni</Link> *</>,
            },
            {
              id: "privacy", checked: privacy, onChange: setPrivacy, required: true,
              label: <>Ho letto e accetto la <Link to="/privacy" target="_blank" className="text-primary underline">Privacy Policy</Link> *</>,
            },
            {
              id: "marketing", checked: marketing, onChange: setMarketing, required: false,
              label: "Acconsento a ricevere comunicazioni su offerte e aggiornamenti (facoltativo)",
            },
          ].map(({ id, checked, onChange, label }) => (
            <label key={id} className="flex items-start gap-3 cursor-pointer">
              <div className="mt-0.5 flex-shrink-0">
                <input
                  type="checkbox"
                  id={id}
                  checked={checked}
                  onChange={(e) => onChange(e.target.checked)}
                  className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
                />
              </div>
              <span className="text-xs text-foreground/80 leading-relaxed">{label}</span>
            </label>
          ))}
        </div>

        {/* Privacy note */}
        <div className="rounded-xl bg-surface-1 border border-border/40 p-3 flex gap-2.5">
          <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            I tuoi dati sono protetti da crittografia end-to-end e coperti da segreto professionale. Non vengono mai venduti a terze parti.
          </p>
        </div>

        {error && (
          <p className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>
        )}

        <div className="pb-6">
          <Button type="submit" disabled={!canSubmit || loading} className="w-full" size="lg">
            {loading
              ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creazione account…</>
              : <>Crea account e vai al riepilogo <ArrowRight className="w-4 h-4 ml-1" /></>
            }
          </Button>
          <p className="text-center text-[11px] text-muted-foreground mt-3">
            Hai già un account?{" "}
            <Link to="/login" className="text-primary font-semibold underline-offset-2 hover:underline">Accedi</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default PrenotaRegistrazione;
