import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarCheck, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { usePageTracking } from "@/hooks/usePageTracking";
import { useAppConfig } from "@/hooks/useAppConfig";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

type Step = "date" | "time" | "info" | "confirm" | "done";

const TIME_SLOTS = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

function formatDate(d: Date) {
  return d.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

const STEP_LABEL: Record<Step, string> = {
  date: "Scegli una data",
  time: "Scegli un orario",
  info: "I tuoi dati",
  confirm: "Conferma e paga",
  done: "Prenotazione confermata",
};

const STEP_BACK: Partial<Record<Step, Step>> = {
  time: "date",
  info: "time",
  confirm: "info",
};

const Prenota = () => {
  usePageTracking("prenota");
  const navigate = useNavigate();
  const config = useAppConfig();
  const stripeUrl = config["stripe_colloquio_url"];

  const [step, setStep] = useState<Step>("date");
  const [form, setForm] = useState({ nome: "", cognome: "", email: "", telefono: "" });
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleInfoNext = () => {
    if (!form.nome.trim() || !form.cognome.trim() || !form.email.trim()) {
      setError("Nome, cognome ed email sono obbligatori.");
      return;
    }
    setError("");
    setStep("confirm");
  };

  const handleSubmit = async () => {
    if (!date || !time) return;
    setSubmitting(true);
    const { error: err } = await supabase.from("appointments").insert({
      name: form.nome.trim(),
      surname: form.cognome.trim(),
      email: form.email.trim(),
      phone: form.telefono.trim() || null,
      appointment_date: date.toISOString().split("T")[0],
      appointment_time: time,
    });
    setSubmitting(false);
    if (err) {
      setError("Errore durante la prenotazione. Riprova.");
    } else if (stripeUrl) {
      window.location.href = stripeUrl;
    } else {
      setStep("done");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="glass border-b border-border/50 px-4 py-4 safe-area-top">
        <div className="flex items-center gap-3">
          {step !== "done" && (
            <button
              onClick={() => {
                const prev = STEP_BACK[step];
                if (prev) setStep(prev);
                else navigate(-1);
              }}
              className="w-9 h-9 rounded-full hover:bg-secondary/60 flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="font-semibold text-foreground text-base">Prenota il colloquio</h1>
            <p className="text-[11px] text-muted-foreground">{STEP_LABEL[step]}</p>
          </div>
        </div>
      </header>

      <div className="flex-1 px-4 py-6 pb-28 max-w-md mx-auto w-full">

        {/* ── Step 1: data ── */}
        {step === "date" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Seleziona il giorno che preferisci.</p>
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={(d) => { setDate(d); if (d) setStep("time"); }}
              disabled={(d) => d < new Date() || d.getDay() === 0}
              className="mx-auto"
            />
          </div>
        )}

        {/* ── Step 2: orario ── */}
        {step === "time" && date && (
          <div className="space-y-4">
            <p className="text-sm font-medium text-foreground capitalize">{formatDate(date)}</p>
            <p className="text-sm text-muted-foreground">Seleziona un orario disponibile.</p>
            <div className="grid grid-cols-3 gap-2.5">
              {TIME_SLOTS.map((t) => (
                <button
                  key={t}
                  onClick={() => { setTime(t); setStep("info"); }}
                  className={cn(
                    "py-3 rounded-xl border text-sm font-semibold transition-all",
                    time === t
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-foreground hover:border-primary/50 hover:bg-primary/5"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 3: dati personali ── */}
        {step === "info" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Inserisci i tuoi dati per completare la prenotazione.</p>
            {(["nome", "cognome", "email", "telefono"] as const).map((k) => (
              <div key={k}>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  {k === "email" ? "Email" : k === "telefono" ? "Telefono (opzionale)" : k.charAt(0).toUpperCase() + k.slice(1)}
                  {k !== "telefono" && <span className="text-primary ml-1">*</span>}
                </label>
                <input
                  type={k === "email" ? "email" : k === "telefono" ? "tel" : "text"}
                  value={form[k]}
                  onChange={set(k)}
                  placeholder={k === "email" ? "nome@email.com" : k === "telefono" ? "+39 333 000 0000" : ""}
                  className="w-full bg-secondary/50 border border-border/50 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>
            ))}
            {error && <p className="text-xs text-red-500">{error}</p>}
            <Button onClick={handleInfoNext} className="w-full mt-2">
              Avanti — controlla il riepilogo
            </Button>
          </div>
        )}

        {/* ── Step 4: riepilogo + conferma ── */}
        {step === "confirm" && date && time && (
          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-4 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-primary">Riepilogo prenotazione</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nome</span>
                  <span className="font-medium">{form.nome} {form.cognome}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{form.email}</span>
                </div>
                {form.telefono && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Telefono</span>
                    <span className="font-medium">{form.telefono}</span>
                  </div>
                )}
                <div className="border-t border-border/40 pt-2 flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <CalendarCheck className="w-3.5 h-3.5" /> Data
                  </span>
                  <span className="font-medium capitalize">{formatDate(date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Orario
                  </span>
                  <span className="font-medium">{time}</span>
                </div>
              </div>
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <Button onClick={handleSubmit} disabled={submitting} className="w-full h-12 text-base font-semibold">
              {submitting
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Invio in corso…</>
                : "Conferma e vai al pagamento · 49€"
              }
            </Button>
            <p className="text-[11px] text-muted-foreground text-center">
              La prenotazione viene salvata e verrai reindirizzato al pagamento sicuro.
            </p>
          </div>
        )}

        {/* ── Fallback: done (solo se Stripe non configurato) ── */}
        {step === "done" && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-5 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9 text-green-500" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-foreground">Prenotazione confermata!</h2>
              <p className="text-sm text-muted-foreground">
                Ci vediamo {date && formatDate(date)} alle {time}.<br />
                Verrai contattato/a all'indirizzo <strong>{form.email}</strong>.
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate("/home")} className="mt-2">
              Torna alla home
            </Button>
          </div>
        )}

      </div>

      <BottomNav />
    </div>
  );
};

export default Prenota;
