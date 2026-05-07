import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Community from "./pages/Community";
import CommunityHub from "./pages/CommunityHub";
import Percorsi from "./pages/Percorsi";
import PercorsoPreventivo from "./pages/PercorsoPreventivo";
import PercorsoDetail from "./pages/PercorsoDetail";
import Attivita from "./pages/Attivita";
import AttivitaEventoDetail from "./pages/AttivitaEventoDetail";
import PercorsoQuestionario from "./pages/PercorsoQuestionario";
import PercorsoReport from "./pages/PercorsoReport";
import PercorsoVisite from "./pages/PercorsoVisite";
import PercorsoObiettivi from "./pages/PercorsoObiettivi";
import PercorsoDiario from "./pages/PercorsoDiario";
import Corsi from "./pages/Corsi";
import InSede from "./pages/InSede";
import EventoDetail from "./pages/EventoDetail";
import EventoCheckout from "./pages/EventoCheckout";
import AttivitaDetail from "./pages/AttivitaDetail";
import CorsoDetail from "./pages/CorsoDetail";
import Supporto from "./pages/Supporto";
import Prenota from "./pages/Prenota";
import Servizi from "./pages/Servizi";
import Strumenti from "./pages/Strumenti";
import Autovalutazione from "./pages/Autovalutazione";
import Profilo from "./pages/Profilo";
import Ricevute from "./pages/Ricevute";
import Installa from "./pages/Installa";
import Invita from "./pages/Invita";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/app" element={<Navigate to="/home" replace />} />
          <Route path="/pro" element={<Navigate to="/home" replace />} />
          <Route path="/azienda" element={<Navigate to="/home" replace />} />

          <Route path="/community" element={<CommunityHub />} />
          <Route path="/community/feed" element={<Community />} />
          <Route path="/percorsi" element={<Percorsi />} />
          <Route path="/azienda/dashboard" element={<Navigate to="/home" replace />} />
          <Route path="/percorsi/:id/questionario" element={<PercorsoQuestionario />} />
          <Route path="/percorsi/:id" element={<PercorsoDetail />} />
          <Route path="/percorso/preventivo" element={<PercorsoPreventivo />} />
          <Route path="/percorso/report" element={<PercorsoReport />} />
          <Route path="/percorso/visite" element={<PercorsoVisite />} />
          <Route path="/percorso/obiettivi" element={<PercorsoObiettivi />} />
          <Route path="/percorso/diario" element={<PercorsoDiario />} />
          <Route path="/attivita" element={<Attivita />} />
          <Route path="/attivita/eventi/:id" element={<AttivitaEventoDetail />} />
          <Route path="/corsi" element={<Corsi />} />
          <Route path="/insede" element={<InSede />} />
          <Route path="/eventi/:id" element={<EventoDetail />} />
          <Route path="/eventi/:id/checkout" element={<EventoCheckout />} />
          <Route path="/attivita/old/:id" element={<AttivitaDetail />} />
          <Route path="/corso/:id" element={<CorsoDetail />} />
          <Route path="/supporto" element={<Supporto />} />
          <Route path="/prenota" element={<Prenota />} />
          <Route path="/servizi" element={<Servizi />} />
          <Route path="/strumenti" element={<Strumenti />} />
          <Route path="/autovalutazione" element={<Autovalutazione />} />
          <Route path="/profilo" element={<Profilo />} />
          <Route path="/ricevute" element={<Ricevute />} />
          <Route path="/diario" element={<Navigate to="/percorso/diario" replace />} />
          <Route path="/eventi" element={<Navigate to="/community" replace />} />
          <Route path="/installa" element={<Installa />} />
          <Route path="/invita" element={<Invita />} />
          <Route path="/token" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
