import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, BookOpen, Route, Layers, Menu, X, Download } from "lucide-react";
import { useState } from "react";
import { usePWAInstall } from "@/hooks/usePWAInstall";

const navItems = [
  { label: "Home", href: "/home", icon: BookOpen },
  { label: "Percorsi", href: "/percorsi", icon: Route },
  { label: "Attività", href: "/attivita", icon: Layers },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isInstallable, isInstalled, installApp } = usePWAInstall();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">S</span>
            </div>
            <span className="font-semibold text-lg text-foreground">StandUpWay</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-2 text-sm font-medium"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isInstallable && !isInstalled && (
              <Button variant="outline" size="sm" onClick={installApp}>
                <Download className="w-4 h-4" />
                Installa
              </Button>
            )}
            <Button variant="cta" size="default">
              <Phone className="w-4 h-4" />
              Parla con il Supporto
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-3 py-2 text-base font-medium"
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
              {isInstallable && !isInstalled && (
                <Button variant="outline" size="lg" onClick={installApp} className="mt-2">
                  <Download className="w-4 h-4" />
                  Installa app
                </Button>
              )}
              <Button variant="cta" size="lg" className="mt-2">
                <Phone className="w-4 h-4" />
                Parla con il Supporto
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
