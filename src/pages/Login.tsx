import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";

const Login = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from ?? "/home";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signIn(email.trim(), password);
    setLoading(false);
    if (error) {
      setError("Email o password non corretti. Riprova.");
    } else {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 safe-area-top">
      {/* Logo / Brand */}
      <div className="mb-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-3 shadow-lg">
          <span className="text-primary-foreground font-black text-2xl">S</span>
        </div>
        <h1 className="text-xl font-bold text-foreground">StandUpWay</h1>
        <p className="text-sm text-muted-foreground mt-1">Accedi al tuo percorso</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-surface-1 border border-border/40 rounded-2xl p-6 shadow-sm space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Email</label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nome@email.com"
              required
              className="w-full bg-surface-0 border border-border/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-surface-0 border border-border/50 rounded-xl px-4 py-3 pr-11 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <Button type="submit" disabled={loading || !email || !password} className="w-full" size="lg">
            {loading
              ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Accesso in corso…</>
              : <>Accedi <ArrowRight className="w-4 h-4 ml-1" /></>
            }
          </Button>
        </form>

        <div className="text-center pt-1">
          <p className="text-xs text-muted-foreground">
            Non hai ancora un account?{" "}
            <Link to="/percorsi" className="text-primary font-semibold underline-offset-2 hover:underline">
              Inizia il percorso
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
