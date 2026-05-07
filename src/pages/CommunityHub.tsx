import { useRef, useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { HeaderActions } from "@/components/HeaderActions";
import { BackButton } from "@/components/BackButton";
import { Link } from "react-router-dom";
import {
  Users, MapPin, Heart, HeartHandshake, Stethoscope, GraduationCap, Flower2,
  Lock, ImagePlus, Video as VideoIcon, Send, ThumbsUp, MessageCircle,
  CalendarDays, X, Newspaper, Sparkles, Globe, Clock,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Tab = "bacheca" | "incontri" | "gruppi";
type BoardKey = "pubblica" | "utenti" | "familiari" | "professionisti" | "coach";

const isPercorsoActive = () => localStorage.getItem("standup_percorso_state") === "active";

const BOARDS: { key: BoardKey; label: string; icon: any; color: string; private: boolean; desc: string }[] = [
  { key: "pubblica",       label: "Pubblica",       icon: Globe,         color: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/40 text-emerald-700 dark:text-emerald-400", private: false, desc: "Aperta a tutti" },
  { key: "utenti",         label: "Utenti percorsi", icon: Heart,        color: "from-primary/20 to-primary/5 border-primary/40 text-primary",                                       private: true,  desc: "Riservata a chi è in percorso" },
  { key: "familiari",      label: "Familiari",      icon: HeartHandshake, color: "from-amber-500/20 to-amber-500/5 border-amber-500/40 text-amber-700 dark:text-amber-400",         private: true,  desc: "Riservata ai familiari" },
  { key: "professionisti", label: "Professionisti", icon: Stethoscope,   color: "from-blue-500/20 to-blue-500/5 border-blue-500/40 text-blue-700 dark:text-blue-400",                private: true,  desc: "Riservata ai professionisti" },
  { key: "coach",          label: "Coach",          icon: GraduationCap, color: "from-violet-500/20 to-violet-500/5 border-violet-500/40 text-violet-700 dark:text-violet-400",      private: true,  desc: "Riservata ai coach" },
];

const SUB_CIRCLES = [
  { key: "tutor",  label: "Tutor & Coach",  icon: GraduationCap, members: 84 },
  { key: "pro",    label: "Professionisti", icon: Stethoscope,    members: 156 },
  { key: "fam",    label: "Familiari",      icon: HeartHandshake, members: 312 },
  { key: "ladies", label: "Ladies Only",    icon: Flower2,        members: 198 },
];

const INCONTRI = [
  { id: "bm-mi-16", tipo: "basement", title: "Basement Milano",  city: "Milano",  data: "Sab 16 Mag", ora: "14:30 – 17:30", durata: "3 ore",            to: "/attivita/eventi/bm-mi-16" },
  { id: "bm-rm-17", tipo: "basement", title: "Basement Roma",    city: "Roma",    data: "Dom 17 Mag", ora: "15:00 – 18:00", durata: "3 ore",            to: "/attivita/eventi/bm-rm-17" },
  { id: "sl-mi-24", tipo: "standlab", title: "StandLab Milano",  city: "Milano",  data: "Sab 24 Mag", ora: "10:00 – 19:00", durata: "Giornata intera",  to: "/attivita/eventi/sl-mi-24" },
  { id: "bm-bo-23", tipo: "basement", title: "Basement Bologna", city: "Bologna", data: "Sab 23 Mag", ora: "15:00 – 18:00", durata: "3 ore",            to: "/attivita/eventi/bm-bo-23" },
  { id: "sl-rm-31", tipo: "standlab", title: "StandLab Roma",    city: "Roma",    data: "Sab 31 Mag", ora: "10:00 – 19:00", durata: "Giornata intera",  to: "/attivita/eventi/sl-rm-31" },
];

const TIPO_META = {
  basement: { label: "Basement", color: "bg-primary/10 text-primary border-primary/30" },
  standlab: { label: "StandLab", color: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30" },
} as const;

interface BoardPost {
  id: number; author: string; avatar: string; time: string; city?: string;
  board: BoardKey;
  content: string; media?: { type: "image" | "video"; url: string };
  likes: number; liked: boolean; comments: number;
}

const SEED_POSTS: BoardPost[] = [
  { id: 1, author: "Coach Marco", avatar: "M", time: "1 ora fa", city: "Milano", board: "coach",
    content: "Ieri sera al Basement di Milano: 32 persone, energia incredibile. Grazie a tutti 💪",
    media: { type: "image", url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=70" },
    likes: 47, liked: false, comments: 8 },
  { id: 2, author: "Anna M.", avatar: "A", time: "3 ore fa", city: "Roma", board: "utenti",
    content: "Oggi 60 giorni puliti. Non ci credo neanche io. Grazie a questa community ❤️",
    likes: 124, liked: false, comments: 23 },
  { id: 3, author: "StandUpWay", avatar: "S", time: "5 ore fa", board: "pubblica",
    content: "Sapevi che il primo colloquio è gratuito? 30 minuti per capire dove sei e cosa può aiutarti davvero.",
    likes: 18, liked: false, comments: 4 },
  { id: 4, author: "Giulia · familiare", avatar: "G", time: "ieri", city: "Verona", board: "familiari",
    content: "Mio figlio oggi ha fatto il primo colloquio. Ho pianto per due ore, ma di sollievo. Grazie a chi mi ha consigliato di iniziare anche io un percorso parallelo.",
    likes: 89, liked: false, comments: 17 },
  { id: 5, author: "Luca P.", avatar: "L", time: "ieri", city: "Roma", board: "pubblica",
    content: "Cammino di gruppo a Villa Ada stamattina. Domenica prossima si replica, chi c'è?",
    media: { type: "image", url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=70" },
    likes: 38, liked: false, comments: 5 },
  { id: 6, author: "Dott.ssa Rossi", avatar: "R", time: "2 giorni fa", board: "professionisti",
    content: "Pubblicato un nuovo articolo sulle ricadute nei primi 90 giorni. Lo trovate nei materiali del gruppo.",
    likes: 22, liked: false, comments: 3 },
  { id: 7, author: "Marco · 1 anno pulito", avatar: "M", time: "2 giorni fa", city: "Milano", board: "utenti",
    content: "Un anno fa oggi era tutto buio. Oggi sono qui, con voi. Se ce l'ho fatta io, ce la potete fare anche voi.",
    likes: 312, liked: false, comments: 58 },
  { id: 8, author: "Sara · mamma", avatar: "S", time: "3 giorni fa", city: "Bologna", board: "familiari",
    content: "Domanda alla community: come gestite il momento in cui torna a casa dopo il percorso? Consigli pratici?",
    likes: 14, liked: false, comments: 21 },
];

const TABS: { key: Tab; label: string; icon: any }[] = [
  { key: "bacheca",  label: "Bacheca",         icon: Newspaper },
  { key: "incontri", label: "Incontri dal vivo", icon: CalendarDays },
  { key: "gruppi",   label: "Gruppi",          icon: Users },
];

const Community = () => {
  const [tab, setTab] = useState<Tab>("bacheca");
  const [board, setBoard] = useState<BoardKey>("pubblica");
  const [posts, setPosts] = useState<BoardPost[]>(SEED_POSTS);
  const [composer, setComposer] = useState("");
  const [composerMedia, setComposerMedia] = useState<{ type: "image" | "video"; url: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const unlocked = isPercorsoActive();
  const currentBoard = BOARDS.find((b) => b.key === board)!;
  const boardLocked = currentBoard.private && !unlocked;
  const filteredPosts = posts.filter((p) => p.board === board);

  const onPickMedia = (type: "image" | "video", e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setComposerMedia({ type, url: URL.createObjectURL(f) });
    e.target.value = "";
  };

  const publish = () => {
    if (!composer.trim() && !composerMedia) return;
    setPosts((prev) => [{
      id: Date.now(), author: "Tu", avatar: "T", time: "Adesso", board,
      content: composer.trim(), media: composerMedia ?? undefined,
      likes: 0, liked: false, comments: 0,
    }, ...prev]);
    setComposer(""); setComposerMedia(null);
    toast.success(`Post pubblicato in bacheca ${currentBoard.label}`);
  };

  const toggleLike = (id: number) => {
    setPosts((p) => p.map(x => x.id === id ? { ...x, liked: !x.liked, likes: x.liked ? x.likes - 1 : x.likes + 1 } : x));
  };

  return (
    <div className="min-h-screen bg-surface-0 pb-24">
      <header className="sticky top-0 z-30 bg-surface-1/95 backdrop-blur border-b border-border/40 safe-area-top shadow-[var(--shadow-sm)]">
        <div className="px-4 py-3 flex items-center gap-3">
          <BackButton />
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-bold text-foreground leading-none">Community</h1>
              <p className="text-[10px] text-muted-foreground mt-0.5">2.847 membri attivi</p>
            </div>
          </div>
          <HeaderActions />
        </div>
        {/* Tab bar — bottoni più grandi */}
        <nav className="grid grid-cols-3 gap-1.5 px-3 pb-3">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-3 rounded-xl border transition-all",
                  active
                    ? "bg-primary/10 border-primary/40 text-primary shadow-sm"
                    : "bg-surface-1 border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[11px] font-semibold leading-none">{t.label}</span>
              </button>
            );
          })}
        </nav>
      </header>

      {/* === BACHECA === */}
      {tab === "bacheca" && (
        <div className="px-4 py-4 space-y-4">
          {/* Selettore bacheca */}
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-2 px-1">Scegli la bacheca</p>
            <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
              {BOARDS.map((b) => {
                const Icon = b.icon;
                const active = board === b.key;
                return (
                  <button
                    key={b.key}
                    onClick={() => setBoard(b.key)}
                    className={cn(
                      "flex items-center gap-1.5 h-9 px-3 rounded-full border text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0",
                      active
                        ? `bg-gradient-to-br ${b.color}`
                        : "bg-surface-1 border-border text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" /> {b.label}
                    {b.private && <Lock className="w-2.5 h-2.5 opacity-70" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Header bacheca corrente */}
          <div className={cn("rounded-2xl border bg-gradient-to-br p-3 flex items-center gap-3", currentBoard.color)}>
            <currentBoard.icon className="w-5 h-5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold leading-none">Bacheca {currentBoard.label}</p>
              <p className="text-[11px] opacity-80 mt-0.5">{currentBoard.desc}</p>
            </div>
            {currentBoard.private && (
              <span className="inline-flex items-center gap-0.5 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-background/40">
                <Lock className="w-2 h-2" /> Privata
              </span>
            )}
          </div>

          {boardLocked ? (
            <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm font-semibold text-foreground">Bacheca riservata</p>
              <p className="text-xs text-muted-foreground">Per accedere devi essere iscritto a un percorso o appartenere a questa categoria.</p>
              <Link to="/percorsi">
                <Button variant="cta" size="sm">Inizia un percorso</Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Composer */}
              <div className="rounded-2xl bg-surface-1 border border-border/40 p-3 space-y-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">Tu</div>
                  <Textarea value={composer} onChange={(e) => setComposer(e.target.value)} placeholder={`Scrivi qualcosa nella bacheca ${currentBoard.label.toLowerCase()}…`}
                    className="bg-transparent border-none p-0 min-h-[40px] resize-none text-sm focus-visible:ring-0 shadow-none" />
                </div>
                {composerMedia && (
                  <div className="relative ml-11 rounded-xl overflow-hidden">
                    {composerMedia.type === "image"
                      ? <img src={composerMedia.url} alt="" className="w-full max-h-60 object-cover" />
                      : <video src={composerMedia.url} controls className="w-full max-h-60" />}
                    <button onClick={() => setComposerMedia(null)} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/80 backdrop-blur flex items-center justify-center">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <div className="flex items-center justify-between pl-11 border-t border-border/30 pt-2">
                  <div className="flex items-center gap-1">
                    <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={(e) => onPickMedia("image", e)} />
                    <input ref={videoInputRef} type="file" accept="video/*" hidden onChange={(e) => onPickMedia("video", e)} />
                    <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 px-2.5 h-8 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/50">
                      <ImagePlus className="w-4 h-4 text-emerald-500" /> Foto
                    </button>
                    <button onClick={() => videoInputRef.current?.click()} className="flex items-center gap-1.5 px-2.5 h-8 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/50">
                      <VideoIcon className="w-4 h-4 text-rose-500" /> Video
                    </button>
                  </div>
                  <Button size="sm" onClick={publish} disabled={!composer.trim() && !composerMedia} className="h-8 text-xs px-3">
                    <Send className="w-3.5 h-3.5 mr-1" /> Pubblica
                  </Button>
                </div>
              </div>

              {/* Feed */}
              <div className="space-y-3">
                {filteredPosts.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-6">Ancora nessun post in questa bacheca.</p>
                )}
                {filteredPosts.map((p) => (
                  <article key={p.id} className="bg-surface-1 border border-border/40 rounded-2xl overflow-hidden">
                    <header className="flex items-center gap-2.5 p-3">
                      <div className="w-9 h-9 rounded-full bg-primary/15 text-primary flex items-center justify-center text-sm font-semibold">{p.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{p.author}</p>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                          {p.time}
                          {p.city && <><span>·</span><MapPin className="w-2.5 h-2.5" />{p.city}</>}
                        </p>
                      </div>
                    </header>
                    {p.content && <p className="px-3 pb-3 text-sm text-foreground/90 leading-relaxed whitespace-pre-line">{p.content}</p>}
                    {p.media?.type === "image" && <img src={p.media.url} alt="" className="w-full max-h-80 object-cover" />}
                    {p.media?.type === "video" && <video src={p.media.url} controls className="w-full max-h-80" />}
                    <div className="flex items-center gap-1 px-2 py-1.5 border-t border-border/20">
                      <button onClick={() => toggleLike(p.id)} className={cn("flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs transition-colors",
                        p.liked ? "text-primary font-semibold bg-primary/5" : "text-muted-foreground hover:bg-secondary/50")}>
                        <ThumbsUp className={cn("w-4 h-4", p.liked && "fill-primary")} /> {p.likes}
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-secondary/50">
                        <MessageCircle className="w-4 h-4" /> {p.comments}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* === INCONTRI DAL VIVO === */}
      {tab === "incontri" && (
        <div className="px-4 py-4 space-y-3">
          <div className="rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 p-4">
            <div className="flex items-center gap-2 mb-1">
              <CalendarDays className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h2 className="text-sm font-bold text-foreground">Incontri dal vivo</h2>
            </div>
            <p className="text-[11px] text-muted-foreground">
              <strong>Basement</strong>: incontri pomeridiani sul territorio (3 ore).<br/>
              <strong>StandLab</strong>: eventi di una giornata in città.
            </p>
          </div>

          <div className="space-y-2.5">
            {INCONTRI.map((e) => {
              const meta = TIPO_META[e.tipo as keyof typeof TIPO_META];
              return (
                <Link key={e.id} to={e.to}
                  className={cn("block bg-surface-1 border rounded-2xl p-4 hover:border-primary/30 transition-all", meta.color.split(" ")[2])}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0", meta.color)}>
                      <CalendarDays className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={cn("inline-block text-[10px] font-bold px-2 py-0.5 rounded-full", meta.color)}>{meta.label}</span>
                      <h3 className="font-semibold text-foreground text-sm mt-1 leading-tight">{e.title}</h3>
                      <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
                        <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />{e.data}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{e.ora}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{e.city}</span>
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* === GRUPPI === */}
      {tab === "gruppi" && (
        <div className="px-4 py-4 space-y-5">
          <div className="rounded-2xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border border-primary/30 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold text-foreground">Una community sola, mille storie</h2>
            </div>
            <p className="text-[12px] text-foreground/85 leading-relaxed">
              Utenti, familiari e professionisti — coach, psicologi e centri di cura — insieme dentro StandUpWay.
              Uno spazio sicuro, riservato e alla pari, dove la diversità di esperienze diventa la tua forza.
            </p>
          </div>

          <section className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">Sotto-cerchie</h3>
            <div className="grid grid-cols-2 gap-2">
              {SUB_CIRCLES.map((s) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.key}
                    onClick={() => toast.info(`${s.label}`, { description: "Spazio riservato. Richiedi accesso al tuo coach." })}
                    className="flex items-center gap-2 p-3 rounded-2xl border border-border bg-surface-1 hover:border-primary/40 transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground leading-tight">{s.label}</p>
                      <p className="text-[10px] text-muted-foreground">{s.members} membri</p>
                    </div>
                    <Lock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          </section>

          {!unlocked && (
            <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-4 text-center space-y-2">
              <Lock className="w-5 h-5 text-primary mx-auto" />
              <p className="text-xs font-semibold text-foreground">I gruppi sono riservati a chi è iscritto a un percorso.</p>
              <Link to="/percorsi" className="inline-block text-xs font-semibold text-primary underline">
                Inizia il tuo percorso →
              </Link>
            </div>
          )}
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Community;
