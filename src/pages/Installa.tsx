import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { Download, Smartphone, Check, Share, Plus, ArrowDown, Phone } from "lucide-react";

const Installa = () => {
  const { isInstallable, isInstalled, isIOS, installApp } = usePWAInstall();

  const handleInstall = async () => {
    await installApp();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container max-w-2xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-6">
              <span className="text-primary-foreground font-bold text-3xl">S</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Installa StandUpWay
            </h1>
            <p className="text-lg text-muted-foreground">
              Accedi rapidamente all'app dalla tua home screen
            </p>
          </div>

          {/* Status */}
          {isInstalled ? (
            <div className="p-8 rounded-2xl bg-green-500/10 border border-green-500/30 text-center mb-8">
              <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2 text-green-500">App già installata!</h2>
              <p className="text-muted-foreground">
                StandUpWay è già sulla tua home screen. Aprila da lì per la migliore esperienza.
              </p>
            </div>
          ) : isInstallable ? (
            <div className="p-8 rounded-2xl bg-card border border-border text-center mb-8">
              <Smartphone className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-4">Pronto per l'installazione</h2>
              <Button variant="cta" size="xl" onClick={handleInstall}>
                <Download className="w-5 h-5" />
                Installa ora
              </Button>
            </div>
          ) : isIOS ? (
            <div className="p-8 rounded-2xl bg-card border border-border mb-8">
              <h2 className="text-xl font-semibold mb-6 text-center">Come installare su iPhone/iPad</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <span className="font-semibold">1</span>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Tocca il pulsante Condividi</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Share className="w-4 h-4" /> nella barra di Safari
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <span className="font-semibold">2</span>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Scorri e tocca "Aggiungi alla schermata Home"</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Plus className="w-4 h-4" /> potrebbe essere necessario scorrere
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <span className="font-semibold">3</span>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Tocca "Aggiungi"</p>
                    <p className="text-sm text-muted-foreground">L'app apparirà sulla tua home screen</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-card border border-border mb-8">
              <h2 className="text-xl font-semibold mb-6 text-center">Come installare su Android</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <span className="font-semibold">1</span>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Tocca il menu del browser</p>
                    <p className="text-sm text-muted-foreground">I tre puntini in alto a destra</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <span className="font-semibold">2</span>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Seleziona "Installa app" o "Aggiungi a schermata Home"</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <ArrowDown className="w-4 h-4" /> potrebbe apparire anche un banner
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <span className="font-semibold">3</span>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Conferma l'installazione</p>
                    <p className="text-sm text-muted-foreground">L'app sarà disponibile tra le tue app</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Benefits */}
          <div className="grid sm:grid-cols-3 gap-4 mb-12">
            <div className="p-5 rounded-xl bg-secondary/50 text-center">
              <Smartphone className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium">Accesso rapido</p>
            </div>
            <div className="p-5 rounded-xl bg-secondary/50 text-center">
              <Download className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium">Funziona offline</p>
            </div>
            <div className="p-5 rounded-xl bg-secondary/50 text-center">
              <Check className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium">Nessuno store</p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center p-8 rounded-2xl bg-secondary/50">
            <h3 className="text-lg font-semibold mb-3">Hai bisogno di aiuto?</h3>
            <p className="text-muted-foreground mb-6 text-sm">
              Il nostro team di supporto è sempre disponibile per te.
            </p>
            <Button variant="cta" size="lg">
              <Phone className="w-4 h-4" />
              Parla con il Supporto
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Installa;
