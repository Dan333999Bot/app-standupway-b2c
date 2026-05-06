import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft, FileText, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ricevute = [
  { id: 1, data: "10 Mar 2026", descrizione: "Colloquio con psicologo", importo: "49,00€", tipo: "Fattura", numero: "FAT-2026-0042" },
  { id: 2, data: "5 Mar 2026", descrizione: "Visita medica in sede", importo: "150,00€", tipo: "Fattura", numero: "FAT-2026-0038" },
  { id: 3, data: "1 Mar 2026", descrizione: "Supporto individuale settimanale", importo: "80,00€", tipo: "Ricevuta", numero: "RIC-2026-0035" },
  { id: 4, data: "22 Feb 2026", descrizione: "Attività di gruppo settimanali", importo: "80,00€", tipo: "Ricevuta", numero: "RIC-2026-0029" },
  { id: 5, data: "15 Feb 2026", descrizione: "Colloquio con psicologo", importo: "49,00€", tipo: "Fattura", numero: "FAT-2026-0024" },
];

const Ricevute = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="glass border-b border-border/50 px-4 py-4 safe-area-top">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Indietro</span>
        </button>
      </header>

      <div className="px-4 py-6 space-y-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Ricevute e Fatture</h1>
          <p className="text-xs text-muted-foreground mt-1">Tutte le tue spese sanitarie detraibili</p>
        </div>

        <div className="rounded-lg p-3 border-l-2 border-green-400/50 bg-green-400/5">
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Spese detraibili.</span>{" "}
            Tutte le fatture sono valide per la detrazione fiscale come spese sanitarie nella dichiarazione dei redditi.
          </p>
        </div>

        <div className="space-y-2">
          {ricevute.map((r) => (
            <div key={r.id} className="glass-card rounded-xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{r.descrizione}</p>
                <p className="text-[10px] text-muted-foreground">{r.data} · {r.numero}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground font-medium">{r.tipo}</span>
                  <span className="text-xs font-bold text-foreground">{r.importo}</span>
                </div>
              </div>
              <Button size="icon" variant="ghost" className="h-8 w-8 flex-shrink-0">
                <Download className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Ricevute;
