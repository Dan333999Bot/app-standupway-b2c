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

interface BoardComment {
  id: number; author: string; avatar: string; time: string; content: string;
}

interface BoardPost {
  id: number; author: string; avatar: string; time: string; city?: string;
  board: BoardKey;
  content: string; media?: { type: "image" | "video"; url: string };
  likes: number; liked: boolean; comments: BoardComment[];
}

const SEED_POSTS: BoardPost[] = [
  { id: 1, author: "Coach Marco", avatar: "M", time: "1 ora fa", city: "Milano", board: "coach",
    content: "Ieri sera al Basement di Milano: 32 persone, energia incredibile. Grazie a tutti 💪",
    media: { type: "image", url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=70" },
    likes: 47, liked: false, comments: [] },
  { id: 2, author: "Anna M.", avatar: "A", time: "3 ore fa", city: "Roma", board: "utenti",
    content: "Oggi 60 giorni puliti. Non ci credo neanche io. Grazie a questa community ❤️",
    likes: 124, liked: false, comments: [] },
  { id: 4, author: "Giulia · familiare", avatar: "G", time: "ieri", city: "Verona", board: "familiari",
    content: "Mio figlio oggi ha fatto il primo colloquio. Ho pianto per due ore, ma di sollievo. Grazie a chi mi ha consigliato di iniziare anche io un percorso parallelo.",
    likes: 89, liked: false, comments: [] },
  { id: 5, author: "Luca P.", avatar: "L", time: "ieri", city: "Roma", board: "pubblica",
    content: "Cammino di gruppo a Villa Ada stamattina. Domenica prossima si replica, chi c'è?",
    media: { type: "image", url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=70" },
    likes: 38, liked: false, comments: [
      { id: 5001, author: "Marta V.", avatar: "M", time: "22 ore fa", content: "ci sono!! che ora vi trovate?" },
      { id: 5002, author: "Gio R.", avatar: "G", time: "21 ore fa", content: "anke io domenica. zona nord o sud del parco?" },
      { id: 5003, author: "Luca P.", avatar: "L", time: "20 ore fa", content: "ingresso principale alle 9 e mezza! fatemi sapere" },
      { id: 5004, author: "Toni S.", avatar: "T", time: "18 ore fa", content: "arrivo 👍" },
      { id: 5005, author: "Francesca P.", avatar: "F", time: "15 ore fa", content: "ci vengo anke io, è la prima volta che partecipo a una cosa del genere, un po nervosa ma vado" },
    ] },
  { id: 6, author: "Dott.ssa Rossi", avatar: "R", time: "2 giorni fa", board: "professionisti",
    content: "Pubblicato un nuovo articolo sulle ricadute nei primi 90 giorni. Lo trovate nei materiali del gruppo.",
    likes: 22, liked: false, comments: [] },
  { id: 7, author: "Marco · 1 anno pulito", avatar: "M", time: "2 giorni fa", city: "Milano", board: "utenti",
    content: "Un anno fa oggi era tutto buio. Oggi sono qui, con voi. Se ce l'ho fatta io, ce la potete fare anche voi.",
    likes: 312, liked: false, comments: [] },
  { id: 8, author: "Sara · mamma", avatar: "S", time: "3 giorni fa", city: "Bologna", board: "familiari",
    content: "Domanda alla community: come gestite il momento in cui torna a casa dopo il percorso? Consigli pratici?",
    likes: 14, liked: false, comments: [] },

  { id: 200, author: "Marco T.", avatar: "M", time: "2 ore fa", city: "Milano", board: "pubblica",
    content: "3 mesi fa pensavo di non farcela. oggi mi sono alzato, ho fatto colazione, sono andato a lavoro e non ci ho nemmeno pensato. roba che sembra banale ma per me è tipo vincere le olimpiadi 😅",
    likes: 89, liked: false, comments: [
      { id: 6001, author: "Fede N.", avatar: "F", time: "1 ora fa", content: "fratm questo non è banale per niente. questo è TUTTO. bravissimo" },
      { id: 6002, author: "Davide C.", avatar: "D", time: "50 min fa", content: "capisco alla follia quello ke dici. ci sono passato pure io. vai avanti così!!" },
      { id: 6003, author: "Rosa P.", avatar: "R", time: "30 min fa", content: "leggere questo mi da forza anke a me ke sono all'inizio. grazie" },
    ] },
  { id: 201, author: "Valentina S.", avatar: "V", time: "3 ore fa", city: "Torino", board: "pubblica",
    content: "ho paura. paura che quando starò davvero male tornerò a farlo. non so se ce la faccio a lungo andare. qualcuno l'ha sentita questa cosa?",
    likes: 61, liked: false, comments: [] },
  { id: 202, author: "Riccardo B.", avatar: "R", time: "4 ore fa", board: "pubblica",
    content: "onestamente? quando ho sentito parlare di standup way la prima volta ho pensato fosse l'ennesima cosa di marketing. coach, percorsi, app... boh. poi ci ho provato perché ero a pezzi e non avevo alternative. e adesso sono qui a scrivere questo. vabbè 🤷",
    likes: 112, liked: false, comments: [
      { id: 6004, author: "Simone A.", avatar: "S", time: "3 ore fa", content: "uguale uguale fratello. ero convinto fosse roba per ricchi. poi ho detto vabbè proviamo. ed ecco qua 😂" },
      { id: 6005, author: "Carmen L.", avatar: "C", time: "2 ore fa", content: "io ero ancora piu scettica di te e guarda, 5 mesi dopo scrivo anke io. benvenuto nel club degli ex scettici ahah" },
    ] },
  { id: 203, author: "Gianluca F.", avatar: "G", time: "5 ore fa", city: "Roma", board: "pubblica",
    content: "ho detto a mia madre che sto facendo un percorso. non l'avevo mai detto a nessuno prima. tremavo mentre glielo dicevo. lei ha pianto. io ho pianto. ma è andata.",
    likes: 94, liked: false, comments: [] },
  { id: 204, author: "Alessia M.", avatar: "A", time: "6 ore fa", city: "Napoli", board: "pubblica",
    content: "voglio farcela. lo so che sembra scontato dirlo qui ma è l'unica cosa che sento vera in questo momento. voglio farcela e basta. non so come, non so quando, ma voglio farcela.",
    likes: 78, liked: false, comments: [
      { id: 6006, author: "Marco T.", avatar: "M", time: "5 ore fa", content: "quella voglia è tutto. tienitela stretta, il come arriva dopo fidati" },
      { id: 6007, author: "Nadia B.", avatar: "N", time: "4 ore fa", content: "sono stata dove sei tu. il come arriva pian piano. dai 💙" },
      { id: 6008, author: "Emilio R.", avatar: "E", time: "3 ore fa", content: "io stavo uguale 8 mesi fa. adesso sono diverso. ce la fai sicuro, non mollare" },
    ] },
  { id: 205, author: "Francesca P.", avatar: "F", time: "7 ore fa", board: "pubblica",
    content: "la cosa più strana di questa community è che mi sento meno sola anche quando non scrivo niente. so che voi ci siete e già questo mi aiuta a passare le serate difficili.",
    likes: 67, liked: false, comments: [] },
  { id: 206, author: "Tommaso V.", avatar: "T", time: "8 ore fa", city: "Firenze", board: "pubblica",
    content: "grazie per i tools. sul serio. il diario delle emozioni l'ho usato stanotte alle 3 quando stavo per cedere. l'ho aperto, ho scritto, e il momento critico è passato. una cosa piccola ma che ha fatto la differenza.",
    likes: 103, liked: false, comments: [
      { id: 6009, author: "Giuliana F.", avatar: "G", time: "7 ore fa", content: "anche io uso il diario di notte!! è il momento peggio ma avere qualcosa da fare cambia tutto. contento ke sia passata 🙏" },
      { id: 6010, author: "Luca D.", avatar: "L", time: "6 ore fa", content: "non sapevo si potesse usare così. provo stasera. grazie per la dritta seriamente" },
    ] },
  { id: 207, author: "Beatrice C.", avatar: "B", time: "9 ore fa", city: "Genova", board: "pubblica",
    content: "giorno 14. so che per qualcuno qui sono bruscolini ma per me è tipo un mese. ogni giorno è una battaglia ma ogni sera sono ancora qua.",
    likes: 82, liked: false, comments: [] },
  { id: 208, author: "Stefano M.", avatar: "S", time: "10 ore fa", board: "pubblica",
    content: "la mia paura più grande? che le persone che amo scoprano quanto sono stato in basso. ho vergogna. una vergogna enorme. qualcuno l'ha superata questa cosa?",
    likes: 74, liked: false, comments: [
      { id: 6011, author: "Alessia M.", avatar: "A", time: "9 ore fa", content: "ci ho messo quasi un anno a dirlo a qualcuno. ma quando l'ho fatto mi sono sentita leggera per la prima volta. la vergogna non sparisce subito ma si alleggersice, giuro" },
      { id: 6012, author: "Roberto L.", avatar: "R", time: "8 ore fa", content: "la vergogna l'hanno inventata per farti stare fermo. tu stai chiedendo aiuto, questo vale tutto fratello" },
      { id: 6013, author: "Claudia N.", avatar: "C", time: "7 ore fa", content: "anke io avevo sta paura. poi ho capito ke chi mi vuoleva bene era gia li ad aspettarmi" },
    ] },
  { id: 209, author: "Lorenzo G.", avatar: "L", time: "11 ore fa", city: "Palermo", board: "pubblica",
    content: "diciamoci la verità: certi giorni non ci credo. penso che tanto tornerò dove ero. poi mi sveglio il giorno dopo e provo di nuovo. ma il dubbio c'è sempre, inutile fare i finti ottimisti.",
    likes: 91, liked: false, comments: [] },
  { id: 210, author: "Michela R.", avatar: "M", time: "12 ore fa", city: "Milano", board: "pubblica",
    content: "oggi ho rifiutato un invito. sapevo che lì avrei ceduto. l'ho detto no e sono rimasta a casa da sola. mi sentivo stupida e sola ma sapevo che era la cosa giusta. eccolo il coraggio, no?",
    likes: 88, liked: false, comments: [
      { id: 6014, author: "Francesca P.", avatar: "F", time: "11 ore fa", content: "si esatto quello è il coragio vero. non quello dei film. quello di dire no quando costa" },
      { id: 6015, author: "Gianluca F.", avatar: "G", time: "10 ore fa", content: "ci vuole piu coraggio a restare a casa ke ad andare, credimi sul serio 👏" },
    ] },
  { id: 211, author: "Andrea Z.", avatar: "A", time: "13 ore fa", city: "Verona", board: "pubblica",
    content: "voglio riprendere a suonare la chitarra. la lasciavo stare da anni perché non riuscivo a concentrarmi. ieri ho preso uno spartito in mano per la prima volta. non so suonare ancora bene ma oddio che bella sensazione.",
    likes: 66, liked: false, comments: [] },
  { id: 212, author: "Paola D.", avatar: "P", time: "14 ore fa", board: "pubblica",
    content: "questa community è l'unico posto dove posso scrivere quello che sento senza essere giudicata. a casa non riescono ancora a capire bene. qui almeno so che qualcuno sa di cosa parlo.",
    likes: 79, liked: false, comments: [] },
  { id: 213, author: "Emanuele T.", avatar: "E", time: "15 ore fa", city: "Roma", board: "pubblica",
    content: "il coach mi ha insegnato una tecnica di respirazione che uso ogni volta che arriva il craving. suona stupido ma funziona. sono al giorno 47 e quel metodo mi ha salvato almeno 10 volte.",
    likes: 95, liked: false, comments: [
      { id: 6016, author: "Valentina S.", avatar: "V", time: "14 ore fa", content: "qual è la tecnica?? puoi condividerla sto cercando qualcosa da usare di sera" },
      { id: 6017, author: "Emanuele T.", avatar: "E", time: "13 ore fa", content: "inspiro 4 sec, trattengo 4, espiro 8. lento. e mi ancoro a un oggetto che tengo in mano. ogni volta funziona sul serio" },
      { id: 6018, author: "Stefano M.", avatar: "S", time: "12 ore fa", content: "provo subito stasera grazie mille era proprio quello ke cercavo" },
    ] },
  { id: 214, author: "Chiara B.", avatar: "C", time: "16 ore fa", city: "Torino", board: "pubblica",
    content: "100 giorni. cento. non avrei scommesso 5 centesimi su di me 4 mesi fa. e invece eccomi qua.",
    likes: 134, liked: false, comments: [] },
  { id: 215, author: "Dario N.", avatar: "D", time: "17 ore fa", board: "pubblica",
    content: "ho paura di ricadere durante le feste. natale, capodanno... sono sempre stati i momenti peggiori. come fate voi?",
    likes: 57, liked: false, comments: [
      { id: 6019, author: "Paola D.", avatar: "P", time: "16 ore fa", content: "io preparo un piano prima. so gia chi chiamo, cosa faccio se sento il bisogno. avere un piano aiuta tantissimo" },
      { id: 6020, author: "Lorenzo G.", avatar: "L", time: "15 ore fa", content: "anche io ce sta paura. ma quest'anno almeno non sono solo. gia questo cambia tutto" },
      { id: 6021, author: "Miriam D.", avatar: "M", time: "14 ore fa", content: "anke io le feste le temo. scriviamo qua se viene voglia, così ci aiutiamo" },
    ] },
  { id: 216, author: "Ilaria V.", avatar: "I", time: "18 ore fa", city: "Bologna", board: "pubblica",
    content: "sono qui da 2 settimane e ancora non sono sicura che funzionerà. mi dicono che devo avere fiducia nel processo ma è dura quando non vedi ancora niente di concreto. lo so che ci vuole tempo ma voglio risultati adesso.",
    likes: 48, liked: false, comments: [] },
  { id: 217, author: "Nicola P.", avatar: "N", time: "19 ore fa", city: "Milano", board: "pubblica",
    content: "ieri ho avuto un momento difficilissimo. invece di cedere ho tirato fuori il telefono e ho scritto in questa chat. nessuno ha risposto subito ma il fatto stesso di scriverlo mi ha dato il tempo di passare il momento. potere delle parole.",
    likes: 76, liked: false, comments: [
      { id: 6022, author: "Michela R.", avatar: "M", time: "18 ore fa", content: "lo faccio anke io. scrivere aiuta anche se nessuno risponde. è come buttare fuori il pensiero invece di tenerlo dentro" },
      { id: 6023, author: "Andrea Z.", avatar: "A", time: "17 ore fa", content: "hai fatto bene. e qui rispondiamo sempre, magari con un po di ritardo ma ci siamo 💙" },
    ] },
  { id: 218, author: "Simona L.", avatar: "S", time: "20 ore fa", city: "Napoli", board: "pubblica",
    content: "mi sono iscritta a un corso di yoga. lo so che non c'entra niente con la dipendenza ma il coach mi ha detto che muovere il corpo aiuta. boh, vedremo. ma intanto sono uscita di casa e questo per me è già qualcosa.",
    likes: 55, liked: false, comments: [] },
  { id: 219, author: "Federico R.", avatar: "F", time: "21 ore fa", board: "pubblica",
    content: "questa è la prima community dove non mi sento fuori posto. di solito sui social mi sento sempre a disagio. qui si parla di cose vere, senza filtri. è strano ma è casa.",
    likes: 88, liked: false, comments: [
      { id: 6024, author: "Chiara B.", avatar: "C", time: "20 ore fa", content: "hai detto esattamente quello ke sento io. casa. è proprio cosi" },
      { id: 6025, author: "Ilaria V.", avatar: "I", time: "19 ore fa", content: "sono 2 settimane ke sono qui e sento la stessa cosa. strano ma vero" },
      { id: 6026, author: "Beatrice C.", avatar: "B", time: "18 ore fa", content: "ci sei arrivato. e noi ci siamo. benvenuto davvero 🙏" },
    ] },
  { id: 220, author: "Matteo G.", avatar: "M", time: "22 ore fa", city: "Roma", board: "pubblica",
    content: "l'app mi ha aiutato tantissimo avere tutto in un posto. il percorso, la chat col coach, il diario. prima avevo mille cose sparse e mi perdevo. adesso ho un filo.",
    likes: 62, liked: false, comments: [] },
  { id: 221, author: "Serena C.", avatar: "S", time: "23 ore fa", city: "Firenze", board: "pubblica",
    content: "stamattina mi sono guardata allo specchio e per la prima volta da anni non ho visto solo i casini che ho combinato. ho visto una persona che sta cercando di cambiare. piccolo ma enorme per me.",
    likes: 118, liked: false, comments: [
      { id: 6027, author: "Emanuele T.", avatar: "E", time: "22 ore fa", content: "questo è il momento chiave del percorso, quando smetti di vederti solo con gli occhi del passato. vai avanti!! 🔥" },
      { id: 6028, author: "Dario N.", avatar: "D", time: "21 ore fa", content: "mi hai fatto venire i brividi. grazie per aver scritto questa cosa, seriamente" },
      { id: 6029, author: "Nicola P.", avatar: "N", time: "20 ore fa", content: "quella persona nello specchio è reale. piu reale di tutto il resto" },
    ] },
  { id: 222, author: "Luca B.", avatar: "L", time: "1 giorno fa", board: "pubblica",
    content: "ho paura di non essere abbastanza forte. ogni volta che sto bene penso che durerà poco. come se non meritassi di stare bene per troppo tempo.",
    likes: 69, liked: false, comments: [] },
  { id: 223, author: "Giulia T.", avatar: "G", time: "1 giorno fa", city: "Bari", board: "pubblica",
    content: "sinceramente? certi contenuti del percorso li trovo ripetitivi. le tecniche le ho sentite mille volte. la cosa che funziona davvero è il coach e questa community. il resto boh.",
    likes: 43, liked: false, comments: [] },
  { id: 224, author: "Roberto F.", avatar: "R", time: "1 giorno fa", city: "Milano", board: "pubblica",
    content: "oggi sono andato dal medico. da solo. senza che nessuno mi obbligasse. e gli ho detto la verità sulla mia situazione. tutta. non avevo mai fatto questa cosa. tremavo ma l'ho fatto.",
    likes: 97, liked: false, comments: [
      { id: 6030, author: "Serena C.", avatar: "S", time: "23 ore fa", content: "roberto questo è ENORME. ci vuole un coraggio ke pochi hanno. applausi seri 👏👏" },
      { id: 6031, author: "Simona L.", avatar: "S", time: "22 ore fa", content: "il primo ke riesce a dirlo al medico fa la cosa piu difficile. da li in poi è tutto piu facile, anche se adesso sembra impossibile" },
    ] },
  { id: 225, author: "Cristina M.", avatar: "C", time: "1 giorno fa", board: "pubblica",
    content: "voglio tornare a essere la persona che ero prima. o forse voglio diventare una versione migliore. non lo so ancora bene. ma so che non voglio restare quello che sono adesso.",
    likes: 71, liked: false, comments: [] },
  { id: 226, author: "Enrico S.", avatar: "E", time: "1 giorno fa", city: "Venezia", board: "pubblica",
    content: "ieri ho visto che uno che era qui da tanto ha raggiunto i 6 mesi. non lo conosco di persona ma mi ha fatto venire voglia di andare avanti. strano come le storie degli altri ti diano forza.",
    likes: 84, liked: false, comments: [
      { id: 6032, author: "Federico R.", avatar: "F", time: "23 ore fa", content: "è esatto. le storie qui mi motivano piu di qualsiasi roba motivazionale su internet" },
      { id: 6033, author: "Luca B.", avatar: "L", time: "22 ore fa", content: "anch io guardo i traguardi degli altri e mi dico: vabbè se ce l'ha fatta lui... ci provo pure io" },
      { id: 6034, author: "Giulia T.", avatar: "G", time: "21 ore fa", content: "per questo vale condividere anke le piccole cose. non sai mai chi stai aiutando" },
    ] },
  { id: 227, author: "Miriam D.", avatar: "M", time: "1 giorno fa", city: "Roma", board: "pubblica",
    content: "il supporto del coach nel momento di crisi alle 11 di sera ha fatto la differenza. non me lo aspettavo che ci fosse davvero qualcuno. invece c'era. grazie.",
    likes: 76, liked: false, comments: [] },
  { id: 228, author: "Salvatore B.", avatar: "S", time: "2 giorni fa", city: "Palermo", board: "pubblica",
    content: "61 giorni. quando ero a zero pensavo che 60 fosse un numero impossibile. adesso sono qui e mi sembra ancora un sogno. ma è reale. sono reale.",
    likes: 107, liked: false, comments: [] },
  { id: 229, author: "Annalisa R.", avatar: "A", time: "2 giorni fa", city: "Torino", board: "pubblica",
    content: "domani ho una cena con persone che non vedevo da anni. persone di quando stavo male. ho paura di come mi vedranno, di cosa penseranno. ho paura di chi ero.",
    likes: 58, liked: false, comments: [
      { id: 6035, author: "Roberto F.", avatar: "R", time: "1 giorno fa", content: "ti capisco alla follia. ma quelle persone vedranno una ke ha fatto una cosa difficilissima. anche se non lo sanno, tu lo sai." },
      { id: 6036, author: "Cristina M.", avatar: "C", time: "1 giorno fa", content: "vai e poi ci racconti. siamo qui 💙" },
      { id: 6037, author: "Enrico S.", avatar: "E", time: "1 giorno fa", content: "la versione di te di adesso è gia diversa da chi eri. chi ti vuole bene lo vedrà" },
    ] },
  { id: 230, author: "Piero V.", avatar: "P", time: "2 giorni fa", board: "pubblica",
    content: "ho fatto tutti e 3 i questionari di valutazione e onestamente mi sembrano un po' generici. la parte umana con il coach è molto più utile. ma forse sono io che mi aspetto troppo.",
    likes: 36, liked: false, comments: [] },
  { id: 231, author: "Rosaria T.", avatar: "R", time: "2 giorni fa", city: "Catania", board: "pubblica",
    content: "oggi ho detto no alla mia dipendenza e sì a una passeggiata. sembra poco ma per me è stato scegliere. scegliere me stessa.",
    likes: 83, liked: false, comments: [] },
  { id: 232, author: "Davide M.", avatar: "D", time: "2 giorni fa", city: "Milano", board: "pubblica",
    content: "sono a pezzi oggi ma non ho ceduto. è una di quelle giornate dove vorresti arrenderti ma non lo fai. non so da dove mi viene la forza ma c'è. ancora.",
    likes: 93, liked: false, comments: [
      { id: 6038, author: "Miriam D.", avatar: "M", time: "2 giorni fa", content: "queste giornate sono le piu difficili e le piu importanti. le stai attraversando. bravo 🔥" },
      { id: 6039, author: "Salvatore B.", avatar: "S", time: "2 giorni fa", content: "la forza viene dal fatto ke hai scelto di esserci. anche oggi. anche a pezzi." },
      { id: 6040, author: "Annalisa R.", avatar: "A", time: "2 giorni fa", content: "domani ti svegli e sai ke ieri hai vinto. tienitelo stretto" },
    ] },
  { id: 233, author: "Teresa G.", avatar: "T", time: "2 giorni fa", board: "pubblica",
    content: "a volte basta sapere che ci sono altre persone che capiscono. non serve nemmeno che parlino. solo sapere. questa community mi dà questo e non è poco.",
    likes: 65, liked: false, comments: [] },
  { id: 234, author: "Carmine L.", avatar: "C", time: "3 giorni fa", city: "Napoli", board: "pubblica",
    content: "il percorso mi ha ridato una struttura alla giornata. prima vivevo in un caos totale. adesso ho degli orari, delle routine. sembra roba da niente ma per me ha cambiato tutto.",
    likes: 72, liked: false, comments: [] },
  { id: 235, author: "Giuseppina M.", avatar: "G", time: "3 giorni fa", city: "Reggio Calabria", board: "pubblica",
    content: "giorno 1. lo scrivo qua perché se lo dico ad alta voce forse diventa più reale. giorno 1. eccomi.",
    likes: 121, liked: false, comments: [] },
  { id: 236, author: "Rocco F.", avatar: "R", time: "3 giorni fa", city: "Bari", board: "pubblica",
    content: "ogni sera prima di dormire arriva quella voce che dice 'tanto ricadi'. ho paura che un giorno quella voce abbia ragione. come la fate tacere voi?",
    likes: 68, liked: false, comments: [
      { id: 6041, author: "Davide M.", avatar: "D", time: "3 giorni fa", content: "quella voce non smette subito ma diventa piu silenziosa col tempo. resisti, ci vuole un po ma succede" },
      { id: 6042, author: "Teresa G.", avatar: "T", time: "3 giorni fa", content: "io rispondo a quella voce con i fatti: oggi non l'ho fatto. un giorno alla volta. la voce parla di futuro, tu rispondile con oggi" },
      { id: 6043, author: "Carmine L.", avatar: "C", time: "3 giorni fa", content: "la voce mente. lo so ke è difficile crederci ma mente. tu sei qui e questo vale tutto" },
    ] },
  { id: 237, author: "Monica C.", avatar: "M", time: "3 giorni fa", board: "pubblica",
    content: "non capisco perché certi giorni è tutto ok e poi senza motivo arriva il buio. non c'è stato niente di particolare. il craving arriva quando vuole lui e non capisco come fermarlo.",
    likes: 52, liked: false, comments: [] },
  { id: 238, author: "Pasquale D.", avatar: "P", time: "4 giorni fa", city: "Napoli", board: "pubblica",
    content: "ho smesso di nascondermi. non ho ancora detto tutto a tutti ma non mi vergogno più di fare questo percorso. anzi, quasi quasi sono fiero.",
    likes: 86, liked: false, comments: [] },
  { id: 239, author: "Nunzia T.", avatar: "N", time: "4 giorni fa", city: "Roma", board: "pubblica",
    content: "voglio vedere mio figlio crescere con una madre presente. questa è la mia motivazione. quando voglio cedere penso a lui. funziona ogni volta.",
    likes: 143, liked: false, comments: [] },
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
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const toggleComments = (id: number) => {
    setExpandedComments(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

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
                      <button onClick={() => p.comments.length > 0 && toggleComments(p.id)} className={cn("flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs transition-colors",
                        expandedComments.has(p.id) ? "text-primary bg-primary/5" : "text-muted-foreground hover:bg-secondary/50",
                        p.comments.length === 0 && "opacity-40 cursor-default")}>
                        <MessageCircle className="w-4 h-4" /> {p.comments.length}
                      </button>
                    </div>
                    {expandedComments.has(p.id) && p.comments.length > 0 && (
                      <div className="border-t border-border/20 px-3 py-2 space-y-3 bg-surface-0/50">
                        {p.comments.map(c => (
                          <div key={c.id} className="flex gap-2">
                            <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px] font-semibold flex-shrink-0">{c.avatar}</div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-semibold text-foreground">{c.author} <span className="font-normal text-muted-foreground">{c.time}</span></p>
                              <p className="text-xs text-foreground/85 leading-relaxed mt-0.5">{c.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
