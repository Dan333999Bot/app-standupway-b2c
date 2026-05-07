import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface BackButtonProps {
  fallback?: string;
  className?: string;
}

/**
 * Universal back button. Goes back in browser history; if there is no
 * meaningful history, falls back to /home (or a custom fallback).
 */
export const BackButton = ({ fallback = "/home", className }: BackButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    // history.length > 2 → there is a real previous entry inside the SPA
    if (window.history.length > 1 && location.key !== "default") {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Indietro"
      className={
        className ??
        "w-9 h-9 rounded-lg bg-secondary/50 flex items-center justify-center hover:bg-secondary transition-colors flex-shrink-0"
      }
    >
      <ArrowLeft className="w-4 h-4 text-foreground" />
    </button>
  );
};
