import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const APP_CACHE_VERSION = "standupway-cache-reset-2026-05-08-v6";

// Meta Pixel
(function (f: Window & typeof globalThis, b: Document, e: string, v: string) {
  if ((f as any).fbq) return;
  const n: any = ((f as any).fbq = function (...args: any[]) {
    n.callMethod ? n.callMethod(...args) : n.queue.push(args);
  });
  if (!(f as any)._fbq) (f as any)._fbq = n;
  n.push = n; n.loaded = true; n.version = "2.0"; n.queue = [];
  const t = b.createElement(e) as HTMLScriptElement;
  t.async = true; t.src = v;
  const s = b.getElementsByTagName(e)[0];
  s.parentNode!.insertBefore(t, s);
})(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
(window as any).fbq("init", "4177186352363051");
(window as any).fbq("track", "PageView");

const resetStalePreviewCache = async () => {
  if (!("serviceWorker" in navigator)) return;

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
