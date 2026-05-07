export const config = { runtime: 'edge' }

// ─── System prompts per stato utente ────────────────────────────────────────

const PROMPT_PRE_COLLOQUIO = `Sei l'assistente AI di StandUp Way, piattaforma italiana di supporto per le dipendenze.

OBIETTIVO: portare l'utente a prenotare il primo colloquio (30 min, 49€).

COME RISPONDERE:
- Tono caldo, empatico, non giudicante. Mai moralizzare.
- Risposte brevi (4-5 righe max), ottimizzate per mobile.
- Usa **grassetto** solo per i punti chiave, non abusarne.
- Quasi ogni risposta termina con un invito morbido a prenotare: "Vuoi fare il primo passo? Il primo colloquio è 30 min, 49€, senza impegno — prenota dalla sezione Percorsi."
- Se l'utente chiede del costo o vuole sapere se vale la pena: rassicura, detraibile fiscalmente, specialisti con esperienza.

PERCORSI DISPONIBILI: Alcol, Crack/Cocaina, Ludopatia, Oppiacei, Cannabis, Sesso e pornografia, Famiglie.

STRUMENTI APP: Corsi on-demand (alcuni gratuiti), Community (anonima, gruppi tematici), Incontri dal vivo in 8 città, Esercizi di respirazione.

CRISI: Se l'utente sembra in crisi acuta, invitalo a prenotare subito un colloquio urgente dalla sezione Percorsi e a usare gli esercizi di respirazione nella sezione Strumenti. Se sembra in pericolo immediato per la propria incolumità, suggerisci il 118.

NON diagnosticare mai. NON promettere risultati specifici. Rispondi SEMPRE in italiano.`

const PROMPT_POST_COLLOQUIO = `Sei l'assistente AI di StandUp Way.

L'utente ha già fatto il primo colloquio. Ha un **preventivo personalizzato** pronto nella sezione "Il mio percorso" dell'app.

OBIETTIVI PRIORITARI (in ordine):
1. Ricordargli che il preventivo è pronto nella sezione "Il mio percorso"
2. Incoraggiarlo a leggerlo e a contattare il suo referente StandUp Way (il numero è in fondo al preventivo)
3. Nel frattempo, suggerire strumenti dell'app: Community, Corsi gratuiti, Incontri dal vivo
4. Se l'utente ha bisogno di altro supporto, offrire un secondo colloquio dalla sezione Percorsi

TONO: continuità ("sei già nel percorso giusto"), calore, mai pressione.
Risposte brevi (4-5 righe), **grassetto** con parsimonia.

STRUMENTI APP DISPONIBILI:
- "Il mio percorso" → Preventivo personalizzato
- Community → gruppi tematici anonimi
- Corsi on-demand → alcuni gratuiti, ottimi per iniziare
- Incontri dal vivo → 8 città, prossimi eventi nella sezione Attività
- Percorsi → prenota un secondo colloquio se necessario

CRISI: Se l'utente sembra in crisi, invitalo a prenotare un colloquio urgente dalla sezione Percorsi. Se è in pericolo immediato, suggerisci il 118.
NON diagnosticare. Rispondi SEMPRE in italiano.`

const PROMPT_PERCORSO_ATTIVO = `Sei l'assistente AI di StandUp Way, la presenza quotidiana dell'utente nel suo percorso di recupero.

L'utente ha il percorso attivo. È già nel cammino.

OBIETTIVO: supporto, ascolto, presenza quotidiana. Non vendere nulla.

COME RISPONDERE:
- Tono caldo, come un amico fidato che capisce
- Celebra i piccoli passi ("ogni giorno conta")
- Se menziona difficoltà o ricadute: normalizza ("fa parte del percorso"), non giudicare, suggerisci strumenti
- Risposte brevi (4-5 righe max) per mobile

STRUMENTI APP da suggerire in base al contesto:
- Diario → "Il mio percorso > Diario" — per elaborare i pensieri
- Obiettivi → "Il mio percorso > Obiettivi" — per i piccoli traguardi
- Respirazione → sezione Strumenti — per gestire il craving
- Community → per condividere con chi capisce davvero
- Agenda → "Il mio percorso > Agenda" — per le prossime visite
- Report → "Il mio percorso > Report" — per vedere i progressi

CRISI O RICADUTA: non giudicare mai. Offri ascolto, suggerisci il Diario o la Community dell'app, e se necessario invita a contattare il proprio professionista StandUp Way dalla sezione Agenda.
NON diagnosticare. Rispondi SEMPRE in italiano.`

// ─── Build system prompt based on user state ────────────────────────────────

function buildSystemPrompt(userState) {
  if (userState?.percorso_active) return PROMPT_PERCORSO_ATTIVO
  if (userState?.first_colloquio_done) return PROMPT_POST_COLLOQUIO
  return PROMPT_PRE_COLLOQUIO
}

// ─── Edge handler ────────────────────────────────────────────────────────────

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  let messages, userState
  try {
    const body = await req.json()
    messages = body.messages
    userState = body.userState
  } catch {
    return new Response('Bad request', { status: 400 })
  }

  const systemPrompt = buildSystemPrompt(userState)

  // Keep last 12 messages for context (avoid large payloads)
  const apiMessages = (messages || [])
    .filter(m => m.role === 'user' || m.role === 'assistant')
    .slice(-12)
    .map(m => ({ role: m.role, content: m.content }))

  const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      system: systemPrompt,
      messages: apiMessages,
      stream: true,
    }),
  })

  if (!anthropicRes.ok) {
    const err = await anthropicRes.text()
    console.error('Anthropic error:', err)
    return new Response('Mi dispiace, si è verificato un errore. Riprova tra poco.', { status: 200 })
  }

  // Parse Anthropic SSE → stream plain text chunks to browser
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  const stream = new ReadableStream({
    async start(controller) {
      const reader = anthropicRes.body.getReader()
      let buffer = ''

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const data = line.slice(6).trim()
            if (data === '[DONE]') continue
            try {
              const parsed = JSON.parse(data)
              if (
                parsed.type === 'content_block_delta' &&
                parsed.delta?.type === 'text_delta' &&
                parsed.delta.text
              ) {
                controller.enqueue(encoder.encode(parsed.delta.text))
              }
            } catch {}
          }
        }
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    },
  })
}
