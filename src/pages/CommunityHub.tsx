import { useMemo, useRef, useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { HeaderActions } from "@/components/HeaderActions";
import { Link } from "react-router-dom";
import {
  Users, MapPin, Search, Stethoscope, Heart, HeartHandshake,
  ChevronRight, Lock, GraduationCap, Flower2, Plus, ImagePlus, Video as VideoIcon,
  Send, ThumbsUp, MessageCircle, CalendarDays, X, Newspaper, Globe2, Compass,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type AudienceKey = "utenti" | "familiari" | "professionisti";
type Tab = "bacheca" | "eventi" | "gruppi";

const AUDIENCES: { key: AudienceKey; label: string; icon: any }[] = [
  { key: "utenti", label: "Utenti", icon: Heart },
  { key: "familiari", label: "Familiari", icon: HeartHandshake },
  { key: "professionisti", label: "Professionisti", icon: Stethoscope },
];

interface Group {
  id: string; city: string; region: string; type: AudienceKey;
  name: string; members: number; verified?: boolean; reserved?: boolean;
}

const GROUPS: Group[] = [
  { id: "1", city: "Milano", region: "Lombardia", type: "utenti", name: "Gruppo Milano Centro", members: 48 },
  { id: "2", city: "Milano", region: "Lombardia", type: "professionisti", name: "Centro Recovery Milano", members: 12, verified: true, reserved: true },
  { id: "4", city: "Milano", region: "Lombardia", type: "familiari", name: "Familiari Milano", members: 22, reserved: true },
  { id: "5", city: "Roma", region: "Lazio", type: "utenti", name: "Gruppo Roma Sud", members: 36 },
  { id: "7", city: "Roma", region: "Lazio", type: "familiari", name: "Cerchio Familiari Roma", members: 18, reserved: true },
  { id: "8", city: "Bologna", region: "Emilia-Romagna", type: "utenti", name: "Gruppo Bologna", members: 29 },
  { id: "10", city: "Torino", region: "Piemonte", type: "utenti", name: "Gruppo Torino", members: 24 },
  { id: "12", city: "Napoli", region: "Campania", type: "utenti", name: "Gruppo Napoli", members: 31 },
  { id: "14", city: "Firenze", region: "Toscana", type: "utenti", name: "Gruppo Firenze", members: 18 },
];

const RESERVED_NATIONAL = [
  { key: "tutor", label: "Tutor & Coach", icon: GraduationCap, members: 84 },
  { key: "pro", label: "Professionisti", icon: Stethoscope, members: 156 },
  { key: "fam", label: "Familiari", icon: HeartHandshake, members: 312 },
  { key: "ladies", label: "Ladies Only", icon: Flower2, members: 198 },
];

const TYPE_META: Record<AudienceKey, { color: string; ring: string; icon: any; label: string }> = {
  utenti: { color: "bg-primary/10 text-primary", ring: "ring-primary/30", icon: Heart, label: "Utenti" },
  familiari: { color: "bg-amber-500/10 text-amber-600 dark:text-amber-400", ring: "ring-amber-500/30", icon: HeartHandshake, label: "Familiari" },
  professionisti: { color: "bg-blue-500/10 text-blue-600 dark:text-blue-400", ring: "ring-blue-500/30", icon: Stethoscope, label: "Professionisti" },
};

const EVENTI = [
  { id: "e1", title: "Incontro Basement", when: "Sab 16 Mag · 18:30", city: "Milano", region: "Lombardia", to: "/insede" },
  { id: "e2", title: "Cerchio del mattino", when: "Dom 17 Mag · 09:00", city: "Roma", region: "Lazio", to: "/insede" },
  { id: "e3", title: "TOGETHER Bologna", when: "15-17 Mag · 3 giorni", city: "Bologna", region: "Emilia-Romagna", to: "/eventi/301" },
  { id: "e4", title: "Cammino lungo il Po", when: "Mer 20 Mag · 18:00", city: "Torino", region: "Piemonte", to: "/insede" },
];

interface BoardPost {
  id: number; author: string; avatar: string; time: string; city?: string;
  content: string; media?: { type: "image" | "video"; url: string };
  likes: number; liked: boolean; comments: number;
}

const SEED_POSTS: BoardPost[] = [
  { id: 1, author: "Coach Marco", avatar: "M", time: "1 ora fa", city: "Milano",
    content: "Ieri sera al Basement di Milano: 32 persone, energia incredibile. Grazie a tutti! 💪",
    media: { type: "image", url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=70" },
    likes: 47, liked: false, comments: 8 },
  { id: 2, author: "Anna M.", avatar: "A", time: "3 ore fa", city: "Roma",
    content: "Oggi 60 giorni puliti. Non ci credo neanche io. Grazie a questa community ❤️",
    likes: 124, liked: false, comments: 23 },
  { id: 3, author: "Luca P.", avatar: "L", time: "ieri", city: "Roma",
    content: "Cammino di gruppo a Roma stamattina. Domenica prossima si replica, chi c'è?",
    media: { type: "image", url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=70" },
    likes: 38, liked: false, comments: 5 },
];

const TABS: { key: Tab; label: string; icon: any }[] = [
  { key: "bacheca", label: "Bacheca", icon: Newspaper },
  { key: "eventi", label: "Eventi", icon: CalendarDays },
  { key: "gruppi", label: "Gruppi", icon: Users },
];

const Community = () => {
  const [tab, setTab] = useState<Tab>("bacheca");

  // Gruppi
  const [audience, setAudience] = useState<AudienceKey | "tutti">("tutti");
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupCity, setGroupCity] = useState("");
  const [groupType, setGroupType] = useState<AudienceKey>("utenti");
  const [groupDesc, setGroupDesc] = useState("");

  // Bacheca
  const [posts, setPosts] = useState<BoardPost[]>(SEED_POSTS);
  const [composer, setComposer] = useState("");
  const [composerMedia, setComposerMedia] = useState<{ type: "image" | "video"; url: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GROUPS.filter((n) => {
      if (audience !== "tutti" && n.type !== audience) return false;
      if (q && !`${n.city} ${n.region} ${n.name}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [audience, query]);

  const byCity = useMemo(() => {
    const map = new Map<string, { region: string; nodes: Group[] }>();
    filteredGroups.forEach((n) => {
      const cur = map.get(n.city) || { region: n.region, nodes: [] };
      cur.nodes.push(n);
      map.set(n.city, cur);
    });
    return Array.from(map.entries()).sort((a, b) => b[1].nodes.length - a[1].nodes.length);
  }, [filteredGroups]);

  const eventiByRegion = useMemo(() => {
    const map = new Map<string, typeof EVENTI>();
    EVENTI.forEach((e) => {
      const arr = map.get(e.region) || [];
      arr.push(e);
      map.set(e.region, arr);
    });
    return Array.from(map.entries());
  }, []);

  const createGroup = () => {
    if (!groupName.trim() || !groupCity.trim()) return;
    toast.success("Gruppo creato!", { description: `${groupName} · ${groupCity}` });
    setCreateOpen(false);
    setGroupName(""); setGroupCity(""); setGroupDesc("");
  };

  const onPickMedia = (type: "image" | "video", e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setComposerMedia({ type, url });
    e.target.value = "";
  };

  const publish = () => {
    if (!composer.trim() && !composerMedia) return;
    setPosts((prev) => [{
      id: Date.now(), author: "Tu", avatar: "T", time: "Adesso",
      content: composer.trim(), media: composerMedia ?? undefined,
      likes: 0, liked: false, comments: 0,
    }, ...prev]);
    setComposer(""); setComposerMedia(null);
    toast.success("Post pubblicato in bacheca");
  };

  const toggleLike = (id: number) => {
    setPosts((p) => p.map(x => x.id === id ? { ...x, liked: !x.liked, likes: x.liked ? x.likes - 1 : x.likes + 1 } : x));
  };

  return (
    <div className="min-h-screen bg-surface-0 pb-24">
      {/* Header social-style */}
      <header className="sticky top-0 z-30 bg-surface-1/95 backdrop-blur border-b border-border/40 safe-area-top shadow-[var(--shadow-sm)]">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Users className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground leading-none">Community</h1>
              <p className="text-[10px] text-muted-foreground mt-0.5">2.847 membri attivi</p>
            </div>
          </div>
          <HeaderActions />
        </div>
        {/* Tab menu */}
        <nav className="flex border-t border-border/30">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-colors relative",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                {t.label}
                {active && <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full" />}
              </button>
            );
          })}
        </nav>
      </header>

      {/* === BACHECA === */}
      {tab === "bacheca" && (
        <div className="px-4 py-4 space-y-4">
          {/* composer */}
          <div className="rounded-2xl bg-surface-1 border border-border/40 p-3 space-y-3">
            <div className="flex items-start gap-2.5">
              <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">Tu</div>
              <Textarea
                value={composer}
                onChange={(e) => setComposer(e.target.value)}
                placeholder="Cosa vuoi condividere oggi?"
                className="bg-transparent border-none p-0 min-h-[40px] resize-none text-sm focus-visible:ring-0 shadow-none"
              />
            </div>
            {composerMedia && (
              <div className="relative ml-11 rounded-xl overflow-hidden">
                {composerMedia.type === "image" ? (
                  <img src={composerMedia.url} alt="" className="w-full max-h-60 object-cover" />
                ) : (
                  <video src={composerMedia.url} controls className="w-full max-h-60" />
                )}
                <button
                  onClick={() => setComposerMedia(null)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/80 backdrop-blur flex items-center justify-center"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <div className="flex items-center justify-between pl-11 border-t border-border/30 pt-2">
              <div className="flex items-center gap-1">
                <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={(e) => onPickMedia("image", e)} />
                <input ref={videoInputRef} type="file" accept="video/*" hidden onChange={(e) => onPickMedia("video", e)} />
                <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 px-2.5 h-8 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
                  <ImagePlus className="w-4 h-4 text-emerald-500" /> Foto
                </button>
                <button onClick={() => videoInputRef.current?.click()} className="flex items-center gap-1.5 px-2.5 h-8 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
                  <VideoIcon className="w-4 h-4 text-rose-500" /> Video
                </button>
              </div>
              <Button size="sm" onClick={publish} disabled={!composer.trim() && !composerMedia} className="h-8 text-xs px-3">
                <Send className="w-3.5 h-3.5 mr-1" /> Pubblica
              </Button>
            </div>
          </div>

          {/* feed */}
          <div className="space-y-3">
            {posts.map((p) => (
              <article key={p.id} className="bg-surface-1 border border-border/40 rounded-2xl overflow-hidden">
                <header className="flex items-center gap-2.5 p-3">
                  <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-sm font-semibold text-primary">{p.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{p.author}</p>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                      {p.time}
                      {p.city && <><span>·</span><MapPin className="w-2.5 h-2.5" />{p.city}</>}
                    </p>
                  </div>
                </header>
                {p.content && <p className="px-3 pb-3 text-sm text-foreground/90 leading-relaxed">{p.content}</p>}
                {p.media?.type === "image" && <img src={p.media.url} alt="" className="w-full max-h-80 object-cover" />}
                {p.media?.type === "video" && <video src={p.media.url} controls className="w-full max-h-80" />}
                <div className="flex items-center gap-1 px-2 py-1.5 border-t border-border/20">
                  <button onClick={() => toggleLike(p.id)} className={cn("flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs transition-colors", p.liked ? "text-primary font-semibold bg-primary/5" : "text-muted-foreground hover:bg-secondary/50")}>
                    <ThumbsUp className={cn("w-4 h-4", p.liked && "fill-primary")} /> {p.likes}
                  </button>
                  <Link to="/community/feed" className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-secondary/50">
                    <MessageCircle className="w-4 h-4" /> {p.comments}
                  </Link>
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-secondary/50">
                    <Send className="w-4 h-4" /> Condividi
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* === EVENTI === */}
      {tab === "eventi" && (
        <div className="px-4 py-4 space-y-5">
          <div className="rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 p-4">
            <div className="flex items-center gap-2 mb-1">
              <CalendarDays className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h2 className="text-sm font-bold text-foreground">Eventi e incontri dal vivo</h2>
            </div>
            <p className="text-[11px] text-muted-foreground">Trova un incontro vicino a te, organizzato per regione.</p>
          </div>

          {eventiByRegion.map(([region, list]) => (
            <section key={region} className="space-y-2">
              <div className="flex items-center gap-2 px-1">
                <Globe2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">{region}</h3>
                <span className="text-[10px] text-muted-foreground">· {list.length} {list.length === 1 ? "evento" : "eventi"}</span>
              </div>
              <div className="space-y-2">
                {list.map((e) => (
                  <Link key={e.id} to={e.to} className="block bg-surface-1 border border-border/40 rounded-2xl p-3 hover:border-amber-500/40 transition-all">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex flex-col items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0">
                        <CalendarDays className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground leading-tight">{e.title}</p>
                        <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-2">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{e.city}</span>
                          <span>·</span>
                          <span>{e.when}</span>
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}

          <Link to="/insede" className="block text-center text-xs text-primary font-semibold py-3 rounded-xl border border-dashed border-border">
            Esplora tutti gli incontri in sede →
          </Link>
        </div>
      )}

      {/* === GRUPPI === */}
      {tab === "gruppi" && (
        <div className="px-4 py-4 space-y-5">
          {/* Gruppi riservati nazionali */}
          <section className="space-y-2.5">
            <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-4">
              <div className="flex items-center gap-2 mb-1">
                <Lock className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-bold text-foreground">Gruppi riservati</h2>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Spazi privati con accesso verificato. Richiedi l'ingresso per partecipare.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {RESERVED_NATIONAL.map((g) => {
                const Icon = g.icon;
                return (
                  <button
                    key={g.key}
                    onClick={() => toast.info("Richiesta inviata", { description: "Sarai verificato/a a breve." })}
                    className="text-left bg-surface-1 border border-border/40 rounded-2xl p-3 hover:border-primary/40 transition-all relative"
                  >
                    <span className="absolute top-2 right-2 inline-flex items-center gap-0.5 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-primary/15 text-primary">
                      <Lock className="w-2 h-2" /> Privato
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2">
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <p className="text-sm font-semibold text-foreground leading-tight">{g.label}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{g.members} membri verificati</p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Gruppi locali */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-sm font-bold text-foreground">Gruppi locali</h2>
              </div>
              <button
                onClick={() => setCreateOpen(true)}
                className="flex items-center gap-1 h-8 px-3 rounded-full bg-emerald-600 text-white text-xs font-semibold shadow-[var(--shadow-sm)] hover:opacity-90 transition-opacity"
              >
                <Plus className="w-3.5 h-3.5" /> Crea
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cerca per città, regione o nome…"
                className="pl-9"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-1 scrollbar-hide">
              {[{ key: "tutti" as const, label: "Tutti", icon: Globe2 }, ...AUDIENCES].map((a) => {
                const Icon = a.icon;
                const active = audience === a.key;
                return (
                  <button
                    key={a.key}
                    onClick={() => setAudience(a.key as any)}
                    className={cn(
                      "flex-shrink-0 flex items-center gap-1.5 px-3 h-8 rounded-full border text-xs font-semibold transition-all",
                      active
                        ? "bg-foreground text-background border-foreground"
                        : "bg-surface-1 text-foreground border-border hover:border-foreground/30"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" /> {a.label}
                  </button>
                );
              })}
            </div>

            {byCity.length === 0 ? (
              <div className="text-center py-12 text-sm text-muted-foreground">
                Nessun gruppo trovato. Prova a cambiare filtro o crealo tu.
              </div>
            ) : (
              <div className="space-y-4">
                {byCity.map(([city, data]) => (
                  <div key={city} className="space-y-2">
                    <div className="flex items-center gap-2 px-1">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-foreground leading-none">{city}</h4>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{data.region}</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{data.nodes.length} {data.nodes.length === 1 ? "gruppo" : "gruppi"}</span>
                    </div>
                    <div className="bg-surface-1 border border-border/40 rounded-2xl divide-y divide-border/40 overflow-hidden">
                      {data.nodes.map((n) => {
                        const meta = TYPE_META[n.type];
                        const Icon = meta.icon;
                        return (
                          <Link key={n.id} to="/community/feed" className="flex items-center gap-3 p-3 hover:bg-secondary/40 transition-colors">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", meta.color)}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <p className="text-sm font-semibold text-foreground truncate">{n.name}</p>
                                {n.verified && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400">✓</span>
                                )}
                                {n.reserved && (
                                  <span className="inline-flex items-center gap-0.5 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-primary/15 text-primary">
                                    <Lock className="w-2 h-2" /> Riservato
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-muted-foreground mt-0.5">
                                {meta.label} · {n.members} membri · {n.city}
                              </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* Dialog Crea gruppo */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-[380px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Crea il tuo gruppo</DialogTitle>
            <DialogDescription>
              In 30 secondi. Sarai il referente del tuo spazio.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Per chi è il gruppo?</p>
              <div className="flex flex-wrap gap-1.5">
                {AUDIENCES.map((a) => {
                  const Icon = a.icon;
                  const active = groupType === a.key;
                  return (
                    <button
                      key={a.key}
                      onClick={() => setGroupType(a.key)}
                      className={cn(
                        "flex items-center gap-1.5 h-8 px-3 rounded-full border text-xs font-medium transition-all",
                        active ? "border-primary bg-primary/10 text-primary" : "border-border bg-surface-1 text-foreground"
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" /> {a.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Nome</p>
              <Input value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="es. Cerchio del mattino" maxLength={60} />
            </div>

            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Città</p>
              <Input value={groupCity} onChange={(e) => setGroupCity(e.target.value)} placeholder="es. Bologna" maxLength={40} />
            </div>

            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Descrizione <span className="text-muted-foreground/60 normal-case font-normal">(opzionale)</span></p>
              <Textarea value={groupDesc} onChange={(e) => setGroupDesc(e.target.value)} placeholder="Cosa rende speciale il vostro gruppo?" maxLength={200} className="min-h-[60px] resize-none" />
            </div>

            <Button onClick={createGroup} disabled={!groupName.trim() || !groupCity.trim()} className="w-full">
              <Plus className="w-4 h-4 mr-1.5" /> Crea gruppo
            </Button>
            <p className="text-[10px] text-muted-foreground text-center">
              🔒 Privacy garantita · Sarai moderatore del tuo spazio
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default Community;
