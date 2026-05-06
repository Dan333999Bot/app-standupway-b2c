import { Button } from "@/components/ui/button";
import { Phone, ArrowRight } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
      
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto a iniziare il tuo percorso?
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
            Una semplice chiamata conoscitiva può essere il primo passo verso una vita libera dalle dipendenze. Nessun impegno, solo ascolto.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="xl">
              <Phone className="w-5 h-5" />
              Parla con il Supporto
            </Button>
            <Button variant="ghost" size="lg">
              Scopri di più
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Gratuito e senza impegno
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Risposta entro 24h
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
