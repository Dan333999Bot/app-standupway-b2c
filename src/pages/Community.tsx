import { useState, useRef } from "react";
import { usePageTracking } from "@/hooks/usePageTracking";
import { trackEvent } from "@/lib/analytics";
import { BottomNav } from "@/components/BottomNav";
import { HeaderActions } from "@/components/HeaderActions";
import {
  Heart, Image, Send, ThumbsUp, MessageCircle as CommentIcon, Share2,
  Users, GraduationCap, HeartHandshake, MapPin, Lock, Calendar, Star, Pin,
  ChevronDown, ChevronUp, Ticket, Radio,
  ArrowRight, Sparkles, Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";

// interfaces
interface Comment {
  id: number; author: string; avatar: string; content: string; time: string; likes: number; liked: boolean;
}
interface Post {
  id: number; author: string; avatar: string; time: string; content: string; image?: string;
  likes: number; liked: boolean; isCoach?: boolean; pinned?: boolean; comments: Comment[];
}
interface Zone {
  id: string; city: string; region: string;
  coach: { name: string; avatar: string; role: string };
  members: number; nextMeetup?: string; posts: Post[];
}
interface Community {
  id: string; name: string; description: string; icon: React.ElementType;
  members: number; color: string; locked?: boolean; lockMessage?: string;
  posts: Post[]; zones?: Zone[];
}

const zones: Zone[] = [
  {
    id: "milano", city: "Milano", region: "Lombardia",
    coach: { name: "Coach Marco", avatar: "M", role: "Coordinatore Lombardia" },
    members: 48, nextMeetup: "Sabato 22 Mar · 10:00",
    posts: [
      { id: 101, author: "Coach Marco", avatar: "M", time: "1 ora fa", pinned: true, content: "Ragazzi, sabato prossimo ci vediamo al parco Sempione per il nostro incontro mensile! Chi c'è? Confermate nei commenti 🙌", likes: 22, liked: false, isCoach: true, comments: [
        { id: 1001, author: "Luca P.", avatar: "L", content: "Ci sono! Non vedo l'ora 💪", time: "45 min fa", likes: 3, liked: false },
        { id: 1002, author: "Anna M.", avatar: "A", content: "Presente! Porto la torta come la volta scorsa 🎂", time: "30 min fa", likes: 5, liked: false },
        { id: 1003, author: "Davide R.", avatar: "D", content: "Fantastico, confermo anche io!", time: "20 min fa", likes: 2, liked: false },
      ]},
      { id: 102, author: "Chiara B.", avatar: "C", time: "5 ore fa", content: "Qualcuno a Milano per un caffè di gruppo questo sabato? Sarebbe bello vedersi di persona! ☕", likes: 14, liked: false, comments: [
        { id: 1004, author: "Marco R.", avatar: "M", content: "Io ci sono! Zona Navigli va bene?", time: "4 ore fa", likes: 2, liked: false },
      ]},
      { id: 107, author: "Luca P.", avatar: "L", time: "2 ore fa", content: "Oggi 30 giorni pulito. Non ci credo neanche io. Grazie a tutti voi, questa community mi ha salvato. 💪", likes: 42, liked: false, comments: [
        { id: 1009, author: "Anna M.", avatar: "A", content: "Grandissimo Luca!! 🎉🎉", time: "1 ora fa", likes: 8, liked: false },
        { id: 1010, author: "Coach Marco", avatar: "M", content: "Orgoglioso di te, continua così! 🔥", time: "1 ora fa", likes: 12, liked: false },
      ]},
    ],
  },
  {
    id: "roma", city: "Roma", region: "Lazio",
    coach: { name: "Coach Elena", avatar: "E", role: "Coordinatrice Lazio" },
    members: 52, nextMeetup: "Domenica 23 Mar · 11:00",
    posts: [
      { id: 103, author: "Coach Elena", avatar: "E", time: "3 ore fa", content: "Bellissimo l'incontro di ieri a Villa Borghese! Siete stati fantastici. Prossimo appuntamento tra due settimane 💚", likes: 31, liked: false, isCoach: true, comments: [
        { id: 1005, author: "Giulia F.", avatar: "G", content: "È stato bellissimo, grazie Coach! ❤️", time: "2 ore fa", likes: 8, liked: false },
      ]},
    ],
  },
  {
    id: "torino", city: "Torino", region: "Piemonte",
    coach: { name: "Coach Paolo", avatar: "P", role: "Coordinatore Piemonte" },
    members: 35, nextMeetup: "Sabato 29 Mar · 15:00",
    posts: [
      { id: 104, author: "Coach Paolo", avatar: "P", time: "2 ore fa", content: "Nuovo gruppo di cammino lungo il Po! Ogni mercoledì alle 18. Venite a fare due passi e due chiacchiere 🚶‍♂️", likes: 18, liked: false, isCoach: true, comments: [
        { id: 1006, author: "Matteo G.", avatar: "M", content: "Grande idea! Mercoledì ci sono", time: "1 ora fa", likes: 4, liked: false },
      ]},
    ],
  },
  {
    id: "napoli", city: "Napoli", region: "Campania",
    coach: { name: "Coach Sara", avatar: "S", role: "Coordinatrice Campania" },
    members: 41,
    posts: [
      { id: 105, author: "Coach Sara", avatar: "S", time: "6 ore fa", content: "Chi vuole partecipare al prossimo incontro sul lungomare? Vi aspetto! 🌊", likes: 25, liked: false, isCoach: true, comments: [
        { id: 1007, author: "Rosa T.", avatar: "R", content: "Bellissima idea! Io vengo sicuramente", time: "5 ore fa", likes: 3, liked: false },
      ]},
    ],
  },
  {
    id: "bologna", city: "Bologna", region: "Emilia-Romagna",
    coach: { name: "Coach Andrea", avatar: "A", role: "Coordinatore Emilia-Romagna" },
    members: 28,
    posts: [
      { id: 106, author: "Coach Andrea", avatar: "A", time: "1 giorno fa", content: "Grande energia al nostro primo incontro! Continuiamo così, siete una community fantastica 🔥", likes: 16, liked: false, isCoach: true, comments: [
        { id: 1008, author: "Stefano L.", avatar: "S", content: "Grazie Andrea, sei un grande motivatore!", time: "23 ore fa", likes: 6, liked: false },
      ]},
    ],
  },
];

const communities: Community[] = [
  {
    id: "territoriale", name: "La tua zona", description: "Incontra persone nella tua città con il tuo coach",
    icon: MapPin, members: zones.reduce((sum, z) => sum + z.members, 0), color: "bg-primary/10 text-primary",
    posts: [], zones,
  },
  {
    id: "familiari", name: "Familiari", description: "Per le famiglie e i cari di chi è in percorso",
    icon: HeartHandshake, members: 189, color: "bg-primary/10 text-primary",
    posts: [
      { id: 4, author: "Sara L.", avatar: "S", time: "1 giorno fa", content: "Mio fratello ha iniziato il percorso la settimana scorsa. Vedere i suoi progressi mi riempie di speranza. Grazie StandUp per il supporto alle famiglie. ❤️", likes: 31, liked: false, comments: [
        { id: 5001, author: "Laura B.", avatar: "L", content: "Che bella notizia Sara! Forza al tuo fratello 💪", time: "23 ore fa", likes: 6, liked: false },
      ]},
      { id: 108, author: "Giovanni M.", avatar: "G", time: "4 ore fa", content: "Stasera ho resistito alla tentazione. Ho chiamato il mio coach invece di cedere. Piccola vittoria ma enorme per me.", likes: 56, liked: false, comments: [
        { id: 5002, author: "Maria T.", avatar: "M", content: "Non è una piccola vittoria, è ENORME! Bravissimo 👏", time: "3 ore fa", likes: 9, liked: false },
      ]},
      { id: 109, author: "Elena R.", avatar: "E", time: "7 ore fa", content: "Ho appena finito il corso 'Gestire i Trigger'. Ragazzi, è davvero utile. Lo consiglio a tutti, soprattutto le tecniche di respirazione.", likes: 19, liked: false, comments: []},
      { id: 110, author: "Alessandro D.", avatar: "A", time: "12 ore fa", content: "Primo giorno qui. Sono nervoso ma anche determinato. Ce la posso fare?", likes: 73, liked: false, comments: [
        { id: 5003, author: "Sara L.", avatar: "S", content: "Assolutamente sì! Noi siamo qui con te ❤️", time: "11 ore fa", likes: 15, liked: false },
        { id: 5004, author: "Luca P.", avatar: "L", content: "Benvenuto Alessandro! Il primo passo è il più coraggioso", time: "10 ore fa", likes: 11, liked: false },
      ]},
    ],
  },
  {
    id: "academy", name: "Academy", description: "Riservata ai corsisti Academy",
    icon: GraduationCap, members: 127, color: "bg-primary/10 text-primary",
    locked: true, lockMessage: "Questa community è riservata ai corsisti Academy. Iscriviti a un corso per accedere.",
    posts: [],
  },
];

const annunci = [
  {
    id: 1,
    icon: Ticket,
    title: "TOGETHER Bologna",
    subtitle: "15-17 Maggio · Ultimi posti!",
    cta: "Prendi i biglietti",
    link: "/eventi/301",
    urgent: true,
  },
  {
    id: 2,
    icon: Sparkles,
    title: "Nuovo corso disponibile",
    subtitle: "Costruire una Nuova Identità",
    cta: "Scopri",
    link: "/corsi",
    urgent: false,
  },
  {
    id: 3,
    icon: MapPin,
    title: "Incontro Milano",
    subtitle: "Sabato 22 Mar · Parco Sempione",
    cta: "Dettagli",
    link: "/insede",
    urgent: false,
  },
  {
    id: 4,
    icon: Radio,
    title: "Webinar stasera ore 21",
    subtitle: "Gestire i trigger · Coach Elena",
    cta: "Partecipa",
    link: "/corsi",
    urgent: false,
  },
  {
    id: 5,
    icon: Bell,
    title: "Diario da compilare",
    subtitle: "Oggi non hai ancora scritto",
    cta: "Scrivi ora",
    link: "/diario",
    urgent: false,
  },
];

const CommunityPage = () => {
  usePageTracking("community");
  const [newPost, setNewPost] = useState("");
  const [allPosts, setAllPosts] = useState<(Post & { communityId: string; communityName: string; zoneId?: string })[]>(() =>
    communities.filter(c => !c.locked).flatMap(c => {
      if (c.zones) {
        return c.zones.flatMap(z => z.posts.map(p => ({ ...p, communityId: c.id, communityName: z.city, zoneId: z.id })));
      }
      return c.posts.map(p => ({ ...p, communityId: c.id, communityName: c.name, zoneId: undefined as string | undefined }));
    }).sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.id - a.id;
    })
  );
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
  const [newComments, setNewComments] = useState<Record<number, string>>({});
  const feedRef = useRef<HTMLDivElement>(null);

  const toggleLike = (id: number) => {
    const post = allPosts.find(p => p.id === id);
    if (post && !post.liked) trackEvent("post_liked", "community", { post_id: id });
    setAllPosts(prev => prev.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
  };

  const toggleCommentLike = (postId: number, commentId: number) => {
    setAllPosts(prev => prev.map(p => p.id === postId ? {
      ...p, comments: p.comments.map(c => c.id === commentId ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 } : c)
    } : p));
  };

  const publishPost = () => {
    if (!newPost.trim()) return;
    trackEvent("post_published", "community", { length: newPost.trim().length });
    const post: Post & { communityId: string; communityName: string; zoneId?: string } = {
      id: Date.now(), author: "Tu", avatar: "T", time: "Adesso", content: newPost.trim(),
      likes: 0, liked: false, comments: [], communityId: "community",
      communityName: "Community", zoneId: undefined,
    };
    setAllPosts(prev => [post, ...prev]);
    setNewPost("");
  };

  const addComment = (postId: number) => {
    const text = newComments[postId]?.trim();
    if (!text) return;
    const comment: Comment = { id: Date.now(), author: "Tu", avatar: "T", content: text, time: "Adesso", likes: 0, liked: false };
    setAllPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...p.comments, comment] } : p));
    setNewComments(prev => ({ ...prev, [postId]: "" }));
    setExpandedComments(prev => new Set(prev).add(postId));
  };

  return (
    <div className="min-h-screen bg-surface-0 pb-24">
      {/* Header */}
      <header className="bg-surface-1 border-b border-border/40 px-4 py-3 safe-area-top shadow-[var(--shadow-sm)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-foreground">StandUp</h1>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10">
              <Heart className="w-3 h-3 text-primary" />
              <span className="text-[10px] text-primary/70 font-medium">Community</span>
            </div>
          </div>
          <HeaderActions />
        </div>
      </header>

      {/* Sticky Announcements */}
      <div className="sticky top-0 z-30 bg-surface-1/95 backdrop-blur-xl border-b border-border/30 shadow-[var(--shadow-sm)]">
        <div className="flex gap-2.5 overflow-x-auto py-3 px-4 scrollbar-hide snap-x snap-mandatory">
          {annunci.map((a) => {
            const Icon = a.icon;
            return (
              <Link
                key={a.id}
                to={a.link}
                className="flex-shrink-0 snap-start group"
              >
                <div className={`flex items-center gap-2.5 rounded-xl px-3.5 py-3 border transition-all active:scale-[0.97] ${
                  a.urgent 
                    ? "bg-primary text-primary-foreground border-primary shadow-[0_4px_20px_hsl(var(--primary)/0.3)]" 
                    : "bg-surface-2 border-border/30 hover:border-border shadow-[var(--shadow-sm)]"
                }`}>
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    a.urgent ? "bg-primary-foreground/20" : "bg-primary/10 text-primary"
                  }`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-[125px]">
                    <h4 className={`text-[11px] font-bold leading-tight ${a.urgent ? "" : "text-foreground"}`}>{a.title}</h4>
                    <p className={`text-[10px] leading-snug mt-0.5 ${a.urgent ? "opacity-80" : "text-muted-foreground"}`}>{a.subtitle}</p>
                  </div>
                  <ArrowRight className={`w-3.5 h-3.5 flex-shrink-0 ${a.urgent ? "opacity-80" : "text-primary"}`} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="px-4 py-4 space-y-4 bg-surface-inset" ref={feedRef}>

        {/* Compose */}
        <div className="flex items-start gap-3 p-3 glass-card rounded-xl">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
            Tu
          </div>
          <div className="flex-1 space-y-2">
            <Textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Come stai oggi? Condividi con la community..."
              className="bg-transparent border-none p-0 min-h-[40px] resize-none text-sm focus-visible:ring-0 shadow-none"
            />
            <div className="flex items-center justify-between">
              <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                <Image className="w-4 h-4" />
              </button>
              <Button size="sm" disabled={!newPost.trim()} onClick={publishPost} className="h-7 text-xs px-3">
                <Send className="w-3 h-3 mr-1" />
                Pubblica
              </Button>
            </div>
          </div>
        </div>

        {/* Posts */}
        {allPosts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">Nessun post ancora. Sii il primo!</p>
          </div>
        )}

        {allPosts.map((post) => {
          const isExpanded = expandedComments.has(post.id);
          const firstComment = post.comments[0];
          const remainingComments = post.comments.slice(1);

          return (
            <div key={`${post.communityId}-${post.zoneId || ''}-${post.id}`} className={`glass-card rounded-xl overflow-hidden ${post.pinned ? "border-primary/20" : ""}`}>
              {post.pinned && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 border-b border-primary/10">
                  <Pin className="w-3 h-3 text-primary" />
                  <span className="text-[10px] font-semibold text-primary">Fissato in alto</span>
                </div>
              )}
              <div className="p-3 space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold ${
                    post.isCoach ? "bg-primary text-primary-foreground ring-2 ring-primary/30" : "bg-primary/20 text-primary"
                  }`}>
                    {post.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium text-foreground">{post.author}</p>
                      {post.isCoach && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">Coach</span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      <span className="text-primary/70 font-medium">{post.communityName} · </span>
                      {post.time}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed">{post.content}</p>
              </div>
              {post.image && <img src={post.image} alt="" className="w-full object-cover max-h-52" />}

              {/* Action bar */}
              <div className="flex items-center justify-between px-3 py-2 border-t border-border/20 bg-surface-inset/50">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-1.5 text-xs transition-colors ${
                    post.liked ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${post.liked ? "fill-primary" : ""}`} />
                  {post.likes}
                </button>
                <button
                  onClick={() => setExpandedComments(prev => {
                    const next = new Set(prev);
                    if (next.has(post.id)) next.delete(post.id); else next.add(post.id);
                    return next;
                  })}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <CommentIcon className="w-4 h-4" />
                  {post.comments.length}
                </button>
                <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* First comment */}
              {firstComment && (
                <div className="px-3 py-2 border-t border-border/15 bg-surface-2/60">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-semibold text-primary flex-shrink-0 mt-0.5">
                      {firstComment.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium text-foreground">{firstComment.author}</span>
                        <span className="text-[10px] text-muted-foreground">{firstComment.time}</span>
                      </div>
                      <p className="text-xs text-foreground/80 mt-0.5">{firstComment.content}</p>
                      <button
                        onClick={() => toggleCommentLike(post.id, firstComment.id)}
                        className={`flex items-center gap-1 text-[10px] mt-1 transition-colors ${
                          firstComment.liked ? "text-primary" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <ThumbsUp className={`w-3 h-3 ${firstComment.liked ? "fill-primary" : ""}`} />
                        {firstComment.likes}
                      </button>
                    </div>
                  </div>
                  {remainingComments.length > 0 && !isExpanded && (
                    <button
                      onClick={() => setExpandedComments(prev => new Set(prev).add(post.id))}
                      className="flex items-center gap-1 text-[11px] text-primary font-medium mt-2 ml-8"
                    >
                      <ChevronDown className="w-3 h-3" />
                      Vedi altri {remainingComments.length} commenti
                    </button>
                  )}
                </div>
              )}

              {/* Expanded comments */}
              {isExpanded && remainingComments.length > 0 && (
                <div className="px-3 py-1 bg-surface-2/60 space-y-2">
                  {remainingComments.map(comment => (
                    <div key={comment.id} className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-semibold text-primary flex-shrink-0 mt-0.5">
                        {comment.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-medium text-foreground">{comment.author}</span>
                          <span className="text-[10px] text-muted-foreground">{comment.time}</span>
                        </div>
                        <p className="text-xs text-foreground/80 mt-0.5">{comment.content}</p>
                        <button
                          onClick={() => toggleCommentLike(post.id, comment.id)}
                          className={`flex items-center gap-1 text-[10px] mt-1 transition-colors ${
                            comment.liked ? "text-primary" : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <ThumbsUp className={`w-3 h-3 ${comment.liked ? "fill-primary" : ""}`} />
                          {comment.likes}
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => setExpandedComments(prev => { const n = new Set(prev); n.delete(post.id); return n; })}
                    className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium ml-8 pb-1"
                  >
                    <ChevronUp className="w-3 h-3" />
                    Nascondi commenti
                  </button>
                </div>
              )}

              {/* Comment input */}
              {(isExpanded || post.comments.length === 0) && (
                <div className="px-3 py-2 border-t border-border/15 bg-surface-inset/50 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary flex-shrink-0">
                    T
                  </div>
                  <input
                    type="text"
                    value={newComments[post.id] || ""}
                    onChange={(e) => setNewComments(prev => ({ ...prev, [post.id]: e.target.value }))}
                    onKeyDown={(e) => e.key === "Enter" && addComment(post.id)}
                    placeholder="Scrivi un commento..."
                    className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none"
                  />
                  <button
                    onClick={() => addComment(post.id)}
                    disabled={!newComments[post.id]?.trim()}
                    className="text-primary disabled:text-muted-foreground/30"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
};

export default CommunityPage;
