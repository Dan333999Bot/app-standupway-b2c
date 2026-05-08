import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const PIXEL_ID = "4177186352363051";
const ACCESS_TOKEN = Deno.env.get("META_ACCESS_TOKEN") ?? "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function sha256(value: string): Promise<string> {
  const data = new TextEncoder().encode(value.trim().toLowerCase());
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { event_name, event_id, email, value, currency, event_source_url, client_ip, client_user_agent } = await req.json();

    const user_data: Record<string, string> = {
      client_ip_address: client_ip ?? "",
      client_user_agent: client_user_agent ?? "",
    };

    if (email) user_data.em = await sha256(email);

    const payload = {
      data: [{
        event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id,
        event_source_url,
        action_source: "website",
        user_data,
        custom_data: {
          value,
          currency: currency ?? "EUR",
          content_name: "Colloquio 30min",
          content_type: "product",
        },
      }],
    };

    const res = await fetch(
      `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const result = await res.json();
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
