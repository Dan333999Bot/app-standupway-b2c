import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sparkles, ArrowRight } from "lucide-react";

export interface Preferenze {
  genere: "donna" | "uomo" | "indifferente";
  esperienza: "giovane" | "esperto" | "indifferente";
  approccio: "diretto" | "empatico" | "indifferente";
}

interface Props {
  onConfirm: (p: Preferenze) => void;
  compact?: boolean;
}

const Group = ({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: any) => void;
  options: { v: string; label: string }[];
}) => (
  <div className="space-y-2">
    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
    <div className="grid grid-cols-3 gap-2">
      {options.map((o) => (
        <button
          key={o.v}
          type="button"
          onClick={() => onChange(o.v)}
          className={cn(
            "py-2.5 px-2 rounded-xl border text-xs font-medium transition-all",
            value === o.v
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-surface-1 text-foreground hover:border-primary/30"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  </div>
);

export const PreferenzeProfessionista = ({ onConfirm, compact }: Props) => {
  const [p, setP] = useState<Preferenze>({
    genere: "indifferente",
    esperienza: "indifferente",
    approccio: "indifferente",
  });

  return (
    <div className="space-y-4">
      {!compact && (
        <div className="rounded-xl bg-primary/5 border border-primary/20 p-3 flex gap-2">
          <Sparkles className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-xs text-foreground/80 leading-relaxed">
            Vogliamo che tu ti senta a tuo agio. Dicci con chi preferisci parlare —
            faremo del nostro meglio per assegnarti la persona giusta.
          </p>
        </div>
      )}
      <Group
        label="Preferisci parlare con"
        value={p.genere}
        onChange={(v) => setP({ ...p, genere: v })}
        options={[
          { v: "donna", label: "Una donna" },
          { v: "uomo", label: "Un uomo" },
          { v: "indifferente", label: "Indifferente" },
        ]}
      />
      <Group
        label="Esperienza"
        value={p.esperienza}
        onChange={(v) => setP({ ...p, esperienza: v })}
        options={[
          { v: "giovane", label: "Giovane" },
          { v: "esperto", label: "Più esperto" },
          { v: "indifferente", label: "Indifferente" },
        ]}
      />
      <Group
        label="Stile di approccio"
        value={p.approccio}
        onChange={(v) => setP({ ...p, approccio: v })}
        options={[
          { v: "diretto", label: "Diretto" },
          { v: "empatico", label: "Empatico" },
          { v: "indifferente", label: "Indifferente" },
        ]}
      />
      <Button onClick={() => onConfirm(p)} className="w-full">
        Continua <ArrowRight className="w-4 h-4 ml-1.5" />
      </Button>
    </div>
  );
};
