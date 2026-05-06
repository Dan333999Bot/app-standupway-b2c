import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const APP_CACHE_VERSION = "standupway-cache-reset-2026-05-06";

const resetStalePreviewCache = async () => {
  if (!("serviceWorker" in navigator) || !window.location.hostname.includes("lovable")) return;

  const resetKey = `${APP_CACHE_VERSION}:${window.location.pathname}`;
  if (sessionStorage.getItem(resetKey)) return;

  const registrations = await navigator.serviceWorker.getRegistrations();
  if (!registrations.length) return;

  await Promise.all(registrations.map((registration) => registration.unregister()));
  if ("caches" in window) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
  }

  sessionStorage.setItem(resetKey, "done");
  window.location.reload();
};

resetStalePreviewCache().catch(() => undefined);

createRoot(document.getElementById("root")!).render(<App />);
