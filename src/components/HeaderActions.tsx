import { Menu, X, User, Route, CreditCard, Tag, KeyRound, LogOut, Sun, Moon, Bell, FileText, Gift } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { useAuth } from "@/contexts/AuthContext";


const MenuDropdown = ({ onClose }: { onClose: () => void }) => {
  const [isDark, setIsDark] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setIsDark(savedTheme === "dark");
  }, []);

  const handleSignOut = async () => {
    onClose();
    await signOut();
    navigate("/login", { replace: true });
  };

  const nomeCompleto = [user?.user_metadata?.nome, user?.user_metadata?.cognome].filter(Boolean).join(" ") || "Profilo";
  const email = user?.email || "";

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
    }
  };

  return createPortal(
    <>
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[9998]" onClick={onClose} />
      <div className="fixed top-4 right-4 left-4 bg-card border border-border rounded-2xl shadow-xl z-[9999] overflow-hidden safe-area-top mt-12">
        {/* Profile Section */}
        <Link to="/profilo" onClick={onClose} className="block p-4 border-b border-border bg-secondary/30 hover:bg-secondary/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{nomeCompleto}</p>
              <p className="text-xs text-muted-foreground">{email}</p>
            </div>
          </div>
        </Link>

        <nav className="py-2">
          <Link to="/profilo" onClick={onClose} className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-secondary transition-colors">
            <User className="w-4 h-4 text-muted-foreground" /> Il mio profilo
          </Link>
          <Link to="/percorsi" onClick={onClose} className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-secondary transition-colors">
            <Route className="w-4 h-4 text-muted-foreground" /> Percorsi attivi
          </Link>
          <Link to="/notifiche" onClick={onClose} className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-secondary transition-colors">
            <Bell className="w-4 h-4 text-muted-foreground" /> Gestione notifiche
            <span className="ml-auto w-2 h-2 bg-primary rounded-full" />
          </Link>
          
          <div className="border-t border-border my-1" />
          
          <Link to="/pagamenti" onClick={onClose} className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-secondary transition-colors">
            <CreditCard className="w-4 h-4 text-muted-foreground" /> Pagamenti
          </Link>
          <Link to="/ricevute" onClick={onClose} className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-secondary transition-colors">
            <FileText className="w-4 h-4 text-muted-foreground" /> Ricevute e Fatture
          </Link>
          <Link to="/codici-sconto" onClick={onClose} className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-secondary transition-colors">
            <Tag className="w-4 h-4 text-muted-foreground" /> Codici sconto
          </Link>
          <Link to="/invita" onClick={onClose} className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-secondary transition-colors">
            <Gift className="w-4 h-4 text-muted-foreground" /> Invita un amico
          </Link>
          
          <div className="border-t border-border my-1" />
          
          <Link to="/cambia-password" onClick={onClose} className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-secondary transition-colors">
            <KeyRound className="w-4 h-4 text-muted-foreground" /> Cambia password
          </Link>
          
          <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-secondary transition-colors">
            {isDark ? <Sun className="w-4 h-4 text-muted-foreground" /> : <Moon className="w-4 h-4 text-muted-foreground" />}
            {isDark ? "Tema chiaro" : "Tema scuro"}
          </button>
          
          <div className="border-t border-border my-1" />
          
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-primary hover:bg-secondary transition-colors">
            <LogOut className="w-4 h-4" /> Esci
          </button>
        </nav>
      </div>
    </>,
    document.body
  );
};

export const HeaderActions = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="w-9 h-9 rounded-lg bg-secondary/50 flex items-center justify-center hover:bg-secondary transition-colors"
        aria-label="Menu"
      >
        {menuOpen ? <X className="w-4 h-4 text-muted-foreground" /> : <Menu className="w-4 h-4 text-muted-foreground" />}
      </button>
      {menuOpen && <MenuDropdown onClose={() => setMenuOpen(false)} />}
    </div>
  );
};
