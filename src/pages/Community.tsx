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

      { id: 200, author: "Marco T.", avatar: "M", time: "2 ore fa", content: "3 mesi fa pensavo di non farcela. oggi mi sono alzato, ho fatto colazione, sono andato a lavoro e non ci ho nemmeno pensato. roba che sembra banale ma per me è tipo vincere le olimpiadi 😅", likes: 89, liked: false, comments: [
        { id: 6000, author: "Federica N.", avatar: "F", content: "fratm questo non è banale per niente. questo è tutto. bravissimo 🙌", time: "1 ora fa", likes: 14, liked: false },
        { id: 6001, author: "Davide C.", avatar: "D", content: "capisco alla follia quello che dici. ci sono passato pure io. vai avanti così!", time: "50 min fa", likes: 9, liked: false },
        { id: 6002, author: "Rosa P.", avatar: "R", content: "leggere questo mi dà forza anche a me che sono all'inizio. grazie per aver condiviso 💪", time: "30 min fa", likes: 7, liked: false },
      ]},

      { id: 201, author: "Valentina S.", avatar: "V", time: "3 ore fa", content: "ho paura. paura che quando staró davvero male tornerò a farlo. non so se ce la faccio a lungo andare. qualcuno l'ha sentita questa cosa?", likes: 61, liked: false, comments: [] },

      { id: 202, author: "Riccardo B.", avatar: "R", time: "4 ore fa", content: "onestamente? quando ho sentito parlare di standup way la prima volta ho pensato fosse l'ennesima cosa di marketing. coach, percorsi, app... boh. poi ci ho provato perché ero a pezzi e non avevo alternative. e adesso sono qui a scrivere questo. vabbè 🤷", likes: 112, liked: false, comments: [
        { id: 6003, author: "Simone A.", avatar: "S", content: "uguale uguale la mia storia. zero credibilità all'inizio poi mi ha cambiato la vita. benvenuto nel club degli scettici convertiti ahah", time: "3 ore fa", likes: 21, liked: false },
        { id: 6004, author: "Carmen L.", avatar: "C", content: "io ero ancora più cinica di te e guarda qua, 5 mesi dopo scrivo anche io in questa community 😂", time: "2 ore fa", likes: 16, liked: false },
      ]},

      { id: 203, author: "Gianluca F.", avatar: "G", time: "5 ore fa", content: "ho detto a mia madre che sto facendo un percorso. non l'avevo mai detto a nessuno prima. tremavo mentre glielo dicevo. lei ha pianto. io ho pianto. ma è andata.", likes: 94, liked: false, comments: [] },

      { id: 204, author: "Alessia M.", avatar: "A", time: "6 ore fa", content: "voglio farcela. lo so che sembra scontato dirlo qui ma è l'unica cosa che sento vera in questo momento. voglio farcela e basta. non so come, non so quando, ma voglio farcela.", likes: 78, liked: false, comments: [
        { id: 6005, author: "Marco T.", avatar: "M", content: "questa frase l'ho pensata anche io. e poi pian piano il come arriva. tienila stretta quella voglia.", time: "5 ore fa", likes: 18, liked: false },
        { id: 6006, author: "Nadia B.", avatar: "N", content: "questo è il punto di partenza giusto. il resto viene dopo. sei già avanti 💙", time: "4 ore fa", likes: 12, liked: false },
        { id: 6007, author: "Emilio R.", avatar: "E", content: "io stavo uguale 8 mesi fa. adesso sono diverso. ce la farai, fidati.", time: "3 ore fa", likes: 10, liked: false },
      ]},

      { id: 205, author: "Francesca P.", avatar: "F", time: "7 ore fa", content: "la cosa più strana di questa community è che mi sento meno sola anche quando non scrivo niente. so che voi ci siete e già questo mi aiuta a passare le serate difficili.", likes: 67, liked: false, comments: [] },

      { id: 206, author: "Tommaso V.", avatar: "T", time: "8 ore fa", content: "grazie per i tools. sul serio. il diario delle emozioni l'ho usato stanotte alle 3 quando stavo per cedere. l'ho aperto, ho scritto, e il momento critico è passato. una cosa piccola ma che ha fatto la differenza.", likes: 103, liked: false, comments: [
        { id: 6008, author: "Giuliana F.", avatar: "G", content: "anche io il diario! di notte è il momento peggiore e avere qualcosa da fare salva. contento che sia passata 🙏", time: "7 ore fa", likes: 15, liked: false },
        { id: 6009, author: "Luca D.", avatar: "L", content: "non sapevo si potesse usare così. provo anche io stasera. grazie per la dritta", time: "6 ore fa", likes: 8, liked: false },
      ]},

      { id: 207, author: "Beatrice C.", avatar: "B", time: "9 ore fa", content: "giorno 14. so che per qualcuno qui sono bruscolini ma per me è tipo un mese. ogni giorno è una battaglia ma ogni sera sono ancora qua.", likes: 82, liked: false, comments: [] },

      { id: 208, author: "Stefano M.", avatar: "S", time: "10 ore fa", content: "la mia paura più grande? che le persone che amo scoprano quanto sono stato in basso. ho vergogna. una vergogna enorme. qualcuno l'ha superata questa cosa?", likes: 74, liked: false, comments: [
        { id: 6010, author: "Alessia M.", avatar: "A", content: "io ci ho messo quasi un anno per dirlo in faccia a qualcuno. ma quando l'ho fatto mi sono sentita leggera per la prima volta. la vergogna non sparisce subito ma si alleggerisce.", time: "9 ore fa", likes: 19, liked: false },
        { id: 6011, author: "Roberto L.", avatar: "R", content: "fratello la vergogna l'hanno inventata per farti stare fermo. tu stai chiedendo aiuto, questo è già tutto", time: "8 ore fa", likes: 23, liked: false },
        { id: 6012, author: "Claudia N.", avatar: "C", content: "anche io avevo questa paura. poi ho capito che chi mi vuole bene davvero era già lì ad aspettarmi", time: "7 ore fa", likes: 14, liked: false },
      ]},

      { id: 209, author: "Lorenzo G.", avatar: "L", time: "11 ore fa", content: "diciamoci la verità: certi giorni non ci credo. penso che tanto tornerò dove ero. poi mi sveglio il giorno dopo e provo di nuovo. ma il dubbio c'è sempre, inutile fare i finti ottimisti.", likes: 91, liked: false, comments: [] },

      { id: 210, author: "Michela R.", avatar: "M", time: "12 ore fa", content: "oggi ho rifiutato un invito. sapevo che lì avrei ceduto. l'ho detto no e sono rimasta a casa da sola. mi sentivo stupida e sola ma sapevo che era la cosa giusta. eccolo il coraggio, no?", likes: 88, liked: false, comments: [
        { id: 6013, author: "Francesca P.", avatar: "F", content: "sì esatto quello è il coraggio vero. non quello dei film, quello di dire no quando costa", time: "11 ore fa", likes: 20, liked: false },
        { id: 6014, author: "Gianluca F.", avatar: "G", content: "ci vuole un sacco di forza a fare quello che hai fatto. ci vuole più coraggio a restare a casa che ad andare, credimi 👏", time: "10 ore fa", likes: 17, liked: false },
      ]},

      { id: 211, author: "Andrea Z.", avatar: "A", time: "13 ore fa", content: "voglio riprendere a suonare la chitarra. la lasciavo stare da anni perché non riuscivo a concentrarmi. ieri ho preso uno spartito in mano per la prima volta. non so suonare ancora bene ma oddio che bella sensazione.", likes: 66, liked: false, comments: [] },

      { id: 212, author: "Paola D.", avatar: "P", time: "14 ore fa", content: "questa community è l'unico posto dove posso scrivere quello che sento senza essere giudicata. a casa non riescono ancora a capire bene. qui almeno so che qualcuno sa di cosa parlo.", likes: 79, liked: false, comments: [] },

      { id: 213, author: "Emanuele T.", avatar: "E", time: "15 ore fa", content: "il coach mi ha insegnato una tecnica di respirazione che uso ogni volta che arriva il craving. suona stupido ma funziona. sono al giorno 47 e quel metodo mi ha salvato almeno 10 volte.", likes: 95, liked: false, comments: [
        { id: 6015, author: "Valentina S.", avatar: "V", content: "qual è la tecnica? puoi condividerla? sto cercando qualcosa da usare la sera", time: "14 ore fa", likes: 11, liked: false },
        { id: 6016, author: "Emanuele T.", avatar: "E", content: "respiro 4 secondi, trattengo 4, espiro 8. lento, concentrato. nel frattempo mi ancoro a una cosa concreta tipo un oggetto che tengo in mano. funziona davvero", time: "13 ore fa", likes: 24, liked: false },
        { id: 6017, author: "Stefano M.", avatar: "S", content: "provo subito stasera. grazie era proprio quello che cercavo", time: "12 ore fa", likes: 9, liked: false },
      ]},

      { id: 214, author: "Chiara B.", avatar: "C", time: "16 ore fa", content: "100 giorni. cento. non avrei scommesso 5 centesimi su di me 4 mesi fa. e invece eccomi qua.", likes: 134, liked: false, comments: [] },

      { id: 215, author: "Dario N.", avatar: "D", time: "17 ore fa", content: "ho paura di ricadere durante le feste. natale, capodanno... sono sempre stati i momenti peggiori. come fate voi?", likes: 57, liked: false, comments: [
        { id: 6018, author: "Paola D.", avatar: "P", content: "io preparo un piano prima. so già chi chiamo, cosa faccio se sento il bisogno, ho il numero del coach salvato. avere un piano mi aiuta a non sentirmi impreparata", time: "16 ore fa", likes: 16, liked: false },
        { id: 6019, author: "Lorenzo G.", avatar: "L", content: "anche io ci ho paura. ma quest'anno almeno non sono solo. già questo cambia tutto", time: "15 ore fa", likes: 13, liked: false },
        { id: 6020, author: "Coach Martina", avatar: "C", content: "pianificare è fondamentale. scrivetemi in privato se volete costruire insieme un piano per le feste 🙏", time: "14 ore fa", likes: 22, liked: false, isCoach: true } as Comment,
      ]},

      { id: 216, author: "Ilaria V.", avatar: "I", time: "18 ore fa", content: "sono qui da 2 settimane e ancora non sono sicura che funzionerà. mi dicono che devo avere fiducia nel processo ma è dura quando non vedi ancora niente di concreto. lo so che ci vuole tempo ma voglio risultati adesso.", likes: 48, liked: false, comments: [] },

      { id: 217, author: "Nicola P.", avatar: "N", time: "19 ore fa", content: "ieri ho avuto un momento difficilissimo. invece di cedere ho tirato fuori il telefono e ho scritto in questa chat. nessuno ha risposto subito ma il fatto stesso di scriverlo mi ha dato il tempo di passare il momento. potere delle parole.", likes: 76, liked: false, comments: [
        { id: 6021, author: "Michela R.", avatar: "M", content: "lo faccio anche io. scrivere aiuta anche quando nessuno risponde. è come mettere fuori il pensiero invece di tenerlo dentro", time: "18 ore fa", likes: 18, liked: false },
        { id: 6022, author: "Andrea Z.", avatar: "A", content: "hai fatto la cosa giusta. e comunque qui rispondiamo sempre, magari con un po' di ritardo ma ci siamo 💙", time: "17 ore fa", likes: 14, liked: false },
      ]},

      { id: 218, author: "Simona L.", avatar: "S", time: "20 ore fa", content: "mi sono iscritta a un corso di yoga. lo so che non c'entra niente con la dipendenza ma il coach mi ha detto che muovere il corpo aiuta. boh, vedremo. ma intanto sono uscita di casa e questo per me è già qualcosa.", likes: 55, liked: false, comments: [] },

      { id: 219, author: "Federico R.", avatar: "F", time: "21 ore fa", content: "questa è la prima community dove non mi sento fuori posto. di solito sui social mi sento sempre a disagio. qui si parla di cose vere, senza filtri. è strano ma è casa.", likes: 88, liked: false, comments: [
        { id: 6023, author: "Chiara B.", avatar: "C", content: "hai detto benissimo. casa. è esattamente così che la sento", time: "20 ore fa", likes: 21, liked: false },
        { id: 6024, author: "Ilaria V.", avatar: "I", content: "sono solo 2 settimane che sono qui e anch'io sento questa cosa. è strano ma è reale", time: "19 ore fa", likes: 12, liked: false },
        { id: 6025, author: "Beatrice C.", avatar: "B", content: "ci sei arrivato. e noi ci siamo. benvenuto davvero 🙏", time: "18 ore fa", likes: 10, liked: false },
      ]},

      { id: 220, author: "Matteo G.", avatar: "M", time: "22 ore fa", content: "l'app mi ha aiutato tantissimo avere tutto in un posto. il percorso, la chat col coach, il diario. prima avevo mille cose sparse e mi perdevo. adesso ho un filo.", likes: 62, liked: false, comments: [] },

      { id: 221, author: "Serena C.", avatar: "S", time: "23 ore fa", content: "stamattina mi sono guardata allo specchio e per la prima volta da anni non ho visto solo i casini che ho combinato. ho visto una persona che sta cercando di cambiare. piccolo ma enorme per me.", likes: 118, liked: false, comments: [
        { id: 6026, author: "Emanuele T.", avatar: "E", content: "questo è uno dei momenti chiave del percorso, quando smetti di vederti solo con gli occhi del passato. vai avanti 🔥", time: "22 ore fa", likes: 28, liked: false },
        { id: 6027, author: "Dario N.", avatar: "D", content: "mi hai fatto venire i brividi. grazie per aver condiviso questa cosa così intima", time: "21 ore fa", likes: 19, liked: false },
        { id: 6028, author: "Nicola P.", avatar: "N", content: "quella persona che vedi nello specchio è reale. più reale di tutto il resto", time: "20 ore fa", likes: 15, liked: false },
      ]},

      { id: 222, author: "Luca B.", avatar: "L", time: "1 giorno fa", content: "ho paura di non essere abbastanza forte. ogni volta che sto bene penso che durerà poco. come se non meritassi di stare bene per troppo tempo.", likes: 69, liked: false, comments: [] },

      { id: 223, author: "Giulia T.", avatar: "G", time: "1 giorno fa", content: "sinceramente? certi contenuti del percorso li trovo ripetitivi. le tecniche le ho sentite mille volte. la cosa che funziona davvero è il coach e questa community. il resto boh.", likes: 43, liked: false, comments: [] },

      { id: 224, author: "Roberto F.", avatar: "R", time: "1 giorno fa", content: "oggi sono andato dal medico. da solo. senza che nessuno mi obbligasse. e gli ho detto la verità sulla mia situazione. tutta. non avevo mai fatto questa cosa. tremavo ma l'ho fatto.", likes: 97, liked: false, comments: [
        { id: 6029, author: "Serena C.", avatar: "S", content: "roberto questo è ENORME. ci vuole un coraggio che pochi hanno. applausi seri 👏👏", time: "23 ore fa", likes: 26, liked: false },
        { id: 6030, author: "Simona L.", avatar: "S", content: "il primo che riesce a dirlo al medico fa la cosa più difficile. da lì in poi è tutto più facile, anche se sembra impossibile adesso", time: "22 ore fa", likes: 18, liked: false },
      ]},

      { id: 225, author: "Cristina M.", avatar: "C", time: "1 giorno fa", content: "voglio tornare a essere la persona che ero prima. o forse voglio diventare una versione migliore. non lo so ancora bene. ma so che non voglio restare quello che sono adesso.", likes: 71, liked: false, comments: [] },

      { id: 226, author: "Enrico S.", avatar: "E", time: "1 giorno fa", content: "ieri ho visto che uno che era qui da tanto ha raggiunto i 6 mesi. non lo conosco di persona ma mi ha fatto venire voglia di andare avanti. strano come le storie degli altri ti diano forza.", likes: 84, liked: false, comments: [
        { id: 6031, author: "Federico R.", avatar: "F", content: "è esatto quello che sento anch'io. le storie qui mi motivano più di qualsiasi discorso motivazionale su internet", time: "23 ore fa", likes: 22, liked: false },
        { id: 6032, author: "Luca B.", avatar: "L", content: "anche io guardo i traguardi degli altri e penso: vabbè se ce l'ha fatta lui... ci provo anch'io", time: "22 ore fa", likes: 17, liked: false },
        { id: 6033, author: "Giulia T.", avatar: "G", content: "questo è il motivo per cui vale la pena condividere anche le piccole cose. non sai mai chi stai aiutando", time: "21 ore fa", likes: 13, liked: false },
      ]},

      { id: 227, author: "Miriam D.", avatar: "M", time: "1 giorno fa", content: "il supporto del coach nel momento di crisi alle 11 di sera ha fatto la differenza. non me lo aspettavo che ci fosse davvero qualcuno. invece c'era. grazie.", likes: 76, liked: false, comments: [] },

      { id: 228, author: "Salvatore B.", avatar: "S", time: "2 giorni fa", content: "61 giorni. quando ero a zero pensavo che 60 fosse un numero impossibile. adesso sono qui e mi sembra ancora un sogno. ma è reale. sono reale.", likes: 107, liked: false, comments: [] },

      { id: 229, author: "Annalisa R.", avatar: "A", time: "2 giorni fa", content: "domani ho una cena con persone che non vedevo da anni. persone di quando stavo male. ho paura di come mi vedranno, di cosa penseranno. ho paura di chi ero.", likes: 58, liked: false, comments: [
        { id: 6034, author: "Roberto F.", avatar: "R", content: "ti capisco alla follia. ma quelle persone vedranno una che ha fatto una cosa difficilissima. anche se non lo sanno, tu lo sai.", time: "1 giorno fa", likes: 19, liked: false },
        { id: 6035, author: "Cristina M.", avatar: "C", content: "vai e poi ci racconti. siamo qui 💙", time: "1 giorno fa", likes: 14, liked: false },
        { id: 6036, author: "Enrico S.", avatar: "E", content: "la versione di te di adesso è già diversa da chi eri. chi ti vuole bene lo vedrà.", time: "1 giorno fa", likes: 11, liked: false },
      ]},

      { id: 230, author: "Piero V.", avatar: "P", time: "2 giorni fa", content: "ho fatto tutti e 3 i questionari di valutazione e onestamente mi sembrano un po' generici. la parte umana con il coach è molto più utile. ma forse sono io che mi aspetto troppo.", likes: 36, liked: false, comments: [] },

      { id: 231, author: "Rosaria T.", avatar: "R", time: "2 giorni fa", content: "oggi ho detto no alla mia dipendenza e sì a una passeggiata. sembra poco ma per me è stato scegliere. scegliere me stessa.", likes: 83, liked: false, comments: [] },

      { id: 232, author: "Davide M.", avatar: "D", time: "2 giorni fa", content: "sono a pezzi oggi ma non ho ceduto. è una di quelle giornate dove vorresti arrenderti ma non lo fai. non so da dove mi viene la forza ma c'è. ancora.", likes: 93, liked: false, comments: [
        { id: 6037, author: "Miriam D.", avatar: "M", content: "quelle giornate sono le più difficili e le più importanti. le stai attraversando. bravissimo 🔥", time: "2 giorni fa", likes: 24, liked: false },
        { id: 6038, author: "Salvatore B.", avatar: "S", content: "la forza viene dal fatto che hai scelto di esserci. anche oggi. anche a pezzi.", time: "2 giorni fa", likes: 20, liked: false },
        { id: 6039, author: "Annalisa R.", avatar: "A", content: "domani ti sveglierai e saprai che ieri hai vinto. tienitelo stretto", time: "2 giorni fa", likes: 16, liked: false },
      ]},

      { id: 233, author: "Teresa G.", avatar: "T", time: "2 giorni fa", content: "a volte basta sapere che ci sono altre persone che capiscono. non serve nemmeno che parlino. solo sapere. questa community mi dà questo e non è poco.", likes: 65, liked: false, comments: [] },

      { id: 234, author: "Carmine L.", avatar: "C", time: "3 giorni fa", content: "il percorso mi ha ridato una struttura alla giornata. prima vivevo in un caos totale. adesso ho degli orari, delle routine. sembra roba da niente ma per me ha cambiato tutto.", likes: 72, liked: false, comments: [] },

      { id: 235, author: "Giuseppina M.", avatar: "G", time: "3 giorni fa", content: "giorno 1. lo scrivo qua perché se lo dico ad alta voce forse diventa più reale. giorno 1. eccomi.", likes: 121, liked: false, comments: [] },

      { id: 236, author: "Rocco F.", avatar: "R", time: "3 giorni fa", content: "ogni sera prima di dormire arriva quella voce che dice 'tanto ricadi'. ho paura che un giorno quella voce abbia ragione. come la fate tacere voi?", likes: 68, liked: false, comments: [
        { id: 6040, author: "Davide M.", avatar: "D", content: "quella voce non smette subito ma diventa più silenziosa col tempo. ci vuole un po' ma succede. resisti.", time: "3 giorni fa", likes: 22, liked: false },
        { id: 6041, author: "Teresa G.", avatar: "T", content: "io rispondo a quella voce con i fatti: 'oggi non l'ho fatto'. un giorno alla volta. la voce parla di futuro, tu rispondi con oggi.", time: "3 giorni fa", likes: 29, liked: false },
        { id: 6042, author: "Carmine L.", avatar: "C", content: "la voce mente. lo so che è difficile crederci ma mente. tu sei qui e questo vale tutto.", time: "3 giorni fa", likes: 18, liked: false },
      ]},

      { id: 237, author: "Monica C.", avatar: "M", time: "3 giorni fa", content: "non capisco perché certi giorni è tutto ok e poi senza motivo arriva il buio. non c'è stato niente di particolare. il craving arriva quando vuole lui e non capisco come fermarlo.", likes: 52, liked: false, comments: [] },

      { id: 238, author: "Pasquale D.", avatar: "P", time: "4 giorni fa", content: "ho smesso di nascondermi. non ho ancora detto tutto a tutti ma non mi vergogno più di fare questo percorso. anzi, quasi quasi sono fiero.", likes: 86, liked: false, comments: [] },

      { id: 239, author: "Nunzia T.", avatar: "N", time: "4 giorni fa", content: "voglio vedere mio figlio crescere con una madre presente. questa è la mia motivazione. quando voglio cedere penso a lui. funziona ogni volta.", likes: 143, liked: false, comments: [] },
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
    setAllPosts(prev => prev.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
  };

  const toggleCommentLike = (postId: number, commentId: number) => {
    setAllPosts(prev => prev.map(p => p.id === postId ? {
      ...p, comments: p.comments.map(c => c.id === commentId ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 } : c)
    } : p));
  };

  const publishPost = () => {
    if (!newPost.trim()) return;
    const post: Post & { communityId: string; communityName: string; zoneId?: string } = {
      id: Date.now(), author: "Tu", avatar: "T", time: "Adesso", content: newPost.trim(),
      likes: 0, liked: false, comments: [], communityId: "community",
      communityName: "Community", zoneId: undefined,
    };
    setAllPosts(prev => [post, ...prev]);
    setNewPost("");
    trackEvent("post_published", "community", { length: post.content.length });
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
