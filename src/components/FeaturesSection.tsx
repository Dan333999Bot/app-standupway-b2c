import { BookOpen, Route, Calendar, ArrowRight, Sparkles, Users, Clock, PenLine, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Route,
    title: "Percorsi StandUp",
    description: "Programmi specifici per ogni tipo di dipendenza: alcol, gioco, sostanze, tecnologia e molto altro.",
    href: "/percorsi",
    highlight: "12 percorsi",
    stats: "Personalizzati per te",
  },
  {
    icon: Calendar,
    title: "Eventi",
    description: "Webinar, gruppi di supporto e incontri dal vivo. Non sei solo in questo percorso.",
    href: "/eventi",
    highlight: "Ogni settimana",
    stats: "Community attiva",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-24 relative">
      <div className="container">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-medium tracking-wide uppercase mb-4 block">
            I tuoi strumenti
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tutto ciò di cui hai bisogno
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Strumenti progettati per supportarti ogni giorno nel tuo percorso di cambiamento
          </p>
        </div>

        {/* Diario card - stile integrato */}
        <div className="mb-8">
          <Link
            to="/diario"
            className="group flex items-center justify-between p-5 rounded-xl bg-secondary/50 border border-border hover:border-primary/30 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold group-hover:text-primary transition-colors">Diario personale</h3>
                <p className="text-sm text-muted-foreground">Traccia il tuo percorso quotidiano</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                <PenLine className="w-3.5 h-3.5" />
                Aggiungi voce
              </span>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Link
              key={feature.title}
              to={feature.href}
              className="group relative p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Highlight badge */}
              <div className="flex items-center gap-2 mb-6">
                <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                  {feature.highlight}
                </span>
              </div>

              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors duration-300">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {feature.description}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{feature.stats}</span>
                <ArrowRight className="w-5 h-5 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Parla con un Supporto */}
        <div className="mt-12 text-center">
          <Button variant="hero" size="xl" asChild>
            <Link to="/supporto">
              <Phone className="w-5 h-5" />
              Parla con un Supporto
            </Link>
          </Button>
        </div>

        {/* Additional info cards */}
        <div className="mt-12 grid sm:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 p-5 rounded-xl bg-secondary/50">
            <Sparkles className="w-8 h-8 text-primary" />
            <div>
              <span className="text-sm text-muted-foreground">Approccio</span>
              <p className="font-medium">Personalizzato</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-5 rounded-xl bg-secondary/50">
            <Users className="w-8 h-8 text-primary" />
            <div>
              <span className="text-sm text-muted-foreground">Supporto</span>
              <p className="font-medium">Esperti dedicati</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-5 rounded-xl bg-secondary/50">
            <Clock className="w-8 h-8 text-primary" />
            <div>
              <span className="text-sm text-muted-foreground">Disponibilità</span>
              <p className="font-medium">7 giorni su 7</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
