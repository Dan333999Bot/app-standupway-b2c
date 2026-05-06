import { Link } from "react-router-dom";
import { BookOpen, Route, Calendar, Mail, Phone as PhoneIcon } from "lucide-react";

const footerLinks = {
  strumenti: [
    { label: "Diario", href: "/diario", icon: BookOpen },
    { label: "Percorsi StandUp", href: "/percorsi", icon: Route },
    { label: "Eventi", href: "/eventi", icon: Calendar },
  ],
  contatti: [
    { label: "info@standupway.it", href: "mailto:info@standupway.it", icon: Mail },
  ],
};

export const Footer = () => {
  return (
    <footer className="py-16 border-t border-border">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">S</span>
              </div>
              <span className="font-semibold text-lg text-foreground">StandUpWay</span>
            </Link>
            <p className="text-muted-foreground max-w-sm leading-relaxed">
              La piattaforma che ti accompagna nel percorso verso una vita libera dalle dipendenze. Strumenti concreti, supporto umano.
            </p>
          </div>

          {/* Strumenti */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Strumenti</h4>
            <ul className="space-y-3">
              {footerLinks.strumenti.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 text-sm"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contatti */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Contatti</h4>
            <ul className="space-y-3">
              {footerLinks.contatti.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 text-sm"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} StandUpWay. Tutti i diritti riservati.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/termini" className="hover:text-foreground transition-colors">
              Termini di Servizio
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
