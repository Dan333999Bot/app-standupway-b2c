import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Shield, Edit2, Save, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Profilo = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    nome: "Mario",
    cognome: "Rossi",
    email: "mario.rossi@email.com",
    telefono: "+39 333 1234567",
    città: "Milano",
    dataNascita: "15/06/1990",
    percorso: "Dipendenza Crack/Cocaina",
    inizioPercorso: "28 Ottobre 2025",
  });

  const cleanDate = localStorage.getItem("standup_clean_date");
  const cleanDays = cleanDate
    ? Math.max(0, Math.floor((Date.now() - new Date(cleanDate).getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  const handleSave = () => {
    setIsEditing(false);
    toast({ title: "Profilo aggiornato! ✅", description: "Le modifiche sono state salvate." });
  };

  return (
    <div className="min-h-screen bg-surface-0 pb-24">
      <header className="bg-surface-1 border-b border-border/40 px-4 py-4 safe-area-top shadow-[var(--shadow-sm)]">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Indietro</span>
          </button>
          <Button
            size="sm"
            variant={isEditing ? "default" : "outline"}
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            className="text-xs"
          >
            {isEditing ? <><Save className="w-3.5 h-3.5 mr-1" /> Salva</> : <><Edit2 className="w-3.5 h-3.5 mr-1" /> Modifica</>}
          </Button>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6 bg-surface-inset">
        {/* Avatar + Name */}
        <div className="text-center space-y-3">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
            <User className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{profile.nome} {profile.cognome}</h1>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
          </div>
          {cleanDays > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10">
              <Flame className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-primary">{cleanDays} giorni</span>
              <span className="text-xs text-primary/70">di percorso</span>
            </div>
          )}
        </div>

        {/* Personal info */}
        <div className="glass-card rounded-xl p-4 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Dati personali</h2>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1">
                <p className="text-[10px] text-muted-foreground">Nome</p>
                {isEditing ? (
                  <Input value={profile.nome} onChange={(e) => setProfile(p => ({ ...p, nome: e.target.value }))} className="h-8 text-sm" />
                ) : (
                  <p className="text-sm text-foreground">{profile.nome}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1">
                <p className="text-[10px] text-muted-foreground">Cognome</p>
                {isEditing ? (
                  <Input value={profile.cognome} onChange={(e) => setProfile(p => ({ ...p, cognome: e.target.value }))} className="h-8 text-sm" />
                ) : (
                  <p className="text-sm text-foreground">{profile.cognome}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1">
                <p className="text-[10px] text-muted-foreground">Email</p>
                {isEditing ? (
                  <Input value={profile.email} onChange={(e) => setProfile(p => ({ ...p, email: e.target.value }))} className="h-8 text-sm" />
                ) : (
                  <p className="text-sm text-foreground">{profile.email}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1">
                <p className="text-[10px] text-muted-foreground">Telefono</p>
                {isEditing ? (
                  <Input value={profile.telefono} onChange={(e) => setProfile(p => ({ ...p, telefono: e.target.value }))} className="h-8 text-sm" />
                ) : (
                  <p className="text-sm text-foreground">{profile.telefono}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1">
                <p className="text-[10px] text-muted-foreground">Città</p>
                {isEditing ? (
                  <Input value={profile.città} onChange={(e) => setProfile(p => ({ ...p, città: e.target.value }))} className="h-8 text-sm" />
                ) : (
                  <p className="text-sm text-foreground">{profile.città}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1">
                <p className="text-[10px] text-muted-foreground">Data di nascita</p>
                <p className="text-sm text-foreground">{profile.dataNascita}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Percorso info */}
        <div className="glass-card rounded-xl p-4 space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Il mio percorso</h2>
          <div className="flex items-center gap-3">
            <Shield className="w-4 h-4 text-primary flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">{profile.percorso}</p>
              <p className="text-[10px] text-muted-foreground">Iniziato il {profile.inizioPercorso}</p>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profilo;
