import { trackCta } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20" />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] animate-pulse-subtle" />

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">Percorsi personalizzati per ogni dipendenza</span>
          </div>

          {/* Headline */}
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-in"
            style={{ animationDelay: '0.1s' }}
          >
            Il tuo percorso verso la{' '}
            <span className="text-gradient-red">libertà</span>{' '}
            inizia qui
          </h1>

          {/* Subheadline */}
          <p 
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            StandUpWay ti accompagna passo dopo passo nel superamento delle dipendenze, 
            con strumenti concreti e il supporto di esperti dedicati.
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in"
            style={{ animationDelay: '0.3s' }}
          >
            <Button variant="hero" size="xl" onClick={() => trackCta("hero_parla_supporto", "landing")}>
              <Phone className="w-5 h-5" />
              Parla con il Supporto
            </Button>
            <Button variant="outline" size="lg" onClick={() => trackCta("hero_scopri_percorsi", "landing")}>
              Scopri i percorsi
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Social proof */}
          <div 
            className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-muted-foreground animate-fade-in"
            style={{ animationDelay: '0.4s' }}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">500+</span>
              <span className="text-sm">Persone aiutate</span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-border" />
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">12</span>
              <span className="text-sm">Tipologie di dipendenza</span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-border" />
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">3 anni</span>
              <span className="text-sm">Di esperienza</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
