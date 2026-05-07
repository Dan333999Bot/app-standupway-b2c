import { BottomNav } from "@/components/BottomNav";
import { HeaderActions } from "@/components/HeaderActions";
import { BackButton } from "@/components/BackButton";
import { InSedeEventi } from "@/components/insede/InSedeEventi";

const InSede = () => {
  return (
    <div className="min-h-screen bg-surface-0 pb-24">
      <header className="bg-surface-1 border-b border-border/40 px-4 py-4 safe-area-top shadow-[var(--shadow-sm)]">
        <div className="flex items-center gap-3">
          <BackButton />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">In Sede</h1>
            <p className="text-sm text-muted-foreground mt-1">Incontri ed eventi nelle nostre sedi</p>
          </div>
          <HeaderActions />
        </div>
      </header>

      <div className="px-4 py-4">
        <InSedeEventi />
      </div>

      <BottomNav />
    </div>
  );
};

export default InSede;
