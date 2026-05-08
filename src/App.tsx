import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pagine pubbliche (no auth)
import Login from "./pages/Login";
import Percorsi from "./pages/Percorsi";
import PercorsoDetail from "./pages/PercorsoDetail";
import PercorsoQuestionario from "./pages/PercorsoQuestionario";
import PrenotaCalendario from "./pages/PrenotaCalendario";
import PrenotaRegistrazione from "./pages/PrenotaRegistrazione";
import PrenotaVerifica from "./pages/PrenotaVerifica";
import Installa from "./pages/Installa";
import Invita from "./pages/Invita";
import NotFound from "./pages/NotFound";

// Pagine protette (auth required)
import Home from "./pages/Home";
import Community from "./pages/Community";
import CommunityHub from "./pages/CommunityHub";
import PercorsoPreventivo from "./pages/PercorsoPreventivo";
import PercorsoReport from "./pages/PercorsoReport";
import PercorsoVisite from "./pages/PercorsoVisite";
import PercorsoObiettivi from "./pages/PercorsoObiettivi";
import PercorsoDiario from "./pages/PercorsoDiario";
import Attivita from "./pages/Attivita";
import AttivitaEventoDetail from "./pages/AttivitaEventoDetail";
import AttivitaDetail from "./pages/AttivitaDetail";
import Corsi from "./pages/Corsi";
import CorsoDetail from "./pages/CorsoDetail";
import InSede from "./pages/InSede";
import EventoDetail from "./pages/EventoDetail";
import EventoCheckout from "./pages/EventoCheckout";
import Supporto from "./pages/Supporto";
import Prenota from "./pages/Prenota";
import Thankyou from "./pages/Thankyou";
import Servizi from "./pages/Servizi";
import Strumenti from "./pages/Strumenti";
import Autovalutazione from "./pages/Autovalutazione";
import Profilo from "./pages/Profilo";
import Ricevute from "./pages/Ricevute";
import Riepilogo from "./pages/Riepilogo";

const queryClient = new QueryClient();

// Shorthand per wrappare le route protette senza ripetere il componente
const P = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* ── Redirect di default ── */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/app" element={<Navigate to="/home" replace />} />
            <Route path="/pro" element={<Navigate to="/home" replace />} />
            <Route path="/azienda" element={<Navigate to="/home" replace />} />
            <Route path="/azienda/dashboard" element={<Navigate to="/home" replace />} />
            <Route path="/token" element={<Navigate to="/home" replace />} />
            <Route path="/diario" element={<Navigate to="/percorso/diario" replace />} />
            <Route path="/eventi" element={<Navigate to="/community" replace />} />

            {/* ── ZONA PUBBLICA — nessun login richiesto ── */}
            <Route path="/login" element={<Login />} />
            <Route path="/percorsi" element={<Percorsi />} />
            <Route path="/percorsi/:id" element={<PercorsoDetail />} />
            <Route path="/percorsi/:id/questionario" element={<PercorsoQuestionario />} />
            <Route path="/prenota/calendario" element={<PrenotaCalendario />} />
            <Route path="/prenota/registrazione" element={<PrenotaRegistrazione />} />
            <Route path="/prenota/verifica" element={<PrenotaVerifica />} />
            <Route path="/installa" element={<Installa />} />
            <Route path="/invita" element={<Invita />} />

            {/* ── ZONA PROTETTA — login richiesto ── */}
            <Route path="/home" element={<P><Home /></P>} />

            <Route path="/community" element={<P><CommunityHub /></P>} />
            <Route path="/community/feed" element={<P><Community /></P>} />

            <Route path="/percorso/preventivo" element={<P><PercorsoPreventivo /></P>} />
            <Route path="/percorso/report" element={<P><PercorsoReport /></P>} />
            <Route path="/percorso/visite" element={<P><PercorsoVisite /></P>} />
            <Route path="/percorso/obiettivi" element={<P><PercorsoObiettivi /></P>} />
            <Route path="/percorso/diario" element={<P><PercorsoDiario /></P>} />

            <Route path="/attivita" element={<P><Attivita /></P>} />
            <Route path="/attivita/eventi/:id" element={<P><AttivitaEventoDetail /></P>} />
            <Route path="/attivita/old/:id" element={<P><AttivitaDetail /></P>} />

            <Route path="/corsi" element={<P><Corsi /></P>} />
            <Route path="/corso/:id" element={<P><CorsoDetail /></P>} />

            <Route path="/insede" element={<P><InSede /></P>} />
            <Route path="/eventi/:id" element={<P><EventoDetail /></P>} />
            <Route path="/eventi/:id/checkout" element={<P><EventoCheckout /></P>} />

            <Route path="/supporto" element={<P><Supporto /></P>} />
            <Route path="/prenota" element={<P><Prenota /></P>} />
            <Route path="/thankyou" element={<P><Thankyou /></P>} />

            <Route path="/servizi" element={<P><Servizi /></P>} />
            <Route path="/strumenti" element={<P><Strumenti /></P>} />
            <Route path="/autovalutazione" element={<P><Autovalutazione /></P>} />
            <Route path="/profilo" element={<P><Profilo /></P>} />
            <Route path="/ricevute" element={<P><Ricevute /></P>} />
            <Route path="/riepilogo" element={<P><Riepilogo /></P>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
