import { Link, useLocation } from "react-router-dom";
import { Home, Route, Headphones, BookOpen, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { label: "Home", href: "/home", icon: Home, match: ["/home", "/"] },
    { label: "Percorsi", href: "/percorsi", icon: Route, match: ["/percorsi", "/percorso"] },
    { label: "Supporto", href: "/supporto", icon: Headphones, isCenter: true, match: ["/supporto"] },
    { label: "Corsi", href: "/corsi", icon: BookOpen, match: ["/corsi", "/corso"] },
    { label: "Community", href: "/community", icon: Users, match: ["/community"] },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface-1/95 backdrop-blur-xl border-t border-border/40 safe-area-bottom shadow-[0_-2px_10px_hsl(0_0%_0%/0.05)]">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = item.match.some((m) =>
            m === "/" ? location.pathname === "/" : location.pathname.startsWith(m)
          );
          const Icon = item.icon;

          if (item.isCenter) {
            return (
              <Link
                key={item.label}
                to={item.href}
                className="flex flex-col items-center justify-center -mt-6"
              >
                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg glow-red">
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-[10px] font-medium text-primary mt-1">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2 px-3 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
