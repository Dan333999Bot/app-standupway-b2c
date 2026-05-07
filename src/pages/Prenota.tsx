import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarClock, Settings } from "lucide-react";
import { usePageTracking } from "@/hooks/usePageTracking";
import { useAppConfig } from "@/hooks/useAppConfig";
import { BottomNav } from "@/components/BottomNav";

const Prenota = () => {
  usePageTracking("prenota");
  const navigate = useNavigate();
  const config = useAppConfig();
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  const calendlyUrl = config["calendly_embed_url"];

  useEffect(() => {
    if (!calendlyUrl) return;
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
    scriptRef.current = script;
    return () => {
      if (scriptRef.current) document.body.removeChild(scriptRef.current);
    };
  }, [calendlyUrl]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="glass border-b border-border/50 px-4 py-4 safe-area-top">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full hover:bg-secondary/60 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-semibold text-foreground text-base">Prenota il colloquio</h1>
            <p className="text-[11px] text-muted-foreground">Scegli data e orario</p>
          </div>
        </div>
      </header>

      <div className="flex-1 pb-20">
        {!calendlyUrl ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[50vh] gap-4 px-6 text-center">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <CalendarClock className="w-7 h-7 text-primary" />
            </div>
            <p className="text-sm font-semibold text-foreground">Calendly non configurato</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Inserisci l'URL di Calendly nella sezione{" "}
              <span className="inline-flex items-center gap-1 font-medium text-primary">
                <Settings className="w-3 h-3" /> Configurazione
              </span>{" "}
              del pannello admin.
            </p>
          </div>
        ) : (
          <div
            className="calendly-inline-widget w-full"
            data-url={calendlyUrl}
            style={{ minWidth: "320px", height: "calc(100vh - 130px)" }}
          />
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Prenota;
